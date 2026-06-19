CREATE TABLE validaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    tramite_id BIGINT NOT NULL,
    tipo_tramite VARCHAR(30) NOT NULL,

    estado_anterior VARCHAR(30) NOT NULL,
    estado_nuevo VARCHAR(30) NOT NULL,

    funcionario_id BIGINT NOT NULL,
    funcionario_correo VARCHAR(120) NOT NULL,
    funcionario_rol VARCHAR(30) NOT NULL,

    observaciones VARCHAR(500),
    fecha_validacion DATETIME NOT NULL
);