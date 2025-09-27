/**
 * Helper para operaciones con jugadores (NO confundir con backend service)
 */
export class JugadorHelper {
    constructor(config) {
        this.config = config;
    }

    // ✅ SIMPLIFICADO - Solo crear con nickname
    crearJugadorVacio(nickname) {
        return {
            id: this.generarId(),
            nickname: nickname.trim(),  // ✅ Solo nickname
            ficha: this.obtenerFichaAleatoria(),
            dinero: this.config.dineroInicial,
            color: this.generarColorAleatorio(),
            pais: 'co'
        };
    }

    generarId() {
        return Date.now() + Math.random();
    }

    generarColorAleatorio() {
        return this.config.coloresDisponibles[
            Math.floor(Math.random() * this.config.coloresDisponibles.length)
        ];
    }

    obtenerFichaAleatoria() {
        const disponibles = this.config.fichasDisponibles.filter(
            ficha => !window.jugadores?.some(j => j.ficha === ficha)
        );
        return disponibles[0] || this.config.fichasDisponibles[0];
    }

    validarFichaDisponible(fichaSeleccionada, jugadorId = null) {
        return !window.jugadores?.some(j => 
            j.ficha === fichaSeleccionada && j.id !== jugadorId
        );
    }
}