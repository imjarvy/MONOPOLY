import { TableroRenderer } from '../renderers/tableroRenderer.js';
import { CasillaFactory } from '../factories/casillaFactory.js';
import { FichasManager } from '../managers/fichasManager.js';
import { TableroValidator } from '../validators/tableroValidator.js';
import { TableroHelper } from '../utils/tableroHelper.js';

/**
 * Controlador principal del tablero (patrón MVC)
 */
export class TableroController {
    constructor() {
        this.tableroElement = document.querySelector('.tablero');
        
        // Inicializar componentes
        this.renderer = new TableroRenderer(this.tableroElement);
        this.casillaFactory = new CasillaFactory();
        this.fichasManager = new FichasManager(this.tableroElement);
        this.validator = new TableroValidator();
        this.helper = new TableroHelper();
        
        // Estado del juego
        this.turnoActual = 0;
        this.jugadores = [];
        this.boardData = null;
        
        this.exposeGlobalMethods();
    }

    async inicializar() {
        try {
            console.log('🎲 Inicializando controlador del tablero...');
            
            // Validaciones iniciales
            if (!this.validator.validarElementoTablero(this.tableroElement)) {
                this.validator.mostrarErrores();
                return;
            }

            // ✅ MEJORADO: Obtener y validar jugadores con mejor logging
            this.jugadores = this.obtenerJugadoresDesdeStorage();
            
            // ✅ MEJORADO: Debug detallado del problema
            if (!this.jugadores) {
                console.error('❌ No se pudieron obtener jugadores del localStorage');
                console.log('📊 localStorage actual:', localStorage.getItem("jugadores"));
                this.redirigirAlInicio();
                return;
            }

            console.log('📋 Jugadores obtenidos del storage:', this.jugadores);

            if (!this.validator.validarJugadores(this.jugadores)) {
                console.error('❌ Validación de jugadores falló');
                console.log('📊 Errores de validación:', this.validator.obtenerErrores());
                this.validator.mostrarErrores();
                this.redirigirAlInicio();
                return;
            }

            // Renderizar tablero
            await this.cargarYRenderizarTablero();
            
            // Inicializar sistema de juego
            this.inicializarSistemaJuego();
            
            // Mostrar notificación de éxito
            this.mostrarNotificacionExito();
            
        } catch (error) {
            this.manejarError(error);
        }
    }

    async cargarYRenderizarTablero() {
        try {
            // Importar getBoard dinámicamente para evitar problemas de módulos
            const { getBoard } = await import('../services/boardService.js');
            
            this.boardData = await getBoard();
            
            if (!this.validator.validarDatosTablero(this.boardData)) {
                throw new Error('Datos del tablero inválidos');
            }

            // Crear todas las casillas usando Factory
            const casillasPorSeccion = this.crearTodasLasCasillas();
            
            // Renderizar en el DOM
            this.renderer.limpiarTablero();
            this.renderer.renderizarTodasLasCasillas(casillasPorSeccion);
            
            console.log('✅ Tablero renderizado correctamente');

        } catch (error) {
            throw new Error(`Error cargando tablero: ${error.message}`);
        }
    }

    crearTodasLasCasillas() {
        return {
            bottom: this.boardData.bottom.map((casilla, idx) => 
                this.casillaFactory.crearCasilla(casilla, idx, 'bottom')
            ),
            left: this.boardData.left.map((casilla, idx) => 
                this.casillaFactory.crearCasilla(casilla, idx, 'left')
            ),
            top: this.boardData.top.map((casilla, idx) => 
                this.casillaFactory.crearCasilla(casilla, idx, 'top')
            ),
            right: this.boardData.right.map((casilla, idx) => 
                this.casillaFactory.crearCasilla(casilla, idx, 'right')
            )
        };
    }

