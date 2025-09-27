/**
 * Modal animado para lanzamiento de dados
 * Integración con el sistema Toast y lógica existente del juego
 */
class DadosModal {
  constructor() {
    this.isOpen = false;
    this.ultimoResultado = null;
    this.overlay = null;
    this.modal = null;
    this.init();
  }

  /**
   * Inicializa el modal y lo agrega al DOM
   */
  init() {
    this.createModalHTML();
    this.bindEvents();
  }

  /**
   * Crea la estructura HTML del modal
   */
  createModalHTML() {
    // Crear overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';

    // Crear modal
    this.modal = document.createElement('div');
    this.modal.className = 'modal-dados';

    this.modal.innerHTML = `
      <h3 class="modal-title">🎲 Lanzar Dados 🎲</h3>
      
      <div class="dados-container">
        <div class="dado" id="dado1" data-value="1">
          <div class="dado-dots">
            ${this.createDots()}
          </div>
        </div>
        <div class="dado" id="dado2" data-value="1">
          <div class="dado-dots">
            ${this.createDots()}
          </div>
        </div>
      </div>

      <div class="manual-inputs" id="manual-inputs">
        <input type="number" class="input-dado" id="manual-dado1" min="1" max="6" placeholder="D1">
        <input type="number" class="input-dado" id="manual-dado2" min="1" max="6" placeholder="D2">
      </div>

      <div class="resultado-dados" id="resultado-dados">
        <div class="total-dados" id="total-dados">0</div>
        <div id="dobles-message" class="dobles-message" style="display: none;">
          🎉 ¡DOBLES! Puedes lanzar otra vez 🎉
        </div>
      </div>

      <div class="modal-buttons">
        <button class="btn-modal btn-secondary" id="btn-lanzar-dados">🎲 Lanzar</button>
        <button class="btn-modal btn-primary" id="btn-confirmar" style="display: none;">✓ Confirmar</button>
        <button class="btn-modal btn-secondary" id="btn-cancelar">✕ Cancelar</button>
      </div>
    `;

    this.overlay.appendChild(this.modal);
    document.body.appendChild(this.overlay);
  }

  /**
   * Crea los 9 puntos para cada dado
   */
  createDots() {
    return '<div class="dot"></div>'.repeat(9);
  }

  /**
   * Vincula eventos a los elementos del modal
   */
  bindEvents() {
    // Botón lanzar dados
    document.getElementById('btn-lanzar-dados').addEventListener('click', () => {
      this.lanzarDados();
    });

    // Botón confirmar
    document.getElementById('btn-confirmar').addEventListener('click', () => {
      this.confirmarMovimiento();
    });

    // Botón cancelar
    document.getElementById('btn-cancelar').addEventListener('click', () => {
      this.close();
    });

    // Cerrar con click en overlay
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Inputs manuales
    document.getElementById('manual-dado1').addEventListener('input', this.validateManualInputs.bind(this));
    document.getElementById('manual-dado2').addEventListener('input', this.validateManualInputs.bind(this));
  }

  /**
   * Valida los inputs manuales
   */
  validateManualInputs() {
    const input1 = document.getElementById('manual-dado1');
    const input2 = document.getElementById('manual-dado2');
    
    input1.value = Math.max(1, Math.min(6, input1.value || 1));
    input2.value = Math.max(1, Math.min(6, input2.value || 1));
  }

  /**
   * Actualiza la visualización de un dado
   */
  updateDadoVisual(dadoElement, value) {
    dadoElement.setAttribute('data-value', value);
    
    const dots = dadoElement.querySelectorAll('.dot');
    dots.forEach(dot => dot.style.background = 'transparent');

    // Configurar puntos según el valor
    const dotPatterns = {
      1: [4], // centro
      2: [2, 6], // diagonal
      3: [2, 4, 6], // diagonal + centro
      4: [0, 2, 6, 8], // esquinas
      5: [0, 2, 4, 6, 8], // esquinas + centro
      6: [0, 2, 3, 5, 6, 8] // dos columnas
    };

    const pattern = dotPatterns[value];
    pattern.forEach(index => {
      if (dots[index]) {
        dots[index].style.background = '#333';
      }
    });
  }

