package de.fhdo.project.blumeo.entity.bouquet;

import de.fhdo.project.blumeo.entity.cart.CartItem;
import de.fhdo.project.blumeo.entity.userService.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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

    @Size(max = 512)
    @Column(length = 512)
    private String imageUrl;

    @OneToMany(mappedBy = "bouquet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BouquetComponent> components = new ArrayList<>();

    @OneToMany(mappedBy = "bouquet")
    private List<CartItem> cartItems = new ArrayList<>();

    public void addComponent(BouquetComponent c) {
        c.setBouquet(this);
        this.components.add(c);
    }

    public void removeComponent(BouquetComponent c) {
        c.setBouquet(null);
        this.components.remove(c);
    }
}

