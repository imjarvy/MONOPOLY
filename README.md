# Monopoly Game Frontend

Frontend for the Monopoly game application.

## Project Structure


## PROMPT PARA EL JUEGO
####################################

Aquí tienes la propuesta ajustada para el desarrollo del **MONOPOLY WEB SIMPLIFICADO**, siguiendo tanto el prompt como la estructura de carpetas inspirada en tu proyecto de entrega (`delivery_responsive_web_proyect`).  
Incluye la división de tareas entre 3 personas, descripciones claras de conceptos, etapas, y recomendaciones de estructura organizativa y buenas prácticas.

---

## 1. Estructura de Carpetas Recomendada

# Monopoly Game Frontend

Frontend moderno para el juego Monopoly con arquitectura **Clean Component Architecture (CCA)**.

## Arquitectura del Proyecto

Este proyecto implementa una **Clean Component Architecture** que combina:
- ✅ **Principios SOLID** para código mantenible
- ✅ **Separación de responsabilidades** clara
- ✅ **Patrón MVC** con controladores especializados
- ✅ **Factory Pattern** para creación de objetos
- ✅ **Manager Pattern** para gestión de estado
- ✅ **Validator Pattern** para validaciones
- ✅ **Renderer Pattern** para UI

## Estructura de Carpetas

```
monopoly-frontend/
├── index.html                    # Página principal de entrada
├── README.md                     # Documentación del proyecto
├── public/                       # Recursos estáticos públicos
│   └── assets/                   # Imágenes, videos, iconos
│       ├── img/
│       │   ├── Monopoly-Emblem.webp
│       │   └── video.mp4
│       └── ...
├── src/                          # Código fuente principal
│   ├── app.js                    # Configuración global y entrada
│   ├── main.js                   # Punto de entrada de la aplicación
│   │
│   ├── components/               # Componentes reutilizables de UI
│   │   ├── tablero/              # Componente del tablero de juego
│   │   │   ├── tablero.js        # Lógica principal del tablero
│   │   │   ├── tablero.css       # Estilos del tablero
│   │   │   ├── tablero.html      # Vista del tablero
│   │   │   └── dados.js          # Sistema de dados
│   │   ├── toast/                # Sistema de notificaciones
│   │   │   ├── toast.js          # Lógica de notificaciones
│   │   │   └── toast.css         # Estilos de toast
│   │   ├── modals/               # Sistema de modales
│   │   │   ├── modal.js          # Modal base
│   │   │   ├── modal.css         # Estilos de modales
│   │   │   ├── dadosModal.js     # Modal específico para dados
│   │   │   └── registroUsuarios.js # Modal de registro
│   │   └── panelJugador.js       # Panel de información del jugador
│   │
│   ├── pages/                    # Páginas/Vistas principales
│   │   ├── index.js              # Lógica de la página principal
│   │   ├── configuracion.js      # Página de configuración
│   │   ├── configuracion.html    # Vista de configuración
│   │   ├── ranking.js            # Página de ranking
│   │   ├── ranking.html          # Vista de ranking
│   │   ├── jugadores.html        # Vista de gestión de jugadores
│   │   └── como-jugar.html       # Página de instrucciones
│   │
│   ├── controllers/              # Controladores (Patrón MVC)
│   │   ├── indexController.js    # Controlador de la página principal
│   │   ├── tableroController.js  # Controlador del tablero de juego
│   │   └── gameController.js     # Controlador principal del juego
│   │
│   ├── services/                 # Servicios para comunicación con backend
│   │   ├── boardService.js       # Servicio del tablero (fetch)
│   │   ├── countriesService.js   # API de países (fetch)
│   │   ├── cardsService.js       # Servicio de cartas (fetch)
│   │   ├── rankingService.js     # Servicio de ranking (fetch)
│   │   └── scoreService.js       # Servicio de puntuaciones (fetch)
│   │
│   ├── utils/                    # Utilidades y helpers
│   │   ├── jugadorHelper.js      # Helper para operaciones de jugadores
│   │   └── tableroHelper.js      # Helper para operaciones de tablero
│   │
│   ├── validators/               # Validadores (Patrón Validator)
│   │   ├── jugadorValidator.js   # Validaciones de jugadores
│   │   └── tableroValidator.js   # Validaciones de tablero
│   │
│   ├── renderers/                # Renderizadores de UI (Patrón Renderer)
│   │   ├── jugadorRenderer.js    # Renderizado de jugadores
│   │   └── tableroRenderer.js    # Renderizado de tablero
│   │
│   ├── factories/                # Factories para creación de objetos (Patrón Factory)
│   │   └── casillaFactory.js     # Factory para crear casillas
│   │
│   ├── managers/                 # Managers para gestión de estado (Patrón Manager)
│   │   └── fichasManager.js      # Gestión de fichas de jugadores
│   │
│   ├── compatibility/            # Funciones de compatibilidad
│   │   └── globalFunctions.js    # Funciones globales para HTML
│   │
│   └── styles/                   # Hojas de estilo CSS
│       ├── main.css              # Estilos principales
│       ├── index.css             # Estilos de la página principal
│       ├── configuracion.css     # Estilos de configuración
│       ├── ranking.css           # Estilos de ranking
│       └── panelJugador.css      # Estilos del panel de jugador
```

