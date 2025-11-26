package de.fhdo.project.blumeo.dto.inventory;

import java.math.BigDecimal;

public record CreateShopStemRequest(
        Long flowerId,
        String flowerName,
        String flowerColor,
        String flowerSeason,
        BigDecimal price,
        int quantity,
        String imageUrl
) {
}

