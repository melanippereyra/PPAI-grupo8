package com.dsi.bolsines.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import jakarta.persistence.*;

@Entity
@Table(name = "documentaciones")
public class Documentacion {

    @Id
    private int numero;

    private String asunto;
    private LocalDate fechaPase;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tipo_documentacion_nombre")
    private TipoDocumentacion tipoDocumentacion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cm_origen_codigo")
    private ComisionMedica cmOrigen;

    // Documentacion -> CambioEstadoDocumentacion (1..*). cascade: al guardar la documentación se guardan sus cambios
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "documentacion_numero")
    @Fetch(FetchMode.SUBSELECT)
    private List<CambioEstadoDocumentacion> cambioEstado = new ArrayList<>();

    protected Documentacion() {
    }

    public Documentacion(int numero, String asunto, LocalDate fechaPase,
                         TipoDocumentacion tipoDocumentacion, ComisionMedica cmOrigen) {
        this.numero = numero;
        this.asunto = asunto;
        this.fechaPase = fechaPase;
        this.tipoDocumentacion = tipoDocumentacion;
        this.cmOrigen = cmOrigen;
    }

    public String getAsunto() {
        return asunto;
    }

    // :Documentacion -> :TipoDocumentacion getNombre()
    public String getTipoDocumentacion() {
        return tipoDocumentacion.getNombre();
    }

    /**
     * Pasa la documentación a "Recibida y Aceptada":
     * 1) busca el cambio de estado actual (*sosActual) y le pone fecha de fin
     * 2) crea el nuevo CambioEstadoDocumentacion
     */
    public void aceptar(Estado estadoRecibidaYAceptada, LocalDateTime fechaHoraActual, Empleado responsable) {
        for (CambioEstadoDocumentacion cambio : cambioEstado) {
            if (cambio.sosActual()) {
                cambio.setFechaHoraFin(fechaHoraActual);
            }
        }
        crearCambioEstadoDocumentacion(estadoRecibidaYAceptada, fechaHoraActual, responsable);
    }

    public void crearCambioEstadoDocumentacion(Estado estado, LocalDateTime fechaHoraInicio, Empleado responsable) {
        CambioEstadoDocumentacion nuevo = new CambioEstadoDocumentacion(fechaHoraInicio, estado, responsable);
        cambioEstado.add(nuevo);
    }

    public int getNumero() {
        return numero;
    }

    public List<CambioEstadoDocumentacion> getCambioEstado() {
        return cambioEstado;
    }
}
