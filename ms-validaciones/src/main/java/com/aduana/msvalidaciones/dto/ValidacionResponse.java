package com.aduana.msvalidaciones.dto;

import com.aduana.msvalidaciones.enums.EstadoValidacion;
import org.springframework.hateoas.RepresentationModel;

public class ValidacionResponse
        extends RepresentationModel<ValidacionResponse> {

    private Long id;
    private EstadoValidacion estado;
    private String funcionario;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EstadoValidacion getEstado() {
        return estado;
    }

    public void setEstado(EstadoValidacion estado) {
        this.estado = estado;
    }

    public String getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(String funcionario) {
        this.funcionario = funcionario;
    }
}