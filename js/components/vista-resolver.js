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
    // Si alguien intenta entrar sin haber elegido examen, lo devolvemos a la cartelera
    if (!this.datosInicio || !this.datosInicio.examen) {
      this.irACartelera();
      return;
    }

    // Convertimos los minutos del examen a segundos para el reloj
    this.segundosRestantes = this.datosInicio.examen.tiempo * 60;
    this.render();
    this.iniciarReloj();
  }

  // Si el usuario cierra o cambia de pantalla antes de terminar, apagamos el reloj
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

  // Formatea los segundos a estilo reloj digital (Ej: 04:59)
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

        // Si queda menos de 1 minuto, ponemos el reloj en rojo para avisar
        if (this.segundosRestantes <= 60) {
          visorReloj.classList.add('urgente');
        }
      }

      // Cuando el reloj llega a 0, el examen se entrega automáticamente
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

    // Revisamos pregunta por pregunta qué marcó el estudiante
    examen.preguntas.forEach((pregunta, indexPregunta) => {
      const seleccionada = this.shadowRoot.querySelector(`input[name="pregunta-${indexPregunta}"]:checked`);
      if (seleccionada) {
        const indiceRespuesta = Number(seleccionada.value);
        if (pregunta.respuestas[indiceRespuesta]?.correcta) {
          aciertos++;
        }
      }
    });

    // Calculamos el porcentaje obtenido y verificamos si aprobó
    const porcentajeObtenido = totalPreguntas > 0
      ? Math.round((aciertos / totalPreguntas) * 100)
      : 0;
    const aprobado = porcentajeObtenido >= examen.porcentajeAprobacion;

    // Guardamos el resultado asociado al estudiante en localStorage
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

    // Mostramos la pantalla final con la nota
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
      <div class="tarjeta-resultado">
        ${datos.porTiempoAgotado ? '<p class="aviso-tiempo">⏰ ¡Se acabó el tiempo! El examen se envió automáticamente.</p>' : ''}
        
        <div class="icono-estado">${datos.aprobado ? '🎉' : '📚'}</div>
        <h2>${datos.aprobado ? '¡Felicitaciones, Aprobaste!' : 'Examen No Aprobado'}</h2>
        <p class="estudiante-resumen">
          <strong>${estudiante.nombre}</strong> (ID: ${estudiante.identificacion})<br>
          Examen: ${examen.titulo}
        </p>

        <div class="puntaje-caja ${datos.aprobado ? 'aprobado' : 'reprobado'}">
          <span class="porcentaje-grande">${datos.porcentajeObtenido}%</span>
          <span>Respondiste correctamente <strong>${datos.aciertos}</strong> de <strong>${datos.totalPreguntas}</strong> preguntas</span>
          <small>Porcentaje mínimo requerido: ${datos.porcentajeRequerido}%</small>
        </div>

        <button id="btn-volver" class="btn-volver">Volver a Exámenes Disponibles</button>
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
          max-width: 900px;
          margin: 2rem auto;
          padding: 0 1.5rem;
          animation: aparecer 0.3s ease;
        }

        @keyframes aparecer {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Encabezado fijo con datos del examen y el reloj */
        .encabezado-examen {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 6px solid #0284c7;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          position: sticky;
          top: 70px;
          z-index: 50;
        }

        .info-examen h2 {
          margin: 0 0 0.4rem 0;
          color: #1e293b;
          font-size: 1.4rem;
        }

        .meta-datos {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.9rem;
          color: #475569;
        }

        .caja-reloj {
          background-color: #f1f5f9;
          padding: 0.75rem 1.2rem;
          border-radius: 10px;
          text-align: center;
          min-width: 120px;
        }

        .caja-reloj span {
          display: block;
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }

        #reloj {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0284c7;
          font-variant-numeric: tabular-nums;
        }

        #reloj.urgente {
          color: #dc2626;
          animation: parpadeo 1s infinite;
        }

        @keyframes parpadeo {
          50% { opacity: 0.5; }
        }

        /* Tarjetas de cada pregunta */
        .tarjeta-pregunta {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .titulo-pregunta {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .opcion-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          margin-bottom: 0.6rem;
          cursor: pointer;
          transition: all 0.15s ease;
          color: #334155;
        }

        .opcion-label:hover {
          background-color: #f0f9ff;
          border-color: #0284c7;
        }

        input[type="radio"] {
          width: 18px;
          height: 18px;
          accent-color: #0284c7;
          cursor: pointer;
        }

        .btn-terminar {
          width: 100%;
          padding: 1rem;
          background-color: #16a34a;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 1rem;
          transition: background-color 0.2s;
        }

        .btn-terminar:hover {
          background-color: #15803d;
        }

        /* Estilos de la vista de resultado final */
        .tarjeta-resultado {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 2.5rem 2rem;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          max-width: 550px;
          margin: 2rem auto;
        }

        .aviso-tiempo {
          background-color: #fef3c7;
          color: #92400e;
          padding: 0.6rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .icono-estado {
          font-size: 3.5rem;
          margin-bottom: 0.5rem;
        }

        .estudiante-resumen {
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .puntaje-caja {
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .puntaje-caja.aprobado {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .puntaje-caja.reprobado {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .porcentaje-grande {
          font-size: 3rem;
          font-weight: 800;
        }

        .btn-volver {
          padding: 0.85rem 1.5rem;
          background-color: #0284c7;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-volver:hover {
          background-color: #0369a1;
        }
      </style>

      <div id="contenedor-principal">
        <!-- ENCABEZADO DEL EXAMEN -->
        <div class="encabezado-examen">
          <div class="info-examen">
            <h2>${examen.titulo}</h2>
            <div class="meta-datos">
              <span>👤 Estudiante: <strong>${estudiante.nombre}</strong></span>
              <span>📝 Total preguntas: <strong>${examen.preguntas.length}</strong></span>
              <span>🎯 Para aprobar: <strong>${examen.porcentajeAprobacion}%</strong></span>
            </div>
          </div>

          <div class="caja-reloj">
            <span>Tiempo restante</span>
            <div id="reloj">${this.formatearTiempo(this.segundosRestantes)}</div>
          </div>
        </div>

        <!-- LISTA DE PREGUNTAS ENUMERADAS -->
        <form id="form-respuestas">
          ${examen.preguntas.map((pregunta, idxPregunta) => `
            <div class="tarjeta-pregunta">
              <p class="titulo-pregunta">${idxPregunta + 1}. ${pregunta.texto}</p>
              
              ${pregunta.respuestas.map((resp, idxResp) => `
                <label class="opcion-label">
                  <input type="radio" name="pregunta-${idxPregunta}" value="${idxResp}">
                  <span>${resp.texto}</span>
                </label>
              `).join('')}
            </div>
          `).join('')}

          <button type="submit" class="btn-terminar">Terminar Examen</button>
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