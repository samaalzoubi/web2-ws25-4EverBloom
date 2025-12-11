package de.fhdo.project.blumeo.dto.bouquet;

import de.fhdo.project.blumeo.entity.bouquet.Occasion;
import de.fhdo.project.blumeo.entity.bouquet.Wrapping;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

//Lab3
public record BouquetDetailsDTO(
        Long id,
        String name,
        String description,
        String imageUrl,
        BigDecimal price,
        Long shopId,
        Wrapping wrapping,
        Set<Occasion> occasions,
        List<ComponentDTO> components
) {
    public record ComponentDTO(
            Long shopStemId,
            Long flowerId,
            String flowerName,
            int quantity,
            BigDecimal stemPrice,
            String stemImageUrl
    ) {}
}

