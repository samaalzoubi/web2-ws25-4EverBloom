package de.fhdo.project.blumeo.controller.checkout;

import de.fhdo.project.blumeo.dto.cart.CartItemDTO;
import de.fhdo.project.blumeo.dto.cart.CartResponseDTO;
import de.fhdo.project.blumeo.dto.order.OrderDTO;
import de.fhdo.project.blumeo.dto.payment.CheckoutFormDTO;
import de.fhdo.project.blumeo.entity.order.Address;
import de.fhdo.project.blumeo.services.CartService;
import de.fhdo.project.blumeo.services.OrderService;
import org.springframework.data.domain.jaxb.SpringDataJaxb;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.apache.logging.log4j.util.Strings.isBlank;

//Lab4
@Controller
@RequestMapping("/api/v1/checkout")
public class CheckoutPageController {
    private final CartService cartService;
    private final OrderService orderService;

    public CheckoutPageController(CartService cartService, OrderService orderService) {
        this.cartService = cartService;
        this.orderService = orderService;
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

        CartResponseDTO cart = cartService.getActiveCartForUser(userId);

        if (isBlank(form.getStreetAddress()) || isBlank(form.getCity())
                || isBlank(form.getState()) || isBlank(form.getZipCode())) {

            model.addAttribute("cart", cart);
            model.addAttribute("checkoutForm", form);
            model.addAttribute("isLoggedIn", true);
            model.addAttribute("error", "Please fill in the delivery address (street, city, state, ZIP)");
            return "checkout";
        }

        List<Long> bouquetIds = cart.getItems().stream()
                .map(CartItemDTO::getBouquetId)
                .toList();

        List<Integer> quantities = cart.getItems().stream()
                .map(CartItemDTO::getQuantity)
                .toList();

        Address address = new Address();
        address.setStreetAddress(form.getStreetAddress());
        address.setCity(form.getCity());
        address.setState(form.getState());
        address.setZipCode(form.getZipCode());

        try {
            OrderDTO order = orderService.createOrder(userId, bouquetIds, quantities, address);

            cartService.clearCart(userId);

            return "redirect:/orders/" + order.getOrderId();

        } catch (IllegalArgumentException ex) {
            model.addAttribute("cart", cart);
            model.addAttribute("checkoutForm", form);
            model.addAttribute("isLoggedIn", true);
            model.addAttribute("error", ex.getMessage());
            return "checkout";
        }
    }

}
