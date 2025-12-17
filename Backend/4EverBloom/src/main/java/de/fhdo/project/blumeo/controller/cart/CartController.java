package de.fhdo.project.blumeo.controller.cart;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.fhdo.project.blumeo.dto.cart.CartResponseDTO;
import de.fhdo.project.blumeo.services.CartService;

//TODO: Javadoc
//Lab5
@RestController
@RequestMapping(
        value = "/api/v1/cart",
        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE }
)
@CrossOrigin
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CartResponseDTO> getActiveCart(@PathVariable Long userId) {
        CartResponseDTO dto = cartService.getActiveCartForUser(userId);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartResponseDTO> updateItemQuantity(@PathVariable Long userId, @PathVariable Long itemId, @RequestParam int quantityDelta) {
        CartResponseDTO dto = cartService.updateItemQuantity(userId, itemId, quantityDelta);
        return ResponseEntity.ok(dto);
    }


    @DeleteMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartResponseDTO> removeItem(@PathVariable Long userId, @PathVariable Long itemId) {
        CartResponseDTO dto = cartService.removeItem(userId, itemId);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

     @PostMapping("/{userId}/items")
     public ResponseEntity<CartResponseDTO> addItem(@PathVariable Long userId, @RequestParam Long bouquetId) {
          CartResponseDTO dto = cartService.addItemToCart(userId, bouquetId);
          return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }
}

