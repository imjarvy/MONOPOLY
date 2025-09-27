import { moverFichaActual } from '../../controllers/gameController.js';
const areaDados = document.getElementById('area-dados');

/**
 * Componente visual y lógico para lanzar los dados.
 * Integrado con el sistema Toast y Modal de dados para una experiencia moderna.
 * Se monta en el contenedor #area-dados.
 */
function crearDados() {
  areaDados.innerHTML = '';

  const btn = document.createElement('button');
  btn.className = 'btn btn-primary btn-lg';
  btn.id = 'btn-lanzar';
  btn.innerHTML = '🎲 Lanzar Dados';
  btn.style.width = '100%';
  btn.style.marginBottom = '15px';
  areaDados.appendChild(btn);

  const info = document.createElement('div');
  info.className = 'alert alert-info';
  info.innerHTML = '<small><strong>🎮 Nuevo:</strong> Experiencia de dados modernizada con animaciones y notificaciones visuales.</small>';
  areaDados.appendChild(info);

  // Event listener que abre el modal de dados
  document.getElementById('btn-lanzar').onclick = () => {
    // Verificar que el modal esté disponible
    if (window.Modal) {
      window.Modal.show();
    } else {
      // Fallback a funcionalidad original si el modal no está disponible
      lanzarDadosOriginal();
    }
  };
}

/**
 * Funcionalidad original de dados como fallback
 */
function lanzarDadosOriginal() {
  let dado1 = Math.floor(Math.random() * 6) + 1;
  let dado2 = Math.floor(Math.random() * 6) + 1;
  
  if (window.Toast) {
    window.Toast.info(`Resultado: ${dado1} + ${dado2} = ${dado1 + dado2}`, "Dados");
    if (dado1 === dado2) {
      window.Toast.success("¡Dobles! Puedes lanzar otra vez.", "¡Excelente!");
    }
  }
  
  moverFichaActual(dado1 + dado2);
}

// Exponer función para el modal
window.moverFichaActual = moverFichaActual;

crearDados();