package de.fhdo.project.blumeo.services;

import de.fhdo.project.blumeo.dto.dashboard.TopProductDTO;
import de.fhdo.project.blumeo.entity.order.OrderStatus;
import de.fhdo.project.blumeo.entity.user.Role;
import de.fhdo.project.blumeo.entity.user.User;
import de.fhdo.project.blumeo.repository.order.OrderLineRepository;
import de.fhdo.project.blumeo.repository.user.UserRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DashboardServiceTest {

    @Mock
    OrderLineRepository orderLineRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    User shop;

    @InjectMocks
    DashboardService dashboardService;

    private static final Long SHOP_ID = 1L;

    private static List<TopProductDTO> revenueTopProducts;
    private static List<TopProductDTO> quantityTopProducts;

    @BeforeAll
    static void createTestData() {
        revenueTopProducts = List.of(
                new TopProductDTO(1L, "Romantic Roses", 4L, new BigDecimal("516.00")),
                new TopProductDTO(2L, "Mrs. Lilac", 2L, new BigDecimal("338.00")),
                new TopProductDTO(3L, "Cotton Candy", 3L, new BigDecimal("267.00"))
        );

        quantityTopProducts = List.of(
                new TopProductDTO(1L, "Romantic Roses", 4L, new BigDecimal("516.00")),
                new TopProductDTO(2L, "Cotton Candy", 3L, new BigDecimal("267.00")),
                new TopProductDTO(3L, "Spring Mix", 2L, new BigDecimal("59.80"))
        );
    }

    @BeforeEach
    void setUp() {
        when(userRepository.findByIdAndRole(SHOP_ID, Role.OWNER))
                .thenReturn(Optional.of(shop));
    }

    @Test
    void getTopProducts_T1_revenueWithoutDateFilter() {
        when(orderLineRepository.findTopProductsByRevenue(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                isNull(),
                isNull(),
                any(PageRequest.class))
        ).thenReturn(revenueTopProducts);

        List<TopProductDTO> result = dashboardService.getTopProducts(
                SHOP_ID,
                "revenue",
                null,
                null
        );

        assertSame(revenueTopProducts, result);

        verify(orderLineRepository).findTopProductsByRevenue(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                isNull(),
                isNull(),
                any(PageRequest.class)
        );
    }

    @Test
    void getTopProducts_T2_quantityWithOnlyStartDate() {
        LocalDate startDate = LocalDate.of(2026, 6, 2);
        LocalDateTime expectedStartDateTime = startDate.atStartOfDay();

        when(orderLineRepository.findTopProductsByQuantity(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                eq(expectedStartDateTime),
                isNull(),
                any(PageRequest.class))
        ).thenReturn(quantityTopProducts);

        List<TopProductDTO> result = dashboardService.getTopProducts(
                SHOP_ID,
                "quantity",
                startDate,
                null
        );

        assertSame(quantityTopProducts, result);

        verify(orderLineRepository).findTopProductsByQuantity(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                eq(expectedStartDateTime),
                isNull(),
                any(PageRequest.class)
        );
    }

    @Test
    void getTopProducts_T3_revenueWithOnlyEndDate() {
        LocalDate endDate = LocalDate.of(2003, 10, 18);
        LocalDateTime expectedEndDateTime = endDate.plusDays(1).atStartOfDay();

        when(orderLineRepository.findTopProductsByRevenue(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                isNull(),
                eq(expectedEndDateTime),
                any(PageRequest.class))
        ).thenReturn(revenueTopProducts);

        List<TopProductDTO> result = dashboardService.getTopProducts(
                SHOP_ID,
                "REVENUE",
                null,
                endDate
        );

        assertSame(revenueTopProducts, result);

        verify(orderLineRepository).findTopProductsByRevenue(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                isNull(),
                eq(expectedEndDateTime),
                any(PageRequest.class)
        );
    }

    @Test
    void getTopProducts_T4_quantityDefaultWithValidDateRange() {
        LocalDate startDate = LocalDate.of(2026, 4, 5);
        LocalDate endDate = LocalDate.of(2026, 6, 7);

        LocalDateTime expectedStartDateTime = startDate.atStartOfDay();
        LocalDateTime expectedEndDateTime = endDate.plusDays(1).atStartOfDay();

        when(orderLineRepository.findTopProductsByQuantity(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                eq(expectedStartDateTime),
                eq(expectedEndDateTime),
                any(PageRequest.class)
        )).thenReturn(quantityTopProducts);

        List<TopProductDTO> result = dashboardService.getTopProducts(
                SHOP_ID,
                null,
                startDate,
                endDate
        );

        assertSame(quantityTopProducts, result);

        verify(orderLineRepository).findTopProductsByQuantity(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                eq(expectedStartDateTime),
                eq(expectedEndDateTime),
                any(PageRequest.class)
        );
    }

    @Test
    void getTopProducts_T5_revenueWithSameStartAndEndDate() {
        LocalDate startDate = LocalDate.of(2026, 6, 30);
        LocalDate endDate = LocalDate.of(2026, 6, 30);

        LocalDateTime expectedStartDateTime = startDate.atStartOfDay();
        LocalDateTime expectedEndDateTime = endDate.plusDays(1).atStartOfDay();

        when(orderLineRepository.findTopProductsByRevenue(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                eq(expectedStartDateTime),
                eq(expectedEndDateTime),
                any(PageRequest.class)
        )).thenReturn(revenueTopProducts);

        List<TopProductDTO> result = dashboardService.getTopProducts(
                SHOP_ID,
                "revenue",
                startDate,
                endDate
        );

        assertSame(revenueTopProducts, result);

        verify(orderLineRepository).findTopProductsByRevenue(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                eq(expectedStartDateTime),
                eq(expectedEndDateTime),
                any(PageRequest.class)
        );
    }

    @Test
    void getTopProducts_T6_invalidSortByThrowsException() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> dashboardService.getTopProducts(
                        SHOP_ID,
                        "test",
                        null,
                        null
                )
        );

        String expectedMessage = "Select appropriate sorting mechanism: either 'quantity' or 'revenue'";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));

        verify(orderLineRepository, never()).findTopProductsByRevenue(
                any(),
                any(),
                any(),
                any(),
                any()
        );

        verify(orderLineRepository, never()).findTopProductsByQuantity(
                any(),
                any(),
                any(),
                any(),
                any()
        );
    }

    @Test
    void getTopProducts_T7_startDateAfterEndDateThrowsException() {
        LocalDate startDate = LocalDate.of(2025, 5, 23);
        LocalDate endDate = LocalDate.of(2024, 4, 20);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> dashboardService.getTopProducts(
                        SHOP_ID,
                        "QUANTITY",
                        startDate,
                        endDate
                )
        );

        String expectedMessage = "Start date must not be after end date";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));

        verify(orderLineRepository, never()).findTopProductsByRevenue(
                any(),
                any(),
                any(),
                any(),
                any()
        );

        verify(orderLineRepository, never()).findTopProductsByQuantity(
                any(),
                any(),
                any(),
                any(),
                any()
        );
    }

    @Test
    void getTopProducts_T8_futureStartDateThrowsException() {
        LocalDate futureStartDate = LocalDate.now().plusDays(1);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> dashboardService.getTopProducts(
                        SHOP_ID,
                        null,
                        futureStartDate,
                        null
                )
        );

        String expectedMessage = "Start date must not be in the future";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));

        verify(orderLineRepository, never()).findTopProductsByRevenue(
                any(),
                any(),
                any(),
                any(),
                any()
        );

        verify(orderLineRepository, never()).findTopProductsByQuantity(
                any(),
                any(),
                any(),
                any(),
                any()
        );
    }

    @Test
    void getTopProducts_T9_quantityWithoutDateFilter() {
        when(orderLineRepository.findTopProductsByQuantity(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                isNull(),
                isNull(),
                any(PageRequest.class)
        )).thenReturn(quantityTopProducts);

        List<TopProductDTO> result = dashboardService.getTopProducts(
                SHOP_ID,
                "quantity",
                null,
                null
        );

        assertSame(quantityTopProducts, result);

        verify(orderLineRepository).findTopProductsByQuantity(
                eq(shop),
                eq(OrderStatus.DELIVERED),
                isNull(),
                isNull(),
                any(PageRequest.class)
        );
    }
}
