const areaDados = document.getElementById('area-dados');

// Variables para el resultado de dados
let ultimoLanzamiento = { dado1: 0, dado2: 0, total: 0 };

function crearDados() {
  // El dadosModal.js se encargará de crear la interfaz mejorada
  // Esta función queda como fallback por compatibilidad
  if (typeof mostrarModalDados === 'function') {
    areaDados.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <button class="btn btn-primary btn-lg" onclick="mostrarModalDados()" 
                style="background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 25px; padding: 15px 25px; font-weight: 600; box-shadow: 0 4px 15px rgba(102,126,234,0.4); color: white;">
          🎲 Lanzar Dados
        </button>
        <div id="ultimo-resultado" style="margin-top: 15px; font-size: 0.9em; color: #666;">
          Presiona para lanzar los dados
        </div>
      </div>
    `;
  } else {
    // Fallback a la versión original si el modal no está disponible
    areaDados.innerHTML = `
      <button class="btn btn-primary" id="btn-lanzar">Lanzar Dados</button>
      <input type="number" id="dado1" min="1" max="6" placeholder="Manual Dado 1" style="width:60px">
      <input type="number" id="dado2" min="1" max="6" placeholder="Manual Dado 2" style="width:60px">
      <div id="resultado-dados"></div>
    `;

    document.getElementById('btn-lanzar').onclick = () => {
      let dado1 = parseInt(document.getElementById('dado1').value) || (Math.floor(Math.random() * 6) + 1);
      let dado2 = parseInt(document.getElementById('dado2').value) || (Math.floor(Math.random() * 6) + 1);
      ultimoLanzamiento = { dado1, dado2, total: dado1 + dado2 };
      document.getElementById('resultado-dados').textContent = `Resultado: ${dado1} + ${dado2} = ${ultimoLanzamiento.total}`;
      // TODO: Mover la ficha del jugador actual según la suma
      if (typeof moverJugador === 'function') {
        moverJugador(ultimoLanzamiento.total, ultimoLanzamiento);
      }
    };
  }
}

// Función para que otros archivos puedan acceder al último resultado
function obtenerUltimoLanzamiento() {
  return ultimoLanzamiento;
}

// Función para mover jugador (placeholder) - Integrada con el modal
function moverJugador(espacios, datosLanzamiento) {
  console.log(`🎯 Moviendo jugador ${espacios} espacios:`, datosLanzamiento);
  
  // Actualizar el ultimo lanzamiento local
  ultimoLanzamiento = datosLanzamiento;
  
  // Aquí se integrará con la lógica del tablero
  // Por ahora solo mostramos el resultado
  const resultadoDiv = document.getElementById('ultimo-resultado');
  if (resultadoDiv) {
    resultadoDiv.innerHTML = `
      <strong>Último lanzamiento:</strong><br>
      🎲 ${datosLanzamiento.dado1} + ${datosLanzamiento.dado2} = ${datosLanzamiento.total}
      ${datosLanzamiento.dado1 === datosLanzamiento.dado2 ? '<br>🎉 ¡Dobles!' : ''}
    `;
  }
}

// Función para integrar con el modal (se ejecutará cuando esté disponible)
function integrarModalDados() {
  // El modal debe cargar después, así que esperamos a que esté disponible
  if (typeof mostrarModalDados === 'function') {
    crearDados();
  } else {
    // Reintentar en 200ms
    setTimeout(integrarModalDados, 200);
  }
}

// Hacer funciones disponibles globalmente
window.moverJugador = moverJugador;
window.obtenerUltimoLanzamiento = obtenerUltimoLanzamiento;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // Usar integración con modal si está disponible
  setTimeout(integrarModalDados, 100);
});