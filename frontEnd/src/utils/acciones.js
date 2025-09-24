// /src/utils/acciones.js
// Funciones para ejecutar acciones del juego Monopoly

/**
 * Ejecuta la acción de caer en una casilla
 */
export function accionCaerEnCasilla(jugador, casilla) {
  // Ejemplo: si es propiedad y no es tuya, paga alquiler
  if (casilla.propietario && casilla.propietario !== jugador && !casilla.hipotecada) {
    const alquiler = casilla.calcularAlquiler();
    jugador.dinero -= alquiler;
    casilla.propietario.dinero += alquiler;
    return { tipo: 'pagoAlquiler', monto: alquiler };
  }
  // Si es tuya o libre, no pasa nada
  return { tipo: 'sinAccion' };
}

/**
 * Ejecuta la acción de carta especial
 */
export function accionCartaEspecial(jugador, carta) {
  // Ejemplo: carta de ir a la cárcel
  if (carta.tipo === 'carcel') {
    jugador.enCarcel = true;
    jugador.turnosCarcel = 3;
    return { tipo: 'irCarcel' };
  }
  // Otras cartas: sumar/restar dinero, mover, etc.
  if (carta.tipo === 'dinero') {
    jugador.dinero += carta.monto;
    return { tipo: 'dinero', monto: carta.monto };
  }
  return { tipo: 'sinAccion' };
}

/**
 * Ejecuta la acción de pagar impuestos
 */
export function accionPagarImpuesto(jugador, monto) {
  jugador.dinero -= monto;
  return { tipo: 'pagoImpuesto', monto };
}

/**
 * Ejecuta la acción de salir de la cárcel
 */
export function accionSalirCarcel(jugador) {
  if (jugador.enCarcel) {
    jugador.enCarcel = false;
    jugador.turnosCarcel = 0;
    return { tipo: 'salirCarcel' };
  }
  return { tipo: 'sinAccion' };
}

// Ejemplo de uso:
// import { accionCaerEnCasilla } from './acciones.js';
// const resultado = accionCaerEnCasilla(jugador, casilla);
