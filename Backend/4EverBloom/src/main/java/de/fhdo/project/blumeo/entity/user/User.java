package de.fhdo.project.blumeo.entity.user;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import de.fhdo.project.blumeo.entity.bouquet.CustomBouquet;
import de.fhdo.project.blumeo.entity.order.Address;
import de.fhdo.project.blumeo.entity.order.Order;
import de.fhdo.project.blumeo.entity.rating.Rating;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Embedded
    private Address address;

    private String description;

    private String phoneNumber;

    private String shopName;

    private String link;

    private String flowerShopType;

    private String logo;

    @Column(name = "opening_time")
    private LocalTime openingTime;

    @Column(name = "closing_time")
    private LocalTime closingTime;

    @OneToMany(mappedBy = "designedByCustomer", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<CustomBouquet> customBouquets = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Rating> ratings = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();
}