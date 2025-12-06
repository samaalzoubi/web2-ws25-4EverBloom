package de.fhdo.project.blumeo.dto.order;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class OrderLineDTO {
    private Long orderLineId;
    private Long bouquetId;
    private String bouquetName;
    private int quantity;
    private BigDecimal price;
}
