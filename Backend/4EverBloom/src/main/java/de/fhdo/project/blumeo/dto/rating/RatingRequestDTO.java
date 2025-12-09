package de.fhdo.project.blumeo.dto.rating;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for rating submission requests.
 * Used when a customer submits a new rating.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingRequestDTO {
    
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    @NotNull(message = "Rating score is required")
    @Min(value = 1, message = "Rating score must be at least 1")
    @Max(value = 5, message = "Rating score must be at most 5")
    private Integer ratingScore;
    
    private String review; // Optional comment/review text
}
