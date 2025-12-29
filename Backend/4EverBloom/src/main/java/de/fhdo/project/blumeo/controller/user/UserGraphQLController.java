package de.fhdo.project.blumeo.controller.user;

import de.fhdo.project.blumeo.dto.user.RegisterRequest;
import de.fhdo.project.blumeo.dto.user.UserDTO;
import de.fhdo.project.blumeo.services.UserService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class UserGraphQLController {

    private final UserService userService;

    public UserGraphQLController(UserService userService) {
        this.userService = userService;
    }

    @QueryMapping
    public List<UserDTO> allOwners() {
        return userService.getAllOwners();
    }

    @QueryMapping
    public UserDTO userById(@Argument Long id) {
        return userService.getUserById(id);
    }

    @MutationMapping
    public UserDTO registerUser(@Argument RegisterRequest request) {
        return userService.createUser(request);
    }

    @MutationMapping
    public UserDTO login(@Argument String email, @Argument String password) {
        return userService.authenticate(email, password);
    }

    @MutationMapping
    public UserDTO updateUser(@Argument Long id,
                              @Argument String username,
                              @Argument String email,
                              @Argument String password) {
        UserDTO dto = new UserDTO();
        dto.setUsername(username);
        dto.setEmail(email);
        dto.setPassword(password);

        return userService.updateUser(id, dto);
    }

    @MutationMapping
    public Boolean deleteUser(@Argument Long id) {
        userService.deleteUser(id);
        return true;
    }
}
