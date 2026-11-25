// Nombres de las "cajitas" donde guardaremos todo en el navegador
const CLAVE_USUARIOS = 'acme_usuarios';
const CLAVE_EXAMENES = 'acme_examenes';
const CLAVE_SESION = 'acme_sesion_activa';
const CLAVE_RESULTADOS = 'acme_resultados';

// =========================================================================
// 1. DATOS INICIALES (Para que la página no arranque vacía la primera vez)
// =========================================================================
export function inicializarDatos() {
  // Si no hay usuarios guardados todavía, creamos uno por defecto para poder entrar al Login
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

  // Catálogo oficial de base. Se conserva la información creada por docentes
  // y se agregan los exámenes base que falten en instalaciones existentes.
  const examenesIniciales = [
      {
        codigo: 'JS-101',
        titulo: 'Fundamentos de JavaScript',
        tiempo: 5, // minutos
        porcentajeAprobacion: 60,
        descripcion: 'Evaluación básica sobre variables, tipos de datos y lógica.',
        imagen: 'logica.jpg',
        preguntas: [
          {
            texto: '¿Qué palabra clave se usa para declarar una constante en JavaScript?',
            respuestas: [
              { texto: 'var', correcta: false },
              { texto: 'const', correcta: true },
              { texto: 'let', correcta: false }
            ]
          },
          {
            texto: '¿Qué método convierte un objeto JavaScript a texto JSON?',
            respuestas: [
              { texto: 'JSON.parse()', correcta: false },
              { texto: 'JSON.stringify()', correcta: true },
              { texto: 'JSON.text()', correcta: false }
            ]
          }
        ]
      }
  ];
  const examenesGuardados = JSON.parse(localStorage.getItem(CLAVE_EXAMENES) || '[]');
  const codigosGuardados = new Set(examenesGuardados.map(examen => examen.codigo));
  const examenesCompletos = [
    ...examenesGuardados,
    ...examenesIniciales.filter(examen => !codigosGuardados.has(examen.codigo))
  ];
  localStorage.setItem(CLAVE_EXAMENES, JSON.stringify(examenesCompletos));
}

// =========================================================================
// 2. LOGIN Y SESIÓN (La llave para entrar a las zonas privadas)
// =========================================================================
export function iniciarSesion(email, password) {
  const usuarios = obtenerUsuarios();
  // Buscamos si existe alguien con ese correo y esa contraseña
  const encontrado = usuarios.find(u => u.email === email && u.password === password);
  
  if (encontrado) {
    // Guardamos quién entró (sin guardar su contraseña por seguridad)
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
// 3. GESTIÓN DE USUARIOS (Crear, Leer, Actualizar y Borrar)
// =========================================================================
export function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

export function guardarUsuario(nuevoUsuario) {
  const usuarios = obtenerUsuarios();
  // Revisamos si ya existe para actualizarlo, o si es nuevo para agregarlo
  const indice = usuarios.findIndex(u => u.identificacion === nuevoUsuario.identificacion);
  
  if (indice !== -1) {
    usuarios[indice] = nuevoUsuario; // Actualizar
  } else {
    usuarios.push(nuevoUsuario); // Crear nuevo
  }
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

export function eliminarUsuario(identificacion) {
  const usuarios = obtenerUsuarios().filter(u => u.identificacion !== identificacion);
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

// =========================================================================
// 4. GESTIÓN DE EXÁMENES (Crear, Leer, Actualizar y Borrar)
// =========================================================================
export function obtenerExamenes() {
  return JSON.parse(localStorage.getItem(CLAVE_EXAMENES)) || [];
}

export function guardarExamen(nuevoExamen) {
  const examenes = obtenerExamenes();
  const indice = examenes.findIndex(e => e.codigo === nuevoExamen.codigo);

  if (indice !== -1) {
    examenes[indice] = nuevoExamen; // Actualizar
  } else {
    examenes.push(nuevoExamen); // Crear nuevo
  }
  localStorage.setItem(CLAVE_EXAMENES, JSON.stringify(examenes));
}

export function eliminarExamen(codigo) {
  const examenes = obtenerExamenes().filter(e => e.codigo !== codigo);
  localStorage.setItem(CLAVE_EXAMENES, JSON.stringify(examenes));
}

// =========================================================================
// 5. RESULTADOS DE ESTUDIANTES (Guardar la nota al terminar el examen)
// =========================================================================
export function guardarResultado(resultado) {
  const resultados = JSON.parse(localStorage.getItem(CLAVE_RESULTADOS)) || [];
  resultados.push(resultado);
  localStorage.setItem(CLAVE_RESULTADOS, JSON.stringify(resultados));
}
