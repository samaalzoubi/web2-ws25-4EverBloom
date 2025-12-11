package de.fhdo.project.blumeo.entity.bouquet;

import de.fhdo.project.blumeo.entity.inventory.ShopStem;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "bouquet_components",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_bouquet_stem", columnNames = {"bouquet_id", "shop_stem_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
public class BouquetComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bouquet_id", nullable = false)
    private Bouquet bouquet;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shop_stem_id", nullable = false)
    private ShopStem shopStem;

    @Min(1)
    @Column(nullable = false)
    private int requiredQuantity;
}

