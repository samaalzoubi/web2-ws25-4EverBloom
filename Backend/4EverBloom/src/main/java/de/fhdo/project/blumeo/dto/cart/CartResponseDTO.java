package de.fhdo.project.blumeo.dto.cart;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

//Lab3
@Data
public class CartResponseDTO {
    private Long userId;

    private List<CartItemDTO> items;

    private int totalQuantity;

    private BigDecimal totalPrice;
}
