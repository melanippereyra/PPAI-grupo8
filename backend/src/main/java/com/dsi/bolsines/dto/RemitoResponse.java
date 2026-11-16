package com.dsi.bolsines.dto;

import java.util.List;

public record RemitoResponse(int numeroRemito, List<DocumentacionResponse> documentacion) {
}
