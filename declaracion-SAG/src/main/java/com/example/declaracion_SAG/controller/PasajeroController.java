package com.example.declaracion_SAG.controller;

import com.example.declaracion_SAG.client.AuthClient;
import com.example.declaracion_SAG.dto.AuthUserResponse;
import com.example.declaracion_SAG.dto.PasajeroRequestDTO;
import com.example.declaracion_SAG.enums.EstadoPasajero;
import com.example.declaracion_SAG.model.Pasajero;
import com.example.declaracion_SAG.services.PasajeroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Pasajeros", description = "Gestión de registro de pasajeros")
@RestController
@RequestMapping("/api/v1/pasajeros")
@RequiredArgsConstructor
public class PasajeroController {

    private final PasajeroService pasajeroService;
    private final AuthClient authClient;

    @Operation(summary = "Listar todos los pasajeros")
    @GetMapping
    @PreAuthorize("hasAnyRole('PDI', 'ADMIN', 'SAG')")
    public List<Pasajero> listar() {
        return pasajeroService.listar();
    }

    @Operation(summary = "Buscar pasajero por ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TURISTA', 'PDI', 'ADMIN', 'SAG')")
    public Pasajero buscarPorId(@PathVariable Long id) {
        return pasajeroService.buscarPorId(id);
    }

    @Operation(summary = "Buscar pasajeros por usuario")
    @GetMapping("/usuario/{userId}")
    @PreAuthorize("hasAnyRole('TURISTA', 'PDI', 'ADMIN', 'SAG')")
    public List<Pasajero> buscarPorUsuario(@PathVariable Long userId) {
        return pasajeroService.buscarPorUsuario(userId);
    }

    @Operation(summary = "Buscar pasajeros por estado")
    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyRole('PDI', 'ADMIN', 'SAG')")
    public List<Pasajero> buscarPorEstado(@PathVariable EstadoPasajero estado) {
        return pasajeroService.buscarPorEstado(estado);
    }

    @Operation(summary = "Buscar pasajero por RUT")
    @GetMapping("/rut/{rut}")
    @PreAuthorize("hasAnyRole('PDI', 'ADMIN', 'SAG')")
    public List<Pasajero> buscarPorRut(@PathVariable String rut) {
        return pasajeroService.buscarPorRut(rut);
    }

    @Operation(summary = "Buscar pasajero por pasaporte")
    @GetMapping("/pasaporte/{pasaporte}")
    @PreAuthorize("hasAnyRole('PDI', 'ADMIN', 'SAG')")
    public List<Pasajero> buscarPorPasaporte(@PathVariable String pasaporte) {
        return pasajeroService.buscarPorPasaporte(pasaporte);
    }

    @Operation(summary = "Registrar nuevo pasajero")
    @PostMapping
    @PreAuthorize("hasRole('TURISTA')")
    public Pasajero registrar(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody PasajeroRequestDTO dto
    ) {
        AuthUserResponse usuarioAuth =
                authClient.obtenerUsuarioAutenticado(token).block();

        dto.setUserId(usuarioAuth.getId());

        return pasajeroService.registrar(dto);
    }

    @Operation(summary = "Actualizar estado del pasajero")
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('PDI', 'ADMIN')")
    public Pasajero actualizarEstado(
            @PathVariable Long id,
            @RequestParam EstadoPasajero estado
    ) {
        return pasajeroService.actualizarEstado(id, estado);
    }

    @Operation(summary = "Eliminar pasajero")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String eliminar(@PathVariable Long id) {
        pasajeroService.eliminar(id);
        return "Pasajero eliminado correctamente";
    }
}