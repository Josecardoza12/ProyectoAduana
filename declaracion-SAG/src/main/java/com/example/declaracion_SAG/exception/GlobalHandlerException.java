package com.example.declaracion_SAG.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
@RestControllerAdvice
public class GlobalHandlerException {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequest(MethodArgumentNotValidException ex){
        HashMap<String, String> errores =  new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->{
            errores.put(error.getField(), error.getDefaultMessage());

        });
        return new ErrorResponse(400,"Error de validacion",errores);

    }

    @ExceptionHandler(DeclaracionSagNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)

    public ErrorResponse handleNotFound(DeclaracionSagNotFoundException ex){
        HashMap<String , String > errores = new HashMap<>();
        errores.put("id ",ex.getMessage());
        return new ErrorResponse(404,"ID no encontrado", errores);
    }
}
