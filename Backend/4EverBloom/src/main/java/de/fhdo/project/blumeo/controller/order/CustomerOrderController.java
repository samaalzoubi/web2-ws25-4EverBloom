package de.fhdo.project.blumeo.controller.order;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import de.fhdo.project.blumeo.services.OrderService;

@Controller
public class CustomerOrderController {

    private final OrderService orderService;

    public CustomerOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/customer/orders")
    public String showCustomerOrders(@RequestParam Long customerId, Model model) {
        model.addAttribute("customerId", customerId);
        return "Rating/customers_Rating";
    }
}
