package com.aduanas.msvehiculo.service;

import com.aduanas.msvehiculo.dto.VehiculoRequestDTO;
import com.aduanas.msvehiculo.exception.VehiculoNotFoundException;
import com.aduanas.msvehiculo.exception.VehiculoYaExisteException;
import com.aduanas.msvehiculo.model.Vehiculo;
import com.aduanas.msvehiculo.repository.VehiculoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class VehiculoService {

    @Autowired
    private VehiculoRepository vehiculoRepository;

    // Recibe el DTO, lo convierte a entidad y guarda en la BD
    public Vehiculo registrarVehiculo(VehiculoRequestDTO dto, Long userId) {
        log.info("Intentando registrar vehículo con patente: {}", dto.getPatente());

        if (vehiculoRepository.existsByPatente(dto.getPatente())) {
            log.warn("Ya existe un vehículo con la patente: {}", dto.getPatente());
            throw new VehiculoYaExisteException(dto.getPatente());
        }

        Vehiculo vehiculo = new Vehiculo();

        vehiculo.setUserId(userId);
        vehiculo.setPatente(dto.getPatente());
        vehiculo.setMarca(dto.getMarca());
        vehiculo.setModelo(dto.getModelo());
        vehiculo.setAnio(dto.getAnio());
        vehiculo.setColor(dto.getColor());
        vehiculo.setTipoVehiculo(dto.getTipoVehiculo());
        vehiculo.setPaisOrigen(dto.getPaisOrigen());
        vehiculo.setRutPropietario(dto.getRutPropietario());
        vehiculo.setTipoMovimiento(dto.getTipoMovimiento());
        vehiculo.setPasoFronterizo(dto.getPasoFronterizo());
        vehiculo.setDiasEstadia(dto.getDiasEstadia());
        vehiculo.setObservaciones(dto.getObservaciones());

        Vehiculo guardado = vehiculoRepository.save(vehiculo);

        log.info("Vehículo registrado exitosamente con ID: {}", guardado.getId());

        return guardado;
    }
    // Retorna todos los vehículos registrados
    public List<Vehiculo> obtenerTodos() {
        log.info("Obteniendo todos los vehículos");
        return vehiculoRepository.findAll();
    }

    // Retorna los vehículos por páginas.
    // Pageable recibe automáticamente el número de página y
    // la cantidad de registros que se mostrarán.
    //
    // Ejemplo:
    // page=0 size=10 -> primeros 10 registros
    // page=1 size=10 -> siguientes 10 registros
    public Page<Vehiculo> obtenerTodosPaginados(Pageable pageable) {

        log.info("Obteniendo vehículos paginados");

        // JpaRepository ya incorpora findAll(Pageable),
        // por lo que no es necesario crear nada en el Repository.
        return vehiculoRepository.findAll(pageable);
    }

    // Busca un vehículo por su ID
    public Vehiculo obtenerPorId(Long id) {
        log.info("Buscando vehículo con ID: {}", id);
        return vehiculoRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("No se encontró vehículo con ID: {}", id);
                    return new VehiculoNotFoundException(id);
                });
    }

    // Busca un vehículo por su patente
    public Vehiculo obtenerPorPatente(String patente) {
        log.info("Buscando vehículo con patente: {}", patente);
        return vehiculoRepository.findByPatenteIgnoreCase(patente)
                .orElseThrow(() -> {
                    log.warn("No se encontró vehículo con patente: {}", patente);
                    return new VehiculoNotFoundException(patente);
                });
    }

    // Busca vehículos por estado (PENDIENTE, APROBADO, RECHAZADO)
    public List<Vehiculo> obtenerPorEstado(String estado) {
        log.info("Buscando vehículos con estado: {}", estado);
        return vehiculoRepository.findByEstado(estado);
    }

    // Busca vehículos por RUT del propietario
    public List<Vehiculo> obtenerPorRut(String rut) {
        log.info("Buscando vehículos del propietario con RUT: {}", rut);
        return vehiculoRepository.findByRutPropietario(rut);
    }

    // Busca vehículos por paso fronterizo
    public List<Vehiculo> obtenerPorPasoFronterizo(String pasoFronterizo) {
        log.info("Buscando vehículos en paso fronterizo: {}", pasoFronterizo);
        return vehiculoRepository.findByPasoFronterizo(pasoFronterizo);
    }

    // Actualiza el estado de un vehículo
    public Vehiculo actualizarEstado(Long id, String nuevoEstado) {

        log.info("Actualizando estado del vehículo ID: {} a {}", id, nuevoEstado);

        String estadoNormalizado = nuevoEstado.toUpperCase();

        if (
                !estadoNormalizado.equals("PENDIENTE") &&
                        !estadoNormalizado.equals("APROBADO") &&
                        !estadoNormalizado.equals("RECHAZADO") &&
                        !estadoNormalizado.equals("EN_REVISION")
        ) {
            log.warn("Estado inválido recibido: {}", nuevoEstado);
            throw new IllegalArgumentException(
                    "Estado inválido. Estados permitidos: PENDIENTE, APROBADO, RECHAZADO, EN_REVISION"
            );
        }

        Vehiculo vehiculo = vehiculoRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("No se encontró vehículo con ID: {} para actualizar", id);
                    return new VehiculoNotFoundException(id);
                });

        vehiculo.setEstado(estadoNormalizado);

        Vehiculo actualizado = vehiculoRepository.save(vehiculo);

        log.info("Estado actualizado exitosamente para vehículo ID: {}", id);

        return actualizado;
    }

    // Aprueba un vehículo.
