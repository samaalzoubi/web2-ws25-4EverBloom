package de.fhdo.project.blumeo.repository.flower;

import de.fhdo.project.blumeo.entity.flower.ShopStem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ShopStemRepository extends JpaRepository<ShopStem, Long> {

    /*Optional<ShopStem> findByShop_IdAndFlower_FlowerId(Long shopId, Long flowerId);

    List<ShopStem> findByShop_Id(Long shopId);

    @Query("""
        select s from ShopStem s
        where s.shop.id = :shopId and s.flower.flowerId in :flowerIds
    """)
    List<ShopStem> findAllByShopAndFlowerIds(@Param("shopId") Long shopId,
                                             @Param("flowerIds") Collection<Long> flowerIds);*/
}

