import { renderizarPanelJugadores } from '../components/panelJugador.js';
import { mostrarModalPropiedad } from '../components/modals/propiedadModal.js';
import { obtenerInfoPropiedad } from './propiedades.js';

// Obtener jugadores desde localStorage
function obtenerJugadores() {
  const jugadoresStorage = localStorage.getItem('jugadores');
  if (!jugadoresStorage) {
    console.warn('No hay jugadores en localStorage');
    return [];
  }
  
  const jugadores = JSON.parse(jugadoresStorage);
  // Agregar propiedades necesarias para el juego si no existen
  return jugadores.map(jugador => ({
    ...jugador,
    propiedades: jugador.propiedades || [],
    hipotecas: jugador.hipotecas || [],
    posicion: jugador.posicion || 0
  }));
}

// Guardar jugadores en localStorage
function guardarJugadores(jugadores) {
  localStorage.setItem('jugadores', JSON.stringify(jugadores));
}

let jugadores = obtenerJugadores();
let turnoActual = parseInt(localStorage.getItem('turnoActual')) || 0;
let estadoJuego = 'esperando_dados'; // otros estados: 'accion_casilla', 'compra', 'fin'
let esperandoAccionJugador = false; // Nueva variable para controlar el flujo

// Exponer la variable globalmente para que otros módulos puedan acceder
window.esperandoAccionJugador = esperandoAccionJugador;

/**
 * Cambia el turno al siguiente jugador y actualiza el panel.
 * Se llama después de cada movimiento de ficha.
 */
