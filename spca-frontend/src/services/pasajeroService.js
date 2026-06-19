import axios from "axios";

// pasajeroService.js
const API_URL = "http://localhost:8085/api/v1/pasajeros";
const obtenerHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const listarPasajeros = () => {
    return axios.get(
        API_URL,
        obtenerHeaders()
    );
};

const buscarPasajeroPorId = (id) => {
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

const buscarPorRut = (rut) => {
    return axios.get(
        `${API_URL}/rut/${rut}`,
        obtenerHeaders()
    );
};

const buscarPorPasaporte = (pasaporte) => {
    return axios.get(
        `${API_URL}/pasaporte/${pasaporte}`,
        obtenerHeaders()
    );
};

const registrarPasajero = (pasajero) => {
    return axios.post(
        API_URL,
        pasajero,
        obtenerHeaders()
    );
};

const actualizarEstado = (id, estado) => {
    return axios.patch(
        `${API_URL}/${id}/estado?estado=${estado}`,
        {},
        obtenerHeaders()
    );
};

const eliminarPasajero = (id) => {
    return axios.delete(
        `${API_URL}/${id}`,
        obtenerHeaders()
    );
};

export default {
    listarPasajeros,
    buscarPasajeroPorId,
    buscarPorUsuario,
    buscarPorRut,
    buscarPorPasaporte,
    registrarPasajero,
    actualizarEstado,
    eliminarPasajero
};