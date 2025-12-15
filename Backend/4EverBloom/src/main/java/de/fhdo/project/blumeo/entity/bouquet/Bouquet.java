package de.fhdo.project.blumeo.entity.bouquet;

import de.fhdo.project.blumeo.entity.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

//Lab3
@Entity
@Table(name = "bouquet")
@DiscriminatorColumn(name = "bouquet_type")
@Getter
@Setter
@NoArgsConstructor
public abstract class Bouquet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bouquetId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "shop_owner_id", nullable = false)
    private User shopOwner;

    @NotBlank
    @Column(nullable = false)
    private String name;

    private String description;

    @NotNull
    @DecimalMin("0.00")
    @Column(nullable = false)
    private BigDecimal price;
}

