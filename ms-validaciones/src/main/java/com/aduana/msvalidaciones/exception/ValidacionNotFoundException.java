
package com.aduana.msvalidaciones.exception;

public class ValidacionNotFoundException extends RuntimeException{

    public ValidacionNotFoundException(Long id){
        super("Validacion no encontrada con ID: "+ id);
    }

}
