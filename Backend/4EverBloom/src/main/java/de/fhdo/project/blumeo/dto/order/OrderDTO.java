package de.fhdo.project.blumeo.dto.order;

import de.fhdo.project.blumeo.entity.order.OrderStatus;
import lombok.Data;

import java.util.List;

@Data
public class OrderDTO {
    private Long orderId;
    private Long customerId;
    private OrderStatus status;

    private String orderDate;
    private String deliveryDate;

    private String deliveryAddress;
    private Double totalAmount;

    private List<OrderLineDTO> orderLines;


    public String getTotalAmountFormatted() {
        if (totalAmount == null) return "0.00";
        return String.format("%.2f", totalAmount);
    }
}
