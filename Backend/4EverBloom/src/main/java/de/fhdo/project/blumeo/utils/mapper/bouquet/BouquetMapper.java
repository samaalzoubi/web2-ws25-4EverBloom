package de.fhdo.project.blumeo.utils.mapper.bouquet;

import de.fhdo.project.blumeo.dto.bouquet.BouquetDetailsDTO;
import de.fhdo.project.blumeo.dto.bouquet.PremadeBouquetSummary;
import de.fhdo.project.blumeo.entity.bouquet.*;
import de.fhdo.project.blumeo.entity.flower.Flower;
import de.fhdo.project.blumeo.entity.inventory.ShopStem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class BouquetMapper {

    public BouquetDetailsDTO mapToDetailsDto(Bouquet bouquet) {
        Set<Occasion> occasions = Set.of();
        Wrapping wrapping = null;
        String imageUrl = null;
        List<BouquetDetailsDTO.ComponentDTO> componentDtos = List.of();

        if (bouquet instanceof PremadeBouquet premade) {
            occasions = premade.getOccasions();
            imageUrl = premade.getImageUrl();
        } else if (bouquet instanceof CustomBouquet custom) {
            wrapping = custom.getWrapping();
            componentDtos = custom.getComponents().stream()
                            .map(c -> {
                                ShopStem stem = c.getShopStem();
                                Flower flower = stem.getFlower();
                                return new BouquetDetailsDTO.ComponentDTO(
                                        stem.getStemId(),
                                        flower.getFlowerId(),
                                        flower.getName(),
                                        c.getRequiredQuantity(),
                                        stem.getPrice(),
                                        stem.getImageUrl()
                                );
                            }).toList();
        }

        return new BouquetDetailsDTO(
                bouquet.getBouquetId(),
                bouquet.getName(),
                bouquet.getDescription(),
                imageUrl,
                bouquet.getPrice(),
                bouquet.getShopOwner().getId(),
                wrapping,
                occasions,
                componentDtos
        );
    }

}
