export class AccionesManager {
    constructor() {
        // Dependencias si las necesitas
        this.modalActual = null;
    }

    /**
     * Maneja acciones cuando un jugador cae en una propiedad
     */
    accionPropiedad(jugador, casilla) {
        console.log('🏠 Acción propiedad:', casilla.nombre);
        
        if (!casilla.propietario) {
            // Propiedad disponible - mostrar modal de compra
            this.mostrarModalCompra(jugador, casilla);
            return { tipo: 'modal', accion: 'compra', continuar: false };
            
        } else if (casilla.propietario !== jugador.id) {
            // Cobrar renta
            return this.cobrarRenta(jugador, casilla);
            
        } else {
            // Es tu propiedad
            if (window.Toast) {
                window.Toast.info(`Es tu propiedad: ${casilla.nombre}`, 'Propiedad Propia');
            }
            return { tipo: 'info', mensaje: 'Propiedad propia', continuar: true };
        }
    }

    /**
     * Maneja acciones de cárcel
     */
    accionCarcel(jugador) {
        console.log('🏛️ Acción cárcel para:', jugador.nickname);
        
        if (jugador.enCarcel) {
            // Está en la cárcel
            if (jugador.turnosCarcel > 0) {
                jugador.turnosCarcel--;
                if (window.Toast) {
                    window.Toast.warning(
                        `${jugador.nickname} sigue en la cárcel (${jugador.turnosCarcel} turnos restantes)`,
                        'En la Cárcel'
                    );
                }
                return { tipo: 'carcel', turnosRestantes: jugador.turnosCarcel, continuar: false };
            } else {
                // Sale de la cárcel
                jugador.enCarcel = false;
                if (window.Toast) {
                    window.Toast.success(
                        `${jugador.nickname} sale de la cárcel`,
                        '🆓 Libre!'
                    );
                }
                return { tipo: 'libertad', continuar: true };
            }
        } else {
            // Solo de visita
            if (window.Toast) {
                window.Toast.info(
                    `${jugador.nickname} está de visita en la cárcel`,
                    'Solo de Visita'
                );
            }
            return { tipo: 'visita', continuar: true };
        }
    }

    /**
     * Maneja acciones de impuestos
     */
    accionImpuestos(jugador, cantidad = 100) {
        console.log('💸 Acción impuestos:', cantidad);
        
        if (jugador.dinero >= cantidad) {
            jugador.dinero -= cantidad;
            
            if (window.Toast) {
                window.Toast.warning(
                    `${jugador.nickname} pagó $${cantidad} de impuestos`,
                    '💸 Impuestos'
                );
            }
            
            return { 
                tipo: 'pago', 
                cantidad: cantidad, 
                dineroRestante: jugador.dinero,
                continuar: true 
            };
        } else {
            // No puede pagar - bancarrota
            jugador.bancarrota = true;
            
            if (window.Toast) {
                window.Toast.error(
                    `${jugador.nickname} no puede pagar $${cantidad} de impuestos. ¡Bancarrota!`,
                    '💀 Sin Dinero'
                );
            }
            
            return { 
                tipo: 'bancarrota', 
                jugador: jugador.nickname,
                deuda: cantidad,
                continuar: true 
            };
        }
    }

    /**
     * Maneja acciones de cartas (Suerte/Comunidad)
     */
    accionCarta(jugador, tipoCarta) {
        console.log('🎴 Acción carta:', tipoCarta);
        
        const cartas = this.obtenerCartasPorTipo(tipoCarta);
        const cartaElegida = cartas[Math.floor(Math.random() * cartas.length)];
        
        // Ejecutar efecto de la carta
        const resultado = this.ejecutarEfectoCarta(jugador, cartaElegida);
        
        if (window.Toast) {
            window.Toast.info(
                cartaElegida.mensaje,
                tipoCarta === 'suerte' ? '🎴 Suerte' : '🏛️ Comunidad'
            );
        }
        
        return {
            tipo: 'carta',
            carta: cartaElegida,
            efecto: resultado,
            continuar: true
        };
    }

