import { obtenerExamenes } from '../storage.js';

class VistaCartelera extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.examenSeleccionado = null;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const examenes = obtenerExamenes();

    this.shadowRoot.innerHTML = `
      <style>
      *, *::before, *::after {
  box-sizing: border-box;
}

#form-estudiante {
  width: 100%;
  max-width: 340px;
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

        .encabezado {
          text-align: center;
          margin-bottom: 2rem;
        }

        .encabezado h2 {
          color: var(--q-dark, #1D1D1D);
          font-size: 1.75rem;
          font-weight: 500;
          margin-bottom: 0.35rem;
        }

        .encabezado p {
          color: rgba(0, 0, 0, 0.6);
          font-size: 0.95rem;
        }

        /* Flexbox centrado: si hay 1 solo examen queda en el centro exacto */
        .contenedor-tarjetas {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 24px;
        }

        /* Tarjeta estilo q-card */
        .q-card {
          background-color: #ffffff;
          border-radius: 4px;
          box-shadow: var(--q-shadow-2);
          width: 100%;
          max-width: 340px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .q-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        }

        .q-card-section {
          padding: 16px;
        }

        .q-badge {
          display: inline-block;
          background-color: var(--q-secondary, #26A69A);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .q-card h3 {
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--q-dark, #1D1D1D);
          margin: 0 0 8px 0;
        }

        .descripcion {
          color: rgba(0, 0, 0, 0.65);
          font-size: 0.9rem;
          line-height: 1.45;
          margin: 0;
        }

        .q-separator {
          border: none;
          border-top: 1px solid rgba(0, 0, 0, 0.12);
          margin: 0;
        }

        .detalles {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background-color: #fafafa;
          font-size: 0.85rem;
          color: rgba(0, 0, 0, 0.75);
        }

        .detalles strong {
          color: var(--q-primary, #1976D2);
        }

        .q-card-actions {
          padding: 12px 16px 16px 16px;
        }

        .q-btn {
          width: 100%;
          font-family: inherit;
          text-transform: uppercase;
          font-weight: 500;
          font-size: 0.875rem;
          letter-spacing: 0.04em;
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: var(--q-shadow-1);
          transition: background-color 0.2s ease;
        }

        .btn-primary {
          background-color: var(--q-primary, #1976D2);
          color: #ffffff;
        }

        .btn-primary:hover {
          background-color: var(--q-primary-dark, #1565C0);
        }

        /* Modal estilo q-dialog */
        .fondo-modal {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: none;
          justify-content: center;
          align-items: center;
          padding: 16px;
          z-index: 200;
        }

        .fondo-modal.activo {
          display: flex;
          animation: aparecer 0.2s ease;
        }

        .caja-modal {
          background-color: #ffffff;
          width: 100%;
          max-width: 400px;
          border-radius: 4px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .modal-header {
          background-color: var(--q-primary, #1976D2);
          color: #ffffff;
          padding: 16px 20px;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 500;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-body p {
          margin: 0 0 16px 0;
          color: rgba(0, 0, 0, 0.65);
          font-size: 0.9rem;
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

        /* Input estilo Quasar Outlined */
        input {
          width: 100%;
          font-family: inherit;
          padding: 10px 12px;
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

        .botones-modal {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 20px;
        }

        .btn-flat {
          width: auto;
          background-color: transparent;
          color: rgba(0, 0, 0, 0.7);
          box-shadow: none;
        }

        .btn-flat:hover {
          background-color: rgba(0, 0, 0, 0.06);
        }

        .btn-positive {
          width: auto;
          background-color: var(--q-positive, #21BA45);
          color: #ffffff;
        }

        .btn-positive:hover {
          background-color: #1ca33c;
        }

        .vacio {
          max-width: 480px;
          margin: 0 auto;
          text-align: center;
          padding: 32px;
          background: #ffffff;
          border-radius: 4px;
          box-shadow: var(--q-shadow-1);
          color: rgba(0, 0, 0, 0.6);
        }
      </style>

      <div class="encabezado">
        <h2>Exámenes Disponibles</h2>
        <p>Selecciona una evaluación para comenzar. No requiere contraseña.</p>
      </div>

      ${examenes.length === 0 ? `
        <div class="vacio">
          <h3>No hay exámenes disponibles</h3>
          <p>Pide a un docente que registre un examen desde el panel privado.</p>
        </div>
      ` : `
        <div class="contenedor-tarjetas">
          ${examenes.map(ex => `
            <div class="q-card">
              <div class="q-card-section">
                <span class="q-badge">${ex.codigo}</span>
                <h3>${ex.titulo}</h3>
                <p class="descripcion">${ex.descripcion}</p>
              </div>

              <div>
                <hr class="q-separator">
                <div class="detalles">
                  <span>Tiempo: <strong>${ex.tiempo} min</strong></span>
                  <span>Aprobación: <strong>${ex.porcentajeAprobacion}%</strong></span>
                </div>
                <hr class="q-separator">
                <div class="q-card-actions">
                  <button class="q-btn btn-primary btn-elegir" data-codigo="${ex.codigo}">Presentar Examen</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}

      <div class="fondo-modal" id="modal-registro">
        <div class="caja-modal">
          <div class="modal-header">
            <h3 id="modal-titulo-examen">Datos del Estudiante</h3>
          </div>
          <div class="modal-body">
            <p>Ingresa tus datos para asociar tu calificación al examen.</p>

            <form id="form-estudiante">
              <div class="campo">
                <label for="est-id">Número de identificación</label>
                <input type="text" id="est-id" placeholder="Ej: 1098765432" required>
              </div>

              <div class="campo">
                <label for="est-nombre">Nombre completo</label>
                <input type="text" id="est-nombre" placeholder="Ej: María Fernanda Gómez" required>
              </div>

              <div class="botones-modal">
                <button type="button" class="q-btn btn-flat" id="btn-cancelar-modal">Cancelar</button>
                <button type="submit" class="q-btn btn-positive">Comenzar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.configurarEventos(examenes);
  }

  configurarEventos(examenes) {
    const modal = this.shadowRoot.getElementById('modal-registro');
    const tituloModal = this.shadowRoot.getElementById('modal-titulo-examen');
    const form = this.shadowRoot.getElementById('form-estudiante');

    this.shadowRoot.querySelectorAll('.btn-elegir').forEach(btn => {
      btn.addEventListener('click', () => {
        const codigo = btn.dataset.codigo;
        this.examenSeleccionado = examenes.find(e => e.codigo === codigo);
        if (!this.examenSeleccionado) return;

        tituloModal.textContent = this.examenSeleccionado.titulo;
        modal.classList.add('activo');
      });
    });

    this.shadowRoot.getElementById('btn-cancelar-modal').addEventListener('click', () => {
      modal.classList.remove('activo');
      this.examenSeleccionado = null;
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const identificacion = this.shadowRoot.getElementById('est-id').value.trim();
      const nombre = this.shadowRoot.getElementById('est-nombre').value.trim();

      if (!this.examenSeleccionado) return;

      this.dispatchEvent(new CustomEvent('navegar', {
        detail: {
          ruta: 'resolver',
          datosExtra: {
            examen: this.examenSeleccionado,
            estudiante: { identificacion, nombre }
          }
        },
        bubbles: true,
        composed: true
      }));
    });
  }
}

customElements.define('vista-cartelera', VistaCartelera);