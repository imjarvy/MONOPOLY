/**
 * Modal de Información del Jugador
 * Muestra información detallada sobre las propiedades, dinero y estadísticas del jugador
 */

/**
 * Muestra el modal con información completa de un jugador específico
 * @param {string} jugadorId - ID del jugador del cual mostrar información
 */
async function mostrarModalInfoJugador(jugadorId) {
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

  // Obtener datos adicionales necesarios
  const datosTablero = await obtenerDatosTablero();
  const nombreCasilla = await obtenerNombreCasilla(jugador.posicion || 0);
  
  const contenido = await crearContenidoModal(jugador, jugadores, datosTablero, nombreCasilla);
  
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
async function crearContenidoModal(jugador, todosJugadores, datosTablero, nombreCasilla) {
  const propiedadesAgrupadas = agruparPropiedadesPorColor(jugador.propiedades || []);
  const estadisticas = calcularEstadisticas(jugador);
  const desempeño = calcularDesempeño(jugador, todosJugadores);
  const oportunidades = calcularOportunidades(jugador, todosJugadores, datosTablero);
  const ranking = calcularRanking(jugador, todosJugadores);
  
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
            <div class="ranking-badge">🏆 Puesto ${ranking.posicion}° de ${todosJugadores.length}</div>
          </div>
        </div>
        <div class="jugador-wealth">
          <div class="wealth-amount">$${jugador.dinero.toLocaleString()}</div>
          <div class="wealth-label">Efectivo</div>
          <div class="wealth-total">$${estadisticas.valorTotal.toLocaleString()} total</div>
        </div>
      </div>

      <!-- Estadísticas principales -->
      <div class="stats-section">
        <h4 class="section-title">📊 Estadísticas del Imperio</h4>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🏠</div>
            <div class="stat-info">
              <div class="stat-number">${estadisticas.totalPropiedades}</div>
              <div class="stat-label">Propiedades</div>
              <div class="stat-subtitle">${Math.round((estadisticas.totalPropiedades / 28) * 100)}% del tablero</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏗️</div>
            <div class="stat-info">
              <div class="stat-number">${estadisticas.totalConstrucciones}</div>
              <div class="stat-label">Construcciones</div>
              <div class="stat-subtitle">${estadisticas.hoteles} hoteles</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">�</div>
            <div class="stat-info">
              <div class="stat-number">${estadisticas.monopolios}</div>
              <div class="stat-label">Monopolios</div>
              <div class="stat-subtitle">${oportunidades.monopoliosCompletables} completables</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💎</div>
            <div class="stat-info">
              <div class="stat-number">$${estadisticas.rentaPotencial.toLocaleString()}</div>
              <div class="stat-label">Renta/Turno</div>
              <div class="stat-subtitle">Potencial máximo</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desempeño avanzado -->
      <div class="performance-section">
        <h4 class="section-title">⚡ Análisis de Desempeño</h4>
        <div class="performance-grid">
          <div class="performance-card liquidity-${desempeño.liquidez.nivel}">
            <div class="performance-header">
              <span class="performance-icon">💰</span>
              <span class="performance-title">Liquidez</span>
              <span class="performance-level">${desempeño.liquidez.etiqueta}</span>
            </div>
            <div class="performance-desc">${desempeño.liquidez.descripcion}</div>
            <div class="performance-bar">
              <div class="performance-fill" style="width: ${desempeño.liquidez.porcentaje}%"></div>
            </div>
          </div>
          <div class="performance-card">
            <div class="performance-header">
              <span class="performance-icon">📈</span>
              <span class="performance-title">ROI Promedio</span>
              <span class="performance-level">${desempeño.roi.toFixed(1)}%</span>
            </div>
            <div class="performance-desc">Retorno sobre inversión</div>
          </div>
          <div class="performance-card">
            <div class="performance-header">
              <span class="performance-icon">🎯</span>
              <span class="performance-title">Eficiencia</span>
              <span class="performance-level">${desempeño.eficiencia}%</span>
            </div>
            <div class="performance-desc">Propiedades desarrolladas</div>
          </div>
        </div>
      </div>

      <!-- Oportunidades estratégicas -->
      ${oportunidades.monopoliosCompletables > 0 ? `
      <div class="opportunities-section">
        <h4 class="section-title">🎯 Oportunidades Estratégicas</h4>
        <div class="opportunities-grid">
          ${oportunidades.detalles.map(oportunidad => `
            <div class="opportunity-card">
              <div class="opportunity-header" style="background-color: ${oportunidad.color}">
                <span class="opportunity-name">${oportunidad.nombre}</span>
              </div>
              <div class="opportunity-body">
                <div class="opportunity-progress">
                  <span>${oportunidad.tienes}/${oportunidad.total} propiedades</span>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(oportunidad.tienes/oportunidad.total)*100}%"></div>
                  </div>
                </div>
                <div class="opportunity-missing">
                  <strong>Falta:</strong> ${oportunidad.faltan.join(', ')}
                </div>
                <div class="opportunity-potential">
                  💰 Potencial: $${oportunidad.rentaPotencial.toLocaleString()}/turno
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Propiedades por color -->
      <div class="propiedades-section">
        <h4 class="section-title">🏘️ Cartera de Propiedades</h4>
        ${propiedadesAgrupadas.length > 0 ? 
          propiedadesAgrupadas.map(grupo => crearGrupoPropiedad(grupo)).join('') :
          '<div class="no-propiedades">Este jugador no posee propiedades aún<br><span class="suggestion">💡 Considera comprar propiedades para generar ingresos pasivos</span></div>'
        }
      </div>

      <!-- Posición y estado actual -->
      <div class="posicion-section">
        <h4 class="section-title">📍 Estado Actual del Jugador</h4>
        <div class="estado-grid">
          <div class="estado-card">
            <div class="estado-icon">🎲</div>
            <div class="estado-info">
              <div class="estado-title">Posición Actual</div>
              <div class="estado-value">Casilla ${jugador.posicion || 0}</div>
              <div class="estado-subtitle">${nombreCasilla}</div>
            </div>
          </div>
          <div class="estado-card">
            <div class="estado-icon">🔄</div>
            <div class="estado-info">
              <div class="estado-title">Próximo Turno</div>
              <div class="estado-value">${obtenerEstadoTurno(jugador, todosJugadores)}</div>
              <div class="estado-subtitle">Preparación estratégica</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen estratégico -->
      <div class="strategic-summary">
        <h4 class="section-title">🧠 Análisis Estratégico AI</h4>
        <div class="strategy-card">
          <div class="strategy-recommendation">
            <strong>Recomendación:</strong> ${obtenerRecomendacionEstrategica(jugador, estadisticas, oportunidades, desempeño)}
          </div>
          <div class="strategy-tips">
            <div class="tip">💡 ${obtenerConsejoPrincipal(jugador, estadisticas)}</div>
            <div class="tip">⚠️ ${obtenerAdvertencia(desempeño, estadisticas)}</div>
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
  const casas = propiedades.reduce((total, p) => total + (p.casas || 0), 0);
  const hoteles = propiedades.reduce((total, p) => total + (p.hotel ? 1 : 0), 0);
  
  // Contar monopolios actuales
  const grupos = {};
  propiedades.forEach(prop => {
    const key = prop.color || prop.type || 'otros';
    if (!grupos[key]) grupos[key] = [];
    grupos[key].push(prop);
  });
  
  let monopolios = 0;
  Object.values(grupos).forEach(grupo => {
    if (esGrupoCompleto({propiedades: grupo, color: grupo[0]?.color, tipo: grupo[0]?.type})) {
      monopolios++;
    }
  });
  
  // Calcular renta potencial total
  const rentaPotencial = propiedades.reduce((total, p) => {
    if (p.hipotecada) return total;
    return total + calcularRentaActual(p);
  }, 0);
  
  return {
    totalPropiedades: propiedades.length,
    totalConstrucciones: casas + hoteles,
    casas: casas,
    hoteles: hoteles,
    propiedadesHipotecadas: propiedades.filter(p => p.hipotecada).length,
    monopolios: monopolios,
    rentaPotencial: rentaPotencial,
    valorTotal: jugador.dinero + propiedades.reduce((total, p) => 
      total + (p.price || p.precio || 0) + 
      ((p.casas || 0) * (p.housePrice || 50)) + 
      (p.hotel ? (p.hotelPrice || 200) : 0), 0
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
 * Calcula métricas de desempeño avanzadas
 */
function calcularDesempeño(jugador, todosJugadores) {
  const propiedades = jugador.propiedades || [];
  const dineroTotal = jugador.dinero;
  const activosTotal = propiedades.reduce((total, p) => total + (p.price || p.precio || 0), 0);
  const patrimonioTotal = dineroTotal + activosTotal;
  
  // Liquidez: porcentaje de dinero vs patrimonio total
  const porcentajeLiquidez = patrimonioTotal > 0 ? (dineroTotal / patrimonioTotal) * 100 : 0;
  let liquidez = {
    porcentaje: porcentajeLiquidez,
    nivel: porcentajeLiquidez > 40 ? 'high' : porcentajeLiquidez > 20 ? 'medium' : 'low',
    etiqueta: porcentajeLiquidez > 40 ? 'Alta' : porcentajeLiquidez > 20 ? 'Media' : 'Baja',
    descripcion: porcentajeLiquidez > 40 ? 'Excelente flexibilidad financiera' : 
                 porcentajeLiquidez > 20 ? 'Liquidez moderada para emergencias' : 
                 'Riesgo alto - considera vender activos'
  };
  
  // ROI promedio
  const inversionTotal = propiedades.reduce((total, p) => 
    total + (p.price || p.precio || 0) + ((p.casas || 0) * 50) + (p.hotel ? 200 : 0), 0);
  const rentaTotal = propiedades.reduce((total, p) => total + calcularRentaActual(p), 0);
  const roi = inversionTotal > 0 ? (rentaTotal * 10 / inversionTotal) * 100 : 0; // ROI anualizado aproximado
  
  // Eficiencia: propiedades desarrolladas
  const propiedadesDesarrolladas = propiedades.filter(p => p.casas > 0 || p.hotel).length;
  const eficiencia = propiedades.length > 0 ? (propiedadesDesarrolladas / propiedades.length) * 100 : 0;
  
  return {
    liquidez,
    roi,
    eficiencia: Math.round(eficiencia)
  };
}

/**
 * Calcula oportunidades estratégicas disponibles
 */
function calcularOportunidades(jugador, todosJugadores, datosTablero) {
  if (!datosTablero) {
    return { monopoliosCompletables: 0, detalles: [] };
  }
  
  const propiedadesJugador = jugador.propiedades || [];
  const todasPropiedades = [];
  
  // Recopilar todas las propiedades del tablero
  ['bottom', 'left', 'top', 'right'].forEach(lado => {
    if (datosTablero[lado]) {
      datosTablero[lado].forEach(casilla => {
        if (casilla.type === 'property' || casilla.type === 'railroad' || casilla.type === 'utility') {
          todasPropiedades.push(casilla);
        }
      });
    }
  });
  
  // Agrupar por color
  const gruposPorColor = {};
  todasPropiedades.forEach(prop => {
    const key = prop.color || prop.type || 'otros';
    if (!gruposPorColor[key]) {
      gruposPorColor[key] = {
        color: prop.color || '#666',
        nombre: obtenerNombreGrupo(prop.color, prop.type),
        propiedades: [],
        tipo: prop.type
      };
    }
    gruposPorColor[key].propiedades.push(prop);
  });
  
  const oportunidades = [];
  
  Object.values(gruposPorColor).forEach(grupo => {
    const propiedadesDelJugador = propiedadesJugador.filter(pj => 
      (pj.color === grupo.color) || (pj.type === grupo.tipo && grupo.tipo !== 'property')
    );
    
    if (propiedadesDelJugador.length > 0 && propiedadesDelJugador.length < grupo.propiedades.length) {
      const propiedadesFaltantes = grupo.propiedades.filter(gp => 
        !propiedadesDelJugador.some(pj => pj.name === gp.name || pj.nombre === gp.name)
      );
      
      const rentaPotencial = grupo.propiedades.reduce((total, p) => 
        total + (p.rent?.withHotel || p.rent?.base || 0), 0);
      
      oportunidades.push({
        color: grupo.color,
        nombre: grupo.nombre,
        tienes: propiedadesDelJugador.length,
        total: grupo.propiedades.length,
        faltan: propiedadesFaltantes.map(p => p.name).slice(0, 3), // Máximo 3 para no saturar
        rentaPotencial: rentaPotencial
      });
    }
  });
  
  return {
    monopoliosCompletables: oportunidades.length,
    detalles: oportunidades.slice(0, 4) // Máximo 4 oportunidades mostradas
  };
}

/**
 * Calcula el ranking del jugador
 */
function calcularRanking(jugador, todosJugadores) {
  const jugadoresOrdenados = [...todosJugadores].sort((a, b) => {
    const patrimonioA = a.dinero + (a.propiedades || []).reduce((total, p) => total + (p.price || p.precio || 0), 0);
    const patrimonioB = b.dinero + (b.propiedades || []).reduce((total, p) => total + (p.price || p.precio || 0), 0);
    return patrimonioB - patrimonioA;
  });
  
  const posicion = jugadoresOrdenados.findIndex(j => j.id === jugador.id) + 1;
  
  return {
    posicion,
    total: todosJugadores.length
  };
}

/**
 * Obtiene el estado del turno del jugador
 */
function obtenerEstadoTurno(jugador, todosJugadores) {
  const turnoActual = localStorage.getItem('turnoActual');
  if (turnoActual !== null) {
    const indexTurnoActual = parseInt(turnoActual);
    const indexJugador = todosJugadores.findIndex(j => j.id === jugador.id);
    
    if (indexJugador === indexTurnoActual) {
      return "Es tu turno";
    } else {
      const diferencia = (indexJugador - indexTurnoActual + todosJugadores.length) % todosJugadores.length;
      return diferencia === 1 ? "Próximo turno" : `En ${diferencia} turnos`;
    }
  }
  return "Pendiente";
}

/**
 * Genera recomendación estratégica usando IA
 */
function obtenerRecomendacionEstrategica(jugador, stats, oportunidades, desempeño) {
  if (stats.monopolios > 0) {
    return "Desarrolla tus monopolios con casas y hoteles para maximizar las rentas";
  } else if (oportunidades.monopoliosCompletables > 0) {
    return `Enfócate en completar monopolios. Tienes ${oportunidades.monopoliosCompletables} oportunidades pendientes`;
  } else if (desempeño.liquidez.nivel === 'low') {
    return "Considera hipotecar propiedades para mantener liquidez y aprovechar oportunidades";
  } else if (stats.totalPropiedades < 3) {
    return "Agresivo: Compra más propiedades para construir tu imperio inmobiliario";
  } else {
    return "Mantén el equilibrio entre liquidez y desarrollo de propiedades";
  }
}

/**
 * Genera consejo principal
 */
function obtenerConsejoPrincipal(jugador, stats) {
  if (stats.totalPropiedades === 0) {
    return "Empieza comprando propiedades en esquinas frecuentadas";
  } else if (stats.monopolios === 0) {
    return "Busca intercambios para formar tu primer monopolio";
  } else {
    return "Diversifica tu cartera para reducir riesgos";
  }
}

/**
 * Genera advertencia basada en el desempeño
 */
function obtenerAdvertencia(desempeño, stats) {
  if (desempeño.liquidez.nivel === 'low') {
    return "Liquidez baja: riesgo de no poder pagar rentas altas";
  } else if (desempeño.eficiencia < 30) {
    return "Propiedades sin desarrollar: estás perdiendo potencial de ingresos";
  } else if (stats.propiedadesHipotecadas > stats.totalPropiedades * 0.5) {
    return "Demasiadas hipotecas: limita tu capacidad de generar rentas";
  } else {
    return "Buen equilibrio financiero: mantén esta estrategia";
  }
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
    
    .ranking-badge {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: bold;
      margin-top: 4px;
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
    
    .wealth-total {
      color: #059669;
      font-size: 0.9rem;
      font-weight: 600;
      margin-top: 2px;
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
    
    .stat-subtitle {
      font-size: 0.7rem;
      color: #059669;
      font-weight: 500;
      margin-top: 2px;
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
    
    .suggestion {
      color: #059669;
      font-weight: 500;
      font-style: normal;
      font-size: 0.9rem;
    }
    
    /* Sección de Desempeño */
    .performance-section {
      margin: 25px 0;
    }
    
    .performance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .performance-card {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .performance-card.liquidity-high {
      border-left: 4px solid #10b981;
    }
    
    .performance-card.liquidity-medium {
      border-left: 4px solid #f59e0b;
    }
    
    .performance-card.liquidity-low {
      border-left: 4px solid #ef4444;
    }
    
    .performance-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .performance-icon {
      font-size: 1.2rem;
    }
    
    .performance-title {
      font-weight: 600;
      color: #374151;
      flex: 1;
    }
    
    .performance-level {
      font-weight: bold;
      color: #059669;
    }
    
    .performance-desc {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 10px;
    }
    
    .performance-bar {
      width: 100%;
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .performance-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      transition: width 0.3s ease;
    }
    
    /* Sección de Oportunidades */
    .opportunities-section {
      margin: 25px 0;
    }
    
    .opportunities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 15px;
    }
    
    .opportunity-card {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .opportunity-header {
      color: white;
      padding: 12px 16px;
      font-weight: 600;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .opportunity-body {
      padding: 16px;
    }
    
    .opportunity-progress {
      margin-bottom: 12px;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 6px;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      transition: width 0.3s ease;
    }
    
    .opportunity-missing {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 8px;
    }
    
    .opportunity-potential {
      color: #059669;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    /* Estado actual */
    .estado-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    
    .estado-card {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .estado-icon {
      font-size: 2rem;
      opacity: 0.8;
    }
    
    .estado-info {
      flex: 1;
    }
    
    .estado-title {
      font-size: 0.85rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .estado-value {
      font-size: 1.1rem;
      font-weight: bold;
      color: #333;
      margin: 4px 0;
    }
    
    .estado-subtitle {
      font-size: 0.8rem;
      color: #059669;
    }
    
    /* Análisis Estratégico */
    .strategic-summary {
      margin-top: 25px;
    }
    
    .strategy-card {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #0284c7;
      border-left: 4px solid #0284c7;
    }
    
    .strategy-recommendation {
      font-size: 1rem;
      color: #0c4a6e;
      margin-bottom: 15px;
      line-height: 1.5;
    }
    
    .strategy-tips {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .tip {
      font-size: 0.9rem;
      color: #374151;
      background: rgba(255, 255, 255, 0.6);
      padding: 10px 12px;
      border-radius: 8px;
      border-left: 3px solid #10b981;
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