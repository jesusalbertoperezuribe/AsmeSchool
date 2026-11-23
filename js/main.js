// 1. Traemos la memoria (storage) y todos tus Web Components
import { inicializarDatos, obtenerSesionActual } from './storage.js';
import './components/acme-navbar.js';
import './components/vista-cartelera.js';
import './components/vista-login.js';
import './components/vista-usuarios.js';
import './components/vista-examenes.js';
import './components/vista-resolver.js';

// 2. Al abrir la página, creamos los datos de prueba si localStorage está vacío
inicializarDatos();

// 3. Ubicamos el escenario vacío del HTML
const app = document.getElementById('app');

// 4. Función "Control Remoto" para cambiar de pantalla
export function navegarA(ruta, datosExtra = null) {
  const usuarioLogueado = obtenerSesionActual();

  // CANDADO DE SEGURIDAD: Si intenta entrar a usuarios o exámenes sin iniciar sesión,
  // lo mandamos directo a la pantalla de Login.
  if ((ruta === 'usuarios' || ruta === 'examenes') && !usuarioLogueado) {
    ruta = 'login';
  }

  // Limpiamos la pantalla anterior
  app.innerHTML = '';

  // Ponemos la nueva pantalla según el botón que presionaron
  switch (ruta) {
    case 'cartelera':
      app.innerHTML = '<vista-cartelera></vista-cartelera>';
      break;

    case 'login':
      app.innerHTML = '<vista-login></vista-login>';
      break;

    case 'usuarios':
      app.innerHTML = '<vista-usuarios></vista-usuarios>';
      break;

    case 'examenes':
      app.innerHTML = '<vista-examenes></vista-examenes>';
      break;

    case 'resolver':
      const vistaExamen = document.createElement('vista-resolver');
      // Le pasamos los datos del examen elegido y del estudiante
      vistaExamen.datosInicio = datosExtra; 
      app.appendChild(vistaExamen);
      break;

    default:
      app.innerHTML = '<vista-cartelera></vista-cartelera>';
  }

  // Avisamos a la barra superior (navbar) que cambiamos de pantalla para que actualice sus botones
  document.dispatchEvent(new CustomEvent('cambio-ruta', { detail: { ruta } }));
}

// 5. Escuchamos cuando cualquier botón de tus componentes pida cambiar de pantalla
document.addEventListener('navegar', (evento) => {
  const { ruta, datosExtra } = evento.detail;
  navegarA(ruta, datosExtra);
});

// 6. Apenas cargue la página, mostramos la cartelera pública de exámenes por defecto
navegarA('cartelera');