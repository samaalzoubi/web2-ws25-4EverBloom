package de.fhdo.project.blumeo.dto.order;

import java.math.BigDecimal;
import java.util.List;

import de.fhdo.project.blumeo.entity.order.Address;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import lombok.Data;

//Lab3
@Data
public class OrderDTO {
    private Long orderId;
    private Long customerId;
    private OrderStatus status;

    private String orderDate;
    private String deliveryDate;

    private Address address;

    private BigDecimal totalAmount;

    private List<OrderLineDTO> orderLines;

    private Integer rating;

    public String getTotalAmountFormatted() {
        if (totalAmount == null) return "0.00";
        return String.format("%.2f", totalAmount);
    }
}
