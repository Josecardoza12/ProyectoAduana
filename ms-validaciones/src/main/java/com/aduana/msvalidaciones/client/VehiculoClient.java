package com.aduana.msvalidaciones.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
public class VehiculoClient {

    private final WebClient webClient;

    public VehiculoClient(
            WebClient.Builder webClientBuilder,
            @Value("${ms.vehiculo.url}") String vehiculoUrl
    ) {
        this.webClient = webClientBuilder
                .baseUrl(vehiculoUrl)
                .build();
    }

    public List<Map<String, Object>> listarVehiculos(String token) {
        return webClient.get()
                .uri("/api/v1/vehiculos")
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();
    }

    public Map<String, Object> obtenerVehiculoPorId(String token, Long id) {
        return webClient.get()
                .uri("/api/v1/vehiculos/{id}", id)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public List<Map<String, Object>> buscarVehiculosPorEstado(String token, String estado) {
        return webClient.get()
                .uri("/api/v1/vehiculos/estado/{estado}", estado)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();
    }

    public Map<String, Object> aprobarVehiculo(String token, Long id) {
        return webClient.patch()
                .uri("/api/v1/vehiculos/{id}/aprobar", id)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> rechazarVehiculo(String token, Long id) {
        return webClient.patch()
                .uri("/api/v1/vehiculos/{id}/rechazar", id)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> enviarRevisionVehiculo(String token, Long id) {
        return webClient.patch()
                .uri("/api/v1/vehiculos/{id}/revision", id)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }
}