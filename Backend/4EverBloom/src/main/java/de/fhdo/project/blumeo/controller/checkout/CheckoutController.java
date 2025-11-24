package de.fhdo.project.blumeo.controller.checkout;

import de.fhdo.project.blumeo.dto.CartResponseDTO;
import de.fhdo.project.blumeo.dto.CheckoutFormDTO;
import de.fhdo.project.blumeo.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

//Lab4
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
        model.addAttribute("checkoutForm", new CheckoutFormDTO());

        model.addAttribute("isLoggedIn", true);

        return "checkout";
    }

    @PostMapping("/user/{userId}")
    public String submitCheckout(@PathVariable Long userId,
                                 @ModelAttribute("checkoutForm") CheckoutFormDTO form,
                                 Model model) {

        //Order erzeugen
        //OrderDto order = orderService.placeOrder(userId, form);

        cartService.clearCart(userId);

        // Daten für Bestätigungsseite
        //model.addAttribute("order", order);
        System.out.println("Hey");
        // redirect
        // return "redirect:/orders";
        return "redirect:/api/v1/checkout/user/" + userId;
    }

}
