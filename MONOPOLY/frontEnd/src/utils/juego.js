// /src/utils/juego.js
// Lógica principal del juego Monopoly
// Incluye: compra/venta, construcción, hipotecas, cárcel, impuestos, finalización de partida

/**
 * Representa una propiedad del tablero
 */
export class Propiedad {
  constructor({ nombre, color, precio, alquiler, propietario = null, casas = 0, hotel = false, hipotecada = false }) {
    this.nombre = nombre;
    this.color = color;
    this.precio = precio;
    this.alquiler = alquiler; // Array: [sin casas, 1 casa, ..., hotel]
    this.propietario = propietario;
    this.casas = casas;
    this.hotel = hotel;
    this.hipotecada = hipotecada;
  }

  calcularAlquiler() {
    if (this.hipotecada) return 0;
    if (this.hotel) return this.alquiler[5];
    return this.alquiler[this.casas];
  }

  puedeConstruir(jugador) {
  // Lógica para verificar si el jugador puede construir en esta propiedad
    return this.propietario === jugador && !this.hotel && this.casas < 4 && !this.hipotecada;
  }
}

/**
 * Compra una propiedad
 */
export function comprarPropiedad(jugador, propiedad) {
  if (propiedad.propietario || jugador.dinero < propiedad.precio) return false;
  jugador.dinero -= propiedad.precio;
  propiedad.propietario = jugador;
  jugador.propiedades.push(propiedad);
  return true;
}

/**
 * Vende una propiedad
 */
export function venderPropiedad(jugador, propiedad) {
  if (propiedad.propietario !== jugador) return false;
  jugador.dinero += propiedad.precio; // O valor de venta
  propiedad.propietario = null;
  jugador.propiedades = jugador.propiedades.filter(p => p !== propiedad);
  return true;
}

/**
 * Hipoteca una propiedad
 */
export function hipotecarPropiedad(jugador, propiedad) {
  if (propiedad.propietario !== jugador || propiedad.hipotecada) return false;
  propiedad.hipotecada = true;
  jugador.dinero += propiedad.precio / 2;
  return true;
}

/**
 * Deshipoteca una propiedad
 */
export function deshipotecarPropiedad(jugador, propiedad) {
  const costo = propiedad.precio * 0.55;
  if (propiedad.propietario !== jugador || !propiedad.hipotecada || jugador.dinero < costo) return false;
  propiedad.hipotecada = false;
  jugador.dinero -= costo;
  return true;
}

/**
 * Construye una casa o un hotel
 */
export function construirCasaOHotel(jugador, propiedad) {
  if (!propiedad.puedeConstruir(jugador) || jugador.dinero < propiedad.precioCasa) return false;
  jugador.dinero -= propiedad.precioCasa;
  propiedad.casas++;
  if (propiedad.casas === 4) {
    propiedad.hotel = true;
    propiedad.casas = 0;
  }
  return true;
}

/**
 * Verifica si el jugador tiene monopolio de color
 */
export function tieneMonopolio(jugador, color, propiedadesTablero) {
  const delColor = propiedadesTablero.filter(p => p.color === color);
  return delColor.every(p => p.propietario === jugador);
}

// Ejemplo de uso:
// import { Propiedad, comprarPropiedad } from './juego.js';
// const p = new Propiedad({nombre: 'Gran Vía', color: 'rojo', precio: 200, alquiler: [20, 60, 180, 320, 450, 600]});
// comprarPropiedad(jugador, p);
