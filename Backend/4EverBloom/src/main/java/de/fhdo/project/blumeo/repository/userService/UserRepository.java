package de.fhdo.project.blumeo.repository.userService;

import de.fhdo.project.blumeo.entity.userService.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
}