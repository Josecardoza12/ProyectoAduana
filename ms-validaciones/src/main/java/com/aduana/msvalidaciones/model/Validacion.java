package com.aduana.msvalidaciones.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;
import com.aduana.msvalidaciones.enums.EstadoValidacion;
import com.aduana.msvalidaciones.enums.TipoTramite;

@Entity
@Table(name="validaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Validacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long tramiteId;

    @NotBlank
    private String funcionario;
    private String observaciones;
    private LocalDateTime fechaValidacion;

    @NotNull
    @Enumerated(EnumType.STRING)
    private EstadoValidacion estado;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoTramite tipoTramite;



}
