package de.fhdo.project.blumeo.controller.rating;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.fhdo.project.blumeo.dto.rating.RatingRequestDTO;
import de.fhdo.project.blumeo.dto.rating.RatingResponseDTO;
import de.fhdo.project.blumeo.services.RatingService;
import jakarta.validation.Valid;

/**
 * REST Controller for managing ratings.
 * Provides endpoints for submitting, retrieving, and deleting ratings.
 * 
 * @author Blumeo Team
 * @version 1.0
 */
@RestController
@RequestMapping(
        value = "/api/v1/ratings",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
)
public class RatingController {
    
    private final RatingService ratingService;
    
    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }
    
    // /**
    //  * Submit a new rating for an order.
    //  * 
    //  * @param ratingRequest The rating data (orderId, customerId, score, review)
    //  * @return ResponseEntity containing the created rating
    //  */

    @PostMapping
    public ResponseEntity<RatingResponseDTO> submitRating(
            @Valid @RequestBody RatingRequestDTO ratingRequest) {
        RatingResponseDTO dto = ratingService.saveRating(ratingRequest);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }
    
    // /**
    //  * Get all ratings for a specific order.
    //  * 
    //  * @param orderId The order ID
    //  * @return ResponseEntity containing list of ratings
    //  */

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<RatingResponseDTO>> getRatingsByOrder(
            @PathVariable Long orderId) {
        List<RatingResponseDTO> ratings = ratingService.getRatingsByOrderId(orderId);
        return ResponseEntity.ok(ratings);
    }
    
    // /**
    //  * Get all ratings submitted by a specific customer.
    //  * 
    //  * @param customerId The customer ID
    //  * @return ResponseEntity containing list of ratings
    //  */

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<RatingResponseDTO>> getRatingsByCustomer(
            @PathVariable Long customerId) {
        List<RatingResponseDTO> ratings = ratingService.getRatingsByCustomerId(customerId);
        return ResponseEntity.ok(ratings);
    }
    
    // /**
    //  * Get a specific rating by its ID.
    //  * 
    //  * @param ratingId The rating ID
    //  * @return ResponseEntity containing the rating
    //  */

    @GetMapping("/{ratingId}")
    public ResponseEntity<RatingResponseDTO> getRatingById(
            @PathVariable Long ratingId) {
        RatingResponseDTO dto = ratingService.getRatingById(ratingId);
        return ResponseEntity.ok(dto);
    }
    
    // /**
    //  * Get all ratings in the system.
    //  * 
    //  * @return ResponseEntity containing list of all ratings
    //  */

    @GetMapping
    public ResponseEntity<List<RatingResponseDTO>> getAllRatings() {
        List<RatingResponseDTO> ratings = ratingService.getAllRatings();
        return ResponseEntity.ok(ratings);
    }
    
    // /**
    //  * Update an existing rating.
    //  * 
    //  * @param ratingId The rating ID to update
    //  * @param ratingRequest The updated rating data
    //  * @return ResponseEntity containing the updated rating
    //  */

    @PatchMapping("/{ratingId}")
    public ResponseEntity<RatingResponseDTO> updateRating(
            @PathVariable Long ratingId,
            @Valid @RequestBody RatingRequestDTO ratingRequest) {
        RatingResponseDTO dto = ratingService.updateRating(ratingId, ratingRequest);
        return ResponseEntity.ok(dto);
    }
    
    // /**
    //  * Delete a rating by its ID.
    //  * 
    //  * @param ratingId The rating ID to delete
    //  * @return ResponseEntity with no content
    //  */

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.noContent().build();
    }
    
    // /**
    //  * Get average rating score for a specific order.
    //  * 
    //  * @param orderId The order ID
    //  * @return ResponseEntity containing the average score
    //  */

    @GetMapping("/order/{orderId}/average")
    public ResponseEntity<Double> getAverageRatingForOrder(
            @PathVariable Long orderId) {
        Double average = ratingService.getAverageRatingForOrder(orderId);
        return ResponseEntity.ok(average);
    }
    
    // /**
    //  * Check if a customer has already rated a specific order.
    //  * 
    //  * @param orderId The order ID
    //  * @param customerId The customer ID
    //  * @return ResponseEntity containing the existing rating or 404 if not found
    //  */
    
    @GetMapping("/order/{orderId}/customer/{customerId}")
    public ResponseEntity<RatingResponseDTO> getRatingByOrderAndCustomer(
            @PathVariable Long orderId,
            @PathVariable Long customerId) {
        RatingResponseDTO dto = ratingService.getRatingByOrderAndCustomer(orderId, customerId);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }
}