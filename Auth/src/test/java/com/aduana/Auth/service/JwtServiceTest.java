package com.aduana.Auth.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private final JwtService jwtService =
            new JwtService();

    @Test
    void deberiaGenerarTokenValido() {

        String token =
                jwtService.generarToken(
                        "admin@aduana.cl"
                );

        assertNotNull(token);

        assertTrue(
                jwtService.esTokenValido(token)
        );
    }

    @Test
    void deberiaExtraerCorreo() {

        String token =
                jwtService.generarToken(
                        "admin@aduana.cl"
                );

        String correo =
                jwtService.extraerCorreo(token);

        assertEquals(
                "admin@aduana.cl",
                correo
        );
    }
}