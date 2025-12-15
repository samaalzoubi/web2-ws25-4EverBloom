package de.fhdo.project.blumeo.utils.mapper.cart;

import de.fhdo.project.blumeo.dto.cart.CartItemDTO;
import de.fhdo.project.blumeo.dto.cart.CartResponseDTO;
import de.fhdo.project.blumeo.entity.cart.Cart;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

//Lab3
@Component
public class CartMapper {
    private final CartItemMapper cartItemMapper;

    public CartMapper(CartItemMapper cartItemMapper) {
        this.cartItemMapper = cartItemMapper;
    }

    public CartResponseDTO toDto(Cart cart) {
        CartResponseDTO dto = new CartResponseDTO();
        dto.setUserId(cart.getUserId());

        List<CartItemDTO> itemDtos = cart.getItems().stream().map(cartItemMapper::toDto).toList();
        dto.setItems(itemDtos);

        int totalQuantity = itemDtos.stream().mapToInt(CartItemDTO::getQuantity).sum();
        dto.setTotalQuantity(totalQuantity);

        BigDecimal totalPrice = itemDtos.stream().map(CartItemDTO::getLineTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalPrice(totalPrice);

        return dto;
    }
}

