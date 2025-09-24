const jugadoresDiv = document.getElementById("jugadores");
const agregarBtn = document.getElementById("agregarBtn");
let contador = 0;
const maxJugadores = 4;
let jugadores = []; // Array para mantener los jugadores



// Función global para recibir jugadores del modal
window.agregarJugadoresDesdeModal = async function(jugadoresConfig) {
    jugadores = jugadoresConfig;
    contador = jugadores.length;
    // Actualizar la referencia global
    window.jugadores = jugadores;
    await actualizarListaJugadores();
    
    // Deshabilitar botón si se alcanza el máximo
    if (contador >= maxJugadores) {
        agregarBtn.disabled = true;
    }
};

// Exponer la variable jugadores globalmente para que el modal pueda accederla
window.jugadores = jugadores;

// Función para obtener fichas disponibles (no usadas)
function obtenerFichasDisponibles() {
    const fichasUsadas = jugadores.map(j => j.ficha);
    return fichasDisponibles.filter(ficha => !fichasUsadas.includes(ficha));
}

// Función refactorizada para agregar jugador
async function agregarJugador(nombre, ficha) {
    if (contador >= maxJugadores) {
        if (typeof window.Toast !== 'undefined' && window.Toast) {
            window.Toast.warning("Ya tienes el máximo de jugadores permitidos (4).", "Límite Alcanzado");
        } else {
            alert("⚠️ Ya tienes el máximo de jugadores permitidos (4).");
        }
        return false;
    }

    // Verificar que la ficha no esté en uso
    if (jugadores.some(j => j.ficha === ficha)) {
        if (typeof window.Toast !== 'undefined' && window.Toast) {
            window.Toast.warning("Esta ficha ya está en uso. Elige otra ficha.", "Ficha Ocupada");
        } else {
            alert("⚠️ Esta ficha ya está en uso. Elige otra ficha.");
        }
        return false;
    }

    // Crear objeto jugador
    const nuevoJugador = {
        id: Date.now(), // ID único
        nombre: nombre.trim(),
        ficha: ficha
    };

    // Agregar al array
    jugadores.push(nuevoJugador);
    contador++;

    // Actualizar la UI
    await actualizarListaJugadores();

    // Deshabilitar botón si se alcanza el máximo
    if (contador >= maxJugadores) {
        agregarBtn.disabled = true;
    }

    return true;
}

// Función para eliminar jugador
async function eliminarJugador(id) {
    jugadores = jugadores.filter(j => (j.id || Date.now()) !== id);
    contador = jugadores.length;
    await actualizarListaJugadores();
    
    // Rehabilitar botón si hay espacio
    if (contador < maxJugadores) {
        agregarBtn.disabled = false;
    }
}

// Función para actualizar la lista visual de jugadores
async function actualizarListaJugadores() {
    jugadoresDiv.innerHTML = '';
    
    // Procesar jugadores de forma asíncrona para obtener nombres de países
    for (const jugador of jugadores) {
        let nombrePais = jugador.pais ? jugador.pais.toUpperCase() : 'PAÍS';
        
        // Intentar obtener el nombre completo del país si countriesService está disponible
        if (typeof window.countriesService !== 'undefined') {
            try {
                nombrePais = await window.countriesService.obtenerNombrePais(jugador.pais);
            } catch (error) {
                console.warn('Error al obtener nombre del país:', error);
                nombrePais = jugador.pais ? jugador.pais.toUpperCase() : 'PAÍS';
            }
        }
        // coge la informacion del JS y lo une con lo que le mando desde el HTML
        const div = document.createElement("div");
        div.className = "jugador-card";
        div.innerHTML = `
            <div style="
                position: relative;
                width: 100%;
                max-width: 480px;
                min-height: 88px;
                height: 88px;
                background: linear-gradient(135deg, #ffffff, #f8fafc);
                border-radius: 16px;
                border-left: 5px solid ${jugador.color || '#e5e7eb'};
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                display: flex;
                align-items: center;
                padding: 0 20px 0 20px;
                transition: all 0.3s ease;
                cursor: default;
                margin: 0 auto;
            " 
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.12)'"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'">
                
                <!-- Ficha del jugador -->
                <div style="
                    width: 56px;
                    height: 56px;
                    min-width: 56px;
                    background: linear-gradient(135deg, ${jugador.color}15, ${jugador.color}25);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8em;
                    margin-right: 16px;
                    border: 2px solid ${jugador.color}40;
                ">
                    ${jugador.ficha}
                </div>
                
                <!-- Información del jugador -->
                <div style="flex: 1; text-align: left; min-width: 0; padding-right: 50px;">
                    <div style="
                        font-size: 1.1em;
                        font-weight: 600;
                        color: #1f2937;
                        margin-bottom: 4px;
                        letter-spacing: 0.3px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    ">${jugador.nickname}</div>
                    <div style="
                        font-size: 0.85em;
                        color: #6b7280;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        flex-wrap: wrap;
                    ">
                        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${nombrePais}</span>
                        <span style="
                            background: #10b98120;
                            color: #059669;
                            padding: 2px 8px;
                            border-radius: 6px;
                            font-weight: 500;
                            font-size: 0.8em;
                            white-space: nowrap;
                        ">$${jugador.dinero}</span>
                    </div>
                </div>
                
                <!-- Botón eliminar -->
                <button onclick="confirmarEliminarJugador('${jugador.id || Date.now()}', '${jugador.nickname}')" 
                        style="
                            position: absolute;
                            top: 12px;
                            right: 12px;
                            width: 28px;
                            height: 28px;
                            min-width: 28px;
                            background: linear-gradient(135deg, #ffffff, #f8fafc);
                            color: #9ca3af;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            font-size: 0.9em;
                            font-weight: 500;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.3s ease;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                            z-index: 10;
                        " 
                        onmouseover="this.style.background='linear-gradient(135deg, #fef2f2, #fee2e2)'; this.style.color='#dc2626'; this.style.borderColor='#fca5a5'; this.style.transform='scale(1.05)'"
                        onmouseout="this.style.background='linear-gradient(135deg, #ffffff, #f8fafc)'; this.style.color='#9ca3af'; this.style.borderColor='#e5e7eb'; this.style.transform='scale(1)'"
                        title="Eliminar jugador">×</button>
            </div>
        `;
        jugadoresDiv.appendChild(div);
    }
}



