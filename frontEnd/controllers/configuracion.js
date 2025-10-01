/**
 * CONFIGURACIÓN DE JUGADORES - ETAPA 1
 * Responsable: Persona 1
 * 
 * Este archivo contiene toda la lógica para:
 * - Gestión de jugadores (agregar, eliminar, validar)
 * - Integración con countriesService.js
 * - Formulario de configuración
 * - Validaciones de datos
 * - Navegación al tablero
 */

// ============== VARIABLES GLOBALES ==============
const jugadoresDiv = document.getElementById("jugadores");
const agregarBtn = document.getElementById("agregarBtn");
let contador = 0;
const maxJugadores = 4;
let jugadores = []; // Array para mantener los jugadores

// Fichas disponibles (emojis, pero pueden ser imágenes también)
let fichasDisponibles = ["🚗", "🎩", "🐶", "🚢", "🏠", "🛩️"];

// ============== INTEGRACIÓN CON MODAL ==============
// Función global para recibir jugadores del modal
window.agregarJugadoresDesdeModal = function(jugadoresConfig) {
    jugadores = jugadoresConfig;
    contador = jugadores.length;
    // Actualizar la referencia global
    window.jugadores = jugadores;
    actualizarListaJugadores();
    
    // Deshabilitar botón si se alcanza el máximo
    if (contador >= maxJugadores) {
        agregarBtn.disabled = true;
    }
};

// Exponer la variable jugadores globalmente para que el modal pueda accederla
window.jugadores = jugadores;

// ============== FUNCIONES DE GESTIÓN DE JUGADORES ==============

/**
 * Obtiene las fichas disponibles (no usadas por otros jugadores)
 * @returns {Array} Array de fichas disponibles
 */
function obtenerFichasDisponibles() {
    const fichasUsadas = jugadores.map(j => j.ficha);
    return fichasDisponibles.filter(ficha => !fichasUsadas.includes(ficha));
}

/**
 * Agrega un nuevo jugador al array
 * @param {string} nombre - Nickname del jugador
 * @param {string} ficha - Ficha seleccionada
 * @returns {boolean} - True si se agregó correctamente
 */
function agregarJugador(nombre, ficha) {
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
        ficha: ficha,
        dinero: 1500 // Dinero inicial según las reglas
    };

    // Agregar al array
    jugadores.push(nuevoJugador);
    contador++;

    // Actualizar la UI
    actualizarListaJugadores();

    // Deshabilitar botón si se alcanza el máximo
    if (contador >= maxJugadores) {
        agregarBtn.disabled = true;
    }

    return true;
}

/**
 * Elimina un jugador del array
 * @param {string|number} id - ID del jugador a eliminar
 */
function eliminarJugador(id) {
    jugadores = jugadores.filter(j => (j.id || Date.now()) !== id);
    contador = jugadores.length;
    actualizarListaJugadores();
    
    // Rehabilitar botón si hay espacio
    if (contador < maxJugadores) {
        agregarBtn.disabled = false;
    }
}

// ============== FUNCIONES DE UI ==============

/**
 * Actualiza la lista visual de jugadores en el DOM
 */
function actualizarListaJugadores() {
    jugadoresDiv.innerHTML = '';
    
    jugadores.forEach(jugador => {
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
                        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${obtenerNombrePais(jugador.pais)}</span>
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
    });
}

// ============== FUNCIONES DE UTILIDAD ==============

/**
 * Obtiene el nombre del país desde el código
 * Integra co../../../../../services/countriesService.js - SIN DUPLICACIÓN
 * @param {string} codigoPais - Código de país (ej: 'co', 'mx')
 * @returns {string} - Nombre completo del país
 */
function obtenerNombrePais(codigoPais) {
    // Si ya es un nombre completo, devolverlo
    if (!codigoPais || codigoPais.length > 2) {
        return codigoPais || 'País desconocido';
    }
    
    // 🎯 USAR COUNTRIESSERVICE - NO DUPLICAR DATOS
    if (typeof window.countriesService !== 'undefined' && window.countriesService.obtenerNombrePais) {
        // Usar el servicio asíncrono (pero devolver resultado síncrono para compatibilidad)
        return obtenerNombrePaisSync(codigoPais);
    }
    
    // ⚠️ Fallback SOLO si el service no está disponible
    console.warn('⚠️ countriesService no disponible, usando fallback básico');
    const fallbackPaises = {
        'co': 'Colombia', 'mx': 'México', 'ar': 'Argentina', 'es': 'España',
        'cl': 'Chile', 'pe': 'Perú', 'br': 'Brasil', 'us': 'Estados Unidos'
    };
    
    return fallbackPaises[codigoPais.toLowerCase()] || codigoPais.toUpperCase();
}

