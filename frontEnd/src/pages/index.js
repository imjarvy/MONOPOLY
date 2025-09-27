import { IndexController } from '../controllers/indexController.js';

// ============== VARIABLES GLOBALES (para compatibilidad) ==============
const jugadoresDiv = document.getElementById("jugadores");
const agregarBtn = document.getElementById("agregarBtn");
let contador = 0;
const maxJugadores = 4;
let jugadores = [];

// ============== INICIALIZACIÓN DEL CONTROLADOR ==============
let indexController;

document.addEventListener('DOMContentLoaded', function() {
    indexController = new IndexController();
    console.log('🎮 Index Controller inicializado');
});

// ============== FUNCIONES GLOBALES (para compatibilidad con tu código actual) ==============

function obtenerFichasDisponibles() {
    const fichasUsadas = jugadores.map(j => j.ficha);
    const fichasDisponibles = ["🚗", "🎩", "🐶", "🚢", "🏠", "🛩️"];
    return fichasDisponibles.filter(ficha => !fichasUsadas.includes(ficha));
}

async function agregarJugador(nombre, ficha) {
    if (indexController) {
        return await indexController.agregarJugador(nombre, ficha);
    }
    return false;
}

async function eliminarJugador(id) {
    if (indexController) {
        await indexController.eliminarJugador(id);
    }
}

function actualizarNombreJugador(id, nuevoNombre) {
    if (indexController) {
        indexController.actualizarNombreJugador(id, nuevoNombre);
    }
}

async function actualizarFichaJugador(id, nuevaFicha) {
    if (indexController) {
        await indexController.actualizarFichaJugador(id, nuevaFicha);
    }
}

function confirmarEliminarJugador(id, nombre) {
    if (typeof mostrarModalConfirmacion === 'function') {
        mostrarModalConfirmacion(
            `¿Estás seguro de que quieres eliminar a <strong>${nombre}</strong>?`,
            () => eliminarJugador(id)
        );
    } else {
        if (confirm(`¿Eliminar a ${nombre}?`)) {
            eliminarJugador(id);
        }
    }
}

function guardarJugadores() {
    if (indexController) {
        indexController.guardarJugadores();
    }
}

// ============== FUNCIONES DE TESTING ==============
function probarTodosLosToasts() {
    console.log("Probando todos los toasts...");
    
    if (typeof window.Toast !== 'undefined' && window.Toast) {
        const tests = [
            { type: 'success', message: "¡Operación completada exitosamente!", title: "Éxito", delay: 0 },
            { type: 'info', message: "Esta es una notificación informativa", title: "Información", delay: 1000 },
            { type: 'warning', message: "Ten cuidado con esta acción", title: "Advertencia", delay: 2000 },
            { type: 'error', message: "Ha ocurrido un error en el sistema", title: "Error", delay: 3000 },
            { type: 'info', message: "Toast simple sin título", title: "", delay: 4000 }
        ];

        tests.forEach(test => {
            setTimeout(() => {
                window.Toast[test.type](test.message, test.title);
            }, test.delay);
        });
        
        console.log("✅ Todos los toasts han sido programados");
    } else {
        console.error("❌ Toast no está disponible");
        alert("El sistema de Toast no está disponible");
    }
}

// ============== EXPOSICIÓN GLOBAL PARA COMPATIBILIDAD ==============
window.obtenerFichasDisponibles = obtenerFichasDisponibles;
window.agregarJugador = agregarJugador;
window.eliminarJugador = eliminarJugador;
window.actualizarNombreJugador = actualizarNombreJugador;
window.actualizarFichaJugador = actualizarFichaJugador;
window.confirmarEliminarJugador = confirmarEliminarJugador;
window.guardarJugadores = guardarJugadores;
window.probarTodosLosToasts = probarTodosLosToasts;