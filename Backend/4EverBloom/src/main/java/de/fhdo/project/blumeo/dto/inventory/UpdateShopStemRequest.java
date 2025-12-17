package de.fhdo.project.blumeo.dto.inventory;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

//Lab3
public record UpdateShopStemRequest(
        @Min(0)
        Integer quantity,

        @NotNull
        @DecimalMin(value = "0.00")
        BigDecimal price
) {
}

