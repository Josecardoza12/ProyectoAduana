import { useEffect, useState } from "react";
import CardResumen from "../components/CardResumen";
import vehiculoService from "../services/vehiculoService";

function Vehiculos() {

    const rolUsuario = localStorage.getItem("rol");
    const userId = localStorage.getItem("userId");

    const [vehiculos, setVehiculos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [patenteFiltro, setPatenteFiltro] = useState("");

    const [formulario, setFormulario] = useState({
        patente: "",
        marca: "",
        modelo: "",
        anio: "",
        color: "",
        tipoVehiculo: "",
        paisOrigen: "",
        rutPropietario: "",
        tipoMovimiento: "",
        pasoFronterizo: "",
        diasEstadia: "",
        observaciones: ""
    });

    const puedeRegistrar = rolUsuario === "TURISTA";
    const puedeRevisar = rolUsuario === "PDI" || rolUsuario === "ADMIN";
    const puedeEliminar = rolUsuario === "ADMIN";

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        try {
            setCargando(true);

            let response;

            if (rolUsuario === "TURISTA" && userId) {
                response = await vehiculoService.buscarPorUsuario(userId);
            } else {
                response = await vehiculoService.listarVehiculos();
            }

            setVehiculos(response.data || []);

        } catch (error) {
            console.error("Error al cargar vehículos", error);
            setVehiculos([]);
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const limpiarFormulario = () => {
        setFormulario({
            patente: "",
            marca: "",
            modelo: "",
            anio: "",
            color: "",
            tipoVehiculo: "",
            paisOrigen: "",
            rutPropietario: "",
            tipoMovimiento: "",
            pasoFronterizo: "",
            diasEstadia: "",
            observaciones: ""
        });
    };

    const validarFormulario = () => {
        if (!formulario.patente.trim()) {
            alert("Debe ingresar la patente");
            return false;
        }

        if (!formulario.tipoVehiculo) {
            alert("Debe seleccionar el tipo de vehículo");
            return false;
        }

        if (!formulario.marca.trim()) {
            alert("Debe ingresar la marca");
            return false;
        }

        if (!formulario.modelo.trim()) {
            alert("Debe ingresar el modelo");
            return false;
        }

        if (!formulario.anio.trim()) {
            alert("Debe ingresar el año");
            return false;
        }

        if (!formulario.color.trim()) {
            alert("Debe ingresar el color");
            return false;
        }

        if (!formulario.paisOrigen) {
            alert("Debe seleccionar el país de origen");
            return false;
        }

        if (formulario.paisOrigen !== "CL" && formulario.paisOrigen !== "AR") {
            alert("El país de origen solo puede ser Chile o Argentina");
            return false;
        }

        if (!formulario.rutPropietario.trim()) {
            alert("Debe ingresar el RUT del propietario");
            return false;
        }

        if (!formulario.tipoMovimiento) {
            alert("Debe seleccionar el movimiento");
            return false;
        }

        if (!formulario.pasoFronterizo) {
            alert("Debe seleccionar el paso fronterizo");
            return false;
        }

        if (!formulario.diasEstadia) {
            alert("Debe ingresar los días de estadía");
            return false;
        }

        const dias = Number(formulario.diasEstadia);

        if (dias < 1 || dias > 180) {
            alert("Los días de estadía deben estar entre 1 y 180");
            return false;
        }

        return true;
    };

    const registrarVehiculo = async (e) => {
        e.preventDefault();

        if (!puedeRegistrar) {
            alert("Solo los usuarios TURISTA pueden registrar vehículos");
            return;
        }

        if (!validarFormulario()) {
            return;
        }

        try {
            setCargando(true);

            const nuevoVehiculo = {
                ...formulario,
                patente: formulario.patente.trim().toUpperCase(),
                diasEstadia: Number(formulario.diasEstadia)
            };

            await vehiculoService.registrarVehiculo(nuevoVehiculo);

            alert("Vehículo registrado correctamente");

            limpiarFormulario();
            cargarVehiculos();

        } catch (error) {
            console.error("Error al registrar vehículo", error);

            if (error.response?.status === 403) {
                alert("No tienes permisos para registrar vehículos");
                return;
            }

            if (error.response?.status === 409) {
                alert("Ya existe un vehículo con esa patente");
                return;
            }

            if (error.response?.status === 400) {
                alert("Datos inválidos. Revisa los campos del formulario.");
                return;
            }

            alert("No se pudo registrar el vehículo");
        } finally {
            setCargando(false);
        }
    };

    const aprobarVehiculo = async (id) => {
        try {
            setCargando(true);
            await vehiculoService.aprobarVehiculo(id);
            alert("Vehículo aprobado correctamente");
            cargarVehiculos();
        } catch (error) {
            console.error("Error al aprobar vehículo", error);
            alert("No se pudo aprobar el vehículo");
        } finally {
            setCargando(false);
        }
    };

    const rechazarVehiculo = async (id) => {
        try {
            setCargando(true);
            await vehiculoService.rechazarVehiculo(id);
            alert("Vehículo rechazado correctamente");
            cargarVehiculos();
        } catch (error) {
            console.error("Error al rechazar vehículo", error);
            alert("No se pudo rechazar el vehículo");
        } finally {
            setCargando(false);
        }
    };

    const enviarRevision = async (id) => {
        try {
            setCargando(true);
            await vehiculoService.enviarRevision(id);
            alert("Vehículo enviado a revisión");
            cargarVehiculos();
        } catch (error) {
            console.error("Error al enviar a revisión", error);
            alert("No se pudo enviar a revisión");
        } finally {
            setCargando(false);
        }
    };

    const eliminarVehiculo = async (id) => {
        const confirmar = window.confirm("¿Seguro que desea eliminar este vehículo?");

        if (!confirmar) return;

        try {
            setCargando(true);
            await vehiculoService.eliminarVehiculo(id);
            alert("Vehículo eliminado correctamente");
            cargarVehiculos();
        } catch (error) {
            console.error("Error al eliminar vehículo", error);
            alert("No se pudo eliminar el vehículo");
        } finally {
            setCargando(false);
        }
    };

    const filtrarPorEstado = async () => {
        if (!puedeRevisar) {
            return;
        }

        if (!estadoFiltro) {
            alert("Debe seleccionar un estado");
            return;
        }

        try {
            setCargando(true);

            const response = await vehiculoService.buscarPorEstado(estadoFiltro);

            setVehiculos(response.data || []);

        } catch (error) {
            console.error("Error al filtrar por estado", error);
            setVehiculos([]);
        } finally {
            setCargando(false);
        }
    };

    const buscarPatente = async () => {
        if (!puedeRevisar) {
            return;
        }

        if (!patenteFiltro.trim()) {
            alert("Debe ingresar una patente");
            return;
        }

        try {
            setCargando(true);

            const response = await vehiculoService.buscarPorPatente(
                patenteFiltro.trim().toUpperCase()
            );

            setVehiculos([response.data]);

        } catch (error) {
            console.error("Error al buscar patente", error);
            alert("No se encontró vehículo con esa patente");
            setVehiculos([]);
        } finally {
            setCargando(false);
        }
    };

    const limpiarFiltros = () => {
        setEstadoFiltro("");
        setPatenteFiltro("");
        cargarVehiculos();
    };

    const obtenerBadgeEstado = (estado) => {
        if (estado === "APROBADO") return "badge rounded-pill bg-success-subtle text-success px-3 py-2";
        if (estado === "RECHAZADO") return "badge rounded-pill bg-danger-subtle text-danger px-3 py-2";
        if (estado === "EN_REVISION") return "badge rounded-pill bg-warning-subtle text-warning px-3 py-2";
        return "badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2";
    };

    const formatearPais = (pais) => {
        if (pais === "CL") return "Chile";
        if (pais === "AR") return "Argentina";
        return pais || "Sin país";
    };

    const formatearPaso = (paso) => {
        if (paso === "LOS_LIBERTADORES") return "Los Libertadores";
        if (paso === "CARDENAL_SAMORE") return "Cardenal Samoré";
        return paso || "Sin paso";
    };

    const totalPendientes = vehiculos.filter(v => v.estado === "PENDIENTE").length;
    const totalAprobados = vehiculos.filter(v => v.estado === "APROBADO").length;
    const totalRevision = vehiculos.filter(v => v.estado === "EN_REVISION").length;

    const TablaVehiculos = ({ modoTurista = false }) => (
        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "22px", overflow: "hidden" }}>
            <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="fw-bold m-0">
                        {modoTurista ? "Mis Vehículos Registrados" : "Vehículos Registrados"}
                    </h5>

                    <span className="text-muted small">
                        {modoTurista
                            ? "Listado de vehículos asociados a tu usuario turista."
                            : "Listado actualizado desde el microservicio de vehículos."}
                    </span>
                </div>

                <button
                    className="btn btn-outline-success btn-sm rounded-pill px-3"
                    onClick={cargarVehiculos}
                >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Actualizar
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            {!modoTurista && <th>ID</th>}
                            <th>Patente</th>
                            {!modoTurista && <th>Propietario</th>}
                            <th>Vehículo</th>
                            <th>País</th>
                            <th>Movimiento</th>
                            <th>Paso</th>
                            <th>Estado</th>
                            <th>Días</th>
                            {!modoTurista && <th>Acciones</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={modoTurista ? "7" : "10"} className="text-center py-4">
                                    Cargando vehículos...
                                </td>
                            </tr>
                        ) : vehiculos.length === 0 ? (
                            <tr>
                                <td colSpan={modoTurista ? "7" : "10"} className="text-center py-4 text-muted">
                                    No existen vehículos registrados
                                </td>
                            </tr>
                        ) : (
                            vehiculos.map((vehiculo) => (
                                <tr key={vehiculo.id}>
                                    {!modoTurista && <td>{vehiculo.id}</td>}

                                    <td className="fw-bold">
                                        {vehiculo.patente}
                                    </td>

                                    {!modoTurista && (
                                        <td>{vehiculo.rutPropietario}</td>
                                    )}

                                    <td>
                                        <div className="fw-semibold">
                                            {vehiculo.marca} {vehiculo.modelo}
                                        </div>
                                        <small className="text-muted">
                                            {vehiculo.tipoVehiculo} - {vehiculo.color}
                                        </small>
                                    </td>

                                    <td>{formatearPais(vehiculo.paisOrigen)}</td>
                                    <td>{vehiculo.tipoMovimiento}</td>
                                    <td>{formatearPaso(vehiculo.pasoFronterizo)}</td>

                                    <td>
                                        <span className={obtenerBadgeEstado(vehiculo.estado)}>
                                            {vehiculo.estado}
                                        </span>
                                    </td>

                                    <td>{vehiculo.diasEstadia}</td>

                                    {!modoTurista && (
                                        <td>
                                            <div className="d-flex gap-2 flex-wrap">
                                                {puedeRevisar && (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => aprobarVehiculo(vehiculo.id)}
                                                            disabled={vehiculo.estado === "APROBADO"}
                                                        >
                                                            Aprobar
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => rechazarVehiculo(vehiculo.id)}
                                                            disabled={vehiculo.estado === "RECHAZADO"}
                                                        >
                                                            Rechazar
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-warning"
                                                            onClick={() => enviarRevision(vehiculo.id)}
                                                            disabled={vehiculo.estado === "EN_REVISION"}
                                                        >
                                                            Revisión
                                                        </button>
                                                    </>
                                                )}

                                                {puedeEliminar && (
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => eliminarVehiculo(vehiculo.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}

                                                {!puedeRevisar && !puedeEliminar && (
                                                    <span className="text-muted small">
                                                        Sin acciones
                                                    </span>
                                                )}
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
    );

    return (
        <div className="container-fluid px-3" style={{ maxWidth: "1400px" }}>

            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h1 className="fw-bold m-0 text-dark" style={{ letterSpacing: "-0.5px" }}>
                        Registro de Vehículos
                    </h1>

                    <p className="text-muted m-0 small">
                        {puedeRegistrar
                            ? "Registra y consulta solo tus vehículos asociados a tu usuario turista."
                            : "Registro, consulta y validación de vehículos asociados a turistas."}
                    </p>
                </div>

                <span className="badge bg-white text-dark border rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2">
                    <span className="spinner-grow bg-success" style={{ width: "8px", height: "8px" }}></span>
                    Servicio vehículos activo
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
                <i className="bi bi-car-front-fill text-primary fs-4"></i>

                <div>
                    <h6 className="fw-bold m-0" style={{ color: "#1e40af" }}>
                        Control vehicular fronterizo
                    </h6>

                    <p className="m-0 small" style={{ color: "#2563eb", lineHeight: "1.5" }}>
                        Los turistas pueden registrar vehículos para ingreso o salida entre Chile y Argentina.
                        Los funcionarios PDI y administradores pueden revisar, aprobar o rechazar los registros.
                    </p>
                </div>
            </div>

            <div className="d-flex flex-wrap gap-3 mb-4">
                <CardResumen
                    titulo={puedeRegistrar ? "Mis Vehículos" : "Total Vehículos"}
                    cantidad={vehiculos.length}
                    tendencia="Registros encontrados"
                    esPositiva={true}
                    icono="car-front"
                    colorIcono="#0d6efd"
                />

                <CardResumen
                    titulo="Pendientes"
                    cantidad={totalPendientes}
                    tendencia="Por revisar"
                    esPositiva={false}
                    icono="hourglass-split"
                    colorIcono="#f59e0b"
                />

                <CardResumen
                    titulo="Aprobados"
                    cantidad={totalAprobados}
                    tendencia="Autorizados"
                    esPositiva={true}
                    icono="check-circle"
                    colorIcono="#198754"
                />

                <CardResumen
                    titulo="En Revisión"
                    cantidad={totalRevision}
                    tendencia="Control PDI"
                    esPositiva={false}
                    icono="shield-exclamation"
                    colorIcono="#dc3545"
                />
            </div>

            <div className="row g-4 mb-4">

                {puedeRegistrar && (
                    <div className="col-12 col-xl-5">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "22px" }}>
                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h5 className="fw-bold m-0">
                                            Nuevo Vehículo
                                        </h5>

                                        <span className="text-muted small">
                                            Registra un vehículo asociado a tu usuario turista.
                                        </span>
                                    </div>

                                    <i className="bi bi-plus-circle text-primary fs-4"></i>
                                </div>

                                <form onSubmit={registrarVehiculo}>

                                    <div className="row g-3">

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Patente</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="patente"
                                                value={formulario.patente}
                                                onChange={handleChange}
                                                placeholder="ABCD12"
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Tipo</label>
                                            <select
                                                className="form-select"
                                                name="tipoVehiculo"
                                                value={formulario.tipoVehiculo}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Seleccione</option>
                                                <option value="PARTICULAR">Particular</option>
                                                <option value="DIPLOMATICO">Diplomático</option>
                                                <option value="CARGA">Carga</option>
                                                <option value="MOTOCICLETA">Motocicleta</option>
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Marca</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="marca"
                                                value={formulario.marca}
                                                onChange={handleChange}
                                                placeholder="Toyota"
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Modelo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="modelo"
                                                value={formulario.modelo}
                                                onChange={handleChange}
                                                placeholder="Corolla"
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Año</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="anio"
                                                value={formulario.anio}
                                                onChange={handleChange}
                                                placeholder="2022"
                                                maxLength="4"
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Color</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="color"
                                                value={formulario.color}
                                                onChange={handleChange}
                                                placeholder="Blanco"
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">País origen</label>
                                            <select
                                                className="form-select"
                                                name="paisOrigen"
                                                value={formulario.paisOrigen}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Seleccione</option>
                                                <option value="CL">Chile</option>
                                                <option value="AR">Argentina</option>
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">RUT propietario</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="rutPropietario"
                                                value={formulario.rutPropietario}
                                                onChange={handleChange}
                                                placeholder="20604267-2"
                                                required
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Movimiento</label>
                                            <select
                                                className="form-select"
                                                name="tipoMovimiento"
                                                value={formulario.tipoMovimiento}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Seleccione</option>
                                                <option value="ENTRADA">Entrada</option>
                                                <option value="SALIDA">Salida</option>
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Paso fronterizo</label>
                                            <select
                                                className="form-select"
                                                name="pasoFronterizo"
                                                value={formulario.pasoFronterizo}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Seleccione</option>
                                                <option value="LOS_LIBERTADORES">Los Libertadores</option>
                                            
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label fw-semibold">Días estadía</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="diasEstadia"
                                                value={formulario.diasEstadia}
                                                onChange={handleChange}
                                                min="1"
                                                max="180"
                                                placeholder="30"
                                                required
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-semibold">Observaciones</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                name="observaciones"
                                                value={formulario.observaciones}
                                                onChange={handleChange}
                                                placeholder="Vehículo particular de turista"
                                            />
                                        </div>

                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mt-4 d-flex justify-content-center align-items-center gap-2"
                                        disabled={cargando}
                                    >
                                        {cargando ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Registrando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-save"></i>
                                                Registrar Vehículo
                                            </>
                                        )}
                                    </button>

                                </form>

                            </div>
                        </div>
                    </div>
                )}

                {puedeRegistrar && (
                    <div className="col-12 col-xl-7">
                        <TablaVehiculos modoTurista={true} />
                    </div>
                )}

                {puedeRevisar && (
                    <div className="col-12">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "22px" }}>
                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h5 className="fw-bold m-0">
                                            Filtros de búsqueda
                                        </h5>

                                        <span className="text-muted small">
                                            Consulta vehículos por patente o estado del trámite.
                                        </span>
                                    </div>

                                    <i className="bi bi-funnel text-primary fs-4"></i>
                                </div>

                                <div className="row g-3 align-items-end">
                                    <div className="col-12 col-md-5">
                                        <label className="form-label fw-semibold">Buscar patente</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={patenteFiltro}
                                            onChange={(e) => setPatenteFiltro(e.target.value)}
                                            placeholder="ABCD12"
                                        />
                                    </div>

                                    <div className="col-12 col-md-2">
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={buscarPatente}
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
                    </div>
                )}

            </div>

            {puedeRevisar && (
                <TablaVehiculos modoTurista={false} />
            )}

        </div>
    );
}

export default Vehiculos;