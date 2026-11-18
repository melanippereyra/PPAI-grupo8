package com.dsi.bolsines.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "sesiones")
public class Sesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;   // null = sesión abierta (la actual)

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_nombre")
    private Usuario usuario;

    protected Sesion() {
    }

    public Sesion(LocalDateTime fechaHoraInicio, Usuario usuario) {
        this.fechaHoraInicio = fechaHoraInicio;
        this.usuario = usuario;
    }

    // actual:Sesion -> :Usuario -> :Empleado -> :ComisionMedica
    public ComisionMedica buscarComisionMedicaDelUsuarioLogueado() {
        return usuario.buscarComisionMedicaDelUsuarioLogueado();
    }

    public Usuario getUsuario() {
        return usuario;
    }
}
