package de.fhdo.project.blumeo.dto.user;

import de.fhdo.project.blumeo.entity.order.Address;
import de.fhdo.project.blumeo.entity.user.Role;
import lombok.Data;
import java.time.LocalTime;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String password;
    private Role role;

    private String phoneNumber;
    private Address address;
    private Double latitude;
    private Double longitude;
    private String shopName;
    private String description;

    private LocalTime openingTime;
    private LocalTime closingTime;

    private String link;
    private String flowerShopType;
    private String deliveryOption;
    private String logo;
}
