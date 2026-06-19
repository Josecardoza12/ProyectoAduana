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
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @NotBlank(message = "El nombre del pasajero es obligatorio")
    @Column(name = "nombre_pasajero", nullable = false)
    private String nombrePasajero;

    @NotBlank(message = "El documento es obligatorio")
    @Column(nullable = false)
    private String documento;

    @NotBlank(message = "El producto declarado es obligatorio")
    @Column(name = "producto_declarado", nullable = false)
    private String productoDeclarado;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria_producto", nullable = false)
    private CategoriaProducto categoriaProducto;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_riesgo", nullable = false)
    private NivelRiesgo nivelRiesgo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoDeclaracion estado;

    @Column(length = 500)
    private String observacion;

    @Column(name = "archivo_adjunto")
    private String archivoAdjunto;

    @Column(name = "requiere_inspeccion")
    private Boolean requiereInspeccion;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
}

