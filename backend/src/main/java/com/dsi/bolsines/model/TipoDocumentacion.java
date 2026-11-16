package com.dsi.bolsines.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tipos_documentacion")
public class TipoDocumentacion {

    @Id
    private String nombre;
    private String descripcion;

    protected TipoDocumentacion() {
    }

    public TipoDocumentacion(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
