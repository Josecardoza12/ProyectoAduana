import axios from "axios";

// archivoService.js
const API_URL = "http://localhost:8085/api/v1/archivos";
const obtenerHeaders = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    };
};

const obtenerHeadersDescarga = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        },
        responseType: "blob"
    };
};

const subirArchivo = (declaracionId, archivo) => {

    const formData = new FormData();

    formData.append("archivo", archivo);

    return axios.post(
        `${API_URL}/upload/${declaracionId}`,
        formData,
        obtenerHeaders()
    );
};

const descargarArchivo = (nombreArchivo) => {
    return axios.get(
        `${API_URL}/download/${nombreArchivo}`,
        obtenerHeadersDescarga()
    );
};

export default {
    subirArchivo,
    descargarArchivo
};