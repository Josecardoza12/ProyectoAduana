package com.example.declaracion_SAG.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MenorRequestDTO {

    private Long userId;

    @NotBlank(message = "El nombre del menor es obligatorio")
    private String nombreMenor;

    @NotBlank(message = "El documento del menor es obligatorio")
    private String documentoMenor;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;

    @NotBlank(message = "El nombre del tutor es obligatorio")
    private String nombreTutor;

    @NotBlank(message = "El documento del tutor es obligatorio")
    private String documentoTutor;

    @NotBlank(message = "El parentesco es obligatorio")
    private String parentesco;

    @NotBlank(message = "El teléfono del tutor es obligatorio")
    private String telefonoTutor;

    @NotBlank(message = "El país de origen es obligatorio")
    private String paisOrigen;

    @NotBlank(message = "El país de destino es obligatorio")
    private String paisDestino;

    @NotBlank(message = "El motivo del viaje es obligatorio")
    private String motivoViaje;

    private String observaciones;
}