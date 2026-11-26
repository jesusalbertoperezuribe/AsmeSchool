# Acme School

Plataforma académica para gestionar usuarios y exámenes, presentar evaluaciones en línea y consultar resultados.

## Tecnologías

- HTML5 y CSS3
- JavaScript con ES Modules
- Web Components nativos con Shadow DOM
- `localStorage` para usuarios, sesión, exámenes y resultados

## Estructura

```text
index.html
styles.css
img/                    Imágenes temáticas de exámenes
js/main.js              Enrutamiento y montaje de vistas
js/storage.js           Persistencia local y datos iniciales
js/components/          Navbar y vistas como Web Components
```

## Uso local y despliegue

Abre `index.html` desde un servidor estático local (por ejemplo, Live Server). La aplicación usa módulos ES y necesita servirse por HTTP; no se recomienda abrir el archivo directamente con `file://`.

Para GitHub Pages, publica la rama o carpeta que contiene `index.html`, `styles.css`, `js/` e `img/`. Las rutas del proyecto son relativas y funcionan bajo el subdirectorio del repositorio.

## Acceso de prueba

- Correo: `chucho@gmail.com`
- Contraseña: `123`

Los datos se guardan en el almacenamiento local del navegador y son específicos de cada navegador/dispositivo.
