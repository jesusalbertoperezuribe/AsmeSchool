import { obtenerUsuarios, guardarUsuario, eliminarUsuario } from '../storage.js';

class VistaUsuarios extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.modoEdicion = false;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const usuarios = obtenerUsuarios();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1.5rem;
          animation: aparecer 0.3s ease;
        }

        @keyframes aparecer {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h2 {
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        /* Estructura de 2 columnas igual a tu segundo boceto */
        .contenedor-dos-columnas {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          align-items: start;
        }

        /* En celulares se pone una caja debajo de la otra */
        @media (max-width: 850px) {
          .contenedor-dos-columnas {
            grid-template-columns: 1fr;
          }
        }

        .tarjeta {
          background-color: #ffffff;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        .tarjeta h3 {
          margin-top: 0;
          color: #0284c7;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.75rem;
        }

        .campo {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.3rem;
        }

        input, select {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.95rem;
          box-sizing: border-box;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #0284c7;
        }

        input:disabled {
          background-color: #f1f5f9;
          cursor: not-allowed;
        }

        .botones-form {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.2rem;
        }

        button {
          padding: 0.65rem 1rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        button:hover {
          opacity: 0.9;
        }

        .btn-guardar {
          background-color: #0284c7;
          color: white;
          flex: 1;
        }

        .btn-cancelar {
          background-color: #64748b;
          color: white;
          display: none;
        }

        /* Estilos de la tabla */
        .tabla-responsive {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        th {
          background-color: #f8fafc;
          color: #475569;
          font-weight: 700;
        }

        .badge {
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          background-color: #e0f2fe;
          color: #0369a1;
        }

        .acciones {
          display: flex;
          gap: 0.4rem;
        }

        .btn-editar {
          background-color: #f59e0b;
          color: white;
          padding: 0.4rem 0.7rem;
          font-size: 0.8rem;
        }

        .btn-eliminar {
          background-color: #ef4444;
          color: white;
          padding: 0.4rem 0.7rem;
          font-size: 0.8rem;
        }
      </style>

      <h2>Gestión de Usuarios</h2>

      <div class="contenedor-dos-columnas">
        <!-- CAJA IZQUIERDA: FORMULARIO -->
        <div class="tarjeta">
          <h3 id="titulo-form">Registrar Usuario</h3>
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
              <button type="submit" class="btn-guardar" id="btn-submit">Guardar Usuario</button>
              <button type="button" class="btn-cancelar" id="btn-cancelar">Cancelar</button>
            </div>
          </form>
        </div>

        <!-- CAJA DERECHA: TABLA DE USUARIOS -->
        <div class="tarjeta">
          <h3>Usuarios Registrados</h3>
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
              <tbody id="tabla-cuerpo">
                ${usuarios.map(u => `
                  <tr>
                    <td>${u.identificacion}</td>
                    <td>${u.nombre}</td>
                    <td>${u.email}</td>
                    <td>${u.telefono}</td>
                    <td><span class="badge">${u.cargo}</span></td>
                    <td class="acciones">
                      <button class="btn-editar" data-id="${u.identificacion}">Editar</button>
                      <button class="btn-eliminar" data-id="${u.identificacion}">Eliminar</button>
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

    // 1. Guardar o actualizar usuario
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
      this.render(); // Volvemos a dibujar para ver la tabla actualizada
    });

    // 2. Cancelar edición
    btnCancelar.addEventListener('click', () => {
      this.modoEdicion = false;
      this.render();
    });

    // 3. Botones de Editar en la tabla
    this.shadowRoot.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const usuario = obtenerUsuarios().find(u => u.identificacion === id);
        if (!usuario) return;

        // Llenamos el formulario con los datos del usuario elegido
        inputId.value = usuario.identificacion;
        inputId.disabled = true; // Bloqueamos el ID para que no lo cambien al editar
        this.shadowRoot.getElementById('nombre').value = usuario.nombre;
        this.shadowRoot.getElementById('email').value = usuario.email;
        this.shadowRoot.getElementById('telefono').value = usuario.telefono;
        this.shadowRoot.getElementById('cargo').value = usuario.cargo;
        this.shadowRoot.getElementById('password').value = usuario.password;

        // Cambiamos textos de botones
        tituloForm.textContent = 'Actualizar Usuario';
        btnSubmit.textContent = 'Actualizar';
        btnCancelar.style.display = 'inline-block';
        this.modoEdicion = true;
      });
    });

    // 4. Botones de Eliminar en la tabla
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