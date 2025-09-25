/**
 * Renderiza el panel visual de jugadores.
 * Muestra dinero, propiedades, hipotecas y resalta el jugador activo.
 * @param {Array} jugadores - Lista de jugadores
 * @param {number} turnoActual - Índice del jugador activo
 */
export function renderizarPanelJugadores(jugadores, turnoActual) {
  const panel = document.getElementById('panel-jugadores');
  panel.innerHTML = jugadores.map((jugador, idx) => `
    <div class="panel-jugador${turnoActual === idx ? ' activo' : ''}">
      <div><strong>${jugador.nickname}</strong> (${jugador.pais})</div>
      <div>Dinero: $${jugador.dinero}</div>
      <div>Propiedades: ${jugador.propiedades.map(p => `<span style="color:${p.color}">${p.nombre}</span>`).join(', ')}</div>
      <div>Hipotecas: ${jugador.hipotecas?.length ? jugador.hipotecas.join(', ') : 'Ninguna'}</div>
    </div>
  `).join('');
}