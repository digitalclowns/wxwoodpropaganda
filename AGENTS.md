# AGENTS.md

Este archivo contiene los lineamientos estrictos para cualquier agente de IA que trabaje en este proyecto.

## 1. Tecnologías y Estilos
- **CSS**: Se debe utilizar **TailwindCSS** de forma **estricta**.
  - No se permite el uso de archivos CSS personalizados ni estilos en línea (inline styles) que no sean clases de utilidad de Tailwind.
  - Se debe utilizar TailwindCSS vía **CDN**.
- **HTML**:
  - Utilizar **HTML5 semántico** (header, main, section, footer, article, etc.).
  - Estructura optimizada para **SEO** (meta tags, jerarquía de encabezados correcta).
- **JavaScript**:
  - Vanilla JS es preferible para mantener la ligereza, a menos que se requiera una librería específica mencionada en los requerimientos.
  - **Scrollama.js** es obligatorio para el efecto de scrollytelling.

## 2. Estructura del Proyecto
- **Tipo**: One-page con efecto scrollytelling.
- **Contenido**:
  - El contenido principal se carga dinámicamente desde un archivo `.json`.
  - Cada ítem en el JSON representa un "slide" o sección del scrollytelling.
  - El JSON base se construye a partir de archivos `.txt` ubicados en el directorio `/DATA/`.

## 3. Flujo de Trabajo
1. **Procesamiento de Datos**:
   - Leer los archivos `.txt` de `/DATA/`.
   - Generar/Actualizar el archivo JSON principal con el contenido de los textos.
2. **Desarrollo Frontend**:
   - Crear la estructura HTML base importando Tailwind vía CDN.
   - Implementar la lógica de carga del JSON.
   - Configurar Scrollama.js para manejar las transiciones entre slides basadas en el contenido del JSON.

## 4. Reglas Generales
- **Optimización**: El código debe ser limpio y eficiente para minimizar el uso de tokens al ser leído o modificado por otros agentes.
- **Claridad**: Comentar el código donde sea necesario para explicar la lógica compleja, especialmente en la integración de Scrollama y el manejo del JSON.
