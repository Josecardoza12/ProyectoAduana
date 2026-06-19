import declaracionService from "./declaracionService";
import validacionService from "./validacionService";
import vehiculoService from "./vehiculoService";

const obtenerNotificaciones = async () => {

    const notificaciones = [];

    const rolUsuario = localStorage.getItem("rol");

    try {
        const responseDeclaraciones =
            await declaracionService.listarDeclaraciones();

        const declaraciones = responseDeclaraciones.data || [];

        const declaracionesRevision = declaraciones.filter(
            (declaracion) => declaracion.estado === "EN_REVISION"
        );

        declaracionesRevision.forEach((declaracion) => {
            notificaciones.push({
                id: `sag-${declaracion.id}`,
                titulo: "Declaración SAG en revisión",
                descripcion: `${declaracion.nombrePasajero} declaró ${declaracion.productoDeclarado}`,
                ruta: "/historial",
                icono: "bi-file-earmark-check",
                colorClase: "notif-green"
            });
        });

    } catch (error) {
        console.error("Error al obtener notificaciones SAG", error);
    }

    try {
        const responseVehiculos =
            await vehiculoService.listarVehiculos();

        const vehiculos = responseVehiculos.data || [];

        const vehiculosPendientes = vehiculos.filter(
            (vehiculo) => vehiculo.estado === "PENDIENTE"
        );

        const vehiculosRevision = vehiculos.filter(
            (vehiculo) => vehiculo.estado === "EN_REVISION"
        );

        if (rolUsuario === "PDI" || rolUsuario === "ADMIN") {

            vehiculosPendientes.forEach((vehiculo) => {
                notificaciones.push({
                    id: `vehiculo-pendiente-${vehiculo.id}`,
                    titulo: "Vehículo pendiente de validación",
                    descripcion: `${vehiculo.patente} - ${vehiculo.marca} ${vehiculo.modelo}`,
                    ruta: "/validacion-vehiculo",
                    icono: "bi-car-front",
                    colorClase: "notif-blue"
                });
            });

            vehiculosRevision.forEach((vehiculo) => {
                notificaciones.push({
                    id: `vehiculo-revision-${vehiculo.id}`,
                    titulo: "Vehículo en revisión",
                    descripcion: `${vehiculo.patente} requiere control PDI`,
                    ruta: "/validacion-vehiculo",
                    icono: "bi-shield-exclamation",
                    colorClase: "notif-red"
                });
            });
        }

    } catch (error) {
        console.error("Error al obtener notificaciones de vehículos", error);
    }

    try {
        const responseValidaciones =
            await validacionService.listarValidaciones();

        const validaciones = responseValidaciones.data || [];

        const validacionesPendientes = validaciones.filter(
            (validacion) => validacion.estado === "PENDIENTE"
        );

        validacionesPendientes.forEach((validacion) => {
            notificaciones.push({
                id: `validacion-${validacion.id}`,
                titulo: "Validación pendiente",
                descripcion: `Trámite #${validacion.tramiteId} requiere revisión`,
                ruta: "/validaciones",
                icono: "bi-shield-exclamation",
                colorClase: "notif-red"
            });
        });

    } catch (error) {
        console.error("Error al obtener notificaciones de validaciones", error);
    }

    return notificaciones;
};

export default {
    obtenerNotificaciones
};