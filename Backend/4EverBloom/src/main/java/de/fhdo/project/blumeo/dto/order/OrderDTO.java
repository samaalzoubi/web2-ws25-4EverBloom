package de.fhdo.project.blumeo.dto.order;

import de.fhdo.project.blumeo.entity.order.OrderStatus;
import lombok.Data;

import java.util.List;

@Data
public class OrderDTO {
    private Long orderId;
    private Long customerId;
    private OrderStatus status;
    private String deliveryAddress;
    private Double totalAmount;
    private List<OrderLineDTO> orderLines;
}
