import { useRef, useState } from "react";

import declaracionService from "../services/declaracionService";
import archivoService from "../services/archivoService";

function FormularioSag({ onDeclaracionCreada }) {

    const inputArchivoRef = useRef(null);

    const obtenerUserId = () => {
        return Number(localStorage.getItem("userId"));
    };

    const rolUsuario = localStorage.getItem("rol");

    const rolesPermitidos = [
        "TURISTA",
        "SAG",
        "ADMIN"
    ];

    const puedeCrearDeclaracion = rolesPermitidos.includes(rolUsuario);

    const [formulario, setFormulario] = useState({
        userId: obtenerUserId(),
        nombrePasajero: "",
        documento: "",
        productoDeclarado: "",
        categoriaProducto: "",
        nivelRiesgo: "",
        observacion: ""
    });

    const [archivo, setArchivo] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const handleArchivoChange = (e) => {
        setArchivo(e.target.files[0]);
    };

    const limpiarFormulario = () => {
        setFormulario({
            userId: obtenerUserId(),
            nombrePasajero: "",
            documento: "",
            productoDeclarado: "",
            categoriaProducto: "",
            nivelRiesgo: "",
            observacion: ""
        });

        setArchivo(null);

        if (inputArchivoRef.current) {
            inputArchivoRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = obtenerUserId();

        if (!userId) {
            alert("No se encontró el ID del usuario autenticado. Vuelva a iniciar sesión.");
            return;
        }

        try {
            setCargando(true);

            const declaracion = {
                ...formulario,
                userId: userId
            };

            const response =
                await declaracionService.crearDeclaracion(declaracion);

            const declaracionCreada = response.data;

            console.log("Declaración creada:", declaracionCreada);

            if (archivo) {
                await archivoService.subirArchivo(
                    declaracionCreada.id,
                    archivo
                );

                console.log("Archivo subido correctamente");
            }

            alert("Declaración registrada correctamente");

            limpiarFormulario();

            if (onDeclaracionCreada) {
                onDeclaracionCreada();
            }

        } catch (error) {
            console.error(error);
            alert("Error al registrar declaración");

        } finally {
            setCargando(false);
        }
    };

    if (!puedeCrearDeclaracion) {
        return (
            <div className="alert alert-danger border-0 shadow-sm">
                <h5 className="fw-bold mb-1">
                    Acceso restringido
                </h5>

                <p className="mb-0">
                    Tu rol actual no tiene permisos para crear declaraciones SAG.
                </p>

                <small className="text-muted">
                    Rol actual: {rolUsuario || "Sin rol"}
                </small>
            </div>
        );
    }

    return (
        <div>

            <div className="mb-4">
                <h3 className="fw-bold mb-1">
                    Nueva Declaración SAG
                </h3>

                <p className="text-muted small m-0">
                    Complete los datos del pasajero y del producto declarado para su evaluación sanitaria.
                </p>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="row g-3">

                    <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                            Nombre Pasajero
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="nombrePasajero"
                            value={formulario.nombrePasajero}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                            Documento
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="documento"
                            value={formulario.documento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                            Producto Declarado
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            name="productoDeclarado"
                            value={formulario.productoDeclarado}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                            Categoría
                        </label>

                        <select
                            className="form-select"
                            name="categoriaProducto"
                            value={formulario.categoriaProducto}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione categoría</option>
                            <option value="ALIMENTOS">Alimentos</option>
                            <option value="VEGETALES">Vegetales</option>
                            <option value="ANIMALES">Animales</option>
                            <option value="LACTEOS">Lácteos</option>
                            <option value="CARNES">Carnes</option>
                            <option value="SEMILLAS">Semillas</option>
                            <option value="FRUTAS">Frutas</option>
                            <option value="VERDURAS">Verduras</option>
                            <option value="OTROS">Otros</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                            Nivel de Riesgo
                        </label>

                        <select
                            className="form-select"
                            name="nivelRiesgo"
                            value={formulario.nivelRiesgo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione nivel</option>
                            <option value="BAJO">Bajo</option>
                            <option value="MEDIO">Medio</option>
                            <option value="ALTO">Alto</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-6">
                        <label className="form-label fw-semibold">
                            Documento de respaldo
                        </label>

                        <input
                            ref={inputArchivoRef}
                            type="file"
                            className="form-control"
                            onChange={handleArchivoChange}
                        />

                        <small className="text-muted">
                            Puede adjuntar PDF, imagen o documento de respaldo.
                        </small>
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-semibold">
                            Observación
                        </label>

                        <textarea
                            className="form-control"
                            rows="3"
                            name="observacion"
                            value={formulario.observacion}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <div className="d-flex justify-content-end mt-4">

                    <button
                        type="submit"
                        className="btn btn-success px-4 d-flex align-items-center gap-2"
                        disabled={cargando}
                    >
                        {cargando ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                ></span>
                                Registrando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-circle"></i>
                                Registrar Declaración
                            </>
                        )}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default FormularioSag;