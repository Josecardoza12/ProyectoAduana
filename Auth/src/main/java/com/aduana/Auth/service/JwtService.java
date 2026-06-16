package com.aduana.Auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "tu_clave_secreta_muy_larga_y_segura_de_32_caracteres_minimo_12345";

    private SecretKey getSignInKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(
                        java.util.Base64.getEncoder()
                                .encodeToString(
                                        SECRET_KEY.getBytes()
                                )
                );

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generarToken(
            String correo,
            String rol
    ) {

        return Jwts.builder()
                .subject(correo)
                .claim("role", rol)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis() + 3600000
                        )
                )
                .signWith(getSignInKey())
                .compact();
    }

    public String extraerCorreo(String token) {

        Claims claims =
                Jwts.parser()
                        .verifyWith(getSignInKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

        return claims.getSubject();
    }

    public String extraerRol(String token) {

        Claims claims =
                Jwts.parser()
                        .verifyWith(getSignInKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

        return claims.get("role", String.class);
    }

    public boolean esTokenValido(String token) {

        try {

            Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }
}