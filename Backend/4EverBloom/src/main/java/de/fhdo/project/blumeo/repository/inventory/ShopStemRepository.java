package de.fhdo.project.blumeo.repository.inventory;

import de.fhdo.project.blumeo.entity.inventory.ShopStem;
import org.springframework.data.jpa.repository.JpaRepository;

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

