import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Encabezado, Pie } from './components/Layout';
import PantallaAdmBolsin from './components/PantallaAdmBolsin';
import { mostrarMenu } from './services/bolsinService';

// Arma la página: encabezado, la pantalla del CU y el pie.
// Los datos del menú (usuario, CM y pendientes) se piden al backend al entrar
// y cada vez que se vuelve al menú, así el contador queda actualizado.
export default function App() {
  const [menu, setMenu] = useState(null);
  const [errorMenu, setErrorMenu] = useState('');

  const cargarMenu = async () => {
    try {
      setMenu(await mostrarMenu());
      setErrorMenu('');
    } catch (e) {
      setErrorMenu('No se pudo conectar con el servidor. ¿Está corriendo el backend en el puerto 8080?');
    }
  };

  useEffect(() => { cargarMenu(); }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Encabezado menu={menu} />
      <Box component="main" sx={{ flex: 1, width: '100%', maxWidth: 1112, mx: 'auto', px: 2, py: { xs: 3, md: 5 } }}>
        <PantallaAdmBolsin menu={menu} errorMenu={errorMenu} cargarMenu={cargarMenu} />
      </Box>
      <Pie />
    </Box>
  );
}
