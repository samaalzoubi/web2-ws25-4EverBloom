package de.fhdo.project.blumeo.repository.user;

import de.fhdo.project.blumeo.entity.user.Role;
import de.fhdo.project.blumeo.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

//Lab3
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    Optional<User> findByIdAndRole(Long id, Role role);
    List<User> findAllByRole(Role role);
}