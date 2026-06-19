import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";
import notificacionService from "../services/notificacionService";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const correo = localStorage.getItem("correo");
    const rol = localStorage.getItem("rol");

    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);

    const notificationRef = useRef(null);

    const obtenerNombreUsuario = () => {
        if (!correo) {
            return "Usuario";
        }

        const nombreCorreo = correo.split("@")[0];

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

    const cargarNotificaciones = async () => {
        try {
            const data = await notificacionService.obtenerNotificaciones();
            setNotificaciones(data);
        } catch (error) {
            console.error("Error al cargar notificaciones", error);
            setNotificaciones([]);
        }
    };

    const cerrarSesion = () => {
        authService.cerrarSesion();
        navigate("/login");
    };

    const toggleNotificaciones = () => {
        setMostrarNotificaciones(!mostrarNotificaciones);
    };

    const irANotificacion = (ruta) => {
        setMostrarNotificaciones(false);
        navigate(ruta);
    };

    const limpiarNotificaciones = () => {
        setNotificaciones([]);
    };

    useEffect(() => {
        cargarNotificaciones();

        const intervalo = setInterval(() => {
            cargarNotificaciones();
        }, 15000);

        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setMostrarNotificaciones(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar-spca">
            <div className="navbar-logo">
                <h2>SPCA</h2>
                <span>Sistema de Proceso en Control Aduana</span>
            </div>

            <div className="navbar-user">
                <div className="notification-wrapper" ref={notificationRef}>
                    <button
                        className="notification-btn"
                        onClick={toggleNotificaciones}
                    >
                        <i className="bi bi-bell"></i>

                        {notificaciones.length > 0 && (
                            <span className="notification-dot"></span>
                        )}
                    </button>

                    {mostrarNotificaciones && (
                        <div className="notification-dropdown">
                            <div className="notification-header">
                                <div>
                                    <h5>Notificaciones</h5>
                                    <p>
                                        {notificaciones.length > 0
                                            ? `${notificaciones.length} pendientes`
                                            : "Sin notificaciones"}
                                    </p>
                                </div>

                                {notificaciones.length > 0 && (
                                    <button
                                        className="clear-btn"
                                        onClick={limpiarNotificaciones}
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>

                            <div className="notification-list">
                                {notificaciones.length === 0 ? (
                                    <div className="notification-empty">
                                        <i className="bi bi-bell-slash"></i>
                                        <p>No tienes notificaciones nuevas</p>
                                    </div>
                                ) : (
                                    notificaciones.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className="notification-card"
                                            onClick={() => irANotificacion(notif.ruta)}
                                        >
                                            <div
                                                className={`notification-icon ${notif.colorClase}`}
                                            >
                                                <i className={`bi ${notif.icono}`}></i>
                                            </div>

                                            <div className="notification-content">
                                                <h6>{notif.titulo}</h6>
                                                <p>{notif.descripcion}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="navbar-info">
                    <strong>{nombreUsuario}</strong>
                    <small>{rol ? `Rol: ${rol}` : "Sin rol"}</small>
                </div>

                <button className="logout-btn" onClick={cerrarSesion}>
                    Salir
                </button>
            </div>
        </nav>
    );
}

export default Navbar;