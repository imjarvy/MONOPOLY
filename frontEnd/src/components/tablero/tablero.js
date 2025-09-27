import { TableroController } from '../../controllers/tableroController.js';

// ============== ESTADO GLOBAL PARA COMPATIBILIDAD ==============
const tablero = document.querySelector('.tablero');
let turnoActual = 0;

// ============== INICIALIZACIÓN ==============
const tableroController = new TableroController();

// ============== FUNCIONES DE COMPATIBILIDAD (para tu código existente) ==============

/**
 * Actualiza visualmente las fichas de los jugadores en el tablero
 * Mantiene compatibilidad con tu código actual
 */
export function actualizarFichas(jugadores, turnoActivo = turnoActual) {
    if (window.tableroController) {
        window.tableroController.actualizarFichasPublico(jugadores, turnoActivo);
    }
}

/**
 * Devuelve la clase CSS correspondiente a la posición de la casilla
 * Mantiene compatibilidad con tu código actual
 */
export function getPositionClass(position) {
    if (window.tableroController) {
        return window.tableroController.getPositionClass(position);
    }
    
    // Fallback manual
    const positionMap = {
        0: 'esquinaIa', 10: 'esquinaDa', 20: 'esquinaIb', 30: 'esquinaDb'
    };
    
    if (positionMap[position]) return positionMap[position];
    if (position > 0 && position < 10) return 'abajo';
    if (position > 10 && position < 20) return 'izquierda';
    if (position > 20 && position < 30) return 'arriba';
    if (position > 30 && position < 40) return 'derecha';
    return '';
}

// ============== INICIALIZACIÓN AUTOMÁTICA ==============
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => tableroController.inicializar());
} else {
    tableroController.inicializar();
}

// ============== FALLBACK DE SEGURIDAD ==============
setTimeout(() => {
    if (!tablero.innerHTML.trim()) {
        console.warn('⚠️ Tablero vacío después del timeout, reintentando...');
        tableroController.inicializar();
    }
}, 1000);

// ============== EXPORTS PARA COMPATIBILIDAD ==============
export { tablero };