package de.fhdo.project.blumeo.controller.bouquet;

import de.fhdo.project.blumeo.dto.bouquet.*;
import de.fhdo.project.blumeo.exception.BouquetDeletionNotAllowedException;
import de.fhdo.project.blumeo.services.BouquetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//TODO: Exception handling, JavaDoc
//Lab5
@RestController
@RequestMapping(
        value = "/api/v1/bouquet",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
)
public class BouquetController {

    private final BouquetService bouquetService;

    public BouquetController(BouquetService bouquetService) {
        this.bouquetService = bouquetService;
    }

    @PostMapping("/shops/{shopId}/premade")
    public ResponseEntity<BouquetDetailsDTO> createPremadeBouquet(@PathVariable Long shopId, @RequestBody CreatePremadeBouquetRequest request) {
        BouquetDetailsDTO dto = bouquetService.createPremadeBouquet(shopId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PostMapping("/shops/{shopId}/custom")
    public ResponseEntity<BouquetDetailsDTO> createCustomBouquet(@PathVariable Long shopId, @RequestBody CreateCustomBouquetRequest request) {
        BouquetDetailsDTO dto = bouquetService.createCustomBouquet(shopId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/shops/{shopId}/premade/{bouquetId}/price")
    public ResponseEntity<BouquetDetailsDTO> updatePremadeBouquetPrice(@PathVariable Long shopId, @PathVariable Long bouquetId, @RequestBody @Valid UpdateBouquetRequest request) {
        BouquetDetailsDTO dto = bouquetService.updatePremadeBouquetPrice(shopId, bouquetId, request);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{bouquetId}")
    public ResponseEntity<String> deleteBouquet(@PathVariable Long bouquetId) {
        try {
            bouquetService.deleteBouquet(bouquetId);
            return ResponseEntity.noContent().build();
        } catch (BouquetDeletionNotAllowedException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(ex.getMessage());

        } catch (IllegalArgumentException ex) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        }
    }

    @GetMapping("/shops/{shopId}")
    public ResponseEntity<List<PremadeBouquetSummary>> getBouquetsForShop(@PathVariable Long shopId) {
        List<PremadeBouquetSummary> list = bouquetService.getPremadeBouquetsForShop(shopId);
        return ResponseEntity.ok(list);
    }

    /*@GetMapping("/shops/{shopId}/popular")
    public ResponseEntity<List<PremadeBouquetSummary>> getPopularBouquetsForShop(@PathVariable Long shopId) {
        List<PremadeBouquetSummary> list = bouquetService.getPopularBouquetsForShop(shopId);
        return ResponseEntity.ok(list);
    }*/
}

