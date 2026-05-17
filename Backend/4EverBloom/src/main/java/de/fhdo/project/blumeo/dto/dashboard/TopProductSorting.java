package de.fhdo.project.blumeo.dto.dashboard;

public enum TopProductSorting {
    QUANTITY,
    REVENUE;

    public static TopProductSorting fromRequestParam(String value) {
        if (value == null || value.isBlank()) {
            return QUANTITY;
        }

        try {
            return TopProductSorting.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Select appropriate sorting mechanism: either 'quantity' or 'revenue'");
        }
    }
}
