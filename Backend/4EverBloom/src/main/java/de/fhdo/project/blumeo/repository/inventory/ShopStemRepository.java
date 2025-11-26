package de.fhdo.project.blumeo.repository.inventory;

import de.fhdo.project.blumeo.entity.flower.Flower;
import de.fhdo.project.blumeo.entity.inventory.ShopStem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShopStemRepository extends JpaRepository<ShopStem, Long> {
    Optional<ShopStem> findByFlower(Flower flower);

    //Optional<ShopStem> findByStemIdAndShop(Long stemId, Long shopId);
}

