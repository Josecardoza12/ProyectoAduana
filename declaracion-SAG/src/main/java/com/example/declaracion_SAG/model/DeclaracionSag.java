package com.example.declaracion_SAG.model;
import com.example.declaracion_SAG.enums.CategoriaProducto;
import com.example.declaracion_SAG.enums.EstadoDeclaracion;
import com.example.declaracion_SAG.enums.NivelRiesgo;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "declaracion_sag")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeclaracionSag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El id del usuario es obligatorio")
    private Long userId;

    @NotBlank(message = "El nombre del pasajero es obligatorio")
    @Column(nullable = false)
    private String nombrePasajero;

    @NotBlank(message = "El documento es obligatorio")
    @Column(nullable = false)
    private String documento;

    @NotBlank(message = "El producto declarado es obligatorio")
    @Column(nullable = false)
    private String productoDeclarado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoriaProducto categoriaProducto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NivelRiesgo nivelRiesgo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoDeclaracion estado;

    @Column(length = 500)
    private String observacion;

    private String archivoAdjunto;

    private Boolean requiereInspeccion;

    private LocalDateTime fechaRegistro;
}

