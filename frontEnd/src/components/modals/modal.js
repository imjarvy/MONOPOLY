/**
 * Modal Component - Componente modal reutilizable
 * Uso: Modal.show(content, options)
 */
class Modal {
    constructor() {
        this.modalElement = null;
        this.isOpen = false;
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
    show(content, options = {}) {
        if (this.isOpen) {
            this.close();
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

        // Animación de entrada
        requestAnimationFrame(() => {
            this.modalElement.classList.add('modal-show');
        });

        return this;
    }

    /**
     * Cierra el modal
     * @param {Function} callback - Función a ejecutar al cerrar
     */
    close(callback = null) {
        if (!this.isOpen || !this.modalElement) return;

        this.modalElement.classList.add('modal-hide');
        
        setTimeout(() => {
            if (this.modalElement && this.modalElement.parentNode) {
                document.body.removeChild(this.modalElement);
            }
            this.modalElement = null;
            this.isOpen = false;
            
            if (callback && typeof callback === 'function') {
                callback();
            }
        }, 300);

        document.removeEventListener('keydown', this.handleEscKey.bind(this));
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
    show: (content, options) => ModalComponent.show(content, options),
    close: (callback) => ModalComponent.close(callback),
    isOpen: () => ModalComponent.isModalOpen()
};

// Confirmar que el modal se cargó correctamente
console.log('Modal component cargado correctamente');
console.log('window.Modal:', window.Modal);
console.log('window.Modal.show:', window.Modal ? window.Modal.show : 'undefined');
