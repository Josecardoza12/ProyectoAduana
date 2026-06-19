package com.aduana.Auth.dto;

import com.aduana.Auth.model.Rol;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthUserResponse {

    private Long id;
    private String correo;
    private Rol rol;
}