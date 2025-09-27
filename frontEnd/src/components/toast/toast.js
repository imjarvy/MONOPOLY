/**
 * Sistema Toast - Notificaciones visuales modernas
 * Con protección completa para DOM loading
 */
(function() {
    'use strict';
    
    class Toast {
        constructor() {
            this.container = null;
            this.isInitialized = false;
            this.pendingToasts = [];
            
            // ✅ Inicializar cuando el DOM esté listo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
            } else {
                // DOM ya está cargado
                this.init();
            }
        }

        /**
         * Inicializa el contenedor de toasts con protección DOM
         */
        init() {
            try {
                // ✅ Verificar que document.body existe
                if (!document.body) {
                    console.warn('Toast: document.body no disponible, reintentando...');
                    setTimeout(() => this.init(), 100);
                    return;
                }

                // Buscar contenedor existente
                this.container = document.getElementById('toast-container');
                
                if (!this.container) {
                    // Crear contenedor dinámicamente
                    this.container = document.createElement('div');
                    this.container.id = 'toast-container';
                    this.container.className = 'toast-container';
                    this.container.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 9999;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        pointer-events: none;
                    `;
                    
                    document.body.appendChild(this.container);
                }

                this.isInitialized = true;
                
                // ✅ Procesar toasts pendientes
                this.processPendingToasts();
                
                console.log('✅ Toast system initialized');
                
            } catch (error) {
                console.error('Toast initialization error:', error);
                // ✅ Reintentar inicialización
                setTimeout(() => this.init(), 500);
            }
        }

        /**
         * Procesa los toasts que estaban esperando la inicialización
         */
        processPendingToasts() {
            while (this.pendingToasts.length > 0) {
                const pendingToast = this.pendingToasts.shift();
                this.show(pendingToast.message, pendingToast.title, pendingToast.type, pendingToast.duration);
            }
        }

        /**
         * Muestra un toast con validación completa
         */
        show(message, title = '', type = 'info', duration = 4000) {
            // ✅ Si no está inicializado, agregar a cola
            if (!this.isInitialized) {
                this.pendingToasts.push({ message, title, type, duration });
                return;
            }

            // ✅ Fallback si el contenedor no existe
            if (!this.container) {
                this.fallback(message, title, type);
                return;
            }

            const colors = {
                success: { bg: '#d1fae5', border: '#10b981', icon: '✅' },
                error: { bg: '#fee2e2', border: '#ef4444', icon: '❌' },
                warning: { bg: '#fef3c7', border: '#f59e0b', icon: '⚠️' },
                info: { bg: '#dbeafe', border: '#3b82f6', icon: 'ℹ️' }
            };

            const config = colors[type] || colors.info;

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.style.cssText = `
                background: ${config.bg};
                border: 2px solid ${config.border};
                border-radius: 8px;
                padding: 12px 16px;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                pointer-events: auto;
                cursor: pointer;
                transition: all 0.3s ease;
                transform: translateX(100%);
                opacity: 0;
                position: relative;
            `;

            toast.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="font-size: 1.2em; flex-shrink: 0;">${config.icon}</span>
                    <div style="flex: 1;">
                        ${title ? `<div style="font-weight: 600; margin-bottom: 4px; color: #1f2937;">${title}</div>` : ''}
                        <div style="color: #4b5563; font-size: 0.9em;">${message}</div>
                    </div>
                    <button class="toast-close" style="
                        background: none;
                        border: none;
                        font-size: 1.2em;
                        color: #6b7280;
                        cursor: pointer;
                        padding: 0;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
            `;

            // ✅ Event listeners seguros
            const closeBtn = toast.querySelector('.toast-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeToast(toast);
                });
            }

            // Click en toast para cerrar
            toast.addEventListener('click', () => {
                this.removeToast(toast);
            });

            // ✅ Agregar al DOM de forma segura
            try {
                this.container.appendChild(toast);

                // Animación de entrada
                setTimeout(() => {
                    toast.style.transform = 'translateX(0)';
                    toast.style.opacity = '1';
                }, 10);

                // Auto-remove con timeout
                setTimeout(() => {
                    this.removeToast(toast);
                }, duration);

            } catch (error) {
                console.error('Error adding toast to DOM:', error);
                this.fallback(message, title, type);
            }
        }

        /**
         * Remueve un toast de forma segura
         */
        removeToast(toast) {
            if (!toast || !toast.parentElement) return;

            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            
            setTimeout(() => {
                try {
                    if (toast.parentElement) {
                        toast.remove();
                    }
                } catch (error) {
                    console.warn('Error removing toast:', error);
                }
            }, 300);
        }

        /**
         * Fallback para cuando el sistema no está disponible
         */
        fallback(message, title, type) {
            const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
            const fullMessage = `${prefix} ${title ? title + ': ' : ''}${message}`;
            
            // Usar console en lugar de alert para mejor UX
            if (type === 'error') {
                console.error(fullMessage);
            } else if (type === 'warning') {
                console.warn(fullMessage);
            } else {
                console.info(fullMessage);
            }
            
            // Solo usar alert para errores críticos
            if (type === 'error') {
                alert(fullMessage);
            }
        }

        // ✅ Métodos de conveniencia
        success(message, title = 'Éxito') {
            this.show(message, title, 'success');
        }

        error(message, title = 'Error') {
            this.show(message, title, 'error');
        }

        warning(message, title = 'Advertencia') {
            this.show(message, title, 'warning');
        }

        info(message, title = 'Información') {
            this.show(message, title, 'info');
        }
    }

    // ✅ Crear instancia global con protección
    if (typeof window !== 'undefined') {
        window.Toast = new Toast();
    }

    // ✅ Exportar para módulos si es necesario
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Toast;
    }

    console.log('🍞 Toast module loaded');

})();