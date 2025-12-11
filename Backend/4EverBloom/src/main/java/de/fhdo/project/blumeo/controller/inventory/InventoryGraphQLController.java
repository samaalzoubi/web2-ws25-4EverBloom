package de.fhdo.project.blumeo.controller.inventory;

import de.fhdo.project.blumeo.dto.inventory.ShopStemDTO;
import org.springframework.stereotype.Controller;

import de.fhdo.project.blumeo.dto.inventory.CreateShopStemRequest;
import de.fhdo.project.blumeo.dto.inventory.UpdateShopStemRequest;
import de.fhdo.project.blumeo.services.InventoryService;
import jakarta.validation.Valid;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;

import java.util.List;

//Lab6
@Controller
public class InventoryGraphQLController {

    private final InventoryService inventoryService;

    public InventoryGraphQLController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @QueryMapping
    public List<ShopStemDTO> shopStems(@Argument Long shopId) {
        return inventoryService.getAvailableStemsForShop(shopId);
    }

    @QueryMapping
    public ShopStemDTO shopStem(@Argument Long shopId, @Argument Long stemId) {
        return inventoryService.getStemForShop(shopId, stemId);
    }

    @MutationMapping
    public ShopStemDTO createShopStem(@Argument Long shopId, @Argument CreateShopStemRequest request) {
        return inventoryService.createStem(shopId, request);
    }

    @MutationMapping
    public ShopStemDTO updateShopStem(@Argument Long shopId, @Argument Long stemId, @Argument @Valid UpdateShopStemRequest request) {
        return inventoryService.updateStem(shopId, stemId, request);
    }

    @MutationMapping
    public Boolean removeShopStem(@Argument Long shopId, @Argument Long stemId) {
        inventoryService.removeStemFromAssortiment(shopId, stemId);
        return true;
    }
}

