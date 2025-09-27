/**
 * Modal de Finalización del Juego
 * Calcula patrimonio neto y envía puntajes al backend
 */

/**
 * Muestra el modal para finalizar el juego
 */
async function mostrarModalFinalizarJuego() {
  const jugadores = JSON.parse(localStorage.getItem('jugadores') || '[]');
  
  if (jugadores.length === 0) {
    if (window.Toast) {
      window.Toast.error("No hay jugadores en la partida", "Error");
    }
    return;
  }

  // Calcular patrimonio de cada jugador
  const resultados = await Promise.all(jugadores.map(calcularPatrimonio));
  
  // Ordenar por patrimonio descendente
  resultados.sort((a, b) => b.patrimonioNeto - a.patrimonioNeto);
  
  const contenido = `
    <div class="modal-finalizar-juego">
      <div class="finalizacion-header">
        <h3>🏁 Finalizar Juego</h3>
        <p>Resultados finales de la partida</p>
      </div>
      
      <div class="resultados-finales">
        <h4>📊 Ranking Final</h4>
        <div class="tabla-resultados">
          <div class="resultado-header">
            <div class="pos">Pos</div>
            <div class="jugador">Jugador</div>
            <div class="dinero">Efectivo</div>
            <div class="propiedades">Propiedades</div>
            <div class="construcciones">Construcciones</div>
            <div class="patrimonio">Patrimonio</div>
          </div>
          
          ${resultados.map((resultado, index) => `
            <div class="resultado-fila ${index === 0 ? 'ganador' : ''}">
              <div class="pos">
                ${index === 0 ? '🏆' : index + 1}
              </div>
              <div class="jugador">
                <span class="ficha">${resultado.jugador.ficha}</span>
                <div class="jugador-info">
                  <span class="nombre">${resultado.jugador.nickname}</span>
                  <small class="pais">${resultado.jugador.pais?.toUpperCase() || 'N/A'}</small>
                </div>
              </div>
              <div class="dinero">$${resultado.dinero}</div>
              <div class="propiedades">
                $${resultado.valorPropiedades}
                ${resultado.numPropiedades > 0 ? `<br><small>(${resultado.numPropiedades} props.)</small>` : ''}
              </div>
              <div class="construcciones">
                ${resultado.totalConstrucciones > 0 ? `
                  <div class="construcciones-detalle">
                    ${resultado.casas > 0 ? `🏠×${resultado.casas}` : ''}
                    ${resultado.hoteles > 0 ? `🏨×${resultado.hoteles}` : ''}
                    <br><small>+$${resultado.valorConstrucciones}</small>
                  </div>
                ` : '<small>Sin construcciones</small>'}
              </div>
              <div class="patrimonio">
                <strong>$${resultado.patrimonioNeto}</strong>
                ${resultado.valorHipotecas > 0 ? `<br><small style="color:#dc3545;">-$${resultado.valorHipotecas} hipotecas</small>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="ganador-destacado">
          <h4>🎉 ¡${resultados[0].jugador.nickname} es el ganador!</h4>
          <p>Con un patrimonio neto de <strong>$${resultados[0].patrimonioNeto}</strong></p>
          ${resultados[0].totalConstrucciones > 0 ? `
            <p><small>Incluye ${resultados[0].casas} casas y ${resultados[0].hoteles} hoteles por valor de $${resultados[0].valorConstrucciones}</small></p>
          ` : ''}
        </div>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" onclick="window.Modal.close()">
          Cancelar
        </button>
        <button type="button" class="btn btn-success" onclick="confirmarYFinalizarJuego(event); return false;" onsubmit="return false;">
          🏁 Confirmar y Finalizar
        </button>
      </div>
    </div>
  `;
  
  window.Modal.show(contenido, {
    title: "Finalización del Juego",
    size: 'xl',
    closeOnOverlay: false,
    preventAutoClose: true
  });
}

/**
 * Calcula el patrimonio neto de un jugador
 * @param {Object} jugador - Jugador a evaluar
 * @returns {Object} - Resultado con desglose del patrimonio
 */
async function calcularPatrimonio(jugador) {
  const dinero = jugador.dinero || 0;
  let valorPropiedades = 0;
  let valorHipotecas = 0;
  let valorConstrucciones = 0;
  let casas = 0;
  let hoteles = 0;
  let numPropiedades = 0;
  
  if (jugador.propiedades && jugador.propiedades.length > 0) {
    for (const propiedad of jugador.propiedades) {
      numPropiedades++;
      
      // Valor base de la propiedad
      let valorPropiedad = propiedad.precio || 0;
      
      // Agregar valor de construcciones
      if (propiedad.casas > 0) {
        casas += propiedad.casas;
        const valorCasas = propiedad.casas * 100; // $100 por casa
        valorConstrucciones += valorCasas;
        valorPropiedad += valorCasas;
      }
      
      if (propiedad.hotel) {
        hoteles += 1;
        const valorHotel = 200; // $200 por hotel (adicional a las 4 casas)
        valorConstrucciones += valorHotel;
        valorPropiedad += valorHotel;
      }
      
      if (propiedad.hipotecada) {
        // Si está hipotecada, restar el valor de hipoteca
        valorHipotecas += propiedad.hipoteca || 0;
      } else {
        // Si no está hipotecada, contar su valor completo
        valorPropiedades += valorPropiedad;
      }
    }
  }
  
  const patrimonioNeto = dinero + valorPropiedades - valorHipotecas;
  const totalConstrucciones = casas + hoteles;
  
  return {
    jugador: jugador,
    dinero: dinero,
    valorPropiedades: valorPropiedades,
    valorHipotecas: valorHipotecas,
    valorConstrucciones: valorConstrucciones,
    patrimonioNeto: patrimonioNeto,
    numPropiedades: numPropiedades,
    casas: casas,
    hoteles: hoteles,
    totalConstrucciones: totalConstrucciones
  };
}

/**
 * Confirma la finalización del juego y envía puntajes
 */
async function confirmarFinalizacion(event) {
  // Prevenir cualquier comportamiento por defecto y propagación
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
  
  try {
    const jugadores = JSON.parse(localStorage.getItem('jugadores') || '[]');
    
    if (jugadores.length === 0) {
      if (window.Toast) {
        window.Toast.error("No hay jugadores en la partida", "Error");
      }
      return false;
    }
    
    // Calcular resultados
    const resultados = await Promise.all(jugadores.map(calcularPatrimonio));
    
    // Enviar al backend
    const enviosExitosos = await enviarPuntajesBackend(resultados);
    
    if (window.Toast) {
      if (enviosExitosos > 0) {
        window.Toast.success(
          `Puntajes enviados exitosamente (${enviosExitosos}/${resultados.length})`,
          "Juego Finalizado"
        );
      } else {
        window.Toast.warning(
          "No se pudieron enviar los puntajes al servidor",
          "Juego Finalizado"
        );
      }
    }

    // Limpiar localStorage del juego
    localStorage.removeItem('jugadores');
    localStorage.removeItem('turnoActual');
    
    // Cerrar modal de forma segura
    if (window.Modal && typeof window.Modal.close === 'function') {
      window.Modal.close();
    }
    
    // Mostrar mensaje de redirección
    if (window.Toast) {
      window.Toast.info('Redirigiendo al menú principal...', 'Redirección');
    }
    
    // Redirigir al index.html después de un breve delay
    setTimeout(() => {
      console.log('🔄 INICIANDO REDIRECCIÓN AL INDEX...');
      console.log('📍 URL actual:', window.location.href);
      console.log('📍 Path actual:', window.location.pathname);
      
      // Probamos varias rutas posibles para llegar al index.html
      const possibleUrls = [
        '../../../index.html',           // Ruta relativa desde tablero
        '../../index.html',              // Ruta alternativa
        '/frontEnd/index.html',          // Ruta absoluta desde raíz
        '../index.html'                  // Otra ruta posible
      ];
      
      // Intentar la primera opción
      const targetUrl = possibleUrls[0];
      console.log('🎯 URL objetivo (opción 1):', targetUrl);
      
      try {
        console.log('🔄 Ejecutando window.location.replace...');
        window.location.replace(targetUrl);
      } catch (error) {
        console.error('❌ Error con replace opción 1, intentando href:', error);
        try {
          window.location.href = targetUrl;
        } catch (error2) {
          console.error('❌ Error con href opción 1, intentando opción 2:', error2);
          window.location.replace(possibleUrls[1]);
        }
      }
    }, 2000);
    
  } catch (error) {
    console.error('Error al finalizar el juego:', error);
    if (window.Toast) {
      window.Toast.error('Error al finalizar el juego', 'Error');
    }
    
    // Incluso con error, intentar redirigir al index
    if (window.Toast) {
      window.Toast.warning('Error en el proceso, redirigiendo al menú principal...', 'Redirección');
    }
    setTimeout(() => {
      console.log('🔄 REDIRECCIÓN DE EMERGENCIA AL INDEX...');
      const indexUrl = '../../../index.html';
      console.log('🎯 URL index de emergencia:', indexUrl);
      
      try {
        window.location.replace(indexUrl);
      } catch (error2) {
        console.error('❌ Error final con replace, intentando href:', error2);
        try {
          window.location.href = indexUrl;
        } catch (error3) {
          console.error('❌ Error total, intentando ruta absoluta:', error3);
          window.location.replace('/frontEnd/index.html');
        }
      }
    }, 2000);
  }
  
  return false;
}

/**
 * NUEVA FUNCIÓN: Maneja específicamente el botón "Confirmar y Finalizar" del modal
 */
async function confirmarYFinalizarJuego(event) {
  console.log('🎯 BOTÓN CONFIRMAR Y FINALIZAR PRESIONADO');
  
  // CRÍTICO: Detener TODOS los eventos INMEDIATAMENTE
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.log('✅ Eventos detenidos');
  }
  
  // CRÍTICO: Evitar que la función continue si se llama múltiples veces
  if (window.finalizandoJuego) {
    console.log('⚠️ Ya se está finalizando el juego, evitando doble ejecución');
    return false;
  }
  window.finalizandoJuego = true;
  
  try {
    console.log('🔄 Iniciando proceso de finalización...');
    
    const jugadores = JSON.parse(localStorage.getItem('jugadores') || '[]');
    
    if (jugadores.length === 0) {
      console.log('❌ No hay jugadores en la partida');
      window.finalizandoJuego = false;
      return false;
    }
    
    // Calcular resultados
    console.log('📊 Calculando patrimonios...');
    const resultados = await Promise.all(jugadores.map(calcularPatrimonio));
    
    // Enviar al backend
    console.log('📡 Enviando al backend...');
    const enviosExitosos = await enviarPuntajesBackend(resultados);
    console.log(`📊 Enviados ${enviosExitosos}/${resultados.length} jugadores al backend`);

    // Limpiar localStorage del juego
    console.log('🧹 Limpiando localStorage...');
    localStorage.removeItem('jugadores');
    localStorage.removeItem('turnoActual');
    
    // CRÍTICO: Forzar redirección INMEDIATAMENTE
    console.log('🔄 EJECUTANDO REDIRECCIÓN INMEDIATA...');
    forzarRedireccionAlIndex();
    
  } catch (error) {
    console.error('❌ Error en confirmarYFinalizarJuego:', error);
    window.finalizandoJuego = false;
    
    // Fallback de emergencia: redirigir directo sin demora
    console.log('🆘 REDIRECCIÓN DE EMERGENCIA INMEDIATA...');
    forzarRedireccionAlIndex();
  }
  
  // CRÍTICO: Siempre devolver false para prevenir cualquier acción por defecto
  return false;
}

