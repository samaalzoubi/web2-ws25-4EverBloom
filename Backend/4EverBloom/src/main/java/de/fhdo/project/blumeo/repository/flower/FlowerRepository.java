package de.fhdo.project.blumeo.repository.flower;

import de.fhdo.project.blumeo.entity.flower.Flower;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FlowerRepository extends JpaRepository<Flower, Long> {
    Optional<Flower> findByNameIgnoreCaseAndColorIgnoreCaseAndSeasonIgnoreCase(String name, String color, String season);
}

