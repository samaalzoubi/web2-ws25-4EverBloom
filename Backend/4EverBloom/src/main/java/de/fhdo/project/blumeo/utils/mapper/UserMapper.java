package de.fhdo.project.blumeo.utils.mapper;

import de.fhdo.project.blumeo.dto.userService.RegisterRequest;
import de.fhdo.project.blumeo.dto.userService.UserDTO;
import de.fhdo.project.blumeo.entity.user.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }

    public User toEntity(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        return user;
    }

    public void updateEntity(User user, UserDTO dto) {
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
    }
}
