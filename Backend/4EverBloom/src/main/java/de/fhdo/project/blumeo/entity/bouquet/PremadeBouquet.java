package de.fhdo.project.blumeo.entity.bouquet;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

