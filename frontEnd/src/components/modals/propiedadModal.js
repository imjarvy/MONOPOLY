/**
 * Modal de Acciones de Propiedades
 *   console.log(`📋 [DEBUG] Mostrando modal con contenido generado`);
  
  // Mostrar el modal usando el sistema existente
  await window.Modal.show(contenido, {
    title: propiedad.name,
    size: 'lg',
    closeOnOverlay: false,
    preventAutoClose: true // Evitar que se cierre automáticamente
  });para comprar, construir, hipotecar propiedades
 */

import * as Propiedades from '../../logica/propiedades.js';
import { obtenerJugadorActual, obtenerJugadoresActuales, completarAccionJugador } from '../../logica/turnos.js';

/**
 * Muestra el modal de acción de propiedad cuando el jugador cae en una casilla
 * @param {Object} propiedad - Información de la propiedad del backend
 * @param {Object} jugadorActual - Jugador que cayó en la casilla
 */
export async function mostrarModalPropiedad(propiedad, jugadorActual) {
  // Determinar el tipo de acción según el estado de la propiedad
  const estadoPropiedad = determinarEstadoPropiedad(propiedad, jugadorActual);
  
  let contenido = '';
  
  switch (estadoPropiedad.tipo) {
    case 'comprar':
      contenido = crearModalCompra(propiedad, jugadorActual, estadoPropiedad);
      break;
    case 'pagar_renta':
      contenido = crearModalRenta(propiedad, jugadorActual, estadoPropiedad);
      break;
    case 'gestionar':
      contenido = crearModalGestion(propiedad, jugadorActual, estadoPropiedad);
      break;
    case 'hipotecada':
      contenido = crearModalHipotecada(propiedad, estadoPropiedad);
      break;
    default:
      return; // No mostrar modal para otros tipos
  }
  
  // Mostrar el modal usando el sistema existente
  window.Modal.show(contenido, {
    title: propiedad.name,
    size: 'lg',
    closeOnOverlay: false,
    preventAutoClose: true // Agregar esta opción para prevenir cierre automático
  });
  
  // Agregar una pequeña pausa para asegurar que el modal se renderice completamente
  await new Promise(resolve => setTimeout(resolve, 200)); // Aumentar el delay
}

/**
 * Determina el estado actual de la propiedad y qué acciones están disponibles
 */
function determinarEstadoPropiedad(propiedad, jugadorActual) {
  if (propiedad.type !== 'property' && propiedad.type !== 'railroad') {
    return { tipo: 'ninguno' };
  }
  
  const jugadores = obtenerJugadoresActuales();
  
  // Buscar el dueño de la propiedad
  let dueño = null;
  let propiedadDelDueño = null;
  
  for (const jugador of jugadores) {
    const propiedadEncontrada = jugador.propiedades?.find(p => p.id === propiedad.id);
    if (propiedadEncontrada) {
      dueño = jugador;
      propiedadDelDueño = propiedadEncontrada;
      break;
    }
  }
  
  if (!dueño) {
    // Propiedad disponible para compra
    return { 
      tipo: 'comprar', 
      puedeComprar: Propiedades.puedeComprarPropiedad(jugadorActual, propiedad) 
    };
  }
  
  if (dueño.id === jugadorActual.id) {
    // Es del jugador actual - puede gestionar
    return { 
      tipo: 'gestionar', 
      propiedad: propiedadDelDueño,
      dueño: dueño
    };
  }
  
  if (propiedadDelDueño.hipotecada) {
    // Propiedad hipotecada - no genera renta
    return { 
      tipo: 'hipotecada', 
      dueño: dueño 
    };
  }
  
  // Debe pagar renta
  const renta = Propiedades.calcularRenta(propiedad, propiedadDelDueño);
  return { 
    tipo: 'pagar_renta', 
    dueño: dueño,
    propiedad: propiedadDelDueño,
    renta: renta
  };
}

/**
 * Crea el modal para comprar una propiedad
 */
