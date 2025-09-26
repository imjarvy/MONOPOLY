// modal.js
const modal = document.getElementById("modalAccion");
const cerrarModal = document.getElementById("cerrarModal");
const modalTitulo = document.getElementById("modalTitulo");
const modalMensaje = document.getElementById("modalMensaje");
const modalBotones = document.getElementById("modalBotones");

// Verifica que todos los elementos existen
if (!modal || !cerrarModal || !modalTitulo || !modalMensaje || !modalBotones) {
  console.error("[Modal] Algún elemento del modal no se encontró en el DOM.");
}

// Mostrar modal con opciones dinámicas
export function mostrarModal(titulo, mensaje, botones = []) {
  if (!modal || !modalTitulo || !modalMensaje || !modalBotones) return;
  modalTitulo.textContent = titulo;
  modalMensaje.textContent = mensaje;
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

cerrarModal.onclick = () => { if (modal) modal.style.display = "none"; };
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
