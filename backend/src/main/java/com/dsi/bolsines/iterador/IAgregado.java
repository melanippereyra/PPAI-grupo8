package com.dsi.bolsines.iterador;

/**
 * Patrón Iterator (Gamma) - rol AGREGADO.
 * Toda clase que tenga una colección para recorrer implementa esta interfaz
 * y sabe crear el iterador concreto que le corresponde.
 * En nuestro diseño la implementan: GestorRegistarRecepcionBolsin, Bolsin y Remito.
 */
public interface IAgregado {

    IIterador crearIterador(Object[] elementos);
}
