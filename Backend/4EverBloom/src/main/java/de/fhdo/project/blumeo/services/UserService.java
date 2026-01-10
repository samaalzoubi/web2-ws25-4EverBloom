package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.entity.bouquet.CustomBouquetRepository;
import de.fhdo.project.blumeo.entity.user.Role;
import de.fhdo.project.blumeo.exception.EmailAlreadyExistsException;
import de.fhdo.project.blumeo.utils.mapper.user.UserMapper;
import de.fhdo.project.blumeo.dto.user.RegisterRequest;
import de.fhdo.project.blumeo.dto.user.UserDTO;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.repository.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

//Lab3
@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userConverter;
    private final CustomBouquetRepository customBouquetRepository;

    public UserService(UserRepository userRepository, UserMapper userConverter, CustomBouquetRepository customBouquetRepository) {
        this.userRepository = userRepository;
        this.userConverter = userConverter;
        this.customBouquetRepository = customBouquetRepository;
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
    public UserDTO updateUser(Long id, UserDTO dto, MultipartFile logo) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getUsername() != null && !dto.getUsername().isBlank()) {
            user.setUsername(dto.getUsername());
        }

        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            user.setEmail(dto.getEmail());
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(dto.getPassword());
        }

        User saved = userRepository.save(user);

        UserDTO result = new UserDTO();
        result.setId(saved.getId());
        result.setUsername(saved.getUsername());
        result.setEmail(saved.getEmail());
        result.setRole(saved.getRole());

        return result;
    }


    public UserDTO authenticate(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password))
                .map(userConverter::toDTO)
                .orElse(null);
    }

    @Transactional
    public void deleteUser(Long id) {

        customBouquetRepository.deleteByDesignedByCustomer_Id(id);

        userRepository.deleteById(id);
    }
    }