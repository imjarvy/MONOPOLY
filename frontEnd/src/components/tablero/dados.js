import { moverFichaActual } from '../../app.js';
const areaDados = document.getElementById('area-dados');


/**
 * Componente visual y lógico para lanzar los dados.
 * Al lanzar, llama a moverFichaActual(casillas) desde app.js para mover la ficha del jugador actual.
 * Se monta en el contenedor #area-dados.
 */
function crearDados() {
 areaDados.innerHTML = '';

const btn = document.createElement('button');
btn.className = 'btn btn-primary';
btn.id = 'btn-lanzar';
btn.textContent = 'Lanzar Dados';
areaDados.appendChild(btn);

const input1 = document.createElement('input');
input1.type = 'number';
input1.id = 'dado1';
input1.min = 1;
input1.max = 6;
input1.placeholder = 'Manual Dado 1';
input1.style.width = '60px';
areaDados.appendChild(input1);

const input2 = document.createElement('input');
input2.type = 'number';
input2.id = 'dado2';
input2.min = 1;
input2.max = 6;
input2.placeholder = 'Manual Dado 2';
input2.style.width = '60px';
areaDados.appendChild(input2);

const resultado = document.createElement('div');
resultado.id = 'resultado-dados';
areaDados.appendChild(resultado);

// Listeners y lógica igual que antes

  document.getElementById('btn-lanzar').onclick = () => {
    let dado1 = parseInt(document.getElementById('dado1').value) || (Math.floor(Math.random() * 6) + 1);
    let dado2 = parseInt(document.getElementById('dado2').value) || (Math.floor(Math.random() * 6) + 1);
    document.getElementById('resultado-dados').textContent = `Resultado: ${dado1} + ${dado2} = ${dado1 + dado2}`;
    moverFichaActual(dado1 + dado2); // Llama la función de movimiento
  };
}

crearDados();