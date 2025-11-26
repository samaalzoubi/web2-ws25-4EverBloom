package de.fhdo.project.blumeo.dto.cart;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class CartItemDTO {

    private Long id;

    private Long bouquetId;

    private String bouquetName;

    private String imageUrl;

    private int quantity;

    private BigDecimal unitPrice;

    private BigDecimal lineTotal;
}

