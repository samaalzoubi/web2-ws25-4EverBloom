package de.fhdo.project.blumeo.controller.checkout;

import de.fhdo.project.blumeo.dto.CartResponseDTO;
import de.fhdo.project.blumeo.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/v1/checkout")
public class CheckoutController {
    private final CartService cartService;

    @Autowired
    public CheckoutController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/user/{id}")
    public String showCheckout(@PathVariable("id") Long userId, Model model) {
        CartResponseDTO cart = cartService.getActiveCartForUser(userId);

        model.addAttribute("cart", cart);
        //model.addAttribute("checkoutForm", new CheckoutFormDto());

        return "checkout";
    }

}
