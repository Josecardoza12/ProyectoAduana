import { useEffect, useState } from "react";
import menorService from "../services/menorService";

function GestionMenores() {

    const rolUsuario = localStorage.getItem("rol");

    const puedeRegistrar = rolUsuario === "TURISTA";
    const puedeGestionar = rolUsuario === "ADMIN" || rolUsuario === "PDI";

    const [menores, setMenores] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [documentoFiltro, setDocumentoFiltro] = useState("");

    const [formulario, setFormulario] = useState({
        nombreMenor: "",
        documentoMenor: "",
        fechaNacimiento: "",
        nombreTutor: "",
        documentoTutor: "",
        parentesco: "",
        telefonoTutor: "",
        paisOrigen: "",
        paisDestino: "",
        motivoViaje: "",
        observaciones: ""
    });

    useEffect(() => {
        cargarMenores();
    }, []);

    const cargarMenores = async () => {
        try {
            setCargando(true);

            const userId = localStorage.getItem("userId");

            let response;

            if (puedeRegistrar && userId) {
                response = await menorService.buscarPorUsuario(userId);
            } else if (puedeGestionar) {
                response = await menorService.listarMenores();
            } else {
                setMenores([]);
                return;
            }

            setMenores(response.data || []);

        } catch (error) {
            console.error("Error al cargar menores", error);
            setMenores([]);
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "paisOrigen" && value === formulario.paisDestino) {
            setFormulario({
                ...formulario,
                paisOrigen: value,
                paisDestino: ""
            });
            return;
        }

        if (name === "paisDestino" && value === formulario.paisOrigen) {
            alert("El país de origen y destino no pueden ser el mismo");
            return;
        }

        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const limpiarFormulario = () => {
        setFormulario({
            nombreMenor: "",
            documentoMenor: "",
            fechaNacimiento: "",
            nombreTutor: "",
            documentoTutor: "",
            parentesco: "",
            telefonoTutor: "",
            paisOrigen: "",
            paisDestino: "",
            motivoViaje: "",
            observaciones: ""
        });
    };

    const calcularEdadNumero = (fechaNacimiento) => {
        if (!fechaNacimiento) return null;

        const nacimiento = new Date(fechaNacimiento);
        const hoy = new Date();

        if (nacimiento > hoy) {
            return -1;
        }

        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        return edad;
    };

    const obtenerMensajeErrorBackend = (error) => {
        const data = error.response?.data;

        if (!data) {
            return null;
        }

        if (typeof data === "string") {
            return data;
        }

        if (data.message) {
            return data.message;
        }

        if (data.detail) {
            return data.detail;
        }

        if (data.error) {
            return data.error;
        }

        return null;
    };

    const validarFormulario = () => {
        if (!formulario.nombreMenor.trim()) {
            alert("Debe ingresar el nombre del menor");
            return false;
        }

        if (!formulario.documentoMenor.trim()) {
            alert("Debe ingresar el documento del menor");
            return false;
        }

        if (!formulario.fechaNacimiento) {
            alert("Debe ingresar la fecha de nacimiento");
            return false;
        }

        const edad = calcularEdadNumero(formulario.fechaNacimiento);

        if (edad === -1) {
            alert("La fecha de nacimiento no puede ser futura");
            return false;
        }

        if (edad >= 18) {
            alert("Solo se pueden registrar menores de edad. La persona debe tener menos de 18 años.");
            return false;
        }

        if (!formulario.nombreTutor.trim()) {
            alert("Debe ingresar el nombre del tutor");
            return false;
        }

        if (!formulario.documentoTutor.trim()) {
            alert("Debe ingresar el documento del tutor");
            return false;
        }

        if (!formulario.parentesco.trim()) {
            alert("Debe seleccionar el parentesco");
            return false;
        }

        if (!formulario.telefonoTutor.trim()) {
            alert("Debe ingresar el teléfono del tutor");
            return false;
        }

        if (!formulario.paisOrigen.trim()) {
            alert("Debe seleccionar el país de origen");
            return false;
        }

        if (!formulario.paisDestino.trim()) {
            alert("Debe seleccionar el país de destino");
            return false;
        }

        if (
            formulario.paisOrigen !== "Chile" &&
            formulario.paisOrigen !== "Argentina"
        ) {
            alert("El país de origen solo puede ser Chile o Argentina");
            return false;
        }

        if (
            formulario.paisDestino !== "Chile" &&
            formulario.paisDestino !== "Argentina"
        ) {
            alert("El país de destino solo puede ser Chile o Argentina");
            return false;
        }

        if (formulario.paisOrigen === formulario.paisDestino) {
            alert("El país de origen y destino no pueden ser el mismo");
            return false;
        }

        if (!formulario.motivoViaje.trim()) {
            alert("Debe seleccionar el motivo del viaje");
            return false;
        }

        return true;
    };

    const registrarMenor = async (e) => {
        e.preventDefault();

        if (!puedeRegistrar) {
            alert("Solo los usuarios TURISTA pueden registrar solicitudes de menores");
            return;
        }

        if (!validarFormulario()) {
            return;
        }

        try {
            setCargando(true);

            await menorService.registrarMenor(formulario);

            alert("Solicitud de menor registrada correctamente");

            limpiarFormulario();
            cargarMenores();

        } catch (error) {
            console.error("Error al registrar menor", error);

            const mensajeBackend = obtenerMensajeErrorBackend(error);

            if (error.response?.status === 403) {
                alert("No tienes permisos para registrar menores. Debes ingresar como TURISTA.");
                return;
            }

            if (error.response?.status === 400) {
                alert(mensajeBackend || "Datos inválidos. Revisa los campos del formulario.");
                return;
            }

            alert("No se pudo registrar la solicitud del menor");
        } finally {
            setCargando(false);
        }
    };

    const aprobarMenor = async (id) => {
        try {
            setCargando(true);

            await menorService.aprobarMenor(id);

            alert("Solicitud aprobada correctamente");

            cargarMenores();

        } catch (error) {
            console.error("Error al aprobar menor", error);
            alert("No se pudo aprobar la solicitud");
        } finally {
            setCargando(false);
        }
    };

    const enviarRevision = async (id) => {
        try {
            setCargando(true);

            await menorService.enviarRevision(id);

            alert("Solicitud enviada a revisión");

            cargarMenores();

        } catch (error) {
            console.error("Error al enviar a revisión", error);
            alert("No se pudo enviar a revisión");
        } finally {
            setCargando(false);
        }
    };

    const rechazarMenor = async (id) => {
        const observaciones = window.prompt("Ingrese el motivo del rechazo:");

        if (observaciones === null) {
            return;
        }

        try {
            setCargando(true);

            await menorService.rechazarMenor(id, observaciones);

            alert("Solicitud rechazada correctamente");

            cargarMenores();

        } catch (error) {
            console.error("Error al rechazar menor", error);
            alert("No se pudo rechazar la solicitud");
        } finally {
            setCargando(false);
        }
    };

    const eliminarMenor = async (id) => {
        const confirmar = window.confirm("¿Seguro que desea eliminar esta solicitud?");

        if (!confirmar) {
            return;
        }

        try {
            setCargando(true);

            await menorService.eliminarMenor(id);

            alert("Solicitud eliminada correctamente");

            cargarMenores();

        } catch (error) {
            console.error("Error al eliminar menor", error);
            alert("No se pudo eliminar la solicitud");
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

            const response = await menorService.buscarPorEstado(estadoFiltro);

            setMenores(response.data || []);

        } catch (error) {
            console.error("Error al filtrar por estado", error);
            setMenores([]);
        } finally {
            setCargando(false);
        }
    };

    const buscarPorDocumentoMenor = async () => {
        if (!documentoFiltro.trim()) {
            alert("Debe ingresar un documento");
            return;
        }

        try {
            setCargando(true);

            const response = await menorService.buscarPorDocumentoMenor(documentoFiltro.trim());

            setMenores(response.data || []);

        } catch (error) {
            console.error("Error al buscar por documento", error);
            setMenores([]);
            alert("No se encontraron solicitudes con ese documento");
        } finally {
            setCargando(false);
        }
    };

    const limpiarFiltros = () => {
        setEstadoFiltro("");
        setDocumentoFiltro("");
        cargarMenores();
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

    const calcularEdad = (fechaNacimiento) => {
        const edad = calcularEdadNumero(fechaNacimiento);

        if (edad === null) return "Sin edad";
        if (edad < 0) return "Fecha inválida";

        return `${edad} años`;
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

    const totalSolicitudes = menores.length;
    const totalPendientes = menores.filter((m) => m.estado === "PENDIENTE").length;
    const totalRevision = menores.filter((m) => m.estado === "EN_REVISION").length;
    const totalAprobados = menores.filter((m) => m.estado === "APROBADO").length;
    const totalRechazados = menores.filter((m) => m.estado === "RECHAZADO").length;

    if (!puedeRegistrar && !puedeGestionar) {
        return (
            <div className="container-fluid px-3">
                <div className="alert alert-danger border-0 shadow-sm">
                    <h5 className="fw-bold mb-1">Acceso restringido</h5>
                    <p className="mb-0">
                        Este módulo solo está disponible para TURISTA, ADMIN o PDI.
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
                        Gestión de Menores
                    </h1>

                    <p className="text-muted m-0 small">
                        Registro y control de solicitudes para menores de edad que cruzan la frontera.
                    </p>
                </div>

                <span className="badge bg-white text-dark border rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2">
                    <span className="spinner-grow bg-success" style={{ width: "8px", height: "8px" }}></span>
                    Servicio menores activo
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
                <i className="bi bi-info-circle text-primary fs-4"></i>

                <div>
                    <h6 className="fw-bold m-0" style={{ color: "#1e40af" }}>
                        Requisitos para menores de edad
                    </h6>

                    <p className="m-0 small" style={{ color: "#2563eb", lineHeight: "1.6" }}>
                        Solo se pueden registrar personas menores de 18 años. El viaje debe ser entre Chile y Argentina,
                        con autorización correspondiente, documento vigente y tutor responsable.
                    </p>
                </div>
            </div>

            {puedeGestionar && (
                <div className="row g-3 mb-4">

                    <div className="col-12 col-md-3">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
                            <div className="card-body">
                                <p className="text-muted small mb-1">Total Solicitudes</p>
                                <h2 className="fw-bold mb-0">{totalSolicitudes}</h2>
                                <span className="text-success small fw-semibold">Registros encontrados</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-3">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
                            <div className="card-body">
                                <p className="text-muted small mb-1">Pendientes</p>
                                <h2 className="fw-bold mb-0">{totalPendientes}</h2>
                                <span className="text-primary small fw-semibold">Por revisar</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-2">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
                            <div className="card-body">
                                <p className="text-muted small mb-1">Revisión</p>
                                <h2 className="fw-bold mb-0">{totalRevision}</h2>
                                <span className="text-warning small fw-semibold">Control PDI</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-2">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
                            <div className="card-body">
                                <p className="text-muted small mb-1">Aprobadas</p>
                                <h2 className="fw-bold mb-0">{totalAprobados}</h2>
                                <span className="text-success small fw-semibold">Autorizadas</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-2">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
                            <div className="card-body">
                                <p className="text-muted small mb-1">Rechazadas</p>
                                <h2 className="fw-bold mb-0">{totalRechazados}</h2>
                                <span className="text-danger small fw-semibold">Observadas</span>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            <div className="row g-4">

                {puedeRegistrar && (
                    <div className="col-12 col-xl-7">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: "22px" }}>
                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h5 className="fw-bold m-0">
                                            Registrar Solicitud de Menor
                                        </h5>

                                        <span className="text-muted small">
                                            Completa los datos del menor y tutor responsable.
                                        </span>
                                    </div>

                                    <i className="bi bi-person-plus text-primary fs-4"></i>
                                </div>

                                <form onSubmit={registrarMenor}>

                                    <h6 className="fw-bold mb-3">Datos del Menor</h6>

                                    <div className="row g-3">

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Nombre completo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nombreMenor"
                                                value={formulario.nombreMenor}
                                                onChange={handleChange}
                                                placeholder="Nombre del menor"
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Documento menor</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="documentoMenor"
                                                value={formulario.documentoMenor}
                                                onChange={handleChange}
                                                placeholder="12.345.678-9"
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Fecha nacimiento</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="fechaNacimiento"
                                                value={formulario.fechaNacimiento}
                                                onChange={handleChange}
                                            />
                                            <small className="text-muted">
                                                Debe corresponder a una persona menor de 18 años.
                                            </small>
                                        </div>

                                    </div>

                                    <hr className="my-4" />

                                    <h6 className="fw-bold mb-3">Datos del Tutor Legal</h6>

                                    <div className="row g-3">

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Nombre tutor</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nombreTutor"
                                                value={formulario.nombreTutor}
                                                onChange={handleChange}
                                                placeholder="Nombre del tutor"
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Documento tutor</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="documentoTutor"
                                                value={formulario.documentoTutor}
                                                onChange={handleChange}
                                                placeholder="12.345.678-9"
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Parentesco</label>
                                            <select
                                                className="form-select"
                                                name="parentesco"
                                                value={formulario.parentesco}
                                                onChange={handleChange}
                                            >
                                                <option value="">Seleccione</option>
                                                <option value="Madre">Madre</option>
                                                <option value="Padre">Padre</option>
                                                <option value="Tutor legal">Tutor legal</option>
                                                <option value="Abuelo/a">Abuelo/a</option>
                                                <option value="Otro">Otro</option>
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Teléfono tutor</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="telefonoTutor"
                                                value={formulario.telefonoTutor}
                                                onChange={handleChange}
                                                placeholder="+56912345678"
                                            />
                                        </div>

                                    </div>

                                    <hr className="my-4" />

                                    <h6 className="fw-bold mb-3">Información del Viaje</h6>

                                    <div className="row g-3">

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">País origen</label>
                                            <select
                                                className="form-select"
                                                name="paisOrigen"
                                                value={formulario.paisOrigen}
                                                onChange={handleChange}
                                            >
                                                <option value="">Seleccione</option>
                                                <option value="Chile">Chile</option>
                                                <option value="Argentina">Argentina</option>
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">País destino</label>
                                            <select
                                                className="form-select"
                                                name="paisDestino"
                                                value={formulario.paisDestino}
                                                onChange={handleChange}
                                            >
                                                <option value="">Seleccione</option>
                                                {formulario.paisOrigen !== "Chile" && (
                                                    <option value="Chile">Chile</option>
                                                )}
                                                {formulario.paisOrigen !== "Argentina" && (
                                                    <option value="Argentina">Argentina</option>
                                                )}
                                            </select>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Motivo viaje</label>
                                            <select
                                                className="form-select"
                                                name="motivoViaje"
                                                value={formulario.motivoViaje}
                                                onChange={handleChange}
                                            >
                                                <option value="">Seleccione</option>
                                                <option value="Vacaciones familiares">Vacaciones familiares</option>
                                                <option value="Visita familiar">Visita familiar</option>
                                                <option value="Estudios">Estudios</option>
                                                <option value="Tratamiento médico">Tratamiento médico</option>
                                                <option value="Otro">Otro</option>
                                            </select>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Observaciones</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                name="observaciones"
                                                value={formulario.observaciones}
                                                onChange={handleChange}
                                                placeholder="Observaciones adicionales"
                                            />
                                        </div>

                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
                                        disabled={cargando}
                                        style={{
                                            borderRadius: "14px",
                                            background: "linear-gradient(135deg, #003DA5, #4DA6FF)",
                                            border: "none"
                                        }}
                                    >
                                        {cargando ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Registrando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle"></i>
                                                Registrar Solicitud
                                            </>
                                        )}
                                    </button>

                                </form>

                            </div>
                        </div>
                    </div>
                )}

                <div className={puedeRegistrar ? "col-12 col-xl-5" : "col-12"}>

                    {puedeGestionar && (
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "22px" }}>
                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h5 className="fw-bold m-0">
                                            Filtros de búsqueda
                                        </h5>

                                        <span className="text-muted small">
                                            Consulta solicitudes por documento o estado.
                                        </span>
                                    </div>

                                    <i className="bi bi-funnel text-primary fs-4"></i>
                                </div>

                                <div className="row g-3 align-items-end">

                                    <div className="col-12 col-md-5">
                                        <label className="form-label fw-semibold">Documento menor</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={documentoFiltro}
                                            onChange={(e) => setDocumentoFiltro(e.target.value)}
                                            placeholder="12.345.678-9"
                                        />
                                    </div>

                                    <div className="col-12 col-md-2">
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={buscarPorDocumentoMenor}
                                        >
                                            Buscar
                                        </button>
                                    </div>

                                    <div className="col-12 col-md-3">
                                        <label className="form-label fw-semibold">Estado</label>
                                        <select
                                            className="form-select"
                                            value={estadoFiltro}
                                            onChange={(e) => setEstadoFiltro(e.target.value)}
                                        >
                                            <option value="">Seleccione</option>
                                            <option value="PENDIENTE">Pendiente</option>
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

                    <div className="card border-0 shadow-sm" style={{ borderRadius: "22px" }}>
                        <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h5 className="fw-bold m-0">
                                        Solicitudes {puedeRegistrar ? "del Usuario" : "Recientes"}
                                    </h5>

                                    <span className="text-muted small">
                                        Estado actual de las solicitudes de menores.
                                    </span>
                                </div>

                                <button
                                    className="btn btn-outline-success btn-sm rounded-pill px-3"
                                    onClick={cargarMenores}
                                >
                                    <i className="bi bi-arrow-clockwise me-1"></i>
                                    Actualizar
                                </button>
                            </div>

                            {cargando ? (
                                <div className="text-center py-4">
                                    Cargando solicitudes...
                                </div>
                            ) : menores.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    No existen solicitudes registradas
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {menores.map((menor) => (
                                        <div
                                            key={menor.id}
                                            className="p-3"
                                            style={{
                                                borderRadius: "16px",
                                                border: "1px solid #e5e7eb",
                                                backgroundColor: "#ffffff"
                                            }}
                                        >
                                            <div className="d-flex justify-content-between gap-3">
                                                <div>
                                                    <h6 className="fw-bold mb-1">
                                                        {menor.nombreMenor}
                                                    </h6>

                                                    <small className="text-muted d-block">
                                                        {calcularEdad(menor.fechaNacimiento)}
                                                    </small>

                                                    <small className="text-muted d-block">
                                                        Tutor: {menor.nombreTutor}
                                                    </small>

                                                    <small className="text-muted d-block">
                                                        Ruta: {menor.paisOrigen} → {menor.paisDestino}
                                                    </small>

                                                    <small className="text-muted d-block">
                                                        {formatearFecha(menor.fechaRegistro)}
                                                    </small>
                                                </div>

                                                <div className="text-end">
                                                    <span className={obtenerBadgeEstado(menor.estado)}>
                                                        {menor.estado}
                                                    </span>
                                                </div>
                                            </div>

                                            {puedeGestionar && (
                                                <div className="d-flex gap-2 flex-wrap mt-3">
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => aprobarMenor(menor.id)}
                                                        disabled={menor.estado === "APROBADO"}
                                                    >
                                                        Aprobar
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-warning"
                                                        onClick={() => enviarRevision(menor.id)}
                                                        disabled={menor.estado === "EN_REVISION"}
                                                    >
                                                        Revisión
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => rechazarMenor(menor.id)}
                                                        disabled={menor.estado === "RECHAZADO"}
                                                    >
                                                        Rechazar
                                                    </button>

                                                    {rolUsuario === "ADMIN" && (
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => eliminarMenor(menor.id)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default GestionMenores;