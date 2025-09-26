/**
 * Sistema Toast - Notificaciones visuales modernas
 * Reemplaza las alertas nativas con notificaciones elegantes
 */
class Toast {
  constructor() {
    this.container = null;
    this.toasts = [];
    this.init();
  }

  /**
   * Inicializa el contenedor de toasts
   */
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  /**
   * Muestra una notificación toast
   * @param {string} message - Mensaje a mostrar
   * @param {string} title - Título del toast (opcional)
   * @param {string} type - Tipo: success, error, warning, info
   * @param {number} duration - Duración en ms (default: 5000)
   */
  show(message, title = '', type = 'info', duration = 5000) {
    const toastElement = this.createToastElement(message, title, type, duration);
    this.container.appendChild(toastElement);
    this.toasts.push(toastElement);

    // Trigger show animation
    setTimeout(() => {
      toastElement.classList.add('show');
    }, 10);

    // Auto-remove toast
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toastElement);
      }, duration);
    }

    return toastElement;
  }

  /**
   * Crea el elemento DOM del toast
   */
  createToastElement(message, title, type, duration) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = document.createElement('div');
    icon.className = 'toast-icon';

    const content = document.createElement('div');
    content.className = 'toast-content';

    if (title) {
      const titleElement = document.createElement('div');
      titleElement.className = 'toast-title';
      titleElement.textContent = title;
      content.appendChild(titleElement);
    }

    const messageElement = document.createElement('div');
    messageElement.className = 'toast-message';
    messageElement.textContent = message;
    content.appendChild(messageElement);

    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.onclick = () => this.remove(toast);

    toast.appendChild(icon);
    toast.appendChild(content);
    toast.appendChild(closeButton);

    // Barra de progreso si tiene duración
    if (duration > 0) {
      const progress = document.createElement('div');
      progress.className = 'toast-progress';
      
      const progressBar = document.createElement('div');
      progressBar.className = 'toast-progress-bar';
      progressBar.style.animationDuration = `${duration}ms`;
      
      progress.appendChild(progressBar);
      toast.appendChild(progress);

      // Pausar animación al hover
      toast.addEventListener('mouseenter', () => {
        progressBar.style.animationPlayState = 'paused';
      });

      toast.addEventListener('mouseleave', () => {
        progressBar.style.animationPlayState = 'running';
      });
    }

    return toast;
  }

  /**
   * Elimina un toast específico
   */
  remove(toastElement) {
    if (toastElement && toastElement.parentNode) {
      toastElement.classList.add('hide');
      setTimeout(() => {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement);
        }
        const index = this.toasts.indexOf(toastElement);
        if (index > -1) {
          this.toasts.splice(index, 1);
        }
      }, 300);
    }
  }

  /**
   * Métodos de conveniencia para diferentes tipos de toast
   */
  success(message, title = '') {
    return this.show(message, title, 'success');
  }

  error(message, title = '') {
    return this.show(message, title, 'error');
  }

  warning(message, title = '') {
    return this.show(message, title, 'warning');
  }

  info(message, title = '') {
    return this.show(message, title, 'info');
  }

  /**
   * Elimina todos los toasts
   */
  clear() {
    this.toasts.forEach(toast => this.remove(toast));
  }
}

// Crear instancia global
window.Toast = new Toast();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Toast;
}