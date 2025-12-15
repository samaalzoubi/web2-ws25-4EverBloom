package de.fhdo.project.blumeo.repository.order;

import de.fhdo.project.blumeo.entity.order.OrderLine;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

//Lab3
public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
    boolean existsByBouquet_BouquetIdAndOrder_StatusIn(Long bouquetId, Collection<OrderStatus> statuses);
}
