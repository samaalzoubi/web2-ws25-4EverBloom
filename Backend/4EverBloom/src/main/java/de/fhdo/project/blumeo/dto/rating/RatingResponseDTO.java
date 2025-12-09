package de.fhdo.project.blumeo.dto.rating;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for rating responses.
 * Used when returning rating data to the client.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponseDTO {
    
    private Long id;
    
    private Long orderId;
    
    private String orderNumber; // Optional: display order number instead of just ID
    
    private Long customerId;
    
    private String customerName; // Optional: customer's full name
    
    private Integer ratingScore;
    
    private String review;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
