import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

// Colores del diseño propuesto por el grupo (azul institucional + amarillo del bolsín)
const theme = createTheme({
  palette: {
    primary: { main: '#1f6fbf', dark: '#0f3b66', light: '#e8f1fb' },
    warning: { main: '#d9a21b', light: '#fff8e1' },
    success: { main: '#2e9e6a' },
    background: { default: '#f3f6fa', paper: '#ffffff' },
    text: { primary: '#10243e', secondary: '#5b6b82' },
    divider: '#e3e9f1',
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 10, padding: '9px 20px' } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
