/**
 * Toast Component - Sistema de Notificaciones Moderno
 * 
 * Tipos disponibles:
 * - success: Acciones exitosas (verde)
 * - error: Errores (rojo)
 * - warning: Advertencias (amarillo)
 * - info: Información (azul cielo)
 */

class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.init();
    }

    /**
     * Inicializa el contenedor de toasts
     */
    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createContainer());
        } else {
            this.createContainer();
        }

        // Agregar estilos CSS
        this.addStyles();
    }

    /**
     * Crea el contenedor de toasts
     */
    createContainer() {
        // Crear contenedor si no existe
        if (!this.container && document.body) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    /**
     * Agrega los estilos CSS modernos
     */
    addStyles() {
        if (document.getElementById('toast-styles')) return;

        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            /* Contenedor principal */
            .toast-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
            }

            /* Toast individual */
            .toast {
                min-width: 320px;
                max-width: 400px;
                padding: 16px 20px;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
                border-left: 4px solid;
                display: flex;
                align-items: flex-start;
                gap: 12px;
                position: relative;
                pointer-events: auto;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                backdrop-filter: blur(10px);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            /* Animaciones de entrada */
            .toast.show {
                transform: translateX(0);
                opacity: 1;
            }

            /* Animación de salida */
            .toast.hiding {
                transform: translateX(100%) scale(0.95);
                opacity: 0;
                margin-top: -60px;
                transition: all 0.3s ease-in-out;
            }

            /* Tipos de toast */
            .toast.success {
                border-left-color: #10b981;
                background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
            }

            .toast.error {
                border-left-color: #ef4444;
                background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
            }

            .toast.warning {
                border-left-color: #f59e0b;
                background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
            }

            .toast.info {
                border-left-color: #3b82f6;
                background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
            }

            /* Icono del toast */
            .toast-icon {
                flex-shrink: 0;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 600;
                margin-top: 2px;
            }

            .toast.success .toast-icon {
                background: #10b981;
                color: white;
            }

            .toast.error .toast-icon {
                background: #ef4444;
                color: white;
            }

            .toast.warning .toast-icon {
                background: #f59e0b;
                color: white;
            }

            .toast.info .toast-icon {
                background: #3b82f6;
                color: white;
            }

            /* Contenido del toast */
            .toast-content {
                flex: 1;
                min-width: 0;
            }

            .toast-title {
                font-weight: 600;
                font-size: 14px;
                line-height: 1.4;
                margin-bottom: 2px;
                color: #111827;
            }

            .toast-message {
                font-size: 13px;
                line-height: 1.4;
                color: #6b7280;
                margin: 0;
            }

            /* Botón cerrar */
            .toast-close {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 24px;
                height: 24px;
                border: none;
                background: none;
                cursor: pointer;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #9ca3af;
                font-size: 18px;
                line-height: 1;
                transition: all 0.2s ease;
                opacity: 0.7;
            }

            .toast-close:hover {
                background: rgba(0, 0, 0, 0.05);
                color: #374151;
                opacity: 1;
            }

            /* Barra de progreso */
            .toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 0 0 12px 12px;
                overflow: hidden;
            }

            .toast-progress-bar {
                height: 100%;
                width: 100%;
                transform: translateX(-100%);
                transition: transform linear;
                border-radius: inherit;
            }

            .toast.success .toast-progress-bar {
                background: #10b981;
            }

            .toast.error .toast-progress-bar {
                background: #ef4444;
            }

            .toast.warning .toast-progress-bar {
                background: #f59e0b;
            }

            .toast.info .toast-progress-bar {
                background: #3b82f6;
            }

            /* Responsive */
            @media (max-width: 480px) {
                .toast-container {
                    left: 16px;
                    right: 16px;
                    top: 16px;
                }

                .toast {
                    min-width: auto;
                    max-width: none;
                    transform: translateY(-100%);
                }

                .toast.show {
                    transform: translateY(0);
                }

                .toast.hiding {
                    transform: translateY(-100%) scale(0.95);
                }
            }

            /* Efectos hover en el toast */
            .toast:hover {
                transform: translateX(-4px) scale(1.02);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 6px 8px rgba(0, 0, 0, 0.12);
            }

            /* Animación de shake para errores */
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            .toast.error.shake {
                animation: shake 0.5s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Muestra un toast
     * @param {string} type - Tipo de toast (success, error, warning, info)
     * @param {string} message - Mensaje principal
     * @param {string} title - Título opcional
     * @param {number} duration - Duración en ms (0 = no auto-close)
     * @param {Object} options - Opciones adicionales
     */
    show(type, message, title = null, duration = 4000, options = {}) {
        // Asegurar que el contenedor existe
        if (!this.container) {
            this.createContainer();
        }
        
        // Si aún no existe el contenedor, usar console.log como fallback
        if (!this.container) {
            console.log(`🍞 Toast (${type}): ${title ? title + ' - ' : ''}${message}`);
            return null;
        }
        
        const id = Date.now() + Math.random();
        
        // Configuración por tipo
        const config = this.getTypeConfig(type);
        
        // Crear elemento toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.dataset.id = id;
        
        // Contenido del toast
        toast.innerHTML = `
            <div class="toast-icon">${config.icon}</div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Cerrar">&times;</button>
            ${duration > 0 ? `
                <div class="toast-progress">
                    <div class="toast-progress-bar"></div>
                </div>
            ` : ''}
        `;

        // Event listeners
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.hide(id));

        // Agregar al contenedor
        this.container.appendChild(toast);
        this.toasts.set(id, toast);

        // Mostrar con animación
        requestAnimationFrame(() => {
            toast.classList.add('show');
            
            // Agregar efecto shake para errores
            if (type === 'error') {
                setTimeout(() => toast.classList.add('shake'), 100);
                setTimeout(() => toast.classList.remove('shake'), 600);
            }
        });

        // Auto-cerrar si tiene duración
        if (duration > 0) {
            const progressBar = toast.querySelector('.toast-progress-bar');
            if (progressBar) {
                progressBar.style.transitionDuration = `${duration}ms`;
                progressBar.style.transform = 'translateX(0)';
            }

            setTimeout(() => this.hide(id), duration);
        }

        // Hover para pausar auto-close
        if (duration > 0) {
            let timeoutId;
            let remainingTime = duration;
            let startTime = Date.now();

            const pauseTimer = () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    remainingTime -= Date.now() - startTime;
                    const progressBar = toast.querySelector('.toast-progress-bar');
                    if (progressBar) {
                        progressBar.style.transitionDuration = '0s';
                    }
                }
            };

            const resumeTimer = () => {
                if (remainingTime > 0) {
                    startTime = Date.now();
                    const progressBar = toast.querySelector('.toast-progress-bar');
                    if (progressBar) {
                        progressBar.style.transitionDuration = `${remainingTime}ms`;
                    }
                    timeoutId = setTimeout(() => this.hide(id), remainingTime);
                }
            };

            toast.addEventListener('mouseenter', pauseTimer);
            toast.addEventListener('mouseleave', resumeTimer);
        }

        return id;
    }

    /**
     * Oculta un toast específico
     * @param {string} id - ID del toast
     */
    hide(id) {
        const toast = this.toasts.get(id);
        if (!toast) return;

        toast.classList.add('hiding');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts.delete(id);
        }, 300);
    }

    /**
     * Oculta todos los toasts
     */
    hideAll() {
        this.toasts.forEach((toast, id) => {
            this.hide(id);
        });
    }

    /**
     * Configuración por tipo de toast
     */
    getTypeConfig(type) {
        const configs = {
            success: {
                icon: '✓',
                title: '¡Éxito!'
            },
            error: {
                icon: '✕',
                title: 'Error'
            },
            warning: {
                icon: '⚠',
                title: 'Advertencia'
            },
            info: {
                icon: 'ⓘ',
                title: 'Información'
            }
        };

        return configs[type] || configs.info;
    }

    // Métodos de conveniencia
    success(message, title, duration = 4000) {
        return this.show('success', message, title, duration);
    }

    error(message, title, duration = 6000) {
        return this.show('error', message, title, duration);
    }

    warning(message, title, duration = 5000) {
        return this.show('warning', message, title, duration);
    }

    info(message, title, duration = 4000) {
        return this.show('info', message, title, duration);
    }
}

// Crear instancia global cuando el DOM esté listo
let toastManager = null;

// Función para inicializar el toast manager
function initToastManager() {
    if (!toastManager) {
        toastManager = new ToastManager();
    }
    return toastManager;
}

// Funciones globales para fácil uso (disponibles inmediatamente)
window.mostrarToast = (type, message, title, duration) => {
    const manager = initToastManager();
    return manager.show(type, message, title, duration);
};

window.Toast = {
    success: (message, title, duration) => {
        const manager = initToastManager();
        return manager.success(message, title, duration);
    },
    error: (message, title, duration) => {
        const manager = initToastManager();
        return manager.error(message, title, duration);
    },
    warning: (message, title, duration) => {
        const manager = initToastManager();
        return manager.warning(message, title, duration);
    },
    info: (message, title, duration) => {
        const manager = initToastManager();
        return manager.info(message, title, duration);
    },
    hide: (id) => {
        const manager = initToastManager();
        return manager.hide(id);
    },
    hideAll: () => {
        const manager = initToastManager();
        return manager.hideAll();
    }
};

console.log('✅ Toast system loaded successfully');