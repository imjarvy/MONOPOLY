const tablero = document.querySelector('.tablero');

// Crear casillas superiores (arriba)
for (let column = 2; column <= 10; column++) {
  const arriba = document.createElement('div');
  arriba.className = 'casilla arriba';
   arriba.style.gridColumn = column;  // Columna variable
  arriba.textContent = column;  // Número de casilla (2 a 9)
  tablero.appendChild(arriba);
}

// Crear casillas inferiores (abajo)
for (let column = 2; column <= 10; column++) {
  const abajo = document.createElement('div');
  abajo.className = 'casilla abajo';
  abajo.style.gridColumn = column;  // Columna variable
  abajo.textContent = 31 - (column - 1);  // Número de casilla (31 a 22)
  tablero.appendChild(abajo);
}

// Crear casillas izquierdas
for (let fila = 2; fila <= 10; fila++) {
  const izquierda = document.createElement('div');
  izquierda.className = 'casilla izquierda';
  izquierda.style.gridRow = fila;  // Fila variable
  izquierda.textContent = 40 - (fila - 1);  // Número de casilla (39 a 31)
  tablero.appendChild(izquierda);
}

// Crear casillas derechas
for (let fila = 2; fila <= 10; fila++) {
  const derecha = document.createElement('div');
  derecha.className = 'casilla derecha';
  derecha.style.gridRow = fila;  // Fila variable
  derecha.textContent = 11 + (fila - 1);  // Número de casilla (12 a 2)
  tablero.appendChild(derecha);
}
// funcionalidad del boton finalizaer partida
document.querySelector('button').addEventListener('click', function() {
  alert("La partida ha finalizado. Gracias por jugar.");
  window.location.href = "/MONOPOLY/frontEnd/src/pages/registrar.html"; // Redirigir a la página de registro
});

// Nota: Las casillas de las esquinas ya están definidas en el HTML.
