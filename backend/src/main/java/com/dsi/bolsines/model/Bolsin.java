package com.dsi.bolsines.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import jakarta.persistence.*;

import com.dsi.bolsines.iterador.IAgregado;
import com.dsi.bolsines.iterador.IIterador;
import com.dsi.bolsines.iterador.IteradorRemitos;

/**
 * Bolsin es un AGREGADO del patrón Iterator: tiene la colección de Remitos
 * y sabe crear el IteradorRemitos para recorrerla.
 */
@Entity
@Table(name = "bolsines")
public class Bolsin implements IAgregado {

    @Id
    private int numeroBolsin;

    private LocalDate fecha;
    private int numeroPrecinto;
    private float peso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "origen_codigo")
    private ComisionMedica origen;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destino_codigo")
    private ComisionMedica destino;

    // Bolsin -> Remito (1..*)
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "bolsin_numero")
    @Fetch(FetchMode.SUBSELECT)
    private List<Remito> remito = new ArrayList<>();

    // Bolsin -> CambioEstadoBolsin (1..*)
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "bolsin_numero")
    @Fetch(FetchMode.SUBSELECT)
    private List<CambioEstadoBolsin> cambioEstado = new ArrayList<>();

    protected Bolsin() {
    }

    public Bolsin(int numeroBolsin, LocalDate fecha, int numeroPrecinto, float peso,
                  ComisionMedica origen, ComisionMedica destino) {
        this.numeroBolsin = numeroBolsin;
        this.fecha = fecha;
        this.numeroPrecinto = numeroPrecinto;
        this.peso = peso;
        this.origen = origen;
        this.destino = destino;
    }

    // ---------- Filtro del IteradorBolsines ----------

    // ¿El bolsín va dirigido a la CM del usuario logueado?
    // (se comparan los códigos porque al venir de la base pueden ser objetos distintos)
    public boolean esTuCMDestino(ComisionMedica comisionMedica) {
        return destino.getCodigo().equals(comisionMedica.getCodigo());
    }

    // Busca el cambio de estado actual (*sosActual) y le pregunta si es Enviado
    public boolean sosEnviado() {
        for (CambioEstadoBolsin cambio : cambioEstado) {
            if (cambio.sosActual()) {
                return cambio.sosEnviado();
            }
        }
        return false;
    }

    // ---------- Datos para mostrar ----------

    public String getCMOrigen() {
        return origen.getNombre();
    }

    public int getNroPrecinto() {
        return numeroPrecinto;
    }

    public int getNumeroBolsin() {
        return numeroBolsin;
    }

    /**
     * Paso 6 del CU. Recorre los remitos con el IteradorRemitos (loop remitos) y
     * devuelve: número de remito -> lista de { asunto, tipoDocumentacion }.
     */
    public Map<Integer, List<String[]>> obtenerInformacionRemito() {
        Map<Integer, List<String[]>> informacion = new LinkedHashMap<>();

        IIterador iterador = crearIterador(remito.toArray(new Remito[0]));
        iterador.primero();
        while (!iterador.haTerminado()) {
            Remito remitoActual = (Remito) iterador.elementoActual();
            informacion.put(remitoActual.getNumero(), remitoActual.obtenerDocumentacion());
            iterador.siguiente();
        }
        return informacion;
    }

    // ---------- Recepción (paso 11 del CU) ----------

    public void recibirBolsin(Estado estadoRecibido, Estado estadoRecibidoYAceptado,
                              Estado estadoRecibidaYAceptada, LocalDateTime fechaHoraActual,
                              Empleado responsable) {
        // 1) cierra el cambio de estado actual
        for (CambioEstadoBolsin cambio : cambioEstado) {
            if (cambio.sosActual()) {
                cambio.setFechaYHoraFin(fechaHoraActual);
            }
        }
        // 2) crea el nuevo cambio "Recibido en CM Destino"
        crearCambioEstadoBolsin(estadoRecibido, fechaHoraActual, responsable);

        // 3) loop recorrer remitos del bolsin
        IIterador iterador = crearIterador(remito.toArray(new Remito[0]));
        iterador.primero();
        while (!iterador.haTerminado()) {
            Remito remitoActual = (Remito) iterador.elementoActual();
            remitoActual.recibirRemito(estadoRecibidoYAceptado, estadoRecibidaYAceptada,
                    fechaHoraActual, responsable);
            iterador.siguiente();
        }
    }

    public void crearCambioEstadoBolsin(Estado estado, LocalDateTime fechaHoraInicio, Empleado responsable) {
        CambioEstadoBolsin nuevo = new CambioEstadoBolsin(fechaHoraInicio, estado, responsable);
        cambioEstado.add(nuevo);
    }

    // crearIterador(elementos: Object[]): IIterador
    @Override
    public IIterador crearIterador(Object[] elementos) {
        return new IteradorRemitos((Remito[]) elementos, new Object[0]);
    }

    public void agregarRemito(Remito nuevoRemito) {
        remito.add(nuevoRemito);
    }

    public List<CambioEstadoBolsin> getCambioEstado() {
        return cambioEstado;
    }

    public List<Remito> getRemito() {
        return remito;
    }
}
