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

        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent() && usuarioRepository.findByRut(request.getRut()).isPresent()) {

            throw new RuntimeException(
                    "El correo ya está registrado y el rut ya estan registrados"
            );
        }

        Usuario usuario = new Usuario();

        usuario.setCorreo(
                request.getCorreo()
        );
        usuario.setRut(request.getRut());
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
                        usuario.getRol().name(),
                        usuario.getRut()
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
        if (!usuario.getRut().equals(request.getRut())) {
            throw new RuntimeException("El rut no corresponde al correo");
        }

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
                        usuario.getRol().name(),
                        usuario.getRut()
                );

        return new AuthResponse(token);
    }
    public Usuario buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario buscarPorRut(String rut){
        return usuarioRepository.findByRut(rut).orElseThrow(
                () -> new RuntimeException(("Usuario no encontrado"))
        );

    }
}