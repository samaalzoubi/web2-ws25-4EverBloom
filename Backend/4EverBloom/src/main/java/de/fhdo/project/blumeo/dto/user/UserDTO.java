package de.fhdo.project.blumeo.dto.user;

import de.fhdo.project.blumeo.entity.user.Role;
import lombok.Data;

import java.util.Date;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String password;
    private Role role; // OWNER or USER

    private Integer number;
    private String address;
    private String shopName;
    private String description;
    private Date date;
    private String link;
    private String flowerShopType;
    private String logo;






}
