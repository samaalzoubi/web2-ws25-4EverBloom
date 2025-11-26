package de.fhdo.project.blumeo.controller.rating;

import de.fhdo.project.blumeo.entity.rating.Rating;
import de.fhdo.project.blumeo.services.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {
    
    @Autowired
    private RatingService ratingService;
    
    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> submitRating(@RequestBody Rating rating) {
        try {
            ratingService.saveRating(rating);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Thank you for your rating!");
            response.put("status", "success");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error submitting rating");
            response.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Rating>> getRatingsByOrder(@PathVariable Long orderId) {
        List<Rating> ratings = ratingService.getRatingsByOrderId(orderId);
        return ResponseEntity.ok(ratings);
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Rating>> getRatingsByCustomer(@PathVariable Long customerId) {
        List<Rating> ratings = ratingService.getRatingsByCustomerId(customerId);
        return ResponseEntity.ok(ratings);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Rating>> getAllRatings() {
        List<Rating> ratings = ratingService.getAllRatings();
        return ResponseEntity.ok(ratings);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRating(@PathVariable Long id) {
        try {
            ratingService.deleteRating(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Rating deleted successfully");
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error deleting rating");
            response.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
