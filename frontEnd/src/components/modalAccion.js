// /src/components/modalAccion.js
// Componente para mostrar acciones y mensajes al usuario en el juego Monopoly

/**
 * Muestra un modal de acción con mensaje y botones
 * @param {string} mensaje - Mensaje a mostrar
 * @param {Array} acciones - Acciones disponibles [{texto, callback}]
 */
export function mostrarModalAccion(mensaje, acciones = []) {
  // Crear modal en el DOM
  let modal = document.createElement('div');
  modal.className = 'modal-accion';
  modal.innerHTML = `
    <div class="modal-accion-contenido">
      <p>${mensaje}</p>
      <div class="modal-accion-botones"></div>
    </div>
  `;
  // Agregar botones
  const botonesDiv = modal.querySelector('.modal-accion-botones');
  acciones.forEach(({ texto, callback }) => {
    const btn = document.createElement('button');
    btn.textContent = texto;
    btn.onclick = () => {
      callback();
      document.body.removeChild(modal);
    };
    botonesDiv.appendChild(btn);
  });
  // Agregar modal al body
  document.body.appendChild(modal);
}

// Ejemplo de uso:
// mostrarModalAccion('¿Quieres comprar esta propiedad?', [
//   { texto: 'Sí', callback: () => comprarPropiedad(jugador, propiedad) },
//   { texto: 'No', callback: () => {/* ... */} }
// ]);
