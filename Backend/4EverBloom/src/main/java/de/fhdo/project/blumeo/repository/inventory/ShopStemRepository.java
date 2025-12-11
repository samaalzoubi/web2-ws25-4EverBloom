package de.fhdo.project.blumeo.repository.inventory;

import de.fhdo.project.blumeo.entity.flower.Flower;
import de.fhdo.project.blumeo.entity.inventory.ShopStem;
import de.fhdo.project.blumeo.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

//Lab3
public interface ShopStemRepository extends JpaRepository<ShopStem, Long> {
    Optional<ShopStem> findByFlower(Flower flower);
    List<ShopStem> findByShopOwnerAndQuantityGreaterThan(User shop, int compareWith);
    Optional<ShopStem> findByStemIdAndShopOwner_Id(Long stemId, Long shopOwnerId);
}

