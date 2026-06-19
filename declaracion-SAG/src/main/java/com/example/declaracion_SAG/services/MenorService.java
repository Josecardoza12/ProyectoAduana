package com.example.declaracion_SAG.services;
import com.example.declaracion_SAG.dto.MenorRequestDTO;
import com.example.declaracion_SAG.enums.EstadoMenor;
import com.example.declaracion_SAG.model.Menor;
import com.example.declaracion_SAG.repository.MenorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class MenorService {

    private final MenorRepository menorRepository;

    public List<Menor> listar() {
        return menorRepository.findAll();
    }

    public Menor buscarPorId(Long id) {
        return menorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No existe solicitud de menor con ID: " + id));
    }

    public List<Menor> buscarPorUsuario(Long userId) {
        return menorRepository.findByUserId(userId);
    }

    public List<Menor> buscarPorEstado(EstadoMenor estado) {
        return menorRepository.findByEstado(estado);
    }

    public List<Menor> buscarPorDocumentoMenor(String documentoMenor) {
        return menorRepository.findByDocumentoMenor(documentoMenor);
    }

    public List<Menor> buscarPorDocumentoTutor(String documentoTutor) {
        return menorRepository.findByDocumentoTutor(documentoTutor);
    }

    public Menor registrar(MenorRequestDTO dto) {

        validarEdadMenor(dto.getFechaNacimiento());
        validarPaises(dto.getPaisOrigen(), dto.getPaisDestino());

        Menor menor = Menor.builder()
                .userId(dto.getUserId())
                .nombreMenor(dto.getNombreMenor())
                .documentoMenor(dto.getDocumentoMenor())
                .fechaNacimiento(dto.getFechaNacimiento())
                .nombreTutor(dto.getNombreTutor())
                .documentoTutor(dto.getDocumentoTutor())
                .parentesco(dto.getParentesco())
                .telefonoTutor(dto.getTelefonoTutor())
                .paisOrigen(normalizarPais(dto.getPaisOrigen()))
                .paisDestino(normalizarPais(dto.getPaisDestino()))
                .motivoViaje(dto.getMotivoViaje())
                .observaciones(dto.getObservaciones())
                .estado(EstadoMenor.PENDIENTE)
                .build();

        return menorRepository.save(menor);
    }

    public Menor aprobar(Long id) {
        Menor menor = buscarPorId(id);
        menor.setEstado(EstadoMenor.APROBADO);
        return menorRepository.save(menor);
    }

    public Menor rechazar(Long id, String observaciones) {
        Menor menor = buscarPorId(id);
        menor.setEstado(EstadoMenor.RECHAZADO);
        menor.setObservaciones(observaciones);
        return menorRepository.save(menor);
    }

    public Menor enviarRevision(Long id) {
        Menor menor = buscarPorId(id);
        menor.setEstado(EstadoMenor.EN_REVISION);
        return menorRepository.save(menor);
    }

    public void eliminar(Long id) {
        Menor menor = buscarPorId(id);
        menorRepository.delete(menor);
    }

    private void validarEdadMenor(LocalDate fechaNacimiento) {

        if (fechaNacimiento == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de nacimiento es obligatoria"
            );
        }

        if (fechaNacimiento.isAfter(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de nacimiento no puede ser futura"
            );
        }

        int edad = Period.between(fechaNacimiento, LocalDate.now()).getYears();

        if (edad >= 18) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Solo se pueden registrar menores de edad. La persona debe tener menos de 18 años."
            );
        }
    }

    private void validarPaises(String paisOrigen, String paisDestino) {

        String origen = normalizarPais(paisOrigen);
        String destino = normalizarPais(paisDestino);

        if (!esPaisPermitido(origen)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El país de origen solo puede ser Chile o Argentina"
            );
        }

        if (!esPaisPermitido(destino)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El país de destino solo puede ser Chile o Argentina"
            );
        }

        if (origen.equals(destino)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El país de origen y destino no pueden ser el mismo"
            );
        }
    }

    private boolean esPaisPermitido(String pais) {
        return pais.equals("Chile") || pais.equals("Argentina");
    }

    private String normalizarPais(String pais) {

        if (pais == null || pais.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El país es obligatorio"
            );
        }

        String paisLimpio = pais.trim().toLowerCase();

        if (paisLimpio.equals("chile")) {
            return "Chile";
        }

        if (paisLimpio.equals("argentina")) {
            return "Argentina";
        }

        return pais.trim();
    }
}