function siguienteTurno() {
  const jugadorAnterior = jugadores[turnoActual].nickname;
  turnoActual = (turnoActual + 1) % jugadores.length;
  estadoJuego = 'esperando_dados';
  
  // Guardar el turno actual en localStorage
  localStorage.setItem('turnoActual', turnoActual.toString());
  
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
export async function moverFichaActual(casillas) {
  const jugadorActual = jugadores[turnoActual];
  const posicionAnterior = jugadorActual.posicion;
  
  jugadorActual.posicion = (jugadorActual.posicion + casillas) % 40;
  
  // Verificar si pasó por la salida (posición 0)
  if (posicionAnterior + casillas >= 40) {
    jugadorActual.dinero += 200;
    if (window.Toast) {
      window.Toast.success(
        `${jugadorActual.nickname} pasó por la SALIDA. +$200`,
        "¡Cobrar Salario!"
      );
    }
  }
  
  // Guardar cambios en localStorage
  guardarJugadores(jugadores);
  
  // Notificación de movimiento
  if (window.Toast) {
    window.Toast.success(
      `${jugadorActual.nickname} se movió ${casillas} espacios (casilla ${posicionAnterior} → ${jugadorActual.posicion})`,
      "Movimiento Realizado"
    );
  }
  
  // Actualizar fichas visualmente
  actualizarFichas(jugadores);
  
  // Procesar acción de la casilla donde cayó
  await procesarAccionCasilla(jugadorActual.posicion, jugadorActual);
  
  // Solo pasar al siguiente turno si no estamos esperando una acción del jugador
  if (!esperandoAccionJugador) {
    siguienteTurno();
  }
}

/**
 * Procesa la acción de la casilla donde cayó el jugador
 * @param {number} posicion - Posición de la casilla
 * @param {Object} jugador - Jugador que cayó en la casilla
 */
async function procesarAccionCasilla(posicion, jugador) {
  try {
    const propiedad = await obtenerInfoPropiedad(posicion);
    
    if (!propiedad) {
      console.warn(`❌ No se encontró información para la casilla ${posicion}`);
      return;
    }
    
    switch (propiedad.type) {
      case 'property':
      case 'railroad':
        // Mostrar modal de propiedad - requiere interacción del usuario
        esperandoAccionJugador = true;
        window.esperandoAccionJugador = true; // Sincronizar con variable global
        await mostrarModalPropiedad(propiedad, jugador);
        break;
        
      case 'tax':
        // Procesar impuesto - acción automática
        procesarImpuesto(propiedad, jugador);
        break;
        
      case 'chance':
        // Procesar carta de sorpresa - acción automática
        await procesarCartaSorpresa(jugador);
        break;
        
      case 'community_chest':
        // Procesar carta de caja de comunidad - acción automática
        await procesarCartaComunidad(jugador);
        break;
        
      case 'special':
        // Procesar casillas especiales - acción automática
        procesarCasillaEspecial(propiedad, jugador);
        break;
        
      default:
        console.log(`Casilla tipo ${propiedad.type} no requiere acción especial`);
    }
  } catch (error) {
    console.error('Error al procesar acción de casilla:', error);
  }
}

/**
 * Procesa el pago de impuestos
 */
function procesarImpuesto(casilla, jugador) {
  const impuesto = Math.abs(casilla.action.money);
  
  if (jugador.dinero >= impuesto) {
    jugador.dinero -= impuesto;
    guardarJugadores(jugadores);
    
    if (window.Toast) {
      window.Toast.warning(
        `${jugador.nickname} pagó $${impuesto} en ${casilla.name}`,
        "Impuesto Pagado"
      );
    }
  } else {
    if (window.Toast) {
      window.Toast.error(
        `${jugador.nickname} no tiene dinero suficiente para pagar $${impuesto}`,
        "Dinero Insuficiente"
      );
    }
    // Aquí podrías agregar lógica de bancarrota
  }
}

/**
 * Procesa carta de sorpresa aleatoria
 */
async function procesarCartaSorpresa(jugador) {
  try {
    const { getBoard } = await import('../services/boardService.js');
    const boardData = await getBoard();
    
    const cartas = boardData.chance;
    const cartaAleatoria = cartas[Math.floor(Math.random() * cartas.length)];
    
    aplicarEfectoCarta(cartaAleatoria, jugador, 'Sorpresa');
  } catch (error) {
    console.error('Error al obtener carta de sorpresa:', error);
  }
}

/**
 * Procesa carta de caja de comunidad aleatoria
 */
async function procesarCartaComunidad(jugador) {
  try {
    const { getBoard } = await import('../services/boardService.js');
    const boardData = await getBoard();
    
    const cartas = boardData.community_chest;
    const cartaAleatoria = cartas[Math.floor(Math.random() * cartas.length)];
    
    aplicarEfectoCarta(cartaAleatoria, jugador, 'Caja de Comunidad');
  } catch (error) {
    console.error('Error al obtener carta de caja de comunidad:', error);
  }
}

/**
 * Aplica el efecto de una carta
 */
function aplicarEfectoCarta(carta, jugador, tipo) {
  const dineroAntes = jugador.dinero;
  jugador.dinero += carta.action.money;
  
  // Asegurar que el dinero no sea negativo
  if (jugador.dinero < 0) jugador.dinero = 0;
  
  guardarJugadores(jugadores);
  
  const cambio = carta.action.money;
  const esPositivo = cambio > 0;
  
  if (window.Toast) {
    const icono = esPositivo ? '💰' : '💸';
    const color = esPositivo ? 'success' : 'warning';
    
    window.Toast[color](
      `${icono} ${carta.description}`,
      `${tipo} - ${esPositivo ? '+' : ''}$${cambio}`
    );
  }
}

/**
 * Procesa casillas especiales
 */
function procesarCasillaEspecial(casilla, jugador) {
  switch (casilla.id) {
    case 0: // Salida
      if (window.Toast) {
        window.Toast.info(
          `${jugador.nickname} está en la SALIDA`,
          "Casilla Especial"
        );
      }
      break;
      
    case 10: // Cárcel/Visita
      if (window.Toast) {
        window.Toast.info(
          `${jugador.nickname} está de visita en la cárcel`,
          "Visita a la Cárcel"
        );
      }
      break;
      
    case 20: // Parqueo gratis
      if (window.Toast) {
        window.Toast.success(
          `${jugador.nickname} descansa en el parqueo gratis`,
          "Descanso Gratis"
        );
      }
      break;
      
    case 30: // Ve a la cárcel
      // Aquí podrías implementar lógica de cárcel
      if (window.Toast) {
        window.Toast.warning(
          `${jugador.nickname} debe ir a la cárcel`,
          "¡Ve a la Cárcel!"
        );
      }
      break;
      
    default:
      console.log(`Casilla especial ${casilla.name} procesada`);
  }
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
      ficha.textContent = jugador.ficha || jugador.nickname[0].toUpperCase();
      ficha.style.cssText = `
        background: ${jugador.color || '#45B7D1'};
        color: white;
        font-weight: bold;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${jugador.ficha ? '14px' : '12px'};
        margin: 2px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        border: 2px solid white;
        ${idx === turnoActual ? 'animation: pulse 1s infinite; transform: scale(1.2); border-color: #FFD700;' : ''}
      `;
      casilla.appendChild(ficha);
    }
  });
}

/**
 * Inicializa el juego colocando todas las fichas en sus posiciones
 */
export function inicializarJuego() {
  jugadores = obtenerJugadores();
  if (jugadores.length > 0) {
    actualizarFichas(jugadores);
    renderizarPanelJugadores(jugadores, turnoActual);
  }
}

/**
 * Obtiene los jugadores actuales
 */
export function obtenerJugadoresActuales() {
  return jugadores;
}

/**
 * Se llama cuando el jugador completa una acción que requería interacción
 * Permite continuar con el siguiente turno
 */
export function completarAccionJugador() {
  esperandoAccionJugador = false;
  window.esperandoAccionJugador = false; // Sincronizar con variable global
  siguienteTurno();
}

/**
 * Obtiene el jugador actual
 */
export function obtenerJugadorActual() {
  return jugadores[turnoActual];
}

// Hacer funciones disponibles globalmente para compatibilidad
window.moverFichaActual = moverFichaActual;
window.inicializarJuego = inicializarJuego;

/**
 * Función global para actualizar la interfaz del juego
 * Se llama desde los modales para actualizar la vista
 */
window.actualizarInterfazJuego = function() {
  jugadores = obtenerJugadores(); // Recargar desde localStorage
  actualizarFichas(jugadores);
  renderizarPanelJugadores(jugadores, turnoActual);
};