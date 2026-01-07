package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.dto.order.OrderDTO;
import de.fhdo.project.blumeo.entity.bouquet.Bouquet;
import de.fhdo.project.blumeo.entity.order.Address;
import de.fhdo.project.blumeo.entity.order.Order;
import de.fhdo.project.blumeo.entity.order.OrderLine;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import de.fhdo.project.blumeo.entity.user.Role;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.repository.bouquet.BouquetRepository;
import de.fhdo.project.blumeo.repository.order.OrderRepository;
import de.fhdo.project.blumeo.repository.user.UserRepository;
import de.fhdo.project.blumeo.utils.mapper.order.OrderMapper;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

//Lab3
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
    public OrderDTO createOrder(Long userId, List<Long> bouquetIds, List<Integer> quantities, Address address) {


        // ---- Basic validation 
        if (bouquetIds == null || quantities == null || bouquetIds.isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }
        if (bouquetIds.size() != quantities.size()) {
            throw new IllegalArgumentException("Bouquet IDs and quantities must have same size");
        }


        User customer = userRepository.findByIdAndRole(userId, Role.CUSTOMER).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setDeliveryAddress(address);
        order.setStatus(OrderStatus.CREATED);
// total represents totalamount
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
    /**
     * Get all orders for a customer (Lab 5 REST endpoint)
     */
    public List<OrderDTO> getOrdersByCustomer(Long customerId) {
        return orderRepository
                .findByCustomer_Id(customerId)
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    @Transactional
    public OrderDTO updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(status);
        Order saved = orderRepository.save(order);
        return orderMapper.toDto(saved);
    }

    public List<OrderDTO> getOrdersByShopId(Long shopId) {
        List<Order> orders = orderRepository.findByShop_Id(shopId);

        if (orders.isEmpty()) {
            return List.of();
        }

        return orders.stream()
                .map(orderMapper::toDto)
                .toList();
    }


    // Get orders by user ID (for customer)
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByCustomer_Id(userId);

        if (orders.isEmpty()) {
            return List.of();
        }

        return orders.stream()
                .map(orderMapper::toDto)
                .toList();
    }

    // Update order (items, total, etc.)
    @Transactional
    public OrderDTO updateOrder(Long orderId, OrderDTO orderUpdate) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        
        // Update fields as needed
        if (orderUpdate.getAddress() != null) {
            order.setDeliveryAddress(orderUpdate.getAddress());
        }
        
        if (orderUpdate.getTotalAmount() != null) {
            order.setTotalAmount(orderUpdate.getTotalAmount());
        }
        
        // Note: Updating order lines would require more complex logic
        // For now, we're keeping it simple
        
        return orderMapper.toDto(order);
    }
}
