package de.fhdo.project.blumeo.controller.rating;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin
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

    @PostMapping
    public ResponseEntity<RatingResponseDTO> submitRating(
            @Valid @RequestBody RatingRequestDTO ratingRequest) {
        RatingResponseDTO dto = ratingService.saveRating(ratingRequest);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<RatingResponseDTO>> getRatingsByOrder(
            @PathVariable Long orderId) {
        List<RatingResponseDTO> ratings = ratingService.getRatingsByOrderId(orderId);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<RatingResponseDTO>> getRatingsByCustomer(
            @PathVariable Long customerId) {
        List<RatingResponseDTO> ratings = ratingService.getRatingsByCustomerId(customerId);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/{ratingId}")
    public ResponseEntity<RatingResponseDTO> getRatingById(
            @PathVariable Long ratingId) {
        RatingResponseDTO dto = ratingService.getRatingById(ratingId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<RatingResponseDTO>> getAllRatings() {
        List<RatingResponseDTO> ratings = ratingService.getAllRatings();
        return ResponseEntity.ok(ratings);
    }

    @PatchMapping("/{ratingId}")
    public ResponseEntity<RatingResponseDTO> updateRating(
            @PathVariable Long ratingId,
            @Valid @RequestBody RatingRequestDTO ratingRequest) {
        RatingResponseDTO dto = ratingService.updateRating(ratingId, ratingRequest);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/order/{orderId}/average")
    public ResponseEntity<Double> getAverageRatingForOrder(
            @PathVariable Long orderId) {
        Double average = ratingService.getAverageRatingForOrder(orderId);
        return ResponseEntity.ok(average);
    }
    
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