import { renderizarPanelJugadores } from './components/panelJugador.js';

let jugadores = [
  { nickname: "Juan", pais: "CO", dinero: 1500, propiedades: [], hipotecas: [], posicion: 0 },
  { nickname: "Ana", pais: "MX", dinero: 1500, propiedades: [], hipotecas: [], posicion: 0 }
];
let turnoActual = 0;
let estadoJuego = 'esperando_dados'; // otros estados: 'accion_casilla', 'compra', 'fin'

/**
 * Cambia el turno al siguiente jugador y actualiza el panel.
 * Se llama después de cada movimiento de ficha.
 */
function siguienteTurno() {
  const jugadorAnterior = jugadores[turnoActual].nickname;
  turnoActual = (turnoActual + 1) % jugadores.length;
  estadoJuego = 'esperando_dados';
  
  // Notificación de cambio de turno
  if (window.Toast) {
    window.Toast.info(
      `Es el turno de ${jugadores[turnoActual].nickname}`,
      "Cambio de Turno"
    );
  }
  
  renderizarPanelJugadores(jugadores, turnoActual);
}

/**
 * Mueve la ficha del jugador actual en el tablero y actualiza el DOM.
 * @param {number} casillas - Número de casillas a mover
 * Se llama desde dados.js al lanzar los dados.
 */
export function moverFichaActual(casillas) {
  const jugadorActual = jugadores[turnoActual];
  const posicionAnterior = jugadorActual.posicion;
  
  jugadorActual.posicion = (jugadorActual.posicion + casillas) % 40;
  
  // Notificación de movimiento
  if (window.Toast) {
    window.Toast.success(
      `${jugadorActual.nickname} se movió ${casillas} espacios (casilla ${posicionAnterior} → ${jugadorActual.posicion})`,
      "Movimiento Realizado"
    );
    
    // Verificar si pasó por la salida (posición 0)
    if (posicionAnterior + casillas >= 40) {
      window.Toast.success(
        `${jugadorActual.nickname} pasó por la SALIDA. +$200`,
        "¡Cobrar Salario!"
      );
      jugadorActual.dinero += 200;
    }
  }
  
  actualizarFichas(jugadores);
  siguienteTurno();
}

/**
 * Actualiza visualmente las fichas de los jugadores en el tablero.
 * Elimina fichas anteriores y coloca la ficha de cada jugador en su casilla actual.
 * @param {Array} jugadores - Lista de jugadores con su posición
 */
function actualizarFichas(jugadores) {
  // Remover fichas existentes
  document.querySelectorAll('.ficha-jugador').forEach(el => el.remove());

  jugadores.forEach((jugador, idx) => {
    const casilla = document.querySelector(`[data-position="${jugador.posicion}"]`);
    if (casilla) {
      const ficha = document.createElement('div');
      ficha.className = 'ficha-jugador' + (idx === turnoActual ? ' activo' : '');
      ficha.textContent = jugador.nickname[0].toUpperCase();
      ficha.style.cssText = `
        background: ${idx === 0 ? '#FF6B6B' : idx === 1 ? '#4ECDC4' : '#45B7D1'};
        color: white;
        font-weight: bold;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        margin: 2px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ${idx === turnoActual ? 'animation: pulse 1s infinite; transform: scale(1.1);' : ''}
      `;
      casilla.appendChild(ficha);
    }
  });
}