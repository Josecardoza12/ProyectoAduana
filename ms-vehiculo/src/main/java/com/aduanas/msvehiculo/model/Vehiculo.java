package com.aduanas.msvehiculo.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import org.springframework.hateoas.RepresentationModel;

@Entity
@Table(name = "vehiculos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Entidad que representa un vehículo registrado en un paso fronterizo")
public class Vehiculo extends RepresentationModel<Vehiculo> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Identificador único del vehículo", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    @Schema(description = "ID del usuario turista autenticado que registra el vehículo")
    private Long userId;

    @NotBlank(message = "La patente es obligatoria")
    @Column(nullable = false, length = 20)
    @Schema(description = "Patente del vehículo", example = "ABCD12", requiredMode = Schema.RequiredMode.REQUIRED)
    private String patente;

    @NotBlank(message = "La marca es obligatoria")
    @Column(nullable = false, length = 50)
    @Schema(description = "Marca del vehículo", example = "Toyota", requiredMode = Schema.RequiredMode.REQUIRED)
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    @Column(nullable = false, length = 50)
    @Schema(description = "Modelo del vehículo", example = "Corolla", requiredMode = Schema.RequiredMode.REQUIRED)
    private String modelo;

    @NotBlank(message = "El año es obligatorio")
    @Column(nullable = false, length = 4)
    @Schema(description = "Año de fabricación del vehículo", example = "2022", requiredMode = Schema.RequiredMode.REQUIRED)
    private String anio;

    @NotBlank(message = "El color es obligatorio")
    @Column(nullable = false, length = 30)
    @Schema(description = "Color del vehículo", example = "Blanco", requiredMode = Schema.RequiredMode.REQUIRED)
    private String color;

    @NotBlank(message = "El tipo de vehículo es obligatorio")
    @Column(nullable = false, length = 20)
    @Schema(description = "Tipo de vehículo: PARTICULAR, DIPLOMATICO, CARGA, MOTOCICLETA", example = "PARTICULAR", requiredMode = Schema.RequiredMode.REQUIRED)
    private String tipoVehiculo;

    @NotBlank(message = "El país de origen es obligatorio")
    @Size(min = 2, max = 3, message = "El país debe tener 2 o 3 caracteres")
    @Column(nullable = false, length = 3)
    @Schema(description = "País de origen del vehículo (AR, CL, PE, BO, BR)", example = "AR", requiredMode = Schema.RequiredMode.REQUIRED)
    private String paisOrigen;

    @NotBlank(message = "El RUT del propietario es obligatorio")
    @Column(nullable = false, length = 20)
    @Schema(description = "RUT o pasaporte del propietario. Los demás datos se consultan al ms-usuarios", example = "12345678-9", requiredMode = Schema.RequiredMode.REQUIRED)
    private String rutPropietario;

    @NotBlank(message = "El tipo de movimiento es obligatorio")
    @Column(nullable = false, length = 10)
    @Schema(description = "Tipo de movimiento: ENTRADA (ingresa a Chile) o SALIDA (sale de Chile)", example = "ENTRADA", requiredMode = Schema.RequiredMode.REQUIRED)
    private String tipoMovimiento;

    @Column(nullable = false, length = 20)
    @Schema(description = "Estado del trámite: PENDIENTE, APROBADO, RECHAZADO, EN_REVISION", example = "PENDIENTE", accessMode = Schema.AccessMode.READ_ONLY)
    private String estado;

    @NotBlank(message = "El paso fronterizo es obligatorio")
    @Column(nullable = false, length = 30)
    @Schema(description = "Paso fronterizo donde se realiza el trámite", example = "LOS_LIBERTADORES", requiredMode = Schema.RequiredMode.REQUIRED)
    private String pasoFronterizo;

    @NotNull(message = "Los días de estadía son obligatorios")
    @Min(value = 1, message = "Mínimo 1 día de estadía")
    @Max(value = 180, message = "Máximo 180 días de estadía")
    @Column(nullable = false)
    @Schema(description = "Días que el vehículo permanecerá en el país (mínimo 1, máximo 180)", example = "30", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer diasEstadia;

    @Column(length = 500)
    @Schema(description = "Observaciones adicionales del funcionario", example = "Turista argentino")
    private String observaciones;

    @Column(nullable = false)
    @Schema(description = "Fecha en que se registró el vehículo, se asigna automáticamente", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
        if (estado == null) estado = "PENDIENTE";
    }
}