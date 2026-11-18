package com.dsi.bolsines.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    private String nombre;
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    protected Usuario() {
    }

    public Usuario(String nombre, String password, Empleado empleado) {
        this.nombre = nombre;
        this.password = password;
        this.empleado = empleado;
    }

    public ComisionMedica buscarComisionMedicaDelUsuarioLogueado() {
        return empleado.buscarComisionMedicaDelUsuarioLogueado();
    }

    // Lo necesita el gestor para registrar el "empleado responsable" de los cambios de estado
    public Empleado getEmpleado() {
        return empleado;
    }

    public String getNombre() {
        return nombre;
    }
}
