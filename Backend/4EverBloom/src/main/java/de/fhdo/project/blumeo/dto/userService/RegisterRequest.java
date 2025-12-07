package de.fhdo.project.blumeo.dto.userService;

import de.fhdo.project.blumeo.entity.user.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private Role role; // OWNER or USER
}