package de.fhdo.project.blumeo.controller.order;

import de.fhdo.project.blumeo.dto.order.OrderDTO;
import de.fhdo.project.blumeo.services.OrderService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/orders")
public class OrderDetailsController {

    private final OrderService orderService;

    public OrderDetailsController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/{orderId}")
    public String showOrderDetails(@PathVariable Long orderId, Model model) {

        OrderDTO order = orderService.getOrder(orderId);

        if (order == null) {
            // Display a friendly page when order does not exist
            return "order/not-found";
        }

        model.addAttribute("order", order);
        model.addAttribute("orderLines", order.getOrderLines());

        return "order/order-details";  // -> templates/order/order-details.html
    }
}
