package com.dsi.bolsines.iterador;

import com.dsi.bolsines.model.DetalleRemito;

/**
 * Patrón Iterator (Gamma) - rol ITERADOR CONCRETO.
 * Recorre los detalles de un remito. No tiene filtros: devuelve todos.
 */
public class IteradorDetalleRemitos implements IIterador {

    private int posicion;
    private DetalleRemito[] elementos;
    private Object[] filtros;

    // new(elementos: DetalleRemito[], filtros: Object[]): IteradorDetalleRemitos
    public IteradorDetalleRemitos(DetalleRemito[] elementos, Object[] filtros) {
        this.elementos = elementos;
        this.filtros = filtros;
        this.posicion = 0;
    }

    @Override
    public boolean comprobarFiltro(Object[] filtros) {
        return true;   // se recorren todos los detalles del remito
    }

    @Override
    public boolean haTerminado() {
        return posicion >= elementos.length;
    }

    @Override
    public Object elementoActual() {
        if (comprobarFiltro(filtros)) {
            return elementos[posicion];
        }
        return null;
    }

    @Override
    public void primero() {
        posicion = 0;
    }

    @Override
    public void siguiente() {
        posicion++;
    }
}
