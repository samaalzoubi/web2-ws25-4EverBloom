package de.fhdo.project.blumeo.dto.bouquet;

import java.math.BigDecimal;
import java.util.List;

public record CreatePremadeBouquetRequest(
        String name,
        String description,
        String imageUrl,
        List<BouquetItemRequest> items,
        BigDecimal fixedPrice,
        List<String> occasions
) {
}

