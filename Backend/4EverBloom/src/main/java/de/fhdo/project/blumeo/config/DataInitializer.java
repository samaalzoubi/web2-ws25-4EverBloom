package de.fhdo.project.blumeo.config;

import de.fhdo.project.blumeo.entity.bouquet.CustomBouquet;
import de.fhdo.project.blumeo.entity.bouquet.Wrapping;
import de.fhdo.project.blumeo.entity.userService.Role;
import de.fhdo.project.blumeo.entity.userService.User;
import de.fhdo.project.blumeo.repository.bouquet.BouquetRepository;
import de.fhdo.project.blumeo.repository.userService.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BouquetRepository bouquetRepository;

    public DataInitializer(UserRepository userRepository, BouquetRepository bouquetRepository) {
        this.userRepository = userRepository;
        this.bouquetRepository = bouquetRepository;
    }

    @Override
    public void run(String... args) {
        // Create test user with ID 1
        if (userRepository.count() == 0) {
            User user = new User();
            user.setUsername("Alice");
            user.setEmail("alice@example.com");
            user.setPassword("password123");
            user.setRole(Role.USER);
            user.setBalance(500.0);
            userRepository.save(user);
            System.out.println("Test user created: Alice (ID: " + user.getId() + ")");
        }

        // Create test bouquets
        if (bouquetRepository.count() == 0) {
            CustomBouquet bouquet1 = new CustomBouquet();
            bouquet1.setName("Sunny Day Bouquet");
            bouquet1.setPrice(new BigDecimal("49.99"));
            bouquet1.setDescription("Bright and cheerful flowers");
            bouquet1.setWrapping(Wrapping.SIMPLE);
            bouquetRepository.save(bouquet1);

            CustomBouquet bouquet2 = new CustomBouquet();
            bouquet2.setName("Rose Garden Delight");
            bouquet2.setPrice(new BigDecimal("35.75"));
            bouquet2.setDescription("Classic roses arrangement");
            bouquet2.setWrapping(Wrapping.LUXURY);
            bouquetRepository.save(bouquet2);

            CustomBouquet bouquet3 = new CustomBouquet();
            bouquet3.setName("Wildflower Wonder");
            bouquet3.setPrice(new BigDecimal("29.99"));
            bouquet3.setDescription("Natural wildflowers mix");
            bouquet3.setWrapping(Wrapping.SIMPLE);
            bouquetRepository.save(bouquet3);

            System.out.println("Test bouquets created (IDs: 1, 2, 3)");
        }
    }
}
