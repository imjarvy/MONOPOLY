import {
  accionCartaEspecial,
  accionFerrocarril,
  accionInicio,
  accionIrCarcel,
  accionPagarImpuesto,
  accionParqueLibre,
  accionPropiedad,
  accionServicio
} from './acciones.js';
import { abrirModal } from './components/modalAccion.js';

export class Juego {
  constructor(jugadores, tablero) {
    this.jugadores = jugadores;
    this.tablero = tablero;
    this.turnoActual = 0;
    this.dados = [0, 0];
    this.estado = "EN_CURSO";
    this.ranking = [];
    this.historial = [];
  }

  // Mover jugador según los dados
  moverJugador(jugador) {
    const pasos = this.dados[0] + this.dados[1];
    const posicionAnterior = jugador.posicion;
    jugador.posicion = (jugador.posicion + pasos) % this.tablero.length;
    // Si pasó por la salida (casilla 0), cobra
    if (jugador.posicion < posicionAnterior) {
      accionInicio(jugador, 200);
    }
    return jugador.posicion;
  }

  // Ejecutar acción de la casilla usando el modalAccion
  ejecutarAccion(jugador) {
    const casilla = this.tablero[jugador.posicion];
    abrirModal(jugador, casilla, this.jugadores, this.dados); 
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
      j.propiedades.forEach(p => {
        patrimonio += p.price;
        patrimonio += (p.casas || 0) * 100;
        patrimonio += (p.hotel ? 250 : 0);
      });
      return {
        nickname: j.nickname,
        pais: j.pais,
        score: patrimonio
      };
    }).sort((a, b) => b.score - a.score);
    return this.ranking;
  }
}
