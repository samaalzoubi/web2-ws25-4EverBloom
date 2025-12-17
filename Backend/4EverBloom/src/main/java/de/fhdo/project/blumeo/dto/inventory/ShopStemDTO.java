package de.fhdo.project.blumeo.dto.inventory;

import java.math.BigDecimal;

//Lab3
public record ShopStemDTO(
        Long stemId,
        Long shopId,
        String flowerName,
        String flowerColor,
        String flowerSeason,
        int quantity,
        BigDecimal price,
        String imageUrl
) {
}
