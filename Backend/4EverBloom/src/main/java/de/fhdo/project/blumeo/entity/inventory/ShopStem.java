package de.fhdo.project.blumeo.entity.inventory;

import de.fhdo.project.blumeo.entity.flower.Flower;
import de.fhdo.project.blumeo.entity.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(
        name = "shop_stems",
        uniqueConstraints = @UniqueConstraint(
            name = "uq_shop_flower", columnNames = {"shop_owner_id", "flower_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
public class ShopStem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stemId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shop_owner_id", nullable = false)
    private User shopOwner;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "flower_id", nullable = false)
    private Flower flower;

    @Min(0)
    @Column(nullable = false)
    private int quantity;

    @NotNull
    @DecimalMin(value = "0.00")
    @Column(nullable = false)
    private BigDecimal price;

    @NotBlank
    @Size(max = 512)
    @Column(nullable = false, length = 512)
    private String imageUrl;
}

