const jugadoresDiv = document.getElementById("jugadores");
const agregarBtn = document.getElementById("agregarBtn");
let contador = 0;
const maxJugadores = 4;

// Fichas disponibles (emojis, pero pueden ser imágenes también)
let fichasDisponibles = ["🚗", "🎩", "🐶", "🚢", "🏠", "🛩️"];

function crearJugador(nombre = `Jugador ${contador + 1}`) {
    if (contador >= maxJugadores) return;

    contador++;

    const div = document.createElement("div");
    div.className = "jugador";

    const input = document.createElement("input");
    input.type = "text";
    input.value = nombre;

    // Menú de fichas
    const select = document.createElement("select");
    fichasDisponibles.forEach(f => {
        const option = document.createElement("option");
        option.value = f;
        option.textContent = f;
        select.appendChild(option);
    });

    const acciones = document.createElement("div");
    acciones.className = "acciones";

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "❌";
    eliminarBtn.title = "Eliminar jugador";
    eliminarBtn.onclick = () => {
        const nombreJugador = div.querySelector("input").value.trim() || `Jugador ${contador}`;
        jugadoresDiv.removeChild(div);
        contador--;
        if (contador < maxJugadores) agregarBtn.disabled = false;
        
        if (window.Toast) {
            window.Toast.info(`${nombreJugador} ha sido eliminado.`, "Jugador Eliminado");
        }
    };

    acciones.appendChild(eliminarBtn);

    div.appendChild(input);
    div.appendChild(select);
    div.appendChild(acciones);

    jugadoresDiv.appendChild(div);

    if (contador >= maxJugadores) {
        agregarBtn.disabled = true;
    }
}

agregarBtn.addEventListener("click", () => {
    if (contador < maxJugadores) {
        crearJugador();
        if (window.Toast) {
            window.Toast.success(`Jugador ${contador} agregado correctamente.`, "Nuevo Jugador");
        }
        if (contador >= maxJugadores && window.Toast) {
            window.Toast.info("Has alcanzado el máximo de 4 jugadores.", "Límite Alcanzado");
        }
    }
});

function guardarJugadores() {
    const jugadores = [];
    const fichasUsadas = new Set();
    let hayRepetidos = false;

    document.querySelectorAll(".jugador").forEach(div => {
        const nombre = div.querySelector("input").value.trim();
        const ficha = div.querySelector("select").value;

        // Revisar si ya está usada
        if (fichasUsadas.has(ficha)) {
            hayRepetidos = true;
        } else {
            fichasUsadas.add(ficha);
        }
        jugadores.push({ nombre, ficha });
    });
    if (hayRepetidos) {
        if (window.Toast) {
            window.Toast.warning("Cada jugador debe tener una ficha diferente. Cambia las fichas repetidas antes de jugar.", "Fichas Repetidas");
        } else {
            alert("⚠️ Cada jugador debe tener una ficha diferente. Cambia las fichas repetidas antes de jugar.");
        }
        return; 
    }
    if (jugadores.length < 2) {
        if (window.Toast) {
            window.Toast.error("Se necesitan al menos 2 jugadores para comenzar.", "Jugadores Insuficientes");
        } else {
            alert("⚠️ Se necesitan al menos 2 jugadores para comenzar.");
        }
        return;
    }
    
    // Notificación de éxito
    if (window.Toast) {
        window.Toast.success(`¡Perfecto! ${jugadores.length} jugadores listos para jugar.`, "Iniciando Juego");
    }
    
    // Guardamos en localStorage para usar en el tablero
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    
    // Pequeña demora para mostrar el toast antes de redirigir
    setTimeout(() => {
        location.href = "./src/components/tablero/tablero.html"; // Redirigir al tablero
    }, 1000);
}