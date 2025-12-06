package de.fhdo.project.blumeo.repository.order;

import de.fhdo.project.blumeo.entity.order.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
}
