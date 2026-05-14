package de.fhdo.project.blumeo.dto.dashboard;

import java.math.BigDecimal;

public record TopProductDTO(
        Long bouquetId,
        String bouquetName,
        Long totalSold,
        BigDecimal totalRevenue
) {
}
