import { useEffect, useState } from "react";
import declaracionService from "../services/declaracionService";

function TablaDeclaraciones() {

    const [declaraciones, setDeclaraciones] = useState([]);

    useEffect(() => {
        cargarDeclaraciones();
    }, []);

    const cargarDeclaraciones = async () => {
        try {

    const response =
    await declaracionService.listarDeclaraciones();

            setDeclaraciones(response.data);

        } catch (error) {

            console.error("Error al cargar declaraciones", error);
        }
    };

    return (
        <div className="card shadow mt-4">

            <div className="card-header bg-success text-white">
                <h4>Listado de Declaraciones SAG</h4>
            </div>

            <div className="card-body">

                <table className="table table-striped table-hover">

                    <thead>

                    <tr>
                        <th>ID</th>
                        <th>Pasajero</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Riesgo</th>
                        <th>Estado</th>
                        <th>Inspección</th>
                    </tr>

                    </thead>

                    <tbody>

                    {declaraciones.map((declaracion) => (

                        <tr key={declaracion.id}>

                            <td>{declaracion.id}</td>

                            <td>{declaracion.nombrePasajero}</td>

                            <td>{declaracion.productoDeclarado}</td>

                            <td>{declaracion.categoriaProducto}</td>

                            <td>{declaracion.nivelRiesgo}</td>

                            <td>{declaracion.estado}</td>

                            <td>
                                {declaracion.requiereInspeccion
                                    ? "Sí"
                                    : "No"}
                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default TablaDeclaraciones;