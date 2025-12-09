package de.fhdo.project.blumeo.repository.rating;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import de.fhdo.project.blumeo.entity.rating.Rating;

// /**
//  * Repository interface for Rating entity.
//  * Provides database access methods for rating operations.
//  * 
//  * @author Blumeo Team
//  * @version 1.0
//  */
@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    // /**
    //  * Find all ratings for a specific order.
    //  * 
    //  * @param orderId The order ID
    //  * @return List of ratings
    //  */
    List<Rating> findByOrder_OrderId(Long orderId);
    
    // /**
    //  * Find all ratings by a specific customer.
    //  * 
    //  * @param customerId The customer ID
    //  * @return List of ratings
    //  */
    List<Rating> findByCustomer_Id(Long customerId);
    
    // /**
    //  * Find rating by order ID and customer ID.
    //  * Used to check if a customer already rated an order.
    //  * 
    //  * @param orderId The order ID
    //  * @param customerId The customer ID
    //  * @return Optional containing the rating if found
    //  */
    Optional<Rating> findByOrder_OrderIdAndCustomer_Id(Long orderId, Long customerId);
    
    // /**
    //  * Check if a rating exists for a specific order and customer.
    //  * 
    //  * @param orderId The order ID
    //  * @param customerId The customer ID
    //  * @return true if rating exists, false otherwise
    //  */
    boolean existsByOrder_OrderIdAndCustomer_Id(Long orderId, Long customerId);
    
    // /**
    //  * Get average rating score for an order.
    //  * 
    //  * @param orderId The order ID
    //  * @return Average rating score or null if no ratings
    //  */
    @Query("SELECT AVG(r.ratingScore) FROM Rating r WHERE r.order.orderId = :orderId")
    Double getAverageRatingForOrder(@Param("orderId") Long orderId);
    
    // /**
    //  * Count total ratings for an order.
    //  * 
    //  * @param orderId The order ID
    //  * @return Count of ratings
    //  */
    Long countByOrder_OrderId(Long orderId);
    
    // /**
    //  * Find top N highest rated orders.
    //  * Useful for displaying popular products.
    //  * 
    //  * @return List of order IDs with their average ratings
    //  */
        @Query("SELECT r.order.orderId, AVG(r.ratingScore) as avgRating " +
            "FROM Rating r " +
            "GROUP BY r.order.orderId " +
            "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedOrders();
    
    // /**
    //  * Find ratings by score.
    //  * 
    //  * @param score The rating score (1-5)
    //  * @return List of ratings with the specified score
    //  */
    List<Rating> findByRatingScore(Integer score);
    
    // /**
    //  * Find all ratings with reviews (non-null review text).
    //  * 
    //  * @return List of ratings with reviews
    //  */
    @Query("SELECT r FROM Rating r WHERE r.review IS NOT NULL AND r.review != ''")
    List<Rating> findAllWithReviews();
}