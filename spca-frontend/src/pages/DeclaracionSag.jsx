import { useEffect, useState } from "react";

import CardResumen from "../components/CardResumen";
import FormularioSag from "../components/FormularioSag";
import declaracionService from "../services/declaracionService";

function DeclaracionSag() {

    const [ultimaDeclaracion, setUltimaDeclaracion] = useState(null);
    const [cargandoUltima, setCargandoUltima] = useState(false);

    useEffect(() => {
        cargarUltimaDeclaracion();
    }, []);

    const cargarUltimaDeclaracion = async () => {
        try {
            setCargandoUltima(true);

            const response = await declaracionService.listarDeclaraciones();

            const declaraciones = response.data || [];

            if (declaraciones.length > 0) {
                const ultima = declaraciones.sort((a, b) => b.id - a.id)[0];
                setUltimaDeclaracion(ultima);
            } else {
                setUltimaDeclaracion(null);
            }

        } catch (error) {
            console.error("Error al cargar última declaración SAG", error);
            setUltimaDeclaracion(null);
        } finally {
            setCargandoUltima(false);
        }
    };

    const formatearCategoria = (categoria) => {
        if (!categoria) return "Sin categoría";

        const categorias = {
            ALIMENTOS: "Alimentos",
            VEGETALES: "Vegetales",
            ANIMALES: "Animales",
            LACTEOS: "Lácteos",
            CARNES: "Carnes",
            SEMILLAS: "Semillas",
            FRUTAS: "Frutas",
            VERDURAS: "Verduras",
            OTROS: "Otros"
        };

        return categorias[categoria] || categoria;
    };

    const obtenerEstadoInspeccion = () => {
        if (!ultimaDeclaracion) return "Sin registro";

        return ultimaDeclaracion.requiereInspeccion
            ? "Con Inspección"
            : "Sin Inspección";
    };

    const obtenerColorEstado = () => {
        if (!ultimaDeclaracion) return "#6c757d";

        if (ultimaDeclaracion.requiereInspeccion) {
            return "#dc3545";
        }

        return "#198754";
    };

    return (
        <div className="container-fluid px-3" style={{ maxWidth: "1400px" }}>

            {/* ENCABEZADO PRINCIPAL */}
            <div className="mb-4">
                <h1 className="fw-bold m-0 text-dark" style={{ letterSpacing: "-0.5px" }}>
                    Declaración SAG
                </h1>

                <p className="text-muted m-0 small">
                    Servicio Agrícola y Ganadero - Control Sanitario
                </p>
            </div>

            {/* BANNER INFORMATIVO */}
            <div
                className="alert border-0 p-3 mb-5 d-flex align-items-start gap-3"
                style={{
                    backgroundColor: "#eff6ff",
                    borderRadius: "14px",
                    borderLeft: "4px solid #2563eb"
                }}
            >
                <i className="bi bi-info-circle-fill text-primary fs-5 mt-0"></i>

                <div>
                    <h6 className="fw-bold m-0" style={{ color: "#1e40af" }}>
                        Importante
                    </h6>

                    <p className="m-0 small" style={{ color: "#2563eb", lineHeight: "1.4" }}>
                        Debe declarar todos los productos de origen animal o vegetal que transporte.
                        La no declaración puede resultar en sanciones legales y decomiso de productos.
                    </p>
                </div>
            </div>

            {/* ÚLTIMO INGRESO PROCESADO */}
            <div className="mb-3 d-flex justify-content-between align-items-end">
                <div>
                    <h5 className="fw-bold text-dark m-0">
                        Último Ingreso Procesado
                    </h5>

                    <span className="text-muted small">
                        Información obtenida desde el registro más reciente del sistema.
                    </span>
                </div>

                <button
                    className="btn btn-sm btn-outline-primary rounded-pill px-3"
                    onClick={cargarUltimaDeclaracion}
                >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Actualizar
                </button>
            </div>

            <div className="d-flex flex-wrap gap-3 mb-5">

                <CardResumen
                    titulo="Pasajero"
                    cantidad={
                        cargandoUltima
                            ? "Cargando..."
                            : ultimaDeclaracion
                                ? ultimaDeclaracion.nombrePasajero
                                : "Sin registro"
                    }
                    tendencia={
                        ultimaDeclaracion
                            ? `Doc: ${ultimaDeclaracion.documento}`
                            : "No hay declaraciones"
                    }
                    esPositiva={true}
                    icono="person-badge"
                    colorIcono="#2563eb"
                />

                <CardResumen
                    titulo="Producto"
                    cantidad={
                        cargandoUltima
                            ? "Cargando..."
                            : ultimaDeclaracion
                                ? ultimaDeclaracion.productoDeclarado
                                : "Sin registro"
                    }
                    tendencia={
                        ultimaDeclaracion
                            ? `Categoría: ${formatearCategoria(ultimaDeclaracion.categoriaProducto)}`
                            : "Sin categoría"
                    }
                    esPositiva={true}
                    icono="box-seam"
                    colorIcono="#f59e0b"
                />

                <CardResumen
                    titulo="Estado"
                    cantidad={
                        cargandoUltima
                            ? "Cargando..."
                            : obtenerEstadoInspeccion()
                    }
                    tendencia={
                        ultimaDeclaracion
                            ? `Riesgo: ${ultimaDeclaracion.nivelRiesgo}`
                            : "Sin evaluación"
                    }
                    esPositiva={
                        ultimaDeclaracion
                            ? ultimaDeclaracion.nivelRiesgo !== "ALTO"
                            : true
                    }
                    icono={
                        ultimaDeclaracion?.requiereInspeccion
                            ? "exclamation-triangle"
                            : "shield-check"
                    }
                    colorIcono={obtenerColorEstado()}
                />

            </div>

            {/* FORMULARIO */}
            <div className="card border-0 shadow-sm p-5 mb-5" style={{ borderRadius: "20px" }}>
                <FormularioSag onDeclaracionCreada={cargarUltimaDeclaracion} />
            </div>

        </div>
    );
}

export default DeclaracionSag;