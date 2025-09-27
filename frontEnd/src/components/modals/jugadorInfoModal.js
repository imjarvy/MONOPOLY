/**
 * Modal de Información del Jugador
 * Muestra información detallada sobre las propiedades, dinero y estadísticas del jugador
 */

/**
 * Muestra el modal con información completa de un jugador específico
 * @param {string} jugadorId - ID del jugador del cual mostrar información
 */
function mostrarModalInfoJugador(jugadorId) {
  // Obtener información del jugador
  const jugadores = obtenerJugadoresActuales();
  const jugador = jugadores.find(j => j.id.toString() === jugadorId);
  
  if (!jugador) {
    console.error('Jugador no encontrado:', jugadorId);
    if (window.Toast) {
      window.Toast.error('No se pudo cargar la información del jugador', 'Error');
    }
    return;
  }

  const contenido = crearContenidoModal(jugador);
  
  // Mostrar el modal usando el sistema existente
  window.Modal.show(contenido, {
    title: `${jugador.ficha} ${jugador.nickname}`,
    size: 'lg',
    closeOnOverlay: true,
    customStyles: obtenerEstilosModal()
  });
}

/**
 * Crea el contenido HTML del modal con toda la información del jugador
 */
function crearContenidoModal(jugador) {
  const propiedadesAgrupadas = agruparPropiedadesPorColor(jugador.propiedades || []);
  const estadisticas = calcularEstadisticas(jugador);
  
  return `
    <div class="jugador-modal-container">
      <!-- Header del jugador -->
      <div class="jugador-modal-header" style="border-left-color: ${jugador.color};">
        <div class="jugador-avatar">
          <div class="avatar-ficha" style="background-color: ${jugador.color};">
            ${jugador.ficha}
          </div>
          <div class="avatar-info">
            <h3 class="jugador-name">${jugador.nickname}</h3>
            <div class="jugador-country">${obtenerNombrePais(jugador.pais)}</div>
          </div>
        </div>
        <div class="jugador-wealth">
          <div class="wealth-amount">$${jugador.dinero}</div>
          <div class="wealth-label">Patrimonio</div>
        </div>
      </div>

      <!-- Estadísticas principales -->
      <div class="stats-section">
        <h4 class="section-title">📊 Estadísticas</h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🏠</div>
            <div class="stat-info">
              <div class="stat-number">${estadisticas.totalPropiedades}</div>
              <div class="stat-label">Propiedades</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏗️</div>
            <div class="stat-info">
              <div class="stat-number">${estadisticas.totalConstrucciones}</div>
              <div class="stat-label">Construcciones</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏦</div>
            <div class="stat-info">
              <div class="stat-number">${estadisticas.propiedadesHipotecadas}</div>
              <div class="stat-label">Hipotecadas</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💎</div>
            <div class="stat-info">
              <div class="stat-number">$${estadisticas.valorTotal}</div>
              <div class="stat-label">Valor Total</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Propiedades por color -->
      <div class="propiedades-section">
        <h4 class="section-title">🏘️ Propiedades</h4>
        ${propiedadesAgrupadas.length > 0 ? 
          propiedadesAgrupadas.map(grupo => crearGrupoPropiedad(grupo)).join('') :
          '<div class="no-propiedades">Este jugador no posee propiedades aún</div>'
        }
      </div>

      <!-- Posición actual -->
      <div class="posicion-section">
        <h4 class="section-title">📍 Posición Actual</h4>
        <div class="posicion-info">
          <div class="posicion-casilla">
            <span class="casilla-numero">Casilla ${jugador.posicion || 0}</span>
            <span class="casilla-nombre">${obtenerNombreCasilla(jugador.posicion || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Agrupa las propiedades del jugador por color/tipo
 */
function agruparPropiedadesPorColor(propiedades) {
  const grupos = {};
  
  propiedades.forEach(propiedad => {
    const key = propiedad.color || propiedad.type || 'otros';
    if (!grupos[key]) {
      grupos[key] = {
        color: propiedad.color || '#666',
        tipo: propiedad.type || 'property',
        propiedades: []
      };
    }
    grupos[key].propiedades.push(propiedad);
  });

  return Object.values(grupos);
}

/**
 * Crea el HTML para un grupo de propiedades del mismo color
 */
function crearGrupoPropiedad(grupo) {
  const esMonopolio = esGrupoCompleto(grupo);
  
  return `
    <div class="propiedad-grupo ${esMonopolio ? 'monopolio-completo' : ''}">
      <div class="grupo-header" style="background-color: ${grupo.color};">
        <div class="grupo-info">
          <span class="grupo-nombre">${obtenerNombreGrupo(grupo.color, grupo.tipo)}</span>
          ${esMonopolio ? '<span class="monopolio-badge">🏆 MONOPOLIO</span>' : ''}
        </div>
        <span class="grupo-count">${grupo.propiedades.length} propiedades</span>
      </div>
      <div class="propiedades-lista">
        ${grupo.propiedades.map(propiedad => crearTarjetaPropiedad(propiedad)).join('')}
      </div>
    </div>
  `;
}

/**
 * Crea una tarjeta individual de propiedad
 */
function crearTarjetaPropiedad(propiedad) {
  return `
    <div class="propiedad-tarjeta ${propiedad.hipotecada ? 'hipotecada' : ''}">
      <div class="propiedad-nombre">${propiedad.name || propiedad.nombre}</div>
      <div class="propiedad-detalles">
        ${propiedad.hipotecada ? 
          '<span class="estado-hipoteca">🏦 Hipotecada</span>' :
          `
          <div class="propiedad-construcciones">
            ${propiedad.hotel ? '🏨 Hotel' : 
              propiedad.casas > 0 ? `🏠 ${propiedad.casas} casa${propiedad.casas > 1 ? 's' : ''}` :
              '📋 Sin construcciones'
            }
          </div>
          <div class="propiedad-renta">
            Renta: $${calcularRentaActual(propiedad)}
          </div>
          `
        }
        <div class="propiedad-valor">
          Valor: $${propiedad.price || propiedad.precio || 0}
        </div>
      </div>
    </div>
  `;
}

/**
 * Calcula estadísticas del jugador
 */
function calcularEstadisticas(jugador) {
  const propiedades = jugador.propiedades || [];
  
  return {
    totalPropiedades: propiedades.length,
    totalConstrucciones: propiedades.reduce((total, p) => 
      total + (p.casas || 0) + (p.hotel ? 1 : 0), 0
    ),
    propiedadesHipotecadas: propiedades.filter(p => p.hipotecada).length,
    valorTotal: jugador.dinero + propiedades.reduce((total, p) => 
      total + (p.price || p.precio || 0) + 
      ((p.casas || 0) * (p.housePrice || 0)) + 
      (p.hotel ? (p.hotelPrice || 0) : 0), 0
    )
  };
}

/**
 * Funciones auxiliares
 */
function obtenerNombrePais(codigoPais) {
  // Mapeo básico de códigos de país a nombres
  const paises = {
    'co': 'Colombia',
    'mx': 'México', 
    'ar': 'Argentina',
    'es': 'España',
    'cl': 'Chile',
    'br': 'Brasil',
    'us': 'Estados Unidos',
    'ca': 'Canadá',
    'pe': 'Perú',
    'ec': 'Ecuador',
    'uy': 'Uruguay'
  };
  return paises[codigoPais] || codigoPais.toUpperCase();
}

function obtenerNombrePais(codigoPais) {
  // Mapeo básico de códigos de país a nombres
  const paises = {
    'co': 'Colombia',
    'mx': 'México', 
    'ar': 'Argentina',
    'es': 'España',
    'cl': 'Chile',
    'br': 'Brasil',
    'us': 'Estados Unidos',
    'ca': 'Canadá',
    'pe': 'Perú',
    'ec': 'Ecuador',
    'uy': 'Uruguay',
    'au': 'Australia',
    'bb': 'Barbados',
    'ax': 'Åland Islands'
  };
  return paises[codigoPais] || codigoPais.toUpperCase();
}

async function obtenerNombreCasilla(posicion) {
  // Obtener información de la casilla actual
  try {
    const boardData = await obtenerDatosTablero();
    if (boardData) {
      // El tablero está organizado en: bottom, left, top, right
      // Posición 0-9: bottom, 10-19: left, 20-29: top, 30-39: right
      let casilla = null;
      
      if (posicion >= 0 && posicion <= 9) {
        casilla = boardData.bottom[posicion];
      } else if (posicion >= 10 && posicion <= 19) {
        casilla = boardData.left[posicion - 10];
      } else if (posicion >= 20 && posicion <= 29) {
        casilla = boardData.top[posicion - 20];
      } else if (posicion >= 30 && posicion <= 39) {
        casilla = boardData.right[posicion - 30];
      }
      
      return casilla?.name || `Casilla ${posicion}`;
    }
  } catch (error) {
    console.warn('No se pudo obtener nombre de casilla:', error);
  }
  
  return `Casilla ${posicion}`;
}

function obtenerNombreGrupo(color, tipo) {
  const grupos = {
    'brown': 'Marrón',
    'purple': 'Púrpura', 
    'lightblue': 'Celeste',
    'pink': 'Rosa',
    'orange': 'Naranja', 
    'red': 'Rojo',
    'yellow': 'Amarillo',
    'green': 'Verde',
    'darkblue': 'Azul Oscuro',
    '#8b4513': 'Marrón',
    '#740970': 'Púrpura',
    '#ff69b4': 'Rosa',
    '#ffa500': 'Naranja', 
    '#ff0000': 'Rojo',
    '#ffff00': 'Amarillo',
    '#008000': 'Verde',
    '#0000ff': 'Azul'
  };
  
  if (tipo === 'railroad') return 'Ferrocarriles';
  if (tipo === 'utility') return 'Servicios Públicos';
  
  return grupos[color] || 'Otras Propiedades';
}

function esGrupoCompleto(grupo) {
  // Verificar si el jugador tiene monopolio de este color
  // Cantidades reales según el Monopoly estándar
  const propiedadesPorColor = {
    'brown': 2,
    'purple': 2,  
    'lightblue': 3,
    'pink': 3,
    'orange': 3,
    'red': 3,
    'yellow': 3,
    'green': 3,
    'darkblue': 2,
    // Compatibilidad con códigos hex
    '#8b4513': 2,
    '#740970': 2,
    '#87ceeb': 3,
    '#ff69b4': 3,
    '#ffa500': 3,
    '#ff0000': 3,
    '#ffff00': 3,
    '#008000': 3,
    '#000080': 2
  };
  
  if (grupo.tipo === 'railroad') return grupo.propiedades.length === 4;
  if (grupo.tipo === 'utility') return grupo.propiedades.length === 2;
  
  return grupo.propiedades.length === (propiedadesPorColor[grupo.color] || 3);
}

function calcularRentaActual(propiedad) {
  // Calcular la renta actual de la propiedad
  if (propiedad.hipotecada) return 0;
  
  if (propiedad.hotel && propiedad.rent?.withHotel) {
    return propiedad.rent.withHotel;
  }
  
  if (propiedad.casas > 0 && propiedad.rent?.withHouse) {
    return propiedad.rent.withHouse[propiedad.casas - 1] || 0;
  }
  
  return propiedad.rent?.base || propiedad.rent?.['1'] || 0;
}

/**
 * Obtiene los estilos CSS para el modal
 */
function obtenerEstilosModal() {
  return `
    .jugador-modal-container {
      width: 100%;
      max-width: 100%;
      margin: 0;
    }
    
    .jugador-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 25px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 8px;
      border-left: 5px solid;
      margin-bottom: 20px;
    }
    
    .jugador-avatar {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .avatar-ficha {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
      font-weight: bold;
      border: 3px solid white;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .jugador-name {
      margin: 0;
      font-size: 1.4rem;
      color: #333;
    }
    
    .jugador-country {
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
    }
    
    .jugador-wealth {
      text-align: right;
      min-width: 120px;
    }
    
    .wealth-amount {
      font-size: 2.2rem;
      font-weight: bold;
      color: #10b981;
      margin: 0;
      line-height: 1;
    }
    
    .wealth-label {
      color: #666;
      font-size: 0.85rem;
    }
    
    .section-title {
      font-size: 1.1rem;
      color: #374151;
      margin: 20px 0 12px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }
    
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
    }
    
    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }
    }
    
    .stat-card {
      background: #fff;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: transform 0.2s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .stat-icon {
      font-size: 1.8rem;
    }
    
    .stat-number {
      font-size: 1.4rem;
      font-weight: bold;
      color: #333;
      margin: 0;
    }
    
    .stat-label {
      font-size: 0.8rem;
      color: #666;
    }
    
    .propiedad-grupo {
      margin-bottom: 20px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      width: 100%;
    }
    
    .monopolio-completo {
      border-color: #fbbf24;
      box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.2);
    }
    
    .grupo-header {
      color: white;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }
    
    .grupo-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .monopolio-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: bold;
    }
    
    .propiedades-lista {
      padding: 20px;
      background: #fff;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
    }
    
    @media (max-width: 768px) {
      .propiedades-lista {
        grid-template-columns: 1fr;
        padding: 15px;
      }
    }
    
    .propiedad-tarjeta {
      background: #f8f9fa;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 0;
      border: 1px solid #e5e7eb;
      min-height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .propiedad-tarjeta.hipotecada {
      background: #fef3c7;
      border-color: #f59e0b;
    }
    
    .propiedad-nombre {
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }
    
    .propiedad-detalles {
      font-size: 0.85rem;
      color: #666;
    }
    
    .estado-hipoteca {
      color: #f59e0b;
      font-weight: bold;
    }
    
    .posicion-info {
      background: #fff;
      padding: 20px 25px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      text-align: center;
    }
    
    .posicion-casilla {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    
    @media (min-width: 768px) {
      .posicion-casilla {
        flex-direction: row;
        justify-content: space-between;
        gap: 0;
      }
    }
    
    .casilla-numero {
      font-weight: bold;
      color: #333;
      font-size: 1.1rem;
    }
    
    .casilla-nombre {
      color: #666;
      font-size: 1rem;
    }
    
    /* Responsive improvements */
    @media (max-width: 640px) {
      .jugador-modal-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
        padding: 20px;
      }
      
      .jugador-avatar {
        justify-content: center;
      }
      
      .jugador-wealth {
        text-align: center;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .wealth-amount {
        font-size: 1.8rem;
      }
    }
    
    .no-propiedades {
      text-align: center;
      color: #666;
      padding: 40px 20px;
      background: #f8f9fa;
      border-radius: 8px;
      font-style: italic;
      font-size: 1.1rem;
    }
  `;
}

/**
 * Funciones auxiliares para obtener datos del juego
 */
function obtenerJugadoresActuales() {
  // Prioridad a window.jugadores (estado activo)
  if (typeof window.jugadores !== 'undefined' && Array.isArray(window.jugadores)) {
    return window.jugadores;
  }
  
  // Fallback a localStorage si no hay en window
  try {
    const jugadoresLS = localStorage.getItem('jugadores');
    if (jugadoresLS) {
      return JSON.parse(jugadoresLS);
    }
  } catch (error) {
    console.error('Error al leer jugadores de localStorage:', error);
  }
  
  // Fallback vacío
  return [];
}

async function obtenerDatosTablero() {
  // Intentar obtener tablero desde el sistema existente
  if (typeof window.boardData !== 'undefined') {
    return window.boardData;
  }
  
  // Fallback para obtener los datos usando boardService
  try {
    const { getBoard } = await import('../../services/boardService.js');
    return await getBoard();
  } catch (error) {
    console.warn('No se pudo cargar datos del tablero:', error);
    return null;
  }
}

// Hacer la función disponible globalmente
window.mostrarModalInfoJugador = mostrarModalInfoJugador;