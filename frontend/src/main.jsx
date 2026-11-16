import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PantallaAdmBolsin from './components/PantallaAdmBolsin';

const theme = createTheme({
  palette: {
    primary: { main: '#1f4e79' },
    background: { default: '#f4f6f8' },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PantallaAdmBolsin />
    </ThemeProvider>
  </React.StrictMode>
);
