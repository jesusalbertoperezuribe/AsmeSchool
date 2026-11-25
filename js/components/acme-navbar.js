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
          background-color: #3e2210;
          background-image:
            repeating-linear-gradient(177deg, transparent 0 13px, rgba(243, 229, 171, 0.045) 14px, transparent 16px),
            linear-gradient(180deg, #5c371e 0%, #3e2210 85%, #261408 100%);
          color: #fff8e6;
          border-bottom: 6px solid #241206;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        nav {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0.85rem 1rem 0.68rem;
          min-height: 76px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 0.9rem 1rem;
        }

        .marca {
          min-height: 46px;
          padding: 0.45rem 0.9rem;
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1.17rem;
          font-weight: 700;
          letter-spacing: 0.035em;
          color: #f3e5ab;
          background: linear-gradient(145deg, #35200f, #211307);
          border: 2px solid #b48a3e;
          border-radius: 5px;
          box-shadow: inset 0 0 0 2px rgba(243, 229, 171, 0.12), 0 2px 5px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.62rem;
          white-space: nowrap;
        }

        .marca svg {
          width: 28px;
          height: 28px;
          flex: none;
          color: #e4c56f;
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.55));
        }

        .menu {
          display: flex;
          align-items: center;
          gap: 0.48rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .usuario-info {
          font-size: 0.85rem;
          background: linear-gradient(180deg, rgba(38, 20, 8, 0.75), rgba(55, 31, 14, 0.85));
          color: #f5e7bd;
          padding: 4px 10px;
          border: 1px solid rgba(218, 183, 104, 0.45);
          border-radius: 999px;
          margin-right: 0.4rem;
        }

        button {
          position: relative;
          overflow: hidden;
          font-family: inherit;
          text-transform: uppercase;
          font-weight: 650;
          font-size: 0.76rem;
          letter-spacing: 0.055em;
          padding: 0.63rem 0.9rem 0.72rem;
          border: 1px solid rgba(243, 229, 171, 0.7);
          border-bottom: 4px solid rgba(22, 12, 7, 0.75);
          border-radius: 8px 8px 3px 3px;
          cursor: pointer;
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 18%, transparent 82%, rgba(0, 0, 0, 0.15)), linear-gradient(180deg, #274a72, #142c4b);
          color: #fff8e6;
          box-shadow: inset 0 1px 0 rgba(255, 244, 204, 0.28), 0 2px 4px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
        }

        button::before {
          content: "";
          position: absolute;
          left: 7px;
          right: 7px;
          top: 5px;
          height: 2px;
          border-radius: 2px;
          background: rgba(243, 229, 171, 0.78);
          box-shadow: 0 4px 0 rgba(243, 229, 171, 0.3);
          pointer-events: none;
        }

        button:hover {
          transform: translateY(-3px);
          filter: brightness(1.15);
          box-shadow: inset 0 1px 0 rgba(255, 244, 204, 0.36), 0 6px 9px rgba(0, 0, 0, 0.35);
        }

        button:focus-visible,
        .marca:focus-visible {
          outline: 2px solid #fde68a;
          outline-offset: 3px;
        }

        #btn-usuarios {
          background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 18%, transparent 82%, rgba(0, 0, 0, 0.15)), linear-gradient(180deg, #287044, #143d26);
        }

        #btn-cartelera {
          background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 18%, transparent 82%, rgba(0, 0, 0, 0.15)), linear-gradient(180deg, #8b3034, #57191e);
        }

        #btn-login {
          background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 18%, transparent 82%, rgba(0, 0, 0, 0.15)), linear-gradient(180deg, #9a6729, #694018);
        }

        .btn-salir {
          background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 18%, transparent 82%, rgba(0, 0, 0, 0.15)), linear-gradient(180deg, #9a3038, #621a21);
        }

        .btn-salir:hover {
          filter: brightness(1.18);
        }

        @media (max-width: 700px) {
          nav {
            align-items: center;
            padding: 0.7rem 0.75rem 0.65rem;
          }

          .menu {
            flex: 1 1 100%;
            width: 100%;
            justify-content: center;
          }

          .usuario-info {
            flex: 1 1 100%;
            margin: 0 0 0.2rem;
            text-align: center;
          }

          .menu button {
            flex: 1 1 125px;
          }
        }

        @media (max-width: 380px) {
          nav {
            padding-inline: 0.55rem;
          }

          .menu {
            gap: 0.35rem;
          }

          .menu button {
            flex-basis: 108px;
            padding-inline: 0.55rem;
            font-size: 0.7rem;
          }
        }
      </style>

      <nav>
        <div class="marca" id="btn-inicio">
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="M4 8.5 16 4l12 4.5-12 4.6L4 8.5Z" fill="currentColor" stroke="#b48a3e" stroke-width="1.4" stroke-linejoin="round" />
            <path d="M7 12v8.5c5.6 3 12.4 3 18 0V12M4 8.5v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11 15h10M11 18h10M8 24h16" fill="none" stroke="#f3e5ab" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span>Acme School</span>
        </div>

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
