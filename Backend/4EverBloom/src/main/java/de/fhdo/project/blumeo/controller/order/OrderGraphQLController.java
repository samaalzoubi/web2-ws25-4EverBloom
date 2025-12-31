package de.fhdo.project.blumeo.controller.order;

import de.fhdo.project.blumeo.dto.order.OrderDTO;
import de.fhdo.project.blumeo.entity.order.Address;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import de.fhdo.project.blumeo.services.OrderService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class OrderGraphQLController {

    private final OrderService orderService;

    public OrderGraphQLController(OrderService orderService) {
        this.orderService = orderService;
    }

    /* -------------------- Queries -------------------- */

    @QueryMapping
    public OrderDTO order(@Argument Long orderId) {
        return orderService.getOrder(orderId);
    }

    @QueryMapping
    public List<OrderDTO> ordersByUser(@Argument Long userId) {
        return orderService.getOrdersByUserId(userId);
    }

    /* -------------------- Mutations -------------------- */

    @MutationMapping
    public OrderDTO createOrder(
            @Argument Long userId,
            @Argument CreateOrderRequest request
    ) {
        return orderService.createOrder(
                userId,
                request.bouquetIds(),
                request.quantities(),
                request.toAddress()
        );
    }

    @MutationMapping
    public OrderDTO updateOrderStatus(
            @Argument Long orderId,
            @Argument OrderStatus status
    ) {
        return orderService.updateStatus(orderId, status);
    }

    /* -------------------- GraphQL Input Records -------------------- */

    public record AddressInput(
            String streetAddress,
            String city,
            String state,
            String zipCode
    ) {
        public Address toAddress() {
            Address a = new Address();
            a.setStreetAddress(streetAddress);
            a.setCity(city);
            a.setState(state);
            a.setZipCode(zipCode);
            return a;
        }
    }

    public record CreateOrderRequest(
            List<Long> bouquetIds,
            List<Integer> quantities,
            AddressInput address
    ) {
        public Address toAddress() {
            return address.toAddress();
        }
    }
}
