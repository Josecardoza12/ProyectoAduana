package com.aduana.msvalidaciones.service;

import com.aduana.msvalidaciones.client.AuthClient;
import com.aduana.msvalidaciones.client.DeclaracionSagClient;
import com.aduana.msvalidaciones.client.VehiculoClient;
import com.aduana.msvalidaciones.dto.AccionValidacionRequest;
import com.aduana.msvalidaciones.dto.AuthUserResponse;
import com.aduana.msvalidaciones.dto.TramiteValidacionResponse;
import com.aduana.msvalidaciones.enums.EstadoValidacion;
import com.aduana.msvalidaciones.enums.TipoTramite;
import com.aduana.msvalidaciones.exception.ValidacionNotFoundException;
import com.aduana.msvalidaciones.model.Validacion;
import com.aduana.msvalidaciones.repository.ValidacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ValidacionService {

    private final ValidacionRepository repository;

    private final AuthClient authClient;
    private final DeclaracionSagClient declaracionSagClient;
    private final VehiculoClient vehiculoClient;

    /*
     * =========================================================
     * BITÁCORA DE VALIDACIONES
     * =========================================================
     */

    public List<Validacion> listar() {
        return repository.findAll();
    }

    public Validacion buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ValidacionNotFoundException(id));
    }

    public List<Validacion> buscarPorEstadoNuevo(EstadoValidacion estadoNuevo) {
        return repository.findByEstadoNuevo(estadoNuevo);
    }

    public List<Validacion> buscarPorTipoTramite(TipoTramite tipoTramite) {
        return repository.findByTipoTramite(tipoTramite);
    }

    public List<Validacion> buscarPorRolFuncionario(String funcionarioRol) {
        return repository.findByFuncionarioRol(funcionarioRol);
    }

    public List<Validacion> buscarPorFuncionarioId(Long funcionarioId) {
        return repository.findByFuncionarioId(funcionarioId);
    }

    public List<Validacion> buscarPorTipoYEstado(
            TipoTramite tipoTramite,
            EstadoValidacion estadoNuevo
    ) {
        return repository.findByTipoTramiteAndEstadoNuevo(tipoTramite, estadoNuevo);
    }

    public List<Validacion> buscarPorTramite(
            TipoTramite tipoTramite,
            Long tramiteId
    ) {
        return repository.findByTipoTramiteAndTramiteId(tipoTramite, tramiteId);
    }

    public Validacion guardar(Validacion validacion) {
        return repository.save(validacion);
    }

    public Validacion registrarBitacora(
            TipoTramite tipoTramite,
            Long tramiteId,
            EstadoValidacion estadoAnterior,
            EstadoValidacion estadoNuevo,
            Long funcionarioId,
            String funcionarioCorreo,
            String funcionarioRol,
            String observaciones
    ) {
        Validacion validacion = Validacion.builder()
                .tipoTramite(tipoTramite)
                .tramiteId(tramiteId)
                .estadoAnterior(estadoAnterior)
                .estadoNuevo(estadoNuevo)
                .funcionarioId(funcionarioId)
                .funcionarioCorreo(funcionarioCorreo)
                .funcionarioRol(normalizarRol(funcionarioRol))
                .observaciones(observaciones)
                .build();

        return repository.save(validacion);
    }

    public void eliminar(Long id) {
        Validacion validacion = buscarPorId(id);
        repository.delete(validacion);
    }

    /*
     * =========================================================
     * BANDEJA CENTRAL DE TRÁMITES
     * =========================================================
     */

    public List<TramiteValidacionResponse> listarTramites(
            String token,
            TipoTramite tipoFiltro,
            String estadoFiltro
    ) {
        AuthUserResponse usuario = authClient.obtenerUsuarioAutenticado(token);

        String rol = normalizarRol(usuario.getRol());

        List<TramiteValidacionResponse> tramites = new ArrayList<>();

        if (rol.equals("ADMIN")) {
            agregarDeclaraciones(token, tramites);
            agregarPasajeros(token, tramites);
            agregarMenores(token, tramites);
            agregarVehiculos(token, tramites);
        }

        if (rol.equals("SAG")) {
            agregarDeclaraciones(token, tramites);
        }

        if (rol.equals("PDI")) {
            agregarDeclaraciones(token, tramites);
            agregarPasajeros(token, tramites);
            agregarMenores(token, tramites);
            agregarVehiculos(token, tramites);
        }

        if (tipoFiltro != null) {
            tramites = tramites.stream()
                    .filter(t -> t.getTipoTramite() == tipoFiltro)
                    .toList();
        }

        if (estadoFiltro != null && !estadoFiltro.isBlank()) {
            tramites = tramites.stream()
                    .filter(t -> estadoFiltro.equalsIgnoreCase(t.getEstado()))
                    .toList();
        }

        return tramites;
    }

    public Validacion aprobarTramite(
            String token,
            TipoTramite tipoTramite,
            Long tramiteId,
            AccionValidacionRequest request
    ) {
        return ejecutarAccion(
                token,
                tipoTramite,
                tramiteId,
                EstadoValidacion.APROBADO,
                obtenerObservacion(request)
        );
    }

    public Validacion rechazarTramite(
            String token,
            TipoTramite tipoTramite,
            Long tramiteId,
            AccionValidacionRequest request
    ) {
        return ejecutarAccion(
                token,
                tipoTramite,
                tramiteId,
                EstadoValidacion.RECHAZADO,
                obtenerObservacion(request)
        );
    }

    public Validacion enviarRevisionTramite(
            String token,
            TipoTramite tipoTramite,
            Long tramiteId,
            AccionValidacionRequest request
    ) {
        return ejecutarAccion(
                token,
                tipoTramite,
                tramiteId,
                EstadoValidacion.EN_REVISION,
                obtenerObservacion(request)
        );
    }

    private Validacion ejecutarAccion(
            String token,
            TipoTramite tipoTramite,
            Long tramiteId,
            EstadoValidacion estadoNuevo,
            String observacion
    ) {
        AuthUserResponse funcionario = authClient.obtenerUsuarioAutenticado(token);

        String rolFuncionario = normalizarRol(funcionario.getRol());

        validarPermisoFuncionario(rolFuncionario, tipoTramite);

        Map<String, Object> tramiteAntes = obtenerTramitePorTipo(token, tipoTramite, tramiteId);

        EstadoValidacion estadoAnterior = obtenerEstadoDesdeMapa(tramiteAntes);

        if (tipoTramite == TipoTramite.DECLARACION_SAG) {
            if (estadoNuevo == EstadoValidacion.APROBADO) {
                declaracionSagClient.aprobarDeclaracion(token, tramiteId);
            } else if (estadoNuevo == EstadoValidacion.RECHAZADO) {
                declaracionSagClient.rechazarDeclaracion(token, tramiteId);
            } else if (estadoNuevo == EstadoValidacion.EN_REVISION) {
                declaracionSagClient.enviarRevisionDeclaracion(token, tramiteId);
            }
        }

        if (tipoTramite == TipoTramite.PASAJERO) {
            if (estadoNuevo == EstadoValidacion.APROBADO) {
                declaracionSagClient.aprobarPasajero(token, tramiteId);
            } else if (estadoNuevo == EstadoValidacion.RECHAZADO) {
                declaracionSagClient.rechazarPasajero(token, tramiteId);
            } else if (estadoNuevo == EstadoValidacion.EN_REVISION) {
                declaracionSagClient.enviarRevisionPasajero(token, tramiteId);
            }
        }

        if (tipoTramite == TipoTramite.MENOR) {
            if (estadoNuevo == EstadoValidacion.APROBADO) {
                declaracionSagClient.aprobarMenor(token, tramiteId);
            } else if (estadoNuevo == EstadoValidacion.RECHAZADO) {
                declaracionSagClient.rechazarMenor(token, tramiteId, observacion);
            } else if (estadoNuevo == EstadoValidacion.EN_REVISION) {
                declaracionSagClient.enviarRevisionMenor(token, tramiteId);
            }
        }

        if (tipoTramite == TipoTramite.VEHICULO) {
            if (estadoNuevo == EstadoValidacion.APROBADO) {
                vehiculoClient.aprobarVehiculo(token, tramiteId);
            } else if (estadoNuevo == EstadoValidacion.RECHAZADO) {
                vehiculoClient.rechazarVehiculo(token, tramiteId);
            } else if (estadoNuevo == EstadoValidacion.EN_REVISION) {
                vehiculoClient.enviarRevisionVehiculo(token, tramiteId);
            }
        }

        return registrarBitacora(
                tipoTramite,
                tramiteId,
                estadoAnterior,
                estadoNuevo,
                funcionario.getId(),
                funcionario.getCorreo(),
                rolFuncionario,
                observacion
        );
    }

    /*
     * =========================================================
     * PERMISOS POR ROL
     * =========================================================
     */

    private void validarPermisoFuncionario(String rol, TipoTramite tipoTramite) {

        String rolNormalizado = normalizarRol(rol);

        if (rolNormalizado.equals("ADMIN")) {
            return;
        }

        if (rolNormalizado.equals("SAG") && tipoTramite == TipoTramite.DECLARACION_SAG) {
            return;
        }

        if (rolNormalizado.equals("PDI") &&
                (
                        tipoTramite == TipoTramite.PASAJERO ||
                                tipoTramite == TipoTramite.MENOR ||
                                tipoTramite == TipoTramite.VEHICULO
                )
        ) {
            return;
        }

        throw new SecurityException("No tienes permisos para validar este tipo de trámite");
    }

    /*
     * =========================================================
     * CARGA DE TRÁMITES DESDE OTROS MICROSERVICIOS
     * =========================================================
     */

    private void agregarDeclaraciones(
            String token,
            List<TramiteValidacionResponse> tramites
    ) {
        List<Map<String, Object>> declaraciones = declaracionSagClient.listarDeclaraciones(token);

        if (declaraciones == null) {
            return;
        }

        for (Map<String, Object> declaracion : declaraciones) {
            tramites.add(mapearDeclaracion(declaracion));
        }
    }

    private void agregarPasajeros(
            String token,
            List<TramiteValidacionResponse> tramites
    ) {
        List<Map<String, Object>> pasajeros = declaracionSagClient.listarPasajeros(token);

        if (pasajeros == null) {
            return;
        }

        for (Map<String, Object> pasajero : pasajeros) {
            tramites.add(mapearPasajero(pasajero));
        }
    }

    private void agregarMenores(
            String token,
            List<TramiteValidacionResponse> tramites
    ) {
        List<Map<String, Object>> menores = declaracionSagClient.listarMenores(token);

        if (menores == null) {
            return;
        }

        for (Map<String, Object> menor : menores) {
            tramites.add(mapearMenor(menor));
        }
    }

    private void agregarVehiculos(
            String token,
            List<TramiteValidacionResponse> tramites
    ) {
        List<Map<String, Object>> vehiculos = vehiculoClient.listarVehiculos(token);

        if (vehiculos == null) {
            return;
        }

        for (Map<String, Object> vehiculo : vehiculos) {
            tramites.add(mapearVehiculo(vehiculo));
        }
    }

    /*
     * =========================================================
     * MAPEO DE CADA TRÁMITE A UN FORMATO COMÚN
     * =========================================================
     */

    private TramiteValidacionResponse mapearDeclaracion(Map<String, Object> declaracion) {
        return TramiteValidacionResponse.builder()
                .tramiteId(obtenerLong(declaracion, "id"))
                .tipoTramite(TipoTramite.DECLARACION_SAG)
                .userId(obtenerLong(declaracion, "userId"))
                .responsable("Usuario ID: " + obtenerTexto(declaracion, "userId"))
                .documento("Declaración SAG")
                .referencia(obtenerReferenciaDeclaracion(declaracion))
                .estado(normalizarEstadoTexto(obtenerTexto(declaracion, "estado")))
                .observaciones(obtenerTexto(declaracion, "observaciones"))
                .fechaRegistro(obtenerFecha(declaracion, "fechaDeclaracion", "fechaRegistro", "fechaCreacion"))
                .build();
    }

    private TramiteValidacionResponse mapearPasajero(Map<String, Object> pasajero) {
        String nombres = obtenerTexto(pasajero, "nombres");
        String apellidos = obtenerTexto(pasajero, "apellidos");

        return TramiteValidacionResponse.builder()
                .tramiteId(obtenerLong(pasajero, "id"))
                .tipoTramite(TipoTramite.PASAJERO)
                .userId(obtenerLong(pasajero, "userId"))
                .responsable((nombres + " " + apellidos).trim())
                .documento("RUT: " + obtenerTexto(pasajero, "rut") + " / Pasaporte: " + obtenerTexto(pasajero, "pasaporte"))
                .referencia(obtenerTexto(pasajero, "paisOrigen") + " → " + obtenerTexto(pasajero, "paisDestino"))
                .estado(normalizarEstadoTexto(obtenerTexto(pasajero, "estado")))
                .observaciones(obtenerTexto(pasajero, "observaciones"))
                .fechaRegistro(obtenerFecha(pasajero, "fechaRegistro", "fechaIngreso"))
                .build();
    }

    private TramiteValidacionResponse mapearMenor(Map<String, Object> menor) {
        return TramiteValidacionResponse.builder()
                .tramiteId(obtenerLong(menor, "id"))
                .tipoTramite(TipoTramite.MENOR)
                .userId(obtenerLong(menor, "userId"))
                .responsable(obtenerTexto(menor, "nombreMenor"))
                .documento("Menor: " + obtenerTexto(menor, "documentoMenor") + " / Tutor: " + obtenerTexto(menor, "documentoTutor"))
                .referencia(obtenerTexto(menor, "paisOrigen") + " → " + obtenerTexto(menor, "paisDestino"))
                .estado(normalizarEstadoTexto(obtenerTexto(menor, "estado")))
                .observaciones(obtenerTexto(menor, "observaciones"))
                .fechaRegistro(obtenerFecha(menor, "fechaRegistro"))
                .build();
    }

    private TramiteValidacionResponse mapearVehiculo(Map<String, Object> vehiculo) {
        String marca = obtenerTexto(vehiculo, "marca");
        String modelo = obtenerTexto(vehiculo, "modelo");

        return TramiteValidacionResponse.builder()
                .tramiteId(obtenerLong(vehiculo, "id"))
                .tipoTramite(TipoTramite.VEHICULO)
                .userId(obtenerLong(vehiculo, "userId"))
                .responsable(obtenerTexto(vehiculo, "nombrePropietario"))
                .documento("Patente: " + obtenerTexto(vehiculo, "patente"))
                .referencia((marca + " " + modelo).trim())
                .estado(normalizarEstadoTexto(obtenerTexto(vehiculo, "estado")))
                .observaciones(obtenerTexto(vehiculo, "observaciones"))
                .fechaRegistro(obtenerFecha(vehiculo, "fechaRegistro", "fechaCreacion"))
                .build();
    }

    /*
     * =========================================================
     * OBTENER TRÁMITE INDIVIDUAL PARA SABER ESTADO ANTERIOR
     * =========================================================
     */

    private Map<String, Object> obtenerTramitePorTipo(
            String token,
            TipoTramite tipoTramite,
            Long tramiteId
    ) {
        if (tipoTramite == TipoTramite.DECLARACION_SAG) {
            return declaracionSagClient.obtenerDeclaracionPorId(token, tramiteId);
        }

        if (tipoTramite == TipoTramite.PASAJERO) {
            return declaracionSagClient.obtenerPasajeroPorId(token, tramiteId);
        }

        if (tipoTramite == TipoTramite.MENOR) {
            return declaracionSagClient.obtenerMenorPorId(token, tramiteId);
        }

        if (tipoTramite == TipoTramite.VEHICULO) {
            return vehiculoClient.obtenerVehiculoPorId(token, tramiteId);
        }

        throw new IllegalArgumentException("Tipo de trámite no soportado");
    }

    /*
     * =========================================================
     * HELPERS
     * =========================================================
     */

    private String obtenerObservacion(AccionValidacionRequest request) {
        if (request == null || request.getObservacion() == null) {
            return "";
        }

        return request.getObservacion();
    }

    private EstadoValidacion obtenerEstadoDesdeMapa(Map<String, Object> data) {
        String estado = obtenerTexto(data, "estado");

        if (estado == null || estado.isBlank()) {
            return EstadoValidacion.PENDIENTE;
        }

        estado = normalizarEstadoTexto(estado);

        if (estado.equals("APROBADO")) {
            return EstadoValidacion.APROBADO;
        }

        if (estado.equals("RECHAZADO")) {
            return EstadoValidacion.RECHAZADO;
        }

        if (estado.equals("EN_REVISION")) {
            return EstadoValidacion.EN_REVISION;
        }

        if (estado.equals("REGISTRADO")) {
            return EstadoValidacion.REGISTRADO;
        }

        if (estado.equals("PENDIENTE")) {
            return EstadoValidacion.PENDIENTE;
        }

        return EstadoValidacion.PENDIENTE;
    }

    private String normalizarEstadoTexto(String estado) {
        if (estado == null || estado.isBlank()) {
            return "PENDIENTE";
        }

        String estadoNormalizado = estado.trim().toUpperCase();

        if (estadoNormalizado.equals("APROBADA")) {
            return "APROBADO";
        }

        if (estadoNormalizado.equals("RECHAZADA")) {
            return "RECHAZADO";
        }

        if (estadoNormalizado.equals("APROBADO")) {
            return "APROBADO";
        }

        if (estadoNormalizado.equals("RECHAZADO")) {
            return "RECHAZADO";
        }

        if (estadoNormalizado.equals("EN_REVISION")) {
            return "EN_REVISION";
        }

        if (estadoNormalizado.equals("REGISTRADO")) {
            return "REGISTRADO";
        }

        if (estadoNormalizado.equals("PENDIENTE")) {
            return "PENDIENTE";
        }

        return estadoNormalizado;
    }

    private String normalizarRol(String rol) {
        if (rol == null || rol.isBlank()) {
            return "";
        }

        return rol.replace("ROLE_", "").trim().toUpperCase();
    }

    private Long obtenerLong(Map<String, Object> data, String key) {
        Object valor = data.get(key);

        if (valor == null) {
            return null;
        }

        if (valor instanceof Number numero) {
            return numero.longValue();
        }

        return Long.parseLong(valor.toString());
    }

    private String obtenerTexto(Map<String, Object> data, String key) {
        Object valor = data.get(key);

        if (valor == null) {
            return "";
        }

        return valor.toString();
    }

    private LocalDateTime obtenerFecha(
            Map<String, Object> data,
            String... keys
    ) {
        for (String key : keys) {
            Object valor = data.get(key);

            if (valor == null) {
                continue;
            }

            try {
                return LocalDateTime.parse(valor.toString());
            } catch (Exception e) {
                return null;
            }
        }

        return null;
    }

    private String obtenerReferenciaDeclaracion(Map<String, Object> declaracion) {
        String producto = obtenerTexto(declaracion, "producto");
        String descripcion = obtenerTexto(declaracion, "descripcion");
        String tipoProducto = obtenerTexto(declaracion, "tipoProducto");

        if (!producto.isBlank()) {
            return producto;
        }

        if (!descripcion.isBlank()) {
            return descripcion;
        }

        if (!tipoProducto.isBlank()) {
            return tipoProducto;
        }

        return "Declaración sanitaria";
    }
}