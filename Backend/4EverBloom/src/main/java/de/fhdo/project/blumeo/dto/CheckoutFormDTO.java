package de.fhdo.project.blumeo.dto;

import lombok.Data;

@Data
public class CheckoutFormDTO {
    private String fullName;
    private String phoneNumber;
    private String address;
    private String country;
    private String city;
}

