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
    posicion: jugador.posicion || 0,
    enCarcel: jugador.enCarcel || false,
    turnosEnCarcel: jugador.turnosEnCarcel || 0,
    cartaLibertad: jugador.cartaLibertad || false
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
      enviarACarcel(jugador);
      break;
      
    default:
      console.log(`Casilla especial ${casilla.name} procesada`);
  }
}

/**
 * Sistema de Cárcel del Monopoly
 */

/**
 * Envía a un jugador a la cárcel
 * @param {Object} jugador - Jugador a enviar a la cárcel
 */
function enviarACarcel(jugador) {
  jugador.posicion = 10; // Casilla de cárcel
  jugador.enCarcel = true;
  jugador.turnosEnCarcel = 0;
  
  guardarJugadores(jugadores);
  actualizarFichas(jugadores);
  renderizarPanelJugadores(jugadores);
  
  if (window.Toast) {
    window.Toast.warning(
      `${jugador.nickname} ha sido enviado a la cárcel`,
      "¡A la Cárcel!"
    );
  }
  
  // Completar el turno inmediatamente
  setTimeout(() => completarAccionJugador(), 1000);
}

/**
 * Verifica si un jugador puede tirar dados (no está bloqueado en cárcel)
 * @param {Object} jugador - Jugador a verificar
 * @returns {boolean}
 */
function puedeJugarTurno(jugador) {
  // Si no está en cárcel, puede jugar normalmente
  if (!jugador.enCarcel) return true;
  
  // Si está en cárcel, mostrar opciones de salida
  mostrarOpcionesCarcel(jugador);
  return false;
}

/**
 * Muestra las opciones para salir de la cárcel
 * @param {Object} jugador - Jugador en cárcel
 */
function mostrarOpcionesCarcel(jugador) {
  const opcionesHTML = `
    <div class="modal-carcel">
      <div class="carcel-header">
        <h3>🏛️ Estás en la Cárcel</h3>
        <p>${jugador.nickname}, llevas ${jugador.turnosEnCarcel} turno${jugador.turnosEnCarcel !== 1 ? 's' : ''} en la cárcel</p>
      </div>
      
      <div class="opciones-carcel">
        <h4>Opciones para salir:</h4>
        
        <div class="opcion-carcel">
          <button class="btn btn-primary" onclick="intentarSalidaDobles()" 
                  ${jugador.turnosEnCarcel >= 3 ? 'disabled' : ''}>
            🎲 Tirar dados (salir con dobles)
            ${jugador.turnosEnCarcel >= 3 ? '<br><small>Ya no puedes usar esta opción</small>' : ''}
          </button>
        </div>
        
        <div class="opcion-carcel">
          <button class="btn btn-success" onclick="pagarFianza()" 
                  ${jugador.dinero < 50 ? 'disabled' : ''}>
            💰 Pagar fianza ($50)
            ${jugador.dinero < 50 ? '<br><small>No tienes suficiente dinero</small>' : ''}
          </button>
        </div>
        
        ${jugador.cartaLibertad ? `
          <div class="opcion-carcel">
            <button class="btn btn-warning" onclick="usarCartaLibertad()">
              🎫 Usar carta "Sal libre de la cárcel"
            </button>
          </div>
        ` : ''}
        
        ${jugador.turnosEnCarcel >= 3 ? `
          <div class="opcion-carcel forzada">
            <strong>⚠️ Debes salir obligatoriamente pagando la fianza</strong>
          </div>
        ` : ''}
      </div>
      
      <div class="info-carcel">
        <small>
          • Puedes tirar dados hasta 3 turnos para salir con dobles<br>
          • Si no sacas dobles en 3 intentos, debes pagar la fianza<br>
          • Puedes pagar la fianza en cualquier momento
        </small>
      </div>
    </div>
  `;
  
  window.Modal.show(opcionesHTML, {
    title: "Opciones de Cárcel",
    size: 'md',
    closeOnOverlay: false,
    preventAutoClose: true
  });
}

/**
 * Intenta salir de la cárcel tirando dados
 */
window.intentarSalidaDobles = function() {
  const jugador = obtenerJugadorActual();
  
  if (jugador.turnosEnCarcel >= 3) {
    window.Toast.error("Ya no puedes usar esta opción", "Máximo de Intentos");
    return;
  }
  
  window.Modal.close();
  
  // Tirar dados automáticamente
  const dado1 = Math.floor(Math.random() * 6) + 1;
  const dado2 = Math.floor(Math.random() * 6) + 1;
  const esDoble = dado1 === dado2;
  
  jugador.turnosEnCarcel++;
  
  if (esDoble) {
    // ¡Libertad con dobles!
    liberarDeCarcel(jugador);
    
    if (window.Toast) {
      window.Toast.success(
        `¡Sacaste dobles (${dado1}-${dado2})! Sales libre de la cárcel`,
        "¡Libertad!"
      );
    }
    
    // Mover normalmente con los dados
    const totalDados = dado1 + dado2;
    moverJugador(jugador, totalDados);
  } else {
    if (window.Toast) {
      window.Toast.info(
        `Sacaste ${dado1}-${dado2} (no dobles). Te quedas en la cárcel`,
        `Intento ${jugador.turnosEnCarcel}/3`
      );
    }
    
    guardarJugadores(jugadores);
    renderizarPanelJugadores(jugadores);
    
    // Si ya llevó 3 turnos, debe pagar obligatoriamente
    if (jugador.turnosEnCarcel >= 3) {
      setTimeout(() => {
        if (jugador.dinero >= 50) {
          pagarFianzaForzada();
        } else {
          // Bancarrota por no poder pagar fianza
          window.Toast.error(
            `${jugador.nickname} no puede pagar la fianza y queda eliminado`,
            "Bancarrota"
          );
          // Aquí podrías implementar lógica de bancarrota
        }
      }, 2000);
    } else {
      setTimeout(() => completarAccionJugador(), 1000);
    }
  }
  
  // Mostrar resultado de dados
  if (window.dadosModal && typeof window.dadosModal.mostrarResultado === 'function') {
    window.dadosModal.mostrarResultado(dado1, dado2, esDoble ? "¡DOBLES! Sales de la cárcel" : `Intento ${jugador.turnosEnCarcel}/3 - Te quedas en la cárcel`);
  }
};

