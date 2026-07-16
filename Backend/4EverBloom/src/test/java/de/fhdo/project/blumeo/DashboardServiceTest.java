package de.fhdo.project.blumeo;

import de.fhdo.project.blumeo.dto.dashboard.TopProductDTO;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import de.fhdo.project.blumeo.entity.user.Role;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.repository.order.OrderLineRepository;
import de.fhdo.project.blumeo.repository.user.UserRepository;

import de.fhdo.project.blumeo.services.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private OrderLineRepository orderLineRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private DashboardService dashboardService;

    private User shop;

    @BeforeEach
    void setUp() {
        shop = mock(User.class);
    }

    @Test
    void getTopProducts_shouldThrowException_whenShopNotFound() {
        // Arrange
        Long shopId = 99L;

        when(userRepository.findByIdAndRole(shopId, Role.OWNER))
                .thenReturn(Optional.empty());

        // Act + Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> dashboardService.getTopProducts(shopId, "revenue", null, null)
        );

        assertEquals("Shop not found: " + shopId, exception.getMessage());

        verify(userRepository).findByIdAndRole(shopId, Role.OWNER);
        verifyNoInteractions(orderLineRepository);
    }

    @Test
    void getTopProducts_shouldThrowException_whenStartDateIsAfterEndDate() {
        // Arrange
        Long shopId = 1L;

        LocalDate startDate = LocalDate.of(2026, 2, 1);
        LocalDate endDate = LocalDate.of(2026, 1, 1);

        when(userRepository.findByIdAndRole(shopId, Role.OWNER))
                .thenReturn(Optional.of(shop));

        // Act + Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> dashboardService.getTopProducts(shopId, "revenue", startDate, endDate)
        );

        assertEquals("Start date must not be after end date", exception.getMessage());

        verify(userRepository).findByIdAndRole(shopId, Role.OWNER);
        verifyNoInteractions(orderLineRepository);
    }

    @Test
    void getTopProducts_shouldCallRevenueRepository_whenSortingByRevenueAndDatesAreValid() {
        // Arrange
        Long shopId = 1L;

        LocalDate startDate = LocalDate.of(2026, 1, 1);
        LocalDate endDate = LocalDate.of(2026, 1, 31);

        LocalDateTime expectedStartDateTime =
                LocalDateTime.of(2026, 1, 1, 0, 0);

        LocalDateTime expectedEndDateTime =
                LocalDateTime.of(2026, 2, 1, 0, 0);

        List<TopProductDTO> expectedResult = Collections.emptyList();

        when(userRepository.findByIdAndRole(shopId, Role.OWNER))
                .thenReturn(Optional.of(shop));

        when(orderLineRepository.findTopProductsByRevenue(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                eq(expectedStartDateTime),
                eq(expectedEndDateTime),
                any(Pageable.class)
        )).thenReturn(expectedResult);

        // Act
        List<TopProductDTO> result =
                dashboardService.getTopProducts(shopId, "revenue", startDate, endDate);

        // Assert
        assertSame(expectedResult, result);

        verify(orderLineRepository).findTopProductsByRevenue(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                eq(expectedStartDateTime),
                eq(expectedEndDateTime),
                argThat(pageable ->
                        pageable.getPageNumber() == 0 &&
                                pageable.getPageSize() == 3
                )
        );

        verify(orderLineRepository, never()).findTopProductsByQuantity(
                any(),
                any(),
                any(),
                any(),
                any(Pageable.class)
        );
    }

    @Test
    void getTopProducts_shouldCallQuantityRepository_whenSortingIsNotRevenue() {
        // Arrange
        Long shopId = 1L;

        List<TopProductDTO> expectedResult = Collections.emptyList();

        when(userRepository.findByIdAndRole(shopId, Role.OWNER))
                .thenReturn(Optional.of(shop));

        when(orderLineRepository.findTopProductsByQuantity(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                isNull(),
                isNull(),
                any(Pageable.class)
        )).thenReturn(expectedResult);

        // Act
        List<TopProductDTO> result =
                dashboardService.getTopProducts(shopId, "quantity", null, null);

        // Assert
        assertSame(expectedResult, result);

        verify(orderLineRepository).findTopProductsByQuantity(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                isNull(),
                isNull(),
                argThat(pageable ->
                        pageable.getPageNumber() == 0 &&
                                pageable.getPageSize() == 3
                )
        );

        verify(orderLineRepository, never()).findTopProductsByRevenue(
                any(),
                any(),
                any(),
                any(),
                any(Pageable.class)
        );
    }
}