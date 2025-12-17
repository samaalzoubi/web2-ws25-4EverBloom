package de.fhdo.project.blumeo.entity.bouquet;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

//Lab3
@Entity
@DiscriminatorValue("PREMADE")
@Getter
@Setter
@NoArgsConstructor
public class PremadeBouquet extends Bouquet {

    @Size(max = 512)
    @Column(length = 512)
    private String imageUrl;

    @ElementCollection(targetClass = Occasion.class)
    @CollectionTable(
            name = "bouquet_occasions",
            joinColumns = @JoinColumn(name = "bouquet_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "occasion")
    private Set<Occasion> occasions = new HashSet<>();
}