function crearModalCompra(propiedad, jugador, estado) {
  const puedeComprar = estado.puedeComprar;
  const dineroSuficiente = jugador.dinero >= propiedad.price;
  
  return `
    <div class="modal-propiedad compra">
      <div class="propiedad-header" style="background-color: ${propiedad.color || '#666'}">
        <h3>${propiedad.name}</h3>
        <div class="propiedad-tipo">${propiedad.type === 'railroad' ? 'Ferrocarril' : 'Propiedad'}</div>
      </div>
      
      <div class="propiedad-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="label">💰 Precio:</span>
            <span class="value">$${propiedad.price}</span>
          </div>
          <div class="info-item">
            <span class="label">🏦 Hipoteca:</span>
            <span class="value">$${propiedad.mortgage}</span>
          </div>
          ${propiedad.rent ? `
            <div class="info-item">
              <span class="label">🏠 Renta base:</span>
              <span class="value">$${propiedad.rent.base || propiedad.rent['1']}</span>
            </div>
          ` : ''}
        </div>
        
        ${propiedad.rent?.withHouse ? `
          <div class="renta-construcciones">
            <h4>Renta con construcciones:</h4>
            <div class="construcciones-grid">
              ${propiedad.rent.withHouse.map((renta, idx) => `
                <div class="construccion-item">
                  <span>🏠 ${idx + 1} casa${idx > 0 ? 's' : ''}: $${renta}</span>
                </div>
              `).join('')}
              <div class="construccion-item hotel">
                <span>🏨 Hotel: $${propiedad.rent.withHotel}</span>
              </div>
            </div>
          </div>
        ` : ''}
        
        <div class="jugador-dinero">
          <strong>Tu dinero: $${jugador.dinero}</strong>
          ${!dineroSuficiente ? '<span class="dinero-insuficiente">⚠️ Dinero insuficiente</span>' : ''}
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="cerrarModalYCompletarTurno()">
          Cancelar
        </button>
        <button class="btn btn-success" 
                onclick="ejecutarCompraPropiedad(${propiedad.id})" 
                ${!puedeComprar || !dineroSuficiente ? 'disabled' : ''}>
          💰 Comprar por $${propiedad.price}
        </button>
      </div>
    </div>
  `;
}

/**
 * Crea el modal para pagar renta
 */
function crearModalRenta(propiedad, jugador, estado) {
  const puedesPagar = jugador.dinero >= estado.renta;
  
  return `
    <div class="modal-propiedad renta">
      <div class="propiedad-header" style="background-color: ${propiedad.color || '#666'}">
        <h3>${propiedad.name}</h3>
        <div class="propiedad-dueño">Propiedad de ${estado.dueño.nickname} ${estado.dueño.ficha}</div>
      </div>
      
      <div class="propiedad-info">
        <div class="renta-info">
          <div class="renta-calculo">
            <h4>Debes pagar renta:</h4>
            <div class="renta-desglose">
              ${estado.propiedad.hotel ? '🏨 Con hotel' : 
                estado.propiedad.casas > 0 ? `🏠 Con ${estado.propiedad.casas} casa${estado.propiedad.casas > 1 ? 's' : ''}` :
                '📋 Renta base'}
            </div>
            <div class="renta-cantidad">$${estado.renta}</div>
          </div>
          
          <div class="jugadores-dinero">
            <div class="dinero-item">
              <span>Tu dinero: <strong>$${jugador.dinero}</strong></span>
              ${!puedesPagar ? '<span class="dinero-insuficiente">⚠️ No tienes suficiente dinero</span>' : ''}
            </div>
            <div class="dinero-item">
              <span>Dinero de ${estado.dueño.nickname}: <strong>$${estado.dueño.dinero}</strong></span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-danger" 
                onclick="ejecutarPagoRenta(${propiedad.id}, ${estado.renta}, '${estado.dueño.id}')"
                ${!puedesPagar ? 'disabled' : ''}>
          💸 Pagar $${estado.renta}
        </button>
      </div>
    </div>
  `;
}

/**
 * Crea el modal para gestionar propiedades propias
 */
