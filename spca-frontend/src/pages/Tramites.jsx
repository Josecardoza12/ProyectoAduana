import { useEffect, useState } from "react";
import validacionService from "../services/validacionService";

function Tramites() {

    const rolUsuario = localStorage.getItem("rol");

    const puedeVerModulo =
        rolUsuario === "ADMIN" ||
        rolUsuario === "PDI" ||
        rolUsuario === "SAG";

    const esAdmin = rolUsuario === "ADMIN";
    const esPdi = rolUsuario === "PDI";
    const esSag = rolUsuario === "SAG";

    const [vistaActiva, setVistaActiva] = useState("TRAMITES");

    const [tramites, setTramites] = useState([]);
    const [bitacora, setBitacora] = useState([]);

    const [cargando, setCargando] = useState(false);
    const [tipoFiltro, setTipoFiltro] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [busqueda, setBusqueda] = useState("");

    const [modalAccion, setModalAccion] = useState({
        visible: false,
        accion: "",
        titulo: "",
        tipoTramite: "",
        tramiteId: null,
        observacion: ""
    });

    useEffect(() => {
        if (puedeVerModulo) {
            cargarDatos();
        }
    }, []);

    const cargarDatos = async () => {
        try {
            setCargando(true);

            const [responseTramites, responseBitacora] = await Promise.all([
                validacionService.listarTramites(),
                validacionService.listarValidaciones()
            ]);

            setTramites(responseTramites.data || []);
            setBitacora(responseBitacora.data || []);

        } catch (error) {
            console.error("Error al cargar datos de trámites", error);

            if (error.response?.status === 403) {
                alert("No tienes permisos para ver este módulo.");
            } else if (error.code === "ERR_NETWORK") {
                alert("No se pudo conectar con ms-validaciones. Revisa que esté encendido en el puerto 7070.");
            } else {
                alert("No se pudieron cargar los trámites.");
            }

            setTramites([]);
            setBitacora([]);
        } finally {
            setCargando(false);
        }
    };

    const cargarSoloBitacora = async () => {
        try {
            const response = await validacionService.listarValidaciones();
            setBitacora(response.data || []);
        } catch (error) {
            console.error("Error al cargar bitácora", error);
            setBitacora([]);
        }
    };

    const filtrarTramites = async () => {
        try {
            setCargando(true);

            const response = await validacionService.filtrarTramites(
                tipoFiltro,
                estadoFiltro
            );

            setTramites(response.data || []);

        } catch (error) {
            console.error("Error al filtrar trámites", error);
            alert("No se pudieron filtrar los trámites.");
        } finally {
            setCargando(false);
        }
    };

    const limpiarFiltros = async () => {
        setTipoFiltro("");
        setEstadoFiltro("");
        setBusqueda("");
        await cargarDatos();
    };

    const abrirModalAccion = (accion, tipoTramite, tramiteId) => {
        let titulo = "";

        if (accion === "APROBAR") {
            titulo = "Aprobar trámite";
        }

        if (accion === "RECHAZAR") {
            titulo = "Rechazar trámite";
        }

        if (accion === "REVISION") {
            titulo = "Enviar trámite a revisión";
        }

        setModalAccion({
            visible: true,
            accion,
            titulo,
            tipoTramite,
            tramiteId,
            observacion: ""
        });
    };

    const cerrarModalAccion = () => {
        setModalAccion({
            visible: false,
            accion: "",
            titulo: "",
            tipoTramite: "",
            tramiteId: null,
            observacion: ""
        });
    };

    const actualizarObservacionModal = (valor) => {
        setModalAccion((prev) => ({
            ...prev,
            observacion: valor
        }));
    };

    const confirmarAccionTramite = async () => {
        const { accion, tipoTramite, tramiteId, observacion } = modalAccion;

        if (accion === "RECHAZAR" && !observacion.trim()) {
            alert("Debe ingresar una observación para rechazar.");
            return;
        }

        try {
            setCargando(true);

            if (accion === "APROBAR") {
                await validacionService.aprobarTramite(
                    tipoTramite,
                    tramiteId,
                    observacion
                );
            }

            if (accion === "RECHAZAR") {
                await validacionService.rechazarTramite(
                    tipoTramite,
                    tramiteId,
                    observacion
                );
            }

            if (accion === "REVISION") {
                await validacionService.enviarRevisionTramite(
                    tipoTramite,
                    tramiteId,
                    observacion
                );
            }

            cerrarModalAccion();

            alert("Acción realizada correctamente");

            await cargarDatos();

        } catch (error) {
            console.error("Error al ejecutar acción del trámite", error);
            console.error("STATUS:", error.response?.status);
            console.error("DATA:", error.response?.data);

            if (error.response?.status === 403) {
                alert("No tienes permisos para realizar esta acción.");
                return;
            }

            if (error.response?.status === 404) {
                alert("No se encontró el endpoint o el trámite solicitado.");
                return;
            }

            if (error.response?.status === 500) {
                alert("Error interno en el backend. Revisa la consola de ms-validaciones.");
                return;
            }

            alert("No se pudo realizar la acción.");
        } finally {
            setCargando(false);
        }
    };

    const aprobarTramite = (tipoTramite, tramiteId) => {
        abrirModalAccion("APROBAR", tipoTramite, tramiteId);
    };

    const rechazarTramite = (tipoTramite, tramiteId) => {
        abrirModalAccion("RECHAZAR", tipoTramite, tramiteId);
    };

    const enviarRevisionTramite = (tipoTramite, tramiteId) => {
        abrirModalAccion("REVISION", tipoTramite, tramiteId);
    };

    const eliminarBitacora = async (id) => {
        const confirmar = confirm("¿Seguro que deseas eliminar este registro de bitácora?");

        if (!confirmar) return;

        try {
            setCargando(true);

            await validacionService.eliminarValidacion(id);

            alert("Registro eliminado correctamente");
            await cargarSoloBitacora();

        } catch (error) {
            console.error("Error al eliminar registro de bitácora", error);
            alert("No se pudo eliminar el registro.");
        } finally {
            setCargando(false);
        }
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

        if (estado === "REGISTRADO") {
            return "badge rounded-pill bg-info-subtle text-info px-3 py-2";
        }

        return "badge rounded-pill bg-primary-subtle text-primary px-3 py-2";
    };

    const obtenerBadgeTipo = (tipo) => {
        if (tipo === "DECLARACION_SAG") {
            return "badge rounded-pill bg-success-subtle text-success px-3 py-2";
        }

        if (tipo === "VEHICULO") {
            return "badge rounded-pill bg-primary-subtle text-primary px-3 py-2";
        }

        if (tipo === "MENOR") {
            return "badge rounded-pill bg-warning-subtle text-warning px-3 py-2";
        }

        if (tipo === "PASAJERO") {
            return "badge rounded-pill bg-info-subtle text-info px-3 py-2";
        }

        return "badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2";
    };

    const obtenerNombreTipo = (tipo) => {
        if (tipo === "DECLARACION_SAG") return "Declaración SAG";
        if (tipo === "VEHICULO") return "Vehículo";
        if (tipo === "MENOR") return "Menor de edad";
        if (tipo === "PASAJERO") return "Pasajero";
        return tipo || "Sin tipo";
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "Sin fecha";

        try {
            return new Date(fecha).toLocaleString("es-CL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch (error) {
            return "Fecha inválida";
        }
    };

    const normalizarTexto = (valor) => {
        if (valor === null || valor === undefined) {
            return "";
        }

        return String(valor).toLowerCase();
    };

    const puedeGestionarTipo = (tipoTramite) => {
        if (esAdmin) return true;

        if (esSag && tipoTramite === "DECLARACION_SAG") {
            return true;
        }

        if (
            esPdi &&
            (
                tipoTramite === "PASAJERO" ||
                tipoTramite === "MENOR" ||
                tipoTramite === "VEHICULO"
            )
        ) {
            return true;
        }

        return false;
    };

    const tramitesFiltradosLocal = tramites.filter((tramite) => {
        const texto = busqueda.toLowerCase();

        if (!texto.trim()) return true;

        return (
            normalizarTexto(tramite.tramiteId).includes(texto) ||
            normalizarTexto(tramite.tipoTramite).includes(texto) ||
            normalizarTexto(tramite.estado).includes(texto) ||
            normalizarTexto(tramite.responsable).includes(texto) ||
            normalizarTexto(tramite.documento).includes(texto) ||
            normalizarTexto(tramite.referencia).includes(texto) ||
            normalizarTexto(tramite.observaciones).includes(texto)
        );
    });

    const bitacoraFiltradaLocal = bitacora.filter((registro) => {
        const texto = busqueda.toLowerCase();

        if (!texto.trim()) return true;

        return (
            normalizarTexto(registro.id).includes(texto) ||
            normalizarTexto(registro.tramiteId).includes(texto) ||
            normalizarTexto(registro.tipoTramite).includes(texto) ||
            normalizarTexto(registro.estadoAnterior).includes(texto) ||
            normalizarTexto(registro.estadoNuevo).includes(texto) ||
            normalizarTexto(registro.funcionarioCorreo).includes(texto) ||
            normalizarTexto(registro.funcionarioRol).includes(texto) ||
            normalizarTexto(registro.observaciones).includes(texto)
        );
    });

    const totalTramites = tramites.length;

    const totalPendientes = tramites.filter(
        (t) => t.estado === "PENDIENTE" || t.estado === "REGISTRADO"
    ).length;

    const totalRevision = tramites.filter(
        (t) => t.estado === "EN_REVISION"
    ).length;

    const totalAprobados = tramites.filter(
        (t) => t.estado === "APROBADO"
    ).length;

    const totalRechazados = tramites.filter(
        (t) => t.estado === "RECHAZADO"
    ).length;

    const tiposPermitidos = () => {
        if (esAdmin) {
            return (
                <>
                    <option value="DECLARACION_SAG">Declaración SAG</option>
                    <option value="PASAJERO">Pasajero</option>
                    <option value="MENOR">Menor de edad</option>
                    <option value="VEHICULO">Vehículo</option>
                </>
            );
        }

        if (esSag) {
            return (
                <option value="DECLARACION_SAG">Declaración SAG</option>
            );
        }

        if (esPdi) {
            return (
                <>
                    <option value="PASAJERO">Pasajero</option>
                    <option value="MENOR">Menor de edad</option>
                    <option value="VEHICULO">Vehículo</option>
                    <option value="DECLARACION_SAG">Declaración SAG</option>
                </>
            );
        }

        return null;
    };

    if (!puedeVerModulo) {
        return (
            <div className="container-fluid px-3">
                <div className="alert alert-danger border-0 shadow-sm">
                    <h5 className="fw-bold mb-1">Acceso restringido</h5>
                    <p className="mb-0">
                        Este módulo solo está disponible para ADMIN, PDI o SAG.
                    </p>
                    <small className="text-muted">
                        Rol actual: {rolUsuario || "Sin rol"}
                    </small>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-3" style={{ maxWidth: "1500px" }}>

            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h1 className="fw-bold m-0 text-dark" style={{ letterSpacing: "-0.5px" }}>
                        Gestión de Trámites
                    </h1>

                    <p className="text-muted m-0 small">
                        Bandeja centralizada de revisión de trámites y bitácora de acciones realizadas.
                    </p>
                </div>

                <span className="badge bg-white text-dark border rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2">
                    <span className="spinner-grow bg-success" style={{ width: "8px", height: "8px" }}></span>
                    Rol actual: {rolUsuario}
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
                <i className="bi bi-folder-check text-primary fs-4"></i>

                <div>
                    <h6 className="fw-bold m-0" style={{ color: "#1e40af" }}>
                        Bandeja general del sistema
                    </h6>

                    <p className="m-0 small" style={{ color: "#2563eb", lineHeight: "1.5" }}>
                        {esAdmin && "ADMIN puede visualizar y gestionar todos los trámites del sistema."}
                        {esPdi && "PDI puede visualizar y gestionar pasajeros, menores y vehículos."}
                        {esSag && "SAG puede visualizar y gestionar declaraciones SAG."}
                    </p>
                </div>
            </div>

            <div className="row g-3 mb-4">

                <div className="col-12 col-md-2">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "18px" }}>
                        <div className="card-body">
                            <p className="text-muted small mb-1">Total trámites</p>
                            <h2 className="fw-bold mb-0">{totalTramites}</h2>
                            <span className="text-success small fw-semibold">Sistema</span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-2">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "18px" }}>
                        <div className="card-body">
                            <p className="text-muted small mb-1">Pendientes</p>
                            <h2 className="fw-bold mb-0">{totalPendientes}</h2>
                            <span className="text-primary small fw-semibold">Por revisar</span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-2">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "18px" }}>
                        <div className="card-body">
                            <p className="text-muted small mb-1">En revisión</p>
                            <h2 className="fw-bold mb-0">{totalRevision}</h2>
                            <span className="text-warning small fw-semibold">Observados</span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-2">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "18px" }}>
                        <div className="card-body">
                            <p className="text-muted small mb-1">Aprobados</p>
                            <h2 className="fw-bold mb-0">{totalAprobados}</h2>
                            <span className="text-success small fw-semibold">Autorizados</span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-2">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "18px" }}>
                        <div className="card-body">
                            <p className="text-muted small mb-1">Rechazados</p>
                            <h2 className="fw-bold mb-0">{totalRechazados}</h2>
                            <span className="text-danger small fw-semibold">Denegados</span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-2">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "18px" }}>
                        <div className="card-body">
                            <p className="text-muted small mb-1">Bitácora</p>
                            <h2 className="fw-bold mb-0">{bitacora.length}</h2>
                            <span className="text-secondary small fw-semibold">Acciones</span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "22px" }}>
                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 className="fw-bold m-0">
                                Filtros y vista
                            </h5>

                            <span className="text-muted small">
                                Filtra por tipo de trámite, estado o texto libre.
                            </span>
                        </div>

                        <button
                            className="btn btn-outline-success btn-sm rounded-pill px-3"
                            onClick={cargarDatos}
                            disabled={cargando}
                        >
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            Actualizar
                        </button>
                    </div>

                    <div className="d-flex gap-2 flex-wrap mb-4">
                        <button
                            className={
                                vistaActiva === "TRAMITES"
                                    ? "btn btn-primary rounded-pill px-4"
                                    : "btn btn-outline-primary rounded-pill px-4"
                            }
                            onClick={() => setVistaActiva("TRAMITES")}
                        >
                            <i className="bi bi-inboxes me-1"></i>
                            Trámites del Sistema
                        </button>

                        <button
                            className={
                                vistaActiva === "BITACORA"
                                    ? "btn btn-primary rounded-pill px-4"
                                    : "btn btn-outline-primary rounded-pill px-4"
                            }
                            onClick={() => setVistaActiva("BITACORA")}
                        >
                            <i className="bi bi-clock-history me-1"></i>
                            Bitácora de Trámites
                        </button>
                    </div>

                    <div className="row g-3 align-items-end">

                        <div className="col-12 col-md-3">
                            <label className="form-label fw-semibold">Tipo trámite</label>
                            <select
                                className="form-select"
                                value={tipoFiltro}
                                onChange={(e) => setTipoFiltro(e.target.value)}
                            >
                                <option value="">Todos</option>
                                {tiposPermitidos()}
                            </select>
                        </div>

                        <div className="col-12 col-md-3">
                            <label className="form-label fw-semibold">Estado</label>
                            <select
                                className="form-select"
                                value={estadoFiltro}
                                onChange={(e) => setEstadoFiltro(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="REGISTRADO">Registrado</option>
                                <option value="EN_REVISION">En revisión</option>
                                <option value="APROBADO">Aprobado</option>
                                <option value="RECHAZADO">Rechazado</option>
                            </select>
                        </div>

                        <div className="col-12 col-md-4">
                            <label className="form-label fw-semibold">Buscar</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por ID, tipo, documento o responsable"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        <div className="col-12 col-md-2">
                            <button
                                className="btn btn-primary w-100"
                                onClick={filtrarTramites}
                                disabled={vistaActiva !== "TRAMITES"}
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

            {vistaActiva === "TRAMITES" && (
                <div className="card border-0 shadow-sm" style={{ borderRadius: "22px", overflow: "hidden" }}>
                    <div className="card-header bg-white border-0 p-4">
                        <h5 className="fw-bold m-0">
                            Trámites del Sistema
                        </h5>

                        <span className="text-muted small">
                            Bandeja general de trámites disponibles para validación.
                        </span>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>ID trámite</th>
                                    <th>Tipo</th>
                                    <th>Responsable</th>
                                    <th>Referencia</th>
                                    <th>Documento</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {cargando ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4">
                                            Cargando trámites...
                                        </td>
                                    </tr>
                                ) : tramitesFiltradosLocal.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4 text-muted">
                                            No existen trámites para mostrar.
                                        </td>
                                    </tr>
                                ) : (
                                    tramitesFiltradosLocal.map((tramite) => (
                                        <tr key={`${tramite.tipoTramite}-${tramite.tramiteId}`}>
                                            <td className="fw-semibold">
                                                {tramite.tramiteId}
                                            </td>

                                            <td>
                                                <span className={obtenerBadgeTipo(tramite.tipoTramite)}>
                                                    {obtenerNombreTipo(tramite.tipoTramite)}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {tramite.responsable || "Sin responsable"}
                                                </div>
                                                <small className="text-muted">
                                                    Usuario ID: {tramite.userId || "N/A"}
                                                </small>
                                            </td>

                                            <td>{tramite.referencia || "Sin referencia"}</td>

                                            <td>{tramite.documento || "Sin documento"}</td>

                                            <td>{formatearFecha(tramite.fechaRegistro)}</td>

                                            <td>
                                                <span className={obtenerBadgeEstado(tramite.estado)}>
                                                    {tramite.estado || "SIN_ESTADO"}
                                                </span>
                                            </td>

                                            <td>
                                                {puedeGestionarTipo(tramite.tipoTramite) ? (
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => aprobarTramite(tramite.tipoTramite, tramite.tramiteId)}
                                                            disabled={cargando || tramite.estado === "APROBADO"}
                                                        >
                                                            Aprobar
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-warning"
                                                            onClick={() => enviarRevisionTramite(tramite.tipoTramite, tramite.tramiteId)}
                                                            disabled={cargando || tramite.estado === "EN_REVISION"}
                                                        >
                                                            Revisión
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => rechazarTramite(tramite.tipoTramite, tramite.tramiteId)}
                                                            disabled={cargando || tramite.estado === "RECHAZADO"}
                                                        >
                                                            Rechazar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted small">
                                                        Solo lectura
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {vistaActiva === "BITACORA" && (
                <div className="card border-0 shadow-sm" style={{ borderRadius: "22px", overflow: "hidden" }}>
                    <div className="card-header bg-white border-0 p-4">
                        <h5 className="fw-bold m-0">
                            Bitácora de Trámites
                        </h5>

                        <span className="text-muted small">
                            Historial de acciones realizadas por funcionarios.
                        </span>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Trámite</th>
                                    <th>Estado anterior</th>
                                    <th>Estado nuevo</th>
                                    <th>Funcionario</th>
                                    <th>Observación</th>
                                    <th>Fecha</th>
                                    {esAdmin && (
                                        <th>Acciones</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {cargando ? (
                                    <tr>
                                        <td colSpan={esAdmin ? "8" : "7"} className="text-center py-4">
                                            Cargando bitácora...
                                        </td>
                                    </tr>
                                ) : bitacoraFiltradaLocal.length === 0 ? (
                                    <tr>
                                        <td colSpan={esAdmin ? "8" : "7"} className="text-center py-4 text-muted">
                                            No existen registros de bitácora.
                                        </td>
                                    </tr>
                                ) : (
                                    bitacoraFiltradaLocal.map((registro) => (
                                        <tr key={registro.id}>
                                            <td>{registro.id}</td>

                                            <td>
                                                <span className={obtenerBadgeTipo(registro.tipoTramite)}>
                                                    {obtenerNombreTipo(registro.tipoTramite)}
                                                </span>
                                                <div className="small text-muted mt-1">
                                                    ID trámite: {registro.tramiteId}
                                                </div>
                                            </td>

                                            <td>
                                                <span className={obtenerBadgeEstado(registro.estadoAnterior)}>
                                                    {registro.estadoAnterior}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={obtenerBadgeEstado(registro.estadoNuevo)}>
                                                    {registro.estadoNuevo}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {registro.funcionarioCorreo}
                                                </div>
                                                <small className="text-muted">
                                                    Rol: {registro.funcionarioRol}
                                                </small>
                                            </td>

                                            <td>{registro.observaciones || "Sin observación"}</td>

                                            <td>{formatearFecha(registro.fechaValidacion)}</td>

                                            {esAdmin && (
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => eliminarBitacora(registro.id)}
                                                        disabled={cargando}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {modalAccion.visible && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(15, 23, 42, 0.55)"
                    }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "18px" }}>

                            <div className="modal-header border-0 pb-0">
                                <div>
                                    <h5 className="modal-title fw-bold">
                                        {modalAccion.titulo}
                                    </h5>

                                    <p className="text-muted small mb-0">
                                        Trámite: {obtenerNombreTipo(modalAccion.tipoTramite)} #{modalAccion.tramiteId}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={cerrarModalAccion}
                                    disabled={cargando}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <label className="form-label fw-semibold">
                                    Observación
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder={
                                        modalAccion.accion === "RECHAZAR"
                                            ? "Ingrese el motivo del rechazo"
                                            : "Ingrese una observación opcional"
                                    }
                                    value={modalAccion.observacion}
                                    onChange={(e) => actualizarObservacionModal(e.target.value)}
                                    disabled={cargando}
                                ></textarea>

                                {modalAccion.accion === "RECHAZAR" && (
                                    <small className="text-danger">
                                        La observación es obligatoria para rechazar.
                                    </small>
                                )}
                            </div>

                            <div className="modal-footer border-0 pt-0">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={cerrarModalAccion}
                                    disabled={cargando}
                                >
                                    Cancelar
                                </button>

                                <button
                                    className={
                                        modalAccion.accion === "APROBAR"
                                            ? "btn btn-success"
                                            : modalAccion.accion === "RECHAZAR"
                                                ? "btn btn-danger"
                                                : "btn btn-warning"
                                    }
                                    onClick={confirmarAccionTramite}
                                    disabled={cargando}
                                >
                                    {cargando ? "Procesando..." : "Confirmar"}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Tramites;