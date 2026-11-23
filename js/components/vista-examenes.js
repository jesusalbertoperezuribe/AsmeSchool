import { obtenerExamenes, guardarExamen, eliminarExamen } from '../storage.js';

class VistaExamenes extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.modoEdicion = false;
    // Aquí guardamos temporalmente las preguntas mientras armamos o editamos un examen
    this.preguntasTemp = [];
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

        h2 {
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .contenedor-dos-columnas {
          display: grid;
          grid-template-columns: 1.1fr 1.5fr;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 900px) {
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

        .fila-doble {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }

        .campo {
          margin-bottom: 0.9rem;
        }

        label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.3rem;
        }

        input[type="text"],
        input[type="number"],
        textarea {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.9rem;
          box-sizing: border-box;
          font-family: inherit;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #0284c7;
        }

        input:disabled {
          background-color: #f1f5f9;
          cursor: not-allowed;
        }

        /* Caja interna para crear preguntas */
        .caja-preguntas {
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .caja-preguntas h4 {
          margin: 0 0 0.75rem 0;
          color: #1e293b;
          font-size: 0.95rem;
        }

        .opcion-fila {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .opcion-fila input[type="radio"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #16a34a;
        }

        .lista-preguntas-agregadas {
          margin-top: 0.8rem;
          padding-top: 0.8rem;
          border-top: 1px dashed #cbd5e1;
        }

        .item-pregunta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          margin-bottom: 0.4rem;
          font-size: 0.85rem;
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

        .btn-agregar-opcion {
          background-color: #e2e8f0;
          color: #334155;
          font-size: 0.8rem;
          padding: 0.4rem 0.7rem;
        }

        .btn-agregar-pregunta {
          background-color: #16a34a;
          color: white;
          width: 100%;
          margin-top: 0.5rem;
          font-size: 0.85rem;
        }

        .botones-form {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.2rem;
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

        .btn-quitar-mini {
          background-color: #ef4444;
          color: white;
          padding: 0.2rem 0.5rem;
          font-size: 0.75rem;
        }
      </style>

      <h2>Gestión de Exámenes</h2>

      <div class="contenedor-dos-columnas">
        <!-- CAJA IZQUIERDA: FORMULARIO DEL EXAMEN Y PREGUNTAS -->
        <div class="tarjeta">
          <h3 id="titulo-form">Crear Nuevo Examen</h3>
          <form id="form-examen">
            <div class="fila-doble">
              <div class="campo">
                <label for="codigo">Código</label>
                <input type="text" id="codigo" placeholder="Ej: MAT-01" required>
              </div>
              <div class="campo">
                <label for="titulo">Título del examen</label>
                <input type="text" id="titulo" placeholder="Ej: Álgebra Básica" required>
              </div>
            </div>

            <div class="fila-doble">
              <div class="campo">
                <label for="tiempo">Tiempo (Minutos)</label>
                <input type="number" id="tiempo" min="1" placeholder="Ej: 15" required>
              </div>
              <div class="campo">
                <label for="porcentaje">Porcentaje aprobación (%)</label>
                <input type="number" id="porcentaje" min="1" max="100" placeholder="Ej: 60" required>
              </div>
            </div>

            <div class="campo">
              <label for="descripcion">Descripción del examen</label>
              <textarea id="descripcion" rows="2" placeholder="Instrucciones o temas del examen..." required></textarea>
            </div>

            <!-- CONSTRUCTOR DE PREGUNTAS -->
            <div class="caja-preguntas">
              <h4>Agregar Pregunta (Marca el círculo de la correcta)</h4>
              <div class="campo">
                <input type="text" id="texto-pregunta" placeholder="Escribe aquí la pregunta...">
              </div>

              <div id="contenedor-opciones">
                <div class="opcion-fila">
                  <input type="radio" name="respuesta-correcta" value="0" checked title="Marcar como correcta">
                  <input type="text" class="input-opcion" placeholder="Opción 1">
                </div>
                <div class="opcion-fila">
                  <input type="radio" name="respuesta-correcta" value="1" title="Marcar como correcta">
                  <input type="text" class="input-opcion" placeholder="Opción 2">
                </div>
                <div class="opcion-fila">
                  <input type="radio" name="respuesta-correcta" value="2" title="Marcar como correcta">
                  <input type="text" class="input-opcion" placeholder="Opción 3">
                </div>
              </div>

              <button type="button" id="btn-mas-opcion" class="btn-agregar-opcion">+ Otra opción</button>
              <button type="button" id="btn-agregar-pregunta" class="btn-agregar-pregunta">+ Añadir Pregunta al Examen</button>

              <!-- Lista de preguntas ya añadidas a este examen -->
              <div class="lista-preguntas-agregadas" id="lista-preguntas"></div>
            </div>

            <div class="botones-form">
              <button type="submit" class="btn-guardar" id="btn-submit">Guardar Examen</button>
              <button type="button" class="btn-cancelar" id="btn-cancelar">Cancelar</button>
            </div>
          </form>
        </div>

        <!-- CAJA DERECHA: TABLA DE EXÁMENES -->
        <div class="tarjeta">
          <h3>Exámenes Registrados</h3>
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
                      <button class="btn-editar" data-codigo="${ex.codigo}">Editar</button>
                      <button class="btn-eliminar" data-codigo="${ex.codigo}">Eliminar</button>
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

  // Dibuja las preguntas que se van agregando antes de guardar el examen
  dibujarListaPreguntas() {
    const contenedor = this.shadowRoot.getElementById('lista-preguntas');
    if (this.preguntasTemp.length === 0) {
      contenedor.innerHTML = '<small style="color:#64748b;">Aún no has agregado preguntas a este examen.</small>';
      return;
    }

    contenedor.innerHTML = `
      <label>Preguntas listas (${this.preguntasTemp.length}):</label>
      ${this.preguntasTemp.map((p, index) => `
        <div class="item-pregunta">
          <span><strong>${index + 1}.</strong> ${p.texto} (${p.respuestas.length} opciones)</span>
          <button type="button" class="btn-quitar-mini" data-index="${index}">X</button>
        </div>
      `).join('')}
    `;

    // Botón para quitar una pregunta de la lista temporal
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

    // 1. Añadir una fila de opción extra (por si quiere 4 o 5 opciones)
    this.shadowRoot.getElementById('btn-mas-opcion').addEventListener('click', () => {
      const total = contenedorOpciones.querySelectorAll('.opcion-fila').length;
      const fila = document.createElement('div');
      fila.className = 'opcion-fila';
      fila.innerHTML = `
        <input type="radio" name="respuesta-correcta" value="${total}" title="Marcar como correcta">
        <input type="text" class="input-opcion" placeholder="Opción ${total + 1}">
      `;
      contenedorOpciones.appendChild(fila);
    });

    // 2. Añadir la pregunta al listado temporal del examen
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

      // Verificamos que la opción marcada como correcta no haya quedado vacía
      if (!respuestas.some(r => r.correcta)) {
        respuestas[0].correcta = true;
      }

      this.preguntasTemp.push({
        texto: textoPregunta,
        respuestas
      });

      // Limpiamos los campos de la pregunta para escribir la siguiente
      this.shadowRoot.getElementById('texto-pregunta').value = '';
      inputsOpciones.forEach(inp => (inp.value = ''));
      this.dibujarListaPreguntas();
    });

    // 3. Guardar o actualizar el examen completo
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

    // 4. Cancelar edición
    this.shadowRoot.getElementById('btn-cancelar').addEventListener('click', () => {
      this.modoEdicion = false;
      this.preguntasTemp = [];
      this.render();
    });

    // 5. Editar examen existente
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

        // Cargamos una copia de sus preguntas para poder editarlas
        this.preguntasTemp = JSON.parse(JSON.stringify(examen.preguntas));
        this.dibujarListaPreguntas();

        this.shadowRoot.getElementById('titulo-form').textContent = 'Actualizar Examen';
        this.shadowRoot.getElementById('btn-submit').textContent = 'Actualizar Examen';
        this.shadowRoot.getElementById('btn-cancelar').style.display = 'inline-block';
        this.modoEdicion = true;
      });
    });

    // 6. Eliminar examen
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