import { obtenerSesionActual, cerrarSesion } from '../storage.js';

class AcmeNavbar extends HTMLElement {
  constructor() {
    super();
    // Creamos el Shadow DOM para que los estilos de esta barra no se mezclen con el resto
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    // Cada vez que main.js cambie de pantalla, volvemos a dibujar la barra
    document.addEventListener('cambio-ruta', () => this.render());
  }

  // Función auxiliar para pedirle a main.js que cambie de pantalla
  irA(ruta) {
    this.dispatchEvent(new CustomEvent('navegar', {
      detail: { ruta },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const sesion = obtenerSesionActual();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: #1e293b;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.9rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .marca {
          font-size: 1.3rem;
          font-weight: bold;
          color: #38bdf8;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .menu {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .usuario-info {
          font-size: 0.9rem;
          color: #cbd5e1;
          margin-right: 0.5rem;
        }

        button {
          background-color: transparent;
          color: #f8fafc;
          border: 1px solid #475569;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        button:hover {
          background-color: #334155;
          border-color: #38bdf8;
        }

        .btn-primario {
          background-color: #0284c7;
          border-color: #0284c7;
          font-weight: 600;
        }

        .btn-primario:hover {
          background-color: #0369a1;
        }

        .btn-salir {
          background-color: #dc2626;
          border-color: #dc2626;
        }

        .btn-salir:hover {
          background-color: #b91c1c;
        }
      </style>

      <nav>
        <div class="marca" id="btn-inicio">🎓 Acme School</div>

        <div class="menu">
          ${sesion ? `
            <!-- BOTONES CUANDO EL DOCENTE / ADMINISTRATIVO INICIÓ SESIÓN -->
            <span class="usuario-info">Hola, ${sesion.nombre} (${sesion.cargo})</span>
            <button id="btn-usuarios">Gestión de Usuarios</button>
            <button id="btn-examenes">Gestión de Exámenes</button>
            <button id="btn-cartelera">Vista Estudiantes</button>
            <button id="btn-salir" class="btn-salir">Cerrar Sesión</button>
          ` : `
            <!-- BOTONES CUANDO ES UN VISITANTE / ESTUDIANTE SIN SESIÓN -->
            <button id="btn-cartelera">Exámenes Disponibles</button>
            <button id="btn-login" class="btn-primario">Acceso Docentes</button>
          `}
        </div>
      </nav>
    `;

    // Conectamos los clics de los botones que estén visibles en este momento
    this.shadowRoot.getElementById('btn-inicio').addEventListener('click', () => this.irA('cartelera'));
    this.shadowRoot.getElementById('btn-cartelera').addEventListener('click', () => this.irA('cartelera'));

    if (sesion) {
      this.shadowRoot.getElementById('btn-usuarios').addEventListener('click', () => this.irA('usuarios'));
      this.shadowRoot.getElementById('btn-examenes').addEventListener('click', () => this.irA('examenes'));
      this.shadowRoot.getElementById('btn-salir').addEventListener('click', () => {
        cerrarSesion();
        this.irA('cartelera');
      });
    } else {
      this.shadowRoot.getElementById('btn-login').addEventListener('click', () => this.irA('login'));
    }
  }
}

// Registramos la etiqueta personalizada <acme-navbar> en el navegador
customElements.define('acme-navbar', AcmeNavbar);