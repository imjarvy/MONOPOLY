/**
 * APP.JS - ENRUTADOR PRINCIPAL DEL MONOPOLY + LÓGICA DE TURNO Y FICHAS
 * 
 * Este archivo integra la navegación, estado global y lógica de turnos/fichas
 * de las ramas karen2 (diseño y rutas) y jarvy (lógica de dados/turnos).
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

// ============== CONSTANTES DEL JUEGO ==============
const GAME_CONFIG = {
    MAX_CASILLAS: 40,
    MIN_JUGADORES: 2,
    DINERO_INICIAL: 1500,
    ESTADOS_JUEGO: {
        ESPERANDO_DADOS: 'esperando_dados',
        ACCION_CASILLA: 'accion_casilla',
        COMPRA: 'compra',
        FIN: 'fin'
    }
};

// ============== ESTADO GLOBAL DE LA APLICACIÓN ==============
window.MonopolyApp = {
    currentPage: null,
    jugadores: [],
    configuracion: {},
    turnoActual: 0,
    estadoJuego: GAME_CONFIG.ESTADOS_JUEGO.ESPERANDO_DADOS,
    
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
    limpiarDatos: function() {
        localStorage.clear();
        this.jugadores = [];
        this.configuracion = {};
        this.turnoActual = 0;
        this.estadoJuego = GAME_CONFIG.ESTADOS_JUEGO.ESPERANDO_DADOS;
        console.log('Datos de la aplicación limpiados');
    },
    obtenerEstado: function() {
        return {
            currentPage: this.currentPage,
            jugadores: this.jugadores,
            configuracion: this.configuracion,
            turnoActual: this.turnoActual,
            estadoJuego: this.estadoJuego,
            localStorage: {
                jugadores: localStorage.getItem(APP_CONFIG.storage.JUGADORES),
                configuracion: localStorage.getItem(APP_CONFIG.storage.CONFIGURACION)
            }
        };
    }
};

// ============== FUNCIONES DE NAVEGACIÓN ==============

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

function navegarATablero() {
    const jugadores = obtenerJugadoresGuardados();
    if (!jugadores || jugadores.length < GAME_CONFIG.MIN_JUGADORES) {
        const mensaje = `Configura al menos ${GAME_CONFIG.MIN_JUGADORES} jugadores antes de empezar.`;
        if (typeof mostrarModalInfo === 'function') {
            mostrarModalInfo('Error', 'No hay jugadores configurados. ' + mensaje);
        } else if (typeof window.Toast !== 'undefined' && window.Toast) {
            window.Toast.warning(mensaje, "Jugadores Requeridos");
        } else {
            alert('⚠️ ' + mensaje);
        }
        navegarAPagina(APP_CONFIG.pages.CONFIGURACION);
        return;
    }
    MonopolyApp.jugadores = jugadores;
    window.location.href = 'src/components/tablero/tablero.html';
}

function volverAtras() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        navegarAPagina(APP_CONFIG.pages.CONFIGURACION);
    }
}

function irAlInicio() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/src/pages/')) {
        window.location.href = '../../index.html';
    } else if (currentPath.includes('/src/components/')) {
        window.location.href = '../../../index.html';
    } else {
        window.location.href = 'index.html';
    }
}

// ============== GESTIÓN DE ESTADO ==============

function obtenerJugadoresGuardados() {
    try {
        const jugadoresString = localStorage.getItem(APP_CONFIG.storage.JUGADORES);
        return jugadoresString ? JSON.parse(jugadoresString) : [];
    } catch (error) {
        console.error('Error al obtener jugadores:', error);
        return [];
    }
}

function guardarJugadoresEnEstado(jugadores) {
    MonopolyApp.jugadores = jugadores;
    localStorage.setItem(APP_CONFIG.storage.JUGADORES, JSON.stringify(jugadores));
    console.log('Jugadores guardados en estado global:', jugadores);
}

function obtenerConfiguracion() {
    try {
        const configString = localStorage.getItem(APP_CONFIG.storage.CONFIGURACION);
        return configString ? JSON.parse(configString) : {};
    } catch (error) {
        console.error('Error al obtener configuración:', error);
        return {};
    }
}

function guardarConfiguracion(config) {
    MonopolyApp.configuracion = config;
    localStorage.setItem(APP_CONFIG.storage.CONFIGURACION, JSON.stringify(config));
}

// ============== INICIALIZACIÓN DE LA APLICACIÓN ==============

function inicializarApp() {
    console.log('Inicializando Monopoly App...');

    MonopolyApp.jugadores = obtenerJugadoresGuardados();
    MonopolyApp.configuracion = obtenerConfiguracion();

    // Carga lógica de tablero (turbo integración)
    if (!Array.isArray(MonopolyApp.jugadores) || MonopolyApp.jugadores.length < GAME_CONFIG.MIN_JUGADORES) {
        MonopolyApp.jugadores = [
            { nickname: "Juan", pais: "CO", dinero: GAME_CONFIG.DINERO_INICIAL, propiedades: [], hipotecas: [], posicion: 0 },
            { nickname: "Ana", pais: "MX", dinero: GAME_CONFIG.DINERO_INICIAL, propiedades: [], hipotecas: [], posicion: 0 }
        ];
        console.log('Jugadores por defecto cargados para desarrollo');
    }
    MonopolyApp.turnoActual = 0;
    MonopolyApp.estadoJuego = GAME_CONFIG.ESTADOS_JUEGO.ESPERANDO_DADOS;

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

function inicializarConfiguracion() {
    console.log('Inicializando página de configuración...');
    // Lógica específica en configuracion.js
}

function inicializarTablero() {
    console.log('Inicializando tablero de juego...');
    if (!MonopolyApp.jugadores || MonopolyApp.jugadores.length < GAME_CONFIG.MIN_JUGADORES) {
        console.warn(`No hay suficientes jugadores (mínimo ${GAME_CONFIG.MIN_JUGADORES}), redirigiendo a configuración...`);
        navegarAPagina(APP_CONFIG.pages.CONFIGURACION);
        return;
    }
    
    // Inicializar fichas en el tablero si estamos en la página correcta
    setTimeout(() => {
        actualizarFichas(MonopolyApp.jugadores);
        if (typeof renderizarPanelJugadores === 'function') {
            renderizarPanelJugadores(MonopolyApp.jugadores, MonopolyApp.turnoActual);
        }
    }, 100);
    
    console.log(`Tablero inicializado con ${MonopolyApp.jugadores.length} jugadores`);
}

function inicializarRanking() {
    console.log('Inicializando página de ranking...');
    // Lógica específica en ranking.js
}

// ============== LÓGICA DE TURNO Y FICHAS (jarvy) ==============

// Si usas módulos, descomenta la siguiente línea y ajusta el import según sea necesario
// import { renderizarPanelJugadores } from './components/panelJugador.js';

/**
 * Cambia el turno al siguiente jugador y actualiza el panel.
 * Se llama después de cada movimiento de ficha.
 */
