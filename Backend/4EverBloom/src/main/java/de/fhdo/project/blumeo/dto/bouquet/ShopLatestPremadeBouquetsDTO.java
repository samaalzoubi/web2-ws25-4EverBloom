package de.fhdo.project.blumeo.dto.bouquet;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

//Lab3
@Getter
@Setter
public class ShopLatestPremadeBouquetsDTO {

    private Long shopId;
    //private String shopName;
    private List<BouquetDetailsDTO> bouquets;

    public ShopLatestPremadeBouquetsDTO(Long shopId, /*String shopName*/ List<BouquetDetailsDTO> bouquets) {
        this.shopId = shopId;
        //this.shopName = shopName;
        this.bouquets = bouquets;
    }
}
