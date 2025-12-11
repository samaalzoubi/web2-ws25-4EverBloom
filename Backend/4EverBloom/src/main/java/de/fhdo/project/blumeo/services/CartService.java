package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.dto.cart.CartResponseDTO;
import de.fhdo.project.blumeo.entity.bouquet.Bouquet;
import de.fhdo.project.blumeo.entity.cart.Cart;
import de.fhdo.project.blumeo.entity.cart.CartItem;
import de.fhdo.project.blumeo.entity.cart.CartStatus;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.repository.bouquet.BouquetRepository;
import de.fhdo.project.blumeo.repository.cart.CartItemRepository;
import de.fhdo.project.blumeo.repository.cart.CartRepository;
import de.fhdo.project.blumeo.utils.mapper.cart.CartMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    private final BouquetRepository bouquetRepository;
    private final CartMapper cartMapper;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, CartMapper cartMapper, BouquetRepository bouquetRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartMapper = cartMapper;
        this.bouquetRepository = bouquetRepository;
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

        Cart updated = cartRepository.save(cart);
        return cartMapper.toDto(updated);
    }

    @Transactional
    public CartResponseDTO addItemToCart(Long userId, Long bouquetId) {
        Cart cart = cartRepository.findByUserIdAndCartStatus(userId, CartStatus.ACTIVE)
                .orElseGet(() -> createEmptyCart(userId));

        Bouquet bouquet = bouquetRepository.findById(bouquetId).orElseThrow(() -> new EntityNotFoundException("Bouquet not found"));
        User bouquetShopOwner = bouquet.getShopOwner();
        if (bouquetShopOwner == null) {
            throw new IllegalStateException("Bouquet has no shop owner assigned.");
        }

        User cartShopOwner = cart.getShopOwner();

        if (cartShopOwner == null) {
            cart.setShopOwner(bouquetShopOwner);
        } else if (!cartShopOwner.getId().equals(bouquetShopOwner.getId())) {
            throw new IllegalStateException("Cart already belongs to another shop. Clear cart first.");
        }

        CartItem item = cart.getItems().stream()
                .filter(cartItem -> {
                    Bouquet bouquetInCart = cartItem.getBouquet();
                    return bouquetInCart != null && bouquetInCart.getBouquetId().equals(bouquet.getBouquetId());
                })
                .findFirst()
                .orElse(null);

        if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setBouquet(bouquet);
            item.setQuantity(1);
            item.setUnitPrice(bouquet.getPrice());
            cart.getItems().add(item);
        } else {
            item.setQuantity(item.getQuantity() + 1);
        }

        Cart updated = cartRepository.save(cart);

        return cartMapper.toDto(updated);
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

        Cart updated = cartRepository.save(cart);

        return cartMapper.toDto(updated);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserIdAndCartStatus(userId, CartStatus.ACTIVE)
                .orElseThrow(() -> new IllegalStateException("Cart not found"));

        cart.getItems().clear();
        cart.setShopOwner(null);
        cartRepository.save(cart);
    }

    private Cart createEmptyCart(Long userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setCartStatus(CartStatus.ACTIVE);
        cart.setItems(new ArrayList<>());
        return cartRepository.save(cart);
    }
}