    /**
     * Maneja acciones de la casilla Salida
     */
    accionSalida(jugador) {
        console.log('💰 Acción salida para:', jugador.nickname);
        
        const premio = 200;
        jugador.dinero += premio;
        
        if (window.Toast) {
            window.Toast.success(
                `${jugador.nickname} recibió $${premio} por pasar por la Salida`,
                '💰 ¡Salida!'
            );
        }
        
        return { 
            tipo: 'premio', 
            cantidad: premio,
            dineroTotal: jugador.dinero,
            continuar: true 
        };
    }

    // ============== MÉTODOS AUXILIARES ==============

    /**
     * Muestra modal de compra de propiedad
     */
    mostrarModalCompra(jugador, casilla) {
        // Usar tu sistema de modal existente
        if (window.accionModal) {
            window.accionModal.mostrarOpcionesPropiedad(casilla, jugador);
        } else {
            console.warn('⚠️ accionModal no disponible');
        }
    }

    /**
     * Cobra renta entre jugadores
     */
    cobrarRenta(jugador, casilla) {
        if (!window.gameController || !window.gameController.jugadores) {
            console.error('❌ gameController no disponible para cobrar renta');
            return { tipo: 'error', continuar: true };
        }

        const propietario = window.gameController.jugadores.find(j => j.id === casilla.propietario);
        if (!propietario || casilla.hipotecada) {
            return { tipo: 'info', mensaje: 'Sin renta', continuar: true };
        }

        const renta = this.calcularRenta(casilla);
        
        if (jugador.dinero >= renta) {
            jugador.dinero -= renta;
            propietario.dinero += renta;
            
            if (window.Toast) {
                window.Toast.warning(
                    `${jugador.nickname} pagó $${renta} a ${propietario.nickname}`,
                    `Renta: ${casilla.nombre}`
                );
            }
            
            return { 
                tipo: 'pago', 
                cantidad: renta, 
                receptor: propietario.nickname,
                continuar: true 
            };
        } else {
            jugador.bancarrota = true;
            return { 
                tipo: 'bancarrota', 
                jugador: jugador.nickname,
                deuda: renta,
                continuar: true 
            };
        }
    }

    /**
     * Calcula renta de una propiedad
     */
    calcularRenta(casilla) {
        // Renta básica por ahora - expandir más adelante
        const rentaBase = casilla.renta || Math.floor(casilla.precio * 0.1);
        
        // Si tiene casas/hoteles, multiplicar
        if (casilla.casas) {
            return rentaBase * (casilla.casas + 1);
        }
        
        if (casilla.hotel) {
            return rentaBase * 5;
        }
        
        return rentaBase;
    }

    /**
     * Obtiene cartas según el tipo
     */
    obtenerCartasPorTipo(tipoCarta) {
        const cartasSuerte = [
            { tipo: 'dinero', cantidad: 200, mensaje: 'Has ganado un premio de $200' },
            { tipo: 'dinero', cantidad: -100, mensaje: 'Paga una multa de $100' },
            { tipo: 'mover', posicion: 0, mensaje: 'Ve directo a la Salida' },
            { tipo: 'carcel', mensaje: 'Ve directo a la cárcel' }
        ];
        
        const cartasComunidad = [
            { tipo: 'dinero', cantidad: 100, mensaje: 'Colecta de la comunidad: $100' },
            { tipo: 'dinero', cantidad: -50, mensaje: 'Contribución comunitaria: $50' },
            { tipo: 'dinero', cantidad: 150, mensaje: 'Premio de belleza: $150' }
        ];
        
        return tipoCarta === 'suerte' ? cartasSuerte : cartasComunidad;
    }

    /**
     * Ejecuta el efecto de una carta
     */
    ejecutarEfectoCarta(jugador, carta) {
        switch(carta.tipo) {
            case 'dinero':
                jugador.dinero += carta.cantidad;
                return { tipo: 'dinero', cantidad: carta.cantidad };
                
            case 'mover':
                const posicionAnterior = jugador.posicion;
                jugador.posicion = carta.posicion;
                return { tipo: 'mover', desde: posicionAnterior, hacia: carta.posicion };
                
            case 'carcel':
                jugador.posicion = 10;
                jugador.enCarcel = true;
                jugador.turnosCarcel = 3;
                return { tipo: 'carcel' };
                
            default:
                return { tipo: 'neutral' };
        }
    }
}

console.log('🎯 AccionesManager cargado correctamente');