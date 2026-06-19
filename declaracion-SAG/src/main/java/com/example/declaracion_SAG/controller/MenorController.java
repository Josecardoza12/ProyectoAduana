package com.example.declaracion_SAG.controller;
import com.example.declaracion_SAG.client.AuthClient;
import com.example.declaracion_SAG.dto.AuthUserResponse;
import com.example.declaracion_SAG.dto.MenorRequestDTO;
import com.example.declaracion_SAG.enums.EstadoMenor;
import com.example.declaracion_SAG.model.Menor;
import com.example.declaracion_SAG.services.MenorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Menores", description = "Gestión de solicitudes para menores de edad")
@RestController
@RequestMapping("/api/v1/menores")
@RequiredArgsConstructor
public class MenorController {

    private final MenorService menorService;
    private final AuthClient authClient;

    @Operation(summary = "Listar todas las solicitudes de menores")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI')")
    public List<Menor> listar() {
        return menorService.listar();
    }

    @Operation(summary = "Buscar solicitud de menor por ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TURISTA', 'ADMIN', 'PDI')")
    public Menor buscarPorId(@PathVariable Long id) {
        return menorService.buscarPorId(id);
    }

    @Operation(summary = "Buscar solicitudes de menores por usuario")
    @GetMapping("/usuario/{userId}")
    @PreAuthorize("hasAnyRole('TURISTA', 'ADMIN', 'PDI')")
    public List<Menor> buscarPorUsuario(@PathVariable Long userId) {
        return menorService.buscarPorUsuario(userId);
    }

    @Operation(summary = "Buscar solicitudes por estado")
    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI')")
    public List<Menor> buscarPorEstado(@PathVariable EstadoMenor estado) {
        return menorService.buscarPorEstado(estado);
    }

    @Operation(summary = "Buscar solicitud por documento del menor")
    @GetMapping("/documento-menor/{documentoMenor}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI')")
    public List<Menor> buscarPorDocumentoMenor(@PathVariable String documentoMenor) {
        return menorService.buscarPorDocumentoMenor(documentoMenor);
    }

    @Operation(summary = "Buscar solicitud por documento del tutor")
    @GetMapping("/documento-tutor/{documentoTutor}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI')")
    public List<Menor> buscarPorDocumentoTutor(@PathVariable String documentoTutor) {
        return menorService.buscarPorDocumentoTutor(documentoTutor);
    }

    @Operation(summary = "Registrar nueva solicitud de menor")
    @PostMapping
    @PreAuthorize("hasRole('TURISTA')")
    public Menor registrar(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody MenorRequestDTO dto
    ) {
        AuthUserResponse usuarioAuth =
                authClient.obtenerUsuarioAutenticado(token).block();

        dto.setUserId(usuarioAuth.getId());

        return menorService.registrar(dto);
    }

    @Operation(summary = "Aprobar solicitud de menor")
    @PatchMapping("/{id}/aprobar")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI')")
    public Menor aprobar(@PathVariable Long id) {
        return menorService.aprobar(id);
    }

    @Operation(summary = "Enviar solicitud de menor a revisión")
    @PatchMapping("/{id}/revision")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI')")
    public Menor enviarRevision(@PathVariable Long id) {
        return menorService.enviarRevision(id);
    }

    @Operation(summary = "Rechazar solicitud de menor")
    @PatchMapping("/{id}/rechazar")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI')")
    public Menor rechazar(
            @PathVariable Long id,
            @RequestBody(required = false) String observaciones
    ) {
        return menorService.rechazar(id, observaciones);
    }

    @Operation(summary = "Eliminar solicitud de menor")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String eliminar(@PathVariable Long id) {
        menorService.eliminar(id);
        return "Solicitud de menor eliminada correctamente";
    }
}