## Principios de la Clean Component Architecture

### 1. **Single Responsibility Principle (SRP)**
- Cada archivo tiene una responsabilidad específica
- Controllers manejan lógica de negocio
- Renderers solo se encargan de la UI
- Validators solo validan datos

### 2. **Open/Closed Principle (OCP)**
- Fácil extensión sin modificar código existente
- Uso de Factory patterns para nuevos tipos
- Interfaces consistentes

### 3. **Dependency Inversion (DIP)**
- Controllers dependen de abstracciones, no implementaciones
- Services son inyectados, no hardcodeados

### 4. **Separación de Capas**
```
┌─────────────────┐
│  Components     │ ← Vista (HTML + CSS)
├─────────────────┤
│  Controllers    │ ← Lógica de Control
├─────────────────┤
│  Services       │ ← Comunicación Backend
├─────────────────┤
│  Utils/Helpers  │ ← Funciones Auxiliares
└─────────────────┘
```

## Patrones de Diseño Implementados

| Patrón | Ubicación | Propósito |
|---------|-----------|-----------|
| **MVC** | `/controllers` | Separar lógica de vista |
| **Factory** | `/factories` | Crear objetos complejos |
| **Manager** | `/managers` | Gestionar estado |
| **Validator** | `/validators` | Validar datos |
| **Renderer** | `/renderers` | Renderizar UI |
| **Service** | `/services` | Comunicación backend |
| **Helper** | `/utils` | Funciones auxiliares |

## Flujo de Datos

```
HTML (onclick) → GlobalFunctions → Controller → Validator → Manager/Factory → Renderer → DOM
                                       ↓
                                   Service (API) ← Backend
```

## Características Técnicas

### ✅ **Modularidad**
- Código dividido en módulos específicos
- Imports/exports ES6 para dependencias
- Compatibilidad con HTML tradicional

### ✅ **Escalabilidad**
- Fácil agregar nuevos componentes
- Estructura preparada para crecimiento
- Separación clara de responsabilidades

### ✅ **Mantenibilidad**
- Código limpio y documentado
- Funciones pequeñas (máx 30 líneas)
- Nombres descriptivos y consistentes

### ✅ **Testabilidad**
- Componentes independientes
- Inyección de dependencias
- Mocks fáciles de implementar

## Tecnologías Utilizadas

- **JavaScript ES6+** - Módulos, clases, async/await
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con Flexbox/Grid
- **Bootstrap 4** - Framework CSS
- **REST APIs** - Comunicación con backend

## Scripts y Comandos

### Desarrollo
```bash
# Servidor de desarrollo
npx live-server frontEnd/

# O con VS Code Live Server
# Abrir frontEnd/index.html con Live Server
```

### Testing
```bash
# Probar sistema Toast
window.probarTodosLosToasts()

# Verificar componentes
console.log(window.Toast, window.indexController)
```

## Convenciones de Código

### **Nomenclatura**
- **Controllers**: `nombreController.js`
- **Services**: `nombreService.js` (solo para backend)
- **Helpers**: `nombreHelper.js`
- **Validators**: `nombreValidator.js`
- **Renderers**: `nombreRenderer.js`
- **Factories**: `nombreFactory.js`
- **Managers**: `nombreManager.js`

### **Estructura de Archivos**
```javascript
// 1. Imports
import { ... } from '...';

// 2. Constantes/Config
const CONFIG = {...};

// 3. Clase principal
export class NombreClase {
    constructor() {...}
    
    // Métodos públicos primero
    metodoPublico() {...}
    
    // Métodos privados después
    _metodoPrivado() {...}
}

// 4. Funciones auxiliares
function funcionAuxiliar() {...}

// 5. Exports
export { ... };
```

## Equipo de Desarrollo

Este proyecto fue desarrollado siguiendo metodologías ágiles con división clara de responsabilidades:

- **Frontend Architecture**: Diseño de arquitectura limpia
- **Component Development**: Desarrollo de componentes reutilizables
- **Integration & Testing**: Integración y pruebas del sistema

## Próximas Mejoras

- [ ] Implementar testing unitario (Jest)
- [ ] Agregar TypeScript para tipado fuerte
- [ ] Implementar PWA (Progressive Web App)
- [ ] Optimizar para performance (lazy loading)
- [ ] Agregar internacionalización (i18n)

---

**🎮 ¡Disfruta jugando Monopoly con arquitectura limpia y moderna!**

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


### DEsARROLLO PERsONA 2
### Flujo de conexión entre componentes

### Flujo de conexión entre componentes

- El **tablero** se renderiza dinámicamente usando los datos obtenidos por `boardService.js`.
- El **panel de jugadores** muestra el estado actual de cada jugador y se actualiza en cada turno.
- El **componente de dados** permite lanzar los dados; al hacerlo, llama a `moverFichaActual(casillas)` en `app.js`.
- La función `moverFichaActual` actualiza la posición del jugador, mueve la ficha en el tablero y llama a `siguienteTurno` para cambiar el turno y actualizar el panel.
- Todos los componentes están conectados mediante funciones importadas/exportadas y el estado global de los jugadores.