function crearModalGestion(propiedad, jugador, estado) {
  return `
    <div class="modal-propiedad gestion">
      <div class="propiedad-header" style="background-color: ${propiedad.color || '#666'}">
        <h3>${propiedad.name}</h3>
        <div class="propiedad-dueño">Tu propiedad ${jugador.ficha}</div>
      </div>
      
      <div class="propiedad-info">
        <div class="estado-construcciones">
          <div class="construcciones-actuales">
            ${estado.propiedad.hotel ? '🏨 Hotel construido' :
              estado.propiedad.casas > 0 ? `🏠 ${estado.propiedad.casas} casa${estado.propiedad.casas > 1 ? 's' : ''}` :
              '📋 Sin construcciones'}
          </div>
          
          ${estado.propiedad.hipotecada ? `
            <div class="estado-hipoteca">
              <span class="hipoteca-activa">🏦 Propiedad hipotecada</span>
              <div class="costo-deshipoteca">
                Costo para deshipotecar: $${Math.round(estado.propiedad.hipoteca * 1.1)}
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="acciones-disponibles">
          <h4>Acciones disponibles:</h4>
          <div class="acciones-grid">
            ${crearBotonesAcciones(propiedad, jugador, estado)}
          </div>
        </div>
        
        <div class="jugador-dinero">
          <strong>Tu dinero: $${jugador.dinero}</strong>
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="cerrarModalYCompletarTurno()">
          Cerrar
        </button>
      </div>
    </div>
  `;
}

/**
 * Crea los botones de acciones según el estado de la propiedad
 */
function crearBotonesAcciones(propiedad, jugador, estado) {
  let botones = '';
  
  if (propiedad.type === 'property' && !estado.propiedad.hipotecada) {
    // Botones de construcción
    if (estado.propiedad.hotel) {
      botones += `<div class="accion-item disabled">🏨 Hotel ya construido</div>`;
    } else if (estado.propiedad.casas >= 4) {
      botones += `
        <button class="accion-item" onclick="ejecutarConstruccion(${propiedad.id}, 'hotel')"
                ${jugador.dinero >= 250 ? '' : 'disabled'}>
          🏨 Construir hotel ($250)
        </button>
      `;
    } else {
      botones += `
        <button class="accion-item" onclick="ejecutarConstruccion(${propiedad.id}, 'casa')"
                ${jugador.dinero >= 100 ? '' : 'disabled'}>
          🏠 Construir casa ($100)
        </button>
      `;
    }
  }
  
  // Botón de hipoteca/deshipoteca
  if (estado.propiedad.hipotecada) {
    const costoDeshipoteca = Math.round(estado.propiedad.hipoteca * 1.1);
    botones += `
      <button class="accion-item" onclick="ejecutarDeshipoteca(${propiedad.id})"
              ${jugador.dinero >= costoDeshipoteca ? '' : 'disabled'}>
        🏦 Deshipotecar ($${costoDeshipoteca})
      </button>
    `;
  } else if (estado.propiedad.casas === 0 && !estado.propiedad.hotel) {
    botones += `
      <button class="accion-item" onclick="ejecutarHipoteca(${propiedad.id})">
        🏦 Hipotecar (+$${estado.propiedad.hipoteca})
      </button>
    `;
  }
  
  return botones;
}

/**
 * Crea el modal para propiedades hipotecadas
 */
function crearModalHipotecada(propiedad, estado) {
  return `
    <div class="modal-propiedad hipotecada">
      <div class="propiedad-header" style="background-color: ${propiedad.color || '#666'}; opacity: 0.6;">
        <h3>${propiedad.name}</h3>
        <div class="propiedad-dueño">Propiedad de ${estado.dueño.nickname} ${estado.dueño.ficha}</div>
      </div>
      
      <div class="propiedad-info">
        <div class="hipoteca-info">
          <h4>🏦 Propiedad Hipotecada</h4>
          <p>Esta propiedad está hipotecada, por lo que no generates renta.</p>
          <p>Puedes pasar sin pagar nada.</p>
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="cerrarModalYCompletarTurno()">
          Continuar
        </button>
      </div>
    </div>
  `;
}

// Funciones globales para los botones del modal

// Función auxiliar para cerrar modal y completar turno
function cerrarModalYCompletarTurno() {
  window.Modal.forceClose(); // Usar forceClose en lugar de close normal
  
  // Agregar un pequeño delay para asegurar que el modal se cierre completamente
  setTimeout(() => {
    completarAccionJugador();
  }, 100);
}

// Hacer función disponible globalmente
window.cerrarModalYCompletarTurno = cerrarModalYCompletarTurno;

window.ejecutarCompraPropiedad = async function(propiedadId) {
  const jugador = obtenerJugadorActual();
  const propiedad = await Propiedades.obtenerInfoPropiedad(propiedadId);
  
  const resultado = Propiedades.comprarPropiedad(jugador, propiedad);
  
  if (window.Toast) {
    if (resultado.exito) {
      window.Toast.success(resultado.mensaje, "Compra Exitosa");
    } else {
      window.Toast.error(resultado.mensaje, "Error en Compra");
    }
  }
  
  window.Modal.forceClose(); // Usar forceClose
  
  // Agregar un pequeño delay para asegurar que el modal se cierre completamente
  setTimeout(() => {
    completarAccionJugador();
    
    // Actualizar la interfaz después del delay
    if (typeof actualizarInterfazJuego === 'function') {
      actualizarInterfazJuego();
    }
  }, 100);
};

window.ejecutarPagoRenta = function(propiedadId, renta, dueñoId) {
  const jugadores = obtenerJugadoresActuales();
  const jugadorActual = obtenerJugadorActual();
  const dueño = jugadores.find(j => j.id.toString() === dueñoId);
  
  if (jugadorActual.dinero >= renta) {
    // Transferir dinero
    jugadorActual.dinero -= renta;
    dueño.dinero += renta;
    
    // Actualizar localStorage
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
    
    if (window.Toast) {
      window.Toast.info(`Pagaste $${renta} a ${dueño.nickname}`, "Pago de Renta");
    }
  } else {
    if (window.Toast) {
      window.Toast.error("No tienes suficiente dinero", "Pago Fallido");
    }
  }
  
  window.Modal.forceClose(); // Usar forceClose
  
  // Agregar un pequeño delay para asegurar que el modal se cierre completamente
  setTimeout(() => {
    completarAccionJugador();
  }, 100);
};

window.ejecutarConstruccion = async function(propiedadId, tipo) {
  const jugador = obtenerJugadorActual();
  const propiedadJugador = jugador.propiedades.find(p => p.id === propiedadId);
  
  const resultado = await Propiedades.construir(jugador, propiedadJugador);
  
  if (window.Toast) {
    if (resultado.exito) {
      window.Toast.success(resultado.mensaje, "Construcción Exitosa");
    } else {
      window.Toast.error(resultado.mensaje, "Error en Construcción");
    }
  }
  
  window.Modal.forceClose(); // Usar forceClose
  
  // Agregar un pequeño delay para asegurar que el modal se cierre completamente
  setTimeout(() => {
    completarAccionJugador();
  }, 100);
};

window.ejecutarHipoteca = function(propiedadId) {
  const jugador = obtenerJugadorActual();
  const propiedadJugador = jugador.propiedades.find(p => p.id === propiedadId);
  
  const resultado = Propiedades.hipotecarPropiedad(jugador, propiedadJugador);
  
  if (window.Toast) {
    if (resultado.exito) {
      window.Toast.success(resultado.mensaje, "Hipoteca Exitosa");
    } else {
      window.Toast.error(resultado.mensaje, "Error en Hipoteca");
    }
  }
  
  window.Modal.forceClose(); // Usar forceClose
  
  // Agregar un pequeño delay para asegurar que el modal se cierre completamente
  setTimeout(() => {
    completarAccionJugador();
  }, 100);
};

window.ejecutarDeshipoteca = function(propiedadId) {
  const jugador = obtenerJugadorActual();
  const propiedadJugador = jugador.propiedades.find(p => p.id === propiedadId);
  
  const resultado = Propiedades.deshipotecarPropiedad(jugador, propiedadJugador);
  
  if (window.Toast) {
    if (resultado.exito) {
      window.Toast.success(resultado.mensaje, "Deshipoteca Exitosa");
    } else {
      window.Toast.error(resultado.mensaje, "Error en Deshipoteca");
    }
  }
  
  window.Modal.forceClose(); // Usar forceClose
  
  // Agregar un pequeño delay para asegurar que el modal se cierre completamente
  setTimeout(() => {
    completarAccionJugador();
  }, 100);
};

// Estilos CSS para el modal
const estilosModal = document.createElement('style');
estilosModal.textContent = `
  .modal-propiedad {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .propiedad-header {
    color: white;
    padding: 15px;
    border-radius: 8px 8px 0 0;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .propiedad-header h3 {
    margin: 0 0 5px 0;
    font-size: 1.3rem;
  }
  
  .propiedad-tipo, .propiedad-dueño {
    opacity: 0.9;
    font-size: 0.9rem;
  }
  
  .info-grid, .construcciones-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .info-item, .construccion-item {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 5px;
  }
  
  .construccion-item.hotel {
    background: #fff3cd;
  }
  
  .renta-calculo {
    text-align: center;
    padding: 20px;
    background: #e9ecef;
    border-radius: 8px;
    margin-bottom: 15px;
  }
  
  .renta-cantidad {
    font-size: 2rem;
    font-weight: bold;
    color: #dc3545;
    margin-top: 10px;
  }
  
  .acciones-grid {
    display: grid;
    gap: 10px;
  }
  
  .accion-item {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .accion-item:hover:not(:disabled) {
    background: #e9ecef;
  }
  
  .accion-item:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .dinero-insuficiente {
    color: #dc3545;
    font-weight: bold;
    margin-left: 10px;
  }
  
  .hipoteca-activa {
    background: #fff3cd;
    padding: 5px 10px;
    border-radius: 15px;
    font-weight: bold;
  }
  
  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }
`;

if (!document.getElementById('modal-propiedades-styles')) {
  estilosModal.id = 'modal-propiedades-styles';
  document.head.appendChild(estilosModal);
}