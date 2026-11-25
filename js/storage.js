// Nombres de las claves donde se guarda la información en localStorage
const CLAVE_USUARIOS = 'acme_usuarios';
const CLAVE_EXAMENES = 'acme_examenes';
const CLAVE_SESION = 'acme_sesion_activa';
const CLAVE_RESULTADOS = 'acme_resultados';

// =========================================================================
// 1. DATOS INICIALES (Semilla base con usuario admin y 12 exámenes)
// =========================================================================
export function inicializarDatos() {
  if (!localStorage.getItem(CLAVE_USUARIOS)) {
    const usuariosIniciales = [
      {
        identificacion: '1001',
        nombre: 'chucho',
        email: 'chucho@gmail.com',
        telefono: '3001234567',
        cargo: 'Administrativo',
        password: '123'
      }
    ];
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuariosIniciales));
  }

  if (!localStorage.getItem(CLAVE_EXAMENES)) {
    const examenesIniciales = [
      {
        codigo: 'POL-101',
        titulo: 'Ciencias Políticas y Constitución',
        tiempo: 10,
        porcentajeAprobacion: 60,
        descripcion: 'Evaluación sobre formas de gobierno, democracia, división de poderes y derechos constitucionales.',
        preguntas: [
          {
            texto: '¿Cuáles son las tres ramas clásicas del poder público en un Estado democrático?',
            respuestas: [
              { texto: 'Ejecutiva, Legislativa y Judicial', correcta: true },
              { texto: 'Militar, Electoral y Administrativa', correcta: false },
              { texto: 'Constitucional, Fiscal y Municipal', correcta: false }
            ]
          },
          {
            texto: '¿Qué principio establece que ninguna autoridad ni ciudadano está por encima de la Constitución y la ley?',
            respuestas: [
              { texto: 'Centralismo administrativo', correcta: false },
              { texto: 'Estado de Derecho', correcta: true },
              { texto: 'Soberanía parlamentaria', correcta: false }
            ]
          },
          {
            texto: '¿Qué mecanismo permite a los ciudadanos aprobar o rechazar directamente una norma o decisión política?',
            respuestas: [
              { texto: 'Mocion de censura', correcta: false },
              { texto: 'Decreto ejecutivo', correcta: false },
              { texto: 'Referendo o plebiscito', correcta: true }
            ]
          }
        ]
      },
      {
        codigo: 'ALG-101',
        titulo: 'Álgebra y Ecuaciones Lineales',
        tiempo: 15,
        porcentajeAprobacion: 60,
        descripcion: 'Resolución de ecuaciones de primer grado, factorización, polinomios y leyes de exponentes.',
        preguntas: [
          {
            texto: '¿Cuál es el valor de x en la ecuación 3x - 7 = 14?',
            respuestas: [
              { texto: 'x = 7', correcta: true },
              { texto: 'x = 5', correcta: false },
              { texto: 'x = 21', correcta: false }
            ]
          },
          {
            texto: '¿Cuál es la factorización correcta de la diferencia de cuadrados x² - 16?',
            respuestas: [
              { texto: '(x - 4)²', correcta: false },
              { texto: '(x + 4)(x - 4)', correcta: true },
              { texto: '(x + 8)(x - 2)', correcta: false }
            ]
          },
          {
            texto: 'Al simplificar la expresión algebraica (x³ · x⁴) / x², ¿qué resultado se obtiene?',
            respuestas: [
              { texto: 'x¹⁰', correcta: false },
              { texto: 'x⁶', correcta: false },
              { texto: 'x⁵', correcta: true }
            ]
          }
        ]
      },
      {
        codigo: 'FIS-101',
        titulo: 'Física: Cinemática y Leyes de Newton',
        tiempo: 12,
        porcentajeAprobacion: 60,
        descripcion: 'Conceptos fundamentales de movimiento rectilíneo, aceleración, fuerza y dinámica clásica.',
        preguntas: [
          {
            texto: '¿Qué establece la Primera Ley de Newton o Ley de la Inercia?',
            respuestas: [
              { texto: 'Todo cuerpo permanece en reposo o movimiento rectilíneo uniforme si no actúa una fuerza neta sobre él', correcta: true },
              { texto: 'La fuerza es igual al producto de la masa por la velocidad', correcta: false },
              { texto: 'La energía cinética se conserva en cualquier choque inelástico', correcta: false }
            ]
          },
          {
            texto: 'Si un vehículo recorre 180 km en 2 horas con velocidad constante, ¿cuál es su rapidez?',
            respuestas: [
              { texto: '60 km/h', correcta: false },
              { texto: '90 km/h', correcta: true },
              { texto: '360 km/h', correcta: false }
            ]
          },
          {
            texto: '¿Cuál es la unidad de medida de la fuerza en el Sistema Internacional (SI)?',
            respuestas: [
              { texto: 'Julio (J)', correcta: false },
              { texto: 'Vatio (W)', correcta: false },
              { texto: 'Newton (N)', correcta: true }
            ]
          }
        ]
      },
      {
        codigo: 'QUI-101',
        titulo: 'Química: Estructura Atómica y Enlaces',
        tiempo: 12,
        porcentajeAprobacion: 60,
        descripcion: 'Partículas subatómicas, organización de la tabla periódica y tipos de enlaces químicos.',
        preguntas: [
          {
            texto: '¿Qué partícula subatómica tiene carga eléctrica negativa y orbita alrededor del núcleo?',
            respuestas: [
              { texto: 'Electrón', correcta: true },
              { texto: 'Protón', correcta: false },
              { texto: 'Neutrón', correcta: false }
            ]
          },
          {
            texto: '¿Cómo se denomina el enlace químico en el que dos átomos comparten pares de electrones?',
            respuestas: [
              { texto: 'Enlace iónico', correcta: false },
              { texto: 'Enlace covalente', correcta: true },
              { texto: 'Enlace metálico', correcta: false }
            ]
          },
          {
            texto: '¿Qué indica el número atómico (Z) de un elemento en la tabla periódica?',
            respuestas: [
              { texto: 'La suma de protones y neutrones', correcta: false },
              { texto: 'El número de niveles de energía', correcta: false },
              { texto: 'La cantidad de protones en su núcleo', correcta: true }
            ]
          }
        ]
      },
      {
        codigo: 'BIO-101',
        titulo: 'Biología Celular y Genética',
        tiempo: 10,
        porcentajeAprobacion: 60,
        descripcion: 'Organelos celulares, fotosíntesis, respiración celular y principios básicos de la herencia.',
        preguntas: [
          {
            texto: '¿Cuál es el organelo celular encargado de producir la mayor parte de la energía (ATP) mediante la respiración celular?',
            respuestas: [
              { texto: 'Mitocondria', correcta: true },
              { texto: 'Ribosoma', correcta: false },
              { texto: 'Aparato de Golgi', correcta: false }
            ]
          },
          {
            texto: '¿Qué diferencia principal existe entre una célula procariota y una eucariota?',
            respuestas: [
              { texto: 'La procariota realiza fotosíntesis y la eucariota no', correcta: false },
              { texto: 'La eucariota posee núcleo definido rodeado por membrana y la procariota no', correcta: true },
              { texto: 'La procariota tiene mayor tamaño y múltiples núcleos', correcta: false }
            ]
          },
          {
            texto: '¿Qué molécula contiene la información genética hereditaria de los seres vivos?',
            respuestas: [
              { texto: 'Glucosa', correcta: false },
              { texto: 'Colágeno', correcta: false },
              { texto: 'ADN (Ácido desoxirribonucleico)', correcta: true }
            ]
          }
        ]
      },
      {
        codigo: 'HIST-101',
        titulo: 'Historia Universal: Edad Media y Modernidad',
        tiempo: 10,
        porcentajeAprobacion: 60,
        descripcion: 'Evaluación sobre la caída del Imperio Romano, el feudalismo, las Cruzadas y el Renacimiento.',
        preguntas: [
          {
            texto: '¿Qué hecho histórico marca tradicionalmente el inicio de la Edad Media en el año 476 d. C.?',
            respuestas: [
              { texto: 'La caída del Imperio Romano de Occidente', correcta: true },
              { texto: 'La toma de Constantinopla por los otomanos', correcta: false },
              { texto: 'La firma de la Carta Magna', correcta: false }
            ]
          },
          {
            texto: '¿Cómo se denominó el sistema político, económico y social basado en el vasallaje y la tenencia de tierras?',
            respuestas: [
              { texto: 'Mercantilismo', correcta: false },
              { texto: 'Feudalismo', correcta: true },
              { texto: 'Absolutismo ilustrado', correcta: false }
            ]
          },
          {
            texto: '¿Qué imperio preservó el legado grecorromano en Oriente durante toda la Edad Media?',
            respuestas: [
              { texto: 'Imperio Carolingio', correcta: false },
              { texto: 'Imperio Austro-Húngaro', correcta: false },
              { texto: 'Imperio Bizantino', correcta: true }
            ]
          }
        ]
      },
      {
        codigo: 'GEO-101',
        titulo: 'Geografía Física y Cartografía',
        tiempo: 10,
        porcentajeAprobacion: 60,
        descripcion: 'Coordenadas geográficas, placas tectónicas, formas del relieve y dinámica climática terrestre.',
        preguntas: [
          {
            texto: '¿Qué línea imaginaria divide a la Tierra en hemisferio norte y hemisferio sur?',
            respuestas: [
              { texto: 'Línea del Ecuador (Paralelo 0°)', correcta: true },
              { texto: 'Meridiano de Greenwich', correcta: false },
              { texto: 'Trópico de Capricornio', correcta: false }
            ]
          },
          {
            texto: '¿Qué nombre recibe la distancia angular medida hacia el este o el oeste respecto al Meridiano de Greenwich?',
            respuestas: [
              { texto: 'Latitud', correcta: false },
              { texto: 'Longitud', correcta: true },
              { texto: 'Altitud', correcta: false }
            ]
          },
          {
            texto: '¿Cuál es el océano más extenso y profundo del planeta Tierra?',
            respuestas: [
              { texto: 'Océano Atlántico', correcta: false },
              { texto: 'Océano Índico', correcta: false },
              { texto: 'Océano Pacífico', correcta: true }
            ]
          }
        ]
      },
      {
        codigo: 'LIT-101',
        titulo: 'Literatura y Géneros Narrativos',
        tiempo: 10,
        porcentajeAprobacion: 60,
        descripcion: 'Características de los géneros literarios, figuras retóricas y obras universales.',
        preguntas: [
          {
            texto: '¿A qué género literario pertenecen las obras escritas principalmente en verso para expresar sentimientos y emociones?',
            respuestas: [
              { texto: 'Género lírico', correcta: true },
              { texto: 'Género dramático', correcta: false },
              { texto: 'Género ensayístico', correcta: false }
            ]
          },
          {
            texto: '¿Qué figura retórica consiste en atribuir cualidades o acciones humanas a objetos inanimados o animales?',
            respuestas: [
              { texto: 'Hipérbole', correcta: false },
              { texto: 'Prosopopeya o personificación', correcta: true },
              { texto: 'Anáfora', correcta: false }
            ]
          },
          {
            texto: '¿Quién escribió la novela "El ingenioso hidalgo don Quijote de la Mancha"?',
            respuestas: [
              { texto: 'Lope de Vega', correcta: false },
              { texto: 'Gabriel García Márquez', correcta: false },
              { texto: 'Miguel de Cervantes Saavedra', correcta: true }
            ]
          }
        ]
      },
      {
        codigo: 'FIL-101',
        titulo: 'Filosofía, Ética y Epistemología',
        tiempo: 12,
        porcentajeAprobacion: 60,
        descripcion: 'Corrientes del pensamiento filosófico, teoría del conocimiento y fundamentos de la ética.',
        preguntas: [
          {
            texto: '¿Qué rama de la filosofía estudia el origen, la naturaleza y los límites del conocimiento humano?',
            respuestas: [
              { texto: 'Epistemología', correcta: true },
              { texto: 'Estética', correcta: false },
              { texto: 'Axiología', correcta: false }
            ]
          },
          {
            texto: '¿Qué filósofo formuló el método de la duda metódica y la frase "Pienso, luego existo"?',
            respuestas: [
              { texto: 'Aristóteles', correcta: false },
              { texto: 'René Descartes', correcta: true },
              { texto: 'Immanuel Kant', correcta: false }
            ]
          },
          {
            texto: '¿Cómo se llamaba el método dialógico utilizado por Sócrates para ayudar a su interlocutor a descubrir la verdad mediante preguntas?',
            respuestas: [
              { texto: 'Sofística', correcta: false },
              { texto: 'Escolasticismo', correcta: false },
              { texto: 'Mayéutica', correcta: true }
            ]
          }
        ]
      },
      {
        codigo: 'LOG-101',
        titulo: 'Lógica Matemática y Proposiciones',
        tiempo: 12,
        porcentajeAprobacion: 60,
        descripcion: 'Conectores lógicos, tablas de verdad, proposiciones compuestas y validez de silogismos.',
        preguntas: [
          {
            texto: 'En lógica proposicional, ¿cuándo es verdadera una conjunción (p ∧ q)?',
            respuestas: [
              { texto: 'Únicamente cuando tanto p como q son verdaderas', correcta: true },
              { texto: 'Cuando al menos una de las dos proposiciones es verdadera', correcta: false },
              { texto: 'Cuando ambas proposiciones son falsas', correcta: false }
            ]
          },
          {
            texto: '¿Cuál es el valor de verdad de la implicación (p → q) cuando p es verdadera y q es falsa?',
            respuestas: [
              { texto: 'Verdadero', correcta: false },
              { texto: 'Falso', correcta: true },
              { texto: 'Indeterminado', correcta: false }
            ]
          },
          {
            texto: 'Si "Todos los mamíferos son vertebrados" y "El delfín es un mamífero", ¿qué conclusión válida se deduce?',
            respuestas: [
              { texto: 'Todos los vertebrados son delfines', correcta: false },
              { texto: 'Ningún delfín es vertebrado', correcta: false },
              { texto: 'El delfín es vertebrado', correcta: true }
            ]
          }
        ]
      },
      {
        codigo: 'ING-101',
        titulo: 'Inglés: Grammar and Vocabulary',
        tiempo: 10,
        porcentajeAprobacion: 60,
        descripcion: 'Evaluación de tiempos verbales básicos, preposiciones y comprensión de estructuras en inglés.',
        preguntas: [
          {
            texto: 'Choose the correct form to complete the sentence: "She _____ to the university every morning."',
            respuestas: [
              { texto: 'goes', correcta: true },
              { texto: 'go', correcta: false },
              { texto: 'going', correcta: false }
            ]
          },
          {
            texto: 'Which sentence is grammatically correct in the simple past tense?',
            respuestas: [
              { texto: 'They studyed for the exam yesterday.', correcta: false },
              { texto: 'They studied for the exam yesterday.', correcta: true },
              { texto: 'They studies for the exam yesterday.', correcta: false }
            ]
          },
          {
            texto: 'Select the right preposition: "The meeting starts _____ 8:00 AM."',
            respuestas: [
              { texto: 'in', correcta: false },
              { texto: 'on', correcta: false },
              { texto: 'at', correcta: true }
            ]
          }
        ]
      },
      {
        codigo: 'ECO-101',
        titulo: 'Ecología y Biodiversidad',
        tiempo: 10,
        porcentajeAprobacion: 60,
        descripcion: 'Relaciones entre seres vivos y su entorno, cadenas tróficas, ciclos biogeoquímicos y sostenibilidad.',
        preguntas: [
          {
            texto: '¿Cómo se denominan los organismos autótrofos que fabrican su propio alimento mediante la fotosíntesis?',
            respuestas: [
              { texto: 'Productores', correcta: true },
              { texto: 'Consumidores primarios', correcta: false },
              { texto: 'Descomponedores', correcta: false }
            ]
          },
          {
            texto: '¿Qué conjunto conforman los factores bióticos y abióticos que interactúan en un área determinada?',
            respuestas: [
              { texto: 'Población', correcta: false },
              { texto: 'Ecosistema', correcta: true },
              { texto: 'Nicho ecológico', correcta: false }
            ]
          },
          {
            texto: '¿Cuál es el principal gas de efecto invernadero emitido por la quema de combustibles fósiles?',
            respuestas: [
              { texto: 'Oxígeno (O₂)', correcta: false },
              { texto: 'Nitrógeno molecular (N₂)', correcta: false },
              { texto: 'Dióxido de carbono (CO₂)', correcta: true }
            ]
          }
        ]
      }
    ];
    localStorage.setItem(CLAVE_EXAMENES, JSON.stringify(examenesIniciales));
  }
}

