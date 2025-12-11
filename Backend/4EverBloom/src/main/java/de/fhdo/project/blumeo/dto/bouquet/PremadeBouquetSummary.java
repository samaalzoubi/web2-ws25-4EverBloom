package de.fhdo.project.blumeo.dto.bouquet;

import de.fhdo.project.blumeo.entity.bouquet.Occasion;

import java.math.BigDecimal;
import java.util.Set;

//Lab3
public record PremadeBouquetSummary(
        Long id,
        String name,
        String imageUrl,
        BigDecimal price,
        Long shopId,
        Set<Occasion> occasions
) {
}
