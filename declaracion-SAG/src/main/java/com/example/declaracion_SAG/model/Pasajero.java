package com.example.declaracion_SAG.model;

import com.example.declaracion_SAG.enums.EstadoPasajero;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pasajeros")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pasajero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotBlank(message = "Los nombres son obligatorios")
    @Column(nullable = false, length = 100)
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Column(nullable = false, length = 100)
    private String apellidos;

    @NotBlank(message = "El RUT es obligatorio")
    @Column(nullable = false, length = 20)
    private String rut;

    @NotBlank(message = "El pasaporte es obligatorio")
    @Column(nullable = false, length = 30)
    private String pasaporte;

    @Email(message = "El email debe tener un formato válido")
    @NotBlank(message = "El email es obligatorio")
    @Column(nullable = false, length = 100)
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    @Column(nullable = false, length = 20)
    private String telefono;

    @NotBlank(message = "La nacionalidad es obligatoria")
    @Column(nullable = false, length = 80)
    private String nacionalidad;

    @NotBlank(message = "El país de origen es obligatorio")
    @Column(name = "pais_origen", nullable = false, length = 80)
    private String paisOrigen;

    @NotBlank(message = "El país de destino es obligatorio")
    @Column(name = "pais_destino", nullable = false, length = 80)
    private String paisDestino;

    @NotNull(message = "La fecha de ingreso es obligatoria")
    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDate fechaIngreso;

    @NotBlank(message = "El motivo del viaje es obligatorio")
    @Column(name = "motivo_viaje", nullable = false, length = 100)
    private String motivoViaje;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoPasajero estado;

    @Column(length = 500)
    private String observaciones;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();

        if (estado == null) {
            estado = EstadoPasajero.REGISTRADO;
        }
    }
}
