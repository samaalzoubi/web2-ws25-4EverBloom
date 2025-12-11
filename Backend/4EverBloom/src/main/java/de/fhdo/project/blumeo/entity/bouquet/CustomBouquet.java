package de.fhdo.project.blumeo.entity.bouquet;

import de.fhdo.project.blumeo.entity.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

//Lab3
@Entity
@DiscriminatorValue("CUSTOM")
@Getter
@Setter
@NoArgsConstructor
public class CustomBouquet extends Bouquet {

    @OneToMany(mappedBy = "bouquet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BouquetComponent> components = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User designedByCustomer;

    @Enumerated(EnumType.STRING)
    @Column(name = "wrapping")
    private Wrapping wrapping = Wrapping.SIMPLE;

    public void addComponent(BouquetComponent c) {
        c.setBouquet(this);
        this.components.add(c);
    }

    public void removeComponent(BouquetComponent c) {
        c.setBouquet(null);
        this.components.remove(c);
    }
}

