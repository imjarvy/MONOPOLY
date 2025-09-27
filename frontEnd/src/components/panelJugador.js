/**
 * Componente Panel de Jugadores
 * Renderiza el panel lateral con la información de los jugadores
 */

/**
 * Renderiza el panel de jugadores en la interfaz
 * @param {Array} jugadores - Lista de jugadores con su información
 * @param {number} turnoActual - Índice del jugador que tiene el turno
 */
export function renderizarPanelJugadores(jugadores, turnoActual) {
  const panel = document.getElementById('panel-jugadores');
  if (!panel) {
    console.warn('No se encontró el elemento panel-jugadores');
    return;
  }

  panel.innerHTML = `
    <div class="panel-jugadores-container">
      <h3 class="panel-title">Jugadores</h3>
      <div class="jugadores-lista">
        ${jugadores.map((jugador, idx) => `
          <div class="jugador-item ${idx === turnoActual ? 'turno-activo' : ''}" data-jugador-id="${jugador.id}" ${idx === turnoActual ? `style="border-color: ${jugador.color}; background: linear-gradient(135deg, ${jugador.color}15, #f8f9fa);"` : ''}>
            <div class="jugador-header">
              <div class="jugador-ficha" style="background-color: ${jugador.color}">
                ${jugador.ficha}
              </div>
              <div class="jugador-info">
                <div class="jugador-nickname">${jugador.nickname}</div>
                <div class="jugador-pais">${jugador.pais}</div>
              </div>
              ${idx === turnoActual ? `<div class="turno-indicator" style="color: ${jugador.color};">🎯</div>` : ''}
            </div>
            <div class="jugador-stats">
              <div class="stat-item">
                <span class="stat-label">💰 Dinero:</span>
                <span class="stat-value">$${jugador.dinero}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">📍 Posición:</span>
                <span class="stat-value">${jugador.posicion || 0}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">🏠 Propiedades:</span>
                <span class="stat-value">${(jugador.propiedades || []).length}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Agregar estilos CSS dinámicamente si no existen
  if (!document.getElementById('panel-jugadores-styles')) {
    const styles = document.createElement('style');
    styles.id = 'panel-jugadores-styles';
    styles.textContent = `
      .panel-jugadores-container {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      .panel-title {
        text-align: center;
        margin: 0 0 15px 0;
        color: #333;
        font-size: 1.2rem;
        font-weight: 600;
      }

      .jugador-item {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 10px;
        border: 2px solid transparent;
        transition: all 0.3s ease;
      }

      .jugador-item.turno-activo {
        /* Los estilos específicos se aplicarán dinámicamente desde el HTML */
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
      }

      .jugador-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
        position: relative;
      }

      .jugador-ficha {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: white;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }

      .jugador-info {
        flex: 1;
      }

      .jugador-nickname {
        font-weight: 600;
        color: #333;
        font-size: 0.95rem;
      }

      .jugador-pais {
        font-size: 0.8rem;
        color: #666;
        text-transform: uppercase;
      }

      .turno-indicator {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 18px;
        animation: pulse 1.5s ease-in-out infinite;
        text-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
        font-weight: bold;
      }

      .jugador-stats {
        display: grid;
        grid-template-columns: 1fr;
        gap: 4px;
      }

      .stat-item {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
      }

      .stat-label {
        color: #666;
      }

      .stat-value {
        font-weight: 600;
        color: #333;
      }

      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(styles);
  }
}