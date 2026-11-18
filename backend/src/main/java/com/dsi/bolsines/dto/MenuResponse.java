package com.dsi.bolsines.dto;

import java.util.List;

// Datos que muestra el menú principal (antes de iniciar el CU 28):
// quién está logueado, su CM y cuántos bolsines tiene por recibir.
public record MenuResponse(String nombreUsuario, String nombreEmpleado, String comisionMedica,
                           List<BolsinResponse> bolsinesPorRecibir) {
}
