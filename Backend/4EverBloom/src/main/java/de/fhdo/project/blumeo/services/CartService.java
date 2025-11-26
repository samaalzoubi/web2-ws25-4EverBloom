package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.dto.CartResponseDTO;
import de.fhdo.project.blumeo.entity.cart.Cart;
import de.fhdo.project.blumeo.entity.cart.CartItem;
import de.fhdo.project.blumeo.entity.cart.CartStatus;
import de.fhdo.project.blumeo.repository.cart.CartItemRepository;
import de.fhdo.project.blumeo.repository.cart.CartRepository;
import de.fhdo.project.blumeo.utils.mapper.CartMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CartMapper cartMapper;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, CartMapper cartMapper) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartMapper = cartMapper;
    }

    @Transactional
    public CartResponseDTO getActiveCartForUser(Long userId) {
        Optional<Cart> optionalCart = cartRepository.findByUserIdAndCartStatus(userId, CartStatus.ACTIVE);

        Cart cart = optionalCart.orElseGet(() -> createEmptyCart(userId));

        return cartMapper.toDto(cart);
    }


    @Transactional
    public CartResponseDTO updateItemQuantity(Long userId, Long itemId, int quantityDelta) {

        Cart cart = cartRepository.findByUserIdAndCartStatus(userId, CartStatus.ACTIVE).orElseThrow(() -> new IllegalStateException("Cart not found"));
        CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new IllegalStateException("CartItem not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalStateException("Item does not belong to this cart.");
        }

        int newQuantity = item.getQuantity() + quantityDelta;

        if (newQuantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(newQuantity);
        }

        //Gesamtpreis neu berechnen
        //recalcTotal(cart);

        Cart updated = cartRepository.save(cart);
        return cartMapper.toDto(updated);
    }

    @Transactional
    public /*CartDto*/ Cart addItemToCart(Long userId /*AddCartItemRequest request*/) {

        // method currently a placeholder; commented real logic

        /*Bouquet bouquet = bouquetRepository.findById(request.getBouquetId()).orElseThrow(() -> new EntityNotFoundException("Bouquet not found"));*/

        /*if (cart.getShop() == null) {
            cart.setShop(bouquet.getShop());
        } else if (!cart.getShop().getId().equals(bouquet.getShop().getId())) {
            throw new IllegalStateException("Cart already belongs to another shop. Clear cart first.");
        }*/

        /*CartItem item = cart.getItems().stream()
                .filter(ci -> ci.getBouquet().getId().equals(bouquet.getId()))
                .findFirst()
                .orElse(null);*/

        /*if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setBouquet(bouquet);
            item.setQuantity(request.getQuantity());
            item.setUnitPriceAtAddTime(bouquet.getPrice());
            cart.getItems().add(item);
        } else {
            item.setQuantity(item.getQuantity() + request.getQuantity());
        }*/

        //recalcTotal(cart);

        //Cart updated = cartRepository.save(cart);

        //return cartMapper.toDto(updated);
        return null;
    }

    @Transactional
    public CartResponseDTO removeItem(Long userId, Long itemId) {

        Cart cart = cartRepository.findByUserIdAndCartStatus(userId, CartStatus.ACTIVE).orElseThrow(() -> new IllegalStateException("No active cart for user " + userId));

        CartItem item = cart.getItems().stream()
                .filter(ci -> ci.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Item not found in this cart"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        //recalcTotal(cart);

        Cart updated = cartRepository.save(cart);

        return cartMapper.toDto(updated);
    }

    @Transactional
    public void clearCart(Long userId) {

        cartRepository.findByUserIdAndCartStatus(userId, CartStatus.ACTIVE)
                .ifPresent(cart -> {
                    cart.getItems().clear();
                    //cart.setShop(null);
                });
    }

    private Cart createEmptyCart(Long userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setCartStatus(CartStatus.ACTIVE);
        cart.setItems(new ArrayList<>());
        return cartRepository.save(cart);
    }
}
