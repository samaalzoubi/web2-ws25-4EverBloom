package de.fhdo.project.blumeo.controller.rating;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import de.fhdo.project.blumeo.dto.rating.RatingRequestDTO;
import de.fhdo.project.blumeo.entity.order.Order;
import de.fhdo.project.blumeo.repository.order.OrderRepository;
import de.fhdo.project.blumeo.repository.rating.RatingRepository;
import de.fhdo.project.blumeo.services.RatingService;
import jakarta.validation.Valid;

@Controller
public class RatingViewController {

    private final RatingService ratingService;
    private final OrderRepository orderRepository;
    private final RatingRepository ratingRepository;

    public RatingViewController(RatingService ratingService, OrderRepository orderRepository, 
                                RatingRepository ratingRepository) {
        this.ratingService = ratingService;
        this.orderRepository = orderRepository;
        this.ratingRepository = ratingRepository;
    }

    @GetMapping("/customer/orders")
    public String showCustomerOrders(@RequestParam(name = "customerId", required = false, defaultValue = "2") Long customerId,
                                      Model model) {
        List<Order> orders = orderRepository.findByCustomer_Id(customerId);
        
        // Check which orders have ratings
        Map<Long, Boolean> hasRating = new HashMap<>();
        for (Order order : orders) {
            boolean rated = ratingRepository.findByOrder_OrderIdAndCustomer_Id(order.getOrderId(), customerId).isPresent();
            hasRating.put(order.getOrderId(), rated);
        }
        
        model.addAttribute("customerId", customerId);
        model.addAttribute("orders", orders);
        model.addAttribute("hasRating", hasRating);
        return "Rating/customers_Rating";
    }

    @PostMapping("/orders/{orderId}/rating")
    public String submitRating(@PathVariable Long orderId,
                               @Valid @ModelAttribute("ratingRequest") RatingRequestDTO ratingRequest,
                               BindingResult bindingResult,
                               RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("error", "Please provide a rating between 1 and 5.");
            return "redirect:/customer/orders";
        }

        ratingRequest.setOrderId(orderId);
        try {
            ratingService.saveRating(ratingRequest);
            redirectAttributes.addFlashAttribute("success", "Thank you for your rating!");
        } catch (RuntimeException ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }

        return "redirect:/customer/orders";
    }
}