    inicializarSistemaJuego() {
        // ✅ MEJORADO: Asegurar que todos los jugadores tengan posición inicial
        this.jugadores = this.jugadores.map(jugador => {
            if (typeof jugador.posicion === 'undefined' || jugador.posicion === null) {
                console.log(`🎯 Asignando posición inicial (0) a ${jugador.nickname}`);
                jugador.posicion = 0; // Todos empiezan en SALIDA
            }
            return jugador;
        });

        console.log('📍 Jugadores con posiciones asignadas:', this.jugadores.map(j => ({
            nickname: j.nickname,
            posicion: j.posicion
        })));

        // Colocar fichas en el tablero
        this.fichasManager.actualizarFichas(this.jugadores, this.turnoActual);

        // Configurar controles del juego
        this.configurarControles();

        console.log('✅ Sistema de juego inicializado');
    }

    configurarControles() {
        const lanzarDados = document.getElementById('lanzar-dados');
        const terminarTurno = document.getElementById('terminar-turno');

        if (lanzarDados) {
            lanzarDados.addEventListener('click', () => this.lanzarDados());
        }

        if (terminarTurno) {
            terminarTurno.addEventListener('click', () => this.terminarTurno());
        }
    }

    lanzarDados() {
        if (window.Toast) {
            window.Toast.info('¡Lanzando dados! 🎲', 'Tu Turno');
        }
        console.log('🎲 Dados lanzados');
    }

    terminarTurno() {
        this.turnoActual = (this.turnoActual + 1) % this.jugadores.length;
        this.fichasManager.resaltarFichaActiva(this.turnoActual);
        
        if (window.Toast) {
            const jugadorActual = this.jugadores[this.turnoActual];
            window.Toast.success(`Turno de ${jugadorActual.nickname}`, '⏭️ Cambio de Turno');
        }
        
        console.log('⏭️ Turno terminado, nuevo jugador:', this.jugadores[this.turnoActual].nickname);
    }

    obtenerJugadoresDesdeStorage() {
        const jugadoresData = localStorage.getItem("jugadores");
        
        // ✅ MEJORADO: Logging detallado para debug
        console.log('🔍 Buscando jugadores en localStorage...');
        console.log('📊 Datos raw del localStorage:', jugadoresData);
        
        if (!jugadoresData) {
            console.warn('⚠️ No se encontraron datos de jugadores en localStorage');
            return null;
        }

        try {
            const jugadores = JSON.parse(jugadoresData);
            console.log('✅ Jugadores parseados correctamente:', jugadores);
            return jugadores;
        } catch (error) {
            console.error('❌ Error parseando jugadores desde localStorage:', error);
            console.log('📊 Datos problemáticos:', jugadoresData);
            return null;
        }
    }

    mostrarNotificacionExito() {
        if (window.Toast) {
            window.Toast.success(
                `¡Tablero cargado exitosamente! ${this.jugadores.length} jugadores listos.`, 
                '🎮 ¡Bienvenidos al Monopoly!'
            );
        }
    }

    manejarError(error) {
        console.error('❌ Error en controlador de tablero:', error);
        
        if (window.Toast) {
            window.Toast.error('Error cargando el juego. Intenta recargar la página.', '💥 Error Crítico');
        } else {
            alert('❌ Error crítico cargando el tablero. Recarga la página.');
        }
    }

    redirigirAlInicio() {
        console.log('🔄 Redirigiendo al inicio por falta de jugadores válidos');
        
        if (window.Toast) {
            window.Toast.warning('No se encontraron jugadores válidos. Redirigiendo al inicio...', 'Sin Jugadores');
        }
        
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 2500);
    }

    // Métodos públicos para compatibilidad
    actualizarFichasPublico(jugadores, turnoActivo = this.turnoActual) {
        this.fichasManager.actualizarFichas(jugadores, turnoActivo);
    }

    getPositionClass(position) {
        return this.helper.getPositionClass(position);
    }

    exposeGlobalMethods() {
        // Exponer métodos necesarios globalmente
        window.tableroController = this;
    }

    
}