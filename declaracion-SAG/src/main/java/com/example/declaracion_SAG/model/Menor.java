package com.example.declaracion_SAG.model;


import com.example.declaracion_SAG.enums.EstadoMenor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "menores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotBlank(message = "El nombre del menor es obligatorio")
    @Column(name = "nombre_menor", nullable = false, length = 120)
    private String nombreMenor;

    @NotBlank(message = "El RUT o documento del menor es obligatorio")
    @Column(name = "documento_menor", nullable = false, length = 30)
    private String documentoMenor;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @NotBlank(message = "El nombre del tutor es obligatorio")
    @Column(name = "nombre_tutor", nullable = false, length = 120)
    private String nombreTutor;

    @NotBlank(message = "El documento del tutor es obligatorio")
    @Column(name = "documento_tutor", nullable = false, length = 30)
    private String documentoTutor;

    @NotBlank(message = "El parentesco es obligatorio")
    @Column(nullable = false, length = 50)
    private String parentesco;

    @NotBlank(message = "El teléfono del tutor es obligatorio")
    @Column(name = "telefono_tutor", nullable = false, length = 30)
    private String telefonoTutor;

    @NotBlank(message = "El país de origen es obligatorio")
    @Column(name = "pais_origen", nullable = false, length = 80)
    private String paisOrigen;

    @NotBlank(message = "El país de destino es obligatorio")
    @Column(name = "pais_destino", nullable = false, length = 80)
    private String paisDestino;

    @NotBlank(message = "El motivo del viaje es obligatorio")
    @Column(name = "motivo_viaje", nullable = false, length = 150)
    private String motivoViaje;

    @Column(length = 500)
    private String observaciones;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoMenor estado;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();

        if (estado == null) {
            estado = EstadoMenor.PENDIENTE;
        }
    }
}