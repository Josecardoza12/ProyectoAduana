import { useEffect, useState } from "react";
import declaracionService from "../services/declaracionService";
import archivoService from "../services/archivoService";
import CardResumen from "../components/CardResumen";

function HistorialSag() {

    const rolUsuario = localStorage.getItem("rol");
    const userId = localStorage.getItem("userId");

    const esTurista = rolUsuario === "TURISTA";
    const esAdmin = rolUsuario === "ADMIN";
    const esSag = rolUsuario === "SAG";

    const puedeGestionar =
        rolUsuario === "ADMIN" ||
        rolUsuario === "SAG";

    const [declaraciones, setDeclaraciones] = useState([]);
    const [estado, setEstado] = useState("");
    const [requiereInspeccion, setRequiereInspeccion] = useState("");
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        cargarDeclaraciones();
    }, []);

    const cargarDeclaraciones = async () => {
        try {
            setCargando(true);

            let response;

            if (esTurista) {
                response = await declaracionService.buscarPorUsuario(userId);
            } else {
                response = await declaracionService.listarDeclaraciones();
            }

            setDeclaraciones(response.data || []);

        } catch (error) {
            console.error("Error al listar declaraciones SAG", error);

            if (error.response?.status === 204) {
                setDeclaraciones([]);
                return;
            }

            if (error.response?.status === 403) {
                alert("No tienes permisos para ver estas declaraciones.");
            }

            setDeclaraciones([]);
        } finally {
            setCargando(false);
        }
    };

    const filtrarPorEstado = async () => {
        if (!estado) {
            alert("Debe seleccionar un estado");
            return;
        }

        try {
            setCargando(true);

            let response;

            if (esTurista) {
                const responseUsuario = await declaracionService.buscarPorUsuario(userId);
                const declaracionesUsuario = responseUsuario.data || [];

                const filtradas = declaracionesUsuario.filter(
                    (declaracion) => declaracion.estado === estado
                );

                setDeclaraciones(filtradas);
                return;
            }

            response = await declaracionService.buscarPorEstado(estado);
            setDeclaraciones(response.data || []);

        } catch (error) {
            console.error("Error al filtrar por estado", error);
            setDeclaraciones([]);
        } finally {
            setCargando(false);
        }
    };

    const filtrarPorInspeccion = async () => {
        if (requiereInspeccion === "") {
            alert("Debe seleccionar una opción de inspección");
            return;
        }

        try {
            setCargando(true);

            if (esTurista) {
                const responseUsuario = await declaracionService.buscarPorUsuario(userId);
                const declaracionesUsuario = responseUsuario.data || [];

                const valorBooleano = requiereInspeccion === "true";

                const filtradas = declaracionesUsuario.filter(
                    (declaracion) => declaracion.requiereInspeccion === valorBooleano
                );

                setDeclaraciones(filtradas);
                return;
            }

            const response = await declaracionService.buscarPorInspeccion(requiereInspeccion);

            setDeclaraciones(response.data || []);

        } catch (error) {
            console.error("Error al filtrar por inspección", error);
            setDeclaraciones([]);
        } finally {
            setCargando(false);
        }
    };

    const limpiarFiltros = () => {
        setEstado("");
        setRequiereInspeccion("");
        cargarDeclaraciones();
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        if (!puedeGestionar) {
            alert("No tienes permisos para cambiar el estado de una declaración SAG.");
            return;
        }

        try {
            setCargando(true);

            await declaracionService.actualizarEstado(id, nuevoEstado);

            alert("Estado actualizado correctamente");

            await cargarDeclaraciones();

        } catch (error) {
            console.error("Error al actualizar estado", error);
            alert("No se pudo actualizar el estado de la declaración");
        } finally {
            setCargando(false);
        }
    };

    const descargarArchivo = async (nombreArchivo) => {
        try {
            const response = await archivoService.descargarArchivo(nombreArchivo);

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", nombreArchivo);

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error al descargar archivo", error);
            alert("No se pudo descargar el archivo");
        }
    };

    const obtenerBadgeEstado = (estado) => {
        if (estado === "APROBADA") return "badge rounded-pill bg-success-subtle text-success px-3 py-2";
        if (estado === "RECHAZADA") return "badge rounded-pill bg-danger-subtle text-danger px-3 py-2";
        if (estado === "EN_REVISION") return "badge rounded-pill bg-warning-subtle text-warning px-3 py-2";
        if (estado === "PENDIENTE") return "badge rounded-pill bg-primary-subtle text-primary px-3 py-2";
        return "badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2";
    };

    const obtenerBadgeRiesgo = (riesgo) => {
        if (riesgo === "ALTO") return "badge rounded-pill bg-danger-subtle text-danger px-3 py-2";
        if (riesgo === "MEDIO") return "badge rounded-pill bg-warning-subtle text-warning px-3 py-2";
        return "badge rounded-pill bg-success-subtle text-success px-3 py-2";
    };

    const totalEnRevision = declaraciones.filter(
        (declaracion) => declaracion.estado === "EN_REVISION"
    ).length;

    const totalInspeccion = declaraciones.filter(
        (declaracion) => declaracion.requiereInspeccion === true
    ).length;

    return (
        <div className="container-fluid px-3" style={{ maxWidth: "1400px" }}>

            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h1 className="fw-bold m-0 text-dark" style={{ letterSpacing: "-0.5px" }}>
                        {esTurista ? "Mis Declaraciones SAG" : "Historial de Declaraciones SAG"}
                    </h1>

                    <p className="text-muted m-0 small">
                        {esTurista
                            ? "Consulta el estado de tus declaraciones sanitarias registradas."
                            : "Consulta, revisión y monitoreo de declaraciones sanitarias registradas."
                        }
                    </p>
                </div>

                <span className="badge bg-white text-dark border rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2">
                    <span className="spinner-grow bg-success" style={{ width: "8px", height: "8px" }}></span>
                    {esTurista ? "Vista turista" : "Monitoreo activo"}
                </span>
            </div>

            <div
                className="alert border-0 p-3 mb-4 d-flex align-items-start gap-3"
                style={{
                    backgroundColor: esTurista ? "#eff6ff" : "#f0fdf4",
                    borderRadius: "16px",
                    borderLeft: esTurista ? "4px solid #0d6efd" : "4px solid #198754"
                }}
            >
                <i className={esTurista ? "bi bi-person-check text-primary fs-4" : "bi bi-shield-check text-success fs-4"}></i>

                <div>
                    <h6
                        className="fw-bold m-0"
                        style={{ color: esTurista ? "#1d4ed8" : "#166534" }}
                    >
                        {esTurista ? "Panel personal de declaraciones" : "Panel de revisión sanitaria"}
                    </h6>

                    <p
                        className="m-0 small"
                        style={{
                            color: esTurista ? "#2563eb" : "#198754",
                            lineHeight: "1.5"
                        }}
                    >
                        {esTurista
                            ? "En esta sección puedes consultar solamente las declaraciones SAG que registraste con tu usuario."
                            : "En esta sección el funcionario puede revisar declaraciones SAG, detectar productos sujetos a inspección y consultar el estado de cada ingreso registrado en el sistema."
                        }
                    </p>
                </div>
            </div>

            <div className="d-flex flex-wrap gap-3 mb-4">
                <CardResumen
                    titulo="Total Declaraciones"
                    cantidad={declaraciones.length}
                    tendencia="Registros encontrados"
                    esPositiva={true}
                    icono="file-earmark-text"
                    colorIcono="#0d6efd"
                />

                <CardResumen
                    titulo="En Revisión"
                    cantidad={totalEnRevision}
                    tendencia={esTurista ? "En proceso" : "Pendientes SAG"}
                    esPositiva={false}
                    icono="hourglass-split"
                    colorIcono="#f59e0b"
                />

                <CardResumen
                    titulo="Con Inspección"
                    cantidad={totalInspeccion}
                    tendencia="Requieren control"
                    esPositiva={false}
                    icono="exclamation-triangle"
                    colorIcono="#dc3545"
                />
            </div>

            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "18px" }}>
                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h5 className="fw-bold m-0">
                                Filtros de búsqueda
                            </h5>

                            <span className="text-muted small">
                                Filtra las declaraciones por estado o necesidad de inspección.
                            </span>
                        </div>

                        <i className="bi bi-funnel text-primary fs-4"></i>
                    </div>

                    <div className="row g-3 align-items-end">

                        <div className="col-12 col-lg-4">
                            <label className="form-label fw-semibold">
                                Estado de declaración
                            </label>

                            <select
                                className="form-select"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <option value="">Seleccione estado</option>
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="EN_REVISION">En revisión</option>
                                <option value="APROBADA">Aprobada</option>
                                <option value="RECHAZADA">Rechazada</option>
                            </select>
                        </div>

                        <div className="col-12 col-lg-2">
                            <button
                                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                onClick={filtrarPorEstado}
                                disabled={cargando}
                            >
                                <i className="bi bi-search"></i>
                                Filtrar
                            </button>
                        </div>

                        <div className="col-12 col-lg-4">
                            <label className="form-label fw-semibold">
                                Requiere inspección
                            </label>

                            <select
                                className="form-select"
                                value={requiereInspeccion}
                                onChange={(e) => setRequiereInspeccion(e.target.value)}
                            >
                                <option value="">Seleccione opción</option>
                                <option value="true">Sí requiere inspección</option>
                                <option value="false">No requiere inspección</option>
                            </select>
                        </div>

                        <div className="col-12 col-lg-2">
                            <button
                                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                onClick={filtrarPorInspeccion}
                                disabled={cargando}
                            >
                                <i className="bi bi-filter-circle"></i>
                                Aplicar
                            </button>
                        </div>

                    </div>

                    <div className="mt-3 d-flex gap-2 flex-wrap">
                        <button
                            className="btn btn-outline-secondary d-flex align-items-center gap-2"
                            onClick={limpiarFiltros}
                            disabled={cargando}
                        >
                            <i className="bi bi-x-circle"></i>
                            Limpiar filtros
                        </button>

                        <button
                            className="btn btn-outline-success d-flex align-items-center gap-2"
                            onClick={cargarDeclaraciones}
                            disabled={cargando}
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                            Actualizar listado
                        </button>
                    </div>

                </div>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: "18px", overflow: "hidden" }}>

                <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="fw-bold m-0">
                            Declaraciones registradas
                        </h5>

                        <span className="text-muted small">
                            Total registros: {declaraciones.length}
                        </span>
                    </div>

                    {cargando ? (
                        <span className="badge bg-primary rounded-pill px-3 py-2">
                            Cargando...
                        </span>
                    ) : (
                        <span className="badge bg-light text-secondary border rounded-pill px-3 py-2">
                            Datos actualizados
                        </span>
                    )}
                </div>

                <div className="card-body p-0">
                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead style={{ backgroundColor: "#f8fafc" }}>
                                <tr>
                                    <th className="py-3 ps-4">ID</th>
                                    <th>Pasajero</th>
                                    <th>Documento</th>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Riesgo</th>
                                    <th>Estado</th>
                                    <th>Inspección</th>
                                    <th>Archivo</th>
                                    {puedeGestionar && (
                                        <th>Acciones</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {declaraciones.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={puedeGestionar ? "10" : "9"}
                                            className="text-center py-5 text-muted"
                                        >
                                            <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                                            No existen declaraciones para mostrar.
                                        </td>
                                    </tr>
                                ) : (
                                    declaraciones.map((declaracion) => (
                                        <tr key={declaracion.id}>
                                            <td className="ps-4 fw-semibold">
                                                #{declaracion.id}
                                            </td>

                                            <td className="fw-semibold">
                                                {declaracion.nombrePasajero || "Sin nombre"}
                                            </td>

                                            <td>
                                                {declaracion.documento || "Sin documento"}
                                            </td>

                                            <td>
                                                {declaracion.productoDeclarado || "Sin producto"}
                                            </td>

                                            <td>
                                                <span className="badge bg-light text-dark border rounded-pill px-3 py-2">
                                                    {declaracion.categoriaProducto || "Sin categoría"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={obtenerBadgeRiesgo(declaracion.nivelRiesgo)}>
                                                    {declaracion.nivelRiesgo || "BAJO"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={obtenerBadgeEstado(declaracion.estado)}>
                                                    {declaracion.estado}
                                                </span>
                                            </td>

                                            <td>
                                                {declaracion.requiereInspeccion ? (
                                                    <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2">
                                                        Sí
                                                    </span>
                                                ) : (
                                                    <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
                                                        No
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                {declaracion.archivoAdjunto ? (
                                                    <button
                                                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                                                        onClick={() => descargarArchivo(declaracion.archivoAdjunto)}
                                                    >
                                                        <i className="bi bi-download"></i>
                                                        Descargar
                                                    </button>
                                                ) : (
                                                    <span className="text-muted small">
                                                        Sin archivo
                                                    </span>
                                                )}
                                            </td>

                                            {puedeGestionar && (
                                                <td>
                                                    <div className="d-flex gap-2 flex-wrap">

                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => cambiarEstado(declaracion.id, "APROBADA")}
                                                            disabled={cargando || declaracion.estado === "APROBADA"}
                                                        >
                                                            <i className="bi bi-check-circle"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-warning"
                                                            onClick={() => cambiarEstado(declaracion.id, "EN_REVISION")}
                                                            disabled={cargando || declaracion.estado === "EN_REVISION"}
                                                        >
                                                            <i className="bi bi-hourglass-split"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => cambiarEstado(declaracion.id, "RECHAZADA")}
                                                            disabled={cargando || declaracion.estado === "RECHAZADA"}
                                                        >
                                                            <i className="bi bi-x-circle"></i>
                                                        </button>

                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default HistorialSag;