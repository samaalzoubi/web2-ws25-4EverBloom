package de.fhdo.project.blumeo.controller.inventory;

import de.fhdo.project.blumeo.dto.inventory.ShopStemDTO;
import de.fhdo.project.blumeo.dto.inventory.UpdateShopStemRequest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RestController;

import de.fhdo.project.blumeo.dto.inventory.CreateShopStemRequest;
import de.fhdo.project.blumeo.services.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//Lab5
@RestController
@RequestMapping(
        value = "/api/v1/shops/{shopId}/inventory/stems",
        produces = {
                MediaType.APPLICATION_JSON_VALUE,
                MediaType.APPLICATION_XML_VALUE
        }
)
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<ShopStemDTO>> getAvailableStems(@PathVariable Long shopId) {
        List<ShopStemDTO> stems = inventoryService.getAvailableStemsForShop(shopId);
        return ResponseEntity.ok(stems);
    }

    @GetMapping("/{stemId}")
    public ResponseEntity<ShopStemDTO> getStem(@PathVariable Long shopId, @PathVariable Long stemId) {
        ShopStemDTO stem = inventoryService.getStemForShop(shopId, stemId);
        return ResponseEntity.ok(stem);
    }

    @PostMapping
    public ResponseEntity<ShopStemDTO> createStem(@PathVariable Long shopId, @RequestBody CreateShopStemRequest request) {
        ShopStemDTO created = inventoryService.createStem(shopId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{stemId}")
    public ResponseEntity<ShopStemDTO> updateStem(@PathVariable Long shopId, @PathVariable Long stemId, @RequestBody @Valid UpdateShopStemRequest request) {
        ShopStemDTO updated = inventoryService.updateStem(shopId, stemId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{stemId}")
    public ResponseEntity<Void> removeStem(@PathVariable Long shopId, @PathVariable Long stemId) {
        inventoryService.removeStemFromAssortiment(shopId, stemId);
        return ResponseEntity.noContent().build();
    }
}

