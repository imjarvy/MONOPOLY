const modal = document.getElementById("modalAccion");
const cerrarModal = document.getElementById("cerrarModal");
const modalTitulo = document.getElementById("modalTitulo");
const modalMensaje = document.getElementById("modalMensaje");
const modalBotones = document.getElementById("modalBotones");

// Mostrar modal con opciones dinámicas
export function mostrarModal(titulo, mensaje, botones = []) {
  modalTitulo.textContent = titulo;
  modalMensaje.textContent = mensaje;

  // limpiar botones anteriores
  modalBotones.innerHTML = "";

  botones.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.texto;
    btn.onclick = () => {
      b.accion();
      modal.style.display = "none";
    };
    modalBotones.appendChild(btn);
  });

  modal.style.display = "flex";
}

cerrarModal.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