/**
 * Paga la fianza para salir de la cárcel
 */
window.pagarFianza = function() {
  const jugador = obtenerJugadorActual();
  
  if (jugador.dinero < 50) {
    window.Toast.error("No tienes suficiente dinero para la fianza", "Pago Fallido");
    return;
  }
  
  window.Modal.close();
  
  jugador.dinero -= 50;
  liberarDeCarcel(jugador);
  
  if (window.Toast) {
    window.Toast.success(
      `Has pagado $50 de fianza. ¡Sales libre de la cárcel!`,
      "Fianza Pagada"
    );
  }
  
  // Después de pagar, el jugador puede tirar dados normalmente
  guardarJugadores(jugadores);
  renderizarPanelJugadores(jugadores);
  
  setTimeout(() => {
    window.Toast.info("Ahora puedes tirar los dados", "Tu Turno");
    estadoJuego = 'esperando_dados';
  }, 1500);
};

/**
 * Usa una carta de libertad para salir de la cárcel
 */
window.usarCartaLibertad = function() {
  const jugador = obtenerJugadorActual();
  
  if (!jugador.cartaLibertad) {
    window.Toast.error("No tienes una carta de libertad", "Carta No Disponible");
    return;
  }
  
  window.Modal.close();
  
  jugador.cartaLibertad = false;
  liberarDeCarcel(jugador);
  
  if (window.Toast) {
    window.Toast.success(
      `Has usado tu carta "Sal libre de la cárcel"`,
      "Carta Usada"
    );
  }
  
  // Después de usar la carta, el jugador puede tirar dados normalmente
  guardarJugadores(jugadores);
  renderizarPanelJugadores(jugadores);
  
  setTimeout(() => {
    window.Toast.info("Ahora puedes tirar los dados", "Tu Turno");
    estadoJuego = 'esperando_dados';
  }, 1500);
};

/**
 * Pago forzado de fianza (cuando se cumplen 3 turnos)
 */
function pagarFianzaForzada() {
  const jugador = obtenerJugadorActual();
  
  jugador.dinero -= 50;
  liberarDeCarcel(jugador);
  
  if (window.Toast) {
    window.Toast.warning(
      `Tras 3 turnos, debes pagar $50 de fianza obligatoriamente`,
      "Pago Forzado"
    );
  }
  
  guardarJugadores(jugadores);
  renderizarPanelJugadores(jugadores);
  
  setTimeout(() => {
    window.Toast.info("Ahora puedes tirar los dados", "Tu Turno");
    estadoJuego = 'esperando_dados';
  }, 2000);
}

/**
 * Libera a un jugador de la cárcel
 * @param {Object} jugador - Jugador a liberar
 */
function liberarDeCarcel(jugador) {
  jugador.enCarcel = false;
  jugador.turnosEnCarcel = 0;
  // El jugador sigue en la posición 10 pero ya no está "en cárcel"
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
window.obtenerJugadorActual = obtenerJugadorActual;
window.puedeJugarTurno = puedeJugarTurno;

/**
 * Función global para actualizar la interfaz del juego
 * Se llama desde los modales para actualizar la vista
 */
window.actualizarInterfazJuego = function() {
  jugadores = obtenerJugadores(); // Recargar desde localStorage
  actualizarFichas(jugadores);
  renderizarPanelJugadores(jugadores, turnoActual);
};

// Agregar estilos CSS para el modal de la cárcel
const estilosCarcel = document.createElement('style');
estilosCarcel.textContent = `
  .modal-carcel {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
  }
  
  .carcel-header {
    background: linear-gradient(135deg, #6c757d, #495057);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .carcel-header h3 {
    margin: 0 0 10px 0;
    font-size: 1.4rem;
  }
  
  .opciones-carcel h4 {
    color: #333;
    margin-bottom: 15px;
  }
  
  .opcion-carcel {
    margin-bottom: 15px;
    padding: 15px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    background: #f8f9fa;
  }
  
  .opcion-carcel button {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .opcion-carcel button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .opcion-carcel.forzada {
    background: #fff3cd;
    border-color: #ffc107;
    color: #856404;
  }
  
  .info-carcel {
    background: #e7f3ff;
    padding: 15px;
    border-radius: 6px;
    margin-top: 20px;
    text-align: left;
  }
  
  .info-carcel small {
    color: #0066cc;
  }
`;

if (!document.getElementById('modal-carcel-styles')) {
  estilosCarcel.id = 'modal-carcel-styles';
  document.head.appendChild(estilosCarcel);
}