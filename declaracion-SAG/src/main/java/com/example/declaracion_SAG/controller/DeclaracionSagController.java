package com.example.declaracion_SAG.controller;

import com.example.declaracion_SAG.client.AuthClient;
import com.example.declaracion_SAG.dto.AuthUserResponse;
import com.example.declaracion_SAG.enums.EstadoDeclaracion;
import com.example.declaracion_SAG.model.DeclaracionSag;
import com.example.declaracion_SAG.services.DeclaracionSagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/declaraciones")
@Slf4j
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Declaracion SAG" , description = "Gestión de declaracion SAG ")
public class DeclaracionSagController {

    @Autowired
    private DeclaracionSagService declaracionSagService;

    @Autowired
    private AuthClient authClient;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SAG', 'PDI')")
    @Operation(
            summary = "Obtener Declaracion Sag",
            description = "Obtiene la lista completa de Declaracion SAG registrados en el sistema"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de Declaracion Sag obtenida correctamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DeclaracionSag.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Declaracion SAG no encontrada"
            )
    })
    public ResponseEntity<List<DeclaracionSag>> listarDeclaraciones(){

        log.info("Solicitud GET /api/v1/declaraciones");

        List<DeclaracionSag> declaraciones =
                declaracionSagService.listarDeclaraciones();

        if(declaraciones.isEmpty()){

            log.warn("No existen declaraciones SAG registradas");
            return ResponseEntity.noContent().build();
        }

        log.info("Se encontraron {} declaraciones SAG",
                declaraciones.size());

        return ResponseEntity.ok(declaraciones);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PDI','SAG','TURISTA')")
    @Operation(
            summary = "Buscar declaracion por ID",
            description = "Obtiene la información detallada de un equipo registrado mediante su identificador único."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Declaracion Sag obtenida correctamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DeclaracionSag.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "No se encontró una declaracion sag con el ID proporcionado"
            )
    })
    public ResponseEntity<DeclaracionSag> obtenerPorId(
            @PathVariable Long id){

        log.info("Solicitud GET /api/v1/declaraciones/{}", id);

        DeclaracionSag declaracion =
                declaracionSagService.obtenerDeclaracionPorId(id);

        log.info("Declaración SAG encontrada con id {}", id);

        return ResponseEntity.ok(declaracion);
    }

    @GetMapping("/usuario/{userId}")
    @PreAuthorize("hasAnyRole('TURISTA', 'ADMIN', 'PDI', 'SAG')")
    @Operation(
            summary = "Buscar declaracion SAG por usuario",
            description = "Obtiene todos las declaraciones sag asociados a un cliente registrado mediante su ID."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Declaracion SAG del usuario obtenidos correctamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DeclaracionSag.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "204",
                    description = "El usuario no posee declaracion SAG registradas"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "No se encontró un un usuario con el ID proporcionado"
            )
    })
    public ResponseEntity<List<DeclaracionSag>> buscarPorUsuario(
            @PathVariable Long userId){

        log.info("Solicitud GET /api/v1/declaraciones/usuario/{}",
                userId);

        List<DeclaracionSag> declaraciones = declaracionSagService.buscarPorUsuario(userId);

        if(declaraciones.isEmpty()){

            log.warn("El usuario {} no posee declaraciones SAG",
                    userId);

            return ResponseEntity.noContent().build();
        }

        log.info("Se encontraron {} declaraciones para el usuario {}",
                declaraciones.size(), userId);

        return ResponseEntity.ok(declaraciones);
    }

    @GetMapping("/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI','SAG')")
    @Operation(
            summary = "Buscar declaracion SAG por estado",
            description = "Obtiene todas las declaraciones SAG por su estado."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Declaracion sag del estado obtenidos correctamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = DeclaracionSag.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "204",
                    description = "El cliente no posee equipos registrados"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "No se encontró un cliente con el ID proporcionado"
            )
    })
    public ResponseEntity<List<DeclaracionSag>> buscarPorEstado(
            @RequestParam EstadoDeclaracion estado){

        log.info("Solicitud GET /api/v1/declaraciones/estado?estado={}",
                estado);

        List<DeclaracionSag> declaraciones =
                declaracionSagService.findByEstado(estado);

        if(declaraciones.isEmpty()){

            log.warn("No existen declaraciones con estado {}",
                    estado);

            return ResponseEntity.noContent().build();
        }

        log.info("Se encontraron {} declaraciones con estado {}",
                declaraciones.size(), estado);

        return ResponseEntity.ok(declaraciones);
    }

    @GetMapping("/inspeccion")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI','SAG')")
    public ResponseEntity<List<DeclaracionSag>> buscarPorInspeccion(
            @RequestParam Boolean requiereInspeccion){

        log.info("Solicitud GET /api/v1/declaraciones/inspeccion?requiereInspeccion={}",
                requiereInspeccion);

        List<DeclaracionSag> declaraciones = declaracionSagService.buscarPorRequiereInspeccion(requiereInspeccion);

        if(declaraciones.isEmpty()){

            log.warn("No existen declaraciones con requiereInspeccion={}",
                    requiereInspeccion);

            return ResponseEntity.noContent().build();
        }

        log.info("Se encontraron {} declaraciones con requiereInspeccion={}",
                declaraciones.size(), requiereInspeccion);

        return ResponseEntity.ok(declaraciones);
    }
    @PostMapping
    @PreAuthorize("hasRole('TURISTA')")
    public ResponseEntity<DeclaracionSag> crearDeclaracion(
            @Valid @RequestBody DeclaracionSag declaracion,
            @RequestHeader("Authorization") String token) {

        log.info("Solicitud POST /api/v1/declaraciones");

        AuthUserResponse usuarioAuth =
                authClient.obtenerUsuarioAutenticado(token).block();

        declaracion.setUserId(usuarioAuth.getId());

        log.info("Creando declaración SAG para usuario {}", declaracion.getUserId());

        DeclaracionSag guardado =
                declaracionSagService.guardarDeclaracion(declaracion);

        if (guardado.getId() == null) {
            log.warn("No se pudo crear la declaracion: datos incompletos");
            return ResponseEntity.badRequest().build();
        }

        log.info("Declaracion creada correctamente con id {}", guardado.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'SAG')")
    public ResponseEntity<DeclaracionSag> actualizarEstado(
            @PathVariable Long id,
            @RequestParam EstadoDeclaracion estado){

        log.info("Solicitud PUT /api/v1/declaraciones/{}/estado", id);

        log.info("Actualizando estado de declaración {} a {}", id, estado);

        DeclaracionSag actualizada = declaracionSagService.actualizarEstado(id, estado);

        log.info("Estado de declaración {} actualizado correctamente", id);

        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarDeclaracion(
            @PathVariable Long id){

        log.warn("Solicitud DELETE /api/v1/declaraciones/{}",
                id);

        declaracionSagService.eliminarDeclaracion(id);

        log.info("Declaración SAG {} eliminada correctamente",
                id);

        return ResponseEntity.noContent().build();
    }
}

