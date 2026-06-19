package com.aduana.msvalidaciones.dto;

import com.aduana.msvalidaciones.enums.EstadoValidacion;
import com.aduana.msvalidaciones.enums.TipoTramite;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.time.LocalDateTime;

@Getter
@Setter
public class ValidacionResponse extends RepresentationModel<ValidacionResponse> {

    private Long id;

    private Long tramiteId;

    private TipoTramite tipoTramite;

    private EstadoValidacion estadoAnterior;

    private EstadoValidacion estadoNuevo;

    private Long funcionarioId;

    private String funcionarioCorreo;

    private String funcionarioRol;

    private String observaciones;

    private LocalDateTime fechaValidacion;
}