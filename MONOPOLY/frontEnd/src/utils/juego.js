export class Juego {
  constructor(jugadores, tablero) {
    this.jugadores = jugadores;         // Array de Jugador
    this.tablero = tablero;             // Array de casillas (propiedades, ferrocarriles, servicios, etc.)
    this.turnoActual = 0;               // Índice del jugador actual
    this.dados = [0, 0];                // Último lanzamiento de dados
    this.estado = "EN_CURSO";           // Estado del juego
    this.ranking = [];                  // Ranking final al terminar
    this.historial = [];                // Historial de acciones (opcional)
  
  }


  // Mover jugador según los dados
  moverJugador(jugador) {
    const pasos = this.dados[0] + this.dados[1];
    jugador.posicion = (jugador.posicion + pasos) % this.tablero.length;

    // Si pasó por la salida (casilla 0), cobra
    if (jugador.posicion < pasos) {
      accionInicio(jugador, 200);
    }

    return jugador.posicion;
  }

  // Ejecutar acción de la casilla
  ejecutarAccion(jugador) {
    const casilla = this.tablero[jugador.posicion];
    switch (casilla.tipo) {
      case "propiedad":
        return accionPropiedad(jugador, casilla, this.jugadores);
      case "ferrocarril":
        return accionFerrocarril(jugador, casilla);
      case "servicio":
        return accionServicio(jugador, casilla, this.dados);
      case "impuesto":
        return accionPagarImpuesto(jugador, casilla.monto);
      case "carcel":
        return accionIrCarcel(jugador);
      case "carta":
        return accionCartaEspecial(jugador, casilla.carta, this.jugadores);
      case "inicio":
        return accionInicio(jugador);
      case "parqueLibre":
        return accionParqueLibre();
      default:
        return { tipo: "sinAccion" };
    }
  }

  // Cambiar al siguiente jugador
  siguienteTurno() {
    this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
    return this.jugadores[this.turnoActual];
  }

  // Finalizar juego y calcular ranking
  finalizarJuego() {
    this.estado = "FINALIZADO";
    this.ranking = this.jugadores.map(j => {
      let patrimonio = j.dinero;

      // Propiedades activas
      j.propiedades.forEach(p => {
        patrimonio += p.price;
        patrimonio += (p.casas || 0) * 100;
        patrimonio += (p.hotel ? 250 : 0);
      });
      // Propiedades hipotecadas NO suman al patrimonio
      return {
        nickname: j.nickname,
        pais: j.pais,
        score: patrimonio
      };
    }).sort((a, b) => b.score - a.score);

    return this.ranking;
  }
}