/**
 * Renderiza el panel visual de jugadores.
 * Muestra dinero, propiedades, hipotecas y resalta el jugador activo.
 * @param {Array} jugadores - Lista de jugadores
 * @param {number} turnoActual - Índice del jugador activo
 */
export function renderizarPanelJugadores(jugadores, turnoActual) {
  const panel = document.getElementById('panel-jugadores');
  panel.innerHTML = '';
jugadores.forEach((jugador, idx) => {
  const div = document.createElement('div');
  div.className = 'panel-jugador' + (turnoActual === idx ? ' activo' : '');

  const nombre = document.createElement('div');
  nombre.innerHTML = `<strong>${jugador.nickname}</strong> (${jugador.pais})`;
  div.appendChild(nombre);

  const dinero = document.createElement('div');
  dinero.textContent = `Dinero: $${jugador.dinero}`;
  div.appendChild(dinero);

  // Propiedades
  const props = document.createElement('div');
  props.textContent = 'Propiedades: ';
  if (jugador.propiedades.length) {
    jugador.propiedades.forEach(p => {
      const span = document.createElement('span');
      span.textContent = p.nombre;
      span.style.color = p.color;
      props.appendChild(span);
      props.appendChild(document.createTextNode(', '));
    });
    // Quita la última coma
    props.removeChild(props.lastChild);
  } else {
    props.appendChild(document.createTextNode('Ninguna'));
  }
  div.appendChild(props);

  // Hipotecas
  const hips = document.createElement('div');
  hips.textContent = 'Hipotecas: ';
  if (jugador.hipotecas && jugador.hipotecas.length) {
    jugador.hipotecas.forEach(h => {
      const span = document.createElement('span');
      span.className = 'hipotecada';
      span.textContent = h;
      hips.appendChild(span);
      hips.appendChild(document.createTextNode(', '));
    });
    hips.removeChild(hips.lastChild);
  } else {
    hips.appendChild(document.createTextNode('Ninguna'));
  }
  div.appendChild(hips);

  panel.appendChild(div);
});
}