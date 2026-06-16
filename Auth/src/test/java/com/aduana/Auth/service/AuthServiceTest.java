package com.aduana.Auth.service;

import com.aduana.Auth.dto.AuthResponse;
import com.aduana.Auth.dto.LoginRequest;
import com.aduana.Auth.dto.RegisterRequest;
import com.aduana.Auth.model.Rol;
import com.aduana.Auth.model.Usuario;
import com.aduana.Auth.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void deberiaRegistrarUsuario() {

        RegisterRequest request = new RegisterRequest();

        request.setCorreo("admin@aduana.cl");
        request.setPassword("123456");
        request.setRol(Rol.ADMIN);

        when(usuarioRepository.findByCorreo(
                "admin@aduana.cl"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("123456"))
                .thenReturn("password_encriptada");

        when(jwtService.generarToken(
                "admin@aduana.cl"))
                .thenReturn("token_prueba");

        AuthResponse response =
                authService.register(request);

        assertNotNull(response);

        verify(usuarioRepository)
                .save(any(Usuario.class));
    }

    @Test
    void deberiaHacerLogin() {

        Usuario usuario = new Usuario();

        usuario.setCorreo("admin@aduana.cl");
        usuario.setPassword("password_encriptada");

        LoginRequest request =
                new LoginRequest();

        request.setCorreo(
                "admin@aduana.cl"
        );

        request.setPassword(
                "123456"
        );

        when(usuarioRepository.findByCorreo(
                "admin@aduana.cl"))
                .thenReturn(Optional.of(usuario));

        when(passwordEncoder.matches(
                "123456",
                "password_encriptada"
        )).thenReturn(true);

        when(jwtService.generarToken(
                "admin@aduana.cl"
        )).thenReturn("token_prueba");

        AuthResponse response =
                authService.login(request);

        assertNotNull(response);
    }
}