import { guardarResultado } from '../storage.js';

class VistaResolver extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.datosInicio = null;
    this.intervalo = null;
    this.segundosRestantes = 0;
    this.examenFinalizado = false;
  }

  connectedCallback() {
    if (!this.datosInicio || !this.datosInicio.examen) {
      this.irACartelera();
      return;
    }

    this.segundosRestantes = this.datosInicio.examen.tiempo * 60;
    this.render();
    this.iniciarReloj();
  }

  disconnectedCallback() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  irACartelera() {
    this.dispatchEvent(new CustomEvent('navegar', {
      detail: { ruta: 'cartelera' },
      bubbles: true,
      composed: true
    }));
  }

  formatearTiempo(totalSegundos) {
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }

  iniciarReloj() {
    const visorReloj = this.shadowRoot.getElementById('reloj');

    this.intervalo = setInterval(() => {
      this.segundosRestantes--;

      if (visorReloj) {
        visorReloj.textContent = this.formatearTiempo(Math.max(0, this.segundosRestantes));

        if (this.segundosRestantes <= 60) {
          visorReloj.classList.add('urgente');
        }
      }

      if (this.segundosRestantes <= 0) {
        clearInterval(this.intervalo);
        this.finalizarExamen(true);
      }
    }, 1000);
  }

  finalizarExamen(porTiempoAgotado = false) {
    if (this.examenFinalizado) return;
    this.examenFinalizado = true;

    if (this.intervalo) {
      clearInterval(this.intervalo);
    }

    const { examen, estudiante } = this.datosInicio;
    const totalPreguntas = examen.preguntas.length;
    let aciertos = 0;

    examen.preguntas.forEach((pregunta, indexPregunta) => {
      const seleccionada = this.shadowRoot.querySelector(`input[name="pregunta-${indexPregunta}"]:checked`);
      if (seleccionada) {
        const indiceRespuesta = Number(seleccionada.value);
        if (pregunta.respuestas[indiceRespuesta]?.correcta) {
          aciertos++;
        }
      }
    });

    const porcentajeObtenido = totalPreguntas > 0
      ? Math.round((aciertos / totalPreguntas) * 100)
      : 0;
    const aprobado = porcentajeObtenido >= examen.porcentajeAprobacion;

    guardarResultado({
      codigoExamen: examen.codigo,
      tituloExamen: examen.titulo,
      identificacionEstudiante: estudiante.identificacion,
      nombreEstudiante: estudiante.nombre,
      aciertos,
      totalPreguntas,
      porcentajeObtenido,
      aprobado,
      fecha: new Date().toLocaleString()
    });

    this.mostrarResultado({
      aciertos,
      totalPreguntas,
      porcentajeObtenido,
      porcentajeRequerido: examen.porcentajeAprobacion,
      aprobado,
      porTiempoAgotado
    });
  }

  mostrarResultado(datos) {
    const contenedor = this.shadowRoot.getElementById('contenedor-principal');
    const { estudiante, examen } = this.datosInicio;

    contenedor.innerHTML = `
      <div class="q-card tarjeta-resultado">
        <div class="banner-estado ${datos.aprobado ? 'aprobado' : 'reprobado'}">
          <h2>${datos.aprobado ? '¡Examen Aprobado!' : 'Examen No Aprobado'}</h2>
        </div>

        <div class="resultado-body">
          ${datos.porTiempoAgotado ? '<p class="aviso-tiempo">⏰ Tiempo agotado. El examen se envió automáticamente.</p>' : ''}
          
          <p class="estudiante-resumen">
            <strong>${estudiante.nombre}</strong> (ID: ${estudiante.identificacion})<br>
            ${examen.titulo}
          </p>

          <div class="porcentaje-grande ${datos.aprobado ? 'texto-aprobado' : 'texto-reprobado'}">
            ${datos.porcentajeObtenido}%
          </div>
          
          <p class="detalle-aciertos">
            Acertaste <strong>${datos.aciertos}</strong> de <strong>${datos.totalPreguntas}</strong> preguntas<br>
            <small>Mínimo requerido: ${datos.porcentajeRequerido}%</small>
          </p>

          <button id="btn-volver" class="q-btn btn-volver">Volver a Exámenes</button>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('btn-volver').addEventListener('click', () => {
      this.irACartelera();
    });
  }

  render() {
    const { examen, estudiante } = this.datosInicio;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 780px;
          margin: 0 auto;
          animation: aparecer 0.25s ease;
        }

        @keyframes aparecer {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .q-card {
          background-color: #ffffff;
          border-radius: 4px;
          box-shadow: var(--q-shadow-2);
          margin-bottom: 16px;
          overflow: hidden;
        }

        .encabezado-examen {
          border-left: 5px solid var(--q-primary, #1976D2);
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          position: sticky;
          top: 72px;
          z-index: 50;
        }

        .info-examen h2 {
          margin: 0 0 6px 0;
          color: var(--q-dark, #1D1D1D);
          font-size: 1.3rem;
          font-weight: 500;
        }

        .meta-datos {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          font-size: 0.85rem;
          color: rgba(0, 0, 0, 0.65);
        }

        .caja-reloj {
          background-color: #f5f5f5;
          border: 1px solid rgba(0, 0, 0, 0.12);
          padding: 8px 16px;
          border-radius: 4px;
          text-align: center;
          min-width: 115px;
        }

        .caja-reloj span {
          display: block;
          font-size: 0.7rem;
          color: rgba(0, 0, 0, 0.54);
          font-weight: 500;
          text-transform: uppercase;
        }

        #reloj {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--q-primary, #1976D2);
          font-variant-numeric: tabular-nums;
        }

        #reloj.urgente {
          color: var(--q-negative, #C10015);
          animation: parpadeo 1s infinite;
        }

        @keyframes parpadeo {
          50% { opacity: 0.4; }
        }

        .tarjeta-pregunta {
          padding: 20px;
        }

        .titulo-pregunta {
          font-size: 1rem;
          font-weight: 500;
          color: var(--q-dark, #1D1D1D);
          margin: 0 0 14px 0;
        }

        /* Estilo q-item seleccionable */
        .opcion-label {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border: 1px solid rgba(0, 0, 0, 0.14);
          border-radius: 4px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease;
          color: rgba(0, 0, 0, 0.85);
          font-size: 0.95rem;
        }

        .opcion-label:hover {
          background-color: rgba(25, 118, 210, 0.06);
          border-color: var(--q-primary, #1976D2);
        }

        input[type="radio"] {
          width: 18px;
          height: 18px;
          accent-color: var(--q-primary, #1976D2);
          cursor: pointer;
        }

        .q-btn {
          font-family: inherit;
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 0.04em;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: var(--q-shadow-2);
          transition: opacity 0.2s;
        }

        .q-btn:hover {
          opacity: 0.92;
        }

        .btn-terminar {
          width: 100%;
          padding: 14px;
          background-color: var(--q-positive, #21BA45);
          color: #ffffff;
          font-size: 0.95rem;
          margin-top: 8px;
        }

        /* Tarjeta final centrada */
        .tarjeta-resultado {
          max-width: 480px;
          margin: 2rem auto;
          text-align: center;
        }

        .banner-estado {
          padding: 20px;
          color: #ffffff;
        }

        .banner-estado h2 {
          margin: 0;
          font-weight: 500;
          font-size: 1.4rem;
        }

        .banner-estado.aprobado {
          background-color: var(--q-positive, #21BA45);
        }

        .banner-estado.reprobado {
          background-color: var(--q-negative, #C10015);
        }

        .resultado-body {
          padding: 24px;
        }

        .aviso-tiempo {
          background-color: var(--q-warning, #F2C037);
          color: #1d1d1d;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .estudiante-resumen {
          color: rgba(0, 0, 0, 0.65);
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .porcentaje-grande {
          font-size: 3.2rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 8px;
        }

        .texto-aprobado { color: var(--q-positive, #21BA45); }
        .texto-reprobado { color: var(--q-negative, #C10015); }

        .detalle-aciertos {
          color: rgba(0, 0, 0, 0.75);
          margin-bottom: 24px;
        }

        .btn-volver {
          padding: 11px 24px;
          background-color: var(--q-primary, #1976D2);
          color: #ffffff;
          font-size: 0.88rem;
        }
      </style>

      <div id="contenedor-principal">
        <div class="q-card encabezado-examen">
          <div class="info-examen">
            <h2>${examen.titulo}</h2>
            <div class="meta-datos">
              <span>Estudiante: <strong>${estudiante.nombre}</strong></span>
              <span>Preguntas: <strong>${examen.preguntas.length}</strong></span>
              <span>Mínimo: <strong>${examen.porcentajeAprobacion}%</strong></span>
            </div>
          </div>

          <div class="caja-reloj">
            <span>Tiempo restante</span>
            <div id="reloj">${this.formatearTiempo(this.segundosRestantes)}</div>
          </div>
        </div>

        <form id="form-respuestas">
          ${examen.preguntas.map((pregunta, idxPregunta) => `
            <div class="q-card tarjeta-pregunta">
              <p class="titulo-pregunta">${idxPregunta + 1}. ${pregunta.texto}</p>
              
              ${pregunta.respuestas.map((resp, idxResp) => `
                <label class="opcion-label">
                  <input type="radio" name="pregunta-${idxPregunta}" value="${idxResp}">
                  <span>${resp.texto}</span>
                </label>
              `).join('')}
            </div>
          `).join('')}

          <button type="submit" class="q-btn btn-terminar">Terminar Examen</button>
        </form>
      </div>
    `;

    this.shadowRoot.getElementById('form-respuestas').addEventListener('submit', (e) => {
      e.preventDefault();
      if (confirm('¿Seguro que deseas enviar tus respuestas y terminar el examen?')) {
        this.finalizarExamen(false);
      }
    });
  }
}

customElements.define('vista-resolver', VistaResolver);