/**
 * FUNCIÓN FORZADA DE REDIRECCIÓN - Sin delays, sin esperas
 */
function forzarRedireccionAlIndex() {
  console.log('🚀 FORZANDO REDIRECCIÓN AL INDEX AHORA...');
  
  // Cerrar modal INMEDIATAMENTE
  try {
    if (window.Modal && typeof window.Modal.close === 'function') {
      window.Modal.close();
      console.log('✅ Modal cerrado');
    }
  } catch (error) {
    console.error('❌ Error cerrando modal:', error);
  }
  
  // REDIRECCIÓN INMEDIATA - Sin setTimeout y sin toasts adicionales
  console.log('🎯 REDIRECCIÓN INMEDIATA SIN DELAY...');
  console.log('📍 URL actual:', window.location.href);
  
  const possibleUrls = [
    '../../../index.html',
    '../../index.html', 
    '/frontEnd/index.html',
    '../index.html'
  ];
  
  // Intentar todas las rutas una por una SIN delays
  for (let i = 0; i < possibleUrls.length; i++) {
    const url = possibleUrls[i];
    console.log(`🎯 Intentando ruta ${i + 1}:`, url);
    
    try {
      window.location.replace(url);
      return; // Si llega aquí, la redirección debería funcionar
    } catch (error) {
      console.error(`❌ Error con ruta ${i + 1}:`, error);
      if (i < possibleUrls.length - 1) {
        continue; // Probar la siguiente
      } else {
        // Último intento desesperado
        console.log('🆘 ÚLTIMO INTENTO: href directo...');
        window.location.href = '../../../index.html';
      }
    }
  }
}

