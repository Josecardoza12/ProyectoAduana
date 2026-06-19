import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardTurista() {

    const navigate = useNavigate();

    const correoUsuario = localStorage.getItem("correo");
    const rolUsuario = localStorage.getItem("rol") || "TURISTA";

    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

    const obtenerNombreUsuario = () => {
        if (!correoUsuario) {
            return "Usuario";
        }

        const nombreCorreo = correoUsuario.split("@")[0];

        return nombreCorreo
            .replaceAll(".", " ")
            .replaceAll("_", " ")
            .replaceAll("-", " ")
            .split(" ")
            .filter((palabra) => palabra.trim() !== "")
            .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(" ");
    };

    const nombreUsuario = obtenerNombreUsuario();

    const opciones = [
        {
            titulo: "Registrar Pasajero",
            descripcion: "Completa tus datos personales y migratorios.",
            icono: "bi-person-check",
            ruta: "/registro-pasajero",
            color: "#0d6efd",
            fondo: "#eff6ff"
        },
        {
            titulo: "Mi Registro de Pasajero",
            descripcion: "Consulta el estado de tus datos migratorios registrados.",
            icono: "bi-person-lines-fill",
            ruta: "/historial-pasajeros",
            color: "#0891b2",
            fondo: "#ecfeff"
        },
        {
            titulo: "Registrar Menor",
            descripcion: "Registra una solicitud para un menor de edad que cruzará la frontera.",
            icono: "bi-person-hearts",
            ruta: "/gestion-menores",
            color: "#8b5cf6",
            fondo: "#f5f3ff"
        },
        {
            titulo: "Registrar Vehículo",
            descripcion: "Registra tu vehículo para ingreso o salida.",
            icono: "bi-car-front",
            ruta: "/vehiculos",
            color: "#4f46e5",
            fondo: "#f5f3ff"
        },
        {
            titulo: "Declaración SAG",
            descripcion: "Declara productos o alimentos sujetos a control.",
            icono: "bi-file-earmark-check",
            ruta: "/declaraciones",
            color: "#198754",
            fondo: "#ecfdf5"
        },
        {
            titulo: "Mis Declaraciones",
            descripcion: "Consulta el estado de tus declaraciones SAG.",
            icono: "bi-clock-history",
            ruta: "/historial",
            color: "#f59e0b",
            fondo: "#fffbeb"
        }
    ];

    const cerrarSesion = () => {
        localStorage.clear();
        navigate("/login");
    };

    const irA = (ruta) => {
        navigate(ruta);
        window.scrollTo(0, 0);
    };

    return (
        <div
            className="min-vh-100"
            style={{
                background:
                    "linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)"
            }}
        >
            <nav
                className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
                style={{
                    background: "linear-gradient(135deg, #003DA5, #0d6efd)",
                    color: "white",
                    position: "sticky",
                    top: 0,
                    zIndex: 100
                }}
            >
                <div>
                    <h3 className="fw-bold mb-0">SPCA</h3>
                    <small>Sistema de Proceso en Control Aduana</small>
                </div>

                <div className="d-flex align-items-center gap-3 position-relative">

                    <button
                        className="btn d-flex align-items-center justify-content-center position-relative"
                        style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.16)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.18)"
                        }}
                        onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                        title="Notificaciones"
                    >
                        <i className="bi bi-bell fs-4"></i>

                        <span
                            className="position-absolute"
                            style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: "#ef4444",
                                top: "10px",
                                right: "10px",
                                border: "2px solid white"
                            }}
                        ></span>
                    </button>

                    {mostrarNotificaciones && (
                        <div
                            className="position-absolute end-0 bg-white text-dark shadow-lg"
                            style={{
                                top: "62px",
                                width: "320px",
                                borderRadius: "18px",
                                zIndex: 200,
                                overflow: "hidden"
                            }}
                        >
                            <div className="p-3 border-bottom">
                                <h6 className="fw-bold mb-0">
                                    Notificaciones
                                </h6>
                                <small className="text-muted">
                                    Avisos del portal turista
                                </small>
                            </div>

                            <div className="p-3">
                                <div className="d-flex gap-3 mb-3">
                                    <div
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                            borderRadius: "12px",
                                            backgroundColor: "#eff6ff",
                                            color: "#0d6efd"
                                        }}
                                    >
                                        <i className="bi bi-info-circle"></i>
                                    </div>

                                    <div>
                                        <p className="fw-semibold mb-0">
                                            Portal activo
                                        </p>
                                        <small className="text-muted">
                                            Puedes registrar pasajero, vehículo y declaración SAG.
                                        </small>
                                    </div>
                                </div>

                                <div className="d-flex gap-3">
                                    <div
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                            borderRadius: "12px",
                                            backgroundColor: "#ecfdf5",
                                            color: "#198754"
                                        }}
                                    >
                                        <i className="bi bi-check-circle"></i>
                                    </div>

                                    <div>
                                        <p className="fw-semibold mb-0">
                                            Sesión iniciada
                                        </p>
                                        <small className="text-muted">
                                            Usuario turista autenticado correctamente.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-end">
                        <div className="fw-bold">
                            {nombreUsuario}
                        </div>

                        <small>
                            Rol: {rolUsuario}
                        </small>
                    </div>

                    <button
                        className="btn btn-light fw-semibold px-4"
                        style={{
                            borderRadius: "14px",
                            height: "52px"
                        }}
                        onClick={cerrarSesion}
                    >
                        Salir
                    </button>
                </div>
            </nav>

            <main className="container py-4">

                <section
                    className="mb-4 p-4 position-relative overflow-hidden"
                    style={{
                        borderRadius: "26px",
                        background: "linear-gradient(135deg, #ffffff, #eef4ff)",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)"
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: "180px",
                            height: "180px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(13, 110, 253, 0.10)",
                            right: "-60px",
                            top: "-70px"
                        }}
                    ></div>

                    <div className="row align-items-center position-relative">
                        <div className="col-12 col-lg-8">
                            <span
                                className="badge rounded-pill px-3 py-2 mb-3"
                                style={{
                                    backgroundColor: "#dbeafe",
                                    color: "#003DA5"
                                }}
                            >
                                Portal de trámites personales
                            </span>

                            <h1
                                className="fw-bold text-dark mb-2"
                                style={{
                                    fontSize: "clamp(2rem, 3vw, 2.8rem)",
                                    letterSpacing: "-0.8px"
                                }}
                            >
                                Bienvenido al Portal del Turista
                            </h1>

                            <p
                                className="text-muted mb-0"
                                style={{
                                    fontSize: "1.05rem",
                                    maxWidth: "720px"
                                }}
                            >
                                Realiza tus trámites de ingreso, declaración y registro vehicular desde un solo lugar.
                            </p>
                        </div>

                        <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                            <div
                                className="p-3"
                                style={{
                                    borderRadius: "20px",
                                    backgroundColor: "#003DA5",
                                    color: "white"
                                }}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "16px",
                                            backgroundColor: "rgba(255,255,255,0.16)"
                                        }}
                                    >
                                        <i className="bi bi-person-check fs-4"></i>
                                    </div>

                                    <div>
                                        <div className="fw-bold">Sesión turista</div>
                                        <small style={{ color: "rgba(255,255,255,0.82)" }}>
                                            {nombreUsuario}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="d-flex justify-content-between align-items-end mb-3">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">
                            Menú de trámites
                        </h2>
                        <p className="text-muted mb-0">
                            Selecciona una opción para continuar.
                        </p>
                    </div>
                </div>

                <div className="row g-4 justify-content-center">
                    {opciones.map((opcion, index) => (
                        <div className="col-12 col-md-6 col-xl-4" key={index}>
                            <div
                                className="card border-0 h-100"
                                style={{
                                    borderRadius: "24px",
                                    cursor: "pointer",
                                    transition: "all 0.22s ease",
                                    transform: "scale(1)",
                                    minHeight: "250px",
                                    boxShadow: "0 10px 26px rgba(15, 23, 42, 0.08)",
                                    overflow: "hidden",
                                    position: "relative",
                                    backgroundColor: "white"
                                }}
                                onClick={() => irA(opcion.ruta)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.045) translateY(-7px)";
                                    e.currentTarget.style.boxShadow = "0 24px 50px rgba(0, 61, 165, 0.18)";
                                    e.currentTarget.style.zIndex = "20";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1) translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 10px 26px rgba(15, 23, 42, 0.08)";
                                    e.currentTarget.style.zIndex = "1";
                                }}
                            >
                                <div
                                    style={{
                                        height: "8px",
                                        background: opcion.color
                                    }}
                                ></div>

                                <div className="card-body p-4 d-flex flex-column">

                                    <div
                                        className="d-flex align-items-center justify-content-center mb-4"
                                        style={{
                                            width: "66px",
                                            height: "66px",
                                            borderRadius: "20px",
                                            backgroundColor: opcion.fondo
                                        }}
                                    >
                                        <i
                                            className={`bi ${opcion.icono}`}
                                            style={{
                                                color: opcion.color,
                                                fontSize: "2rem"
                                            }}
                                        ></i>
                                    </div>

                                    <h3 className="fw-bold text-dark mb-3">
                                        {opcion.titulo}
                                    </h3>

                                    <p
                                        className="text-muted mb-4"
                                        style={{
                                            lineHeight: "1.5",
                                            minHeight: "48px"
                                        }}
                                    >
                                        {opcion.descripcion}
                                    </p>

                                    <div className="mt-auto">
                                        <button
                                            className="btn btn-primary w-100 fw-semibold py-3 d-flex align-items-center justify-content-center gap-2"
                                            style={{
                                                borderRadius: "15px",
                                                background: "linear-gradient(135deg, #003DA5, #4DA6FF)",
                                                border: "none"
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                irA(opcion.ruta);
                                            }}
                                        >
                                            Ingresar
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-4 mt-3">
                    <div className="col-12 col-lg-7">
                        <div
                            className="p-4 h-100"
                            style={{
                                borderRadius: "22px",
                                backgroundColor: "white",
                                boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)"
                            }}
                        >
                            <h5 className="fw-bold mb-2">
                                Antes de iniciar
                            </h5>

                            <p className="text-muted mb-0">
                                Ten a mano tu documento de identidad, pasaporte, datos del vehículo y antecedentes de productos a declarar si corresponde.
                            </p>
                        </div>
                    </div>

                    <div className="col-12 col-lg-5">
                        <div
                            className="p-4 h-100"
                            style={{
                                borderRadius: "22px",
                                backgroundColor: "#eff6ff",
                                border: "1px solid #bfdbfe"
                            }}
                        >
                            <h5 className="fw-bold mb-2" style={{ color: "#1e40af" }}>
                                Acceso rápido
                            </h5>

                            <p className="mb-0 small" style={{ color: "#2563eb" }}>
                                Cada trámite queda asociado a tu usuario turista y podrá ser revisado por los funcionarios correspondientes.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default DashboardTurista;