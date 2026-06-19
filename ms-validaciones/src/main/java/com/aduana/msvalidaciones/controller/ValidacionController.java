package com.aduana.msvalidaciones.controller;
import com.aduana.msvalidaciones.dto.AccionValidacionRequest;
import com.aduana.msvalidaciones.dto.TramiteValidacionResponse;
import com.aduana.msvalidaciones.dto.ValidacionResponse;
import com.aduana.msvalidaciones.enums.EstadoValidacion;
import com.aduana.msvalidaciones.enums.TipoTramite;
import com.aduana.msvalidaciones.model.Validacion;
import com.aduana.msvalidaciones.service.ValidacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Tag(
        name = "Validaciones",
        description = "Bitácora y gestión centralizada de validaciones de trámites aduaneros"
)
@RestController
@RequestMapping("/api/v1/validaciones")
@RequiredArgsConstructor
public class ValidacionController {

    private final ValidacionService service;

    /*
     * =========================================================
     * BANDEJA CENTRAL DE TRÁMITES
     * =========================================================
     */

    @Operation(summary = "Listar trámites disponibles para validación")
    @GetMapping("/tramites")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI', 'SAG')")
    public List<TramiteValidacionResponse> listarTramites(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) TipoTramite tipo,
            @RequestParam(required = false) String estado
    ) {
        return service.listarTramites(token, tipo, estado);
    }

    @Operation(summary = "Aprobar trámite")
    @PatchMapping("/tramites/{tipoTramite}/{tramiteId}/aprobar")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI', 'SAG')")
    public ValidacionResponse aprobarTramite(
            @RequestHeader("Authorization") String token,
            @PathVariable TipoTramite tipoTramite,
            @PathVariable Long tramiteId,
            @RequestBody(required = false) AccionValidacionRequest request
    ) {
        Validacion validacion = service.aprobarTramite(
                token,
                tipoTramite,
                tramiteId,
                request
        );

        return toResponse(validacion);
    }

    @Operation(summary = "Rechazar trámite")
    @PatchMapping("/tramites/{tipoTramite}/{tramiteId}/rechazar")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI', 'SAG')")
    public ValidacionResponse rechazarTramite(
            @RequestHeader("Authorization") String token,
            @PathVariable TipoTramite tipoTramite,
            @PathVariable Long tramiteId,
            @RequestBody(required = false) AccionValidacionRequest request
    ) {
        Validacion validacion = service.rechazarTramite(
                token,
                tipoTramite,
                tramiteId,
                request
        );

        return toResponse(validacion);
    }

    @Operation(summary = "Enviar trámite a revisión")
    @PatchMapping("/tramites/{tipoTramite}/{tramiteId}/revision")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI', 'SAG')")
    public ValidacionResponse enviarRevisionTramite(
            @RequestHeader("Authorization") String token,
            @PathVariable TipoTramite tipoTramite,
            @PathVariable Long tramiteId,
            @RequestBody(required = false) AccionValidacionRequest request
    ) {
        Validacion validacion = service.enviarRevisionTramite(
                token,
                tipoTramite,
                tramiteId,
                request
        );

        return toResponse(validacion);
    }

    /*
     * =========================================================
     * BITÁCORA DE VALIDACIONES
     * =========================================================
     */

    @Operation(summary = "Listar bitácora de validaciones")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI', 'SAG')")
    public List<ValidacionResponse> listar() {
        return service.listar()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Operation(summary = "Buscar validación por ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI', 'SAG')")
    public ValidacionResponse buscarPorId(@PathVariable Long id) {
        return toResponse(service.buscarPorId(id));
    }

    @Operation(summary = "Buscar validaciones por estado nuevo")
    @GetMapping("/estado/{estadoNuevo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI', 'SAG')")
    public List<ValidacionResponse> buscarPorEstadoNuevo(
            @PathVariable EstadoValidacion estadoNuevo
    ) {
        return service.buscarPorEstadoNuevo(estadoNuevo)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Operation(summary = "Buscar validaciones por tipo de trámite")
    @GetMapping("/tipo/{tipoTramite}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI', 'SAG')")
    public List<ValidacionResponse> buscarPorTipoTramite(
            @PathVariable TipoTramite tipoTramite
    ) {
        return service.buscarPorTipoTramite(tipoTramite)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Operation(summary = "Buscar validaciones por rol de funcionario")
    @GetMapping("/rol/{funcionarioRol}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ValidacionResponse> buscarPorRolFuncionario(
            @PathVariable String funcionarioRol
    ) {
        return service.buscarPorRolFuncionario(funcionarioRol)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Operation(summary = "Buscar validaciones por funcionario")
    @GetMapping("/funcionario/{funcionarioId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ValidacionResponse> buscarPorFuncionarioId(
            @PathVariable Long funcionarioId
    ) {
        return service.buscarPorFuncionarioId(funcionarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Operation(summary = "Buscar validaciones por tipo de trámite y estado")
    @GetMapping("/tipo/{tipoTramite}/estado/{estadoNuevo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI', 'SAG')")
    public List<ValidacionResponse> buscarPorTipoYEstado(
            @PathVariable TipoTramite tipoTramite,
            @PathVariable EstadoValidacion estadoNuevo
    ) {
        return service.buscarPorTipoYEstado(tipoTramite, estadoNuevo)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Operation(summary = "Buscar bitácora de un trámite específico")
    @GetMapping("/tramite/{tipoTramite}/{tramiteId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI', 'SAG')")
    public List<ValidacionResponse> buscarPorTramite(
            @PathVariable TipoTramite tipoTramite,
            @PathVariable Long tramiteId
    ) {
        return service.buscarPorTramite(tipoTramite, tramiteId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Operation(summary = "Eliminar registro de bitácora")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return "Validación eliminada correctamente";
    }

    /*
     * =========================================================
     * MAPEO A RESPONSE
     * =========================================================
     */

    private ValidacionResponse toResponse(Validacion validacion) {

        ValidacionResponse response = new ValidacionResponse();

        response.setId(validacion.getId());
        response.setTramiteId(validacion.getTramiteId());
        response.setTipoTramite(validacion.getTipoTramite());
        response.setEstadoAnterior(validacion.getEstadoAnterior());
        response.setEstadoNuevo(validacion.getEstadoNuevo());
        response.setFuncionarioId(validacion.getFuncionarioId());
        response.setFuncionarioCorreo(validacion.getFuncionarioCorreo());
        response.setFuncionarioRol(validacion.getFuncionarioRol());
        response.setObservaciones(validacion.getObservaciones());
        response.setFechaValidacion(validacion.getFechaValidacion());

        response.add(
                linkTo(
                        methodOn(ValidacionController.class)
                                .buscarPorId(validacion.getId())
                ).withSelfRel()
        );

        response.add(
                linkTo(
                        methodOn(ValidacionController.class)
                                .listar()
                ).withRel("todas-las-validaciones")
        );

        response.add(
                linkTo(
                        methodOn(ValidacionController.class)
                                .buscarPorTramite(
                                        validacion.getTipoTramite(),
                                        validacion.getTramiteId()
                                )
                ).withRel("bitacora-del-tramite")
        );

        return response;
    }
}