import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, IconButton, InputAdornment, Radio, Stack, TextField, Typography,
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { IlustracionCamion, Tarjeta } from './Layout';
import * as api from '../services/bolsinService';

/**
 * PantallaAdmBolsin (boundary del CU 28).
 *
 * Atributos del diagrama de clases -> elementos de la pantalla (tienen el mismo id):
 *   btnRegistrarRecepcionBolsin, listaBolsinesEnviados, btnConfirmacionSeleccion,
 *   labelsBolsines y btnConfirmacionDocumentacion.
 *
 * Métodos del diagrama -> funciones con el mismo nombre:
 *   - opcion... / tomar...  : mensajes del actor, llaman al backend
 *   - mostrar... / solicitar... / informar... : dibujan lo que devolvió el gestor
 */
const PASOS = ['Seleccionar bolsín', 'Controlar contenido', 'Confirmar recepción'];

const plural = (n, singular, pluralTxt) => `${n} ${n === 1 ? singular : pluralTxt}`;

export default function PantallaAdmBolsin({ menu, errorMenu, cargarMenu }) {
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
  const [resultado, setResultado] = useState({ exito: true, texto: '' });
  const [error, setError] = useState('');

  const cantidadDocumentos = remitos.reduce((total, r) => total + r.documentacion.length, 0);
  const numerosRemitos = remitos.map((r) => r.numeroRemito);

  // =====================================================================
  // Mensajes del actor (EncargadoDeBolsines -> pantAdmBolsin)
  // =====================================================================

  // Paso 1: el EB elige la opción en el menú (btnRegistrarRecepcionBolsin)
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

  // Paso 5: el EB selecciona un bolsín del listado (btnConfirmacionSeleccion o doble clic)
  const tomarSeleccionDeBolsin = async (bolsin = bolsinSeleccionado) => {
    setError('');
    try {
      const datos = await api.tomarSeleccionDeBolsin(bolsin.numeroBolsin);
      setBolsinSeleccionado(bolsin);
      setRemitos(datos.remitos);                        // -> mostrarNumeroRemito() / mostrarAsuntoYTipoDocumentacion()
      setOpcionesRecepcion(datos.opcionesRecepcion);    // -> mostrarOpcionesDeRecepcionDelBolsinParaSeleccion()
      setOpcionSeleccionada('');
      setEtapa('contenido');
    } catch (e) {
      setError('No se pudo obtener el contenido del bolsín seleccionado.');
    }
  };

  // Paso 8: el EB elige la opción 1 y pulsa "Registrar recepción"
  const tomarSeleccionOpcion1 = async () => {
    const datos = await api.tomarSeleccionOpcion1();
    solicitarConfirmacionDocumentacion(datos.mensaje);
  };

  // Paso 10: el EB confirma (btnConfirmacionDocumentacion)
  const tomarConfirmacionDocumentacion = async () => {
    setMensajeConfirmacion('');
    const datos = await api.tomarConfirmacionDocumentacion();
    informarRecepcionExitosa(datos.mensaje);
  };

  // A6: el EB no confirma la selección
  const noConfirmar = async () => {
    setMensajeConfirmacion('');
    const datos = await api.cancelar();
    setResultado({ exito: false, texto: datos.mensaje });
    setEtapa('fin');
  };

  // Observación 1: el EB cancela el CU cuando lo decide
  const cancelarCU = async () => {
    await api.cancelar();
    volverAlMenu();
  };

  const volverAlMenu = () => {
    setEtapa('menu');
    cargarMenu();
  };

  // Atajos del diálogo de confirmación: Enter confirma, Esc no confirma
  useEffect(() => {
    if (!mensajeConfirmacion) return undefined;
    const alPresionar = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); tomarConfirmacionDocumentacion(); }
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [mensajeConfirmacion]);

  // =====================================================================
  // Mensajes del gestor a la pantalla (llegan como retorno de la API)
  // =====================================================================

  const solicitarConfirmacionDocumentacion = (mensaje) => {
    setMensajeConfirmacion(mensaje);
  };

  const informarRecepcionExitosa = (mensaje) => {
    setResultado({ exito: true, texto: mensaje });
    setEtapa('fin');
  };

  // Filtro por número de precinto y/o CM origen (paso 4, flujos A1 y A2)
  const bolsinesFiltrados = listaBolsinesEnviados.filter((b) =>
    String(b.numeroPrecinto).includes(filtroPrecinto.trim()) &&
    b.cmOrigen.toLowerCase().includes(filtroCmOrigen.trim().toLowerCase())
  );

  const limpiarFiltros = () => { setFiltroPrecinto(''); setFiltroCmOrigen(''); };

  const mostrarComisionMedica = () => (
    <Chip icon={<PlaceOutlinedIcon />} label={`CM del usuario: ${comisionMedica}`} variant="outlined"
      sx={{ bgcolor: '#fff', borderColor: 'divider', height: 38, px: 1, fontWeight: 500, fontSize: 14 }} />
  );

  const campoFiltro = (id, valor, setValor, placeholder, icono) => (
    <TextField id={id} fullWidth value={valor} placeholder={placeholder}
      onChange={(e) => { setValor(e.target.value); setBolsinSeleccionado(null); }}
      InputProps={{
        sx: { borderRadius: 2.5, bgcolor: '#fff', height: 50 },
        startAdornment: <InputAdornment position="start">{icono}</InputAdornment>,
        endAdornment: valor && (
          <InputAdornment position="end">
            <IconButton size="small" aria-label="Limpiar" onClick={() => setValor('')} sx={{ bgcolor: '#eef2f7' }}>
              <CloseRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </InputAdornment>
        ),
      }} />
  );

  const mostrarPrecintosYCmOrigenParaSeleccion = () => {
    const hayFiltro = filtroPrecinto.trim() || filtroCmOrigen.trim();
    const total = listaBolsinesEnviados.length;
    return (
      <Tarjeta sx={{ p: { xs: 2.5, md: 4 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 20 }}>Bolsines enviados a su comisión médica</Typography>
          <Chip size="small" label={hayFiltro ? `${bolsinesFiltrados.length} de ${total}` : total}
            sx={{ bgcolor: '#eef2f7', fontWeight: 600, color: 'text.secondary' }} />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2.5 }}>
          {campoFiltro('filtroPrecinto', filtroPrecinto, setFiltroPrecinto, 'Filtrar por N° de precinto', <SearchRoundedIcon />)}
          {campoFiltro('filtroCmOrigen', filtroCmOrigen, setFiltroCmOrigen, 'Filtrar por CM origen', <LocalOfferOutlinedIcon />)}
        </Stack>

        {total === 0 && (
          <Alert severity="info">No hay bolsines en estado Enviado para su comisión médica.</Alert>
        )}

        {total > 0 && bolsinesFiltrados.length === 0 && (
          <Box sx={{ border: '1.5px dashed', borderColor: 'divider', borderRadius: 4, py: 5, px: 2, textAlign: 'center' }}>
            <Box sx={{ width: 70, height: 70, borderRadius: '50%', bgcolor: '#eef2f7', display: 'grid', placeItems: 'center', mx: 'auto', mb: 2 }}>
              <SearchOffRoundedIcon sx={{ color: 'text.secondary', fontSize: 30 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
              {filtroPrecinto.trim()
                ? 'No se encuentra bolsín con el número de precinto ingresado'   // A1
                : 'No se encuentra bolsín con la CM de origen ingresada'}        {/* A2 */}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.5, mb: 2.5 }}>
              {filtroPrecinto.trim()
                ? 'Verificá el número impreso en el precinto o limpiá el filtro para ver todos los bolsines.'
                : 'Verificá el nombre de la comisión médica de origen o limpiá el filtro para ver todos los bolsines.'}
            </Typography>
            <Button onClick={limpiarFiltros} sx={{ bgcolor: 'primary.light' }}>Limpiar filtro</Button>
          </Box>
        )}

        {/* listaBolsinesEnviados: listado de selección ÚNICA (sugerencia del tutor) */}
        <Stack id="listaBolsinesEnviados" role="radiogroup" aria-label="Bolsines enviados" spacing={1.5}>
          {bolsinesFiltrados.map((b) => {
            const elegido = bolsinSeleccionado?.numeroBolsin === b.numeroBolsin;
            return (
              <Box key={b.numeroBolsin} role="radio" aria-checked={elegido} tabIndex={0}
                onClick={() => setBolsinSeleccionado(b)}
                onDoubleClick={() => tomarSeleccionDeBolsin(b)}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setBolsinSeleccionado(b); } }}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 2, p: 2.25, cursor: 'pointer', borderRadius: 3,
                  border: '1.5px solid', borderColor: elegido ? 'primary.main' : 'divider',
                  bgcolor: elegido ? '#f3f8fd' : '#fff', transition: 'all .15s',
                  '&:hover': { borderColor: 'primary.main' },
                  '&:focus-visible': { outline: '3px solid #b9d6f3' },
                }}>
                <Box sx={{ width: 52, height: 52, borderRadius: 2.5, bgcolor: '#eef3f9', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <LocalShippingOutlinedIcon sx={{ color: 'primary.main' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Precinto N° {b.numeroPrecinto}</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
                    <PlaceOutlinedIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 14.5 }}>Origen: {b.cmOrigen}</Typography>
                  </Stack>
                </Box>
                <Radio checked={elegido} tabIndex={-1} inputProps={{ 'aria-hidden': true }} />
              </Box>
            );
          })}
        </Stack>

        {bolsinesFiltrados.length > 0 && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2.5, bgcolor: '#f1f4f8', borderRadius: 2.5, px: 2, py: 1.5, color: 'text.secondary' }}>
            <InfoOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography sx={{ fontSize: 14.5 }}>
              Elegí el bolsín que llegó físicamente. Atajo: <Box component="kbd" sx={kbd}>doble clic</Box> sobre un bolsín para ver su contenido directamente.
            </Typography>
          </Stack>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button onClick={cancelarCU}>Cancelar</Button>
          <Button id="btnConfirmacionSeleccion" variant="contained" size="large" disabled={!bolsinSeleccionado}
            endIcon={<ArrowForwardRoundedIcon />} onClick={() => tomarSeleccionDeBolsin()}>
            Ver contenido
          </Button>
        </Stack>
      </Tarjeta>
    );
  };

  const mostrarNumeroRemito = (remito) => (
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ px: 2.25, py: 1.75, bgcolor: '#f7f9fc', borderBottom: '1px solid', borderColor: 'divider' }}>
      <DescriptionOutlinedIcon sx={{ fontSize: 20, color: 'primary.main' }} />
      <Typography sx={{ fontWeight: 700, flex: 1 }}>Remito N° {remito.numeroRemito}</Typography>
      <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
        {plural(remito.documentacion.length, 'documento', 'documentos')}
      </Typography>
    </Stack>
  );

  const mostrarAsuntoYTipoDocumentacion = (remito) => (
    <Box>
      {remito.documentacion.map((d, i) => (
        <Stack key={i} direction="row" alignItems="center" spacing={1.5}
          sx={{ px: 2.25, py: 1.75, borderTop: i ? '1px solid' : 'none', borderColor: 'divider' }}>
          <Typography sx={{ flex: 1, fontSize: 15.5 }}>{d.asunto}</Typography>
          <Chip size="small" label={d.tipoDocumentacion} sx={{ bgcolor: '#eef2f7', fontWeight: 600, color: '#3b4b63' }} />
        </Stack>
      ))}
    </Box>
  );

  const mostrarOpcionesDeRecepcionDelBolsinParaSeleccion = () => (
    <>
      <Typography sx={{ fontWeight: 700, fontSize: 20, mt: 4, mb: 2 }}>¿Cómo se recibió el bolsín?</Typography>
      <Box role="radiogroup" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        {opcionesRecepcion.map((texto, i) => {
          const valor = String(i + 1);
          const elegida = opcionSeleccionada === valor;
          return (
            <Box key={valor} component="label"
              sx={{
                display: 'flex', alignItems: 'flex-start', gap: 1, p: 1.5, pr: 2.5, borderRadius: 3, cursor: 'pointer',
                border: '1.5px solid', borderColor: elegida ? 'primary.main' : 'divider',
                bgcolor: elegida ? '#f3f8fd' : '#fff', minHeight: 72,
                '&:hover': { borderColor: 'primary.main' },
              }}>
              <Radio checked={elegida} value={valor} name="opcionRecepcion"
                onChange={(e) => setOpcionSeleccionada(e.target.value)} sx={{ mt: -0.5 }} />
              <Typography sx={{ fontSize: 15.5, pt: 0.5 }}>{texto}</Typography>
            </Box>
          );
        })}
      </Box>
      {opcionSeleccionada && opcionSeleccionada !== '1' && (
        <Stack direction="row" spacing={1.5} sx={{
          mt: 2, p: 2.25, borderRadius: 3, bgcolor: 'warning.light', border: '1px solid #f1d98b', borderLeft: '5px solid #e0b23a',
        }}>
          <WarningAmberRoundedIcon sx={{ color: '#b7860b' }} />
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#4a3a07' }}>Esta situación no se puede registrar desde esta pantalla</Typography>
            <Typography sx={{ color: '#5c4a0f', fontSize: 15 }}>
              Corresponde a los flujos alternativos A3, A4 y A5, que quedan fuera del alcance de esta implementación.
              Si el contenido coincide con lo registrado, elegí la primera opción.
            </Typography>
          </Box>
        </Stack>
      )}
    </>
  );

  const contenidoDelBolsin = () => (
    <Tarjeta>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={2.5}
        sx={{ p: { xs: 2.5, md: 4 }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ bgcolor: '#eef2f7', borderRadius: 3, px: 2.25, py: 1.25, textAlign: 'center', alignSelf: 'flex-start' }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: 'text.secondary' }}>PRECINTO</Typography>
          <Typography sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>{bolsinSeleccionado.numeroPrecinto}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 20 }}>Origen: {bolsinSeleccionado.cmOrigen}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>Controle que el contenido físico coincida con lo registrado.</Typography>
        </Box>
        <Typography sx={{ color: 'text.secondary', fontSize: 15 }}>
          {plural(remitos.length, 'remito', 'remitos')} · {plural(cantidadDocumentos, 'documento', 'documentos')}
        </Typography>
      </Stack>

      <Box sx={{ p: { xs: 2.5, md: 4 } }}>
        {/* labelsBolsines: los datos del bolsín seleccionado (remitos y su documentación) */}
        <Box id="labelsBolsines" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {remitos.map((r) => (
            <Box key={r.numeroRemito} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
              {mostrarNumeroRemito(r)}
              {mostrarAsuntoYTipoDocumentacion(r)}
            </Box>
          ))}
        </Box>

        {mostrarOpcionesDeRecepcionDelBolsinParaSeleccion()}

        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} spacing={2} sx={{ mt: 3.5 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1, color: 'text.secondary' }}>
            <InfoOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography sx={{ fontSize: 14.5 }}>Compará cada documento con lo que hay en el bolsín.</Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button onClick={cancelarCU}>Cancelar</Button>
            <Button startIcon={<ArrowBackRoundedIcon />} sx={{ bgcolor: 'primary.light' }} onClick={() => setEtapa('seleccion')}>
              Volver
            </Button>
            <Button variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />}
              disabled={opcionSeleccionada !== '1'} onClick={tomarSeleccionOpcion1}>
              Registrar recepción
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Tarjeta>
  );

  const pantallaFinal = () => (
    <Tarjeta sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
      <Box sx={{
        width: 128, height: 128, borderRadius: '50%', mx: 'auto', mb: 3, display: 'grid', placeItems: 'center',
        bgcolor: resultado.exito ? '#e3f4ec' : '#eef2f7',
      }}>
        <Box sx={{
          width: 106, height: 106, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#fff',
          bgcolor: resultado.exito ? 'success.main' : '#8a9ab0',
        }}>
          {resultado.exito ? <CheckRoundedIcon sx={{ fontSize: 56 }} /> : <CancelOutlinedIcon sx={{ fontSize: 52 }} />}
        </Box>
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: { xs: 24, md: 30 } }}>
        {resultado.exito ? '¡Recepción registrada con éxito!' : 'Registro cancelado'}
      </Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1, fontSize: 17 }}>{resultado.texto}</Typography>

      {resultado.exito && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mt: 4, textAlign: 'left' }}>
          {[
            ['BOLSÍN', `N° ${bolsinSeleccionado?.numeroPrecinto}`, 'Recibido en CM Destino'],
            ['REMITOS', numerosRemitos.join(' · '), 'Recibido y Aceptado'],
            ['DOCUMENTACIÓN', plural(cantidadDocumentos, 'documento', 'documentos'), 'Recibida y Aceptada'],
          ].map(([titulo, valor, estado]) => (
            <Box key={titulo} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.25, bgcolor: '#f9fbfd' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: 'text.secondary' }}>{titulo}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 17, my: 0.25 }}>{valor}</Typography>
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: 'success.main' }}>
                <CheckRoundedIcon sx={{ fontSize: 17 }} />
                <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{estado}</Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      )}

      <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 4 }}>
        <Button size="large" sx={{ bgcolor: 'primary.light' }} onClick={volverAlMenu}>Volver al menú</Button>
        <Button size="large" variant="contained" startIcon={<LocalShippingOutlinedIcon />} onClick={opcionRegistrarRecepcionBolsin}>
          Registrar otro bolsín
        </Button>
      </Stack>
    </Tarjeta>
  );

  // =====================================================================
  // Dibujo de la pantalla
  // =====================================================================
  // Si el EB no confirma (A6), el paso 3 queda sin completar
  const pasoActivo = etapa === 'seleccion' ? 0
    : etapa === 'contenido' ? (mensajeConfirmacion ? 2 : 1)
    : resultado.exito ? 3 : 2;

  if (etapa === 'menu') {
    return (
      <MenuPrincipal menu={menu} error={error || errorMenu}
        opcionRegistrarRecepcionBolsin={opcionRegistrarRecepcionBolsin} />
    );
  }

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography sx={sobretitulo}>RECEPCIÓN</Typography>
          <Typography component="h1" sx={{ fontWeight: 700, fontSize: { xs: 26, md: 33 }, letterSpacing: -0.5 }}>
            Registrar recepción de bolsín
          </Typography>
        </Box>
        <Box>{mostrarComisionMedica()}</Box>
      </Stack>

      <Pasos activo={pasoActivo} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {etapa === 'seleccion' && mostrarPrecintosYCmOrigenParaSeleccion()}
      {etapa === 'contenido' && contenidoDelBolsin()}
      {etapa === 'fin' && pantallaFinal()}

      {/* solicitarConfirmacionDocumentacion(): diálogo de confirmación (paso 9) */}
      <Dialog open={mensajeConfirmacion !== ''} onClose={noConfirmar} maxWidth="xs" fullWidth
        BackdropProps={{ sx: { backdropFilter: 'blur(6px)', bgcolor: 'rgba(15,59,102,.35)' } }}
        PaperProps={{ sx: { borderRadius: 5, p: { xs: 2.5, sm: 4 }, textAlign: 'center', maxWidth: 580 } }}>
        <Box sx={{ width: 76, height: 76, borderRadius: '50%', bgcolor: '#eef2f7', display: 'grid', placeItems: 'center', mx: 'auto', mb: 2 }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 32, color: 'primary.dark' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 24 }}>Confirmar recepción</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, mb: 2.5 }}>{mensajeConfirmacion}</Typography>
        <Stack spacing={1.25} sx={{ textAlign: 'left' }}>
          {[
            [`Bolsín ${bolsinSeleccionado?.numeroPrecinto}`, 'Recibido en CM Destino'],
            [`${numerosRemitos.length === 1 ? 'Remito' : 'Remitos'} ${unirConY(numerosRemitos)}`, 'Recibido y Aceptado'],
            [`Documentación (${cantidadDocumentos})`, 'Recibida y Aceptada'],
          ].map(([que, estado]) => (
            <Stack key={que} direction="row" alignItems="center" sx={{ bgcolor: '#f5f7fa', borderRadius: 2, px: 2, py: 1.25 }}>
              <Typography sx={{ flex: 1, fontWeight: 500 }}>{que}</Typography>
              <ArrowForwardRoundedIcon sx={{ fontSize: 18, color: 'primary.main', mr: 1 }} />
              <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>{estado}</Typography>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 3.5 }}>
          <Button size="large" sx={{ bgcolor: 'primary.light' }} onClick={noConfirmar}>No confirmar</Button>
          <Button id="btnConfirmacionDocumentacion" size="large" variant="contained" startIcon={<CheckRoundedIcon />}
            onClick={tomarConfirmacionDocumentacion}>
            Confirmar
          </Button>
        </Stack>
        <Typography sx={{ color: 'text.secondary', fontSize: 13.5, mt: 2 }}>
          <Box component="kbd" sx={kbd}>Esc</Box> no confirmar &nbsp;&nbsp; <Box component="kbd" sx={kbd}>Enter</Box> confirmar
        </Typography>
      </Dialog>
    </>
  );
}

