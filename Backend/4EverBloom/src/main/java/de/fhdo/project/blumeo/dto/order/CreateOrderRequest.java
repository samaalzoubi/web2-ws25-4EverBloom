package de.fhdo.project.blumeo.dto.order;

import de.fhdo.project.blumeo.entity.order.Address;

import java.util.List;

public record CreateOrderRequest(
        List<Long> bouquetIds,
        List<Integer> quantities,
        Address address
) {
}
