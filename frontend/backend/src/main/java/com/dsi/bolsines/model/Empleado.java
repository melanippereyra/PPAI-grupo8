package com.dsi.bolsines.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "empleados")
public class Empleado {

    @Id
    private Integer id;   // clave de la tabla (no es del dominio)

    private String apellido;
    private String email;
    private String nombre;

    // Empleado -> ComisionMedica (1): CM donde trabaja
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "comision_medica_codigo")
    private ComisionMedica comisionMedica;

    protected Empleado() {
    }

    public Empleado(String nombre, String apellido, String email, ComisionMedica comisionMedica) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.comisionMedica = comisionMedica;
    }

    // Último eslabón de la cadena Sesion -> Usuario -> Empleado
    public ComisionMedica buscarComisionMedicaDelUsuarioLogueado() {
        return comisionMedica;
    }

    public String getEmail() {
        return email;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }
}
