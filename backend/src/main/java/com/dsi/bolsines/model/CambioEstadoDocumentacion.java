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
@Table(name = "cambios_estado_documentacion")
public class CambioEstadoDocumentacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)   // la base genera el id al crear un cambio nuevo
    private Integer id;

    private LocalDateTime fechaHoraFin;
    private LocalDateTime fechaHoraInicio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estado_id")
    private Estado estado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "responsable_id")
    private Empleado responsable;

    protected CambioEstadoDocumentacion() {
    }

    // new()
    public CambioEstadoDocumentacion(LocalDateTime fechaHoraInicio, Estado estado, Empleado responsable) {
        this.fechaHoraInicio = fechaHoraInicio;
        this.estado = estado;
        this.responsable = responsable;
    }

    // El cambio actual es el que todavía no tiene fecha de fin
    public boolean sosActual() {
        return fechaHoraFin == null;
    }

    public void setFechaHoraFin(LocalDateTime fechaHoraFin) {
        this.fechaHoraFin = fechaHoraFin;
    }

    public Estado getEstado() {
        return estado;
    }
}
