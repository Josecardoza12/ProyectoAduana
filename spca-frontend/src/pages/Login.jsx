import { useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";
import "../styles/login.css";

function Login() {

    const navigate = useNavigate();

    const [rolSeleccionado, setRolSeleccionado] = useState("SAG");

    const [credenciales, setCredenciales] = useState({
        rut:"",
        correo: "",
        password: ""
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const roles = [
        "ADMIN",
        "PDI",
        "SAG",
        "TURISTA"
    ];

    const nombresRol = {
        ADMIN: "Administrador",
        PDI: "PDI",
        SAG: "SAG",
        TURISTA: "Turista"
    };

    const handleChange = (e) => {
        setCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setCargando(true);
        setError("");

        const response = await authService.login(credenciales);

        const token = response.data.token;

        const rolToken = authService.obtenerRolDesdeToken(token);
        const correoToken = authService.obtenerCorreoDesdeToken(token);
        const rutToken = authService.obtenerRutDesdeToken(token);

        if (!rolToken) {
            setError("No se pudo obtener el rol del usuario desde el token");
            return;
        }

        if (rolToken !== rolSeleccionado) {
            setError(`El usuario no pertenece al rol ${rolSeleccionado}`);
            return;
        }

        authService.guardarSesion(token);
        authService.guardarRol(rolToken);
        authService.guardarCorreo(correoToken || credenciales.correo)
        authService.guardarRut(rutToken || credenciales.rut);    
;

        const usuarioResponse = await authService.obtenerUsuarioAutenticado();

        authService.guardarUserId(usuarioResponse.data.id);
        authService.guardarRut(usuarioResponse.data.rut);

        if (rolToken === "TURISTA") {
            navigate("/turista");
        } else {
            navigate("/dashboard");
        }

    } catch (error) {
        console.error("Error al iniciar sesión", error);
        setError(
    error.response
        ? `Error ${error.response.status}: ${error.response.data || "No se pudo iniciar sesión"}`
        : "No se pudo conectar con el servidor Auth"
);
    } finally {
        setCargando(false);
    }
};

    return (
        <div className="login-page-spca">

            <div className="login-dot-pattern"></div>

            <div className="login-card-spca">

                <div className="login-header-spca">
                    <h1>SPCA</h1>
                    <h2>Sistema de Proceso en Control Aduana</h2>
                    <p>República de Chile</p>
                </div>

                <div className="login-body-spca">

                    <h3>Seleccione su perfil</h3>

                    <div className="perfil-grid">

                        {roles.map((rol) => (
                            <button
                                type="button"
                                key={rol}
                                className={
                                    rolSeleccionado === rol
                                        ? "perfil-btn perfil-activo"
                                        : "perfil-btn"
                                }
                                onClick={() => setRolSeleccionado(rol)}
                            >
                                {nombresRol[rol]}
                            </button>
                        ))}

                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 small mb-3">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label    className=" form-label login-label">
                            Rut
                        </label>
                        <div className="login-input-group">

                            <i className="bi bi-person"></i>
                            <input 
                            type="text"
                            name = "rut"
                            value={credenciales.rut}
                            onChange={handleChange}
                            placeholder="20621261-2"
                            required
                            
                            
                            />
                        </div>
                    </div>
                        <div className="mb-4">
                            <label className="form-label login-label">
                                Correo Electrónico
                            </label>

                            <div className="login-input-group">
                                <i className="bi bi-person"></i>

                                <input
                                    type="email"
                                    name="correo"
                                    value={credenciales.correo}
                                    onChange={handleChange}
                                    placeholder="jefa@duocuc.cl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label login-label">
                                Contraseña
                            </label>

                            <div className="login-input-group">
                                <i className="bi bi-lock"></i>

                                <input
                                    type="password"
                                    name="password"
                                    value={credenciales.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={cargando}
                        >
                            {cargando ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Validando acceso...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                    Ingresar
                                </>
                            )}
                        </button>

                    </form>

                    <div className="login-extra-info">
                        <span>Perfil seleccionado:</span>
                        <strong>{nombresRol[rolSeleccionado]}</strong>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;