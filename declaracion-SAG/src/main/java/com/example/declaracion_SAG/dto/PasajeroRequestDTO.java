package com.example.declaracion_SAG.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PasajeroRequestDTO {

    @NotNull(message = "El userId es obligatorio")
    private Long userId;

    @NotBlank(message = "Los nombres son obligatorios")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    @NotBlank(message = "El RUT es obligatorio")
    private String rut;

    @NotBlank(message = "El pasaporte es obligatorio")
    private String pasaporte;

    @Email(message = "El email debe tener un formato válido")
    @NotBlank(message = "El email es obligatorio")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    private String telefono;

    @NotBlank(message = "La nacionalidad es obligatoria")
    private String nacionalidad;

    @NotBlank(message = "El país de origen es obligatorio")
    private String paisOrigen;

    @NotBlank(message = "El país de destino es obligatorio")
    private String paisDestino;

    @NotNull(message = "La fecha de ingreso es obligatoria")
    private LocalDate fechaIngreso;

    @NotBlank(message = "El motivo del viaje es obligatorio")
    private String motivoViaje;

    private String observaciones;
}
