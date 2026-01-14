package de.fhdo.project.blumeo.controller.user;

import de.fhdo.project.blumeo.dto.user.AuthRequest;
import de.fhdo.project.blumeo.dto.user.UserDTO;
import de.fhdo.project.blumeo.dto.user.RegisterRequest;
import de.fhdo.project.blumeo.services.UserService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

//Lab5
@RestController
@RequestMapping(
        value = "/api/v1/users",
        produces = {
                MediaType.APPLICATION_JSON_VALUE,
                MediaType.APPLICATION_XML_VALUE
        }
)
@CrossOrigin
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        UserDTO user = userService.authenticate(
                request.getEmail(),
                request.getPassword()
        );

        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        return ResponseEntity.ok(user);
    }

    @GetMapping(value = "/owners", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public List<UserDTO> getAllOwners() {
        return userService.getAllOwners();
    }

    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<?> createUser(@RequestBody RegisterRequest request) {
        try {
            UserDTO user = userService.createUser(request);
            return ResponseEntity.status(201).body(user);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping(value = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestPart("user") UserDTO dto,
            @RequestPart(value = "logo", required = false) MultipartFile logo
    ) {
        UserDTO updated = userService.updateUser(id, dto, logo);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
