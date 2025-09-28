export class PropiedadesManager {
    constructor() {
        this.preciosBase = {
            'marron': { compra: 60, renta: [2, 10, 30, 90, 160, 250], casaCosto: 50 },
            'azul-claro': { compra: 100, renta: [6, 30, 90, 270, 400, 550], casaCosto: 50 },
            'rosa': { compra: 140, renta: [10, 50, 150, 450, 625, 750], casaCosto: 100 },
            'naranja': { compra: 180, renta: [14, 70, 200, 550, 750, 950], casaCosto: 100 },
            'rojo': { compra: 220, renta: [18, 90, 250, 700, 875, 1050], casaCosto: 150 },
            'amarillo': { compra: 260, renta: [22, 110, 330, 800, 975, 1150], casaCosto: 150 },
            'verde': { compra: 300, renta: [26, 130, 390, 900, 1100, 1275], casaCosto: 200 },
            'azul-oscuro': { compra: 400, renta: [50, 200, 600, 1400, 1700, 2000], casaCosto: 200 }
        };
    }

    comprarPropiedad(jugador, propiedad) {
        if (jugador.dinero >= propiedad.precio && !propiedad.propietario) {
            jugador.dinero -= propiedad.precio;
            jugador.propiedades = jugador.propiedades || [];
            jugador.propiedades.push(propiedad);
            propiedad.propietario = jugador.id;
            
            if (window.Toast) {
                window.Toast.success(
                    `${jugador.nickname} compró ${propiedad.nombre} por $${propiedad.precio}`, 
                    'Propiedad Adquirida'
                );
            }
            return true;
        }
        
        if (window.Toast) {
            const razon = jugador.dinero < propiedad.precio ? 'Dinero insuficiente' : 'Propiedad no disponible';
            window.Toast.warning(`No se puede comprar: ${razon}`, 'Compra Fallida');
        }
        return false;
    }

    venderPropiedad(jugador, propiedad) {
        const indicePropiedad = jugador.propiedades?.findIndex(p => p.id === propiedad.id);
        if (indicePropiedad === -1) return false;
        
        // Calcular valor de venta (50% del precio original + mejoras)
        const valorBase = Math.floor(propiedad.precio * 0.5);
        const valorCasas = (propiedad.casas || 0) * 25; // 50% del costo de casas
        const valorHotel = propiedad.hotel ? 100 : 0; // 50% del costo del hotel
        const valorTotal = valorBase + valorCasas + valorHotel;
        
        // Realizar venta
        jugador.dinero += valorTotal;
        jugador.propiedades.splice(indicePropiedad, 1);
        
        // Limpiar propiedad
        propiedad.propietario = null;
        propiedad.casas = 0;
        propiedad.hotel = false;
        propiedad.hipotecada = false;
        
        if (window.Toast) {
            window.Toast.success(
                `${jugador.nickname} vendió ${propiedad.nombre} por $${valorTotal}`, 
                'Propiedad Vendida'
            );
        }
        return true;
    }

    hipotecarPropiedad(jugador, propiedad) {
        if (propiedad.propietario !== jugador.id || propiedad.hipotecada) return false;
        
        const valorHipoteca = Math.floor(propiedad.precio * 0.5);
        jugador.dinero += valorHipoteca;
        propiedad.hipotecada = true;
        
        if (window.Toast) {
            window.Toast.info(
                `${jugador.nickname} hipotecó ${propiedad.nombre} por $${valorHipoteca}`, 
                'Propiedad Hipotecada'
            );
        }
        return true;
    }

    deshipotecarPropiedad(jugador, propiedad) {
        if (propiedad.propietario !== jugador.id || !propiedad.hipotecada) return false;
        
        const costoDeshipoteca = Math.floor(propiedad.precio * 0.55); // 10% extra de interés
        
        if (jugador.dinero < costoDeshipoteca) {
            if (window.Toast) {
                window.Toast.warning('Dinero insuficiente para deshipotecar', 'Sin Fondos');
            }
            return false;
        }
        
        jugador.dinero -= costoDeshipoteca;
        propiedad.hipotecada = false;
        
        if (window.Toast) {
            window.Toast.success(
                `${jugador.nickname} deshipotecó ${propiedad.nombre} por $${costoDeshipoteca}`, 
                'Propiedad Recuperada'
            );
        }
        return true;
    }

    construirCasa(jugador, propiedad) {
        const colorData = this.preciosBase[propiedad.color];
        if (!colorData || propiedad.hipotecada) return false;
        
        // Verificar que el jugador tenga todas las propiedades del color
        if (!this.tieneMonopolio(jugador, propiedad.color)) {
            if (window.Toast) {
                window.Toast.warning('Necesitas todas las propiedades del color', 'Monopolio Requerido');
            }
            return false;
        }
        
        if ((propiedad.casas || 0) >= 4 || propiedad.hotel) return false;
        
        if (jugador.dinero < colorData.casaCosto) {
            if (window.Toast) {
                window.Toast.warning('Dinero insuficiente para construir', 'Sin Fondos');
            }
            return false;
        }
        
        jugador.dinero -= colorData.casaCosto;
        propiedad.casas = (propiedad.casas || 0) + 1;
        
        if (window.Toast) {
            window.Toast.success(
                `${jugador.nickname} construyó una casa en ${propiedad.nombre}`, 
                'Casa Construida'
            );
        }
        return true;
    }

    construirHotel(jugador, propiedad) {
        const colorData = this.preciosBase[propiedad.color];
        if (!colorData || propiedad.hipotecada || propiedad.hotel) return false;
        
        if ((propiedad.casas || 0) < 4) {
            if (window.Toast) {
                window.Toast.warning('Necesitas 4 casas para construir un hotel', 'Casas Requeridas');
            }
            return false;
        }
        
        if (jugador.dinero < colorData.casaCosto) {
            if (window.Toast) {
                window.Toast.warning('Dinero insuficiente para el hotel', 'Sin Fondos');
            }
            return false;
        }
        
        jugador.dinero -= colorData.casaCosto;
        propiedad.casas = 0; // Se quitan las casas
        propiedad.hotel = true;
        
        if (window.Toast) {
            window.Toast.success(
                `${jugador.nickname} construyó un hotel en ${propiedad.nombre}`, 
                'Hotel Construido'
            );
        }
        return true;
    }

    calcularRenta(propiedad, dados = 0) {
        if (propiedad.hipotecada) return 0;
        
        const colorData = this.preciosBase[propiedad.color];
        if (!colorData) return 0;
        
        const casasCount = propiedad.casas || 0;
        const tieneHotel = propiedad.hotel || false;
        
        if (tieneHotel) {
            return colorData.renta[5]; // Hotel
        } else if (casasCount > 0) {
            return colorData.renta[casasCount]; // Casas
        } else {
            // Propiedad sin mejoras - verificar si tiene monopolio
            const propietario = this.obtenerPropietario(propiedad.propietario);
            if (propietario && this.tieneMonopolio(propietario, propiedad.color)) {
                return colorData.renta[0] * 2; // Doble renta por monopolio
            }
            return colorData.renta[0]; // Renta base
        }
    }

    tieneMonopolio(jugador, color) {
        const propiedadesDelColor = this.obtenerPropiedadesPorColor(color);
        const propiedadesDelJugador = (jugador.propiedades || [])
            .filter(p => p.color === color).length;
        
        return propiedadesDelJugador === propiedadesDelColor.length;
    }

    obtenerPropiedadesPorColor(color) {
        // Esta función debería obtener las propiedades del tablero por color
        // Por ahora retornamos un número aproximado
        const propiedadesPorColor = {
            'marron': 2, 'azul-claro': 3, 'rosa': 3, 'naranja': 3,
            'rojo': 3, 'amarillo': 3, 'verde': 3, 'azul-oscuro': 2
        };
        
        return new Array(propiedadesPorColor[color] || 0);
    }

    obtenerPropietario(propietarioId) {
        // Esta función debe obtener el jugador por ID
        // Debe ser inyectada o acceder al estado global de jugadores
        if (typeof window !== 'undefined' && window.gameController) {
            return window.gameController.jugadores?.find(j => j.id === propietarioId);
        }
        return null;
    }
}