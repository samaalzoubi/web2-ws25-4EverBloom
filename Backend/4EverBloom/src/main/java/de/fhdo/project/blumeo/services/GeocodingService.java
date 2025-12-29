package de.fhdo.project.blumeo.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.fhdo.project.blumeo.dto.geocoding.GeoResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class GeocodingService {

    @Value("${geocode.api-key}")
    private String apiKey;

    private static final String GEOCODE_URL = "https://geocode.maps.co/search";

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public GeoResult geocodeAddress(String address) {
        try {
            String encodedQuery = URLEncoder.encode(address, StandardCharsets.UTF_8).replace("+", "%20");

            String url = GEOCODE_URL + "?q=" + encodedQuery + "&api_key=" + apiKey;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .header("Accept", "application/json")
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            String body = response.body();
            if (body == null || body.isBlank() || body.equals("[]")) {
                return null;
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(body);

            if (!root.isArray() || root.size() == 0) {
                return null;
            }

            JsonNode first = root.get(0);
            double lat = first.path("lat").asDouble();
            double lon = first.path("lon").asDouble();

            return new GeoResult(lat, lon);

        } catch (Exception e) {
            throw new RuntimeException("Geocoding failed: " + e.getMessage(), e);
        }
    }
}



