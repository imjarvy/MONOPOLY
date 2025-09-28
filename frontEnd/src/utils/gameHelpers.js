/**
 * Funciones auxiliares para el GameController
 * Separadas para mantener el código limpio
 */

/**
 * Obtiene información de una casilla por posición
 */
export function obtenerCasilla(posicion) {
  console.log('🔍 Buscando casilla en posición:', posicion);
  
  // ✅ INTENTAR OBTENER DESDE tableroData PRIMERO:
  if (window.tableroData && window.tableroData.casillas) {
    const casilla = window.tableroData.casillas.find(c => c.position === posicion);
    if (casilla) {
      console.log('✅ Casilla encontrada desde tableroData:', casilla);
      return casilla;
    }
  }
  
  // ✅ DATOS DE PRUEBA EXPANDIDOS CON PROPIEDADES REALES:
  const casillasDefault = {
    0: { id: 'salida', nombre: 'Salida', tipo: 'salida', position: 0 },
    1: { id: 'prop-1', nombre: 'Mediterráneo', tipo: 'propiedad', color: 'marron', precio: 60, position: 1 },
    2: { id: 'comunidad-1', nombre: 'Arca Comunidad', tipo: 'carta-comunidad', position: 2 },
    3: { id: 'prop-3', nombre: 'Báltico', tipo: 'propiedad', color: 'marron', precio: 60, position: 3 },
    4: { id: 'impuesto-1', nombre: 'Impuesto', tipo: 'impuesto', impuesto: 200, position: 4 },
    5: { id: 'prop-5', nombre: 'Ferrocarril 1', tipo: 'propiedad', color: 'ferrocarril', precio: 200, position: 5 },
    6: { id: 'prop-6', nombre: 'Oriental', tipo: 'propiedad', color: 'azul-claro', precio: 100, position: 6 },
    7: { id: 'prop-7', nombre: 'Vermont', tipo: 'propiedad', color: 'azul-claro', precio: 100, position: 7 },
    8: { id: 'prop-8', nombre: 'Connecticut', tipo: 'propiedad', color: 'azul-claro', precio: 120, position: 8 },
    9: { id: 'carcel', nombre: 'Cárcel', tipo: 'carcel', position: 9 },
    10: { id: 'prop-10', nombre: 'St. Charles', tipo: 'propiedad', color: 'rosa', precio: 140, position: 10 },
    
    // ✅ AGREGAR MÁS PROPIEDADES:
    11: { id: 'prop-11', nombre: 'Estados', tipo: 'propiedad', color: 'rosa', precio: 140, position: 11 },
    12: { id: 'prop-12', nombre: 'Compañía Eléctrica', tipo: 'propiedad', color: 'servicio', precio: 150, position: 12 },
    13: { id: 'prop-13', nombre: 'St. James', tipo: 'propiedad', color: 'rosa', precio: 180, position: 13 },
    14: { id: 'prop-14', nombre: 'Tennessee', tipo: 'propiedad', color: 'naranja', precio: 180, position: 14 },
    15: { id: 'prop-15', nombre: 'Ferrocarril 2', tipo: 'propiedad', color: 'ferrocarril', precio: 200, position: 15 },
    
    // Cartas y especiales salpicados
    16: { id: 'suerte-1', nombre: 'Suerte', tipo: 'carta-suerte', position: 16 },
    17: { id: 'prop-17', nombre: 'New York', tipo: 'propiedad', color: 'naranja', precio: 200, position: 17 },
    18: { id: 'comunidad-2', nombre: 'Arca Comunidad', tipo: 'carta-comunidad', position: 18 },
    19: { id: 'prop-19', nombre: 'Kentucky', tipo: 'propiedad', color: 'rojo', precio: 220, position: 19 },
    20: { id: 'parking', nombre: 'Parking Gratuito', tipo: 'neutral', position: 20 },
  };
  
  const casilla = casillasDefault[posicion] || {
    id: `casilla-${posicion}`,
    nombre: `Casilla ${posicion}`,
    tipo: 'neutral',
    position: posicion
  };
  
  console.log('📋 Casilla obtenida (default):', casilla);
  return casilla;
}

/**
 * Actualiza las fichas visuales en el tablero
 */
export function actualizarFichas(jugadores, turnoActual) {
  console.log('🔄 Actualizando fichas de jugadores');
  console.log('📍 Posiciones actuales:', jugadores.map(j => ({ 
    nickname: j.nickname, 
    posicion: j.posicion 
  })));
  
  if (window.tableroController) {
    window.tableroController.jugadores = [...jugadores];
    window.tableroController.turnoActual = turnoActual;
    window.tableroController.actualizarFichasPublico(jugadores, turnoActual);
    console.log('✅ Fichas enviadas a tableroController');
  } else {
    console.error('❌ window.tableroController no disponible');
  }
}

/**
 * Verifica si un jugador pasó por la Salida
 */
export function verificarPasoPorSalida(posicionAnterior, movimiento) {
  return posicionAnterior + movimiento >= 40;
}

/**
 * Actualiza el panel de jugadores y window.gameController
 */
export function actualizarEstadoJuego(jugadores, turnoActual, estadoJuego) {
  // Actualizar panel visual
  if (window.renderizarPanelJugadores) {
    window.renderizarPanelJugadores(jugadores, turnoActual);
  }
  
  // Actualizar window.gameController
  if (window.gameController) {
    window.gameController.jugadores = jugadores;
    window.gameController.turnoActual = turnoActual;
    window.gameController.estadoJuego = estadoJuego;
  }
}

console.log('🔧 GameHelpers cargado');