// =========================================================================
// 2. LOGIN Y SESIÓN
// =========================================================================
export function iniciarSesion(email, password) {
  const usuarios = obtenerUsuarios();
  const encontrado = usuarios.find(u => u.email === email && u.password === password);

  if (encontrado) {
    const sesion = {
      identificacion: encontrado.identificacion,
      nombre: encontrado.nombre,
      cargo: encontrado.cargo
    };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return true;
  }
  return false;
}

export function obtenerSesionActual() {
  return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null;
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

// =========================================================================
// 3. GESTIÓN DE USUARIOS
// =========================================================================
export function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

export function guardarUsuario(nuevoUsuario) {
  const usuarios = obtenerUsuarios();
  const indice = usuarios.findIndex(u => u.identificacion === nuevoUsuario.identificacion);

  if (indice !== -1) {
    usuarios[indice] = nuevoUsuario;
  } else {
    usuarios.push(nuevoUsuario);
  }
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

export function eliminarUsuario(identificacion) {
  const usuarios = obtenerUsuarios().filter(u => u.identificacion !== identificacion);
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// =========================================================================
// 4. GESTIÓN DE EXÁMENES
// =========================================================================
export function obtenerExamenes() {
  return JSON.parse(localStorage.getItem(CLAVE_EXAMENES)) || [];
}

export function guardarExamen(nuevoExamen) {
  const examenes = obtenerExamenes();
  const indice = examenes.findIndex(e => e.codigo === nuevoExamen.codigo);

  if (indice !== -1) {
    examenes[indice] = nuevoExamen;
  } else {
    examenes.push(nuevoExamen);
  }
  localStorage.setItem(CLAVE_EXAMENES, JSON.stringify(examenes));
}

export function eliminarExamen(codigo) {
  const examenes = obtenerExamenes().filter(e => e.codigo !== codigo);
  localStorage.setItem(CLAVE_EXAMENES, JSON.stringify(examenes));
}

// =========================================================================
// 5. RESULTADOS DE ESTUDIANTES
// =========================================================================
export function guardarResultado(resultado) {
  const resultados = JSON.parse(localStorage.getItem(CLAVE_RESULTADOS)) || [];
  resultados.push(resultado);
  localStorage.setItem(CLAVE_RESULTADOS, JSON.stringify(resultados));
}

export function obtenerResultados() {
  return JSON.parse(localStorage.getItem(CLAVE_RESULTADOS)) || [];
}