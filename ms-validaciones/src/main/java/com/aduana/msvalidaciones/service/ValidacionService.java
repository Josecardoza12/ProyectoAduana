package com.aduana.msvalidaciones.service;

import com.aduana.msvalidaciones.model.Validacion;
import com.aduana.msvalidaciones.repository.ValidacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.aduana.msvalidaciones.enums.EstadoValidacion;
import java.util.List;
import java.util.Optional;
import com.aduana.msvalidaciones.exception.ValidacionNotFoundException;

@Service
@RequiredArgsConstructor

public class ValidacionService {

    private final ValidacionRepository repository;
    public List<Validacion> listar(){
        return repository.findAll();
    }

    public Validacion buscarPorId(Long id){
        return repository.findById(id)
                .orElseThrow(()-> new ValidacionNotFoundException(id));
    }

    public Validacion guardar (Validacion validacion){
        return repository.save(validacion);
    }

    public void eliminar (Long id){
        repository.deleteById(id);
    }

    public Validacion aprobar (Long id){
        Validacion validacion=repository.findById(id)
                .orElseThrow(()-> new ValidacionNotFoundException(id));
        validacion.setEstado(EstadoValidacion.APROBADO);
        return repository.save(validacion);

    }

    public Validacion rechazar(Long id, String observacion){
        Validacion validacion= repository.findById(id)
                .orElseThrow(()-> new ValidacionNotFoundException(id));
        validacion.setEstado(EstadoValidacion.RECHAZADO);
        validacion.setObservaciones(observacion);

        return repository.save(validacion);
    }

    public List<Validacion> buscarPorEstado(EstadoValidacion estado){
        return repository.findByestado(estado);

    }
}




















