package com.dsi.bolsines.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.dsi.bolsines.dto.BolsinResponse;
import com.dsi.bolsines.dto.DocumentacionResponse;
import com.dsi.bolsines.dto.InicioResponse;
import com.dsi.bolsines.dto.RemitoResponse;
import com.dsi.bolsines.dto.SeleccionBolsinResponse;
import com.dsi.bolsines.iterador.IAgregado;
import com.dsi.bolsines.iterador.IIterador;
import com.dsi.bolsines.iterador.IteradorBolsines;
import com.dsi.bolsines.model.Bolsin;
import com.dsi.bolsines.model.ComisionMedica;
import com.dsi.bolsines.model.Estado;
import com.dsi.bolsines.model.Sesion;
import com.dsi.bolsines.model.Usuario;
import com.dsi.bolsines.repository.IBolsinRepository;
import com.dsi.bolsines.repository.IEstadoRepository;
import com.dsi.bolsines.repository.ISesionRepository;

/**
 * Clase de CONTROL del CU 28 "Registrar recepción de bolsín".
 * También es un AGREGADO del patrón Iterator: crea el IteradorBolsines.
 *
 * Como es una API REST (igual que el ejemplo de la cátedra), los mensajes
 * Gestor -> Pantalla (mostrarX, solicitarX, informarX) no se llaman:
 * la información vuelve a la pantalla como RETORNO de cada método.
 */
@Service
public class GestorRegistarRecepcionBolsin implements IAgregado {

    // ---- Atributos del diagrama de clases ----
    private LocalDateTime fechaYHoraActual;
    private Usuario usuarioLogueado;
    private ComisionMedica comisionMedicaUsuario;
    private Bolsin[] bolsinesEnviados;

    // ---- Atributos que necesita la implementación ----
    private Bolsin bolsinSeleccionado;
    private Estado estadoRecibido;            // Bolsin
    private Estado estadoRecibidoYAceptado;   // Remito
    private Estado estadoRecibidaYAceptada;   // Documentacion

    // ---- Acceso a la base de datos (Spring los inyecta por constructor) ----
    private final IBolsinRepository bolsinRepository;
    private final IEstadoRepository estadoRepository;
    private final ISesionRepository sesionRepository;

    public GestorRegistarRecepcionBolsin(IBolsinRepository bolsinRepository,
                                         IEstadoRepository estadoRepository,
                                         ISesionRepository sesionRepository) {
        this.bolsinRepository = bolsinRepository;
        this.estadoRepository = estadoRepository;
        this.sesionRepository = sesionRepository;
    }

    // =====================================================================
    // Pasos 1 a 4: la pantalla llama a registrarRecepcionBolsin()
    // =====================================================================
    public InicioResponse registrarRecepcionBolsin() {
        bolsinSeleccionado = null;

        String nombreCM = buscarComisionMedicaDelUsuarioLogueado();          // paso 2
        List<BolsinResponse> bolsines = buscarComisionMedicaConBolsinesEnviados(); // paso 3

        return new InicioResponse(nombreCM, bolsines);   // -> mostrarComisionMedica() y mostrarPrecintosYCmOrigenParaSeleccion()
    }

    // actual:Sesion -> :Usuario -> :Empleado -> :ComisionMedica.getNombre()
    public String buscarComisionMedicaDelUsuarioLogueado() {
        Sesion actual = sesionRepository.findFirstByFechaHoraFinIsNull();
        usuarioLogueado = actual.getUsuario();
        comisionMedicaUsuario = actual.buscarComisionMedicaDelUsuarioLogueado();
        return comisionMedicaUsuario.getNombre();
    }

    /**
     * Paso 3: "loop BuscarBolsin" con el IteradorBolsines.
     * El iterador ya filtra (comprobarFiltro): enviados y con destino = CM del usuario.
     */
    public List<BolsinResponse> buscarComisionMedicaConBolsinesEnviados() {
        Bolsin[] todos = bolsinRepository.findAll().toArray(new Bolsin[0]);
        List<Bolsin> encontrados = new ArrayList<>();
        List<BolsinResponse> respuesta = new ArrayList<>();

        IIterador iterador = crearIterador(todos);
        iterador.primero();
        while (!iterador.haTerminado()) {
            Bolsin bolsin = (Bolsin) iterador.elementoActual();
            if (bolsin != null) {   // null = no cumplió el filtro
                encontrados.add(bolsin);
                respuesta.add(new BolsinResponse(bolsin.getNumeroBolsin(), bolsin.getCMOrigen(), bolsin.getNroPrecinto()));
            }
            iterador.siguiente();
        }
        bolsinesEnviados = encontrados.toArray(new Bolsin[0]);
        return respuesta;
    }

    // crearIterador(elementos: Object[]): IIterador
    // El filtro es la CM del usuario logueado (atributo del gestor).
    @Override
    public IIterador crearIterador(Object[] elementos) {
        return new IteradorBolsines((Bolsin[]) elementos, new Object[] { comisionMedicaUsuario });
    }

