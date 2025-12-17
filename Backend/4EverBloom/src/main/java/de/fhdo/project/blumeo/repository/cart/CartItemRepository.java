package de.fhdo.project.blumeo.repository.cart;

import de.fhdo.project.blumeo.entity.cart.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

//Lab3
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

}
