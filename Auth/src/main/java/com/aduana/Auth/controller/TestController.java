package com.aduana.Auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/privado")
    public String privado() {

        return "Acceso autorizado con JWT";
    }

    @GetMapping("/publico")
    public String publico() {

        return "Endpoint público";
    }
}