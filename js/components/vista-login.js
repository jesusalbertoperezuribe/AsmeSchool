import { iniciarSesion } from '../storage.js';

class VistaLogin extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>

      *, *::before, *::after {
  box-sizing: border-box;
}

:host {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  animation: aparecer 0.25s ease;
}

#form-login {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

        @keyframes aparecer {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .q-card {
          background-color: #ffffff;
          width: 100%;
          max-width: 390px;
          border-radius: 4px;
          box-shadow: var(--q-shadow-2);
          overflow: hidden;
        }

        .q-card-header {
          background-color: var(--q-primary, #1976D2);
          color: #ffffff;
          padding: 20px 24px;
          text-align: center;
        }

        .q-card-header h2 {
          margin: 0 0 4px 0;
          font-size: 1.35rem;
          font-weight: 500;
        }

        .q-card-header p {
          margin: 0;
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .q-card-section {
          padding: 24px;
        }

        .campo {
          margin-bottom: 16px;
        }

        label {
          display: block;
          margin-bottom: 4px;
          color: rgba(0, 0, 0, 0.7);
          font-weight: 500;
          font-size: 0.82rem;
        }

        input {
          width: 100%;
          font-family: inherit;
          padding: 11px 12px;
          border: 1px solid rgba(0, 0, 0, 0.24);
          border-radius: 4px;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        input:hover {
          border-color: #000000;
        }

        input:focus {
          outline: none;
          border-color: var(--q-primary, #1976D2);
          box-shadow: inset 0 0 0 1px var(--q-primary, #1976D2);
        }

        button {
          width: 100%;
          font-family: inherit;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 11px;
          background-color: var(--q-primary, #1976D2);
          color: #ffffff;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: var(--q-shadow-1);
          transition: background-color 0.2s;
          margin-top: 8px;
        }

        button:hover {
          background-color: var(--q-primary-dark, #1565C0);
        }

        .mensaje-error {
          background-color: var(--q-negative, #C10015);
          color: #ffffff;
          padding: 10px 12px;
          border-radius: 4px;
          font-size: 0.85rem;
          text-align: center;
          margin-bottom: 16px;
          display: none;
        }

        .ayuda-prueba {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid rgba(0, 0, 0, 0.12);
          font-size: 0.8rem;
          color: rgba(0, 0, 0, 0.6);
          text-align: center;
        }
      </style>

      <div class="q-card">
        <div class="q-card-header">
          <h2>Acceso Privado</h2>
          <p>Ingresa con tu cuenta de docente o administrativo</p>
        </div>

        <div class="q-card-section">
          <div id="error" class="mensaje-error">Correo o contraseña incorrectos</div>

          <form id="form-login">
            <div class="campo">
              <label for="email">Correo electrónico</label>
              <input type="email" id="email" placeholder="chucho@gmail.com" required>
            </div>

            <div class="campo">
              <label for="password">Contraseña</label>
              <input type="password" id="password" placeholder="••••••••" required>
            </div>

            <button type="submit">Iniciar Sesión</button>
          </form>

          <div class="ayuda-prueba">
            Acceso rápido: <strong>chucho@gmail.com</strong> · Clave: <strong>123</strong>
          </div>
        </div>
      </div>
    `;

    const formulario = this.shadowRoot.getElementById('form-login');
    const cajaError = this.shadowRoot.getElementById('error');

    formulario.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = this.shadowRoot.getElementById('email').value.trim();
      const password = this.shadowRoot.getElementById('password').value.trim();

      if (iniciarSesion(email, password)) {
        this.dispatchEvent(new CustomEvent('navegar', {
          detail: { ruta: 'usuarios' },
          bubbles: true,
          composed: true
        }));
      } else {
        cajaError.style.display = 'block';
      }
    });
  }
}

customElements.define('vista-login', VistaLogin);