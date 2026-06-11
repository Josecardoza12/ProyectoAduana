package com.example.declaracion_SAG.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private int status;
    private String error;
    private LocalDateTime timestamp;
    HashMap<String, String> errores;

    public ErrorResponse(int status, String error, HashMap<String, String> errores) {
        this.status = status;
        this.errores = errores;
        this.error = error;
        this.timestamp = LocalDateTime.now();


    }
}
