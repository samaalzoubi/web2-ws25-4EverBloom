package de.fhdo.project.blumeo.repository.order;

import de.fhdo.project.blumeo.entity.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
}
