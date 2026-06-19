package com.example.declaracion_SAG.dto;

import lombok.Data;

@Data
public class AuthUserResponse {
    private Long id;
    private String nombre;
    private String email;
    private String rol;
}
