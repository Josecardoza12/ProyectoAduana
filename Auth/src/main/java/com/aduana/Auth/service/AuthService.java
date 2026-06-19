package com.aduana.Auth.service;

import com.aduana.Auth.dto.AuthResponse;
import com.aduana.Auth.dto.LoginRequest;
import com.aduana.Auth.dto.RegisterRequest;
import com.aduana.Auth.model.Usuario;
import com.aduana.Auth.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {

            throw new RuntimeException(
                    "El correo ya está registrado"
            );
        }

        Usuario usuario = new Usuario();

        usuario.setCorreo(
                request.getCorreo()
        );

        usuario.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        usuario.setRol(
                request.getRol()
        );

        usuarioRepository.save(usuario);

        String token =
                jwtService.generarToken(
                        usuario.getCorreo(),
                        usuario.getRol().name()
                );

        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {

        Usuario usuario =
                usuarioRepository.findByCorreo(
                        request.getCorreo()
                ).orElseThrow(
                        () -> new RuntimeException(
                                "Usuario no encontrado"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                usuario.getPassword()
        )) {

            throw new RuntimeException(
                    "Contraseña incorrecta"
            );
        }

        String token =
                jwtService.generarToken(
                        usuario.getCorreo(),
                        usuario.getRol().name()
                );

        return new AuthResponse(token);
    }
    public Usuario buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}