package de.fhdo.project.blumeo.dto.bouquet;

import de.fhdo.project.blumeo.entity.bouquet.Occasion;

import java.math.BigDecimal;
import java.util.Set;

//Lab3
public record CreatePremadeBouquetRequest(
        String name,
        String description,
        String imageUrl,
        BigDecimal fixedPrice,
        Set<Occasion> occasions
) {
}