// Solo se pueden aprobar vehículos que estén en estado PENDIENTE.
    public Vehiculo aprobarVehiculo(Long id) {

        log.info("Intentando aprobar vehículo ID: {}", id);

        Vehiculo vehiculo = vehiculoRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("No se encontró vehículo con ID: {}", id);
                    return new VehiculoNotFoundException(id);
                });

        // Evita aprobar nuevamente un vehículo ya aprobado
        if (vehiculo.getEstado().equalsIgnoreCase("APROBADO")) {

            log.warn("El vehículo ID {} ya se encuentra aprobado", id);

            throw new IllegalStateException(
                    "El vehículo ya fue aprobado");
        }

        // Impide aprobar vehículos rechazados
        if (vehiculo.getEstado().equalsIgnoreCase("RECHAZADO")) {

            log.warn("No se puede aprobar un vehículo rechazado");

            throw new IllegalStateException(
                    "Un vehículo rechazado no puede aprobarse");
        }

        vehiculo.setEstado("APROBADO");

        Vehiculo aprobado = vehiculoRepository.save(vehiculo);

        log.info("Vehículo ID {} aprobado correctamente", id);

        return aprobado;
    }

    // Rechaza un vehículo.
// Solo se pueden rechazar vehículos que estén PENDIENTE.
    public Vehiculo rechazarVehiculo(Long id) {

        log.info("Intentando rechazar vehículo ID: {}", id);

        Vehiculo vehiculo = vehiculoRepository.findById(id)
                .orElseThrow(() -> new VehiculoNotFoundException(id));

        // Evita rechazar nuevamente un vehículo ya rechazado
        if (vehiculo.getEstado().equalsIgnoreCase("RECHAZADO")) {

            throw new IllegalStateException(
                    "El vehículo ya fue rechazado");
        }

        // Impide rechazar vehículos aprobados
        if (vehiculo.getEstado().equalsIgnoreCase("APROBADO")) {

            throw new IllegalStateException(
                    "Un vehículo aprobado no puede rechazarse");
        }

        vehiculo.setEstado("RECHAZADO");

        return vehiculoRepository.save(vehiculo);
    }

    // Envía un vehículo a revisión
    public Vehiculo enviarRevision(Long id) {
        log.info("Enviando vehículo ID: {} a revisión", id);
        return actualizarEstado(id, "EN_REVISION");
    }

    // Elimina un vehículo por su ID
    public void eliminarVehiculo(Long id) {
        log.info("Eliminando vehículo con ID: {}", id);
        if (!vehiculoRepository.existsById(id)) {
            log.warn("No se encontró vehículo con ID: {} para eliminar", id);
            throw new VehiculoNotFoundException(id);
        }
        vehiculoRepository.deleteById(id);
        log.info("Vehículo con ID: {} eliminado exitosamente", id);
    }
    public List<Vehiculo> obtenerPorUsuario(Long userId) {
        log.info("Buscando vehículos del usuario ID: {}", userId);
        return vehiculoRepository.findByUserId(userId);
    }
}