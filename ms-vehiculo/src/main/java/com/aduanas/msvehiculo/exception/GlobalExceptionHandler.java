package com.aduanas.msvehiculo.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 404 — Vehículo no encontrado
    @ExceptionHandler(VehiculoNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleVehiculoNotFound(VehiculoNotFoundException ex) {
        log.warn("Vehículo no encontrado: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    // 409 — Patente duplicada
    @ExceptionHandler(VehiculoYaExisteException.class)
    public ResponseEntity<Map<String, Object>> handleVehiculoYaExiste(VehiculoYaExisteException ex) {
        log.warn("Intento de registro duplicado: {}", ex.getMessage());
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage(), null);
    }

    // 400 — Errores de validación (@NotBlank, @Email, @Min, @Max, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidacion(MethodArgumentNotValidException ex) {
        log.warn("Error de validación en los datos recibidos");

        // Recorre todos los campos que fallaron y guarda el mensaje de cada uno
        Map<String, String> erroresCampos = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(field ->
                erroresCampos.put(field.getField(), field.getDefaultMessage())
        );

        return buildResponse(HttpStatus.BAD_REQUEST, "Error de validación en los datos enviados", erroresCampos);
    }

    // 409 — Error de integridad en BD (ej: columna unique violada)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        log.error("Violación de integridad en BD: {}", ex.getMessage());
        return buildResponse(HttpStatus.CONFLICT, "Ya existe un registro con esos datos en el sistema", null);
    }

    // 400 — Argumento inválido (ej: estado que no existe)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("Argumento inválido: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
    }

    // 400 — Error de regla de negocio
// Ejemplo: intentar rechazar un vehículo ya aprobado
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {

        log.warn("Regla de negocio violada: {}", ex.getMessage());

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage(),
                null
        );
    }

    // 500 — Cualquier otro error no controlado
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        log.error("Error inesperado: {}", ex.getMessage());
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor, contacte al administrador", null);
    }

    // Método reutilizable que construye la respuesta de error
    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String mensaje, Map<String, String> errores) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("mensaje", mensaje);
        if (errores != null) {
            body.put("errores", errores);
        }
        return ResponseEntity.status(status).body(body);
    }
}