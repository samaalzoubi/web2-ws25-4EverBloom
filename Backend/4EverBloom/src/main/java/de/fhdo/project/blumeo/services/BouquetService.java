package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.dto.bouquet.*;
import de.fhdo.project.blumeo.dto.inventory.ShopStemDTO;
import de.fhdo.project.blumeo.entity.bouquet.*;
import de.fhdo.project.blumeo.entity.inventory.ShopStem;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import de.fhdo.project.blumeo.entity.user.Role;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.exception.BouquetDeletionNotAllowedException;
import de.fhdo.project.blumeo.repository.bouquet.BouquetRepository;
import de.fhdo.project.blumeo.repository.inventory.ShopStemRepository;
import de.fhdo.project.blumeo.repository.order.OrderLineRepository;
import de.fhdo.project.blumeo.repository.user.UserRepository;
import de.fhdo.project.blumeo.utils.mapper.bouquet.BouquetMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;

//Lab3
@Service
public class BouquetService {

    private final BouquetRepository bouquetRepository;
    private final UserRepository userRepository;
    private final ShopStemRepository shopStemRepository;
    private final OrderLineRepository orderLineRepository;
    private final BouquetMapper bouquetMapper;

    @Autowired
    public BouquetService(BouquetRepository bouquetRepository, ShopStemRepository shopStemRepository, UserRepository userRepository, BouquetMapper bouquetMapper, OrderLineRepository orderLineRepository) {
        this.bouquetRepository = bouquetRepository;
        this.shopStemRepository = shopStemRepository;
        this.userRepository = userRepository;
        this.bouquetMapper = bouquetMapper;
        this.orderLineRepository = orderLineRepository;
    }

    @Transactional
    public BouquetDetailsDTO createPremadeBouquet(Long shopId, CreatePremadeBouquetRequest request) {
        User shop = userRepository.findByIdAndRole(shopId, Role.OWNER).orElseThrow(() -> new IllegalArgumentException("Shop not found: " + shopId));

        //Dummy implementation. In real application we would connect PremadeBouquet with its components and "inventory" flowers of the shop
        PremadeBouquet bouquet = new PremadeBouquet();
        bouquet.setShopOwner(shop);
        bouquet.setName(request.name());
        bouquet.setDescription(request.description());
        bouquet.setImageUrl(request.imageUrl());
        bouquet.setPrice(request.fixedPrice());
        bouquet.setOccasions(request.occasions() != null ? new HashSet<>(request.occasions()) : new HashSet<>());

        PremadeBouquet saved = bouquetRepository.save(bouquet);

        return bouquetMapper.mapToDetailsDto(saved);
    }

    @Transactional
    public BouquetDetailsDTO createCustomBouquet(Long shopId, CreateCustomBouquetRequest request) {
        User shop = userRepository.findByIdAndRole(shopId, Role.OWNER).orElseThrow(() -> new IllegalArgumentException("Shop not found: " + shopId));

        User customer = userRepository.findByIdAndRole(request.designedByUserId(), Role.CUSTOMER).orElseThrow(() -> new IllegalArgumentException("Customer not found: " + shopId));

        CustomBouquet bouquet = new CustomBouquet();
        bouquet.setShopOwner(shop);
        bouquet.setName(request.name());
        bouquet.setDescription(request.description());
        bouquet.setDesignedByCustomer(customer);

        Wrapping wrapping = request.wrapping() != null ? request.wrapping() : Wrapping.SIMPLE;
        bouquet.setWrapping(wrapping);

        BigDecimal total = BigDecimal.ZERO;

        for (CreateCustomBouquetRequest.BouquetItemRequest item : request.items()) {
            ShopStem stem = shopStemRepository.findByStemIdAndShopOwner_Id(item.stemId(), shopId).orElseThrow(() -> new IllegalArgumentException("Active stem not found for shopId=" + shopId + ", stemId=" + item.stemId()));

            BouquetComponent comp = new BouquetComponent();
            comp.setBouquet(bouquet);
            comp.setShopStem(stem);
            comp.setRequiredQuantity(item.quantity());
            bouquet.addComponent(comp);

            total = total.add(
                    stem.getPrice().multiply(BigDecimal.valueOf(item.quantity()))
            );
        }

        total = total.add(wrapping.getExtraPrice());
        bouquet.setPrice(total);

        CustomBouquet saved = bouquetRepository.save(bouquet);
        return bouquetMapper.mapToDetailsDto(saved);
    }

    @Transactional
    public BouquetDetailsDTO updatePremadeBouquetPrice(Long shopOwnerId, Long bouquetId, UpdateBouquetRequest request) {
        User shopOwner = userRepository.findByIdAndRole(shopOwnerId, Role.OWNER).orElseThrow(() -> new IllegalArgumentException("Shop owner not found or not a shop owner"));

        Bouquet bouquet = bouquetRepository.findById(bouquetId).orElseThrow(() -> new IllegalArgumentException("Bouquet not found: " + bouquetId));

        if (!(bouquet instanceof PremadeBouquet premade)) {
            throw new IllegalStateException("Only premade bouquets can have their price updated by shop owners.");
        }

        if (!bouquet.getShopOwner().getId().equals(shopOwner.getId())) {
            throw new SecurityException("You are not the owner of this bouquet.");
        }

        premade.setPrice(request.newPrice());

        Bouquet saved = bouquetRepository.save(premade);

        return bouquetMapper.mapToDetailsDto(saved);
    }


    @Transactional
    public void deleteBouquet(Long bouquetId) {
        Bouquet bouquet = bouquetRepository.findById(bouquetId).orElseThrow(() -> new IllegalArgumentException("Bouquet not found: " + bouquetId));

        EnumSet<OrderStatus> activeStatuses = EnumSet.of(
                OrderStatus.CREATED,
                OrderStatus.CONFIRMED,
                OrderStatus.IN_DELIVERY,
                OrderStatus.PAID
        );

        boolean usedInActiveOrder =
                orderLineRepository.existsByBouquet_BouquetIdAndOrder_StatusIn(
                        bouquetId,
                        activeStatuses
                );

        if (usedInActiveOrder) {
            throw new BouquetDeletionNotAllowedException("This Bouquet cannot be deleted because it's being used in active orders.");
        }

        bouquetRepository.delete(bouquet);
    }

    public List<PremadeBouquetSummary> getPremadeBouquetsForShop(Long shopId) {
        List<PremadeBouquet> bouquets = bouquetRepository.findAllByShopOwner_Id(shopId);
        return bouquets.stream()
                .map(bouquet -> new PremadeBouquetSummary(
                        bouquet.getBouquetId(),
                        bouquet.getName(),
                        bouquet.getImageUrl(),
                        bouquet.getPrice(),
                        shopId,
                        new HashSet<>(bouquet.getOccasions())
                )).toList();
    }

    /*public List<PremadeBouquetSummary> getPopularBouquetsForShop(Long shopId) {
        List<Bouquet> bouquets = bouquetRepository.findTopByShopOrderByPopularityDesc(shopId);
        return bouquets.stream().map(this::mapToSummaryDto).toList();
    }*/
}

