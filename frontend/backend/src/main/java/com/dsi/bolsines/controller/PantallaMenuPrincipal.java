package com.dsi.bolsines.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dsi.bolsines.dto.BolsinResponse;
import com.dsi.bolsines.dto.MenuResponse;
import com.dsi.bolsines.model.Empleado;
import com.dsi.bolsines.model.Sesion;
import com.dsi.bolsines.model.Usuario;
import com.dsi.bolsines.repository.ISesionRepository;
import com.dsi.bolsines.service.GestorRegistarRecepcionBolsin;

/**
 * Menú principal del sistema. NO es parte del CU 28: es la pantalla desde
 * donde el Encargado de Bolsines elige la opción "Registrar recepción de bolsín".
 * Solo consulta datos (no modifica nada) para mostrar el saludo y los pendientes.
 * Reutiliza los mismos métodos del gestor, así el filtro sigue estando en un
 * único lugar: el IteradorBolsines.
 */
@RestController
@RequestMapping("/menu")
@CrossOrigin(origins = "*")
public class PantallaMenuPrincipal {

    private final GestorRegistarRecepcionBolsin gestor;
    private final ISesionRepository sesionRepository;

    public PantallaMenuPrincipal(GestorRegistarRecepcionBolsin gestor, ISesionRepository sesionRepository) {
        this.gestor = gestor;
        this.sesionRepository = sesionRepository;
    }

    @GetMapping
    public MenuResponse mostrarMenu() {
        Sesion actual = sesionRepository.findFirstByFechaHoraFinIsNull();
        Usuario usuario = actual.getUsuario();
        Empleado empleado = usuario.getEmpleado();

        String nombreCM = gestor.buscarComisionMedicaDelUsuarioLogueado();
        List<BolsinResponse> pendientes = gestor.buscarComisionMedicaConBolsinesEnviados();

        return new MenuResponse(usuario.getNombre(), empleado.getNombre() + " " + empleado.getApellido(),
                nombreCM, pendientes);
    }
}
