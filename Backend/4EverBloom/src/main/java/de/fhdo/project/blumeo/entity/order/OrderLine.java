package de.fhdo.project.blumeo.entity.order;

import de.fhdo.project.blumeo.entity.bouquet.Bouquet;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

//Lab3
@Entity
@Table(name = "order_lines")
@Getter
@Setter
@NoArgsConstructor
public class OrderLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderLineId;

    @ManyToOne(fetch = FetchType.LAZY)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bouquet_id", nullable = false)
    private Bouquet bouquet;

    private int quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;  // price per unit

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;

    @PrePersist
    @PreUpdate
    public void calculateLineTotal() {
        if (price == null) {
            throw new IllegalStateException("OrderLine price must not be null");
        }

        if (quantity <= 0) {
            throw new IllegalStateException("OrderLine quantity must be greater than 0");
        }

        this.lineTotal = price.multiply(BigDecimal.valueOf(quantity));
    }
}
