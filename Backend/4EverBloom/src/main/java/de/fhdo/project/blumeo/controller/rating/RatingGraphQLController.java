package de.fhdo.project.blumeo.controller.rating;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import de.fhdo.project.blumeo.dto.rating.RatingRequestDTO;
import de.fhdo.project.blumeo.dto.rating.RatingResponseDTO;
import de.fhdo.project.blumeo.entity.order.Order;
import de.fhdo.project.blumeo.entity.order.OrderLine;
import de.fhdo.project.blumeo.repository.order.OrderRepository;
import de.fhdo.project.blumeo.services.RatingService;

@Controller
public class RatingGraphQLController {

    private final OrderRepository orderRepository;
    private final RatingService ratingService;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public RatingGraphQLController(OrderRepository orderRepository, RatingService ratingService) {
        this.orderRepository = orderRepository;
        this.ratingService = ratingService;
    }

    @QueryMapping
    public List<OrderGraphQL> ordersByCustomer(@Argument Long customerId) {
        List<Order> orders = orderRepository.findByCustomer_Id(customerId);
        return orders.stream()
                .map(this::toGraphQLOrder)
                .collect(Collectors.toList());
    }

    @QueryMapping
    public List<RatingGraphQL> ratingsByOrder(@Argument Long orderId) {
        return ratingService.getRatingsByOrderId(orderId).stream()
                .map(r -> new RatingGraphQL(r.getId(), r.getRatingScore(), r.getReview(), r.getOrderId(), r.getCustomerId()))
                .collect(Collectors.toList());
    }

    @MutationMapping
    public RatingGraphQL submitRating(@Argument RatingInput input) {
        RatingRequestDTO dto = new RatingRequestDTO();
        dto.setOrderId(input.orderId());
        dto.setCustomerId(input.customerId());
        dto.setRatingScore(input.ratingScore());
        dto.setReview(input.review());

        RatingResponseDTO saved = ratingService.saveRating(dto);
        return new RatingGraphQL(saved.getId(), saved.getRatingScore(), saved.getReview(), saved.getOrderId(), saved.getCustomerId());
    }

    private OrderGraphQL toGraphQLOrder(Order order) {
        String addressStr = order.getDeliveryAddress() != null 
            ? order.getDeliveryAddress().getStreetAddress() + ", " + order.getDeliveryAddress().getCity() 
            : null;
        return new OrderGraphQL(
                order.getOrderId(),
                order.getStatus() != null ? order.getStatus().name() : "",
                order.getOrderDate() != null ? formatter.format(order.getOrderDate()) : null,
                addressStr,
                order.getTotalAmount(),
                order.getOrderLines().stream()
                        .map(this::toGraphQLLine)
                        .collect(Collectors.toList())
        );
    }

    private OrderLineGraphQL toGraphQLLine(OrderLine line) {
        return new OrderLineGraphQL(
                line.getBouquet() != null ? line.getBouquet().getName() : "Item",
                line.getQuantity(),
                line.getPrice() != null ? line.getPrice().doubleValue() : null
        );
    }

    public record RatingInput(Long orderId, Long customerId, Integer ratingScore, String review) {}
    public record RatingGraphQL(Long id, Integer ratingScore, String review, Long orderId, Long customerId) {}
    public record OrderGraphQL(Long id, String status, String orderDate, String deliveryAddress, Double totalAmount, List<OrderLineGraphQL> items) {}
    public record OrderLineGraphQL(String bouquetName, Integer quantity, Double price) {}
}
