package com.dsi.bolsines.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dsi.bolsines.dto.InicioResponse;
import com.dsi.bolsines.dto.MensajeResponse;
import com.dsi.bolsines.dto.SeleccionBolsinResponse;
import com.dsi.bolsines.dto.SeleccionarBolsinRequest;
import com.dsi.bolsines.service.GestorRegistarRecepcionBolsin;

/**
 * BOUNDARY del CU 28. En una API REST la pantalla es el controller (igual que PantAdmLaboreos de la cátedra).
 * Cada endpoint es un mensaje que el actor le manda a la pantalla en el diagrama de secuencia.
 * Los métodos mostrarX() del diagrama están en el front de React, que es lo que el usuario ve.
 */
@RestController
@RequestMapping("/recepcion-bolsin")
@CrossOrigin(origins = "*")
public class PantallaAdmBolsin {

    private final GestorRegistarRecepcionBolsin gestor;

    public PantallaAdmBolsin(GestorRegistarRecepcionBolsin gestor) {
        this.gestor = gestor;
    }

    // Paso 1: EncargadoDeBolsines -> opcionRegistrarRecepcionBolsin()
    @PostMapping("/iniciar")
    public ResponseEntity<InicioResponse> opcionRegistrarRecepcionBolsin() {
        return ResponseEntity.ok(habilitarVentana());
    }

    // pantAdmBolsin -> habilitarVentana() -> gestor.registrarRecepcionBolsin()
    private InicioResponse habilitarVentana() {
        return gestor.registrarRecepcionBolsin();
    }

    // Paso 5: EncargadoDeBolsines -> tomarSeleccionDeBolsin()
    @PostMapping("/seleccionar-bolsin")
    public ResponseEntity<SeleccionBolsinResponse> tomarSeleccionDeBolsin(@RequestBody SeleccionarBolsinRequest request) {
        SeleccionBolsinResponse respuesta = gestor.tomarSeleccionDeBolsin(request.numeroBolsin());
        if (respuesta == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(respuesta);
    }

    // Paso 8: EncargadoDeBolsines -> tomarSeleccionOpcion1()
    @PostMapping("/seleccionar-opcion-1")
    public ResponseEntity<MensajeResponse> tomarSeleccionOpcion1() {
        if (!gestor.hayBolsinSeleccionado()) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Primero debe seleccionar un bolsín."));
        }
        return ResponseEntity.ok(new MensajeResponse(gestor.tomarSeleccionOpcion1()));
    }

    // Paso 10: EncargadoDeBolsines -> tomarConfirmacionDocumentacion()
    @PostMapping("/confirmar")
    public ResponseEntity<MensajeResponse> tomarConfirmacionDocumentacion() {
        if (!gestor.hayBolsinSeleccionado()) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Primero debe seleccionar un bolsín."));
        }
        return ResponseEntity.ok(new MensajeResponse(gestor.tomarConfirmacionDocumentacion()));
    }

    // A6 (no confirma) y Observación 1 (cancelar el CU)
    @PostMapping("/cancelar")
    public ResponseEntity<MensajeResponse> cancelar() {
        gestor.finDelCU();
        return ResponseEntity.ok(new MensajeResponse("Se canceló el registro de la recepción. No se modificó ningún dato."));
    }
}
