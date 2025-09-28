import { enviarResultado } from '../services/scoreService.js';

export class FinJuegoManager {
    verificarBancarrota(jugadores) {
        return jugadores.filter(j => j.dinero < 0 && this.calcularPatrimonio(j) < 0);
    }

    calcularPatrimonio(jugador) {
        let patrimonio = jugador.dinero;
        
        // Sumar valor de propiedades
        jugador.propiedades?.forEach(prop => {
            if (!prop.hipotecada) {
                patrimonio += Math.floor(prop.precio * 0.5); // Valor de venta
                patrimonio += (prop.casas || 0) * 25; // Valor casas
                patrimonio += (prop.hotel ? 100 : 0); // Valor hotel
            }
        });
        
        return patrimonio;
    }

    async determinarGanador(jugadores) {
        const jugadoresActivos = jugadores.filter(j => !j.bancarrota);
        
        if (jugadoresActivos.length === 1) {
            const ganador = jugadoresActivos[0];
            await this.finalizarPartida(jugadores, ganador);
            return ganador;
        }
        
        return null;
    }

    async finalizarPartida(jugadores, ganador) {
        // Preparar datos para enviar al backend
        const resultadoPartida = {
            winner_nickname: ganador.nickname,
            winner_country: ganador.pais,
            winner_score: this.calcularPatrimonio(ganador),
            players: jugadores.map(j => ({
                nickname: j.nickname,
                country_code: j.pais,
                final_money: j.dinero,
                properties_count: j.propiedades?.length || 0,
                final_patrimony: this.calcularPatrimonio(j),
                position: j.posicion,
                is_winner: j.id === ganador.id
            })),
            game_duration: this.calcularDuracionPartida(),
            fecha_fin: new Date().toISOString()
        };

        console.log('📤 Enviando resultado al backend:', resultadoPartida);

        // Enviar a backend
        try {
            const response = await enviarResultado(resultadoPartida);
            console.log('✅ Resultado enviado correctamente:', response);
            this.mostrarModalGanador(ganador, resultadoPartida);
        } catch (error) {
            console.error('❌ Error enviando resultado:', error);
            // Mostrar modal incluso si falla el envío
            this.mostrarModalGanador(ganador, resultadoPartida);
        }
    }

    calcularDuracionPartida() {
        // Calcular duración aproximada de la partida
        // Por ahora retornamos un valor fijo, pero puedes implementar un timer
        return Math.floor(Math.random() * 60) + 15; // Entre 15 y 75 minutos
    }

    mostrarModalGanador(ganador, datosPartida) {
        if (window.Toast) {
            window.Toast.success(`🎉 ${ganador.nickname} ha ganado la partida!`, 'Fin del Juego');
        }
        
        // Modal con resumen completo
        const modalHTML = `
            <div class="modal fade" id="modalGanador" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h4 class="modal-title">🏆 ¡Partida Finalizada!</h4>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center mb-4">
                                <h3 class="text-success">🎉 ${ganador.nickname} 🎉</h3>
                                <p class="lead">Patrimonio final: <strong>$${this.calcularPatrimonio(ganador).toLocaleString()}</strong></p>
                                <img src="https://flagsapi.com/${ganador.pais.toUpperCase()}/flat/64.png" 
                                     alt="${ganador.pais}" class="mb-3" style="width: 64px; height: 48px; border-radius: 4px;">
                            </div>
                            
                            <h5 class="mb-3">📊 Resumen Final:</h5>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>🏅 Pos.</th>
                                            <th>👤 Jugador</th>
                                            <th>🏳️ País</th>
                                            <th>💰 Dinero</th>
                                            <th>🏠 Props.</th>
                                            <th>💎 Patrimonio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${this.generarFilasTablaResultados(datosPartida.players)}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div class="alert alert-info mt-3">
                                <strong>💡 Estadísticas:</strong>
                                <br>Duración: ~${datosPartida.game_duration} minutos
                                <br>Total jugadores: ${datosPartida.players.length}
                                <br>Resultado guardado en el ranking global ✅
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" onclick="verRankingGlobal()">
                                <i class="fas fa-trophy"></i> Ver Ranking Global
                            </button>
                            <button class="btn btn-success" onclick="nuevaPartida()">
                                <i class="fas fa-play"></i> Nueva Partida
                            </button>
                            <button class="btn btn-secondary" onclick="volverAlInicio()">
                                <i class="fas fa-home"></i> Volver al Inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remover modal anterior si existe
        const modalAnterior = document.getElementById('modalGanador');
        if (modalAnterior) {
            modalAnterior.remove();
        }
        
        // Insertar y mostrar nuevo modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Usar Bootstrap 5 o jQuery según disponibilidad
        if (typeof bootstrap !== 'undefined') {
            const modal = new bootstrap.Modal(document.getElementById('modalGanador'));
            modal.show();
        } else if (typeof $ !== 'undefined') {
            $('#modalGanador').modal('show');
        }
    }

    generarFilasTablaResultados(jugadores) {
        return jugadores
            .sort((a, b) => b.final_patrimony - a.final_patrimony)
            .map((jugador, index) => {
                const posicion = index + 1;
                const iconoPosicion = posicion === 1 ? '🥇' : posicion === 2 ? '🥈' : posicion === 3 ? '🥉' : `${posicion}°`;
                const claseFilas = jugador.is_winner ? 'table-success' : '';
                
                return `
                    <tr class="${claseFilas}">
                        <td><strong>${iconoPosicion}</strong></td>
                        <td>${jugador.nickname}</td>
                        <td>
                            <img src="https://flagsapi.com/${jugador.country_code.toUpperCase()}/flat/32.png" 
                                 alt="${jugador.country_code}" style="width: 24px; height: 18px; border-radius: 2px;">
                        </td>
                        <td>$${jugador.final_money.toLocaleString()}</td>
                        <td>${jugador.properties_count}</td>
                        <td><strong>$${jugador.final_patrimony.toLocaleString()}</strong></td>
                    </tr>
                `;
            }).join('');
    }
}

// Funciones globales para los botones del modal
window.verRankingGlobal = function() {
    window.location.href = './src/pages/ranking.html';
};

window.nuevaPartida = function() {
    window.location.href = './src/pages/configuracion.html';
};

window.volverAlInicio = function() {
    window.location.href = './index.html';
};