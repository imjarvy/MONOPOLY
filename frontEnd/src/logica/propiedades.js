/**
 * Sistema de Propiedades del Monopoly
 * Maneja compra, venta, construcción, hipotecas de propiedades
 */

import { obtenerJugadoresActuales, obtenerJugadorActual } from '../logica/turnos.js';

// Constantes del juego
const PRECIO_CASA = 100;
const PRECIO_HOTEL = 250;
const INTERES_HIPOTECA = 0.10; // 10%

/**
 * Obtiene la información de una propiedad desde el tablero
 * @param {number} posicion - Posición de la casilla
 * @returns {Object|null} - Información de la propiedad
 */
export async function obtenerInfoPropiedad(posicion) {
  try {
    const response = await fetch('http://127.0.0.1:5000/board');
    let boardData;
    
    if (!response.ok) {
      // Usar datos locales si el backend no está disponible
      const { getBoard } = await import('../services/boardService.js');
      boardData = await getBoard();
    } else {
      boardData = await response.json();
    }
    
    // Buscar la propiedad en todas las secciones del tablero
    const todasLasCasillas = [
      ...boardData.bottom,
      ...boardData.left, 
      ...boardData.top,
      ...boardData.right
    ];
    
    return todasLasCasillas.find(casilla => casilla.id === posicion);
  } catch (error) {
    console.error('Error al obtener información de propiedad:', error);
    // Último recurso: usar datos locales
    const { getBoard } = await import('../services/boardService.js');
    const boardData = await getBoard();
    const todasLasCasillas = [
      ...boardData.bottom,
      ...boardData.left, 
      ...boardData.top,
      ...boardData.right
    ];
    return todasLasCasillas.find(casilla => casilla.id === posicion);
  }
}

/**
 * Verifica si un jugador puede comprar una propiedad
 * @param {Object} jugador - Jugador actual
 * @param {Object} propiedad - Información de la propiedad
 * @returns {boolean}
 */
export function puedeComprarPropiedad(jugador, propiedad) {
  if (propiedad.type !== 'property' && propiedad.type !== 'railroad') return false;
  if (jugador.dinero < propiedad.price) return false;
  
  // Verificar si la propiedad ya tiene dueño
  const propiedadEnJugador = jugador.propiedades?.find(p => p.id === propiedad.id);
  if (propiedadEnJugador) return false;
  
  // Verificar si otro jugador la posee
  const jugadores = obtenerJugadoresActuales();
  const otrosDueños = jugadores.some(j => 
    j.id !== jugador.id && j.propiedades?.some(p => p.id === propiedad.id)
  );
  
  return !otrosDueños;
}

/**
 * Compra una propiedad
 * @param {Object} jugador - Jugador que compra
 * @param {Object} propiedad - Propiedad a comprar
 * @returns {Object} - Resultado de la operación
 */
export function comprarPropiedad(jugador, propiedad) {
  if (!puedeComprarPropiedad(jugador, propiedad)) {
    return { exito: false, mensaje: 'No puedes comprar esta propiedad' };
  }
  
  // Descontar dinero
  jugador.dinero -= propiedad.price;
  
  // Agregar propiedad al jugador
  if (!jugador.propiedades) jugador.propiedades = [];
  jugador.propiedades.push({
    id: propiedad.id,
    nombre: propiedad.name,
    color: propiedad.color,
    precio: propiedad.price,
    hipoteca: propiedad.mortgage,
    renta: propiedad.rent,
    casas: 0,
    hotel: false,
    hipotecada: false,
    type: propiedad.type
  });
  
  // Actualizar localStorage
  actualizarJugadorEnStorage(jugador);
  
  return { 
    exito: true, 
    mensaje: `Has comprado ${propiedad.name} por $${propiedad.price}` 
  };
}

/**
 * Verifica si un jugador tiene monopolio de un color
 * @param {Object} jugador - Jugador a verificar
 * @param {string} color - Color del monopolio
 * @returns {boolean}
 */
export async function tieneMonopolio(jugador, color) {
  try {
    const { getBoard } = await import('../services/boardService.js');
    const boardData = await getBoard();
    
    const todasLasCasillas = [
      ...boardData.bottom,
      ...boardData.left, 
      ...boardData.top,
      ...boardData.right
    ];
    
    // Contar propiedades del color en el tablero
    const propiedadesDelColor = todasLasCasillas.filter(casilla => 
      casilla.type === 'property' && casilla.color === color
    );
    
    // Contar propiedades del color que posee el jugador
    const propiedadesJugador = jugador.propiedades?.filter(propiedad => 
      propiedad.color === color && !propiedad.hipotecada
    ) || [];
    
    return propiedadesJugador.length === propiedadesDelColor.length;
  } catch (error) {
    console.error('Error al verificar monopolio:', error);
    return false;
  }
}

/**
 * Verifica si se puede construir en una propiedad
 * @param {Object} jugador - Jugador propietario
 * @param {Object} propiedad - Propiedad donde construir
 * @returns {Object} - Resultado de la verificación
 */
