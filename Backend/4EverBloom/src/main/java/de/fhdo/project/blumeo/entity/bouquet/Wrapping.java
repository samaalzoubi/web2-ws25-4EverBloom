package de.fhdo.project.blumeo.entity.bouquet;

import java.math.BigDecimal;

//Lab3
public enum Wrapping {
    SIMPLE(BigDecimal.ZERO),
    PREMIUM(new BigDecimal("3.50")),
    LUXURY(new BigDecimal("7.00"));

    private final BigDecimal extraPrice;

    Wrapping(BigDecimal p) {
        this.extraPrice = p;
    }

    public BigDecimal getExtraPrice() {
        return extraPrice;
    }
}

