package com.dsi.bolsines.dto;

// Lo que la pantalla muestra de cada bolsín: CM origen y número de precinto (paso 4 del CU).
// numeroBolsin viaja para que el front pueda avisar cuál se seleccionó.
public record BolsinResponse(int numeroBolsin, String cmOrigen, int numeroPrecinto) {
}
