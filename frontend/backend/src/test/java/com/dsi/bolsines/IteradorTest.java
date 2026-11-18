package com.dsi.bolsines;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.dsi.bolsines.iterador.IIterador;
import com.dsi.bolsines.iterador.IteradorBolsines;
import com.dsi.bolsines.model.*;

/**
 * Prueba de la Parte 1: verifica que los iteradores recorren y filtran bien
 * sin necesidad de levantar el servidor ni la base de datos.
 */
class IteradorTest {

    Estado enviadoBolsin = new Estado("Bolsin", "Enviado", "Bolsín enviado");
    Estado recibidoBolsin = new Estado("Bolsin", "Recibido en CM Destino", "Bolsín recibido");
    Estado enviadoRemito = new Estado("Remito", "Enviado", "Remito enviado");
    Estado recibidoYAceptado = new Estado("Remito", "Recibido y Aceptado", "Remito recibido");
    Estado remitida = new Estado("Documentacion", "Remitida", "Doc. remitida");
    Estado recibidaYAceptada = new Estado("Documentacion", "Recibida y Aceptada", "Doc. recibida");

    ComisionMedica cordoba = new ComisionMedica("CBA", "Comisión Médica Córdoba", "-", "-", "-");
    ComisionMedica rosario = new ComisionMedica("ROS", "Comisión Médica Rosario", "-", "-", "-");
    ComisionMedica mendoza = new ComisionMedica("MZA", "Comisión Médica Mendoza", "-", "-", "-");
    Empleado empleado = new Empleado("Ana", "Pérez", "ana@cm.gob.ar", cordoba);

    private Bolsin crearBolsin(int numero, int precinto, ComisionMedica origen, ComisionMedica destino) {
        Bolsin b = new Bolsin(numero, LocalDate.now(), precinto, 500f, origen, destino);
        b.crearCambioEstadoBolsin(enviadoBolsin, LocalDateTime.now().minusDays(1), empleado);
        Remito r = new Remito(numero * 10, LocalDate.now(), enviadoRemito);
        Documentacion d = new Documentacion(1, "Expediente de prueba", LocalDate.now(),
                new TipoDocumentacion("Expediente", "-"), origen);
        d.crearCambioEstadoDocumentacion(remitida, LocalDateTime.now().minusDays(1), empleado);
        r.agregarDetalle(new DetalleRemito(d, null));
        b.agregarRemito(r);
        return b;
    }

    @Test
    void iteradorBolsinesFiltraPorCMDestinoYEstadoEnviado() {
        Bolsin paraCordoba = crearBolsin(1, 1001, rosario, cordoba);
        Bolsin paraMendoza = crearBolsin(2, 1002, rosario, mendoza);   // otra CM destino
        Bolsin yaRecibido = crearBolsin(3, 1003, rosario, cordoba);
        yaRecibido.recibirBolsin(recibidoBolsin, recibidoYAceptado, recibidaYAceptada, LocalDateTime.now(), empleado);

        Bolsin[] bolsines = { paraCordoba, paraMendoza, yaRecibido };
        IIterador iterador = new IteradorBolsines(bolsines, new Object[] { cordoba });

        List<Bolsin> encontrados = new ArrayList<>();
        iterador.primero();
        while (!iterador.haTerminado()) {
            Bolsin actual = (Bolsin) iterador.elementoActual();
            if (actual != null) {
                encontrados.add(actual);
            }
            iterador.siguiente();
        }
        assertEquals(List.of(paraCordoba), encontrados);
    }

    @Test
    void obtenerInformacionRemitoYRecibirBolsin() {
        Bolsin bolsin = crearBolsin(1, 1001, rosario, cordoba);

        Map<Integer, List<String[]>> info = bolsin.obtenerInformacionRemito();
        assertArrayEquals(new String[] { "Expediente de prueba", "Expediente" }, info.get(10).get(0));

        bolsin.recibirBolsin(recibidoBolsin, recibidoYAceptado, recibidaYAceptada, LocalDateTime.now(), empleado);
        assertFalse(bolsin.sosEnviado());
        Remito remito = bolsin.getRemito().get(0);
        assertTrue(remito.getEstado().esRecibidoYAceptado());
        assertEquals(2, bolsin.getCambioEstado().size());   // Enviado (cerrado) + Recibido (actual)
    }
}
