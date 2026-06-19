import { Navigate } from "react-router-dom";
import authService from "../services/authService";

function ProtectedRoute({ children, rolesPermitidos }) {

    const estaAutenticado = authService.estaAutenticado();
    const rolUsuario = localStorage.getItem("rol");

    if (!estaAutenticado) {
        return <Navigate to="/login" replace />;
    }

    if (rolesPermitidos && !rolesPermitidos.includes(rolUsuario)) {
        if (rolUsuario === "TURISTA") {
            return <Navigate to="/turista" replace />;
        }

        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;