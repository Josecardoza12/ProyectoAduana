package com.aduana.msvalidaciones.client;


import com.aduana.msvalidaciones.dto.AuthUserResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class AuthClient {

    private final WebClient webClient;

    public AuthClient(
            WebClient.Builder webClientBuilder,
            @Value("${ms.auth.url}") String authUrl
    ) {
        this.webClient = webClientBuilder
                .baseUrl(authUrl)
                .build();
    }

    public AuthUserResponse obtenerUsuarioAutenticado(String token) {
        return webClient.get()
                .uri("/auth/me")
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(AuthUserResponse.class)
                .block();
    }
}