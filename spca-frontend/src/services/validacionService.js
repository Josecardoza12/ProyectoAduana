import axios from "axios";

// validacionService.js
const API_URL = "http://localhost:7070/api/v1/validaciones";
const obtenerHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

/* =========================
   BITÁCORA DE VALIDACIONES
   ========================= */

const listarValidaciones = () => {
    return axios.get(
        API_URL,
        obtenerHeaders()
    );
};

const buscarValidacionPorId = (id) => {
    return axios.get(
        `${API_URL}/${id}`,
        obtenerHeaders()
    );
};

const buscarPorEstadoNuevo = (estadoNuevo) => {
    return axios.get(
        `${API_URL}/estado/${estadoNuevo}`,
        obtenerHeaders()
    );
};

const buscarPorTipoTramite = (tipoTramite) => {
    return axios.get(
        `${API_URL}/tipo/${tipoTramite}`,
        obtenerHeaders()
    );
};

const buscarPorRolFuncionario = (funcionarioRol) => {
    return axios.get(
        `${API_URL}/rol/${funcionarioRol}`,
        obtenerHeaders()
    );
};

const buscarPorFuncionarioId = (funcionarioId) => {
    return axios.get(
        `${API_URL}/funcionario/${funcionarioId}`,
        obtenerHeaders()
    );
};

const buscarPorTipoYEstado = (tipoTramite, estadoNuevo) => {
    return axios.get(
        `${API_URL}/tipo/${tipoTramite}/estado/${estadoNuevo}`,
        obtenerHeaders()
    );
};

const buscarBitacoraPorTramite = (tipoTramite, tramiteId) => {
    return axios.get(
        `${API_URL}/tramite/${tipoTramite}/${tramiteId}`,
        obtenerHeaders()
    );
};

const eliminarValidacion = (id) => {
    return axios.delete(
        `${API_URL}/${id}`,
        obtenerHeaders()
    );
};

/* =========================
BANDEJA GENERAL DE TRÁMITES
Estos endpoints los usaremos cuando creemos
el controller de trámites en ms-validaciones.
   ========================= */

const listarTramites = () => {
    return axios.get(
        `${API_URL}/tramites`,
        obtenerHeaders()
    );
};

const filtrarTramites = (tipoTramite, estado) => {
    const params = {};

    if (tipoTramite) {
        params.tipo = tipoTramite;
    }

    if (estado) {
        params.estado = estado;
    }

    return axios.get(
        `${API_URL}/tramites`,
        {
            ...obtenerHeaders(),
            params
        }
    );
};

const aprobarTramite = (tipoTramite, tramiteId, observacion = "") => {
    return axios.patch(
        `${API_URL}/tramites/${tipoTramite}/${tramiteId}/aprobar`,
        {
            observacion
        },
        obtenerHeaders()
    );
};

const rechazarTramite = (tipoTramite, tramiteId, observacion = "") => {
    return axios.patch(
        `${API_URL}/tramites/${tipoTramite}/${tramiteId}/rechazar`,
        {
            observacion
        },
        obtenerHeaders()
    );
};

const enviarRevisionTramite = (tipoTramite, tramiteId, observacion = "") => {
    return axios.patch(
        `${API_URL}/tramites/${tipoTramite}/${tramiteId}/revision`,
        {
            observacion
        },
        obtenerHeaders()
    );
};

export default {
    listarValidaciones,
    buscarValidacionPorId,
    buscarPorEstadoNuevo,
    buscarPorTipoTramite,
    buscarPorRolFuncionario,
    buscarPorFuncionarioId,
    buscarPorTipoYEstado,
    buscarBitacoraPorTramite,
    eliminarValidacion,

    listarTramites,
    filtrarTramites,
    aprobarTramite,
    rechazarTramite,
    enviarRevisionTramite
};