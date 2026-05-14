package de.fhdo.project.blumeo.controller.dashboard;

import de.fhdo.project.blumeo.dto.dashboard.TopProductDTO;
import de.fhdo.project.blumeo.services.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/top-products")
    public ResponseEntity<?> getTopProducts(
            @RequestParam Long shopId,
            @RequestParam(required = false) String sortBy,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        try {
            List<TopProductDTO> topProducts = dashboardService.getTopProducts(shopId, sortBy, startDate, endDate);

            return ResponseEntity.ok(topProducts);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity
                    .internalServerError()
                    .body("An unexpected error occurred while loading top products.");
        }
    }
}
