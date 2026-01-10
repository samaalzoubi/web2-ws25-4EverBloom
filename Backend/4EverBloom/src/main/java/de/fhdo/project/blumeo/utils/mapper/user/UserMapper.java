package de.fhdo.project.blumeo.utils.mapper.user;

import de.fhdo.project.blumeo.dto.geocoding.GeoResult;
import de.fhdo.project.blumeo.dto.user.RegisterRequest;
import de.fhdo.project.blumeo.dto.user.UserDTO;
import de.fhdo.project.blumeo.entity.order.Address;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.services.GeocodingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

//Lab3
@Component
public class UserMapper {

    private final GeocodingService geocodingService;

    @Autowired
    public UserMapper(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setOpeningTime(user.getOpeningTime());
        dto.setClosingTime(user.getClosingTime());
        dto.setLogo(user.getLogo());
        dto.setLink(user.getLink());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setDescription(user.getDescription());
        dto.setShopName(user.getShopName());
        dto.setFlowerShopType(user.getFlowerShopType());
        dto.setAddress(user.getAddress());

        if (user.getAddress() != null) {
            String addressString = buildAddressString(user.getAddress());
            GeoResult geo = geocodingService.geocodeAddress(addressString);

            if (geo != null) {
                dto.setLatitude(geo.getLat());
                dto.setLongitude(geo.getLon());
            }
        }

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

    private String buildAddressString(Address addr) {
        return String.format("%s, %s %s, %s",
                addr.getStreetAddress(),
                addr.getZipCode(),
                addr.getCity(),
                addr.getState() == null ? "" : addr.getState()
        ).trim();
    }
}
