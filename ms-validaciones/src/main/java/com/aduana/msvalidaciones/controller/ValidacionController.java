package com.aduana.msvalidaciones.controller;

import com.aduana.msvalidaciones.model.Validacion;
import com.aduana.msvalidaciones.service.ValidacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.aduana.msvalidaciones.enums.EstadoValidacion;
import java.util.List;
import com.aduana.msvalidaciones.dto.ValidacionResponse;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@Tag(name="Validaciones",description = "Gestión de validaciones de tramites aduaneros")

@RestController
@RequestMapping("/api/validaciones")
@RequiredArgsConstructor

public class ValidacionController {

    private final ValidacionService service;

    @Operation(summary = "Listar todas las validaciones")
    @GetMapping
    public List<Validacion> listar(){
        return service.listar();
    }
    @Operation(summary = "Buscar validacion por ID ")
    @GetMapping ("/{id}")
    public ValidacionResponse buscarPorId(@PathVariable Long id){
        return toResponse( service.buscarPorId(id));
    }
    @Operation(summary = "Buscar validacion por estado ")
    @GetMapping("/estado/{estado}")
    public List<Validacion>buscarPorEstado(
            @PathVariable EstadoValidacion estado){
        return service.buscarPorEstado(estado);
    }

    @Operation(summary = "Guardar validacion")
    @PostMapping
    public Validacion guardar (@Valid @RequestBody Validacion validacion){
        return service.guardar(validacion);
    }
    @Operation(summary = "Actualizar el estado de aprobacion")
    @PutMapping ("/aprobar/{id}")
    public Validacion aprobar (@PathVariable Long id){
        return service.aprobar(id);
    }
    @Operation(summary = "Actualizar el estado de rechazado")
    @PutMapping("/rechazar/{id}")
    public Validacion rechazar(@PathVariable Long id, @RequestBody String observacion){
    return service.rechazar(id,observacion);

    }

    @Operation(summary = "Eliminar una validacion")
    @DeleteMapping("/{id}")
    public String eliminar (@PathVariable Long id){
         service.eliminar(id);
         return "Validacion eliminada correctamente";
    }

    private ValidacionResponse toResponse(
            Validacion validacion) {

        ValidacionResponse response =
                new ValidacionResponse();

        response.setId(validacion.getId());
        response.setEstado(validacion.getEstado());
        response.setFuncionario(validacion.getFuncionario());

        response.add(linkTo(methodOn(ValidacionController.class).buscarPorId(validacion.getId())).withSelfRel());
        response.add(linkTo(methodOn(ValidacionController.class).listar()).withRel("todas-las-validaciones"));
        response.add(linkTo(methodOn(ValidacionController.class).aprobar(validacion.getId())).withRel("aprobar"));
        // response.add(linkTo(methodOn(ValidacionController.class).rechazar(validacion.getId(), "")).withRel("rechazar"));
        //response.add(linkTo(methodOn(ValidacionController.class).eliminar(validacion.getId())).withRel("eliminar"));
        return response;
    }


}
