import { useState } from "react";
import vehiculoService from "../services/vehiculoService";

function ValidacionVehiculo() {

    const rolUsuario = localStorage.getItem("rol");

    const [busqueda, setBusqueda] = useState("");
    const [resultado, setResultado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const puedeValidar = rolUsuario === "PDI" || rolUsuario === "ADMIN";

    const buscarVehiculo = async (e) => {
        e.preventDefault();

        if (!busqueda.trim()) {
            alert("Debe ingresar una patente");
            return;
        }

        try {
            setCargando(true);
            setError("");
            setResultado(null);

            const response = await vehiculoService.buscarPorPatente(busqueda.trim());

            setResultado(response.data);

        } catch (error) {
            console.error("Error al buscar vehículo", error);
            setError("No se encontró un vehículo registrado con esa patente");
            setResultado(null);
        } finally {
            setCargando(false);
        }
    };

    const aprobarVehiculo = async () => {
        if (!resultado) return;

        try {
            setCargando(true);

            const response = await vehiculoService.aprobarVehiculo(resultado.id);

            setResultado(response.data);

            alert("Vehículo aprobado correctamente");

        } catch (error) {
            console.error("Error al aprobar vehículo", error);
            alert("No se pudo aprobar el vehículo");
        } finally {
            setCargando(false);
        }
    };

    const rechazarVehiculo = async () => {
        if (!resultado) return;

        try {
            setCargando(true);

            const response = await vehiculoService.rechazarVehiculo(resultado.id);

            setResultado(response.data);

            alert("Vehículo rechazado correctamente");

        } catch (error) {
            console.error("Error al rechazar vehículo", error);
            alert("No se pudo rechazar el vehículo");
        } finally {
            setCargando(false);
        }
    };

    const enviarRevision = async () => {
        if (!resultado) return;

        try {
            setCargando(true);

            const response = await vehiculoService.enviarRevision(resultado.id);

            setResultado(response.data);

            alert("Vehículo enviado a revisión correctamente");

        } catch (error) {
            console.error("Error al enviar vehículo a revisión", error);
            alert("No se pudo enviar el vehículo a revisión");
        } finally {
            setCargando(false);
        }
    };

    const obtenerBadgeEstado = (estado) => {
        if (estado === "APROBADO") {
            return "badge rounded-pill bg-success-subtle text-success px-4 py-2";
        }

        if (estado === "RECHAZADO") {
            return "badge rounded-pill bg-danger-subtle text-danger px-4 py-2";
        }

        if (estado === "EN_REVISION") {
            return "badge rounded-pill bg-warning-subtle text-warning px-4 py-2";
        }

        return "badge rounded-pill bg-secondary-subtle text-secondary px-4 py-2";
    };

    const obtenerEstadoVisual = (estado) => {
        if (estado === "APROBADO") return "Autorizado";
        if (estado === "RECHAZADO") return "Rechazado";
        if (estado === "EN_REVISION") return "En revisión";
        return "Pendiente";
    };

    const obtenerClasePanelEstado = (estado) => {
        if (estado === "APROBADO") {
            return {
                fondo: "#f0fdf4",
                borde: "#bbf7d0",
                icono: "bi bi-check-circle text-success",
                texto: "#166534"
            };
        }

        if (estado === "RECHAZADO") {
            return {
                fondo: "#fef2f2",
                borde: "#fecaca",
                icono: "bi bi-x-circle text-danger",
                texto: "#991b1b"
            };
        }

        if (estado === "EN_REVISION") {
            return {
                fondo: "#fffbeb",
                borde: "#fde68a",
                icono: "bi bi-exclamation-triangle text-warning",
                texto: "#92400e"
            };
        }

        return {
            fondo: "#eff6ff",
            borde: "#bfdbfe",
            icono: "bi bi-hourglass-split text-primary",
            texto: "#1e40af"
        };
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

    const estadoPanel = resultado
        ? obtenerClasePanelEstado(resultado.estado)
        : null;

    return (
        <div className="container-fluid px-3" style={{ maxWidth: "1400px" }}>

            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h1 className="fw-bold m-0 text-dark" style={{ letterSpacing: "-0.5px" }}>
                        Validación Vehicular
                    </h1>

                    <p className="text-muted m-0">
                        Control documental y validación de vehículos registrados en frontera.
                    </p>
                </div>

                <span className="badge bg-white text-dark border rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2">
                    <span className="spinner-grow bg-success" style={{ width: "8px", height: "8px" }}></span>
                    MS Vehículos conectado
                </span>
            </div>

            {!puedeValidar && (
                <div className="alert alert-danger border-0 shadow-sm mb-4">
                    <h5 className="fw-bold mb-1">
                        Acceso restringido
                    </h5>

                    <p className="mb-0">
                        Este módulo está destinado a funcionarios PDI o administradores.
                    </p>

                    <small className="text-muted">
                        Rol actual: {rolUsuario || "Sin rol"}
                    </small>
                </div>
            )}

            <div
                className="card border-0 shadow-lg mb-4"
                style={{
                    borderRadius: "24px",
                    background: "linear-gradient(135deg, #003DA5, #4DA6FF)"
                }}
            >
                <div className="card-body p-5">

                    <form onSubmit={buscarVehiculo}>

                        <label className="text-white fw-bold mb-3 fs-5">
                            Buscar Vehículo Registrado
                        </label>

                        <div className="row g-3 align-items-center">

                            <div className="col-12 col-lg-8">
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-white border-0">
                                        <i className="bi bi-car-front text-primary"></i>
                                    </span>

                                    <input
                                        type="text"
                                        className="form-control border-0"
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
                                        placeholder="Ingrese patente del vehículo, ej: ABCD12"
                                        disabled={!puedeValidar}
                                    />
                                </div>
                            </div>

                            <div className="col-12 col-lg-4">
                                <button
                                    type="submit"
                                    className="btn btn-light btn-lg w-100 fw-bold text-primary d-flex align-items-center justify-content-center gap-2"
                                    style={{ borderRadius: "16px" }}
                                    disabled={cargando || !puedeValidar}
                                >
                                    {cargando ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Buscando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-search"></i>
                                            Buscar
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>

                        <div className="mt-4">
                            <p className="text-white-50 small m-0">
                                La búsqueda consulta directamente el microservicio de vehículos por patente.
                            </p>
                        </div>

                    </form>

                </div>
            </div>

            {error && (
                <div className="alert alert-warning border-0 shadow-sm mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            {resultado && (
                <div className="row g-4">

                    <div className="col-12 col-xl-8">

                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "22px" }}>
                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div>
                                        <h2 className="fw-bold text-dark m-0">
                                            {resultado.patente}
                                        </h2>

                                        <p className="text-muted m-0">
                                            {resultado.tipoVehiculo} - {resultado.marca} {resultado.modelo}
                                        </p>
                                    </div>

                                    <span className={obtenerBadgeEstado(resultado.estado)}>
                                        {obtenerEstadoVisual(resultado.estado)}
                                    </span>
                                </div>

                                <div className="row g-4">

                                    <div className="col-12 col-md-6">
                                        <span className="text-muted small">ID Vehículo</span>
                                        <p className="fw-bold text-dark mb-0">
                                            #{resultado.id}
                                        </p>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <span className="text-muted small">Usuario Turista ID</span>
                                        <p className="fw-bold text-dark mb-0">
                                            {resultado.userId || "No informado"}
                                        </p>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <span className="text-muted small">RUT propietario</span>
                                        <p className="fw-bold text-dark mb-0">
                                            {resultado.rutPropietario}
                                        </p>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <span className="text-muted small">País de origen</span>
                                        <p className="fw-bold text-dark mb-0">
                                            {resultado.paisOrigen}
                                        </p>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <span className="text-muted small">Año</span>
                                        <p className="fw-bold text-dark mb-0">
                                            {resultado.anio}
                                        </p>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <span className="text-muted small">Color</span>
                                        <p className="fw-bold text-dark mb-0">
                                            {resultado.color}
                                        </p>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <span className="text-muted small">Movimiento</span>
                                        <p className="fw-bold text-dark mb-0">
                                            {resultado.tipoMovimiento}
                                        </p>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <span className="text-muted small">Paso fronterizo</span>
                                        <p className="fw-bold text-dark mb-0">
                                            {resultado.pasoFronterizo}
                                        </p>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <span className="text-muted small">Días de estadía</span>
                                        <p className="fw-bold text-dark mb-0">
                                            {resultado.diasEstadia}
                                        </p>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <span className="text-muted small">Fecha de registro</span>
                                        <p className="fw-bold text-dark mb-0">
                                            {formatearFecha(resultado.fechaRegistro)}
                                        </p>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div className="card border-0 shadow-sm" style={{ borderRadius: "22px" }}>
                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <i className="bi bi-clipboard-data text-primary fs-4"></i>
                                    Observaciones del trámite
                                </h5>

                                <div
                                    className="p-4 rounded-4"
                                    style={{
                                        backgroundColor: "#f8fafc",
                                        border: "1px solid #e5e7eb"
                                    }}
                                >
                                    <p className="mb-0 text-muted">
                                        {resultado.observaciones || "Sin observaciones registradas."}
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="col-12 col-xl-4">

                        <div
                            className="card border-0 shadow-sm mb-4"
                            style={{
                                borderRadius: "22px",
                                backgroundColor: estadoPanel.fondo,
                                border: `1px solid ${estadoPanel.borde}`
                            }}
                        >
                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: estadoPanel.texto }}>
                                    <i className={estadoPanel.icono}></i>
                                    Estado del trámite
                                </h5>

                                <h2 className="fw-bold mb-2" style={{ color: estadoPanel.texto }}>
                                    {obtenerEstadoVisual(resultado.estado)}
                                </h2>

                                <p className="small mb-0" style={{ color: estadoPanel.texto }}>
                                    Estado actual obtenido desde el microservicio de vehículos.
                                </p>

                            </div>
                        </div>

                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "22px" }}>
                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-3">
                                    Acciones PDI / Admin
                                </h5>

                                <div className="d-flex flex-column gap-2">

                                    <button
                                        className="btn btn-success py-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        onClick={aprobarVehiculo}
                                        disabled={cargando || resultado.estado === "APROBADO"}
                                    >
                                        <i className="bi bi-check-circle"></i>
                                        Aprobar vehículo
                                    </button>

                                    <button
                                        className="btn btn-warning py-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        onClick={enviarRevision}
                                        disabled={cargando || resultado.estado === "EN_REVISION"}
                                    >
                                        <i className="bi bi-exclamation-triangle"></i>
                                        Enviar a revisión
                                    </button>

                                    <button
                                        className="btn btn-danger py-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        onClick={rechazarVehiculo}
                                        disabled={cargando || resultado.estado === "RECHAZADO"}
                                    >
                                        <i className="bi bi-x-circle"></i>
                                        Rechazar vehículo
                                    </button>

                                    


                                </div>

                            </div>
                        </div>

                        <div
                            className="p-4 rounded-4"
                            style={{
                                backgroundColor: "#eff6ff",
                                border: "1px solid #bfdbfe"
                            }}
                        >
                            <h6 className="fw-bold mb-3" style={{ color: "#1e40af" }}>
                                Instrucciones
                            </h6>

                            <ul className="small mb-0 ps-3" style={{ color: "#2563eb", lineHeight: "1.7" }}>
                                <li>Buscar el vehículo por patente registrada.</li>
                                <li>Verificar el RUT del propietario y datos del vehículo.</li>
                                <li>Revisar país de origen, movimiento y paso fronterizo.</li>
                                <li>Registrar decisión final: aprobado, rechazado o en revisión.</li>
                            </ul>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default ValidacionVehiculo;