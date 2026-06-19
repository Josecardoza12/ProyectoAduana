package com.aduana.msvalidaciones.dto;

import lombok.Data;

@Data
public class AuthUserResponse {

    private Long id;
    private String correo;
    private String rol;
}
