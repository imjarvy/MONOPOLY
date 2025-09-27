/**
 * Modal Component - Componente modal reutilizable
 * Uso: Modal.show(content, options)
 */

// Sistema global de gestión de timeouts de modales
const ModalTimeoutManager = {
    timeouts: new Map(),
    
    add(modalId, timeoutId) {
        this.timeouts.set(modalId, timeoutId);
    },
    
    cancel(modalId) {
        if (this.timeouts.has(modalId)) {
            clearTimeout(this.timeouts.get(modalId));
            this.timeouts.delete(modalId);
            return true;
        }
        return false;
    },
    
    cancelAll() {
        for (const [modalId, timeoutId] of this.timeouts) {
            clearTimeout(timeoutId);
        }
        this.timeouts.clear();
    }
};

class Modal {
    constructor() {
        this.modalElement = null;
        this.isOpen = false;
        this.closeTimeout = null; // Para cancelar timeouts pendientes
        this.modalId = null; // ID único para cada modal
    }

    /**
     * Muestra el modal con contenido personalizado
     * @param {string} content - HTML del contenido del modal
     * @param {Object} options - Opciones de configuración
     * @param {string} options.title - Título del modal
     * @param {string} options.customStyles - CSS personalizado
     * @param {boolean} options.closeOnOverlay - Cerrar al hacer click fuera (default: true)
     * @param {Function} options.onClose - Callback al cerrar
     * @param {string} options.size - Tamaño del modal: 'sm', 'md', 'lg' (default: 'md')
     */
    async show(content, options = {}) {
        // CANCELAR TODOS LOS TIMEOUTS PENDIENTES ANTES DE ABRIR NUEVO MODAL
        ModalTimeoutManager.cancelAll();
        
        if (this.isOpen) {
            // FORZAR CIERRE del modal anterior para permitir el nuevo
            this.forceCloseModal();
            
            // Pequeña pausa para asegurar que el modal anterior se cierre completamente
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        const {
            title = '',
            customStyles = '',
            closeOnOverlay = true,
            onClose = null,
            size = 'md'
        } = options;

        // Crear estructura del modal
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'modal-overlay';
        this.modalId = 'modal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.modalElement.setAttribute('data-modal-id', this.modalId);
        
        this.modalElement.innerHTML = `
            <div class="modal-container modal-${size}">
                <div class="modal-header">
                    ${title ? `<h3 class="modal-title">${title}</h3>` : ''}
                    <button class="modal-close-btn" aria-label="Cerrar modal">×</button>
                </div>
                <div class="modal-content">
                    ${content}
                </div>
            </div>
            ${customStyles ? `<style>${customStyles}</style>` : ''}
        `;

        // Agregar al DOM
        document.body.appendChild(this.modalElement);
        this.isOpen = true;

        // Event listeners
        this.modalElement.querySelector('.modal-close-btn').addEventListener('click', () => {
            this.close(onClose);
        });

        if (closeOnOverlay) {
            this.modalElement.addEventListener('click', (e) => {
                if (e.target === this.modalElement) {
                    this.close(onClose);
                }
            });
        }

        // Cerrar con ESC
        document.addEventListener('keydown', this.handleEscKey.bind(this));

        // FORZAR LIMPIEZA DE CLASES Y ANIMACIÓN DE ENTRADA
        requestAnimationFrame(() => {
            // Asegurar que no tenga clases conflictivas
            this.modalElement.classList.remove('modal-hide');
            // Agregar clase de mostrar
            this.modalElement.classList.add('modal-show');
        });

        return this;
    }

    /**
     * Cierra el modal
     * @param {Function} callback - Función a ejecutar al cerrar
     */
    close(callback = null) {
        // Protección: No cerrar modales durante acciones pendientes
        if (window.esperandoAccionJugador && !this.forceClose) {
            return;
        }
        
        if (!this.isOpen || !this.modalElement) return;
        
        // Cancelar cualquier timeout de cierre pendiente para ESTE modal
        ModalTimeoutManager.cancel(this.modalId);
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = null;
        }
        
        this.modalElement.classList.add('modal-hide');
        
        const timeoutId = setTimeout(() => {
            // Verificar que el modal que estamos cerrando es el correcto
            const currentModalInDom = document.querySelector(`[data-modal-id="${this.modalId}"]`);
            if (!currentModalInDom) {
                ModalTimeoutManager.cancel(this.modalId);
                return;
            }
            
            // Verificar nuevamente antes de remover del DOM
            if (window.esperandoAccionJugador && !this.forceClose) {
                // Restaurar el modal
                if (this.modalElement) {
                    this.modalElement.classList.remove('modal-hide');
                }
                ModalTimeoutManager.cancel(this.modalId);
                return;
            }
            
            if (this.modalElement && this.modalElement.parentNode) {
                document.body.removeChild(this.modalElement);
            }
            
            // Limpiar referencias
            const currentModalId = this.modalId;
            this.modalElement = null;
            this.isOpen = false;
            this.forceClose = false;
            this.closeTimeout = null;
            this.modalId = null;
            
            ModalTimeoutManager.cancel(currentModalId);
            
            if (callback && typeof callback === 'function') {
                callback();
            }
        }, 300);
        
        // Registrar el timeout en el manager
        this.closeTimeout = timeoutId;
        ModalTimeoutManager.add(this.modalId, timeoutId);

        document.removeEventListener('keydown', this.handleEscKey.bind(this));
    }
    
    /**
     * Fuerza el cierre del modal ignorando protecciones
     */
    forceCloseModal(callback = null) {
        // Resetear estado inmediatamente
        this.isOpen = false;
        
        // Si hay modal element, removerlo inmediatamente
        if (this.modalElement && this.modalElement.parentNode) {
            this.modalElement.parentNode.removeChild(this.modalElement);
        }
        
        // Cancelar timeouts
        ModalTimeoutManager.cancel(this.modalId);
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = null;
        }
        
        // Reset variables
        this.modalElement = null;
        this.modalId = null;
        
        // Ejecutar callback si existe
        if (callback) callback();
    }

    /**
     * Maneja la tecla ESC para cerrar
     * @param {KeyboardEvent} e 
     */
    handleEscKey(e) {
        if (e.key === 'Escape') {
            this.close();
        }
    }

    /**
     * Verifica si el modal está abierto
     * @returns {boolean}
     */
    isModalOpen() {
        return this.isOpen;
    }
}

// Crear instancia global
const ModalComponent = new Modal();

// Exportar para uso directo
window.Modal = {
    show: async (content, options) => await ModalComponent.show(content, options),
    close: (callback) => ModalComponent.close(callback),
    forceClose: (callback) => ModalComponent.forceCloseModal(callback),
    isOpen: () => ModalComponent.isModalOpen()
};

// Confirmar que el modal se cargó correctamente
console.log('Modal component cargado correctamente');
