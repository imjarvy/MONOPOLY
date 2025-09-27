/**
 * Controlador principal para la página index (NO confundir con backend service)
 */
import { JugadorHelper } from '../utils/jugadorHelper.js';
import { JugadorValidator } from '../validators/jugadorValidator.js';
import { JugadorRenderer } from '../renderers/jugadorRenderer.js';

const CONFIG = {
    maxJugadores: 4,
    dineroInicial: 1500,
    fichasDisponibles: ["🚗", "🎩", "🐶", "🚢", "🏠", "🛩️"],
    coloresDisponibles: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
};

export class IndexController {
    constructor() {
        this.jugadorHelper = new JugadorHelper(CONFIG);
        this.validator = new JugadorValidator(CONFIG);
        this.renderer = new JugadorRenderer(document.getElementById("jugadores"));
        
        this.jugadores = [];
        this.contador = 0;
        
        this.initializeEventListeners();
        this.exposeGlobalMethods();
    }

    initializeEventListeners() {
        const agregarBtn = document.getElementById("agregarBtn");
        if (agregarBtn) {
            agregarBtn.addEventListener("click", () => this.mostrarModalAgregarJugador());
        }
    }

    exposeGlobalMethods() {
        // Exponer métodos necesarios para compatibilidad
        window.jugadores = this.jugadores;
        window.agregarJugadoresDesdeModal = (jugadoresConfig) => this.agregarJugadoresDesdeModal(jugadoresConfig);
        window.indexController = this;
    }

    mostrarModalAgregarJugador() {
        // Tu lógica actual del modal se mantiene
        console.log('Mostrando modal para agregar jugador');
    }

    async agregarJugadoresDesdeModal(jugadoresConfig) {
        this.jugadores = jugadoresConfig;
        this.contador = this.jugadores.length;
        window.jugadores = this.jugadores;
        
        await this.renderer.renderizarLista(this.jugadores);
        this.actualizarEstadoBotones();
    }

    async agregarJugador(nickname, ficha) {
    if (!this.validator.validarAgregarJugador(this.contador)) {
        return false;
    }

    if (!this.validator.validarFichaUnica(ficha, null, this.jugadores)) {
        return false;
    }

    // ✅ CREAR CON SOLO NICKNAME
    const nuevoJugador = this.jugadorHelper.crearJugadorVacio(nickname);
    nuevoJugador.ficha = ficha;

    this.jugadores.push(nuevoJugador);
    this.contador++;

    await this.renderer.renderizarLista(this.jugadores);
    this.actualizarEstadoBotones();

    return true;
}

    async eliminarJugador(id) {
        const jugadorEliminado = this.jugadores.find(j => j.id == id);
        this.jugadores = this.jugadores.filter(j => j.id != id);
        this.contador = this.jugadores.length;
        
        await this.renderer.renderizarLista(this.jugadores);
        this.actualizarEstadoBotones();

        if (jugadorEliminado && window.Toast) {
            window.Toast.info(`${jugadorEliminado.nickname} ha sido eliminado.`);
        }
    }

    actualizarEstadoBotones() {
        const agregarBtn = document.getElementById("agregarBtn");
        if (agregarBtn) {
            agregarBtn.disabled = this.contador >= CONFIG.maxJugadores;
        }
    }

    guardarJugadores() {
    // ✅ DEBUGGING COMPLETO
    console.log('🎮 GUARDANDO JUGADORES - DEBUG:');
    console.log('👥 this.jugadores:', this.jugadores);
    console.log('📊 this.contador:', this.contador);
    console.log('🌐 window.jugadores:', window.jugadores);
    
    // ✅ USAR window.jugadores como fallback
    const jugadoresAValidar = this.jugadores.length > 0 ? this.jugadores : window.jugadores || [];
    
    console.log('✅ Jugadores a validar:', jugadoresAValidar);
    
    if (!this.validator.validarJugadoresParaJugar(jugadoresAValidar)) {
        return;
    }

    localStorage.setItem("jugadores", JSON.stringify(jugadoresAValidar));
    
    if (window.Toast) {
        window.Toast.success(`¡${jugadoresAValidar.length} jugadores listos para jugar!`);
    }

    setTimeout(() => {
        location.href = "./src/components/tablero/tablero.html";
    }, 1500);
}

    // Métodos para compatibilidad con tu código actual
    actualizarNombreJugador(id, nuevoNickname) {
    const jugador = this.jugadores.find(j => j.id === id);
    if (jugador) {
        jugador.nickname = nuevoNickname.trim();  // ✅ Solo actualizar nickname
    }
}
    async actualizarFichaJugador(id, nuevaFicha) {
        if (!this.validator.validarFichaUnica(nuevaFicha, id, this.jugadores)) {
            await this.renderer.renderizarLista(this.jugadores);
            return;
        }
        
        const jugador = this.jugadores.find(j => j.id === id);
        if (jugador) {
            jugador.ficha = nuevaFicha;
            await this.renderer.renderizarLista(this.jugadores);
        }
    }
}