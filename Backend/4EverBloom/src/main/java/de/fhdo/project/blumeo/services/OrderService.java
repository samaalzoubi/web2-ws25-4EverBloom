package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.dto.order.OrderDTO;
import de.fhdo.project.blumeo.entity.bouquet.Bouquet;
import de.fhdo.project.blumeo.entity.order.Order;
import de.fhdo.project.blumeo.entity.order.OrderLine;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import de.fhdo.project.blumeo.entity.userService.User;
import de.fhdo.project.blumeo.repository.bouquet.BouquetRepository;
import de.fhdo.project.blumeo.repository.order.OrderRepository;
import de.fhdo.project.blumeo.repository.userService.UserRepository;
import de.fhdo.project.blumeo.utils.mapper.OrderMapper;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BouquetRepository bouquetRepository;
    private final OrderMapper orderMapper;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                        BouquetRepository bouquetRepository, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.bouquetRepository = bouquetRepository;
        this.orderMapper = orderMapper;
    }

    @Transactional
    public OrderDTO createOrder(Long userId, List<Long> bouquetIds, List<Integer> quantities, String address) {

        User customer = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setDeliveryAddress(address);
        order.setStatus(OrderStatus.CREATED);

        double total = 0;

        for (int i = 0; i < bouquetIds.size(); i++) {
            Bouquet bouquet = bouquetRepository.findById(bouquetIds.get(i))
                    .orElseThrow(() -> new IllegalArgumentException("Bouquet not found"));

            int qty = quantities.get(i);

            OrderLine line = new OrderLine();
            line.setOrder(order);
            line.setBouquet(bouquet);
            line.setQuantity(qty);
            line.setPrice(bouquet.getPrice());

            order.addOrderLine(line);

            total += bouquet.getPrice().doubleValue() * qty;
        }

        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);

        return orderMapper.toDto(saved);
    }

    public OrderDTO getOrder(Long id) {
        return orderRepository.findById(id)
                .map(orderMapper::toDto)
                .orElse(null);
    }

    @Transactional
    public OrderDTO updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow();
        order.setStatus(status);
        return orderMapper.toDto(order);
    }
}
