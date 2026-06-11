package com.aduanas.msvehiculo.service;

import com.aduanas.msvehiculo.dto.VehiculoRequestDTO;
import com.aduanas.msvehiculo.exception.VehiculoNotFoundException;
import com.aduanas.msvehiculo.exception.VehiculoYaExisteException;
import com.aduanas.msvehiculo.model.Vehiculo;
import com.aduanas.msvehiculo.repository.VehiculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class VehiculoServiceTest {

    @Mock
    private VehiculoRepository vehiculoRepository;

    @InjectMocks
    private VehiculoService vehiculoService;

    private Vehiculo vehiculo;
    private VehiculoRequestDTO dto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        vehiculo = new Vehiculo();
        vehiculo.setId(1L);
        vehiculo.setPatente("AA1111");
        vehiculo.setMarca("Toyota");
        vehiculo.setModelo("Corolla");
        vehiculo.setAnio("2023");
        vehiculo.setColor("Blanco");
        vehiculo.setTipoVehiculo("PARTICULAR");
        vehiculo.setPaisOrigen("AR");
        vehiculo.setRutPropietario("12345678-9");
        vehiculo.setTipoMovimiento("ENTRADA");
        vehiculo.setEstado("PENDIENTE");
        vehiculo.setPasoFronterizo("LOS_LIBERTADORES");
        vehiculo.setDiasEstadia(30);
        vehiculo.setObservaciones("Prueba unitaria");

        dto = new VehiculoRequestDTO();
        dto.setPatente("AA1111");
        dto.setMarca("Toyota");
        dto.setModelo("Corolla");
        dto.setAnio("2023");
        dto.setColor("Blanco");
        dto.setTipoVehiculo("PARTICULAR");
        dto.setPaisOrigen("AR");
        dto.setRutPropietario("12345678-9");
        dto.setTipoMovimiento("ENTRADA");
        dto.setPasoFronterizo("LOS_LIBERTADORES");
        dto.setDiasEstadia(30);
        dto.setObservaciones("Prueba unitaria");
    }

    @Test
    @DisplayName("Debe registrar un vehículo correctamente")
    void debeRegistrarVehiculoCorrectamente() {
        // Given
        when(vehiculoRepository.existsByPatente(dto.getPatente())).thenReturn(false);
        when(vehiculoRepository.save(any(Vehiculo.class))).thenReturn(vehiculo);

        // When
        Vehiculo resultado = vehiculoService.registrarVehiculo(dto);

        // Then
        assertNotNull(resultado);
        assertEquals("AA1111", resultado.getPatente());
        assertEquals("Toyota", resultado.getMarca());

        verify(vehiculoRepository).existsByPatente(dto.getPatente());
        verify(vehiculoRepository).save(any(Vehiculo.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción si la patente ya existe")
    void debeLanzarExcepcionSiPatenteExiste() {
        // Given
        when(vehiculoRepository.existsByPatente(dto.getPatente())).thenReturn(true);

        // When & Then
        assertThrows(
                VehiculoYaExisteException.class,
                () -> vehiculoService.registrarVehiculo(dto)
        );

        verify(vehiculoRepository).existsByPatente(dto.getPatente());
        verify(vehiculoRepository, never()).save(any(Vehiculo.class));
    }

    @Test
    @DisplayName("Debe obtener todos los vehículos")
    void debeObtenerTodosLosVehiculos() {
        // Given
        when(vehiculoRepository.findAll()).thenReturn(List.of(vehiculo));

        // When
        List<Vehiculo> resultado = vehiculoService.obtenerTodos();

        // Then
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("AA1111", resultado.get(0).getPatente());

        verify(vehiculoRepository).findAll();
    }

    @Test
    @DisplayName("Debe obtener vehículos paginados")
    void debeObtenerVehiculosPaginados() {
        // Given
        Pageable pageable = PageRequest.of(0, 5);
        Page<Vehiculo> pagina = new PageImpl<>(List.of(vehiculo));

        when(vehiculoRepository.findAll(pageable)).thenReturn(pagina);

        // When
        Page<Vehiculo> resultado = vehiculoService.obtenerTodosPaginados(pageable);

        // Then
        assertNotNull(resultado);
        assertEquals(1, resultado.getContent().size());
        assertEquals("AA1111", resultado.getContent().get(0).getPatente());

        verify(vehiculoRepository).findAll(pageable);
    }

    @Test
    @DisplayName("Debe obtener vehículo por ID correctamente")
    void debeObtenerVehiculoPorId() {
        // Given
        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(vehiculo));

        // When
        Vehiculo resultado = vehiculoService.obtenerPorId(1L);

        // Then
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("AA1111", resultado.getPatente());

        verify(vehiculoRepository).findById(1L);
    }

    @Test
    @DisplayName("Debe lanzar excepción si el vehículo no existe por ID")
    void debeLanzarExcepcionSiVehiculoNoExistePorId() {
        // Given
        when(vehiculoRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(
                VehiculoNotFoundException.class,
                () -> vehiculoService.obtenerPorId(99L)
        );

        verify(vehiculoRepository).findById(99L);
    }

    @Test
    @DisplayName("Debe obtener vehículo por patente ignorando mayúsculas")
    void debeObtenerVehiculoPorPatenteIgnoreCase() {
        // Given
        when(vehiculoRepository.findByPatenteIgnoreCase("aa1111"))
                .thenReturn(Optional.of(vehiculo));

        // When
        Vehiculo resultado = vehiculoService.obtenerPorPatente("aa1111");

        // Then
        assertNotNull(resultado);
        assertEquals("AA1111", resultado.getPatente());

        verify(vehiculoRepository).findByPatenteIgnoreCase("aa1111");
    }

    @Test
    @DisplayName("Debe lanzar excepción si no existe la patente")
    void debeLanzarExcepcionSiNoExistePatente() {
        // Given
        when(vehiculoRepository.findByPatenteIgnoreCase("ZZ9999"))
                .thenReturn(Optional.empty());

        // When & Then
        assertThrows(
                VehiculoNotFoundException.class,
                () -> vehiculoService.obtenerPorPatente("ZZ9999")
        );

        verify(vehiculoRepository).findByPatenteIgnoreCase("ZZ9999");
    }

    @Test
    @DisplayName("Debe obtener vehículos por estado")
    void debeObtenerVehiculosPorEstado() {
        // Given
        when(vehiculoRepository.findByEstado("PENDIENTE")).thenReturn(List.of(vehiculo));

        // When
        List<Vehiculo> resultado = vehiculoService.obtenerPorEstado("PENDIENTE");

        // Then
        assertEquals(1, resultado.size());
        assertEquals("PENDIENTE", resultado.get(0).getEstado());

        verify(vehiculoRepository).findByEstado("PENDIENTE");
    }

    @Test
    @DisplayName("Debe obtener vehículos por RUT del propietario")
    void debeObtenerVehiculosPorRut() {
        // Given
        when(vehiculoRepository.findByRutPropietario("12345678-9"))
                .thenReturn(List.of(vehiculo));

        // When
        List<Vehiculo> resultado = vehiculoService.obtenerPorRut("12345678-9");

        // Then
        assertEquals(1, resultado.size());
        assertEquals("12345678-9", resultado.get(0).getRutPropietario());

        verify(vehiculoRepository).findByRutPropietario("12345678-9");
    }

    @Test
    @DisplayName("Debe obtener vehículos por paso fronterizo")
    void debeObtenerVehiculosPorPasoFronterizo() {
        // Given
        when(vehiculoRepository.findByPasoFronterizo("LOS_LIBERTADORES"))
                .thenReturn(List.of(vehiculo));

        // When
        List<Vehiculo> resultado =
                vehiculoService.obtenerPorPasoFronterizo("LOS_LIBERTADORES");

        // Then
        assertEquals(1, resultado.size());
        assertEquals("LOS_LIBERTADORES", resultado.get(0).getPasoFronterizo());

        verify(vehiculoRepository).findByPasoFronterizo("LOS_LIBERTADORES");
    }

    @Test
    @DisplayName("Debe actualizar el estado de un vehículo")
    void debeActualizarEstadoVehiculo() {
        // Given
        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(vehiculo));
        when(vehiculoRepository.save(any(Vehiculo.class))).thenReturn(vehiculo);

        // When
        Vehiculo resultado = vehiculoService.actualizarEstado(1L, "EN_REVISION");

        // Then
        assertEquals("EN_REVISION", resultado.getEstado());

        verify(vehiculoRepository).findById(1L);
        verify(vehiculoRepository).save(vehiculo);
    }

    @Test
    @DisplayName("Debe lanzar excepción al actualizar estado de vehículo inexistente")
    void debeLanzarExcepcionAlActualizarEstadoDeVehiculoInexistente() {
        // Given
        when(vehiculoRepository.findById(99L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(
                VehiculoNotFoundException.class,
                () -> vehiculoService.actualizarEstado(99L, "EN_REVISION")
        );

        verify(vehiculoRepository).findById(99L);
        verify(vehiculoRepository, never()).save(any(Vehiculo.class));
    }

    @Test
    @DisplayName("Debe aprobar un vehículo pendiente")
    void debeAprobarVehiculoPendiente() {
        // Given
        vehiculo.setEstado("PENDIENTE");

        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(vehiculo));
        when(vehiculoRepository.save(any(Vehiculo.class))).thenReturn(vehiculo);

        // When
        Vehiculo resultado = vehiculoService.aprobarVehiculo(1L);

        // Then
        assertEquals("APROBADO", resultado.getEstado());

        verify(vehiculoRepository).findById(1L);
        verify(vehiculoRepository).save(vehiculo);
    }

    @Test
    @DisplayName("No debe aprobar un vehículo ya aprobado")
    void noDebeAprobarVehiculoYaAprobado() {
        // Given
        vehiculo.setEstado("APROBADO");

        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(vehiculo));

        // When & Then
        assertThrows(
                IllegalStateException.class,
                () -> vehiculoService.aprobarVehiculo(1L)
        );

        verify(vehiculoRepository).findById(1L);
        verify(vehiculoRepository, never()).save(any(Vehiculo.class));
    }

    @Test
    @DisplayName("No debe aprobar un vehículo rechazado")
    void noDebeAprobarVehiculoRechazado() {
        // Given
        vehiculo.setEstado("RECHAZADO");

        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(vehiculo));

        // When & Then
        assertThrows(
                IllegalStateException.class,
                () -> vehiculoService.aprobarVehiculo(1L)
        );

        verify(vehiculoRepository).findById(1L);
        verify(vehiculoRepository, never()).save(any(Vehiculo.class));
    }

    @Test
    @DisplayName("Debe rechazar un vehículo pendiente")
    void debeRechazarVehiculoPendiente() {
        // Given
        vehiculo.setEstado("PENDIENTE");

        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(vehiculo));
        when(vehiculoRepository.save(any(Vehiculo.class))).thenReturn(vehiculo);

        // When
        Vehiculo resultado = vehiculoService.rechazarVehiculo(1L);

        // Then
        assertEquals("RECHAZADO", resultado.getEstado());

        verify(vehiculoRepository).findById(1L);
        verify(vehiculoRepository).save(vehiculo);
    }

    @Test
    @DisplayName("No debe rechazar un vehículo ya rechazado")
    void noDebeRechazarVehiculoYaRechazado() {
        // Given
        vehiculo.setEstado("RECHAZADO");

        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(vehiculo));

        // When & Then
        assertThrows(
                IllegalStateException.class,
                () -> vehiculoService.rechazarVehiculo(1L)
        );

        verify(vehiculoRepository).findById(1L);
        verify(vehiculoRepository, never()).save(any(Vehiculo.class));
    }

    @Test
    @DisplayName("No debe rechazar un vehículo aprobado")
    void noDebeRechazarVehiculoAprobado() {
        // Given
        vehiculo.setEstado("APROBADO");

        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(vehiculo));

        // When & Then
        assertThrows(
                IllegalStateException.class,
                () -> vehiculoService.rechazarVehiculo(1L)
        );

        verify(vehiculoRepository).findById(1L);
        verify(vehiculoRepository, never()).save(any(Vehiculo.class));
    }

    @Test
    @DisplayName("Debe enviar un vehículo a revisión")
    void debeEnviarVehiculoARevision() {
        // Given
        vehiculo.setEstado("PENDIENTE");

        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(vehiculo));
        when(vehiculoRepository.save(any(Vehiculo.class))).thenReturn(vehiculo);

        // When
        Vehiculo resultado = vehiculoService.enviarRevision(1L);

        // Then
        assertEquals("EN_REVISION", resultado.getEstado());

        verify(vehiculoRepository).findById(1L);
        verify(vehiculoRepository).save(vehiculo);
    }

    @Test
    @DisplayName("Debe eliminar un vehículo existente")
    void debeEliminarVehiculoExistente() {
        // Given
        when(vehiculoRepository.existsById(1L)).thenReturn(true);

        // When
        vehiculoService.eliminarVehiculo(1L);

        // Then
        verify(vehiculoRepository).existsById(1L);
        verify(vehiculoRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Debe lanzar excepción al eliminar un vehículo inexistente")
    void debeLanzarExcepcionAlEliminarVehiculoInexistente() {
        // Given
        when(vehiculoRepository.existsById(99L)).thenReturn(false);

        // When & Then
        assertThrows(
                VehiculoNotFoundException.class,
                () -> vehiculoService.eliminarVehiculo(99L)
        );

        verify(vehiculoRepository).existsById(99L);
        verify(vehiculoRepository, never()).deleteById(anyLong());
    }
}