/**
 * Envía los puntajes de todos los jugadores al backend
 * @param {Array} resultados - Array con los resultados de cada jugador
 * @returns {number} - Número de envíos exitosos
 */
async function enviarPuntajesBackend(resultados) {
  let enviosExitosos = 0;
  
  for (const resultado of resultados) {
    try {
      const body = {
        nick_name: resultado.jugador.nickname,
        score: resultado.patrimonioNeto,
        country_code: resultado.jugador.pais || 'co'
      };
      
      const response = await fetch('http://127.0.0.1:5000/score-recorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        enviosExitosos++;
      }
      
    } catch (error) {
      console.error('Error enviando puntaje al backend:', error);
    }
  }
  
  return enviosExitosos;
}

/**
 * Redirige al index.html con la ruta correcta
 */
function redirigirAlIndex() {
  const targetUrl = '../../../index.html';
  
  try {
    window.location.replace(targetUrl);
  } catch (error) {
    try {
      window.location.href = targetUrl;
    } catch (error2) {
      try {
        window.location.replace('/frontEnd/index.html');
      } catch (error3) {
        window.location.href = '/frontEnd/index.html';
      }
    }
  }
}

// Hacer las funciones disponibles globalmente
window.mostrarModalFinalizarJuego = mostrarModalFinalizarJuego;
window.confirmarFinalizacion = confirmarFinalizacion;
window.confirmarYFinalizarJuego = confirmarYFinalizarJuego;

