// ❌ REMOVER: import { PropiedadesManager } from '../../managers/propiedadesManager.js';

export class AccionModal {
    constructor() {
        // ✅ Crear instancia cuando sea necesario
        this.modalActual = null;
    }

    async mostrarOpcionesPropiedad(propiedad, jugadorActual) {
        // ✅ Usar window.Modal.show() en lugar de Bootstrap
        const puedeComprar = !propiedad.propietario && jugadorActual.dinero >= propiedad.precio;
        
        const contenido = `
            <div class="jugador-info">
                <div class="jugador-nombre">
                    <i class="fas fa-user"></i>
                    Turno: ${jugadorActual.nickname}
                </div>
                <div class="jugador-dinero">
                    <i class="fas fa-coins"></i>
                    Dinero: $${jugadorActual.dinero.toLocaleString()}
                </div>
            </div>
            
            <div class="propiedad-info">
                <div class="propiedad-nombre">
                    <div class="color-indicator" style="background-color: ${this.obtenerColorPropiedad(propiedad.color)};"></div>
                    ${propiedad.nombre}
                </div>
                
                <div class="propiedad-detalles">
                    <div class="detalle-item">
                        <span class="detalle-label">💰 Precio:</span>
                        <span class="detalle-valor">$${propiedad.precio?.toLocaleString()}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">💵 Tu dinero:</span>
                        <span class="detalle-valor ${puedeComprar ? 'suficiente' : 'insuficiente'}">
                            $${jugadorActual.dinero.toLocaleString()}
                        </span>
                    </div>
                </div>
                
                <div class="estado-propiedad ${this.obtenerClaseEstado(propiedad)}">
                    <i class="fas ${this.obtenerIconoEstado(propiedad)}"></i>
                    ${this.obtenerTextoEstado(propiedad, jugadorActual)}
                </div>
            </div>
            
            <div class="acciones-container">
                ${this.generarBotonesAccion(propiedad, jugadorActual)}
            </div>
        `;

        // ✅ USAR TU SISTEMA MODAL CUSTOM
        if (window.Modal) {
            this.modalActual = window.Modal.show(contenido, {
                title: `🏠 ${propiedad.nombre}`,
                size: 'md',
                closeOnOverlay: true,
                onClose: () => {
                    console.log('Modal de propiedad cerrado');
                }
            });
        } else {
            console.error('❌ window.Modal no está disponible');
        }
    }

    // ✅ SIMPLIFICAR MÉTODOS AUXILIARES
    obtenerColorPropiedad(color) {
        const colores = {
            'marron': '#8B4513',
            'azul-claro': '#87CEEB',
            'rosa': '#FFC0CB',
            'naranja': '#FFA500',
            'rojo': '#FF0000',
            'amarillo': '#FFFF00',
            'verde': '#008000',
            'azul-oscuro': '#000080'
        };
        return colores[color] || '#666666';
    }

    obtenerClaseEstado(propiedad) {
        if (!propiedad.propietario) return 'estado-disponible';
        if (propiedad.hipotecada) return 'estado-ocupada';
        return 'estado-propia';
    }

    obtenerIconoEstado(propiedad) {
        if (!propiedad.propietario) return 'fa-check-circle';
        if (propiedad.hipotecada) return 'fa-university';
        return 'fa-home';
    }

    obtenerTextoEstado(propiedad, jugadorActual) {
        if (!propiedad.propietario) return 'Disponible para compra';
        if (propiedad.propietario === jugadorActual.id) {
            if (propiedad.hipotecada) return 'Hipotecada';
            return 'Tu propiedad';
        }
        return 'Propiedad ocupada';
    }

    generarBotonesAccion(propiedad, jugador) {
        const botones = [];
        
        if (!propiedad.propietario) {
            const puedeComprar = jugador.dinero >= propiedad.precio;
            botones.push(`
                <button class="btn btn-comprar btn-accion" 
                        ${!puedeComprar ? 'disabled' : ''} 
                        onclick="ejecutarCompraPropiedad('${propiedad.id}')">
                    <i class="fas fa-shopping-cart"></i>
                    Comprar por $${propiedad.precio?.toLocaleString()}
                </button>
            `);
        }
        
        botones.push(`
            <button class="btn btn-pasar btn-accion" onclick="pasarTurnoYCerrar()">
                <i class="fas fa-forward"></i>
                Pasar Turno
            </button>
        `);
        
        return botones.join('');
    }

    cerrarModal() {
        if (window.Modal) {
            window.Modal.close();
        }
    }
}

// ✅ FUNCIONES GLOBALES SIMPLIFICADAS
window.cerrarModalAccion = function() {
    if (window.Modal) {
        window.Modal.close();
    }
};

window.ejecutarCompraPropiedad = function(propiedadId) {
    console.log('🏠 Comprando propiedad:', propiedadId);
    
    // Lógica de compra (implementar más adelante)
    if (window.gameController && window.gameController.comprarPropiedad) {
        window.gameController.comprarPropiedad(propiedadId);
    } else {
        console.warn('⚠️ gameController.comprarPropiedad no disponible');
        if (window.Toast) {
            window.Toast.info('Función de compra en desarrollo', 'Próximamente');
        }
    }
    
    window.cerrarModalAccion();
};

window.pasarTurnoYCerrar = function() {
    console.log('⏭️ Pasando turno');
    
    if (window.gameController && window.gameController.siguienteTurno) {
        window.gameController.siguienteTurno();
    } else {
        console.warn('⚠️ gameController.siguienteTurno no disponible');
        if (window.Toast) {
            window.Toast.info('Pasando turno...', 'Siguiente Jugador');
        }
    }
    
    window.cerrarModalAccion();
};