package de.fhdo.project.blumeo.repository.bouquet;

import de.fhdo.project.blumeo.entity.bouquet.Bouquet;
import de.fhdo.project.blumeo.entity.bouquet.PremadeBouquet;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

//Lab3
public interface BouquetRepository extends JpaRepository<Bouquet, Long> {
    List<PremadeBouquet> findAllByShopOwner_Id(Long shopId);

    @Query("""
            SELECT b
            FROM PremadeBouquet b
            WHERE b.shopOwner.id = :shopId
            """)
    List<PremadeBouquet> findLatestPremadeByShop(@Param("shopId") Long shopId, Pageable pageable);

}

