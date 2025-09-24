/**
 * Modal de Dados con Animación 3D Realista para Monopoly
 * Incluye animación física y entrada manual
 */

// Función principal para mostrar el modal de dados
function mostrarModalDados() {
    const contenido = `
        <div class="dados-modal-container">
            <!-- Título y contexto -->
            <div class="dados-header">
                <h3>🎲 Lanzar Dados</h3>
                <p>¡Es tu turno! Lanza los dados para moverte por el tablero</p>
            </div>

            <!-- Área de dados con animación -->
            <div class="dados-area">
                <div class="dados-container" id="dadosContainer">
                    <div class="dado" id="dado1">
                        <div class="cara cara-1">⚀</div>
                        <div class="cara cara-2">⚁</div>
                        <div class="cara cara-3">⚂</div>
                        <div class="cara cara-4">⚃</div>
                        <div class="cara cara-5">⚄</div>
                        <div class="cara cara-6">⚅</div>
                    </div>
                    <div class="dado" id="dado2">
                        <div class="cara cara-1">⚀</div>
                        <div class="cara cara-2">⚁</div>
                        <div class="cara cara-3">⚂</div>
                        <div class="cara cara-4">⚃</div>
                        <div class="cara cara-5">⚄</div>
                        <div class="cara cara-6">⚅</div>
                    </div>
                </div>

                <!-- Resultado -->
                <div class="resultado-dados" id="resultadoDados">
                    <span class="resultado-text">Presiona "Lanzar" para comenzar</span>
                </div>
            </div>

            <!-- Controles -->
            <div class="dados-controles">
                <!-- Lanzamiento automático -->
                <div class="control-section">
                    <h4>🎯 Lanzamiento Automático</h4>
                    <button class="btn-lanzar" id="btnLanzarAuto" onclick="lanzarDadosAuto()">
                        🎲 Lanzar Dados
                    </button>
                </div>

                <!-- Entrada manual -->
                <div class="control-section">
                    <h4>✋ Valores Manuales</h4>
                    <div class="manual-inputs">
                        <div class="input-group">
                            <label>Dado 1:</label>
                            <input type="number" id="manualDado1" min="1" max="6" placeholder="1-6">
                        </div>
                        <div class="input-group">
                            <label>Dado 2:</label>
                            <input type="number" id="manualDado2" min="1" max="6" placeholder="1-6">
                        </div>
                        <button class="btn-manual" onclick="lanzarDadosManual()">
                            ✅ Usar Valores
                        </button>
                    </div>
                </div>
            </div>

            <!-- Botones de acción -->
            <div class="dados-actions">
                <button class="btn-secondary" onclick="window.Modal.close()">
                    Cancelar
                </button>
                <button class="btn-primary" id="btnConfirmar" onclick="confirmarMovimiento()" disabled>
                    ➡️ Mover Ficha
                </button>
            </div>
        </div>
    `;

    const estilos = `
        .dados-modal-container {
            padding: 20px;
            text-align: center;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            border-radius: 20px;
            color: #374151;
            min-height: 500px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .dados-header h3 {
            font-size: 1.8em;
            margin-bottom: 8px;
            color: #374151;
            font-weight: 600;
        }

        .dados-header p {
            color: #6b7280;
            margin-bottom: 30px;
            font-size: 1.1rem;
        }

        /* Contenedor de dados 3D */
        .dados-area {
            perspective: 1000px;
            margin-bottom: 30px;
            background: #fafbff;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .dados-container {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 20px;
        }

        .dado {
            position: relative;
            width: 80px;
            height: 80px;
            transform-style: preserve-3d;
            transition: transform 0.6s;
            margin: 20px;
        }

        .cara {
            position: absolute;
            width: 80px;
            height: 80px;
            background: linear-gradient(145deg, #ffffff, #f0f0f0);
            border: 3px solid #d1d5db;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5em;
            color: #374151;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .cara-1 { transform: rotateY(0deg) translateZ(40px); }
        .cara-2 { transform: rotateY(90deg) translateZ(40px); }
        .cara-3 { transform: rotateY(180deg) translateZ(40px); }
        .cara-4 { transform: rotateY(-90deg) translateZ(40px); }
        .cara-5 { transform: rotateX(90deg) translateZ(40px); }
        .cara-6 { transform: rotateX(-90deg) translateZ(40px); }

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

        /* Resultado */
        .resultado-dados {
            background: linear-gradient(135deg, #f3f4f6, #ffffff);
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 15px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .resultado-text {
            font-size: 1.3em;
            font-weight: 600;
            color: #374151;
        }

        /* Controles */
        .dados-controles {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        .control-section {
            background: #fafbff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            border-left: 6px solid #3b82f6;
        }

        .control-section h4 {
            margin-bottom: 15px;
            font-size: 1.1em;
            font-weight: 600;
            color: #374151;
        }

        /* Botones principales - estilo consistente con registroUsuarios */
        .btn-lanzar {
            background: #3b82f6;
            color: white;
            border: 1px solid #3b82f6;
            border-radius: 6px;
            padding: 12px 25px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
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

        /* Inputs manuales - estilo consistente */
        .manual-inputs {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .input-group {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .input-group label {
            width: 70px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            font-size: 1rem;
        }

        .input-group input {
            flex: 1;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: #ffffff;
            color: #374151;
            font-size: 1em;
            text-align: center;
            transition: all 0.2s ease;
        }

        .input-group input::placeholder {
            color: #9ca3af;
        }

        .input-group input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }

        .btn-manual {
            background: #10b981;
            color: white;
            border: 1px solid #10b981;
            border-radius: 6px;
            padding: 10px 20px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 8px;
            font-size: 1rem;
        }

        .btn-manual:hover {
            background: #059669;
            border-color: #059669;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
        }

        /* Botones de acción - mismo estilo que registroUsuarios */
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
                padding: 15px;
                min-height: 400px;
            }
            
            .dados-controles {
                grid-template-columns: 1fr;
            }
            
            .dados-container {
                gap: 20px;
            }
            
            .dado {
                width: 60px;
                height: 60px;
            }
            
            .cara {
                width: 60px;
                height: 60px;
                font-size: 2em;
            }
            
            .dados-actions {
                flex-direction: column;
                gap: 10px;
            }
        }

        /* Animación de entrada mejorada */
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
        closeOnOverlay: false
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
    btnLanzar.textContent = '🎲 Lanzando...';
    btnConfirmar.disabled = true;
    
    // Limpiar inputs manuales
    document.getElementById('manualDado1').value = '';
    document.getElementById('manualDado2').value = '';
    
    // Iniciar animación
    const dado1Element = document.getElementById('dado1');
    const dado2Element = document.getElementById('dado2');
    
    dado1Element.className = 'dado girando';
    dado2Element.className = 'dado girando';
    
    resultado.innerHTML = '<span class="resultado-text">🎲 Girando dados...</span>';
    
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
                🎯 Resultado: ${valor1} + ${valor2} = ${ultimoResultado.total}
                ${valor1 === valor2 ? '<br>🎉 ¡Dobles! Puedes lanzar otra vez' : ''}
            </span>
        `;
        
        // Efectos especiales para dobles
        if (valor1 === valor2) {
            resultado.classList.add('dobles-effect');
            console.log('🎉 ¡DOBLES! Sonido especial aquí');
            
            // Remover el efecto después de la animación
            setTimeout(() => {
                resultado.classList.remove('dobles-effect');
            }, 1000);
        }
        
        // Rehabilitar botones
        btnLanzar.disabled = false;
        btnLanzar.textContent = '🎲 Lanzar Dados';
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
        resultado.innerHTML = '<span class="resultado-text">⚠️ Por favor ingresa valores válidos (1-6)</span>';
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
            ✋ Manual: ${valor1} + ${valor2} = ${ultimoResultado.total}
            ${valor1 === valor2 ? '<br>🎉 ¡Dobles! Puedes lanzar otra vez' : ''}
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
function confirmarMovimiento() {
    if (ultimoResultado.total === 0) {
        if (typeof window.Toast !== 'undefined' && window.Toast) {
            window.Toast.warning("Primero debes lanzar los dados", "Acción Requerida");
        } else {
            alert('⚠️ Primero debes lanzar los dados');
        }
        return;
    }
    
    // Aquí integrar con la lógica del juego
    console.log(`🎯 Moviendo ficha ${ultimoResultado.total} espacios:`, ultimoResultado);
    
    // Llamar a función del juego principal (si existe)
    if (typeof moverJugador === 'function') {
        moverJugador(ultimoResultado.total, ultimoResultado);
    }
    
    // Cerrar modal
    window.Modal.close();
    
    // Opcional: mostrar notificación
    if (typeof window.Toast !== 'undefined' && window.Toast) {
        window.Toast.info(`Dados: ${ultimoResultado.dado1} + ${ultimoResultado.dado2} = ${ultimoResultado.total} - Moviendo ficha...`, "Resultado de Dados");
    } else {
        alert(`🎲 Dados: ${ultimoResultado.dado1} + ${ultimoResultado.dado2} = ${ultimoResultado.total}\n➡️ Moviendo ficha...`);
    }
}

// Hacer función disponible globalmente
window.mostrarModalDados = mostrarModalDados;