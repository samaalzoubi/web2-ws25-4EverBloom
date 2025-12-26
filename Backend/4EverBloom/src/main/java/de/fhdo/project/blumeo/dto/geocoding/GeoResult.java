package de.fhdo.project.blumeo.dto.geocoding;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GeoResult {

    private double lat;

    private double lon;

    public GeoResult(double latitude, double longitude) {
        this.lat = latitude;
        this.lon = longitude;
    }
}
