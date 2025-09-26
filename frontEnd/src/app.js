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
  turnoActual = (turnoActual + 1) % jugadores.length;
  estadoJuego = 'esperando_dados';
  renderizarPanelJugadores(jugadores, turnoActual);
}

/**
 * Mueve la ficha del jugador actual en el tablero y actualiza el DOM.
 * @param {number} casillas - Número de casillas a mover
 * Se llama desde dados.js al lanzar los dados.
 */
export function moverFichaActual(casillas) {
  jugadores[turnoActual].posicion = (jugadores[turnoActual].posicion + casillas) % 40;
  actualizarFichas(jugadores);
  siguienteTurno();
}

/**
 * Actualiza visualmente las fichas de los jugadores en el tablero.
 * Elimina fichas anteriores y coloca la ficha de cada jugador en su casilla actual.
 * @param {Array} jugadores - Lista de jugadores con su posición
 */
function actualizarFichas(jugadores) {
  document.querySelectorAll('.ficha-jugador').forEach(el => el.remove());

  jugadores.forEach((jugador, idx) => {
    const casilla = document.querySelector(`[data-position="${jugador.posicion}"]`);
    if (casilla) {
      const ficha = document.createElement('div');
      ficha.className = 'ficha-jugador' + (idx === turnoActual ? ' activo' : '');
      ficha.textContent = jugador.nickname[0];
      casilla.appendChild(ficha);
    }
  });
}