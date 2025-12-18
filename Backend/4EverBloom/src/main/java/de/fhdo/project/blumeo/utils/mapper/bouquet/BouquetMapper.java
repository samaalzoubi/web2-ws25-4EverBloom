package de.fhdo.project.blumeo.utils.mapper.bouquet;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import de.fhdo.project.blumeo.dto.bouquet.BouquetDetailsDTO;
import de.fhdo.project.blumeo.entity.bouquet.Bouquet;
import de.fhdo.project.blumeo.entity.bouquet.CustomBouquet;
import de.fhdo.project.blumeo.entity.bouquet.Occasion;
import de.fhdo.project.blumeo.entity.bouquet.PremadeBouquet;
import de.fhdo.project.blumeo.entity.bouquet.Wrapping;
import de.fhdo.project.blumeo.entity.flower.Flower;
import de.fhdo.project.blumeo.entity.inventory.ShopStem;

//Lab3
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
