package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.dto.dashboard.TopProductDTO;
import de.fhdo.project.blumeo.dto.dashboard.TopProductSorting;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import de.fhdo.project.blumeo.entity.user.Role;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.repository.order.OrderLineRepository;
import de.fhdo.project.blumeo.repository.user.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardService {
    private final OrderLineRepository orderLineRepository;

    private final UserRepository userRepository;

    public DashboardService(OrderLineRepository orderLineRepository, UserRepository userRepository) {
        this.orderLineRepository = orderLineRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TopProductDTO> getTopProducts(Long shopId, String sortBy, LocalDate startDate, LocalDate endDate) {
        long startTime = System.nanoTime();

        User shop = userRepository.findByIdAndRole(shopId, Role.OWNER).orElseThrow(() -> new IllegalArgumentException("Shop not found: " + shopId));

        TopProductSorting sorting = TopProductSorting.fromRequestParam(sortBy);

        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must not be after end date");
        }

        LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = endDate != null ? endDate.plusDays(1).atStartOfDay() : null;

        List<TopProductDTO> result;

        if (sorting == TopProductSorting.REVENUE) {
            result = orderLineRepository.findTopProductsByRevenue(
                    shop,
                    OrderStatus.DELIVERED,
                    startDateTime,
                    endDateTime,
                    PageRequest.of(0, 3)
            );
        } else {
            result = orderLineRepository.findTopProductsByQuantity(
                    shop,
                    OrderStatus.DELIVERED,
                    startDateTime,
                    endDateTime,
                    PageRequest.of(0, 3)
            );
        }

        long endTime = System.nanoTime();
        long durationMs = (endTime - startTime) / 1000000;

        System.out.println("TopProducts calculation duration: " + durationMs + " ms");

        return result;
    }
}
