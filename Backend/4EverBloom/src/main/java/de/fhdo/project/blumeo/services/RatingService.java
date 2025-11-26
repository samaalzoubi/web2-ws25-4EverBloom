package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.entity.rating.Rating;
import de.fhdo.project.blumeo.repository.rating.RatingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class RatingService {
    
    private final RatingRepository ratingRepository;

    @Autowired
    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }
    
    public Rating saveRating(Rating rating) {
        return ratingRepository.save(rating);
    }
    
    public Optional<Rating> getRatingById(Long id) {
        return ratingRepository.findById(id);
    }
    
    public List<Rating> getRatingsByOrderId(Long orderId) {
        return ratingRepository.findByOrderId(orderId);
    }
    
    public List<Rating> getRatingsByCustomerId(Long customerId) {
        return ratingRepository.findByCustomerId(customerId);
    }
    
    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }
    
    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }
}
