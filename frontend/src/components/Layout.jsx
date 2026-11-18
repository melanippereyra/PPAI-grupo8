import { useState } from 'react';
import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

// Piezas visuales que se repiten en todas las pantallas (no tienen lógica del CU).

export function Encabezado({ menu }) {
  const [ayudaAbierta, setAyudaAbierta] = useState(false);
  const iniciales = menu
    ? menu.nombreEmpleado.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : '··';

  return (
    <Box component="header" sx={{ bgcolor: 'primary.dark', color: '#fff' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ px: { xs: 2, md: 5.5 }, py: 2 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: 2.5, bgcolor: '#f8c94a', color: 'primary.dark',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <ShoppingBagOutlinedIcon />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 22 }, lineHeight: 1.2 }}>Gestión de Bolsines</Typography>
          <Typography sx={{ fontSize: 13, opacity: 0.85 }} noWrap>Correo Nacional · Comisiones Médicas</Typography>
        </Box>
        <Button onClick={() => setAyudaAbierta(true)} startIcon={<HelpOutlineRoundedIcon />}
          sx={{
            color: '#fff', border: '1px solid rgba(255,255,255,.25)', borderRadius: 99,
            display: { xs: 'none', sm: 'inline-flex' },
          }}>
          Ayuda
        </Button>
        <Stack direction="row" alignItems="center" spacing={1.5}
          sx={{ border: '1px solid rgba(255,255,255,.25)', borderRadius: 99, pl: 0.75, pr: 2.5, py: 0.75 }}>
          <Avatar sx={{ bgcolor: '#fff', color: 'primary.dark', width: 38, height: 38, fontSize: 15, fontWeight: 700 }}>
            {iniciales}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ fontWeight: 600, fontSize: 15, lineHeight: 1.2 }}>{menu?.nombreUsuario ?? '...'}</Typography>
            <Typography sx={{ fontSize: 13, opacity: 0.8 }}>Encargada de Bolsines</Typography>
          </Box>
        </Stack>
      </Stack>

      <Dialog open={ayudaAbierta} onClose={() => setAyudaAbierta(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>¿Cómo registro la recepción?</DialogTitle>
        <DialogContent>
          <Typography component="ol" sx={{ pl: 2.5, m: 0, '& li': { mb: 1 } }}>
            <li>En el menú, elegí <b>Registrar recepción de bolsín</b>.</li>
            <li>Buscá el bolsín por el número de precinto o por la CM de origen y seleccionalo.</li>
            <li>Compará los remitos y la documentación con lo que llegó.</li>
            <li>Si coincide, elegí <b>El contenido del bolsín es igual al registrado</b> y confirmá.</li>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="contained" onClick={() => setAyudaAbierta(false)}>Entendido</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export function Pie() {
  return (
    <Typography component="footer" align="center" sx={{ color: 'text.secondary', fontSize: 13, py: 3 }}>
      DSI 2026 · UTN FRC · Grupo 8
    </Typography>
  );
}

// Tarjeta blanca con borde suave (la usan todas las secciones)
export function Tarjeta({ children, sx }) {
  return (
    <Box sx={{
      bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 4,
      boxShadow: '0 1px 3px rgba(16,36,62,.04)', ...sx,
    }}>
      {children}
    </Box>
  );
}

// Ilustración del camión del menú principal (SVG propio, sin imágenes externas)
export function IlustracionCamion() {
  return (
    <Box component="svg" viewBox="0 0 300 200" sx={{ width: { xs: 220, md: 300 }, height: 'auto' }} aria-hidden="true">
      <ellipse cx="145" cy="172" rx="145" ry="12" fill="#d6e7f8" />
      <g transform="rotate(10 225 40)">
        <rect x="180" y="8" width="84" height="58" rx="6" fill="#fff" stroke="#a9c3df" strokeWidth="3" />
        <path d="M184 14 L222 44 L260 14" fill="none" stroke="#a9c3df" strokeWidth="3" />
      </g>
      <rect x="0" y="66" width="168" height="98" rx="8" fill="#1f6fbf" />
      <rect x="0" y="66" width="168" height="28" rx="8" fill="#0f3b66" />
      <rect x="16" y="110" width="78" height="12" rx="6" fill="#9ccaf4" />
      <rect x="16" y="130" width="50" height="9" rx="4.5" fill="#9ccaf4" />
      <path d="M168 90 H226 L258 120 V164 H168 Z" fill="#2e86d6" />
      <path d="M186 98 H222 L240 116 H186 Z" fill="#cfe5fa" />
      <circle cx="45" cy="164" r="17" fill="#0f2a4a" /><circle cx="45" cy="164" r="6" fill="#fff" />
      <circle cx="212" cy="164" r="17" fill="#0f2a4a" /><circle cx="212" cy="164" r="6" fill="#fff" />
    </Box>
  );
}
