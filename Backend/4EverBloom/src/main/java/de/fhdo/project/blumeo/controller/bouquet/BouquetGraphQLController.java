package de.fhdo.project.blumeo.controller.bouquet;

import de.fhdo.project.blumeo.dto.bouquet.*;
import de.fhdo.project.blumeo.services.BouquetService;
import jakarta.validation.Valid;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

//Lab6
@Controller
public class BouquetGraphQLController {

    private final BouquetService bouquetService;

    public BouquetGraphQLController(BouquetService bouquetService) {
        this.bouquetService = bouquetService;
    }

    @MutationMapping
    public BouquetDetailsDTO createPremadeBouquet(@Argument Long shopId, @Argument CreatePremadeBouquetRequest request) {
        return bouquetService.createPremadeBouquet(shopId, request);
    }

    @MutationMapping
    public BouquetDetailsDTO createCustomBouquet(@Argument Long shopId, @Argument CreateCustomBouquetRequest request) {
        return bouquetService.createCustomBouquet(shopId, request);
    }

    @MutationMapping
    public BouquetDetailsDTO updatePremadeBouquetPrice(@Argument Long shopId, @Argument Long bouquetId, @Argument @Valid UpdateBouquetRequest request) {
        return bouquetService.updatePremadeBouquetPrice(shopId, bouquetId, request);
    }

    @MutationMapping
    public Boolean deleteBouquet(@Argument Long bouquetId) {
        bouquetService.deleteBouquet(bouquetId);
        return true;
    }

    @QueryMapping
    public List<PremadeBouquetSummary> bouquetsForShop(@Argument Long shopId) {
        return bouquetService.getPremadeBouquetsForShop(shopId);
    }

    @QueryMapping
    public List<ShopLatestPremadeBouquetsDTO> latestPremadeBouquetsPerShop() {
        return bouquetService.getLatestPremadeBouquetsPerShop(3);
    }
}

