package de.fhdo.project.blumeo.entity.bouquet;

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

    //TODO: comment out when Customer-Entity was created
    /*@ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer designedByCustomer;*/

    @Enumerated(EnumType.STRING)
    @Column(name = "wrapping", nullable = false)
    private Wrapping wrapping = Wrapping.SIMPLE;
}

