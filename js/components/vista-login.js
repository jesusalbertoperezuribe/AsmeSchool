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
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 80px);
          padding: 1.5rem;
          animation: aparecer 0.3s ease;
        }

        @keyframes aparecer {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .caja-login {
          background-color: #ffffff;
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        h2 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          text-align: center;
          font-size: 1.5rem;
        }

        .subtitulo {
          margin: 0 0 1.5rem 0;
          color: #64748b;
          text-align: center;
          font-size: 0.9rem;
        }

        .campo {
          margin-bottom: 1.2rem;
        }

        label {
          display: block;
          margin-bottom: 0.4rem;
          color: #334155;
          font-weight: 600;
          font-size: 0.9rem;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 1rem;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        input:focus {
          outline: none;
          border-color: #0284c7;
        }

        button {
          width: 100%;
          padding: 0.85rem;
          background-color: #0284c7;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 0.5rem;
        }

        button:hover {
          background-color: #0369a1;
        }

        .mensaje-error {
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 0.7rem;
          border-radius: 6px;
          font-size: 0.85rem;
          text-align: center;
          margin-bottom: 1rem;
          display: none;
        }

        .ayuda-prueba {
          margin-top: 1.2rem;
          padding-top: 1rem;
          border-top: 1px dashed #cbd5e1;
          font-size: 0.8rem;
          color: #64748b;
          text-align: center;
        }
      </style>

      <div class="caja-login">
        <h2>Acceso Privado</h2>
        <p class="subtitulo">Ingresa con tu cuenta de docente o administrativo</p>

        <div id="error" class="mensaje-error">Correo o contraseña incorrectos</div>

        <form id="form-login">
          <div class="campo">
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" placeholder="admin@acmeschool.com" required>
          </div>

          <div class="campo">
            <label for="password">Contraseña</label>
            <input type="password" id="password" placeholder="••••••••" required>
          </div>

          <button type="submit">Iniciar Sesión</button>
        </form>

        <div class="ayuda-prueba">
          Usuario de prueba: <strong>admin@acmeschool.com</strong> | Clave: <strong>123</strong>
        </div>
      </div>
    `;

    const formulario = this.shadowRoot.getElementById('form-login');
    const cajaError = this.shadowRoot.getElementById('error');

    formulario.addEventListener('submit', (e) => {
      e.preventDefault(); // Evita que la página se recargue

      const email = this.shadowRoot.getElementById('email').value.trim();
      const password = this.shadowRoot.getElementById('password').value.trim();

      // Le preguntamos a storage.js si los datos son válidos
      const accesoPermitido = iniciarSesion(email, password);

      if (accesoPermitido) {
        // Si son correctos, le decimos a main.js que nos lleve a Gestión de Usuarios
        this.dispatchEvent(new CustomEvent('navegar', {
          detail: { ruta: 'usuarios' },
          bubbles: true,
          composed: true
        }));
      } else {
        // Si fallan, mostramos el aviso rojo
        cajaError.style.display = 'block';
      }
    });
  }
}

customElements.define('vista-login', VistaLogin);