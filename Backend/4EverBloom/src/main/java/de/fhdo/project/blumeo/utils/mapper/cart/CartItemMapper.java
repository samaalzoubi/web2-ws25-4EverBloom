package de.fhdo.project.blumeo.utils.mapper.cart;

import de.fhdo.project.blumeo.dto.cart.CartItemDTO;
import de.fhdo.project.blumeo.entity.bouquet.Bouquet;
import de.fhdo.project.blumeo.entity.bouquet.PremadeBouquet;
import de.fhdo.project.blumeo.entity.cart.CartItem;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Objects;

//Lab3
@Component
public class CartItemMapper {

    public CartItemDTO toDto(CartItem cartItemEntity) {
        Objects.requireNonNull(cartItemEntity);
        Bouquet tempBouquet = cartItemEntity.getBouquet();
        Bouquet realBouquet = (Bouquet) Hibernate.unproxy(tempBouquet);

        CartItemDTO dto = new CartItemDTO();
        dto.setItemId(cartItemEntity.getId());
        dto.setBouquetId(tempBouquet.getBouquetId());
        dto.setBouquetName(tempBouquet.getName());

        String imageUrl = null;

        if (realBouquet instanceof PremadeBouquet premade) {
            imageUrl = premade.getImageUrl();
        }

        dto.setImageUrl(imageUrl);

        int quantity = cartItemEntity.getQuantity();
        BigDecimal unitPrice = cartItemEntity.getUnitPrice();
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        dto.setQuantity(quantity);
        dto.setUnitPrice(unitPrice);
        dto.setLineTotal(lineTotal);

        return dto;
    }
}

