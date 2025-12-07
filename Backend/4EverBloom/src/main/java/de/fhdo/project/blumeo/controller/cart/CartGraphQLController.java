package de.fhdo.project.blumeo.controller.cart;

import de.fhdo.project.blumeo.dto.cart.CartResponseDTO;
import de.fhdo.project.blumeo.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

//Lab6 (Schema-first-approach)
//Standard HTTP-endpoint POST /graphql
@Controller
public class CartGraphQLController {
    private final CartService cartService;

    @Autowired
    public CartGraphQLController(CartService cartService) {
        this.cartService = cartService;
    }

    @QueryMapping("activeCart")
    public CartResponseDTO getActiveCart(@Argument Long userId) {
        return cartService.getActiveCartForUser(userId);
    }

    @MutationMapping
    public CartResponseDTO updateItemQuantity(@Argument Long userId, @Argument Long itemId, @Argument int quantityDelta) {
        return cartService.updateItemQuantity(userId, itemId, quantityDelta);
    }

    @MutationMapping
    public CartResponseDTO removeItem(@Argument Long userId, @Argument Long itemId) {
        return cartService.removeItem(userId, itemId);
    }

    @MutationMapping
    public CartResponseDTO clearCart(@Argument Long userId) {
        cartService.clearCart(userId);
        return cartService.getActiveCartForUser(userId);
    }

    @MutationMapping
    public CartResponseDTO addItem(@Argument Long userId, @Argument Long bouquetId) {
        return cartService.addItemToCart(userId, bouquetId);
    }
}
