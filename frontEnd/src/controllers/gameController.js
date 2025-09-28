import { renderizarPanelJugadores } from '../components/panelJugador.js';
import { PropiedadesManager } from '../managers/propiedadesManager.js';
import { FinJuegoManager } from '../managers/finJuegoManager.js';
// ✅ AGREGAR IMPORT:
import { AccionModal } from '../components/modals/accionModal.js';

// ============== INSTANCIAS DE MANAGERS ==============
const propiedadesManager = new PropiedadesManager();
const finJuegoManager = new FinJuegoManager();
// ✅ AGREGAR INSTANCIA:
const accionModal = new AccionModal();

// ============== ESTADO DEL JUEGO ==============
let jugadores = [];
let turnoActual = 0;
let estadoJuego = 'esperando_dados';

// ============== FUNCIÓN DE INICIALIZACIÓN ==============
export function inicializarJuegoMonopoly(jugadoresConfigurados) {
  console.log('🎮 Inicializando lógica del juego...', jugadoresConfigurados);

  if (!jugadoresConfigurados || jugadoresConfigurados.length < 2) {
    console.error('❌ Se necesitan al menos 2 jugadores');
    if (window.Toast) {
      window.Toast.error('Se necesitan al menos 2 jugadores', 'Error');
    }
    return false;
  }

  jugadores = jugadoresConfigurados.map(j => ({
    ...j,
    dinero: j.dinero || 1500,
    propiedades: j.propiedades || [],
    hipotecas: j.hipotecas || [],
    posicion: j.posicion || 0
  }));

  turnoActual = 0;
  estadoJuego = 'esperando_dados';

  console.log('✅ Juego inicializado:', { jugadores, turnoActual });
  
  // ✅ EXPONER EN WINDOW PARA FUNCIONES GLOBALES:
  window.gameController = {
    jugadores,
    turnoActual,
    estadoJuego,
    comprarPropiedad,
    siguienteTurno,
    propiedadesManager,
    finJuegoManager
  };
  
  return true;
}

// ============== FUNCIONES DE JUEGO ==============
function siguienteTurno() {
  turnoActual = (turnoActual + 1) % jugadores.length;
  estadoJuego = 'esperando_dados';
  
  console.log(`🔄 Turno cambiado a: ${jugadores[turnoActual].nickname}`);
  
  if (window.Toast) {
    window.Toast.info(
      `Turno de ${jugadores[turnoActual].nickname}`, 
      'Cambio de Turno'
    );
  }
  
  // Actualizar panel de jugadores
  renderizarPanelJugadores(jugadores, turnoActual);
  
  // ✅ ACTUALIZAR WINDOW:
  window.gameController.turnoActual = turnoActual;
  window.gameController.estadoJuego = estadoJuego;
}

export function moverFichaActual(casillas) {
  const jugadorActual = jugadores[turnoActual];
  if (!jugadorActual) {
    console.error('❌ No hay jugador actual válido');
    return;
  }

  console.log('🎲 Moviendo ficha del jugador:', jugadorActual.nickname);
  console.log('🎯 Posición antes:', jugadorActual.posicion);
  
  // ✅ ASEGURAR QUE LA POSICIÓN SE ACTUALIZA CORRECTAMENTE
  // Si casillas es un número (resultado de dados)
  if (typeof casillas === 'number') {
    jugadorActual.posicion = (jugadorActual.posicion + casillas) % 40;
  }
  
  console.log('🎯 Posición después:', jugadorActual.posicion);
  
  // ✅ ACTUALIZAR FICHAS PRIMERO (antes de ejecutar acciones)
  actualizarFichas(jugadores);
  
  // ✅ EJECUTAR ACCIÓN DE LA CASILLA:
  const casillaDestino = obtenerCasilla(jugadorActual.posicion);
  ejecutarAccionCasilla(jugadorActual, casillaDestino);

  // ✅ VERIFICAR FIN DEL JUEGO:
  const ganador = finJuegoManager.determinarGanador(jugadores);
  if (ganador) {
    console.log('🏆 ¡Juego terminado! Ganador:', ganador.nickname);
    return;
  }
}

// ✅ FUNCIÓN PARA EJECUTAR ACCIONES DE CASILLA:
function ejecutarAccionCasilla(jugador, casilla) {
  console.log('🎯 Ejecutando acción:', casilla.tipo, casilla);
  
  switch(casilla.tipo) {
    case 'propiedad':
      if (!casilla.propietario) {
        // Mostrar modal de compra
        accionModal.mostrarOpcionesPropiedad(casilla, jugador);
      } else if (casilla.propietario !== jugador.id) {
        // Cobrar renta
        cobrarRenta(jugador, casilla);
        // Pasar turno automáticamente después de pagar renta
        setTimeout(() => siguienteTurno(), 1500);
      } else {
        // Es tu propiedad, pasar turno
        if (window.Toast) {
          window.Toast.info(`Es tu propiedad: ${casilla.nombre}`, 'Propiedad Propia');
        }
        setTimeout(() => siguienteTurno(), 1000);
      }
      break;
      
    case 'impuesto':
      jugador.dinero -= casilla.impuesto || 100;
      if (window.Toast) {
        window.Toast.warning(
          `${jugador.nickname} pagó $${casilla.impuesto || 100} de impuestos`, 
          'Impuestos'
        );
      }
      renderizarPanelJugadores(jugadores, turnoActual);
      setTimeout(() => siguienteTurno(), 1500);
      break;
      
    case 'salida':
      jugador.dinero += 200;
      if (window.Toast) {
        window.Toast.success(
          `${jugador.nickname} recibió $200 por pasar por la Salida`, 
          '¡Salida!'
        );
      }
      renderizarPanelJugadores(jugadores, turnoActual);
      setTimeout(() => siguienteTurno(), 1500);
      break;
      
    case 'carta':
      // Implementar más adelante
      if (window.Toast) {
        window.Toast.info('Sistema de cartas próximamente', 'Carta');
      }
      setTimeout(() => siguienteTurno(), 1000);
      break;
      
    default:
      // Casilla neutral
      if (window.Toast) {
        window.Toast.info(`${jugador.nickname} en casilla neutral`, 'Casilla');
      }
      setTimeout(() => siguienteTurno(), 1000);
  }
  
  // ✅ ACTUALIZAR WINDOW:
  window.gameController.jugadores = jugadores;
}

