package com.aduana.msvalidaciones.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
public class DeclaracionSagClient {

    private final WebClient webClient;

    public DeclaracionSagClient(
            WebClient.Builder webClientBuilder,
            @Value("${ms.declaracion.url}") String declaracionUrl
    ) {
        this.webClient = webClientBuilder
                .baseUrl(declaracionUrl)
                .build();
    }

    public List<Map<String, Object>> listarDeclaraciones(String token) {
        return webClient.get()
                .uri("/api/v1/declaraciones")
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();
    }

    public List<Map<String, Object>> listarPasajeros(String token) {
        return webClient.get()
                .uri("/api/v1/pasajeros")
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();
    }

    public List<Map<String, Object>> listarMenores(String token) {
        return webClient.get()
                .uri("/api/v1/menores")
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();
    }

    public Map<String, Object> obtenerDeclaracionPorId(String token, Long id) {
        return webClient.get()
                .uri("/api/v1/declaraciones/{id}", id)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> obtenerPasajeroPorId(String token, Long id) {
        return webClient.get()
                .uri("/api/v1/pasajeros/{id}", id)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> obtenerMenorPorId(String token, Long id) {
        return webClient.get()
                .uri("/api/v1/menores/{id}", id)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> aprobarDeclaracion(String token, Long id) {
        return webClient.put()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/v1/declaraciones/{id}/estado")
                        .queryParam("estado", "APROBADA")
                        .build(id))
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> rechazarDeclaracion(String token, Long id) {
        return webClient.put()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/v1/declaraciones/{id}/estado")
                        .queryParam("estado", "RECHAZADA")
                        .build(id))
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> enviarRevisionDeclaracion(String token, Long id) {
        return webClient.put()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/v1/declaraciones/{id}/estado")
                        .queryParam("estado", "EN_REVISION")
                        .build(id))
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> aprobarPasajero(String token, Long id) {
        return webClient.patch()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/v1/pasajeros/{id}/estado")
                        .queryParam("estado", "APROBADO")
                        .build(id))
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> rechazarPasajero(String token, Long id) {
        return webClient.patch()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/v1/pasajeros/{id}/estado")
                        .queryParam("estado", "RECHAZADO")
                        .build(id))
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> enviarRevisionPasajero(String token, Long id) {
        return webClient.patch()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/v1/pasajeros/{id}/estado")
                        .queryParam("estado", "EN_REVISION")
                        .build(id))
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> aprobarMenor(String token, Long id) {
        return webClient.patch()
                .uri("/api/v1/menores/{id}/aprobar", id)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> rechazarMenor(String token, Long id, String observacion) {
        return webClient.patch()
                .uri("/api/v1/menores/{id}/rechazar", id)
                .header("Authorization", token)
                .bodyValue(observacion == null ? "" : observacion)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> enviarRevisionMenor(String token, Long id) {
        return webClient.patch()
                .uri("/api/v1/menores/{id}/revision", id)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }
}
