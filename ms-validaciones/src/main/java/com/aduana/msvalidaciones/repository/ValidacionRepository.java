package com.aduana.msvalidaciones.repository;

import com.aduana.msvalidaciones.enums.EstadoValidacion;
import com.aduana.msvalidaciones.enums.TipoTramite;
import com.aduana.msvalidaciones.model.Validacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ValidacionRepository extends JpaRepository<Validacion, Long> {

    List<Validacion> findByEstadoNuevo(EstadoValidacion estadoNuevo);

    List<Validacion> findByTipoTramite(TipoTramite tipoTramite);

    List<Validacion> findByFuncionarioRol(String funcionarioRol);

    List<Validacion> findByFuncionarioId(Long funcionarioId);

    List<Validacion> findByTipoTramiteAndEstadoNuevo(
            TipoTramite tipoTramite,
            EstadoValidacion estadoNuevo
    );

    List<Validacion> findByTipoTramiteAndTramiteId(
            TipoTramite tipoTramite,
            Long tramiteId
    );
}
