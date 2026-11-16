package com.dsi.bolsines.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import jakarta.persistence.*;

import com.dsi.bolsines.iterador.IAgregado;
import com.dsi.bolsines.iterador.IIterador;
import com.dsi.bolsines.iterador.IteradorDetalleRemitos;

/**
 * Remito es un AGREGADO del patrón Iterator: tiene la colección de DetalleRemito
 * y sabe crear el IteradorDetalleRemitos para recorrerla.
 */
@Entity
@Table(name = "remitos")
public class Remito implements IAgregado {

    @Id
    private int numero;

    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estado_id")
    private Estado estado;

    // Remito -> DetalleRemito (1..*)
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "remito_numero")
    @Fetch(FetchMode.SUBSELECT)
    private List<DetalleRemito> detalleRemito = new ArrayList<>();

    protected Remito() {
    }

    public Remito(int numero, LocalDate fecha, Estado estado) {
        this.numero = numero;
        this.fecha = fecha;
        this.estado = estado;
    }

    public int getNumero() {
        return numero;
    }

    /**
     * Paso 6 del CU: para cada documentación del remito, asunto y tipo.
     * Se recorre con el IteradorDetalleRemitos (loop detalles remito).
     */
    public List<String[]> obtenerDocumentacion() {
        List<String[]> datosDocumentacion = new ArrayList<>();

        IIterador iterador = crearIterador(detalleRemito.toArray(new DetalleRemito[0]));
        iterador.primero();
        while (!iterador.haTerminado()) {
            DetalleRemito detalle = (DetalleRemito) iterador.elementoActual();
            datosDocumentacion.add(detalle.mostrarDatosDocumentacion());
            iterador.siguiente();
        }
        return datosDocumentacion;
    }

    /**
     * Paso 11 del CU: el remito pasa a "Recibido y Aceptado" y cada
     * documentación a "Recibida y Aceptada" (loop recorrer Detalles Remito).
     */
    public void recibirRemito(Estado estadoRecibidoYAceptado, Estado estadoRecibidaYAceptada,
                              LocalDateTime fechaHoraActual, Empleado responsable) {
        setEstado(estadoRecibidoYAceptado);

        IIterador iterador = crearIterador(detalleRemito.toArray(new DetalleRemito[0]));
        iterador.primero();
        while (!iterador.haTerminado()) {
            DetalleRemito detalle = (DetalleRemito) iterador.elementoActual();
            detalle.aceptarDocumentacion(estadoRecibidaYAceptada, fechaHoraActual, responsable);
            iterador.siguiente();
        }
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    // crearIterador(elementos: Object[]): IIterador
    @Override
    public IIterador crearIterador(Object[] elementos) {
        return new IteradorDetalleRemitos((DetalleRemito[]) elementos, new Object[0]);
    }

    public void agregarDetalle(DetalleRemito detalle) {
        detalleRemito.add(detalle);
    }

    public Estado getEstado() {
        return estado;
    }
}
