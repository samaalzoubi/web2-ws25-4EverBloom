package de.fhdo.project.blumeo.entity.bouquet;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@DiscriminatorValue("PREMADE")
@Getter
@Setter
@NoArgsConstructor
public class PremadeBouquet extends Bouquet {
    @ElementCollection(targetClass = Occasion.class)
    @CollectionTable(
            name = "bouquet_occasions",
            joinColumns = @JoinColumn(name = "bouquet_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "occasion", nullable = false)
    private Set<Occasion> occasions = new HashSet<>();
}

