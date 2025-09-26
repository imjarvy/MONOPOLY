/**
 * Renderiza el panel visual de jugadores.
 * Muestra dinero, propiedades, hipotecas y resalta el jugador activo.
 * @param {Array} jugadores - Lista de jugadores
 * @param {number} turnoActual - Índice del jugador activo
 */
export function renderizarPanelJugadores(jugadores, turnoActual) {
  const panel = document.getElementById('panel-jugadores');
  panel.innerHTML = '';
  
  // Título del panel
  const titulo = document.createElement('h4');
  titulo.textContent = '👥 Jugadores';
  titulo.className = 'mb-3';
  titulo.style.cssText = 'color: #333; text-align: center; font-weight: bold;';
  panel.appendChild(titulo);

  jugadores.forEach((jugador, idx) => {
    const div = document.createElement('div');
    div.className = 'panel-jugador' + (turnoActual === idx ? ' activo' : '');
    
    // Indicador visual de turno activo
    if (turnoActual === idx) {
      div.style.cssText = `
        border: 3px solid #ffd700;
        background: linear-gradient(135deg, #fff9e6, #fffbf0);
        animation: glow 2s ease-in-out infinite alternate;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
      `;
    }

    const nombre = document.createElement('div');
    nombre.innerHTML = `<strong>${jugador.nickname}</strong> (${jugador.pais})${turnoActual === idx ? ' 🎯' : ''}`;
    nombre.style.cssText = 'font-size: 16px; margin-bottom: 8px;';
    div.appendChild(nombre);

    const dinero = document.createElement('div');
    dinero.innerHTML = `💰 <strong>$${jugador.dinero.toLocaleString()}</strong>`;
    dinero.style.cssText = 'color: #28a745; font-size: 14px; margin-bottom: 8px;';
    div.appendChild(dinero);

    const posicion = document.createElement('div');
    posicion.innerHTML = `📍 Casilla: <strong>${jugador.posicion}</strong>`;
    posicion.style.cssText = 'color: #007bff; font-size: 13px; margin-bottom: 8px;';
    div.appendChild(posicion);

    // Propiedades
    const props = document.createElement('div');
    props.innerHTML = '🏠 <strong>Propiedades:</strong> ';
    const numPropiedades = (jugador.propiedades || []).length;
    if (jugador.propiedades && jugador.propiedades.length) {
      const propsList = document.createElement('div');
      propsList.style.cssText = 'margin-left: 20px; margin-top: 4px;';
      jugador.propiedades.forEach((p, index) => {
        const span = document.createElement('span');
        span.textContent = p.nombre;
        span.style.cssText = `
          color: ${p.color || '#333'};
          background: rgba(255, 255, 255, 0.8);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          margin-right: 4px;
          display: inline-block;
          margin-bottom: 2px;
        `;
        propsList.appendChild(span);
      });
      props.appendChild(propsList);
    } else {
      const ninguna = document.createElement('span');
      ninguna.textContent = 'Ninguna';
      ninguna.style.cssText = 'color: #666; font-style: italic;';
      props.appendChild(ninguna);
    }
    props.style.cssText = 'font-size: 13px; margin-bottom: 8px;';
    div.appendChild(props);

    // Hipotecas
    const hips = document.createElement('div');
    hips.innerHTML = '🏦 <strong>Hipotecas:</strong> ';
    if (jugador.hipotecas && jugador.hipotecas.length) {
      const hipsList = document.createElement('div');
      hipsList.style.cssText = 'margin-left: 20px; margin-top: 4px;';
      jugador.hipotecas.forEach(h => {
        const span = document.createElement('span');
        span.className = 'hipotecada';
        span.textContent = h;
        span.style.cssText = `
          color: #dc3545;
          background: rgba(220, 53, 69, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          margin-right: 4px;
          display: inline-block;
          margin-bottom: 2px;
          border: 1px solid rgba(220, 53, 69, 0.3);
        `;
        hipsList.appendChild(span);
      });
      hips.appendChild(hipsList);
    } else {
      const ninguna = document.createElement('span');
      ninguna.textContent = 'Ninguna';
      ninguna.style.cssText = 'color: #666; font-style: italic;';
      hips.appendChild(ninguna);
    }
    hips.style.cssText = 'font-size: 13px; margin-bottom: 8px;';
    div.appendChild(hips);

    // Agregar evento click para información del jugador
    div.addEventListener('click', () => {
      if (window.Toast) {
        const info = `
          💰 Dinero: $${jugador.dinero.toLocaleString()}
          🏠 Propiedades: ${jugador.propiedades?.length || 0}
          🏦 Hipotecas: ${jugador.hipotecas?.length || 0}
          📍 Posición: Casilla ${jugador.posicion}
        `;
        window.Toast.info(info, `Información de ${jugador.nickname}`);
      }
    });

    div.style.cssText += `
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 8px;
      border: 2px solid #e9ecef;
      background: white;
    `;

    panel.appendChild(div);
  });

  // Agregar CSS para animaciones si no existe
  if (!document.getElementById('panel-animations-css')) {
    const style = document.createElement('style');
    style.id = 'panel-animations-css';
    style.textContent = `
      @keyframes glow {
        from {
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }
        to {
          box-shadow: 0 4px 25px rgba(255, 215, 0, 0.6);
        }
      }
      .panel-jugador:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(style);
  }
}