package de.fhdo.project.blumeo.repository.rating;

import de.fhdo.project.blumeo.entity.rating.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

//Lab3
@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByOrderId(Long orderId);
    List<Rating> findByCustomerId(Long customerId);
}
