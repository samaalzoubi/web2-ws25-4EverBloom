package de.fhdo.project.blumeo.controller.shopprofile;

import de.fhdo.project.blumeo.dto.bouquet.PremadeBouquetSummary;
import de.fhdo.project.blumeo.dto.user.UserDTO;
import de.fhdo.project.blumeo.services.BouquetService;
import de.fhdo.project.blumeo.services.CartService;
import de.fhdo.project.blumeo.services.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/shops/profile")
public class ShopProfileViewController {

    private final UserService userService;
    private final BouquetService bouquetService;
    private final CartService cartService;

    public ShopProfileViewController(UserService userService, BouquetService bouquetService, CartService cartService) {
        this.userService = userService;
        this.bouquetService = bouquetService;
        this.cartService = cartService;
    }

    @GetMapping("/{shopId}")
    public String shopProfile(@PathVariable Long shopId,
                              Model model) {

        UserDTO shop = userService.getUserById(shopId);
        List<PremadeBouquetSummary> bouquets = bouquetService.getPremadeBouquetsForShop(shopId);

        model.addAttribute("shop", shop);
        model.addAttribute("bouquets", bouquets);

        model.addAttribute("isLoggedIn", true);

        return "shop/shop-profile";
    }

    @PostMapping("/cart/items")
    public String addItemToCart(@RequestParam Long bouquetId,
                                @RequestParam Long shopId,
                                RedirectAttributes redirectAttributes) {

        Long userId = 2L;

        try {
            cartService.addItemToCart(userId, bouquetId);

            redirectAttributes.addFlashAttribute("successBouquetId", bouquetId);
            redirectAttributes.addFlashAttribute("success", "Bouquet added to cart");
        } catch (IllegalStateException ex) {
            redirectAttributes.addFlashAttribute("errorBouquetId", bouquetId);
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }

        return "redirect:/shops/profile/" + shopId;
    }
}