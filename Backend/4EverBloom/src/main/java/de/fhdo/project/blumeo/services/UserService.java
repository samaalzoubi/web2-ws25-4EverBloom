package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.entity.user.Role;
import de.fhdo.project.blumeo.exception.EmailAlreadyExistsException;
import de.fhdo.project.blumeo.utils.mapper.user.UserMapper;
import de.fhdo.project.blumeo.dto.user.RegisterRequest;
import de.fhdo.project.blumeo.dto.user.UserDTO;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.repository.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

//Lab3
@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userConverter;

    public UserService(UserRepository userRepository, UserMapper userConverter) {
        this.userRepository = userRepository;
        this.userConverter = userConverter;
    }

    public List<UserDTO> getAllOwners() {
        return userRepository.findAllByRole(Role.OWNER)
                .stream()
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
            throw new EmailAlreadyExistsException("Email already exists");
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
