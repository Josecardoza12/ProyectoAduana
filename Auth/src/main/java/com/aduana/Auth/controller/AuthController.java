package com.aduana.Auth.controller;

import com.aduana.Auth.dto.AuthResponse;
import com.aduana.Auth.dto.AuthUserResponse;
import com.aduana.Auth.dto.LoginRequest;
import com.aduana.Auth.dto.RegisterRequest;
import com.aduana.Auth.model.Usuario;
import com.aduana.Auth.service.AuthService;
import com.aduana.Auth.service.JwtService;
import lombok.RequiredArgsConstructor;

import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private  final JwtService jwtService;

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request
    ) {

        AuthResponse response =
                authService.register(request);

        response.add(
                WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(
                                AuthController.class
                        ).login(null)
                ).withRel("login")
        );

        return response;
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request
    ) {

        AuthResponse response =
                authService.login(request);

        response.add(
                WebMvcLinkBuilder.linkTo(
                        WebMvcLinkBuilder.methodOn(
                                AuthController.class
                        ).register(null)
                ).withRel("register")
        );

        return response;
    }
    @GetMapping("/me")
    public ResponseEntity<AuthUserResponse> obtenerUsuarioAutenticado(
            @RequestHeader("Authorization") String token
    ) {

        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String jwt = token.substring(7);

        if (!jwtService.esTokenValido(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String correo = jwtService.extraerCorreo(jwt);

        Usuario usuario = authService.buscarPorCorreo(correo);

        AuthUserResponse response = new AuthUserResponse(
                usuario.getId(),
                usuario.getCorreo(),
                usuario.getRol(),
                usuario.getRut()
        );

        return ResponseEntity.ok(response);
    }

}