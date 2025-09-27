/**
 * Validador específico para jugadores (NO confundir con backend service)
 */
export class JugadorValidator {
    constructor(config) {
        this.config = config;
    }

    validarAgregarJugador(contador) {
        if (contador >= this.config.maxJugadores) {
            this.mostrarError(`Ya tienes el máximo de jugadores permitidos (${this.config.maxJugadores}).`);
            return false;
        }
        return true;
    }


validarJugadoresParaJugar(jugadores) {
    // ✅ AGREGAR LOGS PARA DEBUGGING
    console.log('🔍 DEBUGGING VALIDACIÓN:');
    console.log('📊 Cantidad de jugadores:', jugadores.length);
    console.log('👥 Array de jugadores completo:', jugadores);
    
    // Ver las propiedades de cada jugador
    jugadores.forEach((j, index) => {
        console.log(`👤 Jugador ${index}:`, {
            id: j.id,
            nickname: j.nickname,
            tieneNickname: !!j.nickname,
            nicknameTrimmed: j.nickname ? j.nickname.trim() : 'undefined'
        });
    });

    if (jugadores.length < 2) {
        console.log('❌ Error: Menos de 2 jugadores');
        this.mostrarError("Se necesitan al menos 2 jugadores para comenzar.");
        return false;
    }

    const nicknamesVacios = jugadores.filter(j => 
        !j.nickname || j.nickname.trim() === ''
    );

    console.log('🔍 Jugadores con nickname vacío:', nicknamesVacios);
    console.log('📊 Cantidad con nickname vacío:', nicknamesVacios.length);

    if (nicknamesVacios.length > 0) {
        console.log('❌ Error: Jugadores sin nickname encontrados');
        this.mostrarError("Todos los jugadores deben tener un nickname.");
        return false;
    }

    console.log('✅ Validación exitosa');
    return true;
}


    validarFichaUnica(fichaSeleccionada, jugadorId, jugadores) {
        const fichaEnUso = jugadores.some(j => 
            j.id !== jugadorId && j.ficha === fichaSeleccionada
        );

        if (fichaEnUso) {
            this.mostrarError("Esta ficha ya está en uso por otro jugador.");
            return false;
        }
        return true;
    }

    mostrarError(mensaje) {
        if (window.Toast) {
            window.Toast.error(mensaje, "Validación");
        } else {
            alert(`❌ ${mensaje}`);
        }
    }

    mostrarAdvertencia(mensaje) {
        if (window.Toast) {
            window.Toast.warning(mensaje, "Advertencia");
        } else {
            alert(`⚠️ ${mensaje}`);
        }
    }
}