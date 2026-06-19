import { useState } from "react";
import pasajeroService from "../services/pasajeroService";

function RegistroPasajero() {

    const [pasoActual, setPasoActual] = useState(1);
    const [cargando, setCargando] = useState(false);

    const [formulario, setFormulario] = useState({
        userId: Number(localStorage.getItem("userId")),
        nombres: "",
        apellidos: "",
        rut: "",
        pasaporte: "",
        email: "",
        telefono: "",
        nacionalidad: "",
        paisOrigen: "",
        paisDestino: "",
        fechaIngreso: "",
        motivoViaje: "",
        observaciones: ""
    });

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const validarPasoUno = () => {
        if (!formulario.nombres.trim()) {
            alert("Debe ingresar los nombres");
            return false;
        }

        if (!formulario.apellidos.trim()) {
            alert("Debe ingresar los apellidos");
            return false;
        }

        if (!formulario.rut.trim()) {
            alert("Debe ingresar el RUT");
            return false;
        }

        if (!formulario.pasaporte.trim()) {
            alert("Debe ingresar el pasaporte");
            return false;
        }

        if (!formulario.email.trim()) {
            alert("Debe ingresar el email");
            return false;
        }

        if (!formulario.telefono.trim()) {
            alert("Debe ingresar el teléfono");
            return false;
        }

        return true;
    };

    const validarPasoDos = () => {
        if (!formulario.nacionalidad.trim()) {
            alert("Debe seleccionar la nacionalidad");
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

        if (!formulario.fechaIngreso.trim()) {
            alert("Debe ingresar la fecha de ingreso");
            return false;
        }

        if (!formulario.motivoViaje.trim()) {
            alert("Debe seleccionar el motivo del viaje");
            return false;
        }

        return true;
    };

    const siguientePaso = () => {
        if (pasoActual === 1 && !validarPasoUno()) {
            return;
        }

        if (pasoActual === 2 && !validarPasoDos()) {
            return;
        }

        setPasoActual(pasoActual + 1);
    };

    const anteriorPaso = () => {
        setPasoActual(pasoActual - 1);
    };

    const limpiarFormulario = () => {
        setFormulario({
            userId: Number(localStorage.getItem("userId")),
            nombres: "",
            apellidos: "",
            rut: "",
            pasaporte: "",
            email: "",
            telefono: "",
            nacionalidad: "",
            paisOrigen: "",
            paisDestino: "",
            fechaIngreso: "",
            motivoViaje: "",
            observaciones: ""
        });

        setPasoActual(1);
    };

    const registrarPasajero = async () => {
        try {
            setCargando(true);

            const userId = Number(localStorage.getItem("userId"));

            if (!userId) {
                alert("No se encontró el usuario autenticado. Vuelva a iniciar sesión.");
                return;
            }

            const pasajero = {
                ...formulario,
                userId: userId
            };

            await pasajeroService.registrarPasajero(pasajero);

            alert("Pasajero registrado correctamente");

            limpiarFormulario();

        } catch (error) {
            console.error("Error al registrar pasajero", error);

            if (error.response?.status === 403) {
                alert("No tienes permisos para registrar pasajeros. Debes ingresar como TURISTA.");
                return;
            }

            if (error.response?.status === 400) {
                alert("Datos inválidos. Revisa que todos los campos estén completos.");
                return;
            }

            alert("No se pudo registrar el pasajero");

        } finally {
            setCargando(false);
        }
    };

    const obtenerClasePaso = (paso) => {
        if (pasoActual > paso) {
            return {
                circulo: "bg-success text-white",
                linea: "bg-success",
                icono: "bi bi-check-lg"
            };
        }

        if (pasoActual === paso) {
            return {
                circulo: "text-white",
                linea: "bg-primary",
                icono: null
            };
        }

        return {
            circulo: "bg-secondary-subtle text-secondary",
            linea: "bg-secondary-subtle",
            icono: null
        };
    };

    const PasoIndicador = ({ numero, titulo, descripcion }) => {
        const clase = obtenerClasePaso(numero);

        return (
            <div className="d-flex align-items-center flex-grow-1">
                <div className="d-flex align-items-center gap-3">
                    <div
                        className={`d-flex align-items-center justify-content-center rounded-circle fw-bold ${clase.circulo}`}
                        style={{
                            width: "52px",
                            height: "52px",
                            background:
                                pasoActual === numero
                                    ? "linear-gradient(135deg, #003DA5, #4DA6FF)"
                                    : undefined
                        }}
                    >
                        {clase.icono ? (
                            <i className={clase.icono}></i>
                        ) : (
                            numero
                        )}
                    </div>

                    <div>
                        <h6 className="fw-bold mb-1 text-dark">
                            {titulo}
                        </h6>

                        <p className="text-muted small mb-0" style={{ lineHeight: "1.3" }}>
                            {descripcion}
                        </p>
                    </div>
                </div>

                {numero < 3 && (
                    <div
                        className={`mx-4 rounded-pill ${clase.linea}`}
                        style={{
                            height: "4px",
                            flex: 1,
                            minWidth: "100px"
                        }}
                    ></div>
                )}
            </div>
        );
    };

    return (
        <div className="container-fluid px-3" style={{ maxWidth: "1200px" }}>

            <div className="mb-4">
                <h1 className="fw-bold m-0 text-dark" style={{ letterSpacing: "-0.5px" }}>
                    Registro de Pasajero
                </h1>

                <p className="text-muted m-0">
                    Complete el formulario con los datos del pasajero
                </p>
            </div>

            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "20px" }}>
                <div className="card-body p-4 p-lg-5">
                    <div className="d-flex justify-content-between align-items-center">
                        <PasoIndicador
                            numero={1}
                            titulo="Datos Personales"
                            descripcion="Información básica del pasajero"
                        />

                        <PasoIndicador
                            numero={2}
                            titulo="Información Migratoria"
                            descripcion="Datos de viaje y migración"
                        />

                        <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className={`d-flex align-items-center justify-content-center rounded-circle fw-bold ${obtenerClasePaso(3).circulo}`}
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        background:
                                            pasoActual === 3
                                                ? "linear-gradient(135deg, #003DA5, #4DA6FF)"
                                                : undefined
                                    }}
                                >
                                    {pasoActual > 3 ? (
                                        <i className="bi bi-check-lg"></i>
                                    ) : (
                                        3
                                    )}
                                </div>

                                <div>
                                    <h6 className="fw-bold mb-1 text-dark">
                                        Confirmación
                                    </h6>

                                    <p className="text-muted small mb-0" style={{ lineHeight: "1.3" }}>
                                        Revise y confirme los datos
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {pasoActual === 1 && (
                <div className="card border-0 shadow-sm" style={{ borderRadius: "20px" }}>
                    <div className="card-body p-4 p-lg-5">

                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="bi bi-person text-primary"></i>
                            Datos Personales
                        </h4>

                        <div className="row g-4">

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">Nombres</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    name="nombres"
                                    value={formulario.nombres}
                                    onChange={handleChange}
                                    placeholder="Ej: José Ignacio"
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">Apellidos</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    name="apellidos"
                                    value={formulario.apellidos}
                                    onChange={handleChange}
                                    placeholder="Ej: Cardoza Miranda"
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">RUT</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    name="rut"
                                    value={formulario.rut}
                                    onChange={handleChange}
                                    placeholder="Ej: 20604267-2"
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">Pasaporte</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    name="pasaporte"
                                    value={formulario.pasaporte}
                                    onChange={handleChange}
                                    placeholder="Ej: A1234567"
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">
                                    <i className="bi bi-envelope me-1"></i>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    name="email"
                                    value={formulario.email}
                                    onChange={handleChange}
                                    placeholder="Ej: correo@ejemplo.cl"
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">
                                    <i className="bi bi-telephone me-1"></i>
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    name="telefono"
                                    value={formulario.telefono}
                                    onChange={handleChange}
                                    placeholder="Ej: +56912345678"
                                />
                            </div>

                        </div>

                        <hr className="my-4" />

                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-primary btn-lg px-5 d-flex align-items-center gap-2"
                                style={{
                                    borderRadius: "14px",
                                    background: "linear-gradient(135deg, #003DA5, #4DA6FF)"
                                }}
                                onClick={siguientePaso}
                            >
                                Siguiente
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>

                    </div>
                </div>
            )}


            {pasoActual === 2 && (
                <div className="card border-0 shadow-sm" style={{ borderRadius: "20px" }}>
                    <div className="card-body p-4 p-lg-5">

                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="bi bi-geo-alt text-primary"></i>
                            Información Migratoria
                        </h4>

                        <div className="row g-4">

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">Nacionalidad</label>
                                <select
                                    className="form-select form-select-lg"
                                    name="nacionalidad"
                                    value={formulario.nacionalidad}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="Chile">Chile</option>
                                    <option value="Argentina">Argentina</option>
                                    
                                </select>
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">País de Origen</label>
                                <select
                                    className="form-select form-select-lg"
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
                                <label className="form-label fw-semibold">País de Destino</label>
                                <select
                                    className="form-select form-select-lg"
                                    name="paisDestino"
                                    value={formulario.paisDestino}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="Chile">Chile</option>
                                    <option value="Argentina">Argentina</option>
                                    
                                </select>
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label fw-semibold">
                                    <i className="bi bi-calendar-event me-1"></i>
                                    Fecha de Ingreso
                                </label>
                                <input
                                    type="date"
                                    className="form-control form-control-lg"
                                    name="fechaIngreso"
                                    value={formulario.fechaIngreso}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-semibold">Motivo del Viaje</label>
                                <select
                                    className="form-select form-select-lg"
                                    name="motivoViaje"
                                    value={formulario.motivoViaje}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="Turismo">Turismo</option>
                                    <option value="Trabajo">Trabajo</option>
                                    <option value="Estudios">Estudios</option>
                                    <option value="Visita familiar">Visita familiar</option>
                                    <option value="Negocios">Negocios</option>
                                    <option value="Tránsito">Tránsito</option>
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
                                    placeholder="Ingrese observaciones adicionales del pasajero"
                                />
                            </div>

                        </div>

                        <hr className="my-4" />

                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-lg px-5"
                                style={{ borderRadius: "14px" }}
                                onClick={anteriorPaso}
                            >
                                Anterior
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary btn-lg px-5 d-flex align-items-center gap-2"
                                style={{
                                    borderRadius: "14px",
                                    background: "linear-gradient(135deg, #003DA5, #4DA6FF)"
                                }}
                                onClick={siguientePaso}
                            >
                                Siguiente
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>

                    </div>
                </div>
            )}


            {pasoActual === 3 && (
                <div className="card border-0 shadow-sm" style={{ borderRadius: "20px" }}>
                    <div className="card-body p-4 p-lg-5">

                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <i className="bi bi-check-circle text-success"></i>
                            Confirmación de Datos
                        </h4>

                        <div
                            className="p-4 rounded-4 mb-4"
                            style={{
                                backgroundColor: "#f8fafc",
                                border: "1px solid #e5e7eb"
                            }}
                        >
                            <div className="row g-4">

                                <div className="col-12 col-md-6">
                                    <span className="text-muted small">Nombre Completo</span>
                                    <p className="fw-bold mb-0">
                                        {formulario.nombres} {formulario.apellidos}
                                    </p>
                                </div>

                                <div className="col-12 col-md-6">
                                    <span className="text-muted small">RUT</span>
                                    <p className="fw-bold mb-0">
                                        {formulario.rut}
                                    </p>
                                </div>

                                <div className="col-12 col-md-6">
                                    <span className="text-muted small">Pasaporte</span>
                                    <p className="fw-bold mb-0">
                                        {formulario.pasaporte}
                                    </p>
                                </div>

                                <div className="col-12 col-md-6">
                                    <span className="text-muted small">Email</span>
                                    <p className="fw-bold mb-0">
                                        {formulario.email}
                                    </p>
                                </div>

                                <div className="col-12 col-md-6">
                                    <span className="text-muted small">Teléfono</span>
                                    <p className="fw-bold mb-0">
                                        {formulario.telefono}
                                    </p>
                                </div>

                                <div className="col-12 col-md-6">
                                    <span className="text-muted small">Nacionalidad</span>
                                    <p className="fw-bold mb-0">
                                        {formulario.nacionalidad}
                                    </p>
                                </div>

                                <div className="col-12 col-md-6">
                                    <span className="text-muted small">Ruta</span>
                                    <p className="fw-bold mb-0">
                                        {formulario.paisOrigen} → {formulario.paisDestino}
                                    </p>
                                </div>

                                <div className="col-12 col-md-6">
                                    <span className="text-muted small">Fecha de Ingreso</span>
                                    <p className="fw-bold mb-0">
                                        {formulario.fechaIngreso}
                                    </p>
                                </div>

                                <div className="col-12 col-md-6">
                                    <span className="text-muted small">Motivo del Viaje</span>
                                    <p className="fw-bold mb-0">
                                        {formulario.motivoViaje}
                                    </p>
                                </div>

                                <div className="col-12">
                                    <span className="text-muted small">Observaciones</span>
                                    <p className="fw-bold mb-0">
                                        {formulario.observaciones || "Sin observaciones"}
                                    </p>
                                </div>

                            </div>
                        </div>

                        <hr className="my-4" />

                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-lg px-5"
                                style={{ borderRadius: "14px" }}
                                onClick={anteriorPaso}
                                disabled={cargando}
                            >
                                Anterior
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary btn-lg px-5 d-flex align-items-center gap-2"
                                style={{
                                    borderRadius: "14px",
                                    background: "linear-gradient(135deg, #003DA5, #4DA6FF)"
                                }}
                                onClick={registrarPasajero}
                                disabled={cargando}
                            >
                                {cargando ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm"></span>
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        Completar Registro
                                        <i className="bi bi-chevron-right"></i>
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default RegistroPasajero;