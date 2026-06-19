package com.aduana.msvalidaciones.model;

import com.aduana.msvalidaciones.enums.EstadoValidacion;
import com.aduana.msvalidaciones.enums.TipoTramite;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "validaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Validacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID del trámite es obligatorio")
    @Column(name = "tramite_id", nullable = false)
    private Long tramiteId;

    @NotNull(message = "El tipo de trámite es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_tramite", nullable = false, length = 30)
    private TipoTramite tipoTramite;

    @NotNull(message = "El estado anterior es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_anterior", nullable = false, length = 30)
    private EstadoValidacion estadoAnterior;

    @NotNull(message = "El estado nuevo es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_nuevo", nullable = false, length = 30)
    private EstadoValidacion estadoNuevo;

    @NotNull(message = "El ID del funcionario es obligatorio")
    @Column(name = "funcionario_id", nullable = false)
    private Long funcionarioId;

    @NotBlank(message = "El correo del funcionario es obligatorio")
    @Column(name = "funcionario_correo", nullable = false, length = 120)
    private String funcionarioCorreo;

    @NotBlank(message = "El rol del funcionario es obligatorio")
    @Column(name = "funcionario_rol", nullable = false, length = 30)
    private String funcionarioRol;

    @Column(name = "observaciones", length = 500)
    private String observaciones;

    @Column(name = "fecha_validacion", nullable = false)
    private LocalDateTime fechaValidacion;

    @PrePersist
    protected void onCreate() {
        if (fechaValidacion == null) {
            fechaValidacion = LocalDateTime.now();
        }
    }
}