// Agregar estilos CSS para el modal
const estilosFinalizacion = document.createElement('style');
estilosFinalizacion.textContent = `
  .modal-finalizar-juego {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .finalizacion-header {
    text-align: center;
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .finalizacion-header h3 {
    margin: 0 0 8px 0;
    font-size: 1.5rem;
  }
  
  .resultados-finales h4 {
    color: #333;
    margin-bottom: 15px;
    text-align: center;
  }
  
  .tabla-resultados {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  
  .resultado-header {
    display: grid;
    grid-template-columns: 60px 1fr 100px 120px 120px 140px;
    background: #f8f9fa;
    font-weight: bold;
    padding: 12px;
    border-bottom: 2px solid #dee2e6;
    text-align: center;
    font-size: 0.9rem;
  }
  
  .resultado-fila {
    display: grid;
    grid-template-columns: 60px 1fr 100px 120px 120px 140px;
    padding: 12px;
    border-bottom: 1px solid #dee2e6;
    align-items: center;
  }
  
  .resultado-fila:last-child {
    border-bottom: none;
  }
  
  .resultado-fila.ganador {
    background: linear-gradient(135deg, #fff3cd, #ffeaa7);
    font-weight: bold;
    border: 2px solid #ffc107;
  }
  
  .pos {
    text-align: center;
    font-weight: bold;
  }
  
  .jugador {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .jugador-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .jugador-info .nombre {
    font-weight: 600;
  }
  
  .jugador-info .pais {
    color: #6c757d;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .ficha {
    background: #007bff;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .dinero, .propiedades, .construcciones, .patrimonio {
    text-align: right;
    font-family: monospace;
  }
  
  .construcciones {
    text-align: center;
    font-size: 0.85rem;
  }
  
  .construcciones-detalle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  
  .patrimonio {
    color: #28a745;
    font-weight: bold;
  }
  
  .ganador-destacado {
    text-align: center;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border: 2px solid #ffc107;
  }
  
  .ganador-destacado h4 {
    color: #28a745;
    margin-bottom: 8px;
  }
  
  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  .modal-actions .btn {
    min-width: 140px;
  }
`;

if (!document.getElementById('modal-finalizacion-styles')) {
  estilosFinalizacion.id = 'modal-finalizacion-styles';
  document.head.appendChild(estilosFinalizacion);
}