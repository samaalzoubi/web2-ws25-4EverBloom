package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.utils.mapper.UserMapper;
import de.fhdo.project.blumeo.dto.userService.RegisterRequest;
import de.fhdo.project.blumeo.dto.userService.UserDTO;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.repository.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userConverter;

    public UserService(UserRepository userRepository, UserMapper userConverter) {
        this.userRepository = userRepository;
        this.userConverter = userConverter;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userConverter::toDTO)
                .toList();
    }

    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(userConverter::toDTO)
                .orElse(null);
    }

    @Transactional
    public UserDTO createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User entity = userConverter.toEntity(request);
        User saved = userRepository.save(entity);
        return userConverter.toDTO(saved);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO dto) {
        return userRepository.findById(id)
                .map(user -> {
                    userConverter.updateEntity(user, dto);
                    User saved = userRepository.save(user);
                    return userConverter.toDTO(saved);
                })
                .orElse(null);
    }

    public UserDTO authenticate(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .map(userConverter::toDTO)
                .orElse(null);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
