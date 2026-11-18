package com.dsi.bolsines.iterador;

import com.dsi.bolsines.model.Bolsin;
import com.dsi.bolsines.model.ComisionMedica;

/**
 * Patrón Iterator (Gamma) - rol ITERADOR CONCRETO.
 * Recorre los bolsines y filtra los que están en estado Enviado
 * con destino a la comisión médica del usuario logueado.
 */
public class IteradorBolsines implements IIterador {

    private int posicion;
    private Bolsin[] elementos;
    private Object[] filtros;   // filtros[0] = ComisionMedica del usuario logueado

    // new(elementos: Bolsin[], filtros: Object[]): IteradorBolsines
    public IteradorBolsines(Bolsin[] elementos, Object[] filtros) {
        this.elementos = elementos;
        this.filtros = filtros;
        this.posicion = 0;
    }

    @Override
    public boolean comprobarFiltro(Object[] filtros) {
        Bolsin bolsin = elementos[posicion];
        ComisionMedica comisionMedicaUsuario = (ComisionMedica) filtros[0];
        // Experto: es el propio Bolsin el que sabe responder estas preguntas
        return bolsin.esTuCMDestino(comisionMedicaUsuario) && bolsin.sosEnviado();
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
        return null;   // no cumple el filtro: el gestor lo saltea
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
