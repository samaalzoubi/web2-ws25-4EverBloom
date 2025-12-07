package de.fhdo.project.blumeo.entity.bouquet;

import de.fhdo.project.blumeo.entity.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("CUSTOM")
@Getter
@Setter
@NoArgsConstructor
public class CustomBouquet extends Bouquet {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User designedByCustomer;

    @Enumerated(EnumType.STRING)
    @Column(name = "wrapping")
    private Wrapping wrapping = Wrapping.SIMPLE;
}

