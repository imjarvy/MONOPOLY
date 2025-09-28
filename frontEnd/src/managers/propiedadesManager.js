import { preciosBase, tiposEspeciales, propiedadesPorColor } from './propiedadesData.js';
import { PropiedadesValidator } from '../validators/propiedadesValidator.js';
import { PropiedadesRenderer } from '../renderers/propiedadesRenderer.js';

export class PropiedadesManager {
    constructor() {
        this.preciosBase = preciosBase;
        this.tiposEspeciales = tiposEspeciales;
        this.propiedadesPorColor = propiedadesPorColor;
        this.cacheMonopolios = new Map();
    }

    // ============== FUNCIONES PRINCIPALES ==============

    comprarPropiedad(jugador, propiedad) {
        if (!PropiedadesValidator.validarCompra(jugador, propiedad)) return false;

        jugador.dinero -= propiedad.precio;
        
        if (!jugador.propiedades) jugador.propiedades = [];
        jugador.propiedades.push({
            id: propiedad.id,
            nombre: propiedad.nombre,
            color: propiedad.color,
            precio: propiedad.precio,
            position: propiedad.position,
            casas: 0,
            hotel: false,
            hipotecada: false
        });

        propiedad.propietario = jugador.id;
        
        PropiedadesRenderer.actualizarColorCasilla(propiedad, jugador);
        this.limpiarCache();
        this.notificarCompra(jugador, propiedad);
        this.verificarMonopolio(jugador, propiedad.color);
        
        return true;
    }

    venderPropiedad(jugador, propiedad) {
        if (!PropiedadesValidator.validarVenta(jugador, propiedad)) return false;
        
        const valorVenta = Math.floor(propiedad.precio * 0.5);
        jugador.dinero += valorVenta;
        
        const indice = jugador.propiedades.findIndex(p => p.id === propiedad.id);
        jugador.propiedades.splice(indice, 1);
        
        this.limpiarPropiedad(propiedad);
        PropiedadesRenderer.limpiarEstilos(propiedad.position);
        this.notificarVenta(jugador, propiedad, valorVenta);
        
        return true;
    }

    calcularRenta(propiedad, dados = 0) {
        if (propiedad.hipotecada) return 0;
        
        if (propiedad.color === 'ferrocarril') return this.rentaFerrocarril(propiedad);
        if (propiedad.color === 'servicio') return this.rentaServicio(propiedad, dados);
        
        const colorData = this.preciosBase[propiedad.color];
        if (!colorData) return 0;
        
        const propJugador = this.obtenerPropiedadJugador(propiedad);
        if (!propJugador) return colorData.renta[0];
        
        if (propJugador.hotel) return colorData.renta[5];
        if (propJugador.casas > 0) return colorData.renta[propJugador.casas];
        
        // Monopolio = doble renta
        const propietario = this.obtenerPropietario(propiedad.propietario);
        if (propietario && this.tieneMonopolio(propietario, propiedad.color)) {
            return colorData.renta[0] * 2;
        }
        
        return colorData.renta[0];
    }

    construirCasa(jugador, propiedad) {
        if (!PropiedadesValidator.validarConstruccion(jugador, propiedad)) return false;

        const propJugador = this.obtenerPropiedadJugador(jugador, propiedad.id);
        const costo = this.preciosBase[propiedad.color].casaCosto;

        if (jugador.dinero >= costo) {
            jugador.dinero -= costo;
            propJugador.casas++;
            PropiedadesRenderer.actualizarConstrucciones(propiedad.position, propJugador);
            this.notificarConstruccion(jugador, propiedad, 'casa', costo);
            return true;
        }
        return false;
    }

    // ============== FUNCIONES AUXILIARES ==============

    rentaFerrocarril(propiedad) {
        const propietario = this.obtenerPropietario(propiedad.propietario);
        if (!propietario) return 0;
        const count = this.contarTipo(propietario, 'ferrocarril');
        return this.tiposEspeciales.ferrocarril.renta[Math.min(count - 1, 3)] || 0;
    }

    rentaServicio(propiedad, dados) {
        const propietario = this.obtenerPropietario(propiedad.propietario);
        if (!propietario || dados === 0) return 0;
        const count = this.contarTipo(propietario, 'servicio');
        return dados * (count === 1 ? 4 : 10);
    }

    contarTipo(jugador, tipo) {
        if (!jugador.propiedades) return 0;
        return jugador.propiedades.filter(p => p.color === tipo).length;
    }

    tieneMonopolio(jugador, color) {
        const cacheKey = `${jugador.id}-${color}`;
        if (this.cacheMonopolios.has(cacheKey)) return this.cacheMonopolios.get(cacheKey);

        const totalColor = this.propiedadesPorColor[color]?.length || 0;
        const jugadorColor = (jugador.propiedades || []).filter(p => p.color === color).length;
        
        const monopolio = jugadorColor === totalColor && totalColor > 0;
        this.cacheMonopolios.set(cacheKey, monopolio);
        return monopolio;
    }

    obtenerPropietario(id) {
        return window.gameController?.jugadores?.find(j => j.id === id) || null;
    }

    obtenerPropiedadJugador(jugador, propId) {
        return jugador.propiedades?.find(p => p.id === propId) || null;
    }

    // ============== FUNCIONES DE UTILIDAD ==============

    limpiarPropiedad(propiedad) {
        propiedad.propietario = null;
        propiedad.casas = 0;
        propiedad.hotel = false;
        propiedad.hipotecada = false;
    }

    limpiarCache() {
        this.cacheMonopolios.clear();
    }

    verificarMonopolio(jugador, color) {
        if (this.tieneMonopolio(jugador, color)) {
            this.notificarMonopolio(jugador, color);
        }
    }

    // ============== NOTIFICACIONES ==============

    notificarCompra(jugador, propiedad) {
        window.Toast?.success(`${jugador.nickname} compró ${propiedad.nombre}`, 'Compra');
    }

    notificarVenta(jugador, propiedad, valor) {
        window.Toast?.success(`${jugador.nickname} vendió ${propiedad.nombre} por $${valor}`, 'Venta');
    }

    notificarConstruccion(jugador, propiedad, tipo, costo) {
        window.Toast?.success(`${tipo} construida en ${propiedad.nombre} por $${costo}`, 'Construcción');
    }

    notificarMonopolio(jugador, color) {
        window.Toast?.success(`¡${jugador.nickname} completó monopolio ${color}!`, '🏆 MONOPOLIO');
    }
}

console.log('🏠 PropiedadesManager cargado');