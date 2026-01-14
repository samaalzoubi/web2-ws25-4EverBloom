package de.fhdo.project.blumeo.controller.user;

import de.fhdo.project.blumeo.dto.user.AuthRequest;
import de.fhdo.project.blumeo.dto.user.RegisterRequest;
import de.fhdo.project.blumeo.dto.user.UserDTO;
import de.fhdo.project.blumeo.services.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

//Lab4
@Controller
@RequestMapping("/users")
public class UserViewController {

    private final UserService userService;

    public UserViewController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/create")
    public String showRegisterForm(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        model.addAttribute("isLoggedIn", false);
        return "Login/UserRegister";
    }

    @PostMapping("/create")
    public String registerUser(@ModelAttribute RegisterRequest registerRequest, Model model) {
        try {
            userService.createUser(registerRequest);
            model.addAttribute("success", "You have been successfully registered!");
        } catch (RuntimeException e) {
            model.addAttribute("error", e.getMessage());
        }
        model.addAttribute("registerRequest", registerRequest);
        model.addAttribute("isLoggedIn", false);
        return "Login/UserRegister";
    }

    @GetMapping("/login")
    public String showLoginForm(Model model) {
        model.addAttribute("authRequest", new AuthRequest());
        model.addAttribute("isLoggedIn", false);
        return "Login/loginPage";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute AuthRequest authRequest, Model model) {
        UserDTO user = userService.authenticate(authRequest.getEmail(), authRequest.getPassword());
        if (user == null) {
            model.addAttribute("error", "Invalid email or password");
            model.addAttribute("authRequest", authRequest);
            model.addAttribute("isLoggedIn", false);
            return "Login/loginPage";
        }
        model.addAttribute("success", "Login successful!");
        model.addAttribute("isLoggedIn", true);
        //In a real server-rendered application we would be redirected to the home-page
        return "Login/loginPage";
    }
}
