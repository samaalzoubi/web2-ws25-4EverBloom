package de.fhdo.project.blumeo.entity.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name = "users")
@Data
public class User {

    private Double balance = 0.0;

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

    @NotBlank(message = "Number is required")
    private Integer number;

    @NotBlank(message = "Shop name is required")
    private String shopName;

    @NotBlank(message = "Address is required")
    private String address;

    private String description;

    @NotBlank(message = "Website link is required")
    private String link;

    @NotBlank(message = "Flower shop type is required")
    private String flowerShopType;

    @Email(message = "Invalid picture type")
    @NotBlank(message = "Logo is required")
    private String logo;

    @Email(message = "Invalid date format")
    @NotBlank(message = "opening date is required")
    private Date date;




}