    // =====================================================================
    // Pasos 5 a 7: el EB selecciona un bolsín del listado
    // =====================================================================
    public SeleccionBolsinResponse tomarSeleccionDeBolsin(int numeroBolsin) {
        bolsinSeleccionado = null;
        for (Bolsin bolsin : bolsinesEnviados) {
            if (bolsin.getNumeroBolsin() == numeroBolsin) {
                bolsinSeleccionado = bolsin;
            }
        }
        if (bolsinSeleccionado == null) {
            return null;   // el controller responde "no encontrado"
        }

        List<RemitoResponse> remitos = buscarRemitos();   // -> mostrarNumeroRemito() y mostrarAsuntoYTipoDocumentacion()

        // paso 7 -> mostrarOpcionesDeRecepcionDelBolsinParaSeleccion()
        List<String> opciones = List.of(
                "El contenido del bolsín es igual al registrado",
                "No se recibe toda la documentación asociada a los remitos que contiene el bolsín",
                "Existe documentación que no corresponde al destino",
                "La documentación se debe redirigir a otra área");

        return new SeleccionBolsinResponse(remitos, opciones);
    }

    // Paso 6: el Bolsin recorre sus remitos con IteradorRemitos y cada Remito sus detalles con IteradorDetalleRemitos
    public List<RemitoResponse> buscarRemitos() {
        Map<Integer, List<String[]>> informacion = bolsinSeleccionado.obtenerInformacionRemito();

        List<RemitoResponse> remitos = new ArrayList<>();
        for (Map.Entry<Integer, List<String[]>> entrada : informacion.entrySet()) {
            List<DocumentacionResponse> docs = new ArrayList<>();
            for (String[] datosDoc : entrada.getValue()) {
                docs.add(new DocumentacionResponse(datosDoc[0], datosDoc[1]));
            }
            remitos.add(new RemitoResponse(entrada.getKey(), docs));
        }
        return remitos;
    }

    // =====================================================================
    // Pasos 8 y 9: el EB selecciona la opción 1 -> se pide confirmación
    // =====================================================================
    public String tomarSeleccionOpcion1() {
        return "¿Confirma que el contenido del bolsín es igual al registrado?";   // -> solicitarConfirmacionDocumentacion()
    }

    // =====================================================================
    // Pasos 10 a 12: el EB confirma
    // =====================================================================
    public String tomarConfirmacionDocumentacion() {
        fechaYHoraActual = getFechaYHoraActual();
        buscarEstadosParaAsignarBolsin();
        registrarRecepcionBolsin(bolsinSeleccionado);
        llamarcu29();
        int precinto = bolsinSeleccionado.getNroPrecinto();
        finDelCU();
        return "Se registró con éxito la recepción del bolsín con precinto N° " + precinto + ".";   // -> informarRecepcionExitosa()
    }

    public LocalDateTime getFechaYHoraActual() {
        return LocalDateTime.now();
    }

    // loop Estado Bolsin / loop estado Remito / loop estado Documentacion
    public void buscarEstadosParaAsignarBolsin() {
        for (Estado estado : estadoRepository.findAll()) {
            if (estado.esAmbitoBolsin() && estado.esRecibido()) {
                estadoRecibido = estado;
            }
            if (estado.esAmbitoRemito() && estado.esRecibidoYAceptado()) {
                estadoRecibidoYAceptado = estado;
            }
            if (estado.esAmbitoDocumentacion() && estado.esRecibidaYAceptada()) {
                estadoRecibidaYAceptada = estado;
            }
        }
    }

    // Mensaje a sí mismo registrarRecepcionBolsin() del diagrama de secuencia.
    // Es una sobrecarga (mismo nombre, distinto parámetro) del método que inicia el CU.
    private void registrarRecepcionBolsin(Bolsin bolsin) {
        bolsin.recibirBolsin(estadoRecibido, estadoRecibidoYAceptado, estadoRecibidaYAceptada,
                fechaYHoraActual, usuarioLogueado.getEmpleado());
        // Persistencia: guarda el bolsín y, en cascada, sus remitos, documentación y cambios de estado
        bolsinRepository.save(bolsin);
    }

    // <<include>> CU 29 Notificar recepción de bolsín (fuera del alcance: solo se deja el punto de extensión)
    public void llamarcu29() {
        System.out.println("[CU 29] Notificar recepción del bolsín " + bolsinSeleccionado.getNumeroBolsin()
                + " a la CM origen " + bolsinSeleccionado.getCMOrigen());
    }

    // Fin del caso de uso (también se usa si el EB cancela: flujo A6 / Observación 1)
    public void finDelCU() {
        bolsinSeleccionado = null;
    }

    public boolean hayBolsinSeleccionado() {
        return bolsinSeleccionado != null;
    }
}
