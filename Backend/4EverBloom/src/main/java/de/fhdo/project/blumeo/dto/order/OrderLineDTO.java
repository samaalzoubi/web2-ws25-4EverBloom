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


    public BigDecimal getLineTotal() {
        if (price == null) return BigDecimal.ZERO;
        return price.multiply(BigDecimal.valueOf(quantity));
    }


    public String getPriceFormatted() {
        if (price == null) return "0.00";
        return String.format("%.2f", price);
    }


    public String getLineTotalFormatted() {
        return String.format("%.2f", getLineTotal());
    }
}
