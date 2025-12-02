package de.fhdo.project.blumeo.dto.userService;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String email;
    private String password;
}