package com.example.declaracion_SAG.client;

import com.example.declaracion_SAG.dto.AuthUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;

import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;


@Component
public class AuthClient {

    private final WebClient webClient;

    public AuthClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("http://localhost:8081")
                .build();
    }

    public Mono<AuthUserResponse> obtenerUsuarioAutenticado(String token) {
        return webClient.get()
                .uri("/auth/me")
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(AuthUserResponse.class);
    }
}