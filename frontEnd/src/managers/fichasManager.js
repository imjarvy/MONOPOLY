/**
 * Manager para manejar las fichas de jugadores en el tablero
 */
export class FichasManager {
    constructor(tableroElement) {
        this.tablero = tableroElement;
    }

    actualizarFichas(jugadores, turnoActivo = 0) {
        this.limpiarFichas();
        
        jugadores.forEach((jugador, idx) => {
            this.colocarFicha(jugador, idx, turnoActivo);
        });

        console.log(`✅ Fichas actualizadas: ${jugadores.length} jugadores`);
    }

    limpiarFichas() {
        const fichasExistentes = this.tablero.querySelectorAll('.ficha-jugador');
        fichasExistentes.forEach(ficha => ficha.remove());
    }

    colocarFicha(jugador, indiceJugador, turnoActivo) {
        const posicionJugador = jugador.posicion || 0;
        const casilla = this.tablero.querySelector(`[data-position="${posicionJugador}"]`);
        
        if (!casilla) {
            console.warn(`❌ Casilla en posición ${posicionJugador} no encontrada para ${jugador.nickname}`);
            return;
        }

        const elementoFicha = this.crearElementoFicha(jugador, indiceJugador, turnoActivo);
        casilla.appendChild(elementoFicha);
    }

    crearElementoFicha(jugador, indiceJugador, turnoActivo) {
        const ficha = document.createElement('div');
        ficha.className = 'ficha-jugador';
        ficha.textContent = jugador.nickname[0];
        
        // Estilos base
        Object.assign(ficha.style, {
            background: indiceJugador === turnoActivo ? '#007bff' : '#888',
            color: '#fff',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '2px',
            fontSize: '10px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        });

        // Tooltip con info del jugador
        ficha.title = `${jugador.nickname} - $${jugador.dinero || 1500}`;

        return ficha;
    }

    moverFicha(jugadorId, nuevaPosicion) {
        // Buscar la ficha del jugador
        const fichas = this.tablero.querySelectorAll('.ficha-jugador');
        
        fichas.forEach(ficha => {
            if (ficha.title.includes(jugadorId)) {
                // Mover ficha a nueva casilla
                const nuevaCasilla = this.tablero.querySelector(`[data-position="${nuevaPosicion}"]`);
                if (nuevaCasilla) {
                    nuevaCasilla.appendChild(ficha);
                }
            }
        });
    }

    resaltarFichaActiva(turnoActivo) {
        const fichas = this.tablero.querySelectorAll('.ficha-jugador');
        
        fichas.forEach((ficha, idx) => {
            if (idx === turnoActivo) {
                ficha.style.background = '#007bff';
                ficha.style.boxShadow = '0 0 8px rgba(0, 123, 255, 0.6)';
            } else {
                ficha.style.background = '#888';
                ficha.style.boxShadow = 'none';
            }
        });
    }
}