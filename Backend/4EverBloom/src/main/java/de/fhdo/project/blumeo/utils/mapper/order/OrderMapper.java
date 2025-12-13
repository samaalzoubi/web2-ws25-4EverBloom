package de.fhdo.project.blumeo.utils.mapper.order;

import de.fhdo.project.blumeo.dto.order.OrderDTO;
import de.fhdo.project.blumeo.dto.order.OrderLineDTO;
import de.fhdo.project.blumeo.entity.order.Order;
import de.fhdo.project.blumeo.entity.order.OrderLine;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

import java.util.stream.Collectors;

//Lab3
@Component
public class OrderMapper {


private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public OrderDTO toDto(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setStatus(order.getStatus());
        dto.setAddress(order.getDeliveryAddress());
        dto.setTotalAmount(order.getTotalAmount());


        if (order.getOrderDate() != null) {
            dto.setOrderDate(order.getOrderDate().format(FORMATTER));
        }

        dto.setOrderLines(
                order.getOrderLines().stream().map(this::toDto).collect(Collectors.toList())
        );
        return dto;
    }

    public OrderLineDTO toDto(OrderLine line) {
        OrderLineDTO dto = new OrderLineDTO();
        dto.setOrderLineId(line.getOrderLineId());
        dto.setBouquetId(line.getBouquet().getBouquetId());
        dto.setBouquetName(line.getBouquet().getName());
        dto.setQuantity(line.getQuantity());
        dto.setPrice(line.getPrice());
        return dto;
    }
}
