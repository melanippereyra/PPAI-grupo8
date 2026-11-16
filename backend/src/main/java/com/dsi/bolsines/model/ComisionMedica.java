package com.dsi.bolsines.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "comisiones_medicas")
public class ComisionMedica {

    @Id
    private String codigo;
    private String direccion;
    private String email;
    private String nombre;
    private String telefono;

    protected ComisionMedica() {
    }

    public ComisionMedica(String codigo, String nombre, String direccion, String email, String telefono) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.direccion = direccion;
        this.email = email;
        this.telefono = telefono;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getEmail() {
        return email;
    }
}
