import { obtenerExamenes, guardarExamen, eliminarExamen } from '../storage.js';

class VistaExamenes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.modoEdicion = false;
    this.preguntasTemp = [];
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

#form-examen {
  width: 100%;
  max-width: 370px;
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
          grid-template-columns: 420px 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 920px) {
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

        .fila-doble {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .campo {
          margin-bottom: 12px;
        }

        label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.7);
          margin-bottom: 4px;
        }

        input[type="text"],
        input[type="number"],
        textarea {
          width: 100%;
          font-family: inherit;
          padding: 9px 12px;
          border: 1px solid rgba(0, 0, 0, 0.24);
          border-radius: 4px;
          font-size: 0.9rem;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: var(--q-primary, #1976D2);
          box-shadow: inset 0 0 0 1px var(--q-primary, #1976D2);
        }

        input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .caja-preguntas {
          background-color: #fafafa;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 4px;
          padding: 14px;
          margin-top: 12px;
        }

        .caja-preguntas h4 {
          margin: 0 0 10px 0;
          color: var(--q-dark, #1D1D1D);
          font-weight: 500;
          font-size: 0.92rem;
        }

        .opcion-fila {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .opcion-fila input[type="radio"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--q-positive, #21BA45);
        }

        .lista-preguntas-agregadas {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.12);
        }

        .item-pregunta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          padding: 8px 10px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 4px;
          margin-bottom: 6px;
          font-size: 0.84rem;
        }

        .q-btn {
          font-family: inherit;
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 9px 14px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.82rem;
          box-shadow: var(--q-shadow-1);
          transition: opacity 0.2s;
        }

        .q-btn:hover {
          opacity: 0.9;
        }

        .btn-outlined {
          background-color: #ffffff;
          color: var(--q-primary, #1976D2);
          border: 1px solid var(--q-primary, #1976D2);
          box-shadow: none;
          padding: 6px 10px;
          font-size: 0.78rem;
        }

        .btn-agregar-pregunta {
          background-color: var(--q-secondary, #26A69A);
          color: #ffffff;
          width: 100%;
          margin-top: 8px;
        }

        .botones-form {
          display: flex;
          gap: 8px;
          margin-top: 16px;
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

        .btn-quitar-mini {
          background-color: var(--q-negative, #C10015);
          color: #ffffff;
          padding: 3px 8px;
          font-size: 0.72rem;
        }
      </style>

      <h2>Gestión de Exámenes</h2>

      <div class="contenedor-dos-columnas">
        <div class="q-card">
          <div class="q-card-header" id="titulo-form">Crear Nuevo Examen</div>
          <div class="q-card-body">
            <form id="form-examen">
              <div class="fila-doble">
                <div class="campo">
                  <label for="codigo">Código</label>
                  <input type="text" id="codigo" placeholder="Ej: HIST-02" required>
                </div>
                <div class="campo">
                  <label for="titulo">Título</label>
                  <input type="text" id="titulo" placeholder="Ej: Edad Media" required>
                </div>
              </div>

              <div class="fila-doble">
                <div class="campo">
                  <label for="tiempo">Tiempo (Minutos)</label>
                  <input type="number" id="tiempo" min="1" placeholder="Ej: 15" required>
                </div>
                <div class="campo">
                  <label for="porcentaje">Aprobación (%)</label>
                  <input type="number" id="porcentaje" min="1" max="100" placeholder="Ej: 60" required>
                </div>
              </div>

              <div class="campo">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" rows="2" placeholder="Temas o instrucciones..." required></textarea>
              </div>

              <div class="caja-preguntas">
                <h4>Agregar Pregunta (Marca el círculo de la correcta)</h4>
                <div class="campo">
                  <input type="text" id="texto-pregunta" placeholder="Escribe la pregunta...">
                </div>

                <div id="contenedor-opciones">
                  <div class="opcion-fila">
                    <input type="radio" name="respuesta-correcta" value="0" checked>
                    <input type="text" class="input-opcion" placeholder="Opción 1">
                  </div>
                  <div class="opcion-fila">
                    <input type="radio" name="respuesta-correcta" value="1">
                    <input type="text" class="input-opcion" placeholder="Opción 2">
                  </div>
                  <div class="opcion-fila">
                    <input type="radio" name="respuesta-correcta" value="2">
                    <input type="text" class="input-opcion" placeholder="Opción 3">
                  </div>
                </div>

                <button type="button" id="btn-mas-opcion" class="q-btn btn-outlined">+ Otra opción</button>
                <button type="button" id="btn-agregar-pregunta" class="q-btn btn-agregar-pregunta">+ Añadir Pregunta</button>

                <div class="lista-preguntas-agregadas" id="lista-preguntas"></div>
              </div>

              <div class="botones-form">
                <button type="submit" class="q-btn btn-guardar" id="btn-submit">Guardar Examen</button>
                <button type="button" class="q-btn btn-cancelar" id="btn-cancelar">Cancelar</button>
              </div>
            </form>
          </div>
        </div>

        <div class="q-card">
          <div class="q-card-header">Exámenes Registrados</div>
          <div class="tabla-responsive">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Tiempo</th>
                  <th>Aprobación</th>
                  <th>Preguntas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${examenes.map(ex => `
                  <tr>
                    <td><strong>${ex.codigo}</strong></td>
                    <td>${ex.titulo}</td>
                    <td>${ex.tiempo} min</td>
                    <td>${ex.porcentajeAprobacion}%</td>
                    <td>${ex.preguntas.length}</td>
                    <td class="acciones">
                      <button class="q-btn btn-mini btn-editar" data-codigo="${ex.codigo}">Editar</button>
                      <button class="q-btn btn-mini btn-eliminar" data-codigo="${ex.codigo}">Eliminar</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    this.dibujarListaPreguntas();
    this.configurarEventos();
  }

  dibujarListaPreguntas() {
    const contenedor = this.shadowRoot.getElementById('lista-preguntas');
    if (this.preguntasTemp.length === 0) {
      contenedor.innerHTML = '<small style="color:rgba(0,0,0,0.5);">Aún no has añadido preguntas.</small>';
      return;
    }

    contenedor.innerHTML = `
      <label>Preguntas listas (${this.preguntasTemp.length}):</label>
      ${this.preguntasTemp.map((p, index) => `
        <div class="item-pregunta">
          <span><strong>${index + 1}.</strong> ${p.texto} (${p.respuestas.length} opc.)</span>
          <button type="button" class="q-btn btn-quitar-mini" data-index="${index}">X</button>
        </div>
      `).join('')}
    `;

    contenedor.querySelectorAll('.btn-quitar-mini').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.index);
        this.preguntasTemp.splice(idx, 1);
        this.dibujarListaPreguntas();
      });
    });
  }

  configurarEventos() {
    const form = this.shadowRoot.getElementById('form-examen');
    const inputCodigo = this.shadowRoot.getElementById('codigo');
    const contenedorOpciones = this.shadowRoot.getElementById('contenedor-opciones');

    this.shadowRoot.getElementById('btn-mas-opcion').addEventListener('click', () => {
      const total = contenedorOpciones.querySelectorAll('.opcion-fila').length;
      const fila = document.createElement('div');
      fila.className = 'opcion-fila';
      fila.innerHTML = `
        <input type="radio" name="respuesta-correcta" value="${total}">
        <input type="text" class="input-opcion" placeholder="Opción ${total + 1}">
      `;
      contenedorOpciones.appendChild(fila);
    });

    this.shadowRoot.getElementById('btn-agregar-pregunta').addEventListener('click', () => {
      const textoPregunta = this.shadowRoot.getElementById('texto-pregunta').value.trim();
      const inputsOpciones = Array.from(contenedorOpciones.querySelectorAll('.input-opcion'));
      const radioSeleccionado = this.shadowRoot.querySelector('input[name="respuesta-correcta"]:checked');

      if (!textoPregunta) {
        alert('Escribe el enunciado de la pregunta primero.');
        return;
      }

      const indiceCorrecto = radioSeleccionado ? Number(radioSeleccionado.value) : 0;
      const respuestas = [];

      inputsOpciones.forEach((input, idx) => {
        if (input.value.trim() !== '') {
          respuestas.push({
            texto: input.value.trim(),
            correcta: idx === indiceCorrecto
          });
        }
      });

      if (respuestas.length < 2) {
        alert('Escribe al menos 2 opciones de respuesta.');
        return;
      }

      if (!respuestas.some(r => r.correcta)) {
        respuestas[0].correcta = true;
      }

      this.preguntasTemp.push({ texto: textoPregunta, respuestas });

      this.shadowRoot.getElementById('texto-pregunta').value = '';
      inputsOpciones.forEach(inp => (inp.value = ''));
      this.dibujarListaPreguntas();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (this.preguntasTemp.length === 0) {
        alert('Debes añadir al menos 1 pregunta al examen antes de guardarlo.');
        return;
      }

      const examen = {
        codigo: inputCodigo.value.trim(),
        titulo: this.shadowRoot.getElementById('titulo').value.trim(),
        tiempo: Number(this.shadowRoot.getElementById('tiempo').value),
        porcentajeAprobacion: Number(this.shadowRoot.getElementById('porcentaje').value),
        descripcion: this.shadowRoot.getElementById('descripcion').value.trim(),
        preguntas: this.preguntasTemp
      };

      guardarExamen(examen);
      this.modoEdicion = false;
      this.preguntasTemp = [];
      this.render();
    });

    this.shadowRoot.getElementById('btn-cancelar').addEventListener('click', () => {
      this.modoEdicion = false;
      this.preguntasTemp = [];
      this.render();
    });

    this.shadowRoot.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        const codigo = btn.dataset.codigo;
        const examen = obtenerExamenes().find(ex => ex.codigo === codigo);
        if (!examen) return;

        inputCodigo.value = examen.codigo;
        inputCodigo.disabled = true;
        this.shadowRoot.getElementById('titulo').value = examen.titulo;
        this.shadowRoot.getElementById('tiempo').value = examen.tiempo;
        this.shadowRoot.getElementById('porcentaje').value = examen.porcentajeAprobacion;
        this.shadowRoot.getElementById('descripcion').value = examen.descripcion;

        this.preguntasTemp = JSON.parse(JSON.stringify(examen.preguntas));
        this.dibujarListaPreguntas();

        this.shadowRoot.getElementById('titulo-form').textContent = 'Actualizar Examen';
        this.shadowRoot.getElementById('btn-submit').textContent = 'Actualizar';
        this.shadowRoot.getElementById('btn-cancelar').style.display = 'inline-block';
        this.modoEdicion = true;
      });
    });

    this.shadowRoot.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        const codigo = btn.dataset.codigo;
        if (confirm(`¿Seguro que deseas eliminar el examen ${codigo}?`)) {
          eliminarExamen(codigo);
          this.render();
        }
      });
    });
  }
}

customElements.define('vista-examenes', VistaExamenes);