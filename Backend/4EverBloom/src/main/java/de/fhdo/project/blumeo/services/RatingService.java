package de.fhdo.project.blumeo.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.fhdo.project.blumeo.dto.rating.RatingRequestDTO;
import de.fhdo.project.blumeo.dto.rating.RatingResponseDTO;
import de.fhdo.project.blumeo.entity.order.Order;
import de.fhdo.project.blumeo.entity.rating.Rating;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.repository.order.OrderRepository;
import de.fhdo.project.blumeo.repository.rating.RatingRepository;
import de.fhdo.project.blumeo.repository.user.UserRepository;

/**
 * Service layer for managing ratings.
 * Handles business logic for rating operations.
 * 
 * @author Blumeo Team
 * @version 1.0
 */
@Service
@Transactional
public class RatingService {
    
    private final RatingRepository ratingRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    
    public RatingService(
            RatingRepository ratingRepository,
            OrderRepository orderRepository,
            UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }
    
    // /**
    //  * Save a new rating.
    //  * 
    //  * @param requestDTO The rating request data
    //  * @return RatingResponseDTO with the created rating
    //  * @throws RuntimeException if order or customer not found, or if already rated
    //  */
    public RatingResponseDTO saveRating(RatingRequestDTO requestDTO) {
        // Verify order exists
        Order order = orderRepository.findById(requestDTO.getOrderId())
            .orElseThrow(() -> new RuntimeException(
                "Order not found with id: " + requestDTO.getOrderId()));
        
        // Verify customer exists
        User customer = userRepository.findById(requestDTO.getCustomerId())
            .orElseThrow(() -> new RuntimeException(
                "Customer not found with id: " + requestDTO.getCustomerId()));
        
        // Check if order belongs to this customer
        if (!order.getCustomer().getId().equals(requestDTO.getCustomerId())) {
            throw new RuntimeException("This order does not belong to the customer");
        }
        
        // Check if customer already rated this order
        if (ratingRepository.existsByOrder_OrderIdAndCustomer_Id(
                requestDTO.getOrderId(), 
                requestDTO.getCustomerId())) {
            throw new RuntimeException("Customer has already rated this order");
        }
        
        // Create and save rating
        Rating rating = new Rating();
        rating.setOrder(order);
        rating.setCustomer(customer);
        rating.setRatingScore(requestDTO.getRatingScore());
        rating.setReview(requestDTO.getReview());
        
        Rating savedRating = ratingRepository.save(rating);
        
        return convertToDTO(savedRating);
    }
    
    // /**
    //  * Update an existing rating.
    //  * 
    //  * @param ratingId The rating ID to update
    //  * @param requestDTO The updated rating data
    //  * @return RatingResponseDTO with the updated rating
    //  * @throws RuntimeException if rating not found
    //  */
    public RatingResponseDTO updateRating(Long ratingId, RatingRequestDTO requestDTO) {
        Rating rating = ratingRepository.findById(ratingId)
            .orElseThrow(() -> new RuntimeException(
                "Rating not found with id: " + ratingId));
        
        // Update fields
        rating.setRatingScore(requestDTO.getRatingScore());
        rating.setReview(requestDTO.getReview());
        
        Rating updatedRating = ratingRepository.save(rating);
        
        return convertToDTO(updatedRating);
    }
    
    // /**
    //  * Get rating by ID.
    //  * 
    //  * @param ratingId The rating ID
    //  * @return RatingResponseDTO
    //  * @throws RuntimeException if rating not found
    //  */
    public RatingResponseDTO getRatingById(Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
            .orElseThrow(() -> new RuntimeException(
                "Rating not found with id: " + ratingId));
        return convertToDTO(rating);
    }
    
    // /**
    //  * Get all ratings for a specific order.
    //  * 
    //  * @param orderId The order ID
    //  * @return List of RatingResponseDTO
    //  */
    @Transactional(readOnly = true)
    public List<RatingResponseDTO> getRatingsByOrderId(Long orderId) {
        List<Rating> ratings = ratingRepository.findByOrder_OrderId(orderId);
        return ratings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // /**
    //  * Get all ratings by a specific customer.
    //  * 
    //  * @param customerId The customer ID
    //  * @return List of RatingResponseDTO
    //  */
    @Transactional(readOnly = true)
    public List<RatingResponseDTO> getRatingsByCustomerId(Long customerId) {
        List<Rating> ratings = ratingRepository.findByCustomer_Id(customerId);
        return ratings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // /**
    //  * Get all ratings in the system.
    //  * 
    //  * @return List of RatingResponseDTO
    //  */
    @Transactional(readOnly = true)
    public List<RatingResponseDTO> getAllRatings() {
        List<Rating> ratings = ratingRepository.findAll();
        return ratings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // /**
    //  * Delete a rating by ID.
    //  * 
    //  * @param ratingId The rating ID to delete
    //  * @throws RuntimeException if rating not found
    //  */
    public void deleteRating(Long ratingId) {
        if (!ratingRepository.existsById(ratingId)) {
            throw new RuntimeException("Rating not found with id: " + ratingId);
        }
        ratingRepository.deleteById(ratingId);
    }
    
    // /**
    //  * Get average rating score for an order.
    //  * 
    //  * @param orderId The order ID
    //  * @return Average rating score (rounded to 1 decimal place)
    //  */
    @Transactional(readOnly = true)
    public Double getAverageRatingForOrder(Long orderId) {
        Double average = ratingRepository.getAverageRatingForOrder(orderId);
        return average != null ? Math.round(average * 10.0) / 10.0 : 0.0;
    }
    
    // /**
    //  * Get rating by order and customer.
    //  * 
    //  * @param orderId The order ID
    //  * @param customerId The customer ID
    //  * @return RatingResponseDTO or null if not found
    //  */
    @Transactional(readOnly = true)
    public RatingResponseDTO getRatingByOrderAndCustomer(Long orderId, Long customerId) {
        return ratingRepository.findByOrder_OrderIdAndCustomer_Id(orderId, customerId)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    // /**
    //  * Convert Rating entity to RatingResponseDTO.
    //  * 
    //  * @param rating The rating entity
    //  * @return RatingResponseDTO
    //  */
    private RatingResponseDTO convertToDTO(Rating rating) {
        return RatingResponseDTO.builder()
                .id(rating.getId())
                .orderId(rating.getOrder().getOrderId())
                .orderNumber("ORD-" + rating.getOrder().getOrderId())
                .customerId(rating.getCustomer().getId())
                .customerName(rating.getCustomer().getUsername())
                .ratingScore(rating.getRatingScore())
                .review(rating.getReview())
                .createdAt(rating.getCreatedAt())
                .updatedAt(rating.getUpdatedAt())
                .build();
    }
}