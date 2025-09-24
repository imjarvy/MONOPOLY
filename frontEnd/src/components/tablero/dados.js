const areaDados = document.getElementById('area-dados');

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
    // TODO: Mover la ficha del jugador actual según la suma
  };
}

crearDados();