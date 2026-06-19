import { useEffect, useState } from "react";
import pasajeroService from "../services/pasajeroService";

function HistorialPasajero() {

    const rolUsuario = localStorage.getItem("rol");
    const userId = localStorage.getItem("userId");

    const esTurista = rolUsuario === "TURISTA";

    const puedeVerHistorial =
        rolUsuario === "TURISTA" ||
        rolUsuario === "ADMIN" ||
        rolUsuario === "PDI" ||
        rolUsuario === "SAG";

    const puedeGestionar =
        rolUsuario === "ADMIN" ||
        rolUsuario === "PDI" ||
        rolUsuario === "SAG";

    const [pasajeros, setPasajeros] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");

    useEffect(() => {
        if (puedeVerHistorial) {
            cargarPasajeros();
        }
    }, []);

    const cargarPasajeros = async () => {
        try {
            setCargando(true);

            let response;

            if (esTurista) {
                if (!userId) {
                    alert("No se encontró el ID del usuario autenticado. Vuelva a iniciar sesión.");
                    setPasajeros([]);
                    return;
                }

                response = await pasajeroService.buscarPorUsuario(userId);
            } else {
                response = await pasajeroService.listarPasajeros();
            }

            setPasajeros(response.data || []);

        } catch (error) {
            console.error("Error al cargar historial de pasajeros", error);
            setPasajeros([]);
            alert("No se pudo cargar el historial de pasajeros");
        } finally {
            setCargando(false);
        }
    };

    const buscarPorRut = async () => {
        if (!busqueda.trim()) {
            alert("Debe ingresar un RUT");
            return;
        }

        try {
            setCargando(true);

            const response = await pasajeroService.buscarPorRut(busqueda.trim());

            setPasajeros(response.data || []);

        } catch (error) {
            console.error("Error al buscar pasajero por RUT", error);
            setPasajeros([]);
            alert("No se encontraron pasajeros con ese RUT");
        } finally {
            setCargando(false);
        }
    };

    const buscarPorPasaporte = async () => {
        if (!busqueda.trim()) {
            alert("Debe ingresar un pasaporte");
            return;
        }

        try {
            setCargando(true);

            const response = await pasajeroService.buscarPorPasaporte(busqueda.trim());

            setPasajeros(response.data || []);

        } catch (error) {
            console.error("Error al buscar pasajero por pasaporte", error);
            setPasajeros([]);
            alert("No se encontraron pasajeros con ese pasaporte");
        } finally {
            setCargando(false);
        }
    };

    const filtrarPorEstado = async () => {
        if (!estadoFiltro) {
            alert("Debe seleccionar un estado");
            return;
        }

        try {
            setCargando(true);

            const response = await pasajeroService.listarPasajeros();

            const pasajerosFiltrados = (response.data || []).filter(
                (pasajero) => pasajero.estado === estadoFiltro
            );

            setPasajeros(pasajerosFiltrados);

        } catch (error) {
            console.error("Error al filtrar pasajeros", error);
            setPasajeros([]);
        } finally {
            setCargando(false);
        }
    };

    const actualizarEstado = async (id, estado) => {
        if (!puedeGestionar) {
            alert("No tienes permisos para actualizar el estado del pasajero");
            return;
        }

        try {
            setCargando(true);

            await pasajeroService.actualizarEstado(id, estado);

            alert(`Pasajero actualizado a estado ${estado}`);

            cargarPasajeros();

        } catch (error) {
            console.error("Error al actualizar estado del pasajero", error);

            if (error.response?.status === 403) {
                alert("No tienes permisos para actualizar el estado del pasajero");
                return;
            }

            alert("No se pudo actualizar el estado");
        } finally {
            setCargando(false);
        }
    };

    const limpiarFiltros = () => {
        setBusqueda("");
        setEstadoFiltro("");
        cargarPasajeros();
    };

    const obtenerBadgeEstado = (estado) => {
        if (estado === "APROBADO") {
            return "badge rounded-pill bg-success-subtle text-success px-3 py-2";
        }

        if (estado === "RECHAZADO") {
            return "badge rounded-pill bg-danger-subtle text-danger px-3 py-2";
        }

        if (estado === "EN_REVISION") {
            return "badge rounded-pill bg-warning-subtle text-warning px-3 py-2";
        }

        return "badge rounded-pill bg-primary-subtle text-primary px-3 py-2";
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "Sin fecha";

        return new Date(fecha).toLocaleString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const totalPasajeros = pasajeros.length;

    const totalRegistrados = pasajeros.filter(
        (pasajero) => pasajero.estado === "REGISTRADO"
    ).length;

    const totalAprobados = pasajeros.filter(
        (pasajero) => pasajero.estado === "APROBADO"
    ).length;

    const totalRevision = pasajeros.filter(
        (pasajero) => pasajero.estado === "EN_REVISION"
    ).length;

    const totalRechazados = pasajeros.filter(
        (pasajero) => pasajero.estado === "RECHAZADO"
    ).length;

    if (!puedeVerHistorial) {
        return (
            <div className="container-fluid px-3">
                <div className="alert alert-danger border-0 shadow-sm">
                    <h5 className="fw-bold mb-1">Acceso restringido</h5>
                    <p className="mb-0">
                        Este módulo solo está disponible para TURISTA, ADMIN, PDI o SAG.
                    </p>
                    <small className="text-muted">
                        Rol actual: {rolUsuario || "Sin rol"}
                    </small>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-3" style={{ maxWidth: "1400px" }}>

            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h1 className="fw-bold m-0 text-dark" style={{ letterSpacing: "-0.5px" }}>
                        {esTurista ? "Mi Registro de Pasajero" : "Historial de Pasajeros"}
                    </h1>

                    <p className="text-muted m-0 small">
                        {esTurista
                            ? "Consulta tus registros migratorios asociados a tu usuario."
                            : "Consulta y revisión de pasajeros registrados en el sistema."
                        }
                    </p>
                </div>

                <span className="badge bg-white text-dark border rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2">
                    <span className="spinner-grow bg-success" style={{ width: "8px", height: "8px" }}></span>
                    Servicio pasajeros activo
                </span>
            </div>

            <div
                className="alert border-0 p-3 mb-4 d-flex align-items-start gap-3"
                style={{
                    backgroundColor: "#eff6ff",
                    borderRadius: "16px",
                    borderLeft: "4px solid #2563eb"
                }}
            >
                <i className="bi bi-people-fill text-primary fs-4"></i>

                <div>
                    <h6 className="fw-bold m-0" style={{ color: "#1e40af" }}>
                        {esTurista ? "Consulta personal del pasajero" : "Control de pasajeros"}
                    </h6>

                    <p className="m-0 small" style={{ color: "#2563eb", lineHeight: "1.5" }}>
                        {esTurista
                            ? "Aquí puedes revisar el estado de tus registros de pasajero. Solo se muestran los datos asociados a tu usuario."
                            : "Este módulo permite consultar pasajeros registrados y actualizar su estado migratorio."
                        }
                    </p>
                </div>
            </div>

            <div className="row g-3 mb-4">

                <div className="col-12 col-md-3">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
                        <div className="card-body">
                            <p className="text-muted small mb-1">
                                {esTurista ? "Mis Registros" : "Total Pasajeros"}
                            </p>
                            <h2 className="fw-bold mb-0">{totalPasajeros}</h2>
                            <span className="text-success small fw-semibold">Registros encontrados</span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
                        <div className="card-body">
                            <p className="text-muted small mb-1">Registrados</p>
                            <h2 className="fw-bold mb-0">{totalRegistrados}</h2>
                            <span className="text-primary small fw-semibold">Ingreso inicial</span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
                        <div className="card-body">
                            <p className="text-muted small mb-1">Aprobados</p>
                            <h2 className="fw-bold mb-0">{totalAprobados}</h2>
                            <span className="text-success small fw-semibold">Autorizados</span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
                        <div className="card-body">
                            <p className="text-muted small mb-1">En Revisión</p>
                            <h2 className="fw-bold mb-0">{totalRevision}</h2>
                            <span className="text-warning small fw-semibold">Control pendiente</span>
                        </div>
                    </div>
                </div>

            </div>

            {!esTurista && (
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "22px" }}>
                    <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="fw-bold m-0">
                                    Filtros de búsqueda
                                </h5>

                                <span className="text-muted small">
                                    Consulta pasajeros por RUT, pasaporte o estado.
                                </span>
                            </div>

                            <i className="bi bi-funnel text-primary fs-4"></i>
                        </div>

                        <div className="row g-3 align-items-end">

                            <div className="col-12 col-md-4">
                                <label className="form-label fw-semibold">Buscar</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Ingrese RUT o pasaporte"
                                />
                            </div>

                            <div className="col-12 col-md-2">
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={buscarPorRut}
                                >
                                    Buscar RUT
                                </button>
                            </div>

                            <div className="col-12 col-md-2">
                                <button
                                    className="btn btn-outline-primary w-100"
                                    onClick={buscarPorPasaporte}
                                >
                                    Pasaporte
                                </button>
                            </div>

                            <div className="col-12 col-md-2">
                                <label className="form-label fw-semibold">Estado</label>
                                <select
                                    className="form-select"
                                    value={estadoFiltro}
                                    onChange={(e) => setEstadoFiltro(e.target.value)}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="REGISTRADO">Registrado</option>
                                    <option value="EN_REVISION">En revisión</option>
                                    <option value="APROBADO">Aprobado</option>
                                    <option value="RECHAZADO">Rechazado</option>
                                </select>
                            </div>

                            <div className="col-12 col-md-2">
                                <button
                                    className="btn btn-outline-primary w-100"
                                    onClick={filtrarPorEstado}
                                >
                                    Filtrar
                                </button>
                            </div>

                        </div>

                        <button
                            className="btn btn-outline-secondary mt-3"
                            onClick={limpiarFiltros}
                        >
                            <i className="bi bi-x-circle me-1"></i>
                            Limpiar filtros
                        </button>

                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm" style={{ borderRadius: "22px", overflow: "hidden" }}>
                <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="fw-bold m-0">
                            {esTurista ? "Mis Registros Migratorios" : "Pasajeros Registrados"}
                        </h5>

                        <span className="text-muted small">
                            {esTurista
                                ? "Listado actualizado con tus registros de pasajero."
                                : "Listado actualizado desde el microservicio de Declaración SAG."
                            }
                        </span>
                    </div>

                    <button
                        className="btn btn-outline-success btn-sm rounded-pill px-3"
                        onClick={cargarPasajeros}
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Actualizar
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Documento</th>
                                <th>Contacto</th>
                                <th>Ruta</th>
                                <th>Motivo</th>
                                <th>Fecha ingreso</th>
                                <th>Estado</th>
                                {!esTurista && (
                                    <th>Acciones</th>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {cargando ? (
                                <tr>
                                    <td colSpan={esTurista ? "8" : "9"} className="text-center py-4">
                                        Cargando pasajeros...
                                    </td>
                                </tr>
                            ) : pasajeros.length === 0 ? (
                                <tr>
                                    <td colSpan={esTurista ? "8" : "9"} className="text-center py-4 text-muted">
                                        No existen pasajeros registrados
                                    </td>
                                </tr>
                            ) : (
                                pasajeros.map((pasajero) => (
                                    <tr key={pasajero.id}>
                                        <td>{pasajero.id}</td>

                                        <td>
                                            <div className="fw-bold">
                                                {pasajero.nombres} {pasajero.apellidos}
                                            </div>
                                            <small className="text-muted">
                                                Nacionalidad: {pasajero.nacionalidad}
                                            </small>
                                        </td>

                                        <td>
                                            <div>RUT: {pasajero.rut}</div>
                                            <small className="text-muted">
                                                Pasaporte: {pasajero.pasaporte}
                                            </small>
                                        </td>

                                        <td>
                                            <div>{pasajero.email}</div>
                                            <small className="text-muted">
                                                {pasajero.telefono}
                                            </small>
                                        </td>

                                        <td>
                                            <div className="fw-semibold">
                                                {pasajero.paisOrigen} → {pasajero.paisDestino}
                                            </div>
                                        </td>

                                        <td>{pasajero.motivoViaje}</td>

                                        <td>{formatearFecha(pasajero.fechaIngreso)}</td>

                                        <td>
                                            <span className={obtenerBadgeEstado(pasajero.estado)}>
                                                {pasajero.estado}
                                            </span>
                                        </td>

                                        {!esTurista && (
                                            <td>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => actualizarEstado(pasajero.id, "APROBADO")}
                                                        disabled={pasajero.estado === "APROBADO"}
                                                    >
                                                        Aprobar
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-warning"
                                                        onClick={() => actualizarEstado(pasajero.id, "EN_REVISION")}
                                                        disabled={pasajero.estado === "EN_REVISION"}
                                                    >
                                                        Revisión
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => actualizarEstado(pasajero.id, "RECHAZADO")}
                                                        disabled={pasajero.estado === "RECHAZADO"}
                                                    >
                                                        Rechazar
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
    );
}

export default HistorialPasajero;