document.querySelector('button').addEventListener('click', function() {
  const nombre = document.querySelector('input[placeholder="Ingrese su Nombre"]').value.trim();
  const pais = document.querySelector('input[placeholder="Ingrese su Pais"]').value.trim();
  const figura = document.getElementById('figuras').value;
  const color = document.getElementById('colores').value;
  const form = document.querySelector('form');
  const jugadores = [];
  if (!nombre) { alert("Por favor ingresa un nombre."); return; }
    if (!pais) { alert("Por favor selecciona un país."); return; }
    if (!figura) { alert("Por favor elige una ficha."); return; }
    if (!color) { alert("Por favor elige un color."); return; }

    if (jugadores.some((j) => j.nombre === nombre)) { alert("Ese nombre ya fue usado."); return; }
    if (jugadores.some((j) => j.pais === pais)) { alert("Ese país ya fue elegido."); return; }
    if (jugadores.some((j) => j.figura === figura)) { alert("Esa ficha ya fue elegida."); return; }
    if (jugadores.some((j) => j.color === color)) { alert("Ese color ya fue elegido."); return; }

    // Si todo está bien, se puede enviar o procesar el formulario
    form.submit();
});