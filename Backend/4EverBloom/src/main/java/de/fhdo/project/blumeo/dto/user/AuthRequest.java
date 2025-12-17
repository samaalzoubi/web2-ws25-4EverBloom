package de.fhdo.project.blumeo.dto.user;

import lombok.Data;

//Lab3
@Data
public class AuthRequest {
    private String username;
    private String email;
    private String password;
}