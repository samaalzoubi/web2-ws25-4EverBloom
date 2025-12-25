package de.fhdo.project.blumeo.utils.mapper.user;

import de.fhdo.project.blumeo.dto.user.RegisterRequest;
import de.fhdo.project.blumeo.dto.user.UserDTO;
import de.fhdo.project.blumeo.entity.user.User;
import org.springframework.stereotype.Component;

//Lab3
@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setDate(user.getDate());
        dto.setAddress(user.getAddress());
        dto.setLogo(user.getLogo());
        dto.setLink(user.getLink());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setDescription(user.getDescription());
        dto.setShopName(user.getShopName());
        dto.setFlowerShopType(user.getFlowerShopType());
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
        user.setPassword(dto.getPassword());
    }
}
