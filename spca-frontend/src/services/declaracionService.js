import axios from "axios";

// declaracionService.js
const API_URL = "http://localhost:8085/api/v1/declaraciones";
const obtenerHeaders = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const listarDeclaraciones = () => {
    return axios.get(
        API_URL,
        obtenerHeaders()
    );
};

const obtenerDeclaracionPorId = (id) => {
    return axios.get(
        `${API_URL}/${id}`,
        obtenerHeaders()
    );
};

const buscarPorUsuario = (userId) => {
    return axios.get(
        `${API_URL}/usuario/${userId}`,
        obtenerHeaders()
    );
};

const buscarPorEstado = (estado) => {
    return axios.get(
        `${API_URL}/estado?estado=${estado}`,
        obtenerHeaders()
    );
};

const buscarPorInspeccion = (requiereInspeccion) => {
    return axios.get(
        `${API_URL}/inspeccion?requiereInspeccion=${requiereInspeccion}`,
        obtenerHeaders()
    );
};

const crearDeclaracion = (declaracion) => {
    return axios.post(
        API_URL,
        declaracion,
        obtenerHeaders()
    );
};

const actualizarEstado = (id, estado) => {
    return axios.put(
        `${API_URL}/${id}/estado?estado=${estado}`,
        {},
        obtenerHeaders()
    );
};

const eliminarDeclaracion = (id) => {
    return axios.delete(
        `${API_URL}/${id}`,
        obtenerHeaders()
    );
};

export default {
    listarDeclaraciones,
    obtenerDeclaracionPorId,
    buscarPorUsuario,
    buscarPorEstado,
    buscarPorInspeccion,
    crearDeclaracion,
    actualizarEstado,
    eliminarDeclaracion
};