// Función para actualizar nombre de jugador
function actualizarNombreJugador(id, nuevoNombre) {
    const jugador = jugadores.find(j => j.id === id);
    if (jugador) {
        jugador.nombre = nuevoNombre.trim();
    }
}

// Función para actualizar ficha de jugador
async function actualizarFichaJugador(id, nuevaFicha) {
    // Verificar que la ficha no esté en uso por otro jugador
    const fichaEnUso = jugadores.some(j => j.id !== id && j.ficha === nuevaFicha);
    if (fichaEnUso) {
        if (typeof window.Toast !== 'undefined' && window.Toast) {
            window.Toast.warning("Esta ficha ya está en uso por otro jugador.", "Ficha Ocupada");
        } else {
            alert("⚠️ Esta ficha ya está en uso por otro jugador.");
        }
        await actualizarListaJugadores(); // Revertir cambio
        return;
    }
    
    const jugador = jugadores.find(j => j.id === id);
    if (jugador) {
        jugador.ficha = nuevaFicha;
        await actualizarListaJugadores(); // Refrescar para actualizar opciones disponibles
    }
}

// Función para confirmar eliminación (usando el modal)
function confirmarEliminarJugador(id, nombre) {
    if (typeof mostrarModalConfirmacion === 'function') {
        mostrarModalConfirmacion(
            `¿Estás seguro de que quieres eliminar a <strong>${nombre}</strong>?`,
            () => eliminarJugador(id)
        );
    } else {
        // Fallback si el modal no está disponible
        if (confirm(`¿Eliminar a ${nombre}?`)) {
            eliminarJugador(id);
        }
    }
}

// Event listener removido - ahora se maneja con onclick en el HTML

function guardarJugadores() {
    console.log("Función guardarJugadores ejecutada");
    console.log("Jugadores actuales:", jugadores);
    
    if (jugadores.length < 2) {
        if (typeof mostrarModalInfo === 'function') {
            mostrarModalInfo('Jugadores Insuficientes', 'Se necesitan al menos 2 jugadores para comenzar el juego.');
        } else if (typeof window.Toast !== 'undefined' && window.Toast) {
            window.Toast.warning("Se necesitan al menos 2 jugadores para comenzar.", "Jugadores Insuficientes");
        } else {
            alert("⚠️ Se necesitan al menos 2 jugadores para comenzar.");
        }
        return;
    }

    // Verificar nombres vacíos
    const nombresVacios = jugadores.filter(j => !j.nickname || j.nickname.trim() === '');
    if (nombresVacios.length > 0) {
        if (typeof mostrarModalInfo === 'function') {
            mostrarModalInfo('Nombres Incompletos', 'Todos los jugadores deben tener un nombre.');
        } else if (typeof window.Toast !== 'undefined' && window.Toast) {
            window.Toast.warning("Todos los jugadores deben tener un nombre.", "Nombres Incompletos");
        } else {
            alert("⚠️ Todos los jugadores deben tener un nombre.");
        }
        return;
    }

    // Guardamos en localStorage para usar en el tablero
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    console.log("Jugadores guardados en localStorage:", localStorage.getItem("jugadores"));
    location.href = "src/components/tablero/tablero.html";
}