/**
 * Versión síncrona para obtener nombre de país (usa caché local)
 */
function obtenerNombrePaisSync(codigoPais) {
    // Si hay caché disponible, usarlo
    if (window.countriesCache && window.countriesCache[codigoPais.toLowerCase()]) {
        return window.countriesCache[codigoPais.toLowerCase()];
    }
    
    // Si no hay caché, devolver fallback básico
    return obtenerNombrePais(codigoPais);
}

/**
 * Actualiza el nombre de un jugador
 * @param {string|number} id - ID del jugador
 * @param {string} nuevoNombre - Nuevo nickname
 */
function actualizarNombreJugador(id, nuevoNombre) {
    const jugador = jugadores.find(j => j.id === id);
    if (jugador) {
        jugador.nombre = nuevoNombre.trim();
    }
}

/**
 * Actualiza la ficha de un jugador
 * @param {string|number} id - ID del jugador
 * @param {string} nuevaFicha - Nueva ficha seleccionada
 */
function actualizarFichaJugador(id, nuevaFicha) {
    // Verificar que la ficha no esté en uso por otro jugador
    const fichaEnUso = jugadores.some(j => j.id !== id && j.ficha === nuevaFicha);
    if (fichaEnUso) {
        if (typeof window.Toast !== 'undefined' && window.Toast) {
            window.Toast.warning("Esta ficha ya está en uso por otro jugador.", "Ficha Ocupada");
        } else {
            alert("⚠️ Esta ficha ya está en uso por otro jugador.");
        }
        actualizarListaJugadores(); // Revertir cambio
        return;
    }
    
    const jugador = jugadores.find(j => j.id === id);
    if (jugador) {
        jugador.ficha = nuevaFicha;
        actualizarListaJugadores(); // Refrescar para actualizar opciones disponibles
    }
}

// ============== FUNCIONES DE CONFIRMACIÓN ==============

/**
 * Confirma la eliminación de un jugador usando modal
 * @param {string|number} id - ID del jugador
 * @param {string} nombre - Nombre del jugador para mostrar
 */
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

// ============== VALIDACIÓN Y NAVEGACIÓN ==============

/**
 * Valida y guarda la configuración de jugadores
 * Navega al tablero si todo está correcto
 */
function guardarJugadores() {
    console.log("Función guardarJugadores ejecutada");
    console.log("Jugadores actuales:", jugadores);
    
    // VALIDACIÓN 1: Mínimo 2 jugadores
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

    // VALIDACIÓN 2: Nombres completos
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

    // VALIDACIÓN 3: Países asignados (usando countriesService.js)
    // TODO: Integrar validación con countriesService.js

    // Guardar en localStorage para el tablero
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
    console.log("Jugadores guardados en localStorage:", localStorage.getItem("jugadores"));
    
    // Navegación al tablero (manejada por app.js)
    if (typeof navegarATablero === 'function') {
        navegarATablero();
    } else {
        // Fallback directo - ruta desde la raíz de frontEnd
        location.href = "../../../../views/tablero/tablero.html";
    }
}

// ============== INTEGRACIÓN CON COUNTRIES SERVICE ==============

/**
 * Carga los países desde el servicio y los guarda en caché
 * Integra co../../../../../services/countriesService.js
 */
async function cargarPaises() {
    try {
        console.log('🌍 Cargando países desde countriesService...');
        
        if (typeof window.countriesService !== 'undefined') {
            const paises = await window.countriesService.obtenerPaises();
            const paisesObjeto = await window.countriesService.obtenerPaisesComoObjeto();
            
            // Guardar en caché global para uso síncrono
            window.countriesCache = paisesObjeto;
            
            console.log('✅ Países cargados y en caché:', Object.keys(paisesObjeto).length, 'países');
            return paises;
        } else {
            console.warn('⚠️ countriesService no disponible');
            return [];
        }
    } catch (error) {
        console.error('❌ Error al cargar países:', error);
        return [];
    }
}

// ============== INICIALIZACIÓN ==============

/**
 * Inicializa la página de configuración
 */
function inicializarConfiguracion() {
    console.log('Página de configuración inicializada');
    
    // Cargar países si el servicio está disponible
    if (typeof cargarPaises === 'function') {
        cargarPaises();
    }
    
    // Inicializar eventos del modal si está disponible
    if (typeof mostrarModalRegistroUsuarios === 'function') {
        console.log('Modal de registro disponible');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarConfiguracion);

// ============== EXPORTS PARA OTROS MÓDULOS ==============
// Exponer funciones necesarias para otros archivos
window.ConfiguracionJugadores = {
    guardarJugadores,
    obtenerJugadores: () => jugadores,
    agregarJugador,
    eliminarJugador,
    validarConfiguracion: () => jugadores.length >= 2
};
