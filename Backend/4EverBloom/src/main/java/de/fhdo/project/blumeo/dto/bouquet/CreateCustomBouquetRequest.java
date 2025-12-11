package de.fhdo.project.blumeo.dto.bouquet;

import de.fhdo.project.blumeo.entity.bouquet.Wrapping;

import java.util.List;

public record CreateCustomBouquetRequest(
        Long designedByUserId,
        String name,
        String description,
        Wrapping wrapping,
        List<BouquetItemRequest> items
) {
    public record BouquetItemRequest(
            Long stemId,
            int quantity
    ) {}
}
