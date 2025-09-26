export function accionPropiedad(jugador, casilla, jugadores) {
  if (casilla.hipotecada) return; // No cobra renta si está hipotecada
  if (!casilla.propietario) {
    // Opción de compra
    if (jugador.dinero >= casilla.precio) {
      jugador.dinero -= casilla.precio;
      casilla.propietario = jugador;
      jugador.propiedades.push(casilla);
    }
  } else if (casilla.propietario !== jugador) {
    // Pago de renta
    const renta = casilla.calcularRenta();
    if (jugador.pagar(renta)) {
      casilla.propietario.cobrar(renta);
    } 
  } 
}

export function calcularRenta(casilla) {
  return casilla.calcularRenta();
}

export function puedeConstruir(jugador, casilla, tablero) {
  if (casilla.hipotecada || casilla.hotel) return false;
  // Verifica si el jugador tiene todas las propiedades del color
  const grupo = tablero.filter(c => c.color === casilla.color && c.tipo === "property");
  return grupo.every(p => p.propietario === jugador && !p.hipotecada);
}

export function construir(jugador, casilla) {
  if (puedeConstruir(jugador, casilla, jugador.propiedades)) {
    if (casilla.casas < 4) {
      if (jugador.dinero >= 100) {
        jugador.dinero -= 100;
        casilla.construirCasa();
        return true;
      }
    } else if (!casilla.hotel && casilla.casas === 4) {
      if (jugador.dinero >= 250) {
        jugador.dinero -= 250;
        casilla.construirHotel();
        return true;
      }
    }
  }
  return false;
}

// Ferrocarriles y servicios pueden tener funciones similares usando Propiedad

export function accionFerrocarril(jugador, casilla) {
  return accionPropiedad(jugador, casilla, []);
}

export function accionServicio(jugador, casilla, dados) {
  if (casilla.hipotecada) return;
  if (!casilla.propietario) {
    // Opción de compra
  } else if (casilla.propietario !== jugador) {
    const renta = dados * (casilla.rent.multiplier || 4);
    if (jugador.pagar(renta)) {
      casilla.propietario.cobrar(renta);
    }
  }
}

// Cartas (Comunidad / Sorpresa)
export function irACarcel(jugador) {
  jugador.enCarcel = true;
  jugador.turnosCarcel = 3;
  jugador.posicion = 10; // Casilla de cárcel
}

export function accionPagarImpuesto(jugador, monto, motivo = "") {
  jugador.pagar(monto);
}

export function accionCarta(jugador, mazo) {
  const carta = mazo[Math.floor(Math.random() * mazo.length)];
  if (carta.tipo === "dinero") {
    jugador.dinero += carta.valor;
  } else if (carta.tipo === "pagar") {
    jugador.pagar(carta.valor);
  }
  return carta;
}

export function salirDeCarcel(jugador) {
  if (jugador.dinero >= 50) {
    jugador.dinero -= 50;
    jugador.enCarcel = false;
    jugador.turnosCarcel = 0;
    return true;
  }
  return false;
}

export function hipotecarPropiedad(jugador, casilla) {
  if (casilla.propietario === jugador && !casilla.hipotecada) {
    jugador.dinero += casilla.mortgage;
    casilla.hipotecada = true;
    return true;
  }
  return false;
}

export function deshipotecarPropiedad(jugador, casilla) {
  const pago = Math.ceil(casilla.mortgage * 1.1);
  if (casilla.propietario === jugador && casilla.hipotecada && jugador.dinero >= pago) {
    jugador.dinero -= pago;
    casilla.hipotecada = false;
    return true;
  }
  return false;
}

export function calcularPatrimonio(jugador) {
  let valorPropiedades = 0;
  jugador.propiedades.forEach(p => {
    if (!p.hipotecada) {
      valorPropiedades += p.precio;
      valorPropiedades += (p.casas || 0) * 100;
      valorPropiedades += (p.hotel ? 200 : 0);
    } else {
      valorPropiedades -= p.mortgage;
    }
  });
  return jugador.dinero + valorPropiedades;
}

export async function finalizarJuego(jugadores) {
  const resultados = jugadores.map(j => ({
    nick_name: j.nick,
    score: calcularPatrimonio(j)
  }));
  for (const r of resultados) {
    await fetch("http://127.0.0.1/score-recorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r)
    });
  }
}
