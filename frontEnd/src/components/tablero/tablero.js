/**
 * PRONT: Crea un sistema de renderizado de tablero de Monopoly dinámico y responsivo que consuma datos desde 
 * boardService.js
 */
import { getBoard } from '../../services/boardService.js';
import { inicializarJuego } from '../../logica/turnos.js';

const tablero = document.querySelector('.tablero');

async function renderizarTablero() {
  const boardData = await getBoard();
  if (!boardData) return;

  tablero.innerHTML = '';

  const createSquare = (casilla, position) => {
    const div = document.createElement('div');
    div.className = `casilla ${getPositionClass(position)}`;
    div.dataset.type = casilla.type;
    div.dataset.color = casilla.color;
    div.dataset.position = position;
    
    div.innerHTML = `
      <div class="nombre">${casilla.name}</div>
      ${casilla.price ? `<div class="precio">$${casilla.price}</div>` : ''}
      ${casilla.type === 'property' ? `<div class="renta">Renta: $${casilla.rent.base}</div>` : ''}
    `;
    
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
  
  // Agregar logo completo de Monopoly (igual que en el index)
  const logo = document.createElement('img');
  logo.src = '../../../../public/assets/img/Monopoly-Emblem.webp';
  logo.alt = 'Monopoly';
  logo.className = 'monopoly-center-logo';
  
  centro.appendChild(logo);
  tablero.appendChild(centro);
  
  // Inicializar sistema de turnos después de renderizar el tablero
  setTimeout(() => {
    inicializarJuego();
  }, 100);
}

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

renderizarTablero();