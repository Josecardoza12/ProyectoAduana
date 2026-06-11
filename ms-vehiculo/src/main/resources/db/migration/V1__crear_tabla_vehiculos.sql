-- Script de creación de la tabla vehiculos
-- Versión 1 — Jael Reyes Meyer
-- Microservicio: ms-vehiculo (puerto 8082)

CREATE TABLE IF NOT EXISTS vehiculos (
                                         id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
                                         patente             VARCHAR(20)     NOT NULL,
    marca               VARCHAR(50)     NOT NULL,
    modelo              VARCHAR(50)     NOT NULL,
    anio                VARCHAR(4)      NOT NULL,
    color               VARCHAR(30)     NOT NULL,
    tipo_vehiculo       VARCHAR(20)     NOT NULL,
    pais_origen         VARCHAR(3)      NOT NULL,
    rut_propietario     VARCHAR(20)     NOT NULL,
    tipo_movimiento     VARCHAR(10)     NOT NULL,
    estado              VARCHAR(20)     NOT NULL DEFAULT 'PENDIENTE',
    paso_fronterizo     VARCHAR(30)     NOT NULL,
    dias_estadia        INT             NOT NULL,
    observaciones       VARCHAR(500),
    fecha_registro      DATETIME        NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;