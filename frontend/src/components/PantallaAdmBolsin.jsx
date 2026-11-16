import { useState } from 'react';
import {
  Alert, AppBar, Box, Button, Card, CardContent, Chip, Container, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, List, ListItemButton,
  ListItemText, Radio, RadioGroup, Stack, Step, StepLabel, Stepper, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, Toolbar, Typography,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import * as api from '../services/bolsinService';

/**
 * PantallaAdmBolsin (boundary). Las funciones tienen los nombres de los métodos
 * de la pantalla en el diagrama de clases:
 *  - las que empiezan con "tomar" / "opcion" son mensajes del actor -> llaman al backend
 *  - las que empiezan con "mostrar" / "solicitar" / "informar" dibujan lo que devolvió el gestor
 */
const PASOS = ['Seleccionar bolsín', 'Controlar contenido', 'Confirmar recepción'];

export default function PantallaAdmBolsin() {
  // ---------------- Estado de la pantalla ----------------
  const [etapa, setEtapa] = useState('menu'); // menu | seleccion | contenido | fin
  const [comisionMedica, setComisionMedica] = useState('');
  const [listaBolsinesEnviados, setListaBolsinesEnviados] = useState([]);
  const [filtroPrecinto, setFiltroPrecinto] = useState('');
  const [filtroCmOrigen, setFiltroCmOrigen] = useState('');
  const [bolsinSeleccionado, setBolsinSeleccionado] = useState(null);
  const [remitos, setRemitos] = useState([]);
  const [opcionesRecepcion, setOpcionesRecepcion] = useState([]);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(''); // si tiene texto, el diálogo está abierto
  const [mensajeFinal, setMensajeFinal] = useState({ tipo: 'success', texto: '' });
  const [error, setError] = useState('');

  // =====================================================================
  // Mensajes del actor (EncargadoDeBolsines -> pantAdmBolsin)
  // =====================================================================

  // Paso 1
  const opcionRegistrarRecepcionBolsin = async () => {
    await habilitarVentana();
  };

  const habilitarVentana = async () => {
    setError('');
    setBolsinSeleccionado(null);
    setOpcionSeleccionada('');
    setFiltroPrecinto('');
    setFiltroCmOrigen('');
    try {
      const datos = await api.opcionRegistrarRecepcionBolsin();
      setComisionMedica(datos.comisionMedica);          // -> mostrarComisionMedica()
      setListaBolsinesEnviados(datos.bolsines);         // -> mostrarPrecintosYCmOrigenParaSeleccion()
      setEtapa('seleccion');
    } catch (e) {
      setError('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
    }
  };

  // Paso 5
  const tomarSeleccionDeBolsin = async () => {
    setError('');
    try {
      const datos = await api.tomarSeleccionDeBolsin(bolsinSeleccionado.numeroBolsin);
      setRemitos(datos.remitos);                        // -> mostrarNumeroRemito() / mostrarAsuntoYTipoDocumentacion()
      setOpcionesRecepcion(datos.opcionesRecepcion);    // -> mostrarOpcionesDeRecepcionDelBolsinParaSeleccion()
      setOpcionSeleccionada('');
      setEtapa('contenido');
    } catch (e) {
      setError('No se pudo obtener el contenido del bolsín seleccionado.');
    }
  };

  // Paso 8
  const tomarSeleccionOpcion1 = async () => {
    const datos = await api.tomarSeleccionOpcion1();
    solicitarConfirmacionDocumentacion(datos.mensaje);
  };

  // Paso 10
  const tomarConfirmacionDocumentacion = async () => {
    setMensajeConfirmacion('');
    const datos = await api.tomarConfirmacionDocumentacion();
    informarRecepcionExitosa(datos.mensaje);
  };

  // A6: el EB no confirma la selección
  const noConfirmar = async () => {
    setMensajeConfirmacion('');
    const datos = await api.cancelar();
    setMensajeFinal({ tipo: 'info', texto: datos.mensaje });
    setEtapa('fin');
  };

  // Observación 1: el EB cancela el CU cuando lo decide
  const cancelarCU = async () => {
    await api.cancelar();
    setEtapa('menu');
  };

  // =====================================================================
  // Mensajes del gestor a la pantalla (llegan como retorno de la API)
  // =====================================================================

  const solicitarConfirmacionDocumentacion = (mensaje) => {
    setMensajeConfirmacion(mensaje);
  };

  const informarRecepcionExitosa = (mensaje) => {
    setMensajeFinal({ tipo: 'success', texto: mensaje });
    setEtapa('fin');
  };

  // Filtro por número de precinto y/o CM origen (paso 4, flujos A1 y A2)
  const bolsinesFiltrados = listaBolsinesEnviados.filter((b) =>
    String(b.numeroPrecinto).includes(filtroPrecinto.trim()) &&
    b.cmOrigen.toLowerCase().includes(filtroCmOrigen.trim().toLowerCase())
  );

  const mostrarComisionMedica = () => (
    <Chip color="primary" variant="outlined" label={`CM del usuario: ${comisionMedica}`} />
  );

  const mostrarPrecintosYCmOrigenParaSeleccion = () => (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>Bolsines enviados a su comisión médica</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Filtrar por N° de precinto" size="small" value={filtroPrecinto}
            onChange={(e) => { setFiltroPrecinto(e.target.value); setBolsinSeleccionado(null); }} />
          <TextField label="Filtrar por CM origen" size="small" value={filtroCmOrigen}
            onChange={(e) => { setFiltroCmOrigen(e.target.value); setBolsinSeleccionado(null); }} />
        </Stack>

        {listaBolsinesEnviados.length === 0 && (
          <Alert severity="info">No hay bolsines en estado Enviado para su comisión médica.</Alert>
        )}
        {listaBolsinesEnviados.length > 0 && bolsinesFiltrados.length === 0 && filtroPrecinto && (
          <Alert severity="warning">No se encuentra bolsín con el número de precinto ingresado.</Alert>
        )}
        {listaBolsinesEnviados.length > 0 && bolsinesFiltrados.length === 0 && !filtroPrecinto && filtroCmOrigen && (
          <Alert severity="warning">No se encuentra bolsín con la CM de origen ingresada.</Alert>
        )}

        {/* listaBolsinesEnviados: listado de selección ÚNICA (sugerencia del tutor) */}
        <List sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 0 }}>
          {bolsinesFiltrados.map((b) => (
            <ListItemButton key={b.numeroBolsin} divider
              selected={bolsinSeleccionado?.numeroBolsin === b.numeroBolsin}
              onClick={() => setBolsinSeleccionado(b)}>
              <LocalShippingIcon sx={{ mr: 2, color: 'primary.main' }} />
              <ListItemText primary={`Precinto N° ${b.numeroPrecinto}`} secondary={`Origen: ${b.cmOrigen}`} />
            </ListItemButton>
          ))}
        </List>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button onClick={cancelarCU}>Cancelar</Button>
          <Button variant="contained" disabled={!bolsinSeleccionado} onClick={tomarSeleccionDeBolsin}>
            Ver contenido
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  const mostrarNumeroRemito = (remito) => (
    <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>Remito N° {remito.numeroRemito}</Typography>
  );

  const mostrarAsuntoYTipoDocumentacion = (remito) => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Asunto</TableCell>
          <TableCell>Tipo de documentación</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {remito.documentacion.map((d, i) => (
          <TableRow key={i}>
            <TableCell>{d.asunto}</TableCell>
            <TableCell>{d.tipoDocumentacion}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const mostrarOpcionesDeRecepcionDelBolsinParaSeleccion = () => (
    <>
      <Typography variant="h6" sx={{ mt: 3 }}>¿Cómo se recibió el bolsín?</Typography>
      <RadioGroup value={opcionSeleccionada} onChange={(e) => setOpcionSeleccionada(e.target.value)}>
        {opcionesRecepcion.map((texto, i) => (
          <FormControlLabel key={i} value={String(i + 1)} control={<Radio />} label={texto} />
        ))}
      </RadioGroup>
      {opcionSeleccionada && opcionSeleccionada !== '1' && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          Esta situación corresponde a los flujos alternativos A3, A4 y A5, que quedan fuera del alcance de esta implementación.
        </Alert>
      )}
    </>
  );

  // =====================================================================
  // Dibujo de la pantalla
  // =====================================================================
  const pasoActivo = etapa === 'seleccion' ? 0 : etapa === 'contenido' ? 1 : 3;

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Gestión de Bolsines</Typography>
          <Typography variant="body2">Usuario: lgomez (Encargada de Bolsines)</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {etapa === 'menu' && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>Menú principal</Typography>
              <Button variant="contained" size="large" startIcon={<LocalShippingIcon />}
                onClick={opcionRegistrarRecepcionBolsin}>
                Registrar recepción de bolsín
              </Button>
            </CardContent>
          </Card>
        )}

        {etapa !== 'menu' && (
          <>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h5">Registrar recepción de bolsín</Typography>
              {mostrarComisionMedica()}
            </Stack>
            <Stepper activeStep={pasoActivo} sx={{ mb: 3 }}>
              {PASOS.map((p) => <Step key={p}><StepLabel>{p}</StepLabel></Step>)}
            </Stepper>
          </>
        )}

        {etapa === 'seleccion' && mostrarPrecintosYCmOrigenParaSeleccion()}

        {etapa === 'contenido' && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">
                Bolsín con precinto N° {bolsinSeleccionado.numeroPrecinto} — Origen: {bolsinSeleccionado.cmOrigen}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Controle que el contenido físico coincida con lo registrado.
              </Typography>
              {remitos.map((r) => (
                <Box key={r.numeroRemito}>
                  {mostrarNumeroRemito(r)}
                  {mostrarAsuntoYTipoDocumentacion(r)}
                </Box>
              ))}
              <Divider sx={{ mt: 3 }} />
              {mostrarOpcionesDeRecepcionDelBolsinParaSeleccion()}
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button onClick={cancelarCU}>Cancelar</Button>
                <Button onClick={() => setEtapa('seleccion')}>Volver</Button>
                <Button variant="contained" disabled={opcionSeleccionada !== '1'} onClick={tomarSeleccionOpcion1}>
                  Registrar recepción
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {etapa === 'fin' && (
          <Card variant="outlined">
            <CardContent>
              <Alert severity={mensajeFinal.tipo} icon={mensajeFinal.tipo === 'success' ? <CheckCircleIcon /> : undefined}>
                {mensajeFinal.texto}
              </Alert>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button onClick={() => setEtapa('menu')}>Volver al menú</Button>
                <Button variant="contained" onClick={opcionRegistrarRecepcionBolsin}>Registrar otro bolsín</Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* solicitarConfirmacionDocumentacion(): diálogo de confirmación (paso 9) */}
      <Dialog open={mensajeConfirmacion !== ''} onClose={noConfirmar}>
        <DialogTitle>Confirmar recepción</DialogTitle>
        <DialogContent>
          <DialogContentText>{mensajeConfirmacion}</DialogContentText>
          <DialogContentText sx={{ mt: 1 }}>
            El bolsín pasará a "Recibido en CM Destino", sus remitos a "Recibido y Aceptado" y la documentación a "Recibida y Aceptada".
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={noConfirmar}>No confirmar</Button>
          <Button variant="contained" onClick={tomarConfirmacionDocumentacion}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
