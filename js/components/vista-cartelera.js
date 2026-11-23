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

        .encabezado {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .encabezado h2 {
          color: #1e293b;
          font-size: 1.8rem;
          margin: 0 0 0.5rem 0;
        }

        .encabezado p {
          color: #64748b;
          margin: 0;
        }

        /* Cuadrícula adaptable para las tarjetas de exámenes */
        .grid-examenes {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .tarjeta-examen {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .tarjeta-examen:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .codigo-badge {
          display: inline-block;
          background-color: #e0f2fe;
          color: #0369a1;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          margin-bottom: 0.75rem;
          align-self: flex-start;
        }

        .tarjeta-examen h3 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 1.25rem;
        }

        .descripcion {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0 0 1.2rem 0;
          line-height: 1.4;
        }

        .detalles {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 0.8rem;
          margin-bottom: 1.2rem;
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #334155;
        }

        .detalles span strong {
          color: #0284c7;
        }

        button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-elegir {
          background-color: #0284c7;
          color: #ffffff;
        }

        .btn-elegir:hover {
          background-color: #0369a1;
        }

        /* Modal emergente para pedir datos del estudiante */
        .fondo-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(15, 23, 42, 0.6);
          display: none;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          box-sizing: border-box;
          z-index: 200;
        }

        .fondo-modal.activo {
          display: flex;
          animation: aparecer 0.2s ease;
        }

        .caja-modal {
          background-color: #ffffff;
          width: 100%;
          max-width: 420px;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }

        .caja-modal h3 {
          margin: 0 0 0.4rem 0;
          color: #1e293b;
        }

        .caja-modal p {
          margin: 0 0 1.2rem 0;
          color: #64748b;
          font-size: 0.9rem;
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

        input {
          width: 100%;
          padding: 0.7rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.95rem;
          box-sizing: border-box;
        }

        input:focus {
          outline: none;
          border-color: #0284c7;
        }

        .botones-modal {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .btn-comenzar {
          background-color: #16a34a;
          color: white;
        }

        .btn-comenzar:hover {
          background-color: #15803d;
        }

        .btn-cerrar {
          background-color: #e2e8f0;
          color: #334155;
        }

        .btn-cerrar:hover {
          background-color: #cbd5e1;
        }

        .vacio {
          text-align: center;
          padding: 3rem;
          background: #ffffff;
          border-radius: 12px;
          color: #64748b;
          border: 1px dashed #cbd5e1;
        }
      </style>

      <div class="encabezado">
        <h2>Exámenes Disponibles</h2>
        <p>Selecciona una evaluación para comenzar. No requiere contraseña.</p>
      </div>

      ${examenes.length === 0 ? `
        <div class="vacio">
          <h3>No hay exámenes disponibles en este momento</h3>
          <p>Pide a un docente que registre un examen desde el panel privado.</p>
        </div>
      ` : `
        <div class="grid-examenes">
          ${examenes.map(ex => `
            <div class="tarjeta-examen">
              <div>
                <span class="codigo-badge">${ex.codigo}</span>
                <h3>${ex.titulo}</h3>
                <p class="descripcion">${ex.descripcion}</p>
              </div>

              <div>
                <div class="detalles">
                  <span>⏱️ Tiempo: <strong>${ex.tiempo} min</strong></span>
                  <span>🎯 Aprobación: <strong>${ex.porcentajeAprobacion}%</strong></span>
                </div>
                <button class="btn-elegir" data-codigo="${ex.codigo}">Presentar Examen</button>
              </div>
            </div>
          `).join('')}
        </div>
      `}

      <!-- MODAL DE REGISTRO RÁPIDO DEL ESTUDIANTE -->
      <div class="fondo-modal" id="modal-registro">
        <div class="caja-modal">
          <h3 id="modal-titulo-examen">Datos del Estudiante</h3>
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
              <button type="button" class="btn-cerrar" id="btn-cancelar-modal">Cancelar</button>
              <button type="submit" class="btn-comenzar">Comenzar Examen</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.configurarEventos(examenes);
  }

  configurarEventos(examenes) {
    const modal = this.shadowRoot.getElementById('modal-registro');
    const tituloModal = this.shadowRoot.getElementById('modal-titulo-examen');
    const form = this.shadowRoot.getElementById('form-estudiante');

    // 1. Al hacer clic en "Presentar Examen", abrimos el cuadro de registro rápido
    this.shadowRoot.querySelectorAll('.btn-elegir').forEach(btn => {
      btn.addEventListener('click', () => {
        const codigo = btn.dataset.codigo;
        this.examenSeleccionado = examenes.find(e => e.codigo === codigo);
        if (!this.examenSeleccionado) return;

        tituloModal.textContent = this.examenSeleccionado.titulo;
        modal.classList.add('activo');
      });
    });

    // 2. Cerrar el cuadro si el estudiante cancela
    this.shadowRoot.getElementById('btn-cancelar-modal').addEventListener('click', () => {
      modal.classList.remove('activo');
      this.examenSeleccionado = null;
    });

    // 3. Enviar datos del estudiante y saltar a la hoja del examen
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const identificacion = this.shadowRoot.getElementById('est-id').value.trim();
      const nombre = this.shadowRoot.getElementById('est-nombre').value.trim();

      if (!this.examenSeleccionado) return;

      // Le enviamos a main.js el examen elegido y los datos del estudiante
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