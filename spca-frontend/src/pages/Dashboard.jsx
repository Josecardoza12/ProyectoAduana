import React, { useEffect, useState } from "react";
import CardResumen from "../components/CardResumen";
import declaracionService from "../services/declaracionService";
import vehiculoService from "../services/vehiculoService";
import pasajeroService from "../services/pasajeroService";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar
} from "recharts";

function Dashboard() {

    const [declaraciones, setDeclaraciones] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [pasajeros, setPasajeros] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [horaActual, setHoraActual] = useState(new Date());

    const rolUsuario = localStorage.getItem("rol");
    useEffect(() => {
        cargarDatosDashboard();

        const intervaloDatos = setInterval(() => {
            cargarDatosDashboard();
        }, 15000);

        const intervaloHora = setInterval(() => {
            setHoraActual(new Date());
        }, 1000);

        return () => {
            clearInterval(intervaloDatos);
            clearInterval(intervaloHora);
        };
    }, []);

    const cargarVehiculos = async () => {
        try {
            const response = await vehiculoService.listarVehiculos();

            setVehiculos(response.data || []);

        } catch (error) {
            console.error("Error al cargar vehículos en dashboard", error);
            setVehiculos([]);
        }
    };
    const cargarPasajeros = async () => {
    try {
        const response = await pasajeroService.listarPasajeros();

        setPasajeros(response.data || []);

    } catch (error) {
        console.error("Error al cargar pasajeros en dashboard", error);
        setPasajeros([]);
    }
};

    const cargarDatosDashboard = async () => {
    try {
        setCargando(true);
        setError("");

        const response = await declaracionService.listarDeclaraciones();

        setDeclaraciones(response.data || []);

        await cargarVehiculos();
        await cargarPasajeros();

    } catch (error) {
        console.error("Error al cargar datos del dashboard", error);
        setDeclaraciones([]);
        setError("No se pudieron cargar los datos del dashboard");
    } finally {
        setCargando(false);
    }
};

    const totalDeclaraciones = declaraciones.length;
    const totalVehiculos = vehiculos.length;
    const totalPasajeros = pasajeros.length;

    const totalAlertas = declaraciones.filter((declaracion) =>
        declaracion.requiereInspeccion === true ||
        declaracion.estado === "EN_REVISION" ||
        declaracion.nivelRiesgo === "ALTO"
    ).length;

    const declaracionesPendientes = declaraciones.filter(
        (declaracion) => declaracion.estado === "PENDIENTE"
    ).length;

    const declaracionesRevision = declaraciones.filter(
        (declaracion) => declaracion.estado === "EN_REVISION"
    ).length;

    const declaracionesAprobadas = declaraciones.filter(
        (declaracion) => declaracion.estado === "APROBADA"
    ).length;

    const declaracionesRechazadas = declaraciones.filter(
        (declaracion) => declaracion.estado === "RECHAZADA"
    ).length;

    const riesgoBajo = declaraciones.filter(
        (declaracion) => declaracion.nivelRiesgo === "BAJO"
    ).length;

    const riesgoMedio = declaraciones.filter(
        (declaracion) => declaracion.nivelRiesgo === "MEDIO"
    ).length;

    const riesgoAlto = declaraciones.filter(
        (declaracion) => declaracion.nivelRiesgo === "ALTO"
    ).length;

    const datosEstadosDeclaraciones = [
        {
            name: "Pendiente",
            declaraciones: declaracionesPendientes
        },
        {
            name: "En revisión",
            declaraciones: declaracionesRevision
        },
        {
            name: "Aprobada",
            declaraciones: declaracionesAprobadas
        },
        {
            name: "Rechazada",
            declaraciones: declaracionesRechazadas
        }
    ];

    const datosRiesgoDeclaraciones = [
        {
            name: "Bajo",
            riesgo: riesgoBajo
        },
        {
            name: "Medio",
            riesgo: riesgoMedio
        },
        {
            name: "Alto",
            riesgo: riesgoAlto
        }
    ];

    const formatearHora = () => {
        return horaActual.toLocaleTimeString("es-CL", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    return (
        <div className="container-fluid px-3">

            {/* ENCABEZADO DEL DASHBOARD */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1
                        className="fw-bold m-0 text-dark"
                        style={{ letterSpacing: "-0.5px" }}
                    >
                        Dashboard Principal
                    </h1>

                    <p className="text-muted m-0 small">
                        Monitoreo en tiempo real - Paso Los Libertadores
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <span className="badge bg-white text-dark border border-light-subtle rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm small">
                        <span
                            className={
                                error
                                    ? "spinner-grow bg-danger"
                                    : "spinner-grow bg-success"
                            }
                            style={{ width: "8px", height: "8px" }}
                        ></span>

                        {error ? "Servicio SAG no disponible" : "Sistema Operativo"}
                    </span>

                    <span className="badge bg-white text-dark border border-light-subtle rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm small fw-normal">
                        <i className="bi bi-clock text-muted"></i>
                        {formatearHora()}
                    </span>
                </div>
            </div>

            {error && (
                <div className="alert alert-warning border-0 shadow-sm mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            {/* SECCIÓN DE TARJETAS */}
            <div className="d-flex flex-wrap gap-3 mb-4">
                <CardResumen
                    titulo="Pasajeros Hoy"
                    cantidad={cargando ? "..." : totalPasajeros}
                    tendencia="Datos reales pasajeros"
                    esPositiva={true}
                    icono="people"
                    colorIcono="#0d6efd"
                />

                    {rolUsuario !== "SAG" && (
                <CardResumen
                    titulo="Vehículos Registrados"
                    cantidad={cargando ? "..." : totalVehiculos}
                    tendencia="Datos reales vehículos"
                    esPositiva={true}
                    icono="car-front"
                    colorIcono="#4f46e5"
                    />
                    )}

                <CardResumen
                    titulo="Declaraciones SAG"
                    cantidad={cargando ? "..." : totalDeclaraciones}
                    tendencia="Datos reales SAG"
                    esPositiva={true}
                    icono="file-earmark-check"
                    colorIcono="#198754"
                />

                <CardResumen
                    titulo="Alertas Activas"
                    cantidad={cargando ? "..." : totalAlertas}
                    tendencia="Riesgo alto o revisión"
                    esPositiva={totalAlertas === 0}
                    icono="exclamation-triangle"
                    colorIcono="#dc3545"
                />
            </div>

            {/* SECCIÓN DE GRÁFICOS */}
            <div className="row g-3">

                {/* Gráfico 1: Declaraciones por estado */}
                <div className="col-12 col-xl-6">
                    <div
                        className="card border-0 shadow-sm p-4"
                        style={{ borderRadius: "16px" }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5 className="fw-bold m-0 text-dark">
                                    Declaraciones SAG por Estado
                                </h5>

                                <span className="text-muted small">
                                    Información obtenida desde el microservicio SAG
                                </span>
                            </div>

                            <i className="bi bi-graph-up-arrow text-success fs-5"></i>
                        </div>

                        <div style={{ width: "100%", height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={datosEstadosDeclaraciones}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f0f0f0"
                                    />

                                    <XAxis
                                        dataKey="name"
                                        stroke="#a0a0a0"
                                        fontSize={12}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        stroke="#a0a0a0"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />

                                    <Tooltip />

                                    <Line
                                        type="monotone"
                                        dataKey="declaraciones"
                                        stroke="#0d6efd"
                                        strokeWidth={3}
                                        dot={{ r: 5 }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Gráfico 2: Declaraciones por riesgo */}
                <div className="col-12 col-xl-6">
                    <div
                        className="card border-0 shadow-sm p-4"
                        style={{ borderRadius: "16px" }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5 className="fw-bold m-0 text-dark">
                                    Declaraciones por Nivel de Riesgo
                                </h5>

                                <span className="text-muted small">
                                    Riesgo bajo, medio y alto registrados
                                </span>
                            </div>

                            <i className="bi bi-activity text-primary fs-5"></i>
                        </div>

                        <div style={{ width: "100%", height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={datosRiesgoDeclaraciones}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f0f0f0"
                                    />

                                    <XAxis
                                        dataKey="name"
                                        stroke="#a0a0a0"
                                        fontSize={12}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        stroke="#a0a0a0"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="riesgo"
                                        fill="#6366f1"
                                        radius={[6, 6, 0, 0]}
                                        barSize={35}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Dashboard;