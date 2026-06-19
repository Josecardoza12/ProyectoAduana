import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DashboardTurista from "../pages/DashboardTurista";
import DeclaracionSag from "../pages/DeclaracionSag";
import HistorialSag from "../pages/HistorialSag";
import Vehiculos from "../pages/Vehiculos";
import RegistroPasajero from "../pages/RegistroPasajero";
import Tramites from "../pages/Tramites";
import ValidacionVehiculo from "../pages/ValidacionVehiculo";
import HistorialPasajero from "../pages/HistorialPasajero";
import GestionMenores from "../pages/GestionMenores";

import ProtectedRoute from "./ProtectedRoute";
import ScrollToTop from "../components/ScrollToTop";

function RedireccionInicial() {
    const token = localStorage.getItem("token");
    const rolUsuario = localStorage.getItem("rol");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (rolUsuario === "TURISTA") {
        return <Navigate to="/turista" replace />;
    }

    return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
    return (
        <BrowserRouter>

            <ScrollToTop />

            <Routes>

                <Route path="/" element={<RedireccionInicial />} />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute rolesPermitidos={["ADMIN", "PDI", "SAG"]}>
                            <MainLayout>
                                <Dashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/turista"
                    element={
                        <ProtectedRoute rolesPermitidos={["TURISTA"]}>
                            <DashboardTurista />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/registro-pasajero"
                    element={
                        <ProtectedRoute rolesPermitidos={["TURISTA"]}>
                            <MainLayout>
                                <RegistroPasajero />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/gestion-menores"
                    element={
                        <ProtectedRoute rolesPermitidos={["TURISTA", "ADMIN", "PDI"]}>
                            <MainLayout>
                                <GestionMenores />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/historial-pasajeros"
                    element={
                        <ProtectedRoute rolesPermitidos={["TURISTA", "ADMIN", "PDI", "SAG"]}>
                            <MainLayout>
                                <HistorialPasajero />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/declaraciones"
                    element={
                        <ProtectedRoute rolesPermitidos={["TURISTA"]}>
                            <MainLayout>
                                <DeclaracionSag />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/historial"
                    element={
                        <ProtectedRoute rolesPermitidos={["TURISTA", "SAG", "ADMIN", "PDI"]}>
                            <MainLayout>
                                <HistorialSag />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tramites"
                    element={
                        <ProtectedRoute rolesPermitidos={["ADMIN", "PDI", "SAG"]}>
                            <MainLayout>
                                <Tramites />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/validaciones"
                    element={<Navigate to="/tramites" replace />}
                />

                <Route
                    path="/vehiculos"
                    element={
                        <ProtectedRoute rolesPermitidos={["TURISTA"]}>
                            <MainLayout>
                                <Vehiculos />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/validacion-vehiculo"
                    element={
                        <ProtectedRoute rolesPermitidos={["ADMIN", "PDI"]}>
                            <MainLayout>
                                <ValidacionVehiculo />
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<RedireccionInicial />} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;