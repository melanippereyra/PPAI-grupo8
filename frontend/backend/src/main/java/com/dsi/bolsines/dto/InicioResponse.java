package com.dsi.bolsines.dto;

import java.util.List;

// Respuesta de opcionRegistrarRecepcionBolsin(): pasos 2 a 4 del CU.
public record InicioResponse(String comisionMedica, List<BolsinResponse> bolsines) {
}
