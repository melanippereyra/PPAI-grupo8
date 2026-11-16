package com.dsi.bolsines.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "detalles_remito")
public class DetalleRemito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "area_cmc_destino")
    private String areaCMCDestino;

    // DetalleRemito -> Documentacion (1)
    @ManyToOne(fetch = FetchType.EAGER, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "documentacion_numero")
    private Documentacion documentacion;

    protected DetalleRemito() {
    }

    public DetalleRemito(Documentacion documentacion, String areaCMCDestino) {
        this.documentacion = documentacion;
        this.areaCMCDestino = areaCMCDestino;
    }

    // Devuelve { asunto, tipoDocumentacion } de la documentación del detalle
    public String[] mostrarDatosDocumentacion() {
        return new String[] { documentacion.getAsunto(), documentacion.getTipoDocumentacion() };
    }

    public void aceptarDocumentacion(Estado estadoRecibidaYAceptada, LocalDateTime fechaHoraActual, Empleado responsable) {
        documentacion.aceptar(estadoRecibidaYAceptada, fechaHoraActual, responsable);
    }

    public Documentacion getDocumentacion() {
        return documentacion;
    }
}
