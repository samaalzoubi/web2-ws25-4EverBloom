package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.dto.bouquet.BouquetItemRequest;
import de.fhdo.project.blumeo.dto.bouquet.CreatePremadeBouquetRequest;
import de.fhdo.project.blumeo.entity.bouquet.Bouquet;
import de.fhdo.project.blumeo.entity.bouquet.BouquetComponent;
import de.fhdo.project.blumeo.entity.bouquet.PremadeBouquet;
import de.fhdo.project.blumeo.entity.flower.Flower;
import de.fhdo.project.blumeo.entity.inventory.ShopStem;
import de.fhdo.project.blumeo.repository.bouquet.BouquetRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

//TODO
@Service
public class BouquetService {

    private final BouquetRepository bouquetRepository;

    //private final FlowerShopRepository flowerShopRepository;
    private final InventoryService shopStemService;

    @Autowired
    public BouquetService(BouquetRepository bouquetRepository, InventoryService shopStemService) {
        this.bouquetRepository = bouquetRepository;
        this.shopStemService = shopStemService;
    }

    @Transactional
    public /*BouquetDetailsDto*/ Bouquet createPremadeBouquet(Long shopId, CreatePremadeBouquetRequest request) {
        /*FlowerShop shop = flowerShopRepository.findById(shopId).orElseThrow(() -> new IllegalArgumentException("Shop not found: " + shopId));*/

        /*List<ShopStem> stems = shopStemService.getAvailableStemsForShop(shopId);

        if (stems.isEmpty()) {
            throw new IllegalStateException("Cannot create a bouquet: Shop has no flower stems available.");
        }*/

        Bouquet bouquet = new PremadeBouquet();
        //bouquet.setShop(shop);
        bouquet.setName(request.name());
        bouquet.setDescription(request.description());
        bouquet.setImageUrl(request.imageUrl());

        List<BouquetComponent> components = new ArrayList<>();
        BigDecimal calculatedPrice = BigDecimal.ZERO;

        for (BouquetItemRequest item : request.items()) {
            //ShopStem stem = shopStemService.getStemForShop(shopId, item.stemId());
            //Flower flowerTemp = stem.getFlower();

            BouquetComponent comp = new BouquetComponent();
            comp.setBouquet(bouquet);
            //comp.setFlower(flowerTemp);
            comp.setRequiredQuantity(item.quantity());
            components.add(comp);

            /*BigDecimal linePrice = stem.getPrice().multiply(BigDecimal.valueOf(item.quantity()));
            calculatedPrice = calculatedPrice.add(linePrice);*/
        }

        bouquet.setComponents(components);
        bouquet.setPrice(request.fixedPrice() != null ? request.fixedPrice() : calculatedPrice);

        Bouquet saved = bouquetRepository.save(bouquet);

        //return mapToDetailsDto(saved);
        return null;
    }

    /*
    @Transactional
    public BouquetDetailsDto Bouquet updateBouquet(Long bouquetId, UpdateBouquetRequest request) {
        Bouquet bouquet = bouquetRepository.findById(bouquetId).orElseThrow(() -> new IllegalArgumentException("Bouquet not found: " + bouquetId));

        if (request.name() != null) bouquet.setName(request.name());
        if (request.description() != null) bouquet.setDescription(request.description());
        if (request.imageUrl() != null) bouquet.setImageUrl(request.imageUrl());

        if (request.items() != null) {
            bouquet.getComponents().clear();

            BigDecimal calculatedPrice = BigDecimal.ZERO;
            for (BouquetItemRequest item : request.items()) {
                ShopStem stem = shopStemService.getStemForShop(bouquet.getShop().getShopId(), item.stemId());
                Flower flowerTemp = stem.getFlower();

                BouquetComponent comp = new BouquetComponent();
                comp.setBouquet(bouquet);
                comp.setFlower(flowerTemp);
                comp.setRequiredQuantity(item.quantity());
                bouquet.getComponents().add(comp);

                BigDecimal linePrice = stem.getPrice().multiply(BigDecimal.valueOf(item.quantity()));
                calculatedPrice = calculatedPrice.add(linePrice);
            }

            bouquet.setPrice(request.fixedPrice() != null ? request.fixedPrice() : calculatedPrice);
        } else if (request.fixedPrice() != null) {
            bouquet.setPrice(request.fixedPrice());
        }

        Bouquet saved = bouquetRepository.save(bouquet);
        return mapToDetailsDto(saved);
    }*/

    @Transactional
    public void deleteBouquet(Long bouquetId) {
        bouquetRepository.deleteById(bouquetId);
    }

    /*
    @Transactional
    public void archiveBouquet(Long bouquetId) {
        Bouquet bouquet = bouquetRepository.findById(bouquetId)
                .orElseThrow(() -> new IllegalArgumentException("Bouquet not found: " + bouquetId));
        bouquet.setArchived(true);
        bouquetRepository.save(bouquet);
    }*/

    /*public List<BouquetSummaryDto> getBouquetsForShop(Long shopId) {
        List<Bouquet> bouquets = bouquetRepository.findByShop_ShopIdAndArchivedFalse(shopId);
        return bouquets.stream().map(this::mapToSummaryDto).toList();
    }*/

    /*public List<BouquetSummaryDto> getPopularBouquetsForShop(Long shopId, int limit) {
        List<Bouquet> bouquets = bouquetRepository.findTopByShopOrderByPopularityDesc(shopId, limit);
        return bouquets.stream().map(this::mapToSummaryDto).toList();
    }*/

    /*public BouquetDetailsDto getBouquetDetails(Long bouquetId) {
        Bouquet bouquet = bouquetRepository.findByIdWithComponents(bouquetId).orElseThrow(() -> new IllegalArgumentException("Bouquet not found: " + bouquetId));
        return mapToDetailsDto(bouquet);
    }*/

    /*
    public BigDecimal calculateCustomBouquetPrice(Long shopId, Map<Long, Integer> stemQuantities) {
        BigDecimal total = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entry : stemQuantities.entrySet()) {
            Long stemId = entry.getKey();
            int qty = entry.getValue();

            ShopStem stem = shopStemService.getStemForShop(shopId, stemId);

            BigDecimal line = stem.getPrice().multiply(BigDecimal.valueOf(qty));
            total = total.add(line);
        }

        return total;
    }*/

    /*public CustomBouquetPreviewDto createCustomBouquet(Long shopId, CreateCustomBouquetRequest request) {
        BigDecimal total = BigDecimal.ZERO;
        List<BouquetComponentDto> components = new ArrayList<>();

        for (Map.Entry<Long, Integer> entry : request.stemQuantities().entrySet()) {
            Long stemId = entry.getKey();
            int qty = entry.getValue();

            ShopStem stem = shopStemService.getStemForShop(shopId, stemId);

            BigDecimal line = stem.getPrice().multiply(BigDecimal.valueOf(qty));
            total = total.add(line);

            BouquetComponentDto comp = new BouquetComponentDto(
                    stem.getStemId(),
                    stem.getFlower().getName(),
                    stem.getFlower().getColor(),
                    qty,
                    stem.getPrice()
            );
            components.add(comp);
        }

        return new CustomBouquetPreviewDto(request.name(), total, components);
    }*/
}

