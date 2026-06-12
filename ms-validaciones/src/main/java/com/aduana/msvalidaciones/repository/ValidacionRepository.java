package com.aduana.msvalidaciones.repository;

import com.aduana.msvalidaciones.enums.EstadoValidacion;
import com.aduana.msvalidaciones.model.Validacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository

public interface ValidacionRepository extends JpaRepository<Validacion,Long> {

List<Validacion> findByestado(EstadoValidacion estado);
}
