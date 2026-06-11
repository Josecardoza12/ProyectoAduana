package com.example.declaracion_SAG.exception;

public class DeclaracionSagNotFoundException extends RuntimeException {
    public DeclaracionSagNotFoundException(Long id){
        super("Declaracion Sag con id:  " + id + " no fue encontrada");
    }
}