// ---------------------------------------------------------------------
// Componentes visuales de apoyo
// ---------------------------------------------------------------------

const sobretitulo = { fontSize: 13, fontWeight: 700, letterSpacing: 1.6, color: 'text.secondary', mb: 0.5 };

const kbd = {
  display: 'inline-block', border: '1px solid #cfd8e3', borderRadius: 1, px: 0.75, mx: 0.5,
  fontFamily: 'inherit', fontSize: 13, fontWeight: 600, bgcolor: '#fff', color: 'text.primary',
};

const unirConY = (lista) => (lista.length <= 1 ? lista.join('') : `${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}`);

function Pasos({ activo }) {
  return (
    <Tarjeta sx={{ px: { xs: 2, md: 3 }, py: 2.25, mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 2 }}>
        {PASOS.map((paso, i) => {
          const hecho = i < activo;
          const actual = i === activo;
          return (
            <Stack key={paso} direction="row" alignItems="center" spacing={{ xs: 1, md: 2 }} sx={{ flex: i < PASOS.length - 1 ? 1 : 'none' }}>
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <Box sx={{
                  width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0,
                  fontWeight: 700, fontSize: 14,
                  bgcolor: hecho || actual ? 'primary.main' : '#eef2f7',
                  color: hecho || actual ? '#fff' : 'text.secondary',
                  boxShadow: actual ? '0 0 0 4px #dbe9f7' : 'none',
                }}>
                  {hecho ? <CheckRoundedIcon sx={{ fontSize: 18 }} /> : i + 1}
                </Box>
                <Typography sx={{
                  fontWeight: 600, fontSize: 15.5, whiteSpace: 'nowrap', display: { xs: actual ? 'block' : 'none', sm: 'block' },
                  color: hecho ? 'primary.main' : actual ? 'text.primary' : 'text.secondary',
                }}>
                  {paso}
                </Typography>
              </Stack>
              {i < PASOS.length - 1 && (
                <Box sx={{ flex: 1, height: 3, borderRadius: 2, bgcolor: hecho ? 'primary.main' : '#e7edf4' }} />
              )}
            </Stack>
          );
        })}
      </Stack>
    </Tarjeta>
  );
}