function siguienteTurno() {
    if (!MonopolyApp.jugadores || MonopolyApp.jugadores.length === 0) {
        console.error('No hay jugadores disponibles para cambiar turno');
        return;
    }
    
    MonopolyApp.turnoActual = (MonopolyApp.turnoActual + 1) % MonopolyApp.jugadores.length;
    MonopolyApp.estadoJuego = GAME_CONFIG.ESTADOS_JUEGO.ESPERANDO_DADOS;
    
    const jugadorActual = MonopolyApp.jugadores[MonopolyApp.turnoActual];
    console.log(`Turno cambiado a: ${jugadorActual?.nickname || 'N/A'} (${MonopolyApp.turnoActual + 1}/${MonopolyApp.jugadores.length})`);
    
    // Renderizar panel si la función está disponible
    if (typeof renderizarPanelJugadores === 'function') {
        renderizarPanelJugadores(MonopolyApp.jugadores, MonopolyApp.turnoActual);
    }
    
    return jugadorActual;
}

/**
 * Mueve la ficha del jugador actual en el tablero y actualiza el DOM.
 * @param {number} casillas - Número de casillas a mover
 * Se llama desde dados.js al lanzar los dados.
 */
export function moverFichaActual(casillas) {
    // Validaciones robustas
    if (!MonopolyApp.jugadores || MonopolyApp.jugadores.length === 0) {
        console.error('No hay jugadores disponibles para mover');
        return false;
    }
    
    if (typeof casillas !== 'number' || casillas < 1 || casillas > 12) {
        console.error('Número de casillas inválido:', casillas);
        return false;
    }
    
    if (MonopolyApp.turnoActual >= MonopolyApp.jugadores.length) {
        console.error('Índice de turno inválido:', MonopolyApp.turnoActual);
        return false;
    }
    
    const jugador = MonopolyApp.jugadores[MonopolyApp.turnoActual];
    const posicionAnterior = jugador.posicion;
    const nuevaPosicion = (posicionAnterior + casillas) % GAME_CONFIG.MAX_CASILLAS;
    
    // Detectar si completó una vuelta
    const completoVuelta = nuevaPosicion < posicionAnterior;
    
    console.log(`🎲 ${jugador.nickname} lanzó ${casillas} y se mueve de casilla ${posicionAnterior} → ${nuevaPosicion}${completoVuelta ? ' (¡Completó una vuelta!)' : ''}`);
    
    // Actualizar posición
    jugador.posicion = nuevaPosicion;
    
    // Si completó una vuelta, podría recibir dinero (lógica futura)
    if (completoVuelta) {
        console.log(`💰 ${jugador.nickname} pasó por la casilla de salida`);
        // jugador.dinero += 200; // Descomentar cuando implementes lógica de dinero
    }
    
    // Guardar en localStorage para persistencia
    MonopolyApp.guardarJugadores(MonopolyApp.jugadores);
    
    // Actualizar visualmente
    actualizarFichas(MonopolyApp.jugadores);
    
    // Cambiar turno
    const siguienteJugador = siguienteTurno();
    
    console.log(`✅ Movimiento completado. Siguiente jugador: ${siguienteJugador?.nickname}`);
    
    return {
        jugador: jugador.nickname,
        casillas,
        posicionAnterior,
        nuevaPosicion,
        completoVuelta,
        siguienteJugador: siguienteJugador?.nickname
    };
};

