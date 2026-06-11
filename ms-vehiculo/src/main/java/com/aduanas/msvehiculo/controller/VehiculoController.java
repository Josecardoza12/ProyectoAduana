package com.aduanas.msvehiculo.controller;

import com.aduanas.msvehiculo.dto.VehiculoRequestDTO;
import com.aduanas.msvehiculo.model.Vehiculo;
import com.aduanas.msvehiculo.service.VehiculoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Slf4j
@RestController
@RequestMapping("/api/v1/vehiculos")
@Tag(name = "Vehículos", description = "Endpoints para el registro y gestión de vehículos en pasos fronterizos")
public class VehiculoController {

    @Autowired
    private VehiculoService vehiculoService;

    @Operation(summary = "Registrar vehículo",
            description = "Registra un nuevo vehículo en el paso fronterizo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Vehículo registrado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "409", description = "Ya existe un vehículo con esa patente")
    })
    @PostMapping
    public ResponseEntity<Vehiculo> registrar(@Valid @RequestBody VehiculoRequestDTO dto) {

        log.info("Petición POST recibida para registrar vehículo con patente: {}", dto.getPatente());

        Vehiculo nuevo = vehiculoService.registrarVehiculo(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @Operation(summary = "Obtener todos los vehículos",
            description = "Retorna la lista completa de vehículos registrados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<List<Vehiculo>> obtenerTodos() {

        log.info("Petición GET recibida para obtener todos los vehículos");

        return ResponseEntity.ok(vehiculoService.obtenerTodos());
    }

    @Operation(
            summary = "Obtener vehículos paginados",
            description = "Retorna los vehículos en páginas para mejorar el rendimiento cuando existen muchos registros")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista paginada obtenida correctamente")
    })
    @GetMapping("/paginados")
    public ResponseEntity<Page<Vehiculo>> obtenerVehiculosPaginados(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size) {

        log.info("Petición GET recibida para obtener vehículos paginados");

        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(
                vehiculoService.obtenerTodosPaginados(pageable)
        );
    }

    @Operation(summary = "Obtener vehículo por ID",
            description = "Busca un vehículo por su identificador único")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehículo encontrado"),
            @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Vehiculo> obtenerPorId(@PathVariable Long id) {

        log.info("Petición GET recibida para obtener vehículo con ID: {}", id);

        return ResponseEntity.ok(vehiculoService.obtenerPorId(id));
    }

    @Operation(summary = "Buscar por patente",
            description = "Busca un vehículo por su patente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehículo encontrado"),
            @ApiResponse(responseCode = "404", description = "Patente no encontrada")
    })
    @GetMapping("/patente/{patente}")
    public ResponseEntity<Vehiculo> obtenerPorPatente(@PathVariable String patente) {

        log.info("Petición GET recibida para buscar patente: {}", patente);

        return ResponseEntity.ok(vehiculoService.obtenerPorPatente(patente));
    }

    @Operation(summary = "Buscar por estado",
            description = "Retorna todos los vehículos con un estado específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    })
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Vehiculo>> obtenerPorEstado(@PathVariable String estado) {

        log.info("Petición GET recibida para buscar vehículos con estado: {}", estado);

        return ResponseEntity.ok(vehiculoService.obtenerPorEstado(estado));
    }

    @Operation(summary = "Buscar por RUT",
            description = "Retorna todos los vehículos registrados por un propietario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    })
    @GetMapping("/rut/{rut}")
    public ResponseEntity<List<Vehiculo>> obtenerPorRut(@PathVariable String rut) {

        log.info("Petición GET recibida para buscar vehículos del RUT: {}", rut);

        return ResponseEntity.ok(vehiculoService.obtenerPorRut(rut));
    }

    @Operation(summary = "Buscar por paso fronterizo",
            description = "Retorna todos los vehículos de un paso fronterizo específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    })
    @GetMapping("/paso/{pasoFronterizo}")
    public ResponseEntity<List<Vehiculo>> obtenerPorPaso(@PathVariable String pasoFronterizo) {

        log.info("Petición GET recibida para buscar vehículos en paso: {}", pasoFronterizo);

        return ResponseEntity.ok(
                vehiculoService.obtenerPorPasoFronterizo(pasoFronterizo));
    }

    @Operation(summary = "Actualizar estado",
            description = "Actualiza el estado de un vehículo (APROBADO, RECHAZADO, EN_REVISION)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estado actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    })
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Vehiculo> actualizarEstado(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {

        log.info("Petición PATCH recibida para actualizar estado del vehículo ID: {}", id);

        Vehiculo actualizado = vehiculoService.actualizarEstado(id, nuevoEstado);

        return ResponseEntity.ok(actualizado);
    }

    @Operation(summary = "Aprobar vehículo",
            description = "Cambia el estado del vehículo a APROBADO")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehículo aprobado correctamente"),
            @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    })
    @PatchMapping("/{id}/aprobar")
    public ResponseEntity<Vehiculo> aprobarVehiculo(@PathVariable Long id) {

        log.info("Petición PATCH recibida para aprobar vehículo ID: {}", id);

        return ResponseEntity.ok(
                vehiculoService.aprobarVehiculo(id));
    }

    @Operation(summary = "Rechazar vehículo",
            description = "Cambia el estado del vehículo a RECHAZADO")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehículo rechazado correctamente"),
            @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    })
    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<Vehiculo> rechazarVehiculo(@PathVariable Long id) {

        log.info("Petición PATCH recibida para rechazar vehículo ID: {}", id);

        return ResponseEntity.ok(
                vehiculoService.rechazarVehiculo(id));
    }

    @Operation(summary = "Enviar vehículo a revisión",
            description = "Cambia el estado del vehículo a EN_REVISION")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vehículo enviado a revisión correctamente"),
            @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    })
    @PatchMapping("/{id}/revision")
    public ResponseEntity<Vehiculo> enviarRevision(@PathVariable Long id) {

        log.info("Petición PATCH recibida para enviar vehículo ID: {} a revisión", id);

        return ResponseEntity.ok(
                vehiculoService.enviarRevision(id));
    }

    @Operation(summary = "Eliminar vehículo",
            description = "Elimina un vehículo por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Vehículo eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Vehículo no encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        log.info("Petición DELETE recibida para eliminar vehículo con ID: {}", id);

        vehiculoService.eliminarVehiculo(id);

        return ResponseEntity.noContent().build();
    }
}

