package de.fhdo.project.blumeo.repository.order;

import de.fhdo.project.blumeo.dto.dashboard.TopProductDTO;
import de.fhdo.project.blumeo.entity.order.OrderLine;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import de.fhdo.project.blumeo.entity.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

//Lab3
public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
    boolean existsByBouquet_BouquetIdAndOrder_StatusIn(Long bouquetId, Collection<OrderStatus> statuses);

    @Query("""
       SELECT new de.fhdo.project.blumeo.dto.dashboard.TopProductDTO(
            b.bouquetId,
            b.name,
            SUM(ol.quantity),
            SUM(ol.lineTotal)
        )
        FROM OrderLine ol
        JOIN ol.order o
        JOIN ol.bouquet b
        WHERE o.shop = :shop
          AND o.status = :status
          AND (:startDate IS NULL OR o.orderDate >= :startDate)
          AND (:endDate IS NULL OR o.orderDate < :endDate)
        GROUP BY b.bouquetId, b.name
        ORDER BY SUM(ol.lineTotal) DESC
    """)
        List<TopProductDTO> findTopProductsByRevenue(
                @Param("shop") Object shop,
                @Param("status") OrderStatus status,
                @Param("startDate") LocalDateTime startDate,
                @Param("endDate") LocalDateTime endDate,
                Pageable pageable
        );

        @Query("""
        SELECT new de.fhdo.project.blumeo.dto.dashboard.TopProductDTO(
            b.bouquetId,
            b.name,
            SUM(ol.quantity),
            SUM(ol.lineTotal)
        )
        FROM OrderLine ol
        JOIN ol.order o
        JOIN ol.bouquet b
        WHERE o.shop = :shop
          AND o.status = :status
          AND (:startDate IS NULL OR o.orderDate >= :startDate)
          AND (:endDate IS NULL OR o.orderDate < :endDate)
        GROUP BY b.bouquetId, b.name
        ORDER BY SUM(ol.quantity) DESC
    """)
        List<TopProductDTO> findTopProductsByQuantity(
                @Param("shop") User shop,
                @Param("status") OrderStatus status,
                @Param("startDate") LocalDateTime startDate,
                @Param("endDate") LocalDateTime endDate,
                Pageable pageable
        );
}
