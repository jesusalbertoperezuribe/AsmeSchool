import { obtenerSesionActual, cerrarSesion } from '../storage.js';

class AcmeNavbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    document.addEventListener('cambio-ruta', () => this.render());
  }

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
          background-color: var(--q-primary, #1976D2);
          color: #ffffff;
          box-shadow: var(--q-shadow-2, 0 2px 4px rgba(0,0,0,0.2));
          position: sticky;
          top: 0;
          z-index: 100;
        }

        nav {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0.75rem 1rem;
          min-height: 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .marca {
          font-size: 1.25rem;
          font-weight: 500;
          letter-spacing: 0.0125em;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .menu {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .usuario-info {
          font-size: 0.85rem;
          background: rgba(255, 255, 255, 0.15);
          padding: 4px 10px;
          border-radius: 4px;
          margin-right: 0.4rem;
        }

        /* Estilo q-btn de Quasar */
        button {
          font-family: inherit;
          text-transform: uppercase;
          font-weight: 500;
          font-size: 0.82rem;
          letter-spacing: 0.04em;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          background-color: transparent;
          color: #ffffff;
          transition: background-color 0.2s ease, box-shadow 0.2s ease;
        }

        button:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }

        .btn-blanco {
          background-color: #ffffff;
          color: var(--q-primary, #1976D2);
          box-shadow: var(--q-shadow-1);
        }

        .btn-blanco:hover {
          background-color: #f0f7ff;
        }

        .btn-salir {
          background-color: var(--q-negative, #C10015);
          color: #ffffff;
          box-shadow: var(--q-shadow-1);
        }

        .btn-salir:hover {
          background-color: #a30012;
        }
      </style>

      <nav>
        <div class="marca" id="btn-inicio">🎓 Acme School</div>

        <div class="menu">
          ${sesion ? `
            <span class="usuario-info">${sesion.nombre} · ${sesion.cargo}</span>
            <button id="btn-usuarios">Usuarios</button>
            <button id="btn-examenes">Exámenes</button>
            <button id="btn-cartelera">Cartelera</button>
            <button id="btn-salir" class="btn-salir">Salir</button>
          ` : `
            <button id="btn-cartelera">Exámenes Disponibles</button>
            <button id="btn-login" class="btn-blanco">Acceso Docentes</button>
          `}
        </div>
      </nav>
    `;

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

customElements.define('acme-navbar', AcmeNavbar);