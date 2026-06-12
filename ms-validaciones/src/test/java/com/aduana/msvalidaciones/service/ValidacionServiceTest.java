package com.aduana.msvalidaciones.service;

import com.aduana.msvalidaciones.enums.EstadoValidacion;
import com.aduana.msvalidaciones.model.Validacion;
import com.aduana.msvalidaciones.repository.ValidacionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ValidacionServiceTest {

    @Mock
    private ValidacionRepository repository;

    @InjectMocks
    private ValidacionService service;

    @Test
    void debeListarValidaciones() {

        List<Validacion> lista = List.of(
                Validacion.builder()
                        .id(1L)
                        .funcionario("Juan Perez")
                        .estado(EstadoValidacion.PENDIENTE)
                        .build()
        );

        when(repository.findAll()).thenReturn(lista);

        List<Validacion> resultado = service.listar();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
    }

    @Test
    void debeBuscarPorId() {

        Validacion validacion = Validacion.builder()
                .id(1L)
                .funcionario("Juan Perez")
                .estado(EstadoValidacion.PENDIENTE)
                .build();

        when(repository.findById(1L))
                .thenReturn(Optional.of(validacion));

        Validacion resultado = service.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Juan Perez", resultado.getFuncionario());
    }

    @Test
    void debeAprobarValidacion() {

        Validacion validacion = Validacion.builder()
                .id(1L)
                .estado(EstadoValidacion.PENDIENTE)
                .build();

        when(repository.findById(1L))
                .thenReturn(Optional.of(validacion));

        when(repository.save(any(Validacion.class)))
                .thenReturn(validacion);

        Validacion resultado = service.aprobar(1L);

        assertEquals(
                EstadoValidacion.APROBADO,
                resultado.getEstado()
        );
    }

    @Test
    void debeRechazarValidacion() {

        Validacion validacion = Validacion.builder()
                .id(1L)
                .estado(EstadoValidacion.PENDIENTE)
                .build();

        when(repository.findById(1L))
                .thenReturn(Optional.of(validacion));

        when(repository.save(any(Validacion.class)))
                .thenReturn(validacion);

        Validacion resultado =
                service.rechazar(1L, "Documentación incompleta");

        assertEquals(
                EstadoValidacion.RECHAZADO,
                resultado.getEstado()
        );

        assertEquals(
                "Documentación incompleta",
                resultado.getObservaciones()
        );
    }
}