package de.fhdo.project.blumeo.dto.payment;

import lombok.Data;

//Lab3
@Data
public class CheckoutFormDTO {

    // Contact Information
    private String fullName;
    private String email;
    private String phoneNumber;

    // Delivery Information
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;

    // Payment Information (in a real application would be realised through Payment Provider)
    private String cardNumber;
    private String cardholderName;
    private String expiryDate;
    private String cvv;
}


