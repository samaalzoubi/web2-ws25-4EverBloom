package de.fhdo.project.blumeo.repository.cart;

import de.fhdo.project.blumeo.entity.cart.Cart;
import de.fhdo.project.blumeo.entity.cart.CartStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserIdAndCartStatus(Long userId, CartStatus status);
}