  /**
   * Lanza los dados con animación
   */
  async lanzarDados() {
    const dado1Element = document.getElementById('dado1');
    const dado2Element = document.getElementById('dado2');
    const btnLanzar = document.getElementById('btn-lanzar-dados');
    const btnConfirmar = document.getElementById('btn-confirmar');
    const resultado = document.getElementById('resultado-dados');
    const total = document.getElementById('total-dados');
    const doblesMessage = document.getElementById('dobles-message');

    // Obtener valores (manuales o aleatorios)
    const input1 = document.getElementById('manual-dado1');
    const input2 = document.getElementById('manual-dado2');
    
    const dado1 = parseInt(input1.value) || (Math.floor(Math.random() * 6) + 1);
    const dado2 = parseInt(input2.value) || (Math.floor(Math.random() * 6) + 1);
    const totalValue = dado1 + dado2;
    const esDoble = dado1 === dado2;

    // Limpiar inputs después de usar
    input1.value = '';
    input2.value = '';

    // Deshabilitar botón y ocultar resultado
    btnLanzar.disabled = true;
    btnLanzar.textContent = '🎲 Lanzando...';
    resultado.classList.remove('show');
    doblesMessage.style.display = 'none';

    // Animar dados
    dado1Element.classList.add('rolling');
    dado2Element.classList.add('rolling');

    // Esperar animación
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Actualizar valores
    this.updateDadoVisual(dado1Element, dado1);
    this.updateDadoVisual(dado2Element, dado2);

    // Remover animación
    dado1Element.classList.remove('rolling');
    dado2Element.classList.remove('rolling');

    // Mostrar resultado
    total.textContent = `${dado1} + ${dado2} = ${totalValue}`;
    resultado.classList.add('show');

    // Mostrar mensaje de dobles si aplica
    if (esDoble) {
      doblesMessage.style.display = 'block';
    }

    // Guardar resultado
    this.ultimoResultado = {
      dado1: dado1,
      dado2: dado2,
      total: totalValue,
      esDoble: esDoble
    };

    // Restaurar botón y mostrar confirmar
    btnLanzar.disabled = false;
    btnLanzar.textContent = '🎲 Lanzar Otra Vez';
    btnConfirmar.style.display = 'inline-block';

    // Mostrar toast informativo
    if (window.Toast) {
      window.Toast.info(
        `Dados: ${dado1} + ${dado2} = ${totalValue}`,
        "Resultado de Dados"
      );

      if (esDoble) {
        window.Toast.success("¡Dobles! Puedes lanzar otra vez.", "¡Excelente!");
      }
    }
  }

  /**
   * Confirma el movimiento y cierra el modal
   */
  confirmarMovimiento() {
    if (!this.ultimoResultado) {
      if (window.Toast) {
        window.Toast.warning("Debes lanzar los dados primero", "Atención");
      }
      return;
    }

    // Llamar función de movimiento del juego
    if (typeof window.moverFichaActual === 'function') {
      window.moverFichaActual(this.ultimoResultado.total);
    }

    // Mostrar toast de confirmación
    if (window.Toast) {
      window.Toast.success(
        `Movimiento confirmado: ${this.ultimoResultado.total} espacios`,
        "Movimiento"
      );
    }

    this.close();
  }

  /**
   * Muestra el modal
   */
  show() {
    this.isOpen = true;
    this.overlay.classList.add('show');
    
    // Resetear estado
    document.getElementById('btn-confirmar').style.display = 'none';
    document.getElementById('btn-lanzar-dados').textContent = '🎲 Lanzar';
    document.getElementById('resultado-dados').classList.remove('show');
    document.getElementById('dobles-message').style.display = 'none';
    document.getElementById('manual-dado1').value = '';
    document.getElementById('manual-dado2').value = '';
    document.getElementById('manual-inputs').classList.add('show');
    
    this.ultimoResultado = null;

    // Mostrar toast de bienvenida
    if (window.Toast) {
      window.Toast.info("¡Lanza los dados para mover tu ficha!", "Tu Turno");
    }
  }

  /**
   * Cierra el modal
   */
  close() {
    this.isOpen = false;
    this.overlay.classList.remove('show');
  }
}

// Crear instancia global
window.Modal = new DadosModal();

// Función global para mostrar el modal (reemplaza el botón de dados original)
window.mostrarModalDados = function() {
  window.Modal.show();
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DadosModal;
}
