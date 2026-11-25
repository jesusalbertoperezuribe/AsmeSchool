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
          min-height: calc(100vh - 112px);
          padding: 20px 8px 32px;
          position: relative;
        }

        /* =========================================================
           1. FONDO ANIMADO DE BIBLIOTECA ACOGEDORA
           ========================================================= */
        .fondo-biblioteca {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 50% 32%, rgba(253, 230, 138, 0.28) 0%, rgba(245, 158, 11, 0.13) 34%, transparent 68%),
            linear-gradient(180deg, #d8a85f 0%, #9b6536 48%, #412617 100%);
        }

        .fondo-biblioteca::after {
          content: "";
          position: absolute;
          inset: -2%;
          background: radial-gradient(ellipse at center, transparent 42%, rgba(35, 18, 8, 0.30) 100%);
          backdrop-filter: blur(1px);
        }

        .biblioteca-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          filter: saturate(1.16);
        }

        .lampara-halo {
          transform-origin: 1210px 260px;
          animation: pulso-lampara 4.8s ease-in-out infinite;
        }

        @keyframes pulso-lampara {
          0%, 100% {
            opacity: 0.72;
            transform: scale(1);
          }
          50% {
            opacity: 0.98;
            transform: scale(1.06);
          }
        }

        .particulas-luz {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
          filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.38));
        }

        .particula {
          position: absolute;
          bottom: -16px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 240, 179, 0.95) 0%, rgba(255, 204, 102, 0.45) 55%, transparent 100%);
          box-shadow: 0 0 10px 2px rgba(255, 214, 120, 0.35);
          animation: flotar-particula var(--dur, 14s) linear infinite;
          animation-delay: var(--delay, 0s);
          opacity: 0;
        }

        @keyframes flotar-particula {
          0% {
            transform: translate3d(0, 0, 0) scale(0.75);
            opacity: 0;
          }
          15% {
            opacity: var(--op, 0.7);
          }
          50% {
            transform: translate3d(var(--drift, 24px), -48vh, 0) scale(1.05);
            opacity: var(--op, 0.7);
          }
          85% {
            opacity: calc(var(--op, 0.7) * 0.6);
          }
          100% {
            transform: translate3d(calc(var(--drift, 24px) * -0.5), -105vh, 0) scale(0.65);
            opacity: 0;
          }
        }

        /* =========================================================
           2. CONTENEDOR CENTRAL Y PERRO ESTUDIOSO ANIMADO
           ========================================================= */
        .login-escena {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 390px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: aparecer-escena 0.35s ease;
        }

        @keyframes aparecer-escena {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mascota-perro {
          position: relative;
          z-index: 3;
          width: 224px;
          height: 148px;
          margin-bottom: -17px;
          pointer-events: none;
          filter: drop-shadow(0 6px 12px rgba(5, 10, 24, 0.38));
        }

        .perro-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          display: block;
        }

        /* Respiración suave en reposo */
        .perro-respiracion {
          transform-origin: 120px 135px;
          animation: respirar-cabeza 3.6s ease-in-out infinite;
        }

        @keyframes respirar-cabeza {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2.5px);
          }
        }

        /* Orejas móviles en reposo */
        .oreja-izq {
          transform-origin: 73px 58px;
          animation: mover-oreja-izq 4.4s ease-in-out infinite;
        }

        .oreja-der {
          transform-origin: 167px 58px;
          animation: mover-oreja-der 4.8s ease-in-out infinite;
        }

        @keyframes mover-oreja-izq {
          0%, 100% { transform: rotate(0deg); }
          35% { transform: rotate(5deg); }
          70% { transform: rotate(-2.5deg); }
        }

        @keyframes mover-oreja-der {
          0%, 100% { transform: rotate(0deg); }
          40% { transform: rotate(-5deg); }
          75% { transform: rotate(2.5deg); }
        }

        /* Parpadeo natural */
        .ojo-parpadeo-izq {
          transform-origin: 97px 80px;
          animation: parpadear 4.6s ease-in-out infinite;
        }

        .ojo-parpadeo-der {
          transform-origin: 143px 80px;
          animation: parpadear 4.6s ease-in-out infinite;
        }

        @keyframes parpadear {
          0%, 91%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.08);
          }
        }

        /* Seguimiento de pupilas hacia #email */
        .pupila-mover {
          transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
          transform: translate(0px, 0px);
        }

        .mascota-perro.mirando-email .pupila-mover {
          transform: translate(var(--mirada-x, 0px), 3.6px);
        }

        /* Patitas apoyadas en el borde y transición para tapar ojos */
        .patita-izq {
          transform-origin: 80px 146px;
          transition: transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
          transform: translate(0px, 0px) rotate(0deg);
        }

        .patita-der {
          transform-origin: 160px 146px;
          transition: transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
          transform: translate(0px, 0px) rotate(0deg);
        }

        .mascota-perro.tapando-ojos .patita-izq {
          transform: translate(17px, -64px) rotate(14deg) scale(1.08);
        }

        .mascota-perro.tapando-ojos .patita-der {
          transform: translate(-17px, -64px) rotate(-14deg) scale(1.08);
        }

        /* Animación de negación cuando falla el login */
        .perro-cabeza-shake {
          transform-origin: 120px 120px;
        }

        .mascota-perro.negando .perro-cabeza-shake {
          animation: negar-cabeza 0.55s ease-in-out;
        }

        @keyframes negar-cabeza {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          20% { transform: translateX(-8px) rotate(-5deg); }
          40% { transform: translateX(8px) rotate(5deg); }
          60% { transform: translateX(-6px) rotate(-3.5deg); }
          80% { transform: translateX(5px) rotate(2.5deg); }
        }

        /* =========================================================
           3. TARJETA ESTILO QUASAR
           ========================================================= */
        .q-card {
          position: relative;
          z-index: 2;
          background-color: #ffffff;
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 12px 32px rgba(4, 12, 28, 0.45), var(--q-shadow-2, 0 2px 6px rgba(0, 0, 0, 0.2));
          overflow: hidden;
        }

        .q-card-header {
          background-color: var(--q-primary, #1976D2);
          color: #ffffff;
          padding: 24px 24px 20px;
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
          opacity: 0.92;
        }

        .q-card-section {
          padding: 24px;
        }

        #form-login {
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
        }

        .campo {
          margin-bottom: 16px;
        }

        label {
          display: block;
          margin-bottom: 4px;
          color: rgba(0, 0, 0, 0.72);
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
          transition: border-color 0.2s, box-shadow 0.2s;
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
          box-shadow: var(--q-shadow-1, 0 1px 3px rgba(0, 0, 0, 0.2));
          transition: background-color 0.2s, transform 0.15s;
          margin-top: 8px;
        }

        button:hover {
          background-color: var(--q-primary-dark, #1565C0);
        }

        button:active {
          transform: scale(0.99);
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

        /* =========================================================
           4. RESPONSIVE MÓVIL
           ========================================================= */
        @media (max-width: 480px) {
          :host {
            min-height: calc(100vh - 96px);
            padding: 14px 4px 24px;
          }

          .mascota-perro {
            width: 192px;
            height: 128px;
            margin-bottom: -15px;
          }

          .q-card-header {
            padding: 22px 16px 18px;
          }

          .q-card-section {
            padding: 20px 16px;
          }
        }
      </style>

      <!-- Escenario animado de biblioteca acogedora -->
      <div class="fondo-biblioteca" aria-hidden="true">
        <svg class="biblioteca-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="grad-pared" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#d7b47a" />
              <stop offset="48%" stop-color="#9b6338" />
              <stop offset="100%" stop-color="#56331f" />
            </linearGradient>
            <linearGradient id="grad-madera" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#2d180c" />
              <stop offset="48%" stop-color="#6b3e22" />
              <stop offset="100%" stop-color="#4a2c18" />
            </linearGradient>
            <linearGradient id="grad-repisa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#8a542c" />
              <stop offset="34%" stop-color="#6b3e22" />
              <stop offset="100%" stop-color="#2d180c" />
            </linearGradient>
            <radialGradient id="grad-luz-lampara" cx="50%" cy="20%" r="65%">
              <stop offset="0%" stop-color="rgba(253, 230, 138, 0.62)" />
              <stop offset="45%" stop-color="rgba(245, 158, 11, 0.24)" />
              <stop offset="100%" stop-color="rgba(245, 158, 11, 0)" />
            </radialGradient>
            <linearGradient id="grad-cono-luz" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(253, 230, 138, 0.38)" />
              <stop offset="100%" stop-color="rgba(245, 158, 11, 0)" />
            </linearGradient>
            <linearGradient id="grad-rayos" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fde68a" stop-opacity="0.32" />
              <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="grad-cristal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fff4cc" />
              <stop offset="100%" stop-color="#e9a949" />
            </linearGradient>
            <linearGradient id="grad-libro-borgona" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#651419" />
              <stop offset="50%" stop-color="#8b1e24" />
              <stop offset="100%" stop-color="#5c151a" />
            </linearGradient>
            <linearGradient id="grad-libro-esmeralda" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#123d25" />
              <stop offset="50%" stop-color="#1e5631" />
              <stop offset="100%" stop-color="#102f1d" />
            </linearGradient>
            <linearGradient id="grad-libro-azul" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#122642" />
              <stop offset="50%" stop-color="#1b365d" />
              <stop offset="100%" stop-color="#0e223e" />
            </linearGradient>
          </defs>

          <!-- Pared de fondo -->
          <rect width="1440" height="900" fill="url(#grad-pared)" />

          <!-- Ventanales clásicos de arco ojival y luz dorada -->
          <g>
            <path d="M 380 510 V 235 Q 380 82 530 66 Q 680 82 680 235 V 510 Z" fill="#50301d" stroke="#b88a49" stroke-width="18" />
            <path d="M 404 494 V 238 Q 404 112 530 94 Q 656 112 656 238 V 494 Z" fill="url(#grad-cristal)" />
            <path d="M 530 96 V 496 M 405 292 H 655 M 456 128 Q 482 183 486 290 M 604 128 Q 578 183 574 290" fill="none" stroke="#a16c32" stroke-width="11" opacity="0.86" />
            <path d="M 680 510 V 228 Q 680 96 810 78 Q 940 96 940 228 V 510 Z" fill="#50301d" stroke="#b88a49" stroke-width="18" />
            <path d="M 704 494 V 231 Q 704 126 810 106 Q 916 126 916 231 V 494 Z" fill="url(#grad-cristal)" />
            <path d="M 810 108 V 496 M 705 290 H 915 M 750 135 Q 777 184 781 290 M 870 135 Q 843 184 839 290" fill="none" stroke="#a16c32" stroke-width="11" opacity="0.86" />
            <path d="M 440 470 L 940 650 L 1060 840 L 496 840 Z" fill="url(#grad-rayos)" />
            <path d="M 645 470 L 1004 588 L 1240 840 L 830 840 Z" fill="url(#grad-rayos)" opacity="0.72" />
            <path d="M 382 510 H 940" stroke="#6b3e22" stroke-width="18" />
          </g>

          <!-- Estantería izquierda -->
          <g>
            <rect x="36" y="70" width="330" height="790" rx="6" fill="#2d180c" stroke="url(#grad-madera)" stroke-width="16" />
            <!-- Repisa 1 -->
            <rect x="52" y="136" width="24" height="114" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="56" y="152" width="16" height="4" fill="#f3e5ab" opacity="0.82" />
            <rect x="78" y="122" width="30" height="128" rx="3" fill="url(#grad-libro-borgona)" />
            <rect x="82" y="138" width="22" height="6" fill="#f3c669" opacity="0.75" />
            <rect x="110" y="144" width="22" height="106" rx="3" fill="url(#grad-libro-esmeralda)" />
            <rect x="134" y="128" width="28" height="122" rx="3" fill="#b45309" />
            <rect x="166" y="138" width="24" height="112" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="196" y="146" width="26" height="104" rx="3" fill="#5d4037" transform="rotate(-8 196 250)" />
            <rect x="242" y="130" width="28" height="120" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="274" y="142" width="24" height="108" rx="3" fill="url(#grad-libro-esmeralda)" />
            <rect x="302" y="126" width="28" height="124" rx="3" fill="url(#grad-libro-borgona)" />
            <path d="M 82 186 H 104 M 82 194 H 104 M 116 188 H 128 M 248 174 H 264 M 248 182 H 264 M 280 190 H 292 M 308 184 H 324 M 308 192 H 324" stroke="#f3e5ab" stroke-width="2.5" opacity="0.82" />
            <rect x="44" y="248" width="314" height="16" fill="url(#grad-repisa)" />

            <!-- Repisa 2 -->
            <rect x="56" y="328" width="28" height="122" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="86" y="340" width="24" height="110" rx="3" fill="#c7923e" />
            <rect x="114" y="322" width="32" height="128" rx="3" fill="url(#grad-libro-esmeralda)" />
            <rect x="120" y="340" width="20" height="5" fill="#e0f2f1" opacity="0.75" />
            <rect x="150" y="336" width="26" height="114" rx="3" fill="url(#grad-libro-borgona)" />
            <rect x="180" y="346" width="24" height="104" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="218" y="424" width="98" height="24" rx="3" fill="#8d5524" />
            <rect x="224" y="400" width="88" height="24" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="234" y="378" width="72" height="22" rx="3" fill="#d4a037" />
            <path d="M 62 372 H 78 M 62 380 H 78 M 120 370 H 140 M 120 378 H 140 M 156 378 H 170 M 186 382 H 198 M 232 408 H 304 M 240 386 H 300" stroke="#f3e5ab" stroke-width="2.5" opacity="0.82" />
            <rect x="44" y="448" width="314" height="16" fill="url(#grad-repisa)" />

            <!-- Repisa 3 -->
            <rect x="58" y="534" width="30" height="126" rx="3" fill="url(#grad-libro-borgona)" />
            <rect x="92" y="548" width="24" height="112" rx="3" fill="url(#grad-libro-esmeralda)" />
            <rect x="120" y="530" width="28" height="130" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="152" y="544" width="26" height="116" rx="3" fill="#c9933b" />
            <rect x="182" y="538" width="28" height="122" rx="3" fill="#375a7f" />
            <rect x="214" y="550" width="22" height="110" rx="3" fill="url(#grad-libro-esmeralda)" />
            <rect x="242" y="540" width="28" height="120" rx="3" fill="#9c4221" />
            <rect x="276" y="546" width="26" height="114" rx="3" fill="url(#grad-libro-azul)" />
            <path d="M 64 576 H 82 M 64 584 H 82 M 98 588 H 110 M 126 576 H 142 M 158 584 H 172 M 220 590 H 230 M 282 582 H 296" stroke="#f3e5ab" stroke-width="2.5" opacity="0.82" />
            <rect x="44" y="658" width="314" height="16" fill="url(#grad-repisa)" />
          </g>

          <!-- Estantería derecha -->
          <g>
            <rect x="1074" y="70" width="330" height="790" rx="6" fill="#2d180c" stroke="url(#grad-madera)" stroke-width="16" />
            <!-- Repisa 1 -->
            <rect x="1096" y="132" width="26" height="118" rx="3" fill="url(#grad-libro-esmeralda)" />
            <rect x="1126" y="142" width="24" height="108" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="1154" y="124" width="30" height="126" rx="3" fill="url(#grad-libro-borgona)" />
            <rect x="1188" y="138" width="26" height="112" rx="3" fill="#b45309" />
            <rect x="1218" y="130" width="28" height="120" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="1252" y="144" width="22" height="106" rx="3" fill="url(#grad-libro-esmeralda)" />
            <rect x="1282" y="136" width="28" height="114" rx="3" fill="url(#grad-libro-borgona)" />
            <rect x="1316" y="128" width="26" height="122" rx="3" fill="url(#grad-libro-azul)" />
            <path d="M 1101 180 H 1117 M 1130 184 H 1146 M 1159 178 H 1179 M 1193 178 H 1209 M 1224 180 H 1240 M 1256 184 H 1270 M 1287 178 H 1305 M 1320 180 H 1338" stroke="#f3e5ab" stroke-width="2.5" opacity="0.82" />
            <path d="M 1101 188 H 1117 M 1130 192 H 1146 M 1159 186 H 1179 M 1193 186 H 1209 M 1224 188 H 1240 M 1256 192 H 1270 M 1287 186 H 1305 M 1320 188 H 1338" stroke="#f3e5ab" stroke-width="1.5" opacity="0.56" />
            <rect x="1082" y="248" width="314" height="16" fill="url(#grad-repisa)" />

            <!-- Repisa 2 (espacio para lámpara de estudio) -->
            <rect x="1094" y="344" width="26" height="106" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="1124" y="330" width="28" height="120" rx="3" fill="url(#grad-libro-borgona)" />
            <rect x="1156" y="346" width="24" height="104" rx="3" fill="url(#grad-libro-esmeralda)" />
            <rect x="1082" y="448" width="314" height="16" fill="url(#grad-repisa)" />

            <!-- Repisa 3 -->
            <rect x="1098" y="538" width="28" height="122" rx="3" fill="url(#grad-libro-borgona)" />
            <rect x="1130" y="548" width="24" height="112" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="1158" y="532" width="30" height="128" rx="3" fill="url(#grad-libro-esmeralda)" />
            <rect x="1192" y="544" width="26" height="116" rx="3" fill="#b45309" />
            <rect x="1222" y="536" width="26" height="124" rx="3" fill="url(#grad-libro-borgona)" />
            <rect x="1256" y="544" width="28" height="116" rx="3" fill="url(#grad-libro-azul)" />
            <rect x="1290" y="534" width="26" height="126" rx="3" fill="url(#grad-libro-esmeralda)" />
            <rect x="1322" y="548" width="24" height="112" rx="3" fill="url(#grad-libro-azul)" />
            <path d="M 1103 582 H 1121 M 1134 584 H 1150 M 1163 580 H 1183 M 1197 582 H 1213 M 1227 580 H 1243 M 1260 582 H 1280 M 1295 580 H 1311 M 1326 584 H 1342" stroke="#f3e5ab" stroke-width="2.5" opacity="0.82" />
            <path d="M 1103 590 H 1121 M 1134 592 H 1150 M 1163 588 H 1183 M 1197 590 H 1213 M 1227 588 H 1243 M 1260 590 H 1280 M 1295 588 H 1311 M 1326 592 H 1342" stroke="#f3e5ab" stroke-width="1.5" opacity="0.56" />
            <rect x="1082" y="658" width="314" height="16" fill="url(#grad-repisa)" />
          </g>

          <!-- Lámpara de estudio cálida con brillo animado -->
          <g class="lampara-estudio">
            <g class="lampara-halo">
              <circle cx="1235" cy="310" r="190" fill="url(#grad-luz-lampara)" />
              <polygon points="1210,308 1280,308 1355,448 1135,448" fill="url(#grad-cono-luz)" />
            </g>
            <!-- Base y brazo de latón -->
            <ellipse cx="1312" cy="444" rx="34" ry="8" fill="#a67c37" />
            <path d="M 1312 440 L 1324 338 L 1254 276" fill="none" stroke="#c89b4b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="1324" cy="338" r="7" fill="#e0b563" />
            <!-- Pantalla clásica verde/dorada -->
            <path d="M 1212 310 C 1216 276, 1272 276, 1278 310 Z" fill="#1e6b5c" stroke="#c89b4b" stroke-width="3" />
            <ellipse cx="1245" cy="310" rx="22" ry="5" fill="#ffe082" opacity="0.9" />
          </g>

          <!-- Escritorio inferior acogedor -->
          <rect x="0" y="838" width="1440" height="62" fill="#3a2013" />
          <rect x="0" y="834" width="1440" height="10" fill="#6e4128" />
        </svg>

        <!-- Partículas flotantes de luz -->
        <div class="particulas-luz">
          <span class="particula" style="left: 12%; width: 5px; height: 5px; --dur: 13s; --delay: -2s; --drift: 22px; --op: 0.65;"></span>
          <span class="particula" style="left: 22%; width: 4px; height: 4px; --dur: 16s; --delay: -7s; --drift: -18px; --op: 0.5;"></span>
          <span class="particula" style="left: 31%; width: 6px; height: 6px; --dur: 14s; --delay: -4s; --drift: 26px; --op: 0.55;"></span>
          <span class="particula" style="left: 42%; width: 3px; height: 3px; --dur: 11s; --delay: -9s; --drift: -14px; --op: 0.45;"></span>
          <span class="particula" style="left: 55%; width: 5px; height: 5px; --dur: 15s; --delay: -5s; --drift: 20px; --op: 0.5;"></span>
          <span class="particula" style="left: 64%; width: 4px; height: 4px; --dur: 12s; --delay: -1s; --drift: -24px; --op: 0.6;"></span>
          <span class="particula" style="left: 73%; width: 7px; height: 7px; --dur: 17s; --delay: -8s; --drift: 28px; --op: 0.72;"></span>
          <span class="particula" style="left: 81%; width: 5px; height: 5px; --dur: 10s; --delay: -3s; --drift: -16px; --op: 0.8;"></span>
          <span class="particula" style="left: 88%; width: 6px; height: 6px; --dur: 14s; --delay: -11s; --drift: 18px; --op: 0.75;"></span>
          <span class="particula" style="left: 93%; width: 4px; height: 4px; --dur: 13s; --delay: -6s; --drift: -20px; --op: 0.6;"></span>
          <span class="particula" style="left: 16%; width: 6px; height: 6px; --dur: 18s; --delay: -12s; --drift: 30px; --op: 0.5;"></span>
          <span class="particula" style="left: 78%; width: 3px; height: 3px; --dur: 9s; --delay: -4s; --drift: 14px; --op: 0.75;"></span>
        </div>
      </div>

      <!-- Escena central: Perro estudioso + Tarjeta Quasar -->
      <div class="login-escena">
        <div class="mascota-perro" id="mascota-perro" aria-hidden="true">
          <svg class="perro-svg" viewBox="0 0 240 160">
            <!-- Cuerpo / hombros asomándose sobre la tarjeta -->
            <path d="M 74 150 C 76 126, 94 118, 120 118 C 146 118, 164 126, 166 150 Z" fill="#d99b52" stroke="#b87a35" stroke-width="1.5" />
            <!-- Collar estudioso estilo Quasar -->
            <path d="M 90 132 Q 120 142 150 132" fill="none" stroke="#1976D2" stroke-width="6" stroke-linecap="round" />
            <circle cx="120" cy="141" r="4.5" fill="#ffd54f" stroke="#c79100" stroke-width="1.2" />

            <!-- Grupo de cabeza animada (respiración + negación) -->
            <g class="perro-respiracion">
              <g class="perro-cabeza-shake">
                <!-- Orejas móviles -->
                <g class="oreja-izq">
                  <path d="M 76 58 C 48 56, 36 86, 42 112 C 45 122, 60 122, 68 106 C 72 95, 74 74, 76 58 Z" fill="#8c5228" stroke="#6f3e1b" stroke-width="2" />
                  <path d="M 68 68 C 54 70, 48 90, 52 106" fill="none" stroke="#a6683c" stroke-width="3" stroke-linecap="round" opacity="0.65" />
                </g>

                <g class="oreja-der">
                  <path d="M 164 58 C 192 56, 204 86, 198 112 C 195 122, 180 122, 172 106 C 168 95, 166 74, 164 58 Z" fill="#8c5228" stroke="#6f3e1b" stroke-width="2" />
                  <path d="M 172 68 C 186 70, 192 90, 188 106" fill="none" stroke="#a6683c" stroke-width="3" stroke-linecap="round" opacity="0.65" />
                </g>

                <!-- Cabeza -->
                <ellipse cx="120" cy="84" rx="52" ry="44" fill="#d99b52" stroke="#b87a35" stroke-width="1.6" />
                <!-- Mechón y mancha frontal -->
                <path d="M 111 42 C 115 56, 115 68, 113 78 L 127 78 C 125 68, 125 56, 129 42 C 123 40, 117 40, 111 42 Z" fill="#f7e3c3" opacity="0.72" />
                <path d="M 112 42 Q 120 33 128 40 Q 124 44 120 42 Z" fill="#c2833d" />

                <!-- Cejas expresivas -->
                <path d="M 86 62 Q 97 57 107 62" fill="none" stroke="#7d4720" stroke-width="2.6" stroke-linecap="round" />
                <path d="M 133 62 Q 143 57 154 62" fill="none" stroke="#7d4720" stroke-width="2.6" stroke-linecap="round" />

                <!-- Ojo izquierdo -->
                <g class="ojo-parpadeo-izq">
                  <ellipse cx="97" cy="80" rx="10" ry="11" fill="#ffffff" />
                  <g class="pupila-mover">
                    <circle cx="97" cy="80" r="5.5" fill="#231915" />
                    <circle cx="99" cy="77.8" r="2" fill="#ffffff" />
                    <circle cx="94.8" cy="82.2" r="0.9" fill="#ffffff" opacity="0.75" />
                  </g>
                </g>

                <!-- Ojo derecho -->
                <g class="ojo-parpadeo-der">
                  <ellipse cx="143" cy="80" rx="10" ry="11" fill="#ffffff" />
                  <g class="pupila-mover">
                    <circle cx="143" cy="80" r="5.5" fill="#231915" />
                    <circle cx="145" cy="77.8" r="2" fill="#ffffff" />
                    <circle cx="140.8" cy="82.2" r="0.9" fill="#ffffff" opacity="0.75" />
                  </g>
                </g>

                <!-- Mejillas -->
                <ellipse cx="80" cy="97" rx="7" ry="4" fill="#f28b82" opacity="0.45" />
                <ellipse cx="160" cy="97" rx="7" ry="4" fill="#f28b82" opacity="0.45" />

                <!-- Hocico y nariz -->
                <ellipse cx="120" cy="102" rx="23" ry="16" fill="#fdf2df" />
                <path d="M 112 95 C 112 91, 128 91, 128 95 C 128 100, 123 103, 120 103 C 117 103, 112 100, 112 95 Z" fill="#2b1b14" />
                <ellipse cx="117" cy="94" rx="3" ry="1.3" fill="#ffffff" opacity="0.45" />
                <path d="M 120 103 L 120 108 M 112 108 Q 116 113 120 108 Q 124 113 128 108" fill="none" stroke="#5d3a24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />

                <!-- Gafas redondas de estudio -->
                <g class="gafas">
                  <line x1="68" y1="76" x2="81.5" y2="79" stroke="#263238" stroke-width="2.6" stroke-linecap="round" />
                  <line x1="158.5" y1="79" x2="172" y2="76" stroke="#263238" stroke-width="2.6" stroke-linecap="round" />
                  <circle cx="97" cy="80" r="15.5" fill="rgba(215, 238, 255, 0.16)" stroke="#263238" stroke-width="3" />
                  <circle cx="143" cy="80" r="15.5" fill="rgba(215, 238, 255, 0.16)" stroke="#263238" stroke-width="3" />
                  <path d="M 112.5 79 Q 120 75 127.5 79" fill="none" stroke="#263238" stroke-width="3" stroke-linecap="round" />
                  <path d="M 88 73 L 94 69" stroke="rgba(255, 255, 255, 0.65)" stroke-width="2" stroke-linecap="round" />
                  <path d="M 134 73 L 140 69" stroke="rgba(255, 255, 255, 0.65)" stroke-width="2" stroke-linecap="round" />
                </g>
              </g>
            </g>

            <!-- Patitas apoyadas sobre el borde superior de la tarjeta -->
            <g class="patita-izq">
              <ellipse cx="80" cy="146" rx="18" ry="12" fill="#fdf2df" stroke="#c2833d" stroke-width="1.8" />
              <ellipse cx="80" cy="150" rx="7" ry="4" fill="#e8c396" opacity="0.55" />
              <path d="M 73 140 L 74 146 M 80 138 L 80 145 M 87 140 L 86 146" stroke="#c2833d" stroke-width="1.6" stroke-linecap="round" />
            </g>

            <g class="patita-der">
              <ellipse cx="160" cy="146" rx="18" ry="12" fill="#fdf2df" stroke="#c2833d" stroke-width="1.8" />
              <ellipse cx="160" cy="150" rx="7" ry="4" fill="#e8c396" opacity="0.55" />
              <path d="M 153 140 L 154 146 M 160 138 L 160 145 M 167 140 L 166 146" stroke="#c2833d" stroke-width="1.6" stroke-linecap="round" />
            </g>
          </svg>
        </div>

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
      </div>
    `;

    this.configurarEventos();
  }

  configurarEventos() {
    const formulario = this.shadowRoot.getElementById('form-login');
    const cajaError = this.shadowRoot.getElementById('error');
    const inputEmail = this.shadowRoot.getElementById('email');
    const inputPassword = this.shadowRoot.getElementById('password');
    const mascota = this.shadowRoot.getElementById('mascota-perro');

    const actualizarMiradaEmail = () => {
      const longitud = Math.min(inputEmail.value.length, 28);
      const desplazamientoX = -3.2 + (longitud / 28) * 6.4;
      mascota.style.setProperty('--mirada-x', `${desplazamientoX.toFixed(2)}px`);
    };

    inputEmail.addEventListener('focus', () => {
      mascota.classList.remove('tapando-ojos');
      mascota.classList.add('mirando-email');
      actualizarMiradaEmail();
    });

    inputEmail.addEventListener('input', () => {
      if (!mascota.classList.contains('mirando-email')) {
        mascota.classList.add('mirando-email');
      }
      actualizarMiradaEmail();
    });

    inputEmail.addEventListener('blur', () => {
      mascota.classList.remove('mirando-email');
      mascota.style.setProperty('--mirada-x', '0px');
    });

    inputPassword.addEventListener('focus', () => {
      mascota.classList.remove('mirando-email');
      mascota.classList.add('tapando-ojos');
    });

    inputPassword.addEventListener('blur', () => {
      mascota.classList.remove('tapando-ojos');
    });

    mascota.addEventListener('animationend', (e) => {
      if (e.animationName === 'negar-cabeza') {
        mascota.classList.remove('negando');
      }
    });

    formulario.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = inputEmail.value.trim();
      const password = inputPassword.value.trim();

      if (iniciarSesion(email, password)) {
        this.dispatchEvent(new CustomEvent('navegar', {
          detail: { ruta: 'usuarios' },
          bubbles: true,
          composed: true
        }));
      } else {
        cajaError.style.display = 'block';
        mascota.classList.remove('negando');
        void mascota.offsetWidth;
        mascota.classList.add('negando');
      }
    });
  }
}

customElements.define('vista-login', VistaLogin);
