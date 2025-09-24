
export function accionPropiedad(jugador, casilla, jugadores) {
  // Si no tiene dueño, opción de compra
  if (!casilla.propietario) {
    return { tipo: 'propiedadLibre', casilla };
  }

  // Si la propiedad es de otro jugador y no está hipotecada, pagar renta
  if (casilla.propietario !== jugador && !casilla.hipotecada) {
    const renta = calcularRenta(casilla);
    jugador.dinero -= renta;

    if (jugador.dinero < 0) {
      return { tipo: 'bancarrota', deuda: -jugador.dinero, acreedor: casilla.propietario };
    }

    casilla.propietario.dinero += renta;
    return { tipo: 'pagoRentaPropiedad', monto: renta, a: casilla.propietario };
  }

  // Si es del mismo jugadorm posibilidad de construir
  if (casilla.propietario === jugador) {
    if (puedeConstruir(jugador, casilla, jugadores)) {
      return { tipo: 'puedeConstruir', casilla };
    }
  }

  return { tipo: 'sinAccion' };
}


 // Calcula la renta de una propiedad en función de casas y hotel
 
export function calcularRenta(casilla) {
  if (casilla.hotel) {
    return casilla.rentas.hotel;
  }
  if (casilla.casas > 0) {
    return casilla.rentas[`casa${casilla.casas}`];
  }
  return casilla.rentas.base;
}

export function puedeConstruir(jugador, casilla, jugadores) {
  // 1. Debe poseer todas las propiedades del mismo color
  const grupoColor = jugadores.flatMap(j => j.propiedades)
    .filter(p => p.color === casilla.color);
  const todasDelColor = grupoColor.every(p => p.propietario === jugador);

  if (!todasDelColor) return false;

  // 2. Máximo 4 casas antes de hotel
  if (casilla.casas < 4) {
    return true;
  }
  // 3. Si ya tiene 4 casas,  puede construir hotel (si aún no lo tiene)
  if (casilla.casas === 4 && !casilla.hotel) {
    return true;
  }

  return false;
}

export function construir(jugador, casilla) {
  if (casilla.casas < 4) {
    casilla.casas++;
    jugador.dinero -= 100; 
    return { tipo: 'construirCasa', casilla };
  } else if (!casilla.hotel) {
    casilla.hotel = true;
    casilla.casas = 0; 
    jugador.dinero -= 250 
    return { tipo: 'construirHotel', casilla };
  }
  return { tipo: 'noConstruir' };
}


// Ferrocarriles

export function accionFerrocarril(jugador, casilla) {
  if (!casilla.propietario) {
    return { tipo: 'ferrocarrilLibre', casilla };
  }
  if (casilla.propietario !== jugador && !casilla.hipotecada) {
    const cantidad = casilla.propietario.propiedades
      .filter(p => p.tipo === 'ferrocarril').length;

    const renta = casilla.rentas[`x${cantidad}`]; 
    jugador.dinero -= renta;

    if (jugador.dinero < 0) {
      return { tipo: 'bancarrota', deuda: -jugador.dinero, acreedor: casilla.propietario };
    }

    casilla.propietario.dinero += renta;
    return { tipo: 'pagoRentaFerrocarril', monto: renta, a: casilla.propietario };
  }
  return { tipo: 'sinAccion' };
}


//  Servicios

export function accionServicio(jugador, casilla, dados) {
  if (!casilla.propietario) {
    return { tipo: 'servicioLibre', casilla };
  }
  if (casilla.propietario !== jugador && !casilla.hipotecada) {
    const cantidad = casilla.propietario.propiedades
      .filter(p => p.tipo === 'servicio').length;

    const factor = cantidad === 1 ? 4 : 10;
    const renta = factor * (dados[0] + dados[1]);

    jugador.dinero -= renta;
    if (jugador.dinero < 0) {
      return { tipo: 'bancarrota', deuda: -jugador.dinero, acreedor: casilla.propietario };
    }

    casilla.propietario.dinero += renta;
    return { tipo: 'pagoRentaServicio', monto: renta, a: casilla.propietario };
  }
  return { tipo: 'sinAccion' };
}

// Cartas (Comunidad / Sorpresa)

function irACarcel(jugador) {
  jugador.posicion = 11;
  jugador.enCarcel = true;
  jugador.turnosCarcel = 3;
  return { tipo: 'irCarcel' };
}

export function accionCartaEspecial(jugador, carta, jugadores) {
  switch (carta.tipo) {
    case 'carcel':
      return irACarcel(jugador);

    case 'dinero':
      jugador.dinero += carta.monto;
      return { tipo: 'dinero', monto: carta.monto };

    case 'mover':
      jugador.posicion = carta.casillaDestino;
      return { tipo: 'mover', destino: carta.casillaDestino };

    case 'salirCarcel':
      jugador.tieneCartaSalirCarcel = true;
      return { tipo: 'salirCarcelGuardada' };

    case 'pagarJugador':
      jugador.dinero -= carta.monto;
      carta.jugadorDestino.dinero += carta.monto;
      return { tipo: 'pagarJugador', monto: carta.monto, a: carta.jugadorDestino };

    case 'cobrarDeTodos':
      jugadores.forEach(j => {
        if (j !== jugador) {
          j.dinero -= carta.monto;
          jugador.dinero += carta.monto;
        }
      });
      return { tipo: 'cobrarDeTodos', monto: carta.monto };

    case 'irInicio':
      jugador.posicion = 1;
      jugador.dinero += 200; // configurable
      return { tipo: 'irInicio', monto: 200 };

    default:
      return { tipo: 'sinAccion' };
  }
}

export function accionPagarImpuesto(jugador, monto) {
  jugador.dinero -= monto;
  if (jugador.dinero < 0) {
    return { tipo: 'bancarrota', deuda: -jugador.dinero };
  }
  return { tipo: 'pagoImpuesto', monto };
}

export function accionSalirCarcel(jugador) {
  if (jugador.enCarcel) {
    jugador.enCarcel = false;
    jugador.turnosCarcel = 0;
    return { tipo: 'salirCarcel' };
  }
  return { tipo: 'sinAccion' };
}

export function accionInicio(jugador, monto = 200) {
  jugador.dinero += monto;
  return { tipo: 'cobrarInicio', monto };
}

export function accionParqueLibre() {
  return { tipo: 'sinAccion' };
}

export function accionIrCarcel(jugador) {
  return irACarcel(jugador);
}
