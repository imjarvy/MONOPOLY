import { moverFichaActual } from '../../app.js';
const areaDados = document.getElementById('area-dados');


/**
 * Componente visual y lógico para lanzar los dados.
 * Al lanzar, llama a moverFichaActual(casillas) desde app.js para mover la ficha del jugador actual.
 * Se monta en el contenedor #area-dados.
 */
function crearDados() {
  areaDados.innerHTML = `
    <button class="btn btn-primary" id="btn-lanzar">Lanzar Dados</button>
    <input type="number" id="dado1" min="1" max="6" placeholder="Manual Dado 1" style="width:60px">
    <input type="number" id="dado2" min="1" max="6" placeholder="Manual Dado 2" style="width:60px">
    <div id="resultado-dados"></div>
  `;

  document.getElementById('btn-lanzar').onclick = () => {
    let dado1 = parseInt(document.getElementById('dado1').value) || (Math.floor(Math.random() * 6) + 1);
    let dado2 = parseInt(document.getElementById('dado2').value) || (Math.floor(Math.random() * 6) + 1);
    document.getElementById('resultado-dados').textContent = `Resultado: ${dado1} + ${dado2} = ${dado1 + dado2}`;
    moverFichaActual(dado1 + dado2); // Llama la función de movimiento
  };
}

crearDados();