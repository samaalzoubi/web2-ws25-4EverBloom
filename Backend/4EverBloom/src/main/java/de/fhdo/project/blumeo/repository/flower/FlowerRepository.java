package de.fhdo.project.blumeo.repository.flower;

import de.fhdo.project.blumeo.entity.flower.Flower;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlowerRepository extends JpaRepository<Flower, Long> {

    /*Page<Flower> findByNameContainingIgnoreCase(String q, Pageable pageable);

    Page<Flower> findByColorIgnoreCase(String color, Pageable pageable);

    Page<Flower> findBySeasonIgnoreCase(String season, Pageable pageable);

    Optional<Flower> findByNameIgnoreCaseAndColorIgnoreCaseAndSeasonIgnoreCase(
            String name, String color, String season
    );*/
}

