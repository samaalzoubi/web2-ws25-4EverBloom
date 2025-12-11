package de.fhdo.project.blumeo.repository.bouquet;

import de.fhdo.project.blumeo.entity.bouquet.Bouquet;
import de.fhdo.project.blumeo.entity.bouquet.PremadeBouquet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

//Lab3
public interface BouquetRepository extends JpaRepository<Bouquet, Long> {
    List<PremadeBouquet> findAllByShopOwner_Id(Long shopId);
}