export async function puedeConstructir(jugador, propiedad) {
  // Solo se puede construir en propiedades normales
  if (propiedad.type !== 'property') {
    return { puede: false, razon: 'No se puede construir en este tipo de casilla' };
  }
  
  // No se puede construir en propiedades hipotecadas
  if (propiedad.hipotecada) {
    return { puede: false, razon: 'No se puede construir en propiedades hipotecadas' };
  }
  
  // Debe tener monopolio del color
  const monopolio = await tieneMonopolio(jugador, propiedad.color);
  if (!monopolio) {
    return { puede: false, razon: 'Necesitas tener todas las propiedades del mismo color' };
  }
  
  // Verificar límites de construcción
  if (propiedad.hotel) {
    return { puede: false, razon: 'Ya hay un hotel construido' };
  }
  
  if (propiedad.casas >= 4) {
    // Puede construir hotel
    if (jugador.dinero >= PRECIO_HOTEL) {
      return { puede: true, tipo: 'hotel', costo: PRECIO_HOTEL };
    } else {
      return { puede: false, razon: 'No tienes suficiente dinero para el hotel' };
    }
  } else {
    // Puede construir casa
    if (jugador.dinero >= PRECIO_CASA) {
      return { puede: true, tipo: 'casa', costo: PRECIO_CASA };
    } else {
      return { puede: false, razon: 'No tienes suficiente dinero para una casa' };
    }
  }
}

/**
 * Construye una casa o hotel en una propiedad
 * @param {Object} jugador - Jugador propietario
 * @param {Object} propiedad - Propiedad donde construir
 * @returns {Object} - Resultado de la construcción
 */
export async function construir(jugador, propiedad) {
  const verificacion = await puedeConstructir(jugador, propiedad);
  
  if (!verificacion.puede) {
    return { exito: false, mensaje: verificacion.razon };
  }
  
  // Descontar dinero
  jugador.dinero -= verificacion.costo;
  
  if (verificacion.tipo === 'hotel') {
    // Construir hotel (reemplaza las 4 casas)
    propiedad.casas = 0;
    propiedad.hotel = true;
    actualizarJugadorEnStorage(jugador);
    return { 
      exito: true, 
      mensaje: `Has construido un hotel en ${propiedad.nombre} por $${PRECIO_HOTEL}` 
    };
  } else {
    // Construir casa
    propiedad.casas += 1;
    actualizarJugadorEnStorage(jugador);
    return { 
      exito: true, 
      mensaje: `Has construido una casa en ${propiedad.nombre} por $${PRECIO_CASA}` 
    };
  }
}

/**
 * Hipoteca una propiedad
 * @param {Object} jugador - Jugador propietario
 * @param {Object} propiedad - Propiedad a hipotecar
 * @returns {Object} - Resultado de la hipoteca
 */
export function hipotecarPropiedad(jugador, propiedad) {
  if (propiedad.hipotecada) {
    return { exito: false, mensaje: 'La propiedad ya está hipotecada' };
  }
  
  if (propiedad.casas > 0 || propiedad.hotel) {
    return { exito: false, mensaje: 'No puedes hipotecar propiedades con construcciones' };
  }
  
  // Dar dinero de la hipoteca
  jugador.dinero += propiedad.hipoteca;
  propiedad.hipotecada = true;
  
  actualizarJugadorEnStorage(jugador);
  
  return { 
    exito: true, 
    mensaje: `Has hipotecado ${propiedad.nombre} y recibido $${propiedad.hipoteca}` 
  };
}

/**
 * Deshipoteca una propiedad
 * @param {Object} jugador - Jugador propietario
 * @param {Object} propiedad - Propiedad a deshipotecar
 * @returns {Object} - Resultado de la deshipoteca
 */
export function deshipotecarPropiedad(jugador, propiedad) {
  if (!propiedad.hipotecada) {
    return { exito: false, mensaje: 'La propiedad no está hipotecada' };
  }
  
  const costoDeshipoteca = Math.round(propiedad.hipoteca * (1 + INTERES_HIPOTECA));
  
  if (jugador.dinero < costoDeshipoteca) {
    return { exito: false, mensaje: `No tienes suficiente dinero. Necesitas $${costoDeshipoteca}` };
  }
  
  // Descontar el costo con interés
  jugador.dinero -= costoDeshipoteca;
  propiedad.hipotecada = false;
  
  actualizarJugadorEnStorage(jugador);
  
  return { 
    exito: true, 
    mensaje: `Has deshipotecado ${propiedad.nombre} por $${costoDeshipoteca}` 
  };
}

/**
 * Calcula la renta que debe pagar por una propiedad
 * @param {Object} propiedad - Propiedad del tablero
 * @param {Object} propiedadJugador - Propiedad en posesión del jugador
 * @returns {number} - Monto de la renta
 */
export function calcularRenta(propiedad, propiedadJugador) {
  if (propiedadJugador.hipotecada) return 0;
  
  if (propiedad.type === 'railroad') {
    // Contar ferrocarriles del dueño
    const jugadores = obtenerJugadoresActuales();
    const dueño = jugadores.find(j => 
      j.propiedades?.some(p => p.id === propiedad.id)
    );
    
    const ferrocarriles = dueño?.propiedades?.filter(p => p.type === 'railroad').length || 1;
    return propiedad.rent[ferrocarriles.toString()] || propiedad.rent['1'];
  }
  
  if (propiedad.type === 'property') {
    if (propiedadJugador.hotel) {
      return propiedad.rent.withHotel;
    }
    
    if (propiedadJugador.casas > 0) {
      return propiedad.rent.withHouse[propiedadJugador.casas - 1];
    }
    
    return propiedad.rent.base;
  }
  
  return 0;
}

/**
 * Actualiza un jugador en localStorage
 * @param {Object} jugador - Jugador a actualizar
 */
function actualizarJugadorEnStorage(jugador) {
  const jugadores = JSON.parse(localStorage.getItem('jugadores') || '[]');
  const index = jugadores.findIndex(j => j.id === jugador.id);
  
  if (index !== -1) {
    jugadores[index] = jugador;
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
  }
}

/**
 * Obtiene todas las propiedades de un jugador
 * @param {Object} jugador - Jugador
 * @returns {Array} - Lista de propiedades
 */
export function obtenerPropiedadesJugador(jugador) {
  return jugador.propiedades || [];
}