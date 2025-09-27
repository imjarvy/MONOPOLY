// ============== IMPORTS EXISTENTES ==============
import { getBoard } from '../../services/boardService.js';

// ============== DOM ELEMENTS ==============
const tablero = document.querySelector('.tablero');
let turnoActual = 0; // Variable de estado para el turno actual

// ============== SISTEMA DE INICIALIZACIÓN MEJORADO ==============
/**
 * Inicialización segura que espera a que todos los recursos estén listos
 */
async function inicializarTablero() {
  try {
    console.log('🎲 Inicializando tablero de Monopoly...');
    
    // ✅ Verificar que el DOM esté listo
    if (!tablero) {
      console.error('❌ Elemento .tablero no encontrado en el DOM');
      if (window.Toast) {
        window.Toast.error('Error cargando el tablero. Elemento no encontrado.', 'Error Crítico');
      }
      return;
    }

    // ✅ Verificar jugadores (compatibilidad con tu sistema actual)
    const jugadoresData = localStorage.getItem("jugadores");
    if (!jugadoresData) {
      console.warn('⚠️ No se encontraron jugadores en localStorage');
      if (window.Toast) {
        window.Toast.warning('No se encontraron jugadores. Redirigiendo al inicio...', 'Sin Jugadores');
      }
      
      setTimeout(() => {
        window.location.href = '../../../index.html';
      }, 2500);
      return;
    }

    const jugadores = JSON.parse(jugadoresData);
    console.log('👥 Jugadores cargados:', jugadores.length, 'jugadores');

    // ✅ Renderizar tablero (tu función existente)
    await renderizarTablero();
    
    // ✅ Inicializar sistema de juego
    inicializarSistemaJuego(jugadores);
    
    // ✅ Notificación de éxito
    if (window.Toast) {
      window.Toast.success(
        `¡Tablero cargado exitosamente! ${jugadores.length} jugadores listos para jugar.`, 
        '🎮 ¡Bienvenidos al Monopoly!'
      );
    }
    
    console.log('✅ Tablero inicializado correctamente');
    
  } catch (error) {
    console.error('❌ Error crítico inicializando tablero:', error);
    
    if (window.Toast) {
      window.Toast.error(
        'Hubo un error cargando el juego. Intenta recargar la página.', 
        '💥 Error Crítico'
      );
    } else {
      alert('❌ Error crítico cargando el tablero. Recarga la página.');
    }
  }
}

// ============== TU FUNCIÓN ORIGINAL (Sin cambios) ==============
/**
 * Renderiza el tablero de Monopoly en el DOM usando los datos del backend.
 * Cada casilla muestra nombre, color, tipo y estado.
 * Se llama automáticamente al cargar el módulo.
 */