function MenuPrincipal({ menu, error, opcionRegistrarRecepcionBolsin }) {
  const pendientes = menu?.bolsinesPorRecibir ?? [];
  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <Tarjeta sx={{ p: { xs: 3, md: 5.5 }, display: 'flex', alignItems: 'center', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={sobretitulo}>MENÚ PRINCIPAL</Typography>
          <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: 28, md: 38 }, lineHeight: 1.2, letterSpacing: -0.5 }}>
            ¡Hola{menu ? `, ${menu.nombreUsuario}` : ''}!<br />
            {!menu
              ? 'Bienvenida al sistema.'
              : pendientes.length === 0
              ? 'No tenés bolsines por recibir.'
              : <>Tenés <Box component="span" sx={{ color: 'primary.main' }}>{plural(pendientes.length, 'bolsín', 'bolsines')}</Box> por recibir.</>}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 2, fontSize: 17, maxWidth: 500 }}>
            {menu ? `${menu.comisionMedica} · ` : ''}Controlá el contenido de cada bolsín y registrá su recepción en pocos pasos.
          </Typography>
        </Box>
        <IlustracionCamion />
      </Tarjeta>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' }, gap: 3 }}>
        <Box sx={{ bgcolor: 'primary.dark', color: '#fff', borderRadius: 4, p: { xs: 3, md: 3.5 } }}>
          <Box sx={{ width: 58, height: 58, borderRadius: 2.5, bgcolor: 'rgba(255,255,255,.12)', display: 'grid', placeItems: 'center', mb: 2.5 }}>
            <LocalShippingOutlinedIcon />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 22 }}>Registrar recepción de bolsín</Typography>
          <Typography sx={{ opacity: 0.9, mt: 1, mb: 3, maxWidth: 500 }}>
            Seleccioná un bolsín enviado a tu comisión, controlá sus remitos y confirmá la recepción.
          </Typography>
          {/* btnRegistrarRecepcionBolsin (paso 1 del CU) */}
          <Button id="btnRegistrarRecepcionBolsin" size="large" endIcon={<ArrowForwardRoundedIcon />}
            onClick={opcionRegistrarRecepcionBolsin}
            sx={{ bgcolor: '#fff', color: 'primary.dark', '&:hover': { bgcolor: '#e8f1fb' } }}>
            Comenzar
          </Button>
        </Box>

        <Tarjeta sx={{ p: { xs: 3, md: 3.5 } }}>
          <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 1.5 }}>Pendientes de recepción</Typography>
          {pendientes.length === 0 && (
            <Typography sx={{ color: 'text.secondary' }}>No hay bolsines enviados a tu comisión.</Typography>
          )}
          {pendientes.map((b, i) => (
            <Stack key={b.numeroBolsin} direction="row" alignItems="center" spacing={1.5}
              sx={{ py: 1.4, borderTop: i ? '1px solid' : 'none', borderColor: 'divider' }}>
              <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#b8c4d4' }} />
              <Typography sx={{ fontWeight: 700, flex: 1 }}>N° {b.numeroPrecinto}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14.5 }}>{b.cmOrigen.replace('Comisión Médica', 'CM')}</Typography>
            </Stack>
          ))}
        </Tarjeta>
      </Box>
    </Stack>
  );
}
