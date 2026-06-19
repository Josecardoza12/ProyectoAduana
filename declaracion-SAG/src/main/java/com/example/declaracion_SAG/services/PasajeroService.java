package com.example.declaracion_SAG.services;

import com.example.declaracion_SAG.dto.PasajeroRequestDTO;
import com.example.declaracion_SAG.enums.EstadoPasajero;
import com.example.declaracion_SAG.model.Pasajero;
import com.example.declaracion_SAG.repository.PasajeroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PasajeroService {

    private final PasajeroRepository pasajeroRepository;

    public List<Pasajero> listar() {
        return pasajeroRepository.findAll();
    }

    public Pasajero buscarPorId(Long id) {
        return pasajeroRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No existe pasajero con ID: " + id));
    }

    public List<Pasajero> buscarPorUsuario(Long userId) {
        return pasajeroRepository.findByUserId(userId);
    }

    public List<Pasajero> buscarPorEstado(EstadoPasajero estado) {
        return pasajeroRepository.findByEstado(estado);
    }

    public List<Pasajero> buscarPorRut(String rut) {
        return pasajeroRepository.findByRut(rut);
    }

    public List<Pasajero> buscarPorPasaporte(String pasaporte) {
        return pasajeroRepository.findByPasaporte(pasaporte);
    }

    public Pasajero registrar(PasajeroRequestDTO dto) {

        Pasajero pasajero = Pasajero.builder()
                .userId(dto.getUserId())
                .nombres(dto.getNombres())
                .apellidos(dto.getApellidos())
                .rut(dto.getRut())
                .pasaporte(dto.getPasaporte())
                .email(dto.getEmail())
                .telefono(dto.getTelefono())
                .nacionalidad(dto.getNacionalidad())
                .paisOrigen(dto.getPaisOrigen())
                .paisDestino(dto.getPaisDestino())
                .fechaIngreso(dto.getFechaIngreso())
                .motivoViaje(dto.getMotivoViaje())
                .observaciones(dto.getObservaciones())
                .estado(EstadoPasajero.REGISTRADO)
                .build();

        return pasajeroRepository.save(pasajero);
    }

    public Pasajero actualizarEstado(Long id, EstadoPasajero estado) {
        Pasajero pasajero = buscarPorId(id);

        pasajero.setEstado(estado);

        return pasajeroRepository.save(pasajero);
    }

    public void eliminar(Long id) {
        Pasajero pasajero = buscarPorId(id);
        pasajeroRepository.delete(pasajero);
    }
}