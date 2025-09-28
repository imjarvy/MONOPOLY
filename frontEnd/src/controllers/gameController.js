// ========== IMPORTACIONES ==========
import { renderizarPanelJugadores } from '../components/panelJugador.js';
import { PropiedadesManager } from '../managers/propiedadesManager.js';
import { FinJuegoManager } from '../managers/finJuegoManager.js';
import { AccionModal } from '../components/modals/accionModal.js';
import { AccionesManager } from '../utils/acciones.js';
import { PropiedadesRenderer } from '../renderers/propiedadesRenderer.js';

import {
  obtenerCasilla,
  actualizarFichas,
  actualizarEstadoJuego
} from '../utils/gameHelpers.js';

import {
  ejecutarAccionCasilla,
  manejarResultadoAccion,
  moverJugador,
  ejecutarCompraPropiedad
} from './gameActions.js';

// ========== ESTADO INTERNO ==========
let jugadores = [];
let turnoActual = 0;
let estadoJuego = 'esperando_dados';

// ========== INSTANCIAS ==========
const propiedadesManager = new PropiedadesManager();
const finJuegoManager = new FinJuegoManager();
const accionModal = new AccionModal();
const accionesManager = new AccionesManager();

// ========== INICIALIZACIÓN ==========
export function inicializarJuegoMonopoly(jugadoresConfigurados) {
  if (!Array.isArray(jugadoresConfigurados) || jugadoresConfigurados.length < 2) {
    console.error('❌ Se necesitan al menos 2 jugadores');
    window.Toast?.error?.('Se necesitan al menos 2 jugadores', 'Error');
    return false;
  }

  jugadores = jugadoresConfigurados.map(j => ({
    ...j,
    dinero: j.dinero ?? 1500,
    propiedades: j.propiedades ?? [],
    hipotecas: j.hipotecas ?? [],
    posicion: j.posicion ?? 0,
    enCarcel: j.enCarcel ?? false,
    turnosCarcel: j.turnosCarcel ?? 0,
    bancarrota: j.bancarrota ?? false
  }));

  turnoActual = 0;
  estadoJuego = 'esperando_dados';

  // ✅ Exponer funciones necesarias
  Object.assign(window, {
    gameController: { propiedadesManager, finJuegoManager, accionesManager, jugadores, turnoActual, estadoJuego},
    accionModal,
    renderizarPanelJugadores,
    PropiedadesRenderer,
    obtenerCasilla,
    actualizarFichas,
    actualizarEstadoJuego,
    ejecutarAccionCasilla,
    manejarResultadoAccion,
    moverJugador,
    ejecutarCompraPropiedad,
    comprarPropiedad,
    siguienteTurno,
    moverFichaActual
  });

    console.log('✅ Juego inicializado:', { 
    jugadores: jugadores.length, 
    turnoActual,
    gameController: window.gameController
  });
  return true;
}

// ========== FUNCIONES PRINCIPALES ==========

function siguienteTurno() {
  const jugadorActual = jugadores[turnoActual];

  if (jugadorActual.enCarcel && jugadorActual.turnosCarcel > 0) {
    const resultado = accionesManager.accionCarcel(jugadorActual);
    if (resultado.tipo === 'carcel') {
      actualizarEstadoJuego(jugadores, turnoActual, estadoJuego);
      return;
    }
  }

  turnoActual = (turnoActual + 1) % jugadores.length;
  estadoJuego = 'esperando_dados';

  window.Toast?.info?.(`Turno de ${jugadores[turnoActual].nickname}`, 'Cambio de Turno');
  actualizarEstadoJuego(jugadores, turnoActual, estadoJuego);
}

export function moverFichaActual(casillas) {
  const jugadorActual = jugadores[turnoActual];
  if (!jugadorActual) return console.error('❌ No hay jugador actual válido');

  const casillaDestino = moverJugador(jugadorActual, casillas, accionesManager);
  actualizarFichas(jugadores, turnoActual);

  const resultado = ejecutarAccionCasilla(
    jugadorActual,
    casillaDestino,
    accionesManager,
    jugadores,
    turnoActual
  );

  manejarResultadoAccion(resultado, siguienteTurno);

  const ganador = finJuegoManager.determinarGanador(jugadores);
  if (ganador) console.log('🏆 ¡Juego terminado! Ganador:', ganador.nickname);
}

function comprarPropiedad(propiedadId) {
  const jugadorActual = jugadores[turnoActual];
  if (!jugadorActual || !propiedadId) return false;

  const exito = ejecutarCompraPropiedad(
    jugadorActual,
    propiedadId,
    propiedadesManager,
    obtenerCasilla
  );

  if (exito) {
    actualizarEstadoJuego(jugadores, turnoActual, estadoJuego);
    setTimeout(siguienteTurno, 1000);
  }

  return exito;
}

// ========== EXPORTACIONES ==========
export function getJugadores() {
  return jugadores;
}
export function getTurnoActual() {
  return turnoActual;
}
export function getEstadoJuego() {
  return estadoJuego;
}
