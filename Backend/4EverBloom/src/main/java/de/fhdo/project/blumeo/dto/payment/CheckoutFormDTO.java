package de.fhdo.project.blumeo.dto.payment;

import lombok.Data;

//Lab3
@Data
public class CheckoutFormDTO {

    private String fullName;
    private String email;
    private String phoneNumber;

    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;

    private String cardNumber;
    private String cardholderName;
    private String expiryDate;
    private String cvv;
}


