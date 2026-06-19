package com.aduanas.msvehiculo.client;

import com.aduanas.msvehiculo.dto.AuthUserResponse;
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