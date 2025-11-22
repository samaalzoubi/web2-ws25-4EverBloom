package de.fhdo.project.blumeo.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CartResponseDTO {
    private Long id;

    private Long userId;

    private List<CartItemDTO> items;

    private int totalQuantity;

    private BigDecimal totalPrice;
}
