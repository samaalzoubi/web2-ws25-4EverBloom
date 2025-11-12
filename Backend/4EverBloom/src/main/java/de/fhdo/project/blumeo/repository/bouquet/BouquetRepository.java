package de.fhdo.project.blumeo.repository.bouquet;

import de.fhdo.project.blumeo.entity.bouquet.Bouquet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BouquetRepository extends JpaRepository<Bouquet, Long> {

    /*@Query("select b from PremadeBouquet b where b.shop.id = :shopId")
    List<PremadeBouquet> findPremadeByShop(Long shopId);

    @Query("select b from CustomBouquet b where b.shop.id = :shopId")
    List<CustomBouquet> findCustomByShop(Long shopId);*/
}

