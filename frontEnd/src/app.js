/**
 * APP.JS - ENRUTADOR PRINCIPAL DEL MONOPOLY
 * 
 * Responsabilidades:
 * - Navegación entre páginas (configuración, juego, ranking)
 * - Gestión del estado global de la aplicación
 * - Inicialización de módulos según la página actual
 * - Comunicación entre componentes
 */

// ============== CONFIGURACIÓN GLOBAL ==============
const APP_CONFIG = {
    pages: {
        CONFIGURACION: 'configuracion',
        TABLERO: 'tablero',
        RANKING: 'ranking',
        COMO_JUGAR: 'como-jugar'
    },
    storage: {
        JUGADORES: 'jugadores',
        PARTIDA_ACTUAL: 'partida-actual',
        CONFIGURACION: 'monopoly-config'
    }
};

// ============== ESTADO GLOBAL DE LA APLICACIÓN ==============
window.MonopolyApp = {
    currentPage: null,
    jugadores: [],
    configuracion: {},
    
    // Métodos públicos para otros módulos
    navegarA: function(pagina) {
        navegarAPagina(pagina);
    },
    
    obtenerJugadores: function() {
        return this.jugadores;
    },
    
    guardarJugadores: function(jugadores) {
        this.jugadores = jugadores;
        localStorage.setItem(APP_CONFIG.storage.JUGADORES, JSON.stringify(jugadores));
    },
    
    // Métodos de utilidad para debug
    limpiarDatos: function() {
        localStorage.clear();
        this.jugadores = [];
        this.configuracion = {};
        console.log('Datos de la aplicación limpiados');
    },
    
    obtenerEstado: function() {
        return {
            currentPage: this.currentPage,
            jugadores: this.jugadores,
            configuracion: this.configuracion,
            localStorage: {
                jugadores: localStorage.getItem(APP_CONFIG.storage.JUGADORES),
                configuracion: localStorage.getItem(APP_CONFIG.storage.CONFIGURACION)
            }
        };
    }
};

// ============== FUNCIONES DE NAVEGACIÓN ==============

/**
 * Navega a una página específica del juego
 * @param {string} pagina - Nombre de la página (configuracion, tablero, ranking)
 */
function navegarAPagina(pagina) {
    console.log(`Navegando a: ${pagina}`);
    
    switch (pagina) {
        case APP_CONFIG.pages.CONFIGURACION:
            window.location.href = 'src/pages/index.html';
            break;
            
        case APP_CONFIG.pages.TABLERO:
            navegarATablero();
            break;
            
        case APP_CONFIG.pages.RANKING:
            window.location.href = 'src/pages/ranking.html';
            break;
            
        case APP_CONFIG.pages.COMO_JUGAR:
            window.location.href = 'como-jugar.html';
            break;
            
        default:
            console.error(`Página no encontrada: ${pagina}`);
    }
}

/**
 * Navegación específica al tablero con validaciones
 */
function navegarATablero() {
    const jugadores = obtenerJugadoresGuardados();
    
    if (!jugadores || jugadores.length < 2) {
        if (typeof mostrarModalInfo === 'function') {
            mostrarModalInfo('Error', 'No hay jugadores configurados. Configura al menos 2 jugadores primero.');
        } else if (typeof window.Toast !== 'undefined' && window.Toast) {
            window.Toast.warning("Configura al menos 2 jugadores antes de empezar.", "Jugadores Requeridos");
        } else {
            alert('⚠️ Configura al menos 2 jugadores antes de empezar.');
        }
        navegarAPagina(APP_CONFIG.pages.CONFIGURACION);
        return;
    }
    
    // Guardar estado antes de navegar
    MonopolyApp.jugadores = jugadores;
    window.location.href = 'src/components/tablero/tablero.html';
}

/**
 * Regresa a la página anterior o a configuración por defecto
 */
function volverAtras() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        navegarAPagina(APP_CONFIG.pages.CONFIGURACION);
    }
}

/**
 * Navega al index.html principal
 */
function irAlInicio() {
    // Detectar desde qué ubicación se está llamando
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/src/pages/')) {
        // Desde pages/ -> sube dos niveles
        window.location.href = '../../index.html';
    } else if (currentPath.includes('/src/components/')) {
        // Desde components/ -> sube tres niveles  
        window.location.href = '../../../index.html';
    } else {
        // Desde raíz de frontEnd
        window.location.href = 'index.html';
    }
}

// ============== GESTIÓN DE ESTADO ==============

/**
 * Obtiene los jugadores guardados en localStorage
 * @returns {Array} Array de jugadores o array vacío
 */
