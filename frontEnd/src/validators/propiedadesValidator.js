export class PropiedadesValidator {
    
    static validarCompra(jugador, propiedad) {
        if (!jugador || !propiedad) {
            this.mostrarError('Datos inválidos');
            return false;
        }

        if (jugador.dinero < propiedad.precio) {
            this.mostrarError('Dinero insuficiente');
            return false;
        }

        if (propiedad.propietario) {
            this.mostrarError('Propiedad ocupada');
            return false;
        }

        return true;
    }

    static validarVenta(jugador, propiedad) {
        const prop = jugador.propiedades?.find(p => p.id === propiedad.id);
        
        if (!prop) {
            this.mostrarError('No posees esta propiedad');
            return false;
        }
        
        if (prop.casas > 0 || prop.hotel) {
            this.mostrarError('Vende construcciones primero');
            return false;
        }
        
        return true;
    }

    static validarConstruccion(jugador, propiedad, tipo = 'casa') {
        const prop = jugador.propiedades?.find(p => p.id === propiedad.id);
        
        if (!prop) {
            this.mostrarError('No posees esta propiedad');
            return false;
        }

        if (prop.hipotecada) {
            this.mostrarError('Propiedad hipotecada');
            return false;
        }

        if (tipo === 'casa' && prop.casas >= 4) {
            this.mostrarError('Máximo 4 casas');
            return false;
        }

        if (tipo === 'hotel' && (prop.casas !== 4 || prop.hotel)) {
            this.mostrarError('Necesitas 4 casas o ya tienes hotel');
            return false;
        }

        return true;
    }

    static mostrarError(mensaje) {
        window.Toast?.warning(mensaje, 'Validación');
    }
}

console.log('✅ PropiedadesValidator cargado');