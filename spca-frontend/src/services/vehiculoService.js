import axios from "axios";

// vehiculoService.js
const API_URL = "http://localhost:8082/api/v1/vehiculos";

const obtenerHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const listarVehiculos = () => {
    return axios.get(
        API_URL,
        obtenerHeaders()
    );
};

const obtenerVehiculoPorId = (id) => {
    return axios.get(
        `${API_URL}/${id}`,
        obtenerHeaders()
    );
};

const buscarPorPatente = (patente) => {
    return axios.get(
        `${API_URL}/patente/${patente}`,
        obtenerHeaders()
    );
};

const buscarPorEstado = (estado) => {
    return axios.get(
        `${API_URL}/estado/${estado}`,
        obtenerHeaders()
    );
};

const buscarPorRut = (rut) => {
    return axios.get(
        `${API_URL}/rut/${rut}`,
        obtenerHeaders()
    );
};

const buscarPorUsuario = (userId) => {
    return axios.get(
        `${API_URL}/usuario/${userId}`,
        obtenerHeaders()
    );
};

const registrarVehiculo = (vehiculo) => {
    return axios.post(
        API_URL,
        vehiculo,
        obtenerHeaders()
    );
};

const actualizarEstado = (id, nuevoEstado) => {
    return axios.patch(
        `${API_URL}/${id}/estado?nuevoEstado=${nuevoEstado}`,
        {},
        obtenerHeaders()
    );
};

const aprobarVehiculo = (id) => {
    return axios.patch(
        `${API_URL}/${id}/aprobar`,
        {},
        obtenerHeaders()
    );
};

const rechazarVehiculo = (id) => {
    return axios.patch(
        `${API_URL}/${id}/rechazar`,
        {},
        obtenerHeaders()
    );
};

const enviarRevision = (id) => {
    return axios.patch(
        `${API_URL}/${id}/revision`,
        {},
        obtenerHeaders()
    );
};

const eliminarVehiculo = (id) => {
    return axios.delete(
        `${API_URL}/${id}`,
        obtenerHeaders()
    );
};

export default {
    listarVehiculos,
    obtenerVehiculoPorId,
    buscarPorPatente,
    buscarPorEstado,
    buscarPorRut,
    buscarPorUsuario,
    registrarVehiculo,
    actualizarEstado,
    aprobarVehiculo,
    rechazarVehiculo,
    enviarRevision,
    eliminarVehiculo
};