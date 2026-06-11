package com.example.declaracion_SAG.repository;

import com.example.declaracion_SAG.enums.EstadoDeclaracion;
import com.example.declaracion_SAG.model.DeclaracionSag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeclaracionSagRepository extends JpaRepository<DeclaracionSag, Long> {

    List<DeclaracionSag> findByUserId(Long userId);

    List<DeclaracionSag> findByEstado(EstadoDeclaracion estado);

    List<DeclaracionSag> findByRequiereInspeccion(Boolean requiereInspeccion);
}