// ✅ FUNCIÓN PARA OBTENER CASILLA:
function obtenerCasilla(posicion) {
  // Esta función debe obtener la información de la casilla del tablero
  if (window.tableroData && window.tableroData.casillas) {
    return window.tableroData.casillas.find(c => c.position === posicion) || {
      id: `casilla-${posicion}`,
      tipo: 'neutral',
      nombre: `Casilla ${posicion}`,
      precio: 0,
      position: posicion
    };
  }
  
  // ✅ DATOS DE PRUEBA PARA TESTING:
  const casillasPrueba = {
    1: { id: 'prop-1', tipo: 'propiedad', nombre: 'Mediterráneo', precio: 60, color: 'marron', position: 1 },
    5: { id: 'imp-1', tipo: 'impuesto', nombre: 'Impuesto de Lujo', impuesto: 75, position: 5 },
    10: { id: 'carcel', tipo: 'carcel', nombre: 'Cárcel', position: 10 },
    15: { id: 'prop-15', tipo: 'propiedad', nombre: 'Estados Unidos', precio: 140, color: 'rosa', position: 15 }
  };
  
  return casillasPrueba[posicion] || {
    id: `casilla-${posicion}`,
    tipo: 'neutral',
    nombre: `Casilla ${posicion}`,
    precio: 0,
    position: posicion
  };
}

// ✅ FUNCIÓN PARA COBRAR RENTA:
function cobrarRenta(jugadorPagador, casilla) {
  const propietario = jugadores.find(j => j.id === casilla.propietario);
  if (!propietario) return;
  
  const renta = propiedadesManager.calcularRenta(casilla, 0);
  
  if (jugadorPagador.dinero >= renta) {
    jugadorPagador.dinero -= renta;
    propietario.dinero += renta;
    
    if (window.Toast) {
      window.Toast.warning(
        `${jugadorPagador.nickname} pagó $${renta} a ${propietario.nickname}`,
        'Renta Pagada'
      );
    }
  } else {
    // Lógica de bancarrota
    if (window.Toast) {
      window.Toast.error(
        `${jugadorPagador.nickname} no puede pagar $${renta}. ¡Bancarrota!`,
        'Sin Dinero'
      );
    }
    jugadorPagador.bancarrota = true;
  }
  
  renderizarPanelJugadores(jugadores, turnoActual);
}

// ✅ FUNCIÓN PARA COMPRAR PROPIEDAD (llamada desde modal):
function comprarPropiedad(propiedadId) {
  const jugadorActual = jugadores[turnoActual];
  const casilla = obtenerCasilla(jugadorActual.posicion);
  
  console.log('💰 Intentando comprar:', propiedadId, casilla);
  
  if (casilla.id === propiedadId || casilla.position.toString() === propiedadId) {
    const exito = propiedadesManager.comprarPropiedad(jugadorActual, casilla);
    
    if (exito) {
      // Actualizar panel y pasar turno
      renderizarPanelJugadores(jugadores, turnoActual);
      
      // ✅ ACTUALIZAR WINDOW:
      window.gameController.jugadores = jugadores;
      
      setTimeout(() => siguienteTurno(), 1000);
    }
  } else {
    console.error('❌ ID de propiedad no coincide');
  }
}

function actualizarFichas(jugadores) {
  console.log('🔄 Actualizando fichas de jugadores');
  console.log('📍 Posiciones actuales:', jugadores.map(j => ({ 
    nickname: j.nickname, 
    posicion: j.posicion 
  })));
  
  if (window.tableroController) {
    // ✅ SINCRONIZAR JUGADORES CON TABLERO CONTROLLER
    window.tableroController.jugadores = [...jugadores]; // Clonar array
    window.tableroController.turnoActual = turnoActual;
    
    // ✅ ACTUALIZAR FICHAS
    window.tableroController.actualizarFichasPublico(jugadores, turnoActual);
    
    console.log('✅ Fichas enviadas a tableroController');
  } else {
    console.error('❌ window.tableroController no disponible');
  }
}

// ============== EXPORTACIONES ADICIONALES ==============
export {
  jugadores,
  turnoActual,
  estadoJuego,
  siguienteTurno,
  actualizarFichas,
  comprarPropiedad
};

console.log('🎮 GameController cargado con AccionModal');