package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.dto.inventory.CreateShopStemRequest;
import de.fhdo.project.blumeo.entity.flower.Flower;
import de.fhdo.project.blumeo.entity.inventory.ShopStem;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.repository.flower.FlowerRepository;
import de.fhdo.project.blumeo.repository.inventory.ShopStemRepository;
import de.fhdo.project.blumeo.repository.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

//Lab3
@Service
public class InventoryService {

    private final ShopStemRepository shopStemRepository;
    private final UserRepository flowerShopRepository;
    private final FlowerRepository flowerRepository;

    @Autowired
    public InventoryService(ShopStemRepository shopStemRepository, FlowerRepository flowerRepository, UserRepository flowerShopRepository) {
        this.shopStemRepository = shopStemRepository;
        this.flowerRepository = flowerRepository;
        this.flowerShopRepository = flowerShopRepository;
    }

    @Transactional
    public ShopStem createStem(CreateShopStemRequest request) {

        Flower flower;

        if (request.flowerId() != null) {
            flower = flowerRepository.findById(request.flowerId()).orElseThrow(() -> new IllegalArgumentException("Flower not found: " + request.flowerId()));
        } else {
            Optional<Flower> existing = flowerRepository
                    .findByNameIgnoreCaseAndColorIgnoreCaseAndSeasonIgnoreCase(
                            request.flowerName(),
                            request.flowerColor(),
                            request.flowerSeason()
                    );

            if (existing.isPresent()) {
                flower = existing.get();
            } else {
                flower = new Flower();
                flower.setName(request.flowerName());
                flower.setColor(request.flowerColor());
                flower.setSeason(request.flowerSeason());

                flower = flowerRepository.save(flower);
            }
        }

        shopStemRepository.findByFlower(flower).ifPresent(existing -> {
            throw new IllegalStateException("A ShopStem for this Flower already exists (stemId=" + existing.getStemId() + ")");
        });

        ShopStem stem = new ShopStem();
        stem.setFlower(flower);
        stem.setPrice(request.price());
        stem.setQuantity(Math.max(request.quantity(), 0));
        stem.setImageUrl(request.imageUrl());

        return shopStemRepository.save(stem);
    }

    /*@Transactional
    public ShopStem updateStem(...){}*/

    public List<ShopStem> getAvailableStemsForShop(Long shopId) {
        User shop = flowerShopRepository.findById(shopId)
                .orElseThrow(() -> new IllegalArgumentException("Shop not found: " + shopId));

        return shopStemRepository.findByShopAndQuantityGreaterThan(shop, 0);
    }

    public ShopStem getStemForShop(Long shopId, Long stemId) {
        return shopStemRepository.findByStemIdAndShop(stemId, shopId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Active stem not found for shopId=" + shopId + ", stemId=" + stemId));
    }

    @Transactional
    public void removeStemFromAssortiment(Long stemId) {
        ShopStem stem = shopStemRepository.findById(stemId)
                .orElseThrow(() -> new IllegalArgumentException("ShopStem not found: " + stemId));

        /*stem.setQuantity(0);
        shopStemRepository.save(stem);*/

        shopStemRepository.delete(stem);
    }
}

