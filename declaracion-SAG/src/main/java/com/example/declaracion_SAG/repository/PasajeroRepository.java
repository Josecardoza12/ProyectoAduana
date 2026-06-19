package com.example.declaracion_SAG.repository;

import com.example.declaracion_SAG.enums.EstadoPasajero;
import com.example.declaracion_SAG.model.Pasajero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasajeroRepository extends JpaRepository<Pasajero, Long> {

    List<Pasajero> findByUserId(Long userId);

    List<Pasajero> findByEstado(EstadoPasajero estado);

    List<Pasajero> findByRut(String rut);

    List<Pasajero> findByPasaporte(String pasaporte);
}