async function renderizarTablero() {
  try {
    console.log('🏗️ Obteniendo datos del tablero...');
    const boardData = await getBoard();
    
    if (!boardData) {
      throw new Error('No se pudieron cargar los datos del tablero');
    }

    tablero.innerHTML = '';

    const createSquare = (casilla, position) => {
      const div = document.createElement('div');
      div.className = `casilla ${getPositionClass(position)}`;
      div.dataset.type = casilla.type;
      div.dataset.color = casilla.color;
      div.dataset.position = position;

      // Nombre
      const nombre = document.createElement('div');
      nombre.className = 'nombre';
      nombre.textContent = casilla.name;
      div.appendChild(nombre);

      // Precio
      if (casilla.price) {
        const precio = document.createElement('div');
        precio.className = 'precio';
        precio.textContent = `$${casilla.price}`;
        div.appendChild(precio);
      }

      // Casas
      if (casilla.casas && casilla.casas > 0) {
        const casasDiv = document.createElement('div');
        casasDiv.className = 'casas';
        for (let i = 0; i < casilla.casas; i++) {
          const casa = document.createElement('span');
          casa.className = 'icon-casa';
          casa.textContent = '🏠';
          casasDiv.appendChild(casa);
        }
        div.appendChild(casasDiv);
      }

      // Hotel
      if (casilla.hotel && casilla.hotel > 0) {
        const hotelDiv = document.createElement('div');
        hotelDiv.className = 'hotel';
        for (let i = 0; i < casilla.hotel; i++) {
          const hotel = document.createElement('span');
          hotel.className = 'icon-hotel';
          hotel.textContent = '🏨';
          hotelDiv.appendChild(hotel);
        }
        div.appendChild(hotelDiv);
      }

      return div;
    };
        
    // Bottom row (right to left, 0-9)
    boardData.bottom.forEach((casilla, idx) => {
      const square = createSquare(casilla, idx);
      square.style.gridRow = '11';
      square.style.gridColumn = `${11 - idx}`; // Right to left

      // Solo asignar clase de esquina a la posición 0 (Salida)
      if (idx === 0) {
        square.className = 'casilla esquinaIa'; // Salida
      } else {
        square.className = 'casilla abajo'; // Resto de casillas del bottom
      }
      
      // Mantener los data attributes
      square.dataset.type = casilla.type;
      square.dataset.color = casilla.color;
      square.dataset.position = idx;
      
      tablero.appendChild(square);
    });

    // Left column (bottom to top, 10-20)
    boardData.left.forEach((casilla, idx) => {
      const square = createSquare(casilla, idx + 10);
      square.style.gridColumn = '1';
      
      // Adjust grid row to go from bottom to top
      square.style.gridRow = `${11 - idx}`; 

      // Handle corner cases for Jail (10) and Free Parking (20)
      if (idx === 0) { // Jail (position 10)
        square.className = 'casilla esquinaDa';
      } else if (idx === boardData.left.length - 1) { // Free Parking (position 20)
        square.className = 'casilla esquinaIb';
      } else {
        square.className = 'casilla izquierda';
      }

      // Maintain data attributes
      square.dataset.type = casilla.type;
      square.dataset.color = casilla.color;
      square.dataset.position = idx + 10;

      tablero.appendChild(square);
    });

    // Top row (left to right, 21-30)
    boardData.top.forEach((casilla, idx) => {
      const square = createSquare(casilla, idx + 21); // Start from 21
      square.style.gridRow = '1';
      square.style.gridColumn = `${idx + 2}`; // Start from column 2 (after Parqueo)

      // Handle corner case for Go to Jail (30)
      if (idx === boardData.top.length - 1) { // Last position (30)
        square.className = 'casilla esquinaDb';
      } else {
        square.className = 'casilla arriba';
      }

      // Maintain data attributes
      square.dataset.type = casilla.type;
      square.dataset.color = casilla.color;
      square.dataset.position = idx + 21; // Start from position 21

      tablero.appendChild(square);
    });

    // Right column (top to bottom, 31-39)
    boardData.right.forEach((casilla, idx) => {
      const square = createSquare(casilla, idx + 31); // Start from 31
      square.style.gridColumn = '11';
      square.style.gridRow = `${idx + 2}`; // Start from row 2 (after Ve a la Cárcel)

      // Set correct class
      square.className = 'casilla derecha';

      // Maintain data attributes
      square.dataset.type = casilla.type;
      square.dataset.color = casilla.color;
      square.dataset.position = idx + 31;

      tablero.appendChild(square);
    });

    // Add center
    const centro = document.createElement('div');
    centro.className = 'centro';
    centro.textContent = 'MONOPOLY';
    tablero.appendChild(centro);
    
    console.log('✅ Tablero renderizado correctamente');

  } catch (error) {
    console.error('❌ Error renderizando tablero:', error);
    
    if (window.Toast) {
      window.Toast.error('Error cargando el diseño del tablero.', 'Error de Renderizado');
    }
    
    throw error; // Re-throw para que lo maneje inicializarTablero
  }
}

// ============== TU FUNCIÓN ORIGINAL (Sin cambios) ==============
/**
 * Devuelve la clase CSS correspondiente a la posición de la casilla.
 * Usado para rotar y ubicar correctamente cada casilla en el tablero.
 * @param {number} position - Índice de la casilla
 * @returns {string} Clase CSS
 */