function obtenerJugadoresGuardados() {
    try {
        const jugadoresString = localStorage.getItem(APP_CONFIG.storage.JUGADORES);
        return jugadoresString ? JSON.parse(jugadoresString) : [];
    } catch (error) {
        console.error('Error al obtener jugadores:', error);
        return [];
    }
}

/**
 * Guarda jugadores en localStorage y actualiza estado global
 * @param {Array} jugadores - Array de objetos jugador
 */
function guardarJugadoresEnEstado(jugadores) {
    MonopolyApp.jugadores = jugadores;
    localStorage.setItem(APP_CONFIG.storage.JUGADORES, JSON.stringify(jugadores));
    console.log('Jugadores guardados en estado global:', jugadores);
}

/**
 * Obtiene la configuración actual del juego
 * @returns {Object} Objeto de configuración
 */
function obtenerConfiguracion() {
    try {
        const configString = localStorage.getItem(APP_CONFIG.storage.CONFIGURACION);
        return configString ? JSON.parse(configString) : {};
    } catch (error) {
        console.error('Error al obtener configuración:', error);
        return {};
    }
}

/**
 * Guarda la configuración del juego
 * @param {Object} config - Objeto de configuración
 */
function guardarConfiguracion(config) {
    MonopolyApp.configuracion = config;
    localStorage.setItem(APP_CONFIG.storage.CONFIGURACION, JSON.stringify(config));
}

// ============== INICIALIZACIÓN DE LA APLICACIÓN ==============

/**
 * Inicializa la aplicación según la página actual
 */
function inicializarApp() {
    console.log('Inicializando Monopoly App...');
    
    // Cargar estado previo
    MonopolyApp.jugadores = obtenerJugadoresGuardados();
    MonopolyApp.configuracion = obtenerConfiguracion();
    
    // Detectar página actual
    const path = window.location.pathname;
    const filename = window.location.pathname.split('/').pop();
    
    if (path.includes('configuracion') || filename === 'configuracion.html') {
        MonopolyApp.currentPage = APP_CONFIG.pages.CONFIGURACION;
        inicializarConfiguracion();
    } else if (path.includes('tablero') || filename === 'tablero.html') {
        MonopolyApp.currentPage = APP_CONFIG.pages.TABLERO;
        inicializarTablero();
    } else if (path.includes('ranking') || filename === 'ranking.html') {
        MonopolyApp.currentPage = APP_CONFIG.pages.RANKING;
        inicializarRanking();
    } else if (path.includes('como-jugar') || filename === 'como-jugar.html') {
        MonopolyApp.currentPage = APP_CONFIG.pages.COMO_JUGAR;
        console.log('Página como-jugar inicializada');
    }
    
    console.log(`Página actual: ${MonopolyApp.currentPage}`);
}

/**
 * Inicializa la página de configuración
 */
function inicializarConfiguracion() {
    console.log('Inicializando página de configuración...');
    // La lógica específica está en configuracion.js
}

/**
 * Inicializa la página del tablero
 */
function inicializarTablero() {
    console.log('Inicializando tablero de juego...');
    
    // Validar que hay jugadores
    if (!MonopolyApp.jugadores || MonopolyApp.jugadores.length < 2) {
        console.warn('No hay suficientes jugadores, redirigiendo a configuración...');
        navegarAPagina(APP_CONFIG.pages.CONFIGURACION);
        return;
    }
    
    // La lógica específica está en tablero.js
}

/**
 * Inicializa la página de ranking
 */
function inicializarRanking() {
    console.log('Inicializando página de ranking...');
    // La lógica específica está en ranking.js
}

// ============== FUNCIONES GLOBALES PARA RETROCOMPATIBILIDAD ==============

/**
 * Función global para guardar jugadores (usada por configuracion.js)
 * @deprecated Usar MonopolyApp.guardarJugadores() en su lugar
 */
window.guardarJugadores = function() {
    console.warn('Función guardarJugadores() está obsoleta. Usar navegarATablero()');
    navegarATablero();
};

/**
 * Función global para navegar al tablero
 */
window.navegarATablero = navegarATablero;

/**
 * Función global para obtener jugadores
 */
window.obtenerJugadores = function() {
    return MonopolyApp.obtenerJugadores();
};

/**
 * Función global para navegar a páginas (usada por configuracion.js)
 */
window.navegarAPagina = navegarAPagina;

/**
 * Función global para volver atrás (usada por configuracion.html)
 */
window.volverAtras = volverAtras;

/**
 * Función global para ir al inicio (usada desde cualquier página)
 */
window.irAlInicio = irAlInicio;

// ============== INICIALIZACIÓN ==============

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarApp);

// Manejar navegación del navegador
window.addEventListener('popstate', function(event) {
    console.log('Navegación detectada, reinicializando...');
    inicializarApp();
});

console.log('App.js cargado - Enrutador principal inicializado');
