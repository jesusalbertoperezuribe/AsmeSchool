import { obtenerUsuarios, guardarUsuario, eliminarUsuario, obtenerSesionActual } from '../storage.js';

class VistaUsuarios extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.modoEdicion = false;
  }

  connectedCallback() {
    // Candado de seguridad a nivel de componente
    if (!obtenerSesionActual()) {
      this.dispatchEvent(new CustomEvent('navegar', {
        detail: { ruta: 'login' },
        bubbles: true,
        composed: true
      }));
      return;
    }
    this.render();
  }

  render() {
    const usuarios = obtenerUsuarios();

    this.shadowRoot.innerHTML = `
      <style>
      *, *::before, *::after {
  box-sizing: border-box;
}

#form-usuario {
  width: 100%;
  max-width: 310px;
  margin: 0 auto;
}
        :host {
          display: block;
          animation: aparecer 0.25s ease;
        }

        @keyframes aparecer {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h2 {
          color: var(--q-dark, #1D1D1D);
          font-weight: 500;
          font-size: 1.6rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .contenedor-dos-columnas {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 880px) {
          .contenedor-dos-columnas {
            grid-template-columns: 1fr;
          }
        }

        .q-card {
          background-color: #ffffff;
          border-radius: 4px;
          box-shadow: var(--q-shadow-2);
          overflow: hidden;
        }

        .q-card-header {
          padding: 14px 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--q-primary, #1976D2);
        }

        .q-card-body {
          padding: 20px;
        }

        .campo {
          margin-bottom: 14px;
        }

        label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.7);
          margin-bottom: 4px;
        }

        input, select {
          width: 100%;
          font-family: inherit;
          padding: 10px 12px;
          border: 1px solid rgba(0, 0, 0, 0.24);
          border-radius: 4px;
          font-size: 0.92rem;
          background-color: #ffffff;
        }

        input:focus, select:focus {
          outline: none;
          border-color: var(--q-primary, #1976D2);
          box-shadow: inset 0 0 0 1px var(--q-primary, #1976D2);
        }

        input:disabled {
          background-color: #f5f5f5;
          color: rgba(0, 0, 0, 0.5);
          cursor: not-allowed;
        }

        .botones-form {
          display: flex;
          gap: 8px;
          margin-top: 18px;
        }

        .q-btn {
          font-family: inherit;
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          box-shadow: var(--q-shadow-1);
          transition: opacity 0.2s;
        }

        .q-btn:hover {
          opacity: 0.9;
        }

        .btn-guardar {
          background-color: var(--q-primary, #1976D2);
          color: #ffffff;
          flex: 1;
        }

        .btn-cancelar {
          background-color: #9e9e9e;
          color: #ffffff;
          display: none;
        }

        /* Tabla estilo q-table */
        .tabla-responsive {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }

        th, td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        }

        th {
          font-weight: 500;
          font-size: 0.8rem;
          color: rgba(0, 0, 0, 0.54);
        }

        tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }

        .q-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: var(--q-secondary, #26A69A);
          color: #ffffff;
        }

        .acciones {
          display: flex;
          gap: 6px;
        }

        .btn-mini {
          padding: 5px 10px;
          font-size: 0.75rem;
        }

        .btn-editar {
          background-color: var(--q-warning, #F2C037);
          color: #1d1d1d;
        }

        .btn-eliminar {
          background-color: var(--q-negative, #C10015);
          color: #ffffff;
        }
      </style>

      <h2>Gestión de Usuarios</h2>

      <div class="contenedor-dos-columnas">
        <div class="q-card">
          <div class="q-card-header" id="titulo-form">Registrar Usuario</div>
          <div class="q-card-body">
            <form id="form-usuario">
              <div class="campo">
                <label for="identificacion">Número de identificación</label>
                <input type="text" id="identificacion" required>
              </div>

              <div class="campo">
                <label for="nombre">Nombre completo</label>
                <input type="text" id="nombre" required>
              </div>

              <div class="campo">
                <label for="email">Correo electrónico</label>
                <input type="email" id="email" required>
              </div>

              <div class="campo">
                <label for="telefono">Teléfono</label>
                <input type="tel" id="telefono" required>
              </div>

              <div class="campo">
                <label for="cargo">Cargo</label>
                <select id="cargo" required>
                  <option value="Docente">Docente</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
              </div>

              <div class="campo">
                <label for="password">Contraseña</label>
                <input type="password" id="password" required>
              </div>

              <div class="botones-form">
                <button type="submit" class="q-btn btn-guardar" id="btn-submit">Guardar</button>
                <button type="button" class="q-btn btn-cancelar" id="btn-cancelar">Cancelar</button>
              </div>
            </form>
          </div>
        </div>

        <div class="q-card">
          <div class="q-card-header">Usuarios Registrados</div>
          <div class="tabla-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Cargo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${usuarios.map(u => `
                  <tr>
                    <td>${u.identificacion}</td>
                    <td>${u.nombre}</td>
                    <td>${u.email}</td>
                    <td>${u.telefono}</td>
                    <td><span class="q-badge">${u.cargo}</span></td>
                    <td class="acciones">
                      <button class="q-btn btn-mini btn-editar" data-id="${u.identificacion}">Editar</button>
                      <button class="q-btn btn-mini btn-eliminar" data-id="${u.identificacion}">Eliminar</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.configurarEventos();
  }

  configurarEventos() {
    const form = this.shadowRoot.getElementById('form-usuario');
    const inputId = this.shadowRoot.getElementById('identificacion');
    const tituloForm = this.shadowRoot.getElementById('titulo-form');
    const btnSubmit = this.shadowRoot.getElementById('btn-submit');
    const btnCancelar = this.shadowRoot.getElementById('btn-cancelar');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const usuario = {
        identificacion: inputId.value.trim(),
        nombre: this.shadowRoot.getElementById('nombre').value.trim(),
        email: this.shadowRoot.getElementById('email').value.trim(),
        telefono: this.shadowRoot.getElementById('telefono').value.trim(),
        cargo: this.shadowRoot.getElementById('cargo').value,
        password: this.shadowRoot.getElementById('password').value.trim()
      };

      guardarUsuario(usuario);
      this.modoEdicion = false;
      this.render();
    });

    btnCancelar.addEventListener('click', () => {
      this.modoEdicion = false;
      this.render();
    });

    this.shadowRoot.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const usuario = obtenerUsuarios().find(u => u.identificacion === id);
        if (!usuario) return;

        inputId.value = usuario.identificacion;
        inputId.disabled = true;
        this.shadowRoot.getElementById('nombre').value = usuario.nombre;
        this.shadowRoot.getElementById('email').value = usuario.email;
        this.shadowRoot.getElementById('telefono').value = usuario.telefono;
        this.shadowRoot.getElementById('cargo').value = usuario.cargo;
        this.shadowRoot.getElementById('password').value = usuario.password;

        tituloForm.textContent = 'Actualizar Usuario';
        btnSubmit.textContent = 'Actualizar';
        btnCancelar.style.display = 'inline-block';
        this.modoEdicion = true;
      });
    });

    this.shadowRoot.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm(`¿Seguro que deseas eliminar al usuario con ID ${id}?`)) {
          eliminarUsuario(id);
          this.render();
        }
      });
    });
  }
}

customElements.define('vista-usuarios', VistaUsuarios);