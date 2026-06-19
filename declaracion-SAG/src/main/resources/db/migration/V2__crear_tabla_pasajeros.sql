CREATE TABLE pasajeros (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    rut VARCHAR(20) NOT NULL UNIQUE,
    pasaporte VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,

    nacionalidad VARCHAR(80) NOT NULL,
    pais_origen VARCHAR(80) NOT NULL,
    pais_destino VARCHAR(80) NOT NULL,
    fecha_ingreso DATE NOT NULL,
    motivo_viaje VARCHAR(100) NOT NULL,

    estado VARCHAR(20) NOT NULL,
    observaciones VARCHAR(500),
    fecha_registro DATETIME NOT NULL
);