package de.fhdo.project.blumeo.dto.bouquet;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

//Lab3
public record UpdateBouquetRequest(
        @NotNull
        @DecimalMin("0.00")
        BigDecimal newPrice
) {}

