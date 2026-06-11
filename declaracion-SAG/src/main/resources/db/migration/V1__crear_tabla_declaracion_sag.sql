CREATE TABLE declaracion_sag (

    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    nombre_pasajero VARCHAR(255) NOT NULL,

    documento VARCHAR(100) NOT NULL,

    producto_declarado VARCHAR(255) NOT NULL,

    categoria_producto VARCHAR(100) NOT NULL,

    nivel_riesgo VARCHAR(50) NOT NULL,

    estado VARCHAR(50) NOT NULL,

    observacion VARCHAR(500),

    archivo_adjunto VARCHAR(500),

    requiere_inspeccion BOOLEAN,

    fecha_registro TIMESTAMP
);