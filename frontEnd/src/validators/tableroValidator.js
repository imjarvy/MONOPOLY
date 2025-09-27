/**
 * Validator específico para operaciones del tablero
 */
export class TableroValidator {
    constructor() {
        this.errores = [];
    }

    validarElementoTablero(tableroElement) {
        if (!tableroElement) {
            this.agregarError('Elemento .tablero no encontrado en el DOM');
            return false;
        }
        return true;
    }

    validarDatosTablero(boardData) {
        if (!boardData) {
            this.agregarError('No se pudieron cargar los datos del tablero');
            return false;
        }

        const secciones = ['bottom', 'left', 'top', 'right'];
        let esValido = true;

        secciones.forEach(seccion => {
            if (!boardData[seccion] || !Array.isArray(boardData[seccion])) {
                this.agregarError(`Sección ${seccion} faltante o inválida`);
                esValido = false;
            }
        });

        return esValido;
    }

    validarJugadores(jugadores) {
        // ✅ CORREGIDO: Verificar si jugadores es null/undefined primero
        if (!jugadores) {
            this.agregarError('No se encontraron jugadores en localStorage');
            return false;
        }

        if (!Array.isArray(jugadores)) {
            this.agregarError('Lista de jugadores inválida (no es array)');
            return false;
        }

        if (jugadores.length < 2) {
            this.agregarError('Se necesitan al menos 2 jugadores para iniciar el juego');
            return false;
        }

        if (jugadores.length > 4) {
            this.agregarError('Máximo 4 jugadores permitidos');
            return false;
        }

        // ✅ CORREGIDO: Validar solo campos esenciales (NO posicion, se asigna después)
        const jugadorInvalido = jugadores.find(j => 
            !j.id || 
            !j.nickname || 
            j.nickname.trim() === '' ||
            !j.ficha ||
            typeof j.dinero === 'undefined'
        );

        if (jugadorInvalido) {
            console.warn('⚠️ Jugador con datos incompletos:', jugadorInvalido);
            this.agregarError('Uno o más jugadores tienen datos incompletos (falta id, nickname, ficha o dinero)');
            return false;
        }

        // ✅ NUEVO: Log de jugadores validados exitosamente
        console.log('✅ Jugadores validados correctamente:', jugadores.map(j => ({
            id: j.id,
            nickname: j.nickname,
            ficha: j.ficha,
            dinero: j.dinero,
            posicion: j.posicion || 'sin definir (se asignará 0)'
        })));

        return true;
    }

    validarPosicion(posicion) {
        if (typeof posicion !== 'number' || posicion < 0 || posicion > 39) {
            this.agregarError(`Posición ${posicion} fuera del rango válido (0-39)`);
            return false;
        }
        return true;
    }

    agregarError(mensaje) {
        this.errores.push(mensaje);
        console.error(`❌ Validación: ${mensaje}`);
    }

    obtenerErrores() {
        return [...this.errores];
    }

    limpiarErrores() {
        this.errores = [];
    }

    mostrarErrores() {
        if (this.errores.length === 0) return;

        const mensajeCompleto = this.errores.join('\n• ');
        
        console.error('❌ Lista completa de errores de validación:', this.errores);
        
        if (window.Toast) {
            window.Toast.error(`Errores encontrados:\n• ${mensajeCompleto}`, 'Error de Validación');
        } else {
            alert(`❌ Errores encontrados:\n• ${mensajeCompleto}`);
        }
    }
}