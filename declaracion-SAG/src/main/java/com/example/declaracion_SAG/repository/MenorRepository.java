package com.example.declaracion_SAG.repository;

import com.example.declaracion_SAG.enums.EstadoMenor;
import com.example.declaracion_SAG.model.Menor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenorRepository extends JpaRepository<Menor, Long> {

    List<Menor> findByUserId(Long userId);

    List<Menor> findByEstado(EstadoMenor estado);

    List<Menor> findByDocumentoMenor(String documentoMenor);

    List<Menor> findByDocumentoTutor(String documentoTutor);
}