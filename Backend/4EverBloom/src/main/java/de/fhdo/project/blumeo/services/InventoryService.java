package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.dto.inventory.CreateShopStemRequest;
import de.fhdo.project.blumeo.dto.inventory.ShopStemDTO;
import de.fhdo.project.blumeo.dto.inventory.UpdateShopStemRequest;
import de.fhdo.project.blumeo.entity.flower.Flower;
import de.fhdo.project.blumeo.entity.inventory.ShopStem;
import de.fhdo.project.blumeo.entity.user.Role;
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
    private final UserRepository userRepository;
    private final FlowerRepository flowerRepository;

    @Autowired
    public InventoryService(ShopStemRepository shopStemRepository, FlowerRepository flowerRepository, UserRepository userRepository) {
        this.shopStemRepository = shopStemRepository;
        this.flowerRepository = flowerRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ShopStemDTO createStem(Long shopId, CreateShopStemRequest request) {
        User shop = userRepository.findByIdAndRole(shopId, Role.OWNER).orElseThrow(() -> new IllegalArgumentException("Shop not found: " + shopId));

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
        stem.setShopOwner(shop);
        stem.setFlower(flower);
        stem.setQuantity(Math.max(request.quantity(), 0));
        stem.setPrice(request.price());
        stem.setImageUrl(request.imageUrl());

        shopStemRepository.save(stem);

        return new ShopStemDTO(
                stem.getStemId(),
                shopId,
                flower.getName(),
                flower.getColor(),
                flower.getSeason(),
                stem.getQuantity(),
                stem.getPrice(),
                stem.getImageUrl()
        );
    }

    @Transactional
    public ShopStemDTO updateStem(Long shopId, Long stemId, UpdateShopStemRequest request) {
        User shop = userRepository.findByIdAndRole(shopId, Role.OWNER).orElseThrow(() -> new IllegalArgumentException("Shop not found: " + shopId));

        ShopStem stem = shopStemRepository.findByStemIdAndShopOwner_Id(stemId, shopId).orElseThrow(() -> new IllegalArgumentException("Stem not found for shopId=" + shopId + ", stemId=" + stemId));

        if (request.quantity() != null) {
            stem.setQuantity(Math.max(request.quantity(), 0));
        }
        if (request.price() != null) {
            stem.setPrice(request.price());
        }

        Flower flowerStem = stem.getFlower();

        shopStemRepository.save(stem);

        return new ShopStemDTO(
                stem.getStemId(),
                shopId,
                flowerStem.getName(),
                flowerStem.getColor(),
                flowerStem.getSeason(),
                stem.getQuantity(),
                stem.getPrice(),
                stem.getImageUrl()
        );
    }

    public List<ShopStemDTO> getAvailableStemsForShop(Long shopId) {
        User shop = userRepository.findByIdAndRole(shopId, Role.OWNER)
                .orElseThrow(() -> new IllegalArgumentException("Shop not found: " + shopId));

        List<ShopStem> listOfFoundStems = shopStemRepository.findByShopOwnerAndQuantityGreaterThan(shop, 0);

        List<ShopStemDTO> listOfFoundDtoStems = null;

        if (!listOfFoundStems.isEmpty()) {
            listOfFoundDtoStems = listOfFoundStems.stream().map(shopStem -> {
                Flower shopStemFlower = shopStem.getFlower();
                return new ShopStemDTO(
                        shopStem.getStemId(),
                        shopId,
                        shopStemFlower.getName(),
                        shopStemFlower.getColor(),
                        shopStemFlower.getSeason(),
                        shopStem.getQuantity(),
                        shopStem.getPrice(),
                        shopStem.getImageUrl()
                );
            }).toList();
        }

        return listOfFoundDtoStems;
    }

    public ShopStemDTO getStemForShop(Long shopId, Long stemId) {
        ShopStem foundStem = shopStemRepository.findByStemIdAndShopOwner_Id(stemId, shopId).orElseThrow(() -> new IllegalArgumentException("Active stem not found for shopId=" + shopId + ", stemId=" + stemId));
        Flower shopStemFlower = foundStem.getFlower();

        return new ShopStemDTO(
                foundStem.getStemId(),
                shopId,
                shopStemFlower.getName(),
                shopStemFlower.getColor(),
                shopStemFlower.getSeason(),
                foundStem.getQuantity(),
                foundStem.getPrice(),
                foundStem.getImageUrl()
        );
    }

    @Transactional
    public void removeStemFromAssortiment(Long shopId, Long stemId) {
        ShopStem stem = shopStemRepository.findByStemIdAndShopOwner_Id(stemId, shopId).orElseThrow(() -> new IllegalArgumentException("ShopStem not found for shopId=" + shopId + ", stemId=" + stemId));

        shopStemRepository.delete(stem);
    }
}

