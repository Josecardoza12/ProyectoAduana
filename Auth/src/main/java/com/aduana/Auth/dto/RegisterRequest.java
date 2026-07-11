package com.aduana.Auth.dto;

import com.aduana.Auth.model.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @Email(message = "Correo inválido")
    @NotBlank(message = "El correo es obligatorio")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(
            min = 8,
            message = "La contraseña debe tener mínimo 8 caracteres"
    )
    private String password;
    @NotBlank(message = "El rut es obligatorio")
    @Size(max = 10, message = "El rut debe tener maximo 10 caracteres")
    private String rut;

    @NotNull(message = "Debe seleccionar un rol")
    private Rol rol;
}