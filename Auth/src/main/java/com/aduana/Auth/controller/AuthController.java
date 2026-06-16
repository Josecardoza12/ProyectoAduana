package com.aduana.Auth.controller;

import com.aduana.Auth.dto.AuthResponse;
import com.aduana.Auth.dto.LoginRequest;
import com.aduana.Auth.dto.RegisterRequest;
import com.aduana.Auth.service.AuthService;
import lombok.RequiredArgsConstructor;

import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
}