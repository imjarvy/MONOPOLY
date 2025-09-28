export class PropiedadesRenderer {
    
    static actualizarColorCasilla(propiedad, jugador) {
        const casilla = document.querySelector(`[data-position="${propiedad.position}"]`);
        if (!casilla) return;

        const color = jugador.color || this.obtenerColorDefecto(jugador.id);
        
        this.aplicarEstilos(casilla, color);
        this.agregarIndicador(casilla, jugador, color);
        
        console.log(`🎨 Color actualizado: ${propiedad.nombre}`);
    }

    static aplicarEstilos(casilla, color) {
        casilla.classList.add('propiedad-comprada');
        casilla.style.cssText += `
            border-color: ${color};
            border-width: 3px;
            border-style: solid;
            background-color: ${this.hexToRgba(color, 0.1)};
            box-shadow: 0 0 10px ${this.hexToRgba(color, 0.3)};
            transition: all 0.3s ease;
        `;
    }

    static agregarIndicador(casilla, jugador, color) {
        this.removerIndicador(casilla);
        
        const indicador = document.createElement('div');
        indicador.className = 'indicador-propietario';
        indicador.textContent = jugador.nickname.charAt(0).toUpperCase();
        indicador.style.cssText = `
            position: absolute; top: 2px; right: 2px;
            width: 20px; height: 20px; border-radius: 50%;
            background-color: ${color}; color: white;
            display: flex; align-items: center; justify-content: center;
            font-size: 10px; font-weight: bold; z-index: 10;
            border: 1px solid white;
        `;
        
        casilla.appendChild(indicador);
    }

    static actualizarConstrucciones(position, propiedadData) {
        const casilla = document.querySelector(`[data-position="${position}"]`);
        if (!casilla) return;

        this.limpiarConstrucciones(casilla);

        if (propiedadData.hotel) {
            this.agregarHotel(casilla);
        } else if (propiedadData.casas > 0) {
            for (let i = 0; i < propiedadData.casas; i++) {
                this.agregarCasa(casilla, i);
            }
        }
    }

    static agregarCasa(casilla, index) {
        const casa = document.createElement('div');
        casa.className = 'construccion casa';
        casa.style.cssText = `
            position: absolute; width: 8px; height: 8px;
            background: #00ff00; border: 1px solid #000;
            bottom: ${5 + (index * 10)}px; left: 5px;
        `;
        casilla.appendChild(casa);
    }

    static agregarHotel(casilla) {
        const hotel = document.createElement('div');
        hotel.className = 'construccion hotel';
        hotel.style.cssText = `
            position: absolute; width: 12px; height: 12px;
            background: #ff0000; border: 1px solid #000;
            bottom: 5px; left: 5px;
        `;
        casilla.appendChild(hotel);
    }

    static limpiarEstilos(position) {
        const casilla = document.querySelector(`[data-position="${position}"]`);
        if (!casilla) return;

        casilla.classList.remove('propiedad-comprada');
        casilla.style.cssText = casilla.style.cssText.replace(/border-color[^;]*;?/g, '');
        this.removerIndicador(casilla);
        this.limpiarConstrucciones(casilla);
    }

    static removerIndicador(casilla) {
        const indicador = casilla.querySelector('.indicador-propietario');
        if (indicador) indicador.remove();
    }

    static limpiarConstrucciones(casilla) {
        casilla.querySelectorAll('.construccion').forEach(c => c.remove());
    }

    // Utilidades
    static hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    static obtenerColorDefecto(id) {
        const colores = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'];
        return colores[id ? id.charCodeAt(0) % colores.length : 0];
    }
  /**
     * Muestra modal de compra de propiedad
     */
    static mostrarModalCompra(propiedad, jugador) {
    console.log('🏠 Mostrando modal de compra:', propiedad.nombre);
    
    // ✅ USAR SOLO CONFIRM() POR AHORA:
    const mensaje = `💰 ${propiedad.nombre}\n💵 Precio: $${propiedad.precio}\n💳 Tu dinero: $${jugador.dinero}\n\n¿Quieres comprar esta propiedad?`;
    
    const confirmar = confirm(mensaje);
    console.log('🎯 Respuesta del jugador:', confirmar);
    
    if (confirmar) {
        console.log('✅ Ejecutando compra de:', propiedad.id);
        this.ejecutarCompra(propiedad.id);
    } else {
        console.log('❌ Compra cancelada');
        this.pasarTurno();
    }
}
    /**
     * Ejecuta la compra de una propiedad
     */
    static ejecutarCompra(propiedadId) {
    console.log('💰 Ejecutando compra:', propiedadId);
    
    if (window.comprarPropiedad) {
        window.comprarPropiedad(propiedadId);
    } else {
        console.error('❌ Función de compra no encontrada');
    }
}

    
    /**
     * Pasa el turno sin comprar
     */
   static pasarTurno() {
    console.log('⏭️ Pasando turno...');
    
    if (window.siguienteTurno) {
        setTimeout(() => window.siguienteTurno(), 500);
    } else {
        console.error('❌ Función siguienteTurno no encontrada');
    }
}

    // ...resto del código existente (utilidades)...
}

console.log('🎨 PropiedadesRenderer cargado con modal (85 líneas)');