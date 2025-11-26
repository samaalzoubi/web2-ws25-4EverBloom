package de.fhdo.project.blumeo.entity.flower;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "flower",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_flower_name_color_season",
                columnNames = {"name", "color", "season"}
        )
)
public class Flower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long flowerId;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Size(max = 30)
    @Column(nullable = false, length = 30)
    private String season;

    @NotBlank
    @Column(nullable = false)
    private String color;
}

