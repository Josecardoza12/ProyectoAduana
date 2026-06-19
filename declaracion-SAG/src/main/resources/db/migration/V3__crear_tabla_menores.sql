CREATE TABLE menores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    nombre_menor VARCHAR(120) NOT NULL,
    documento_menor VARCHAR(30) NOT NULL,
    fecha_nacimiento DATE NOT NULL,

    nombre_tutor VARCHAR(120) NOT NULL,
    documento_tutor VARCHAR(30) NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    telefono_tutor VARCHAR(30) NOT NULL,

    pais_origen VARCHAR(80) NOT NULL,
    pais_destino VARCHAR(80) NOT NULL,
    motivo_viaje VARCHAR(150) NOT NULL,

    observaciones VARCHAR(500),

    estado VARCHAR(20) NOT NULL,
    fecha_registro DATETIME NOT NULL
);