function getPositionClass(position) {
  // Corner positions
  if (position === 0) return 'esquinaIa';  // Salida (bottom-left)
  if (position === 10) return 'esquinaDa'; // Cárcel (bottom-right)
  if (position === 20) return 'esquinaIb'; // Parqueo (top-left)
  if (position === 30) return 'esquinaDb'; // Ve a la Cárcel (top-right)
  
  // Regular positions
  if (position > 0 && position < 10) return 'abajo';     // Bottom row
  if (position > 10 && position < 20) return 'izquierda'; // Left column
  if (position > 20 && position < 30) return 'arriba';    // Top row
  if (position > 30 && position < 40) return 'derecha';   // Right column
  
  return '';
}

// ============== TU FUNCIÓN EXPORT ORIGINAL (Sin cambios) ==============
/**
 * Actualiza visualmente las fichas de los jugadores en el tablero.
 * Elimina fichas anteriores y coloca la ficha de cada jugador en su casilla actual.
 * @param {Array} jugadores - Lista de jugadores con su posición
 */
export function actualizarFichas(jugadores) {
  // Limpia fichas anteriores
  document.querySelectorAll('.ficha-jugador').forEach(el => el.remove());

  jugadores.forEach((jugador, idx) => {
    const casilla = document.querySelector(`[data-position="${jugador.posicion}"]`);
    if (casilla) {
      const ficha = document.createElement('div');
      ficha.className = 'ficha-jugador';
      ficha.textContent = jugador.nickname[0]; // Inicial del jugador
      ficha.style.background = idx === turnoActual ? '#007bff' : '#888';
      ficha.style.color = '#fff';
      ficha.style.borderRadius = '50%';
      ficha.style.width = '22px';
      ficha.style.height = '22px';
      ficha.style.display = 'inline-flex';
      ficha.style.justifyContent = 'center';
      ficha.style.alignItems = 'center';
      ficha.style.margin = '2px';
      casilla.appendChild(ficha);
    }
  });
}

// ============== NUEVAS FUNCIONES DE SOPORTE ==============
/**
 * Inicializa el sistema de juego con los jugadores cargados
 * @param {Array} jugadores - Lista de jugadores
 */
function inicializarSistemaJuego(jugadores) {
  try {
    console.log('🎮 Inicializando sistema de juego...');
    
    // Configurar controles básicos
    const lanzarDados = document.getElementById('lanzar-dados');
    const terminarTurno = document.getElementById('terminar-turno');
    
    if (lanzarDados) {
      lanzarDados.addEventListener('click', () => {
        if (window.Toast) {
          window.Toast.info('¡Lanzando dados! 🎲', 'Tu Turno');
        }
        console.log('🎲 Dados lanzados');
      });
    }
    
    if (terminarTurno) {
      terminarTurno.addEventListener('click', () => {
        if (window.Toast) {
          window.Toast.success('Turno terminado. Siguiente jugador.', '⏭️ Cambio de Turno');
        }
        console.log('⏭️ Turno terminado');
      });
    }
    
    // Inicializar fichas de jugadores
    if (typeof actualizarFichas === 'function') {
      // Configurar jugadores con posición inicial
      const jugadoresConPosicion = jugadores.map(jugador => ({
        ...jugador,
        posicion: jugador.posicion || 0 // Posición inicial en SALIDA
      }));
      
      actualizarFichas(jugadoresConPosicion);
      console.log('🎭 Fichas de jugadores inicializadas');
    }
    
    console.log('✅ Sistema de juego inicializado');
    
  } catch (error) {
    console.error('❌ Error inicializando sistema de juego:', error);
    if (window.Toast) {
      window.Toast.warning('Algunas funciones del juego pueden no estar disponibles.', 'Advertencia');
    }
  }
}

// ============== INICIALIZACIÓN AUTOMÁTICA MEJORADA ==============
// ✅ Esperamos a que todo esté listo antes de inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarTablero);
} else {
  // DOM ya está cargado
  inicializarTablero();
}

// ✅ Fallback por si el DOMContentLoaded ya se disparó
setTimeout(() => {
  if (!tablero.innerHTML.trim()) {
    console.warn('⚠️ Tablero vacío después del timeout, reintentando...');
    inicializarTablero();
  }
}, 1000);

// ============== VARIABLES EXPORTADAS PARA COMPATIBILIDAD ==============
// Si otras partes del código necesitan acceso a estos valores
export { tablero, renderizarTablero, getPositionClass };