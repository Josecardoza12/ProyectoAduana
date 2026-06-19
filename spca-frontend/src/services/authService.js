import axios from "axios";

// authService.js
const API_URL = "http://localhost:8081/auth";

const login = (credenciales) => {
    return axios.post(
        `${API_URL}/login`,
        credenciales
    );
};

const registrar = (usuario) => {
    return axios.post(
        `${API_URL}/register`,
        usuario
    );
};

const obtenerUsuarioAutenticado = () => {
    const token = localStorage.getItem("token");

    return axios.get(
        `${API_URL}/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

const guardarSesion = (token) => {
    localStorage.setItem("token", token);
};

const guardarRol = (rol) => {
    localStorage.setItem("rol", rol);
};

const guardarCorreo = (correo) => {
    localStorage.setItem("correo", correo);
};

const guardarUserId = (userId) => {
    localStorage.setItem("userId", userId);
};

const obtenerToken = () => {
    return localStorage.getItem("token");
};

const obtenerRol = () => {
    return localStorage.getItem("rol");
};

const obtenerUserId = () => {
    return localStorage.getItem("userId");
};

const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("correo");
    localStorage.removeItem("userId");
};

const estaAutenticado = () => {
    const token = localStorage.getItem("token");
    return token !== null && token !== "";
};

const decodificarToken = (token) => {
    try {
        const payload = token.split(".")[1];
        const payloadDecodificado = atob(payload);
        return JSON.parse(payloadDecodificado);
    } catch (error) {
        console.error("Error al decodificar token", error);
        return null;
    }
};

const obtenerRolDesdeToken = (token) => {
    const tokenDecodificado = decodificarToken(token);

    if (!tokenDecodificado) {
        return null;
    }

    return (
        tokenDecodificado.rol ||
        tokenDecodificado.role ||
        tokenDecodificado.authority ||
        tokenDecodificado.authorities ||
        null
    );
};

const obtenerCorreoDesdeToken = (token) => {
    const tokenDecodificado = decodificarToken(token);

    if (!tokenDecodificado) {
        return null;
    }

    return tokenDecodificado.sub || null;
};

export default {
    login,
    registrar,
    obtenerUsuarioAutenticado,
    guardarSesion,
    guardarRol,
    guardarCorreo,
    guardarUserId,
    obtenerToken,
    obtenerRol,
    obtenerUserId,
    cerrarSesion,
    estaAutenticado,
    decodificarToken,
    obtenerRolDesdeToken,
    obtenerCorreoDesdeToken
};