window.moverFichaActual = moverFichaActual;

/**
 * Actualiza visualmente las fichas de los jugadores en el tablero.
 * Elimina fichas anteriores y coloca la ficha de cada jugador en su casilla actual.
 * @param {Array} jugadores - Lista de jugadores con su posición
 */
function actualizarFichas(jugadores) {
    if (!jugadores || jugadores.length === 0) {
        console.warn('No hay jugadores para actualizar fichas');
        return;
    }
    
    // Limpiar fichas anteriores
    document.querySelectorAll('.ficha-jugador').forEach(el => el.remove());

    let fichasColocadas = 0;
    
    jugadores.forEach((jugador, idx) => {
        if (!jugador.nickname || typeof jugador.posicion !== 'number') {
            console.warn('Jugador con datos inválidos:', jugador);
            return;
        }
        
        const casilla = document.querySelector(`[data-position="${jugador.posicion}"]`);
        if (casilla) {
            const ficha = document.createElement('div');
            ficha.className = 'ficha-jugador' + (idx === MonopolyApp.turnoActual ? ' activo' : '');
            ficha.textContent = jugador.nickname[0].toUpperCase();
            ficha.title = `${jugador.nickname} - $${jugador.dinero || GAME_CONFIG.DINERO_INICIAL}`;
            ficha.dataset.jugador = jugador.nickname;
            ficha.dataset.posicion = jugador.posicion;
            
            casilla.appendChild(ficha);
            fichasColocadas++;
        } else {
            console.warn(`No se encontró casilla para posición ${jugador.posicion} del jugador ${jugador.nickname}`);
        }
    });
    
    console.log(`🎯 Fichas actualizadas: ${fichasColocadas}/${jugadores.length} colocadas`);
}

// ============== FUNCIONES DE UTILIDAD ==============

/**
 * Obtiene información del jugador actual
 * @returns {Object|null} Información del jugador actual o null si hay error
 */
function obtenerJugadorActual() {
    if (!MonopolyApp.jugadores || MonopolyApp.jugadores.length === 0) {
        console.error('No hay jugadores disponibles');
        return null;
    }
    
    if (MonopolyApp.turnoActual >= MonopolyApp.jugadores.length) {
        console.error('Índice de turno inválido');
        return null;
    }
    
    const jugador = MonopolyApp.jugadores[MonopolyApp.turnoActual];
    return {
        ...jugador,
        indice: MonopolyApp.turnoActual,
        esUltimoTurno: MonopolyApp.turnoActual === MonopolyApp.jugadores.length - 1,
        totalJugadores: MonopolyApp.jugadores.length
    };
}

/**
 * Reinicia el juego a estado inicial
 */
function reiniciarJuego() {
    console.log('🔄 Reiniciando juego...');
    
    MonopolyApp.jugadores.forEach(jugador => {
        jugador.posicion = 0;
        jugador.dinero = GAME_CONFIG.DINERO_INICIAL;
        jugador.propiedades = [];
        jugador.hipotecas = [];
    });
    
    MonopolyApp.turnoActual = 0;
    MonopolyApp.estadoJuego = GAME_CONFIG.ESTADOS_JUEGO.ESPERANDO_DADOS;
    
    // Guardar estado
    MonopolyApp.guardarJugadores(MonopolyApp.jugadores);
    
    // Actualizar visualización
    actualizarFichas(MonopolyApp.jugadores);
    
    if (typeof renderizarPanelJugadores === 'function') {
        renderizarPanelJugadores(MonopolyApp.jugadores, MonopolyApp.turnoActual);
    }
    
    console.log('✅ Juego reiniciado exitosamente');
}

// Agregar funciones de utilidad al objeto global
window.MonopolyApp.obtenerJugadorActual = obtenerJugadorActual;
window.MonopolyApp.reiniciarJuego = reiniciarJuego;

// ============== FUNCIONES GLOBALES PARA RETROCOMPATIBILIDAD ==============

window.guardarJugadores = function() {
    console.warn('Función guardarJugadores() está obsoleta. Usar navegarATablero()');
    navegarATablero();
};
window.navegarATablero = navegarATablero;
window.obtenerJugadores = function() {
    return MonopolyApp.obtenerJugadores();
};
window.navegarAPagina = navegarAPagina;
window.volverAtras = volverAtras;
window.irAlInicio = irAlInicio;

// ============== INICIALIZACIÓN ==============

document.addEventListener('DOMContentLoaded', inicializarApp);
window.addEventListener('popstate', function(event) {
    console.log('Navegación detectada, reinicializando...');
    inicializarApp();
});

console.log('🎮 App.js cargado - Enrutador principal + lógica de turno inicializado');
console.log('📊 Configuración:', { 
    maxCasillas: GAME_CONFIG.MAX_CASILLAS, 
    minJugadores: GAME_CONFIG.MIN_JUGADORES, 
    dineroInicial: GAME_CONFIG.DINERO_INICIAL 
});