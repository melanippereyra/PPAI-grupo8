package com.dsi.bolsines.dto;

import java.util.List;

// Respuesta de tomarSeleccionDeBolsin(): pasos 6 y 7 del CU.
public record SeleccionBolsinResponse(List<RemitoResponse> remitos, List<String> opcionesRecepcion) {
}
