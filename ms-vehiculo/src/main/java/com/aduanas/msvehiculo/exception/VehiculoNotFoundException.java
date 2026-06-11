package com.aduanas.msvehiculo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Se lanza cuando no se encuentra un vehículo en la BD
// Devuelve automáticamente un 404
@ResponseStatus(HttpStatus.NOT_FOUND)
public class VehiculoNotFoundException extends RuntimeException {

    public VehiculoNotFoundException(String patente) {
        super("No se encontró ningún vehículo con la patente: " + patente);
    }

    public VehiculoNotFoundException(Long id) {
        super("No se encontró ningún vehículo con el ID: " + id);
    }
}