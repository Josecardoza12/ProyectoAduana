import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

    const rolUsuario = localStorage.getItem("rol");

    const esTurista = rolUsuario === "TURISTA";

    const puedeVerHistorialPasajeros =
        rolUsuario === "ADMIN" ||
        rolUsuario === "PDI" ||
        rolUsuario === "SAG";

    const puedeVerGestionMenores =
        rolUsuario === "ADMIN" ||
        rolUsuario === "PDI";

    const puedeVerValidacionVehiculo =
        rolUsuario === "ADMIN" ||
        rolUsuario === "PDI";

    const puedeVerTramites =
        rolUsuario === "ADMIN" ||
        rolUsuario === "PDI" ||
        rolUsuario === "SAG";

    const puedeVerHistorialSag =
        rolUsuario === "ADMIN" ||
        rolUsuario === "SAG" ||
        rolUsuario === "PDI" ||
        rolUsuario === "TURISTA";

    return (
        <div className="sidebar">

            <h3 className="sidebar-title">
                Menú Principal
            </h3>

            <nav className="sidebar-menu">

                <Link
                    to={esTurista ? "/turista" : "/dashboard"}
                    className="sidebar-link"
                >
                    📊 Dashboard
                </Link>

                {esTurista && (
                    <Link to="/registro-pasajero" className="sidebar-link">
                        🧍 Registro Pasajero
                    </Link>
                )}

                {esTurista && (
                    <Link to="/historial-pasajeros" className="sidebar-link">
                        📋 Mi Registro de Pasajero
                    </Link>
                )}

                {esTurista && (
                    <Link to="/gestion-menores" className="sidebar-link">
                        👶 Registrar Menor
                    </Link>
                )}

                {puedeVerGestionMenores && (
                    <Link to="/gestion-menores" className="sidebar-link">
                        👶 Gestión de Menores
                    </Link>
                )}

                {puedeVerHistorialPasajeros && (
                    <Link to="/historial-pasajeros" className="sidebar-link">
                        📋 Historial Pasajeros
                    </Link>
                )}

                {esTurista && (
                    <Link to="/vehiculos" className="sidebar-link">
                        🚗 Registro de Vehículo
                    </Link>
                )}

                {esTurista && (
                    <Link to="/declaraciones" className="sidebar-link">
                        📄 Declaración SAG
                    </Link>
                )}

                {puedeVerHistorialSag && (
                    <Link to="/historial" className="sidebar-link">
                        📋 Historial SAG
                    </Link>
                )}

                {puedeVerTramites && (
                    <Link to="/tramites" className="sidebar-link">
                        📑 Trámites
                    </Link>
                )}

                {puedeVerValidacionVehiculo && (
                    <Link to="/validacion-vehiculo" className="sidebar-link">
                        🚗 Validación de Vehículo
                    </Link>
                )}

            </nav>

        </div>
    );
}

export default Sidebar;