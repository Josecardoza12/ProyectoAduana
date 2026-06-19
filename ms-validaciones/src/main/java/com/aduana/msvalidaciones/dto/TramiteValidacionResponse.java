package com.aduana.msvalidaciones.dto;

import com.aduana.msvalidaciones.enums.TipoTramite;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TramiteValidacionResponse {

    private Long tramiteId;

    private TipoTramite tipoTramite;

    private Long userId;

    private String responsable;

    private String documento;

    private String referencia;

    private String estado;

    private String observaciones;

    private LocalDateTime fechaRegistro;
}