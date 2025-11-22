package de.fhdo.project.blumeo.entity.inventory;

import de.fhdo.project.blumeo.entity.flower.Flower;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(
        name = "shop_stems"
        /*uniqueConstraints = @UniqueConstraint(
                name = "uq_shop_flower", columnNames = {"shop_id", "flower_id"}
        )*/
)
@Getter
@Setter
@NoArgsConstructor
public class ShopStem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stemId;

    //TODO: comment out when FlowerShop-Entity was created
    /*@ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shop_id", nullable = false)
    private FlowerShop shop;*/

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

