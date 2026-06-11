package com.example.declaracion_SAG.services;


import com.example.declaracion_SAG.enums.EstadoDeclaracion;
import com.example.declaracion_SAG.enums.NivelRiesgo;
import com.example.declaracion_SAG.exception.DeclaracionSagNotFoundException;
import com.example.declaracion_SAG.model.DeclaracionSag;
import com.example.declaracion_SAG.repository.DeclaracionSagRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class DeclaracionSagService {

    @Autowired
    private DeclaracionSagRepository declaracionSagRepository;

    public List<DeclaracionSag> listarDeclaraciones(){

        log.info("Listando declaraciones SAG");

        return declaracionSagRepository.findAll();
    }

    public DeclaracionSag obtenerDeclaracionPorId(Long id){

        log.info("Buscando declaración SAG con id {}", id);

        return declaracionSagRepository.findById(id)
                .orElseThrow(() ->
                        new DeclaracionSagNotFoundException(id));
    }

    public List<DeclaracionSag> buscarPorUsuario(Long userId){

        log.info("Buscando declaraciones del usuario {}", userId);

        return declaracionSagRepository.findByUserId(userId);
    }

    public List<DeclaracionSag> findByEstado(EstadoDeclaracion estado){

        log.info("Buscando declaraciones con estado {}", estado);

        return declaracionSagRepository.findByEstado(estado);
    }
    // CONSULTA DERIVADA REQUIERE INSPECCION
    public List<DeclaracionSag> buscarPorRequiereInspeccion(
            Boolean requiereInspeccion){

        log.info("Buscando declaraciones con requiereInspeccion {}",
                requiereInspeccion);

        return declaracionSagRepository
                .findByRequiereInspeccion(requiereInspeccion);
    }


    public DeclaracionSag guardarDeclaracion(DeclaracionSag declaracion){

        log.info("Guardando declaración SAG");

        declaracion.setFechaRegistro(LocalDateTime.now());

        if(declaracion.getNivelRiesgo() == NivelRiesgo.ALTO){

            declaracion.setRequiereInspeccion(true);
            declaracion.setEstado(EstadoDeclaracion.EN_REVISION);

            log.info("Declaración marcada para inspección");

        }else{

            declaracion.setRequiereInspeccion(false);
            declaracion.setEstado(EstadoDeclaracion.PENDIENTE);

            log.info("Declaración registrada sin inspección inmediata");
        }

        return declaracionSagRepository.save(declaracion);
    }

    public DeclaracionSag actualizarEstado(Long id, EstadoDeclaracion estado){

        DeclaracionSag declaracion =
                obtenerDeclaracionPorId(id);

        declaracion.setEstado(estado);

        log.info("Actualizando estado declaración {}", id);

        return declaracionSagRepository.save(declaracion);
    }

    public String eliminarDeclaracion(Long id){

        log.warn("Eliminando declaración {}", id);

        declaracionSagRepository.deleteById(id);

        return "Declaración eliminada";
    }
}
