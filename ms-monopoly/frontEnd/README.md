# Monopoly Game Frontend

Frontend for the Monopoly game application.

## Project Structure

```
/public
  /assets
    /img         # Images for cards, board, flags, etc.
    /icons       # Game icons (dice, houses, hotels, etc.)
/src
  /components    # Reusable JS components (Board, PlayerPanel, ActionModal, Ranking, etc.)
  /pages         # Main views (Settings, Game, Ranking)
  /services      # Backend consumption modules (fetch)
  /styles        # CSS files organized (by pages/components if necessary)
  /utils         # Helper functions (dice, property, validations, helpers)
  app.js         # Main logic and page router
  main.js        # Entry point, initializer
index.html       # Main HTML file



## PROMPT PARA EL JUEGO
####################################

Aquí tienes la propuesta ajustada para el desarrollo del **MONOPOLY WEB SIMPLIFICADO**, siguiendo tanto el prompt como la estructura de carpetas inspirada en tu proyecto de entrega (`delivery_responsive_web_proyect`).  
Incluye la división de tareas entre 3 personas, descripciones claras de conceptos, etapas, y recomendaciones de estructura organizativa y buenas prácticas.

---

## 1. Estructura de Carpetas Recomendada

```plaintext
/public
  /assets
    /img         # Imágenes de fichas, tablero, banderas, etc.
    /icons       # Iconos del juego (dados, casas, hoteles, etc.)
/src
  /components    # Componentes JS reutilizables (Tablero, PanelJugador, ModalAccion, Ranking, etc.)
  /pages         # Vistas principales (Configuración, Juego, Ranking)
  /services      # Módulos para consumo del backend (fetch)
  /styles        # Archivos CSS organizados (por páginas/componentes si es necesario)
  /utils         # Funciones auxiliares (dados, patrimonio, validaciones, helpers)
  app.js         # Lógica principal y enrutador de páginas
  main.js        # Punto de entrada, inicializador
index.html       # Archivo HTML principal
README.md        # Documentación principal
```

---

## 2. División en Etapas para 3 Personas

### **Etapa 1: Configuración Inicial y Responsive**
**Responsable:** Persona 1  
**Tareas:**
- Crear `/src/pages/configuracion.js` y su CSS.
- Formulario para seleccionar número de jugadores, ingresar nickname y país (usando `/src/services/countriesService.js` que hace fetch al endpoint de países).
- Validaciones (cantidad de jugadores, datos requeridos).
- Preparar estructura base de `/public/assets` (img, icons).
- Garantizar diseño adaptable (responsive) usando Bootstrap y CSS propio.
- Documentar el código y los cambios realizados.

---

### **Etapa 2: Tablero y Manipulación Avanzada del DOM**
**Responsable:** Persona 2  
**Tareas:**
- Crear `/src/components/tablero.js` y su CSS.
- Usar `/src/services/boardService.js` para obtener el tablero del backend.
- Renderizar dinámicamente las casillas, mostrando nombre, color, estado, casas/hotel.
- Crear componente para dados (`/src/components/dados.js`) y lógica de movimiento de fichas en el DOM.
- Panel visual para cada jugador, mostrando dinero, propiedades, hipotecas/préstamos.
- Controlar el cambio de turnos y el estado del juego.
- Documentar funciones principales y su relación.

---

### **Etapa 3: Lógica de Juego, Acciones y Ranking**
**Responsable:** Persona 3  
**Tareas:**
- Implementar en `/src/utils/` la lógica de compra/venta, construcción de casas/hoteles, hipotecas/préstamos, cartas especiales, cárcel, impuestos.
- Integrar acciones en el tablero y paneles mediante modales/componentes (`/src/components/modalAccion.js`).
- Finalización de partida:
  - Botón "Finalizar Juego"
  - Cálculo de patrimonio y ganador.
  - Envío de resultados con `/src/services/scoreService.js` (POST).
  - Ranking global con `/src/services/rankingService.js` (GET) y banderas usando FlagsAPI.
- Documentar todos los cambios y explicar ejemplos de uso.

---

## 3. Conceptos Clave Explicados

### **Manipulación del DOM**
Modificar la estructura y contenido de la página en tiempo real usando JavaScript:
```js
document.getElementById("casilla-propiedad").textContent = propiedad.nombre;
```

### **Asincronía y fetch**
Obtener datos del backend usando `fetch` para actualizar la interfaz sin recargar la página:
```js
fetch("http://127.0.0.1:5000/board")
  .then(res => res.json())
  .then(data => renderizarTablero(data));
```

### **Objetos, Arrays y Estado**
Modelar jugadores, propiedades, tablero, turnos, etc. usando objetos y arrays:
```js
const jugadores = [
  { nickname: "Juan", pais: "co", dinero: 1500, propiedades: [] }
];
```

---

## 4. Buenas Prácticas y Recomendaciones

- Mantén **archivos JS y CSS separados** por funcionalidad.
- Reutiliza componentes y funciones (por ejemplo, paneles de jugadores, modales de acciones).
- Usa comentarios claros explicando cada función/objeto principal y documenta cada modificación.
- Maneja errores de fetch y muestra mensajes claros al usuario.
- Documenta cada cambio: qué archivo se modificó, qué funcionalidad se agregó/corrigió, ejemplo de uso si aplica.

---

## 5. Resumen de Etapas y Archivos Clave

### **Persona 1**
- `/src/pages/configuracion.js`
- `/src/services/countriesService.js`
- `/src/styles/configuracion.css`
- `/public/assets/img`, `/public/assets/icons`
- `index.html`
- Documentación de cambios y estructura.

### **Persona 2**
- `/src/components/tablero.js`
- `/src/services/boardService.js`
- `/src/components/dados.js`
- `/src/components/panelJugador.js`
- `/src/styles/tablero.css`, `/src/styles/panelJugador.css`
- Documentación y relación entre componentes.

### **Persona 3**
- `/src/utils/juego.js`, `/src/utils/acciones.js`
- `/src/components/modalAccion.js`
- `/src/services/scoreService.js`
- `/src/services/rankingService.js`
- `/src/styles/modalAccion.css`, `/src/styles/ranking.css`
- Documentación de lógica y ejemplos de uso.

---

¿Deseas ejemplos iniciales de archivos, estructura base de carpetas, o la guía para iniciar el README/documentación del proyecto?
