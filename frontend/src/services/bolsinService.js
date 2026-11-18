import axios from 'axios';

// Cada función llama a un endpoint de PantallaAdmBolsin (backend).
// El nombre de cada función es el del mensaje del diagrama de secuencia.
const API_URL = '/recepcion-bolsin';

export const opcionRegistrarRecepcionBolsin = async () => {
  const respuesta = await axios.post(`${API_URL}/iniciar`);
  return respuesta.data; // { comisionMedica, bolsines: [{ numeroBolsin, cmOrigen, numeroPrecinto }] }
};

export const tomarSeleccionDeBolsin = async (numeroBolsin) => {
  const respuesta = await axios.post(`${API_URL}/seleccionar-bolsin`, { numeroBolsin });
  return respuesta.data; // { remitos: [{ numeroRemito, documentacion: [{ asunto, tipoDocumentacion }] }], opcionesRecepcion: [...] }
};

export const tomarSeleccionOpcion1 = async () => {
  const respuesta = await axios.post(`${API_URL}/seleccionar-opcion-1`);
  return respuesta.data; // { mensaje }
};

export const tomarConfirmacionDocumentacion = async () => {
  const respuesta = await axios.post(`${API_URL}/confirmar`);
  return respuesta.data; // { mensaje }
};

export const cancelar = async () => {
  const respuesta = await axios.post(`${API_URL}/cancelar`);
  return respuesta.data; // { mensaje }
};

// Menú principal (no es parte del CU 28): usuario logueado, su CM y bolsines por recibir.
export const mostrarMenu = async () => {
  const respuesta = await axios.get('/menu');
  return respuesta.data; // { nombreUsuario, nombreEmpleado, comisionMedica, bolsinesPorRecibir: [...] }
};
