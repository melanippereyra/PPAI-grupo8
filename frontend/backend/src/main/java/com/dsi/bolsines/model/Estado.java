package com.dsi.bolsines.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Estado de Bolsin, Remito o Documentacion.
 * El atributo "ambito" indica a qué clase aplica ("Bolsin", "Remito", "Documentacion").
 * Cada método esXxx() pregunta por sí mismo (patrón Experto): el gestor nunca compara Strings.
 */
@Entity
@Table(name = "estados")
public class Estado {

    @Id
    private Integer id;   // clave de la tabla (no es del dominio)

    private String ambito;
    private String descripcion;
    private String nombre;

    protected Estado() {
        // constructor vacío: lo necesita JPA
    }

    public Estado(String ambito, String nombre, String descripcion) {
        this.ambito = ambito;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    // ---- ámbito ----
    public boolean esAmbitoBolsin() {
        return "Bolsin".equals(ambito);
    }

    public boolean esAmbitoRemito() {
        return "Remito".equals(ambito);
    }

    public boolean esAmbitoDocumentacion() {
        return "Documentacion".equals(ambito);
    }

    // ---- nombre del estado ----
    public boolean esEnviado() {
        return "Enviado".equals(nombre);
    }

    // Estado del Bolsin al recibirlo: "Recibido en CM Destino"
    public boolean esRecibido() {
        return "Recibido en CM Destino".equals(nombre);
    }

    // Estado del Remito al recibirlo
    public boolean esRecibidoYAceptado() {
        return "Recibido y Aceptado".equals(nombre);
    }

    // Estado de la Documentacion al recibirla
    public boolean esRecibidaYAceptada() {
        return "Recibida y Aceptada".equals(nombre);
    }

    // ---- getters ----
    public String getAmbito() {
        return ambito;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getNombre() {
        return nombre;
    }
}
