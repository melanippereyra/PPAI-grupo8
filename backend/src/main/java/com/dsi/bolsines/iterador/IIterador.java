package com.dsi.bolsines.iterador;

/**
 * Patrón Iterator (Gamma) - rol ITERATOR.
 * Define la interfaz para recorrer los elementos de un agregado
 * sin conocer cómo están guardados por dentro.
 */
public interface IIterador {

    // Indica si el elemento actual cumple los filtros recibidos al crear el iterador
    boolean comprobarFiltro(Object[] filtros);

    // true cuando ya no quedan elementos por recorrer
    boolean haTerminado();

    // Devuelve el elemento actual (si cumple los filtros) o null si no los cumple
    Object elementoActual();

    // Se posiciona en el primer elemento
    void primero();

    // Avanza al siguiente elemento
    void siguiente();
}
