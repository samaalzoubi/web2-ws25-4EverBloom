package de.fhdo.project.blumeo.dto.bouquet;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

//Lab3
@Getter
@Setter
public class ShopLatestPremadeBouquetsDTO {

    private Long shopId;
    private String shopLogo;
    private List<BouquetDetailsDTO> bouquets;

    public ShopLatestPremadeBouquetsDTO(Long shopId, String shopLogo, List<BouquetDetailsDTO> bouquets) {
        this.shopId = shopId;
        this.shopLogo = shopLogo;
        this.bouquets = bouquets;
    }
}
