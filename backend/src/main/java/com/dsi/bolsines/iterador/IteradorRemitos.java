package com.dsi.bolsines.iterador;

import com.dsi.bolsines.model.Remito;

/**
 * Patrón Iterator (Gamma) - rol ITERADOR CONCRETO.
 * Recorre los remitos de un bolsín. No tiene filtros: devuelve todos.
 */
public class IteradorRemitos implements IIterador {

    private int posicion;
    private Remito[] elementos;
    private Object[] filtros;

    // new(elementos: Remito[], filtros: Object[]): IteradorRemitos
    public IteradorRemitos(Remito[] elementos, Object[] filtros) {
        this.elementos = elementos;
        this.filtros = filtros;
        this.posicion = 0;
    }

    @Override
    public boolean comprobarFiltro(Object[] filtros) {
        return true;   // se recorren todos los remitos del bolsín
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
