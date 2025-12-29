package de.fhdo.project.blumeo.controller.order;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.fhdo.project.blumeo.dto.order.CreateOrderRequest;
import de.fhdo.project.blumeo.dto.order.OrderDTO;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import de.fhdo.project.blumeo.services.OrderService;

import org.springframework.http.HttpStatus;

//Lab5
@CrossOrigin
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Get all orders or filter by userId
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders(
            @RequestParam(required = false) Long userId) {
        
        if (userId != null) {
            // Get orders for specific customer
            return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
        }
        
        // Get all orders (for admin)
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping("/{userId}")
    public ResponseEntity<OrderDTO> createOrder(
            @PathVariable Long userId,
            @RequestBody CreateOrderRequest request) {

        OrderDTO dto = orderService.createOrder(
                userId,
                request.bouquetIds(),
                request.quantities(),
                request.address()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {

        return ResponseEntity.ok(orderService.updateStatus(orderId, status));
    }

       @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long orderId) {

        OrderDTO dto = orderService.getOrder(orderId);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(dto);
    }

    // Update order (items, total, etc.)
    @PutMapping("/{orderId}")
    public ResponseEntity<OrderDTO> updateOrder(
            @PathVariable Long orderId,
            @RequestBody OrderDTO orderUpdate) {
        
        return ResponseEntity.ok(orderService.updateOrder(orderId, orderUpdate));
    }
}
