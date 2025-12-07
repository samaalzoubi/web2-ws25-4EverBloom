package de.fhdo.project.blumeo.utils.mapper;

import de.fhdo.project.blumeo.dto.cart.CartItemDTO;
import de.fhdo.project.blumeo.entity.bouquet.Bouquet;
import de.fhdo.project.blumeo.entity.cart.CartItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Objects;

@Component
public class CartItemMapper {

    public CartItemDTO toDto(CartItem cartItemEntity) {
        Objects.requireNonNull(cartItemEntity);
        Bouquet tempBouquet = cartItemEntity.getBouquet();

        CartItemDTO dto = new CartItemDTO();
        dto.setBouquetId(tempBouquet.getBouquetId());
        dto.setBouquetName(tempBouquet.getName());
        dto.setImageUrl(tempBouquet.getImageUrl());

        int quantity = cartItemEntity.getQuantity();
        BigDecimal unitPrice = cartItemEntity.getUnitPrice();
        dto.setQuantity(quantity);
        dto.setUnitPrice(unitPrice);

        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        dto.setLineTotal(lineTotal);

        return dto;
    }
}

