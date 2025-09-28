import { obtenerCasilla, actualizarEstadoJuego } from '../utils/gameHelpers.js';
import { PropiedadesRenderer } from '../renderers/propiedadesRenderer.js';

/**
 * Manejo de acciones del juego
 * Separado para mantener gameController limpio
 */

/**
 * Ejecuta la acción correspondiente según el tipo de casilla
 */
export function ejecutarAccionCasilla(jugador, casilla, accionesManager, jugadores, turnoActual) {
  console.log('🎯 Ejecutando acción:', casilla.tipo, casilla.nombre);
  
  let resultado;
  
  // ✅ MODIFICAR CASO 'propiedad':
  switch(casilla.tipo) {
    case 'propiedad':
      if (casilla.propietario) {
        // Ya tiene propietario - pagar renta
        resultado = accionesManager.accionPropiedad(jugador, casilla);
      } else {
        // ✅ PROPIEDAD LIBRE - MOSTRAR MODAL DE COMPRA:
        console.log('🏠 Propiedad disponible para compra');
        PropiedadesRenderer.mostrarModalCompra(casilla, jugador);
        resultado = { 
          tipo: 'modal-compra', 
          continuar: false, // No cambiar turno automáticamente
          mensaje: `Opción de compra mostrada para ${casilla.nombre}`
        };
      }
      break;
      
    case 'impuesto':
      const cantidad = casilla.impuesto || 100;
      resultado = accionesManager.accionImpuestos(jugador, cantidad);
      break;
      
    case 'carcel':
      resultado = accionesManager.accionCarcel(jugador);
      break;
      
    case 'carta-suerte':
      resultado = accionesManager.accionCarta(jugador, 'suerte');
      break;
      
    case 'carta-comunidad':  
      resultado = accionesManager.accionCarta(jugador, 'comunidad');
      break;
      
    case 'salida':
      resultado = accionesManager.accionSalida(jugador);
      break;
      
    default:
      // Casilla neutral
      if (window.Toast) {
        window.Toast.info(`${jugador.nickname} en ${casilla.nombre || 'casilla neutral'}`, 'Casilla');
      }
      resultado = { tipo: 'neutral', continuar: true };
  }
  
  console.log('📊 Resultado de acción:', resultado);
  
  // ✅ ACTUALIZAR ESTADO:
  actualizarEstadoJuego(jugadores, turnoActual, 'esperando_dados');
  
  return resultado;
}

/**
 * Maneja el resultado de una acción y determina si continuar
 */
export function manejarResultadoAccion(resultado, siguienteTurnoCallback) {
  // ✅ MANEJAR RESULTADO:
  if (resultado.continuar) {
    // Si la acción permite continuar, pasar turno después de un delay
    const delay = resultado.tipo === 'modal' || resultado.tipo === 'modal-compra' ? 0 : 1500;
    if (delay > 0) {
      setTimeout(() => siguienteTurnoCallback(), delay);
    }
    // Si es modal, el turno se cambia cuando se cierra el modal
  }
  
  // ✅ MANEJAR MODAL DE COMPRA:
  if (resultado.tipo === 'modal-compra') {
    console.log('🏠 Modal de compra mostrado, esperando decisión del jugador');
    return false; // No cambiar turno hasta que el jugador decida
  }
  
  if (resultado.tipo === 'bancarrota') {
    // Manejar bancarrota
    console.log('💀 Jugador en bancarrota');
    setTimeout(() => siguienteTurnoCallback(), 2000);
  }
  
  return true; // Permite cambio de turno normal
}

/**
 * Maneja la lógica de movimiento de fichas
 */
export function moverJugador(jugador, casillas, accionesManager) {
  console.log('🎲 Moviendo ficha del jugador:', jugador.nickname);
  console.log('🎯 Posición antes:', jugador.posicion);
  
  // ✅ VERIFICAR SI PASA POR LA SALIDA:
  const posicionAnterior = jugador.posicion;
  
  // Actualizar posición
  if (typeof casillas === 'number') {
    jugador.posicion = (jugador.posicion + casillas) % 40;
  }
  
  console.log('🎯 Posición después:', jugador.posicion);
  
  // ✅ VERIFICAR SI PASÓ POR LA SALIDA:
  if (posicionAnterior + casillas >= 40) {
    console.log('💰 ¡Pasó por la Salida!');
    const resultadoSalida = accionesManager.accionSalida(jugador);
    console.log('Resultado salida:', resultadoSalida);
  }
  
  return obtenerCasilla(jugador.posicion);
}

/**
 * Ejecuta la compra de una propiedad
 */
export function ejecutarCompraPropiedad(jugador, propiedadId, propiedadesManager, obtenerCasillaCallback) {
  const casilla = obtenerCasillaCallback(jugador.posicion);
  
  console.log('💰 Intentando comprar:', propiedadId, casilla);
  
  if (casilla.id === propiedadId || casilla.position.toString() === propiedadId) {
    const exito = propiedadesManager.comprarPropiedad(jugador, casilla);
    
    if (exito) {
      // ✅ AGREGAR PROPIEDAD AL JUGADOR:
      if (!jugador.propiedades) jugador.propiedades = [];
      jugador.propiedades.push(casilla.id);
      
      // ✅ MARCAR CASILLA COMO COMPRADA:
      casilla.propietario = jugador.id;
      
      if (window.Toast) {
        window.Toast.success(
          `${jugador.nickname} compró ${casilla.nombre} por $${casilla.precio}`,
          '🏠 Compra Exitosa'
        );
      }
      
      return true;
    }
  } else {
    console.error('❌ ID de propiedad no coincide');
  }
  
  return false;
}

console.log('🎬 GameActions cargado');