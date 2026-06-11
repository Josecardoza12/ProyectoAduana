package com.aduanas.msvehiculo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Registro de Vehículos")
                        .version("1.0")
                        .description("Microservicio de Registro de Vehículos en Pasos Fronterizos - SPCA")
                        .contact(new Contact()
                                .name("Jael Reyes")
                                .email("correo@gmail.com")));
    }
}