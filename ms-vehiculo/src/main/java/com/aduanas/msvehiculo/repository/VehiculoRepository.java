package com.aduanas.msvehiculo.repository;

import com.aduanas.msvehiculo.model.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {

    // Busca un vehículo por su patente
    Optional<Vehiculo> findByPatenteIgnoreCase(String patente);

    // Verifica si ya existe un vehículo con esa patente
    boolean existsByPatente(String patente);

    // Busca todos los vehículos por estado (PENDIENTE, APROBADO, etc.)
    List<Vehiculo> findByEstado(String estado);

    // Busca todos los vehículos de un propietario por su RUT
    List<Vehiculo> findByRutPropietario(String rutPropietario);

    // Busca todos los vehículos por paso fronterizo
    List<Vehiculo> findByPasoFronterizo(String pasoFronterizo);
    List<Vehiculo> findByUserId(Long userId);

}