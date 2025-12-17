package de.fhdo.project.blumeo.entity.bouquet;

import java.util.ArrayList;
import java.util.List;

import de.fhdo.project.blumeo.entity.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

