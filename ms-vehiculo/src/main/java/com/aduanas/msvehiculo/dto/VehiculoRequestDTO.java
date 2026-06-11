package com.aduanas.msvehiculo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class VehiculoRequestDTO {

    // Patente del vehículo
    @NotBlank(message = "La patente es obligatoria")
    private String patente;

    // Marca del vehículo (Toyota, Ford, etc.)
    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    // Modelo del vehículo (Corolla, Ranger, etc.)
    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    // Año del vehículo
    @NotBlank(message = "El año es obligatorio")
    private String anio;

    // Color del vehículo
    @NotBlank(message = "El color es obligatorio")
    private String color;

    // Tipo: PARTICULAR, DIPLOMATICO, CARGA, MOTOCICLETA
    @NotBlank(message = "El tipo de vehículo es obligatorio")
    private String tipoVehiculo;

    // País de origen (AR, CL, PE, BO, BR)
    @NotBlank(message = "El país de origen es obligatorio")
    @Size(min = 2, max = 3, message = "El país debe tener 2 o 3 caracteres")
    private String paisOrigen;

    // RUT del propietario — los demás datos los trae WebClient desde ms-usuarios
    @NotBlank(message = "El RUT del propietario es obligatorio")
    private String rutPropietario;

    // Tipo de movimiento: ENTRADA o SALIDA
    @NotBlank(message = "El tipo de movimiento es obligatorio")
    private String tipoMovimiento;

    // Paso fronterizo (LOS_LIBERTADORES, CHACALLUTA, etc.)
    @NotBlank(message = "El paso fronterizo es obligatorio")
    private String pasoFronterizo;

    // Días de estadía, mínimo 1 y máximo 180
    @NotNull(message = "Los días de estadía son obligatorios")
    @Min(value = 1, message = "Mínimo 1 día")
    @Max(value = 180, message = "Máximo 180 días")
    private Integer diasEstadia;

    // Observaciones opcionales
    private String observaciones;
}