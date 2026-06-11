package com.aduanas.msvehiculo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando se intenta registrar una patente que ya existe
// Devuelve automáticamente un 409 Conflict
@ResponseStatus(HttpStatus.CONFLICT)
public class VehiculoYaExisteException extends RuntimeException {

    public VehiculoYaExisteException(String patente) {
        super("Ya existe un vehículo registrado con la patente: " + patente);
    }
}