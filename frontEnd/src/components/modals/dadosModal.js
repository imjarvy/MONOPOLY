/**
 * Modal de Dados con Animación 3D Realista para Monopoly
 * Incluye animación física y entrada manual
 */

// Variable para prevenir múltiples llamadas simultáneas
let modalDadosAbierto = false;

// Función principal para mostrar el modal de dados
function mostrarModalDados() {
    // Prevenir múltiples llamadas simultáneas
    if (modalDadosAbierto) {
        return;
    }
    
    // Verificar si hay una acción de jugador pendiente
    if (typeof window.esperandoAccionJugador !== 'undefined' && window.esperandoAccionJugador) {
        if (typeof window.Toast !== 'undefined' && window.Toast) {
            window.Toast.warning("Completa la acción actual antes de lanzar los dados", "Acción Pendiente");
        }
        return;
    }
    
    modalDadosAbierto = true;
    
    const contenido = `
        <div class="dados-modal-container">
            <!-- Título minimalista -->
            <div class="dados-header">
                <h3>Lanzar Dados</h3>
                <p>Es tu turno para moverte por el tablero</p>
            </div>

            <!-- Área principal de dados -->
            <div class="dados-main-area">
                <!-- Dados con animación 3D -->
                <div class="dados-container" id="dadosContainer">
                    <div class="dado" id="dado1">
                        <div class="cara cara-1">
                            <div class="dot"></div>
                        </div>
                        <div class="cara cara-2">
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <div class="cara cara-3">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <div class="cara cara-4">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <div class="cara cara-5">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <div class="cara cara-6">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                    </div>
                    <div class="dado" id="dado2">
                        <div class="cara cara-1">
                            <div class="dot"></div>
                        </div>
                        <div class="cara cara-2">
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <div class="cara cara-3">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <div class="cara cara-4">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <div class="cara cara-5">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                        <div class="cara cara-6">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                    </div>
                </div>

                <!-- Botón de lanzar junto a los dados -->
                <button class="btn-lanzar" id="btnLanzarAuto" onclick="lanzarDadosAuto()">
                    Lanzar Dados
                </button>

                <!-- Resultado -->
                <div class="resultado-dados" id="resultadoDados">
                    <span class="resultado-text">Presiona "Lanzar" para comenzar</span>
                </div>
            </div>

            <!-- Entrada manual (abajo) -->
            <div class="manual-section">
                <h4>Tiro Manual</h4>
                <div class="manual-inputs">
                    <div class="inputs-row">
                        <div class="input-group">
                            <label>Dado 1</label>
                            <input type="number" id="manualDado1" min="1" max="6" placeholder="1">
                        </div>
                        <div class="input-group">
                            <label>Dado 2</label>
                            <input type="number" id="manualDado2" min="1" max="6" placeholder="1">
                        </div>
                    </div>
                    <button class="btn-manual" onclick="lanzarDadosManual()">
                        Usar Valores
                    </button>
                </div>
            </div>

            <!-- Botones de acción -->
            <div class="dados-actions">
                <button class="btn-secondary" onclick="window.Modal.close()">
                    Cancelar
                </button>
                <button class="btn-primary" id="btnConfirmar" onclick="confirmarMovimiento()" disabled>
                    Mover Ficha
                </button>
            </div>
        </div>
    `;

    const estilos = `
        .dados-modal-container {
            padding: 32px;
            text-align: center;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border-radius: 20px;
            color: #374151;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            max-width: 500px;
            margin: 0 auto;
        }

        .dados-header h3 {
            font-size: 2em;
            margin-bottom: 8px;
            color: #374151;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .dados-header p {
            color: #6b7280;
            margin-bottom: 24px;
            font-size: 1.1rem;
            font-weight: 400;
        }

        /* Área principal de dados */
        .dados-main-area {
            perspective: 1000px;
            margin-bottom: 30px;
            background: #fafbff;
            border-radius: 16px;
            padding: 24px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        .dados-container {
            display: flex;
            justify-content: center;
            gap: 50px;
            padding: 20px;
            background: #f1f5f9;
            border-radius: 12px;
            border: 1px solid #cbd5e1;
        }

        .dado {
            position: relative;
            width: 90px;
            height: 90px;
            transform-style: preserve-3d;
            transition: transform 0.6s;
        }

        .cara {
            position: absolute;
            width: 90px;
            height: 90px;
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border: 2px solid #d1d5db;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        /* Posicionamiento 3D de caras */
        .cara-1 { transform: rotateY(0deg) translateZ(45px); }
        .cara-2 { transform: rotateY(90deg) translateZ(45px); }
        .cara-3 { transform: rotateY(180deg) translateZ(45px); }
        .cara-4 { transform: rotateY(-90deg) translateZ(45px); }
        .cara-5 { transform: rotateX(90deg) translateZ(45px); }
        .cara-6 { transform: rotateX(-90deg) translateZ(45px); }

        /* Puntos de dados reales */
        .dot {
            width: 12px;
            height: 12px;
            background: #374151;
            border-radius: 50%;
            position: absolute;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        /* Cara 1 - Un punto central */
        .cara-1 .dot:nth-child(1) {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        /* Cara 2 - Dos puntos diagonal */
        .cara-2 .dot:nth-child(1) {
            top: 20%;
            left: 20%;
        }
        .cara-2 .dot:nth-child(2) {
            bottom: 20%;
            right: 20%;
        }

        /* Cara 3 - Tres puntos diagonal */
        .cara-3 .dot:nth-child(1) {
            top: 20%;
            left: 20%;
        }
        .cara-3 .dot:nth-child(2) {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .cara-3 .dot:nth-child(3) {
            bottom: 20%;
            right: 20%;
        }

        /* Cara 4 - Cuatro puntos esquinas */
        .cara-4 .dot:nth-child(1) {
            top: 20%;
            left: 20%;
        }
        .cara-4 .dot:nth-child(2) {
            top: 20%;
            right: 20%;
        }
        .cara-4 .dot:nth-child(3) {
            bottom: 20%;
            left: 20%;
        }
        .cara-4 .dot:nth-child(4) {
            bottom: 20%;
            right: 20%;
        }

        /* Cara 5 - Cinco puntos */
        .cara-5 .dot:nth-child(1) {
            top: 20%;
            left: 20%;
        }
        .cara-5 .dot:nth-child(2) {
            top: 20%;
            right: 20%;
        }
        .cara-5 .dot:nth-child(3) {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .cara-5 .dot:nth-child(4) {
            bottom: 20%;
            left: 20%;
        }
        .cara-5 .dot:nth-child(5) {
            bottom: 20%;
            right: 20%;
        }

        /* Cara 6 - Seis puntos */
        .cara-6 .dot:nth-child(1) {
            top: 20%;
            left: 20%;
        }
        .cara-6 .dot:nth-child(2) {
            top: 20%;
            right: 20%;
        }
        .cara-6 .dot:nth-child(3) {
            top: 50%;
            left: 20%;
            transform: translateY(-50%);
        }
        .cara-6 .dot:nth-child(4) {
            top: 50%;
            right: 20%;
            transform: translateY(-50%);
        }
        .cara-6 .dot:nth-child(5) {
            bottom: 20%;
            left: 20%;
        }
        .cara-6 .dot:nth-child(6) {
            bottom: 20%;
            right: 20%;
        }

        /* Animaciones de rotación */
        .dado.girando {
            animation: girarDado 2s ease-out;
        }

        @keyframes girarDado {
            0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
            25% { transform: rotateX(180deg) rotateY(180deg) rotateZ(90deg); }
            50% { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); }
            75% { transform: rotateX(540deg) rotateY(540deg) rotateZ(270deg); }
            100% { transform: rotateX(720deg) rotateY(720deg) rotateZ(360deg); }
        }

        /* Clases para mostrar caras específicas */
        .dado.mostrar-1 { transform: rotateY(0deg) rotateX(0deg); }
        .dado.mostrar-2 { transform: rotateY(-90deg) rotateX(0deg); }
        .dado.mostrar-3 { transform: rotateY(-180deg) rotateX(0deg); }
        .dado.mostrar-4 { transform: rotateY(90deg) rotateX(0deg); }
        .dado.mostrar-5 { transform: rotateY(0deg) rotateX(-90deg); }
        .dado.mostrar-6 { transform: rotateY(0deg) rotateX(90deg); }

        /* Botón de lanzar principal */
        .btn-lanzar {
            background: #3b82f6;
            color: white;
            border: 1px solid #3b82f6;
            border-radius: 6px;
            padding: 16px 32px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0;
            min-width: 200px;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .btn-lanzar:hover {
            background: #2563eb;
            border-color: #2563eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .btn-lanzar:disabled {
            background: #9ca3af;
            border-color: #9ca3af;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .btn-lanzar:active {
            transform: translateY(0);
        }

        /* Resultado */
        .resultado-dados {
            background: linear-gradient(135deg, #f3f4f6, #ffffff);
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .resultado-text {
            font-size: 1.3em;
            font-weight: 600;
            color: #374151;
            letter-spacing: 0.3px;
        }

        /* Sección manual */
        .manual-section {
            background: #fafbff;
            border-radius: 16px;
            padding: 20px;
            margin: 0;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            border-left: 6px solid #10b981;
        }

        .manual-section h4 {
            margin-bottom: 20px;
            font-size: 1.1em;
            font-weight: 600;
            color: #374151;
        }

        .manual-inputs {
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: center;
        }

        .inputs-row {
            display: flex;
            gap: 20px;
            justify-content: center;
            background: white;
            padding: 20px;
            border-radius: 12px;
            border: 2px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .input-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }

        .input-group label {
            font-weight: 600;
            color: #374151;
            font-size: 1rem;
        }

        .input-group input {
            width: 60px;
            height: 60px;
            padding: 0;
            border: 2px solid #d1d5db;
            border-radius: 8px;
            background: #ffffff;
            color: #374151;
            font-size: 1.5em;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .input-group input::placeholder {
            color: #9ca3af;
        }

        .input-group input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
            background: #ffffff;
        }

        .btn-manual {
            background: #10b981;
            color: white;
            border: 1px solid #10b981;
            border-radius: 6px;
            padding: 12px 24px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
        }

        .btn-manual:hover {
            background: #059669;
            border-color: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
        }

        /* Botones de acción */
        .dados-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 24px;
        }

        .btn-secondary, .btn-primary {
            padding: 12px 25px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1em;
            border: 1px solid;
        }

        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            border-color: #d1d5db;
        }

        .btn-primary {
            background: #10b981;
            color: white;
            border-color: #10b981;
        }

        .btn-primary:disabled {
            background: #9ca3af;
            border-color: #9ca3af;
            color: #ffffff;
            cursor: not-allowed;
        }

        .btn-secondary:hover:not(:disabled) {
            background: #e5e7eb;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn-primary:hover:not(:disabled) {
            background: #059669;
            border-color: #059669;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
        }

        /* Efectos especiales para dobles */
        .dobles-effect {
            animation: celebracion 1s ease-in-out;
            background: linear-gradient(135deg, #fef3c7, #fbbf24) !important;
            border-color: #f59e0b !important;
        }

        @keyframes celebracion {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .dados-modal-container {
                padding: 20px;
                min-height: 450px;
            }
            
            .dados-container {
                gap: 30px;
            }
            
            .dado {
                width: 70px;
                height: 70px;
            }
            
            .cara {
                width: 70px;
                height: 70px;
            }

            .cara-1 { transform: rotateY(0deg) translateZ(35px); }
            .cara-2 { transform: rotateY(90deg) translateZ(35px); }
            .cara-3 { transform: rotateY(180deg) translateZ(35px); }
            .cara-4 { transform: rotateY(-90deg) translateZ(35px); }
            .cara-5 { transform: rotateX(90deg) translateZ(35px); }
            .cara-6 { transform: rotateX(-90deg) translateZ(35px); }

            .dot {
                width: 10px;
                height: 10px;
            }
            
            .dados-actions {
                flex-direction: column;
                gap: 15px;
            }

            .inputs-row {
                flex-direction: column;
                gap: 15px;
            }
        }

        /* Animación de entrada futurista */
        .dados-modal-container {
            animation: fadeInScale 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        @keyframes fadeInScale {
            0% {
                opacity: 0;
                transform: scale(0.9) translateY(20px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        /* Efectos de hover para dados */
        .dado:hover {
            transform: scale(1.02);
        }

        /* Animación de entrada */
        .dados-modal-container {
            animation: fadeInScale 0.4s ease-out;
        }

        @keyframes fadeInScale {
            0% {
                opacity: 0;
                transform: scale(0.95);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;

    window.Modal.show(contenido, {
        title: '',
        customStyles: estilos,
        size: 'lg',
        closeOnOverlay: false,
        onClose: () => {
            modalDadosAbierto = false;
        }
    });
}

// Variables globales para el resultado
let ultimoResultado = { dado1: 0, dado2: 0, total: 0 };

// Función para lanzamiento automático
function lanzarDadosAuto() {
    const btnLanzar = document.getElementById('btnLanzarAuto');
    const btnConfirmar = document.getElementById('btnConfirmar');
    const resultado = document.getElementById('resultadoDados');
    
    // Deshabilitar botón durante la animación
    btnLanzar.disabled = true;
    btnLanzar.textContent = 'Lanzando...';
    btnConfirmar.disabled = true;
    
    // Limpiar inputs manuales
    document.getElementById('manualDado1').value = '';
    document.getElementById('manualDado2').value = '';
    
    // Iniciar animación
    const dado1Element = document.getElementById('dado1');
    const dado2Element = document.getElementById('dado2');
    
    dado1Element.className = 'dado girando';
    dado2Element.className = 'dado girando';
    
    resultado.innerHTML = '<span class="resultado-text">Girando dados...</span>';
    
    // Generar valores aleatorios
    const valor1 = Math.floor(Math.random() * 6) + 1;
    const valor2 = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
        // Mostrar resultado final
        dado1Element.className = `dado mostrar-${valor1}`;
        dado2Element.className = `dado mostrar-${valor2}`;
        
        ultimoResultado = { dado1: valor1, dado2: valor2, total: valor1 + valor2 };
        
        resultado.innerHTML = `
            <span class="resultado-text">
                Resultado: ${valor1} + ${valor2} = ${ultimoResultado.total}
                ${valor1 === valor2 ? '<br>¡Dobles! Puedes lanzar otra vez' : ''}
            </span>
        `;
        
        // Efectos especiales para dobles
        if (valor1 === valor2) {
            resultado.classList.add('dobles-effect');
            console.log('¡DOBLES! Sonido especial aquí');
            
            // Remover el efecto después de la animación
            setTimeout(() => {
                resultado.classList.remove('dobles-effect');
            }, 1000);
        }
        
        // Rehabilitar botones
        btnLanzar.disabled = false;
        btnLanzar.textContent = 'Lanzar Dados';
        btnConfirmar.disabled = false;
        
    }, 2000); // Duración de la animación
}

// Función para valores manuales
function lanzarDadosManual() {
    const manual1 = document.getElementById('manualDado1');
    const manual2 = document.getElementById('manualDado2');
    const resultado = document.getElementById('resultadoDados');
    const btnConfirmar = document.getElementById('btnConfirmar');
    
    const valor1 = parseInt(manual1.value);
    const valor2 = parseInt(manual2.value);
    
    // Validar valores
    if (!valor1 || !valor2 || valor1 < 1 || valor1 > 6 || valor2 < 1 || valor2 > 6) {
        resultado.innerHTML = '<span class="resultado-text">Por favor ingresa valores válidos (1-6)</span>';
        return;
    }
    
    // Mostrar dados con valores específicos
    const dado1Element = document.getElementById('dado1');
    const dado2Element = document.getElementById('dado2');
    
    dado1Element.className = `dado mostrar-${valor1}`;
    dado2Element.className = `dado mostrar-${valor2}`;
    
    ultimoResultado = { dado1: valor1, dado2: valor2, total: valor1 + valor2 };
    
    resultado.innerHTML = `
        <span class="resultado-text">
            Manual: ${valor1} + ${valor2} = ${ultimoResultado.total}
            ${valor1 === valor2 ? '<br>¡Dobles! Puedes lanzar otra vez' : ''}
        </span>
    `;
    
    // Efectos especiales para dobles también en manual
    if (valor1 === valor2) {
        resultado.classList.add('dobles-effect');
        setTimeout(() => {
            resultado.classList.remove('dobles-effect');
        }, 1000);
    }
    
    btnConfirmar.disabled = false;
}

// Función para confirmar movimiento
async function confirmarMovimiento() {
    if (ultimoResultado.total === 0) {
        if (typeof window.Toast !== 'undefined' && window.Toast) {
            window.Toast.warning("Primero debes lanzar los dados", "Acción Requerida");
        } else {
            alert('Primero debes lanzar los dados');
        }
        return;
    }
    
    // Guardar el valor antes de cualquier reset
    const espaciosAMover = ultimoResultado.total;
    
    // Cerrar modal PRIMERO
    modalDadosAbierto = false; // Resetear el flag antes de cerrar
    window.Modal.forceClose(); // Usar forceClose para dados
    
    try {
        // Importar y ejecutar el movimiento usando ES6 modules
        const module = await import('../../logica/turnos.js');
        if (module.moverFichaActual) {
            await module.moverFichaActual(espaciosAMover);
        } else {
            console.error('❌ [DEBUG] No se pudo encontrar la función moverFichaActual');
        }
    } catch (error) {
        console.error('❌ [DEBUG] Error al importar turnos.js:', error);
        // Fallback: llamar función global si existe
        if (typeof window.moverFichaActual === 'function') {
            await window.moverFichaActual(espaciosAMover);
        } else if (typeof moverJugador === 'function') {
            moverJugador(espaciosAMover, ultimoResultado);
        }
    }
    
    // Resetear el resultado DESPUÉS de todo
    ultimoResultado = { dado1: 0, dado2: 0, total: 0 };
}

// Hacer función disponible globalmente
window.mostrarModalDados = mostrarModalDados;