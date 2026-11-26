# Acme School — Plataforma Web de Evaluación Académica

Aplicación web tipo **SPA (Single-Page Application)** desarrollada con **JavaScript Vanilla**, **Web Components nativos** y persistencia en **`localStorage`** bajo formato JSON. Permite a docentes y administrativos gestionar usuarios, crear evaluaciones y consultar resultados, mientras los estudiantes presentan exámenes públicos con temporizador en tiempo real y calificación automática.

---

## Características y Módulos

### Módulos Públicos (Sin autenticación)
* **Cartelera de Exámenes (`<vista-cartelera>`):** Catálogo inicial con 12 evaluaciones precargadas por área académica. Cada tarjeta muestra código, título, tiempo límite y porcentaje mínimo de aprobación, integrando ilustraciones temáticas y animación de giro 3D al mantener el cursor.
* **Registro y Resolución en Tiempo Real (`<vista-resolver>`):** Solicita número de identificación y nombre completo del estudiante antes de iniciar. Presenta las preguntas enumeradas con selección única, un reloj regresivo en tiempo real que envía automáticamente al llegar a `00:00`, botón **Terminar** y cálculo inmediato del porcentaje de aciertos y estado de aprobación.

### Módulos Privados (Requieren inicio de sesión)
* **Autenticación (`<vista-login>`):** Acceso mediante correo electrónico y contraseña con protección de rutas para las vistas administrativas y una mascota animada interactiva que reacciona a los campos del formulario.
* **Gestión de Usuarios (`<vista-usuarios>`):** CRUD completo (crear, listar, actualizar y eliminar) para cuentas con rol **Administrativo** o **Docente**, gestionando identificación, nombre completo, email, teléfono, cargo y contraseña.
* **Gestión de Exámenes (`<vista-examenes>`):** CRUD completo de evaluaciones (código, título, tiempo en minutos, porcentaje de aprobación y descripción) y constructor dinámico de preguntas con múltiples opciones y validación estricta de una única respuesta correcta.
* **Historial de Resultados (`<vista-resultados>`):** Panel de consulta con indicadores globales (total de intentos, aprobados, no aprobados y promedio general), búsqueda por estudiante y filtro por examen.

### Experiencia de Usuario (UX)
* **Identidad Visual Oxford Library:** Paleta cromática unificada en tonos madera (`#3E2210`), oro (`#C59B27`), pergamino (`#FDFBF2`) y lomos de libros (`#631622`, `#1E4620`, `#1B325F`), con barra de navegación estilo estantería (`<acme-navbar>`) y mascota global (`<acme-mascota>`).
* **Diseño Responsive:** Adaptable a escritorio, tabletas y dispositivos móviles.

---

## Tecnologías Utilizadas

* **HTML5:** Estructura semántica de la aplicación.
* **CSS3:** Variables globales (`:root`), Flexbox, Grid, animaciones `@keyframes` y estilos encapsulados dentro del Shadow DOM.
* **JavaScript (ES6+):** Programación modular (`ES Modules`), manejo de eventos personalizados (`CustomEvent`) y temporizadores controlados.
* **Web Components Nativos:** `Custom Elements` y `Shadow DOM` (`mode: 'open'`) sin frameworks ni librerías externas.
* **Almacenamiento Local:** `localStorage` con serialización y deserialización en formato **JSON**.

---

## Estructura del Proyecto

```text
ProyectoAcmeschool_JavaScript_ApellidoNombre/
├── index.html                      # Documento principal de la SPA
├── styles.css                      # Variables globales y estilos base Oxford
├── README.md                       # Documentación del proyecto
├── img/                            # Recursos gráficos por materia
│   ├── Algebra.jpg
│   ├── Biologia.avif
│   ├── ciencias politicas.jpg
│   ├── ecologia.jpg
│   ├── filosofia.jpg
│   ├── Fisica.jpg
│   ├── geografia.jpg
│   ├── historia.avif
│   ├── ingles.jpg
│   ├── Literatura.jpg
│   ├── logica.jpg
│   └── Quimica.jpg
└── js/
    ├── main.js                     # Controlador de rutas y guardas de sesión
    ├── storage.js                  # Capa de datos JSON, CRUD y semilla inicial
    └── components/
        ├── acme-navbar.js          # Barra de navegación estilo estantería
        ├── acme-mascota.js         # Mascota estudiosa animada global
        ├── vista-cartelera.js      # Catálogo público de exámenes
        ├── vista-resolver.js       # Ejecución y calificación de exámenes
        ├── vista-login.js          # Inicio de sesión privado
        ├── vista-usuarios.js       # Administración CRUD de usuarios
        ├── vista-examenes.js       # Administración CRUD de exámenes y preguntas
        └── vista-resultados.js     # Historial y métricas de evaluaciones
```

---

## Instalación y Ejecución

1. Clona este repositorio en tu equipo local:
   ```bash
   git clone [https://github.com/tu-usuario/ProyectoAcmeschool_JavaScript_ApellidoNombre.git](https://github.com/tu-usuario/ProyectoAcmeschool_JavaScript_ApellidoNombre.git)
   ```
2. Abre la carpeta del proyecto en **Visual Studio Code**.
3. Ejecuta `index.html` utilizando la extensión **Live Server** (es necesario un servidor local para el correcto funcionamiento de los módulos ES6 `type="module"`).
4. Para desplegar en **GitHub Pages**, publica desde la rama principal (`main` o `master`) en *Settings > Pages*; todas las rutas están configuradas de forma relativa.

---

## Credenciales de Prueba (Acceso Privado)

Al iniciar la plataforma por primera vez, `js/storage.js` precarga automáticamente 12 evaluaciones completas y la siguiente cuenta administrativa:

| Campo | Valor |
| :--- | :--- |
| **Correo electrónico** | `chucho@gmail.com` |
| **Contraseña** | `123` |
| **Rol** | `Administrativo` |

---