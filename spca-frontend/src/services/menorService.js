import axios from "axios";

// menorService.js
const API_URL = "http://localhost:8085/api/v1/menores";
const obtenerHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const listarMenores = () => {
    return axios.get(
        API_URL,
        obtenerHeaders()
    );
};

const buscarMenorPorId = (id) => {
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
        `${API_URL}/estado/${estado}`,
        obtenerHeaders()
    );
};

const buscarPorDocumentoMenor = (documentoMenor) => {
    return axios.get(
        `${API_URL}/documento-menor/${documentoMenor}`,
        obtenerHeaders()
    );
};

const buscarPorDocumentoTutor = (documentoTutor) => {
    return axios.get(
        `${API_URL}/documento-tutor/${documentoTutor}`,
        obtenerHeaders()
    );
};

const registrarMenor = (menor) => {
    return axios.post(
        API_URL,
        menor,
        obtenerHeaders()
    );
};

const aprobarMenor = (id) => {
    return axios.patch(
        `${API_URL}/${id}/aprobar`,
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

const rechazarMenor = (id, observaciones) => {
    return axios.patch(
        `${API_URL}/${id}/rechazar`,
        observaciones || "",
        {
            ...obtenerHeaders(),
            headers: {
                ...obtenerHeaders().headers,
                "Content-Type": "text/plain"
            }
        }
    );
};

const eliminarMenor = (id) => {
    return axios.delete(
        `${API_URL}/${id}`,
        obtenerHeaders()
    );
};

export default {
    listarMenores,
    buscarMenorPorId,
    buscarPorUsuario,
    buscarPorEstado,
    buscarPorDocumentoMenor,
    buscarPorDocumentoTutor,
    registrarMenor,
    aprobarMenor,
    enviarRevision,
    rechazarMenor,
    eliminarMenor
};