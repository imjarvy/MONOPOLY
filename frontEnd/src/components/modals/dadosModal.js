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
    
    // Verificar si el jugador puede tirar dados (sistema de cárcel)
    if (typeof obtenerJugadorActual === 'function') {
        const jugadorActual = obtenerJugadorActual();
        if (jugadorActual && typeof puedeJugarTurno === 'function') {
            if (!puedeJugarTurno(jugadorActual)) {
                return; // puedeJugarTurno ya maneja mostrar el modal de cárcel
            }
        }
    }
    
    modalDadosAbierto = true;
    
    const contenido = `
        <div class="dados-modal-container" data-version="2.1-${Date.now()}">
            <!-- 🔧 DEBUG: DADOS MODAL v2.1 RESPONSIVE UPDATED -->
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
            width: 100%;
            max-width: 100%;
            margin: 0;
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
            padding: 32px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            width: 100%;
        }

        .dados-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 80px;
            padding: 30px;
            background: #f1f5f9;
            border-radius: 16px;
            border: 1px solid #cbd5e1;
            width: 100%;
            max-width: 600px;
        }

        .dado {
            position: relative;
            width: 100px;
            height: 100px;
            transform-style: preserve-3d;
            transition: transform 0.6s;
        }

        .cara {
            position: absolute;
            width: 100px;
            height: 100px;
            background: linear-gradient(145deg, #ffffff, #f8fafc);
            border: 2px solid #d1d5db;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        /* Posicionamiento 3D de caras */
        .cara-1 { transform: rotateY(0deg) translateZ(50px); }
        .cara-2 { transform: rotateY(90deg) translateZ(50px); }
        .cara-3 { transform: rotateY(180deg) translateZ(50px); }
        .cara-4 { transform: rotateY(-90deg) translateZ(50px); }
        .cara-5 { transform: rotateX(90deg) translateZ(50px); }
        .cara-6 { transform: rotateX(-90deg) translateZ(50px); }

        /* Puntos de dados reales */
        .dot {
            width: 14px;
            height: 14px;
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
            border-radius: 8px;
            padding: 18px 40px;
            font-size: 1.2em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0;
            min-width: 240px;
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
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
            padding: 25px 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            width: 100%;
            max-width: 500px;
        }

        .resultado-text {
            font-size: 1.4em;
            font-weight: 600;
            color: #374151;
            letter-spacing: 0.3px;
            line-height: 1.4;
        }

        /* Sección manual - MOBILE FIRST */
        .manual-section {
            background: #fafbff;
            border-radius: 12px; /* Reducido para mobile */
            padding: 20px; /* Reducido para mobile */
            margin: 0;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            border-left: 4px solid #10b981; /* Reducido para mobile */
            width: 100%;
        }

        .manual-section h4 {
            margin-bottom: 16px; /* Reducido para mobile */
            font-size: 1.05em; /* Reducido para mobile */
            font-weight: 600;
            color: #374151;
            text-align: center; /* NUEVO: Centrado para mobile */
        }

        .manual-inputs {
            display: flex;
            flex-direction: column;
            gap: 16px; /* Reducido para mobile */
            align-items: center;
        }

        .inputs-row {
            display: flex;
            gap: 24px; /* AUMENTADO: mejor separación visual */
            justify-content: space-between; /* CAMBIADO: distribución uniforme */
            background: white;
            padding: 18px 28px; /* AUMENTADO: más padding horizontal */
            border-radius: 12px; 
            border: 2px solid #e5e7eb;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            max-width: 320px; /* AUMENTADO: más espacio para inputs */
            min-width: 300px; /* NUEVO: Ancho mínimo garantizado */
            width: 100%;
            box-sizing: border-box; 
            margin: 0 auto; /* NUEVO: Centrado automático */
        }

        .input-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px; 
            flex: 0 0 70px; /* AUMENTADO: más espacio fijo */
            min-width: 70px; /* NUEVO: Ancho mínimo */
            max-width: 70px; /* NUEVO: Ancho máximo controlado */
        }

        .input-group label {
            font-weight: 600;
            color: #374151;
            font-size: 0.9rem; /* Reducido para mobile */
            white-space: nowrap; /* NUEVO: Evitar saltos */
        }

        .input-group input {
            width: 50px; /* REDUCIDO: más apropiado para mobile */
            height: 50px; /* REDUCIDO: más apropiado para mobile */
            padding: 0;
            border: 2px solid #d1d5db;
            border-radius: 10px; /* Reducido para mobile */
            background: #ffffff;
            color: #374151;
            font-size: 1.3em; /* Reducido para mobile */
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            font-weight: 600;
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
            border-radius: 8px;
            padding: 12px 24px; /* REDUCIDO: más apropiado para mobile */
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 3px 6px rgba(16, 185, 129, 0.2);
            font-size: 0.95em; /* REDUCIDO: más apropiado para mobile */
            min-height: 44px; /* NUEVO: Touch-friendly */
            min-width: 120px; /* NUEVO: Tamaño mínimo funcional */
            max-width: 200px; /* NUEVO: Control de tamaño máximo */
        }

        .btn-manual:hover {
            background: #059669;
            border-color: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
        }
        
        .btn-manual:active {
            background: #047857;
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
        }

        /* Botones de acción */
        .dados-actions {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 30px;
            width: 100%;
        }

        .btn-secondary, .btn-primary {
            padding: 14px 30px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1.1em;
            border: 1px solid;
            min-width: 140px;
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

        /* =========================== */
        /* FORZAR ESTILOS MOBILE SMALL */
        /* =========================== */
        @media screen and (max-width: 600px) {
            .dados-modal-container .manual-section {
                padding: 16px !important;
                border-radius: 10px !important;
                margin: 0 !important;
            }
            
            .dados-modal-container .manual-section h4 {
                font-size: 1rem !important;
                margin-bottom: 12px !important;
                text-align: center !important;
            }
            
            .dados-modal-container .inputs-row {
                max-width: 250px !important; /* AUMENTADO: más espacio para 2 inputs */
                min-width: 240px !important; /* NUEVO: Ancho mínimo garantizado */
                padding: 16px 24px !important; /* AUMENTADO: más padding horizontal */
                gap: 20px !important; /* AUMENTADO: mejor separación visual */
                background: rgba(248, 250, 252, 0.8) !important;
                border-radius: 10px !important;
                border: 1px solid #e5e7eb !important;
                margin: 0 auto !important;
                box-sizing: border-box !important;
                display: flex !important;
                justify-content: space-between !important; /* CAMBIADO: distribuir uniformemente */
                align-items: center !important;
                width: auto !important; /* NUEVO: Permitir ancho automático */
            }
            
            .dados-modal-container .input-group {
                min-width: 60px !important; /* AUMENTADO: más espacio garantizado */
                max-width: 60px !important; /* NUEVO: Ancho fijo para evitar deformación */
                flex: 0 0 60px !important; /* CAMBIADO: Tamaño fijo sin flexibilidad */
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important; /* NUEVO: Centrado vertical */
            }
            
            .dados-modal-container .input-group input {
                width: 42px !important;
                height: 42px !important;
                font-size: 1.1em !important;
                border-radius: 8px !important;
                text-align: center !important;
                border: 2px solid #d1d5db !important;
                background: white !important;
                box-sizing: border-box !important;
                font-weight: 600 !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            .dados-modal-container .input-group input:focus {
                border-color: #3b82f6 !important;
                box-shadow: 0 0 6px rgba(59, 130, 246, 0.3) !important;
                outline: none !important;
            }
            
            .dados-modal-container .input-group label {
                font-size: 0.85rem !important;
                color: #374151 !important;
                font-weight: 500 !important;
                margin-bottom: 4px !important;
                white-space: nowrap !important;
                text-align: center !important;
            }
            
            .dados-modal-container .btn-manual {
                padding: 10px 20px !important;
                font-size: 0.9rem !important;
                min-height: 44px !important;
                min-width: 120px !important;
                max-width: 180px !important;
                margin-top: 8px !important;
                background: #10b981 !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
                border: none !important;
                color: white !important;
                cursor: pointer !important;
                display: block !important;
                margin-left: auto !important;
                margin-right: auto !important;
            }
            
            .dados-modal-container .btn-manual:hover {
                background: #059669 !important;
                transform: translateY(-1px) !important;
            }
        }

        /* PANTALLAS MUY PEQUEÑAS */
        @media screen and (max-width: 400px) {
            .dados-modal-container .inputs-row {
                max-width: 220px !important; /* AUMENTADO: más espacio */
                min-width: 210px !important; /* NUEVO: Mínimo garantizado */
                padding: 12px 20px !important; /* AUMENTADO: más padding */
                gap: 18px !important; /* AUMENTADO: mejor separación */
            }
            
            .dados-modal-container .input-group {
                min-width: 55px !important; /* AUMENTADO */
                max-width: 55px !important; /* NUEVO: Ancho fijo */
                flex: 0 0 55px !important; /* Tamaño fijo */
            }
            
            .dados-modal-container .input-group input {
                width: 38px !important;
                height: 38px !important;
                font-size: 1em !important;
            }
            
            .dados-modal-container .input-group label {
                font-size: 0.8rem !important;
            }
            
            .dados-modal-container .btn-manual {
                padding: 8px 16px !important;
                font-size: 0.85rem !important;
                min-width: 110px !important;
            }
        }

        /* PANTALLAS EXTRA PEQUEÑAS */
        @media screen and (max-width: 350px) {
            .dados-modal-container .inputs-row {
                max-width: 200px !important; /* AUMENTADO: más espacio */
                min-width: 190px !important; /* NUEVO: Mínimo garantizado */
                padding: 10px 18px !important; /* AUMENTADO: más padding */
                gap: 16px !important; /* AUMENTADO: mejor separación */
            }
            
            .dados-modal-container .input-group {
                min-width: 50px !important; /* AUMENTADO */
                max-width: 50px !important; /* NUEVO: Ancho fijo */
                flex: 0 0 50px !important; /* Tamaño fijo */
            }
            
            .dados-modal-container .input-group input {
                width: 35px !important;
                height: 35px !important;
                font-size: 0.95em !important;
            }
            
            .dados-modal-container .input-group label {
                font-size: 0.75rem !important;
            }
            
            .dados-modal-container .btn-manual {
                padding: 8px 14px !important;
                font-size: 0.8rem !important;
                min-width: 100px !important;
            }
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

        /* ===== RESPONSIVE DESIGN COMPLETO INTEGRADO ===== */
        
        /* PANTALLAS GRANDES - Computadores de escritorio (1200px y más) */
        @media screen and (min-width: 1200px) {
            .dados-modal-container {
                padding: 40px;
                min-height: 600px;
                max-width: 900px;
            }
            
            .dados-header h3 {
                font-size: 2.2em;
                margin-bottom: 12px;
            }
            
            .dados-header p {
                font-size: 1.2rem;
                margin-bottom: 32px;
            }
            
            .dados-main-area {
                padding: 40px;
                margin-bottom: 36px;
            }
            
            .dados-container {
                gap: 100px;
                padding: 40px;
                max-width: 700px;
            }
            
            .dado {
                width: 120px;
                height: 120px;
            }
            
            .cara {
                width: 120px;
                height: 120px;
            }
            
            .cara-1 { transform: rotateY(0deg) translateZ(60px); }
            .cara-2 { transform: rotateY(90deg) translateZ(60px); }
            .cara-3 { transform: rotateY(180deg) translateZ(60px); }
            .cara-4 { transform: rotateY(-90deg) translateZ(60px); }
            .cara-5 { transform: rotateX(90deg) translateZ(60px); }
            .cara-6 { transform: rotateX(-90deg) translateZ(60px); }
            
            .dot {
                width: 16px;
                height: 16px;
            }
            
            .btn-lanzar {
                padding: 20px 50px;
                font-size: 1.3em;
                min-width: 280px;
            }
            
            .resultado-dados {
                padding: 32px 40px;
                max-width: 600px;
            }
            
            .resultado-text {
                font-size: 1.6em;
            }
            
            .manual-section {
                padding: 36px;
            }
            
            .inputs-row {
                gap: 60px;
                padding: 32px 45px;
                max-width: 500px;
            }
            
            .input-group input {
                width: 80px;
                height: 80px;
                font-size: 1.8em;
            }
            
            .btn-manual {
                padding: 16px 40px;
                font-size: 1.2em;
            }
            
            .dados-actions {
                gap: 30px;
                margin-top: 40px;
            }
            
            .btn-secondary, .btn-primary {
                padding: 16px 40px;
                font-size: 1.2em;
                min-width: 180px;
            }
        }

        /* LAPTOPS Y COMPUTADORES MEDIANOS (992px - 1199px) */
        @media screen and (min-width: 992px) and (max-width: 1199px) {
            .dados-modal-container {
                padding: 36px;
                min-height: 550px;
                max-width: 800px;
            }
            
            .dados-header h3 {
                font-size: 2.1em;
                margin-bottom: 10px;
            }
            
            .dados-main-area {
                padding: 36px;
                margin-bottom: 32px;
            }
            
            .dados-container {
                gap: 90px;
                padding: 36px;
                max-width: 650px;
            }
            
            .dado {
                width: 110px;
                height: 110px;
            }
            
            .cara {
                width: 110px;
                height: 110px;
            }
            
            .cara-1 { transform: rotateY(0deg) translateZ(55px); }
            .cara-2 { transform: rotateY(90deg) translateZ(55px); }
            .cara-3 { transform: rotateY(180deg) translateZ(55px); }
            .cara-4 { transform: rotateY(-90deg) translateZ(55px); }
            .cara-5 { transform: rotateX(90deg) translateZ(55px); }
            .cara-6 { transform: rotateX(-90deg) translateZ(55px); }
            
            .dot {
                width: 15px;
                height: 15px;
            }
            
            .btn-lanzar {
                padding: 19px 45px;
                font-size: 1.25em;
                min-width: 260px;
            }
            
            .resultado-text {
                font-size: 1.5em;
            }
            
            .manual-section {
                padding: 32px;
            }
            
            .inputs-row {
                gap: 50px;
                padding: 28px 40px;
            }
            
            .input-group input {
                width: 75px;
                height: 75px;
                font-size: 1.7em;
            }
        }

        /* TABLETS - Pantalla mediana (768px - 991px) */
        @media screen and (min-width: 768px) and (max-width: 991px) {
            .dados-modal-container {
                padding: 32px;
                min-height: 500px;
                max-width: 700px;
            }
            
            .dados-header h3 {
                font-size: 2em;
                margin-bottom: 8px;
            }
            
            .dados-header p {
                font-size: 1.05rem;
                margin-bottom: 28px;
            }
            
            .dados-main-area {
                padding: 32px;
                margin-bottom: 28px;
            }
            
            .dados-container {
                gap: 70px;
                padding: 32px;
                max-width: 550px;
            }
            
            .dado {
                width: 90px;
                height: 90px;
            }
            
            .cara {
                width: 90px;
                height: 90px;
            }
            
            .cara-1 { transform: rotateY(0deg) translateZ(45px); }
            .cara-2 { transform: rotateY(90deg) translateZ(45px); }
            .cara-3 { transform: rotateY(180deg) translateZ(45px); }
            .cara-4 { transform: rotateY(-90deg) translateZ(45px); }
            .cara-5 { transform: rotateX(90deg) translateZ(45px); }
            .cara-6 { transform: rotateX(-90deg) translateZ(45px); }

            .dot {
                width: 13px;
                height: 13px;
            }
            
            .btn-lanzar {
                padding: 16px 38px;
                font-size: 1.15em;
                min-width: 220px;
            }
            
            .resultado-dados {
                padding: 24px 28px;
                max-width: 450px;
            }
            
            .resultado-text {
                font-size: 1.3em;
            }
            
            .manual-section {
                padding: 28px;
            }
            
            .inputs-row {
                gap: 35px;
                padding: 24px 32px;
                max-width: 380px;
            }
            
            .input-group input {
                width: 65px;
                height: 65px;
                font-size: 1.5em;
            }
            
            .btn-manual {
                padding: 13px 28px;
                font-size: 1.05em;
            }
            
            .dados-actions {
                gap: 18px;
                margin-top: 28px;
            }
            
            .btn-secondary, .btn-primary {
                padding: 13px 26px;
                font-size: 1.05em;
                min-width: 120px;
            }
        }

        /* MÓVILES GRANDES Y TABLETS PEQUEÑAS (481px - 767px) */
        @media screen and (min-width: 481px) and (max-width: 767px) {
            .dados-modal-container {
                padding: 28px;
                min-height: 480px;
                max-width: 100%;
                width: 100%;
            }
            
            .dados-header h3 {
                font-size: 1.8em;
                margin-bottom: 6px;
            }
            
            .dados-header p {
                font-size: 1rem;
                margin-bottom: 24px;
            }
            
            .dados-main-area {
                padding: 28px;
                margin-bottom: 24px;
            }
            
            .dados-container {
                gap: 50px;
                padding: 28px;
                width: 100%;
                max-width: none;
            }
            
            .dado {
                width: 75px;
                height: 75px;
            }
            
            .cara {
                width: 75px;
                height: 75px;
            }
            
            .cara-1 { transform: rotateY(0deg) translateZ(37.5px); }
            .cara-2 { transform: rotateY(90deg) translateZ(37.5px); }
            .cara-3 { transform: rotateY(180deg) translateZ(37.5px); }
            .cara-4 { transform: rotateY(-90deg) translateZ(37.5px); }
            .cara-5 { transform: rotateX(90deg) translateZ(37.5px); }
            .cara-6 { transform: rotateX(-90deg) translateZ(37.5px); }

            .dot {
                width: 11px;
                height: 11px;
            }
            
            .btn-lanzar {
                padding: 14px 32px;
                font-size: 1.1em;
                min-width: 200px;
                min-height: 48px;
            }
            
            .resultado-dados {
                padding: 22px 26px;
                width: 100%;
                max-width: none;
            }
            
            .resultado-text {
                font-size: 1.25em;
                line-height: 1.3;
            }
            
            .manual-section {
                padding: 24px;
                width: 100%;
            }
            
            .inputs-row {
                gap: 30px;
                padding: 20px 28px;
                width: 100%;
                max-width: none;
                justify-content: center;
            }
            
            .input-group input {
                width: 55px;
                height: 55px;
                font-size: 1.3em;
                min-height: 48px;
            }
            
            .btn-manual {
                padding: 12px 24px;
                font-size: 1rem;
                min-height: 48px;
                width: 100%;
                max-width: 200px;
            }
            
            .dados-actions {
                flex-direction: row;
                gap: 12px;
                margin-top: 24px;
                width: 100%;
            }
            
            .btn-secondary, .btn-primary {
                padding: 12px 20px;
                font-size: 1rem;
                min-height: 48px;
                flex: 1;
                max-width: none;
            }
        }

        /* MÓVILES PEQUEÑOS (320px - 480px) */
        @media screen and (max-width: 480px) {
            .dados-modal-container {
                padding: 16px; /* Reducido para más espacio */
                min-height: 450px;
                width: 100%;
                max-width: 100%;
            }
            
            .dados-header h3 {
                font-size: 1.5em; /* Reducido un poco */
                margin-bottom: 6px;
                line-height: 1.2;
            }
            
            .dados-header p {
                font-size: 0.9rem; /* Reducido */
                margin-bottom: 18px; /* Reducido */
                line-height: 1.3;
            }
            
            .dados-main-area {
                padding: 16px; /* Reducido */
                margin-bottom: 16px; /* Reducido */
                gap: 16px; /* Reducido */
            }
            
            .dados-container {
                gap: 20px; /* Reducido de 25px */
                flex-direction: row; /* CAMBIO: Mantener horizontal para evitar que se salga */
                align-items: center;
                justify-content: space-around; /* CAMBIO: Distribución uniforme */
                padding: 14px; /* Reducido */
                width: 100%;
                max-width: 280px; /* NUEVO: Limitar ancho máximo */
                margin: 0 auto; /* NUEVO: Centrar */
            }
            
            .dado {
                width: 55px; /* Reducido de 65px */
                height: 55px;
                flex: 0 0 55px; /* NUEVO: Evitar que se deforme */
            }
            
            .cara {
                width: 55px;
                height: 55px;
                border-radius: 6px; /* Reducido */
            }
            
            .cara-1 { transform: rotateY(0deg) translateZ(27.5px); }
            .cara-2 { transform: rotateY(90deg) translateZ(27.5px); }
            .cara-3 { transform: rotateY(180deg) translateZ(27.5px); }
            .cara-4 { transform: rotateY(-90deg) translateZ(27.5px); }
            .cara-5 { transform: rotateX(90deg) translateZ(27.5px); }
            .cara-6 { transform: rotateX(-90deg) translateZ(27.5px); }

            .dot {
                width: 8px; /* Reducido */
                height: 8px;
            }
            
            .btn-lanzar {
                padding: 12px 24px; /* Reducido */
                font-size: 0.9rem; /* Reducido */
                min-width: 160px; /* Reducido */
                min-height: 44px; /* Mantenido para touch */
                width: 100%;
                max-width: 220px; /* NUEVO: Limitar ancho */
            }
            
            .resultado-dados {
                padding: 14px 16px; /* Reducido */
                width: 100%;
                border-radius: 8px; /* Reducido */
            }
            
            .resultado-text {
                font-size: 1rem; /* Reducido */
                line-height: 1.2; /* Ajustado */
            }
            
            .manual-section {
                padding: 14px; /* Reducido */
                width: 100%;
                border-radius: 10px; /* Reducido */
            }
            
            .manual-section h4 {
                margin-bottom: 12px; /* Reducido */
                font-size: 0.95rem; /* Reducido */
            }
            
            .inputs-row {
                gap: 18px; /* AUMENTADO: mejor espaciado visual */
                padding: 14px 18px; /* AUMENTADO: más cómodo */
                width: 100%;
                flex-direction: row; /* Mantener horizontal */
                justify-content: center;
                align-items: center;
                max-width: 220px; /* AUMENTADO: más espacio funcional */
                margin: 0 auto; 
                box-sizing: border-box; 
                background: rgba(248, 250, 252, 0.5); /* NUEVO: Fondo sutil */
                border-radius: 8px; /* NUEVO: Estilo visual */
            }
            
            .input-group {
                flex: 0 0 auto; 
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 60px; /* AUMENTADO: espacio mínimo */
            }
            
            .input-group input {
                width: 44px; /* AUMENTADO: más touch-friendly */
                height: 44px; /* AUMENTADO: mejor para dedos */
                font-size: 1.2em; /* AUMENTADO: más legible */
                min-height: 44px; /* Touch-friendly estándar */
                border-radius: 8px; 
                border: 2px solid #d1d5db;
                box-sizing: border-box; 
                text-align: center;
                margin: 0; 
                background: white;
                font-weight: 600; /* NUEVO: Números más visibles */
            }
            
            .input-group input:focus {
                border-color: #3b82f6; /* NUEVO: Color de foco */
                outline: none;
                box-shadow: 0 0 6px rgba(59, 130, 246, 0.3);
            }
            
            .input-group label {
                font-size: 0.85rem; /* AUMENTADO: más legible */
                margin-bottom: 6px; /* AUMENTADO: mejor espaciado */
                white-space: nowrap; 
                color: #374151; /* NUEVO: Color más definido */
                font-weight: 500; /* NUEVO: Etiquetas más visibles */
            }
            
            .btn-manual {
                padding: 12px 20px; /* AUMENTADO: más área de toque */
                font-size: 0.95rem; /* AUMENTADO: más legible */
                min-height: 48px; /* AUMENTADO: mejor touch target */
                width: auto;
                min-width: 130px; /* AUMENTADO: botón más funcional */
                max-width: 180px; /* AUMENTADO: sin restricciones excesivas */
                background: #10b981; /* NUEVO: Verde más moderno */
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600; /* NUEVO: Texto más visible */
                cursor: pointer;
                margin-top: 10px; /* AUMENTADO: mejor espaciado */
                box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2); /* NUEVO: Sombra sutil */
                transition: all 0.2s ease; /* NUEVO: Animación suave */
            }
            
            .btn-manual:hover {
                background: #059669; /* NUEVO: Hover moderno */
                box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
                transform: translateY(-1px); /* NUEVO: Efecto hover sutil */
            }
            
            .btn-manual:active {
                background: #047857; /* NUEVO: Estado activo */
                transform: translateY(0);
                box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
            }
            
            .dados-actions {
                flex-direction: column;
                gap: 8px; /* Reducido */
                margin-top: 16px; /* Reducido */
                width: 100%;
            }
            
            .btn-secondary, .btn-primary {
                padding: 12px 16px; /* Reducido */
                font-size: 0.9rem; /* Reducido */
                min-height: 44px; /* Mantenido para touch */
                width: 100%;
                border-radius: 6px; /* Reducido */
            }
        }

        /* MÓVILES MUY PEQUEÑOS (menos de 320px) */
        @media screen and (max-width: 319px) {
            .dados-modal-container {
                padding: 12px; /* Reducido aún más */
                min-height: 400px; /* Reducido */
            }
            
            .dados-header h3 {
                font-size: 1.3em; /* Reducido */
                margin-bottom: 4px;
            }
            
            .dados-header p {
                font-size: 0.85rem; /* Reducido */
                margin-bottom: 14px; /* Reducido */
            }
            
            .dados-main-area {
                padding: 12px; /* Reducido */
                gap: 12px; /* Reducido */
            }
            
            .dados-container {
                gap: 16px; /* Reducido */
                padding: 10px; /* Reducido */
                flex-direction: row; /* CAMBIO: Mantener horizontal */
                align-items: center;
                justify-content: space-around; /* CAMBIO: Distribución uniforme */
                max-width: 220px; /* NUEVO: Limitar ancho máximo */
                margin: 0 auto; /* NUEVO: Centrar */
            }
            
            .dado {
                width: 45px; /* REDUCIDO: de 55px a 45px */
                height: 45px;
                flex: 0 0 45px; /* NUEVO: Tamaño fijo */
            }
            
            .cara {
                width: 45px;
                height: 45px;
                border-radius: 5px; /* Reducido */
            }
            
            .cara-1 { transform: rotateY(0deg) translateZ(22.5px); } /* Ajustado */
            .cara-2 { transform: rotateY(90deg) translateZ(22.5px); }
            .cara-3 { transform: rotateY(180deg) translateZ(22.5px); }
            .cara-4 { transform: rotateY(-90deg) translateZ(22.5px); }
            .cara-5 { transform: rotateX(90deg) translateZ(22.5px); }
            .cara-6 { transform: rotateX(-90deg) translateZ(22.5px); }

            .dot {
                width: 6px; /* REDUCIDO: de 8px a 6px */
                height: 6px;
            }
            
            .btn-lanzar {
                padding: 10px 20px; /* Reducido */
                font-size: 0.85rem; /* Reducido */
                min-width: 140px; /* Reducido */
                min-height: 44px; /* Mantenido para touch */
                max-width: 180px; /* NUEVO: Limitar ancho */
            }
            
            .resultado-dados {
                padding: 12px 14px; /* Reducido */
            }
            
            .resultado-text {
                font-size: 0.9rem; /* Reducido */
                line-height: 1.2;
            }
            
            .manual-section {
                padding: 12px; /* Reducido */
            }
            
            .manual-section h4 {
                margin-bottom: 10px; /* Reducido */
                font-size: 0.9rem; /* Reducido */
            }
            
            .inputs-row {
                gap: 12px; /* REDUCIDO: de 16px a 12px */
                padding: 10px 12px; /* REDUCIDO: menos padding */
                width: 100%;
                max-width: 160px; /* NUEVO: Limitar ancho aún más */
                margin: 0 auto; /* NUEVO: Centrar */
                box-sizing: border-box;
            }
            
            .input-group {
                flex: 0 0 auto;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .input-group input {
                width: 35px; /* REDUCIDO: de 45px a 35px */
                height: 35px; /* REDUCIDO: de 45px a 35px */
                font-size: 1rem; /* Reducido */
                min-height: 35px; /* Ajustado */
                border-radius: 6px; /* Reducido */
                border: 1px solid #d1d5db; /* Border más fino */
                box-sizing: border-box;
                text-align: center;
                margin: 0;
            }
            
            .input-group label {
                font-size: 0.75rem; /* REDUCIDO */
                margin-bottom: 3px; /* Reducido */
                white-space: nowrap;
            }
            
            .btn-manual {
                padding: 8px 14px; /* Reducido */
                font-size: 0.85rem; /* Reducido */
                min-height: 40px; /* Reducido pero manteniendo usabilidad */
                max-width: 140px; /* NUEVO: Limitar ancho */
            }
            
            .dados-actions {
                gap: 6px; /* Reducido */
                margin-top: 14px; /* Reducido */
            }
            
            .btn-secondary, .btn-primary {
                padding: 10px 14px; /* Reducido */
                font-size: 0.85rem; /* Reducido */
                min-height: 40px; /* Reducido pero usable */
                border-radius: 5px; /* Reducido */
            }
        }
                height: 45px;
                font-size: 1.1em;
                min-height: 44px;
            }
            
            .btn-manual {
                padding: 10px 16px;
                font-size: 0.9rem;
                min-height: 44px;
            }
            
            .btn-secondary, .btn-primary {
                padding: 12px 16px;
                font-size: 0.9rem;
                min-height: 44px;
            }
        }

        /* ORIENTACIÓN LANDSCAPE PARA MÓVILES */
        @media screen and (max-width: 768px) and (orientation: landscape) {
            .dados-modal-container {
                padding: 12px; /* Reducido */
                min-height: auto;
                max-height: 90vh; /* Aumentado un poco */
                overflow-y: auto;
                width: 98%; /* Aumentado */
                max-width: 650px; /* Reducido */
            }
            
            .dados-header {
                margin-bottom: 12px; /* Reducido */
            }
            
            .dados-header h3 {
                font-size: 1.3em; /* Reducido */
                margin-bottom: 3px; /* Reducido */
            }
            
            .dados-header p {
                font-size: 0.85rem; /* Reducido */
                margin-bottom: 10px; /* Reducido */
            }
            
            .dados-main-area {
                padding: 12px; /* Reducido */
                margin-bottom: 12px; /* Reducido */
                gap: 12px; /* Reducido */
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }
            
            .dados-container {
                gap: 20px; /* Reducido de 30px */
                flex-direction: row;
                padding: 12px; /* Reducido */
                flex: 0 0 auto;
                background: #f8fafc;
                border-radius: 10px; /* Reducido */
                max-width: 200px; /* NUEVO: Limitar ancho */
            }
            
            .dado {
                width: 40px; /* REDUCIDO: de 50px a 40px */
                height: 40px;
                flex: 0 0 40px; /* NUEVO: Tamaño fijo */
            }
            
            .cara {
                width: 40px;
                height: 40px;
                border-radius: 4px; /* Reducido */
            }
            
            .cara-1 { transform: rotateY(0deg) translateZ(20px); } /* Ajustado */
            .cara-2 { transform: rotateY(90deg) translateZ(20px); }
            .cara-3 { transform: rotateY(180deg) translateZ(20px); }
            .cara-4 { transform: rotateY(-90deg) translateZ(20px); }
            .cara-5 { transform: rotateX(90deg) translateZ(20px); }
            .cara-6 { transform: rotateX(-90deg) translateZ(20px); }

            .dot {
                width: 5px; /* REDUCIDO: de 7px a 5px */
                height: 5px;
            }
            
            .btn-lanzar {
                padding: 8px 16px; /* Reducido */
                font-size: 0.8rem; /* Reducido */
                min-width: 100px; /* Reducido */
                min-height: 36px; /* Reducido pero funcional */
                flex: 0 0 auto;
                max-width: 120px; /* NUEVO: Limitar ancho */
            }
            
            .resultado-dados {
                padding: 8px 12px; /* Reducido */
                flex: 1;
                margin: 0 10px; /* Reducido */
            }
            
            .resultado-text {
                font-size: 0.8em; /* Reducido */
                line-height: 1.2;
            }
            
            .manual-section {
                padding: 12px; /* Reducido */
                margin-bottom: 12px; /* Reducido */
            }
            
            .manual-section h4 {
                margin-bottom: 8px; /* Reducido */
                font-size: 0.85em; /* Reducido */
            }
            
            .inputs-row {
                gap: 16px; /* AUMENTADO: para mejor espaciado */
                padding: 10px 16px; /* AUMENTADO: más respirable */
                max-width: 200px; /* AUMENTADO: más espacio funcional */
                margin: 0 auto; 
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: nowrap; /* NUEVO: evitar salto de línea */
            }
            
            .input-group {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 60px; /* NUEVO: espacio mínimo funcional */
            }
            
            .input-group input {
                width: 40px; /* RESTAURADO: tamaño funcional */
                height: 40px; /* RESTAURADO: tamaño funcional */
                font-size: 1rem; /* RESTAURADO: texto legible */
                min-height: 40px; /* Touch-friendly */
                border-radius: 6px; 
                text-align: center;
                border: 2px solid #ddd;
                background: white;
                box-sizing: border-box;
            }
            
            .input-group input:focus {
                border-color: #007bff;
                outline: none;
                box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
            }
            
            .input-group label {
                font-size: 0.8rem; 
                margin-bottom: 4px; 
                color: #555;
                font-weight: 500;
            }
            
            .btn-manual {
                padding: 10px 18px; /* AUMENTADO: más área de toque */
                font-size: 0.85rem; /* AUMENTADO: más legible */
                min-height: 40px; /* Touch-friendly */
                min-width: 120px; /* AUMENTADO: botón funcional */
                max-width: 160px; /* AUMENTADO: sin restricciones excesivas */
                margin-top: 8px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            }
            
            .btn-manual:hover {
                background: #218838;
            }
            
            .btn-manual:active {
                background: #1e7e34;
            }
            
            .dados-actions {
                flex-direction: row;
                gap: 8px; /* Reducido */
                margin-top: 12px; /* Reducido */
                justify-content: center;
            }
            
            .btn-secondary, .btn-primary {
                padding: 8px 16px; /* Reducido */
                font-size: 0.8rem; /* Reducido */
                min-height: 32px; /* Reducido */
                flex: 0 0 auto;
                min-width: 80px; /* Reducido */
                max-width: 120px; /* NUEVO: Limitar ancho */
            }
        }

        /* PANTALLAS EXTRA PEQUEÑAS (menos de 280px) */
        @media screen and (max-width: 279px) {
            .dados-modal-container {
                padding: 8px;
                min-height: 380px;
            }
            
            .dados-header h3 {
                font-size: 1.2em;
                margin-bottom: 3px;
            }
            
            .dados-header p {
                font-size: 0.8rem;
                margin-bottom: 12px;
            }
            
            .dados-main-area {
                padding: 8px;
                gap: 8px;
            }
            
            .dados-container {
                gap: 12px;
                padding: 8px;
                max-width: 180px;
            }
            
            .dado {
                width: 35px;
                height: 35px;
                flex: 0 0 35px;
            }
            
            .cara {
                width: 35px;
                height: 35px;
                border-radius: 4px;
            }
            
            .cara-1 { transform: rotateY(0deg) translateZ(17.5px); }
            .cara-2 { transform: rotateY(90deg) translateZ(17.5px); }
            .cara-3 { transform: rotateY(180deg) translateZ(17.5px); }
            .cara-4 { transform: rotateY(-90deg) translateZ(17.5px); }
            .cara-5 { transform: rotateX(90deg) translateZ(17.5px); }
            .cara-6 { transform: rotateX(-90deg) translateZ(17.5px); }

            .dot {
                width: 5px;
                height: 5px;
            }
            
            .btn-lanzar {
                padding: 8px 16px;
                font-size: 0.8rem;
                min-width: 120px;
                min-height: 40px;
                max-width: 160px;
            }
            
            .resultado-dados {
                padding: 10px 12px;
            }
            
            .resultado-text {
                font-size: 0.85rem;
                line-height: 1.2;
            }
            
            .manual-section {
                padding: 10px;
            }
            
            .inputs-row {
                gap: 12px; /* Espacio funcional */
                padding: 8px 14px; /* Más respirable */
                max-width: 160px; /* AUMENTADO: más funcional */
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: nowrap;
            }
            
            .input-group {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 50px; /* Espacio mínimo */
            }
            
            .input-group input {
                width: 36px; /* AUMENTADO: más funcional */
                height: 36px; /* AUMENTADO: más funcional */
                font-size: 0.95rem; /* AUMENTADO: más legible */
                min-height: 36px; /* Touch-friendly */
                border-radius: 5px;
                text-align: center;
                border: 2px solid #ddd;
                background: white;
                box-sizing: border-box;
            }
            
            .input-group input:focus {
                border-color: #007bff;
                outline: none;
                box-shadow: 0 0 4px rgba(0, 123, 255, 0.3);
            }
            
            .input-group label {
                font-size: 0.75rem; /* Legible pero compacto */
                margin-bottom: 3px; 
                color: #555;
                font-weight: 500;
            }
            
            .btn-manual {
                padding: 8px 14px; /* AUMENTADO: más área funcional */
                font-size: 0.8rem; /* AUMENTADO: más legible */
                min-height: 36px; /* Touch-friendly */
                min-width: 100px; /* AUMENTADO: funcional */
                max-width: 140px; /* AUMENTADO: sin restricciones excesivas */
                margin-top: 6px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 500;
            }
            
            .btn-secondary, .btn-primary {
                padding: 8px 12px;
                font-size: 0.8rem;
                min-height: 36px;
            }
        }

        /* OPTIMIZACIONES ADICIONALES PARA TOUCH Y ACCESIBILIDAD */
        @media screen and (max-width: 768px) {
            /* Touch optimization para todos los botones */
            .btn-lanzar,
            .btn-manual,
            .btn-secondary,
            .btn-primary {
                -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
                touch-action: manipulation;
            }
            
            /* Mejorar contraste y legibilidad */
            .input-group input {
                border-width: 2px;
                font-weight: 600;
            }
            
            .input-group input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
                transform: scale(1.02);
            }
            
            /* Estados activos más claros */
            .btn-lanzar:active {
                transform: scale(0.98);
                background: #1d4ed8;
            }
            
            .btn-manual:active {
                transform: scale(0.98);
                background: #047857;
            }
            
            .btn-primary:active {
                transform: scale(0.98);
                background: #047857;
            }
            
            .btn-secondary:active {
                transform: scale(0.98);
                background: #d1d5db;
            }
            
            /* Mejorar la visibilidad de los dados en pantallas pequeñas */
            .dado:hover {
                transform: scale(1.05);
            }
            
            .cara {
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            
            /* Animaciones más suaves para móviles */
            .dado,
            .cara,
            .btn-lanzar,
            .btn-manual,
            .btn-primary,
            .btn-secondary {
                transition: all 0.2s ease;
            }
        }

        /* AJUSTES ESPECÍFICOS PARA iOS Y ANDROID */
        @media screen and (max-width: 768px) {
            /* Prevenir zoom en iOS */
            .input-group input {
                font-size: 16px;
                -webkit-appearance: none;
                appearance: none;
            }
            
            /* Mejorar renderizado en dispositivos móviles */
            .dado,
            .cara {
                -webkit-transform-style: preserve-3d;
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
            }
            
            /* Optimizar animaciones para dispositivos móviles */
            @keyframes girarDado {
                0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
                25% { transform: rotateX(90deg) rotateY(90deg) rotateZ(45deg); }
                50% { transform: rotateX(180deg) rotateY(180deg) rotateZ(90deg); }
                75% { transform: rotateX(270deg) rotateY(270deg) rotateZ(135deg); }
                100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); }
            }
            
            .dado.girando {
                animation: girarDado 1.5s ease-out;
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
    console.log('🎯 lanzarDadosManual ejecutada');
    const manual1 = document.getElementById('manualDado1');
    const manual2 = document.getElementById('manualDado2');
    const resultado = document.getElementById('resultadoDados');
    const btnConfirmar = document.getElementById('btnConfirmar');
    const btnManual = document.querySelector('.btn-manual');
    
    const valor1 = parseInt(manual1.value);
    const valor2 = parseInt(manual2.value);
    
    // Limpiar estilos de error previos
    manual1.style.borderColor = '#d1d5db';
    manual2.style.borderColor = '#d1d5db';
    
    // Validar valores con mejor feedback visual
    if (!manual1.value || !manual2.value) {
        resultado.innerHTML = '<span class="resultado-text" style="color: #dc2626;">⚠️ Por favor ingresa ambos valores</span>';
        if (!manual1.value) manual1.style.borderColor = '#dc2626';
        if (!manual2.value) manual2.style.borderColor = '#dc2626';
        return;
    }
    
    if (isNaN(valor1) || isNaN(valor2) || valor1 < 1 || valor1 > 6 || valor2 < 1 || valor2 > 6) {
        resultado.innerHTML = '<span class="resultado-text" style="color: #dc2626;">⚠️ Los valores deben ser entre 1 y 6</span>';
        if (valor1 < 1 || valor1 > 6) manual1.style.borderColor = '#dc2626';
        if (valor2 < 1 || valor2 > 6) manual2.style.borderColor = '#dc2626';
        return;
    }
    
    // Feedback visual de éxito
    btnManual.style.background = '#059669';
    btnManual.textContent = 'Aplicado ✓';
    
    setTimeout(() => {
        btnManual.style.background = '#10b981';
        btnManual.textContent = 'Usar Valores';
    }, 1500);
    
    // Limpiar dados automáticos si existían
    document.getElementById('btnLanzarAuto').disabled = false;
    document.getElementById('btnLanzarAuto').textContent = 'Lanzar Dados';
    
    // Mostrar dados con valores específicos
    const dado1Element = document.getElementById('dado1');
    const dado2Element = document.getElementById('dado2');
    
    dado1Element.className = `dado mostrar-${valor1}`;
    dado2Element.className = `dado mostrar-${valor2}`;
    
    ultimoResultado = { dado1: valor1, dado2: valor2, total: valor1 + valor2 };
    
    resultado.innerHTML = `
        <span class="resultado-text" style="color: #059669;">
            🎲 Manual: ${valor1} + ${valor2} = ${ultimoResultado.total}
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
window.lanzarDadosManual = lanzarDadosManual;
window.lanzarDadosAuto = lanzarDadosAuto;
window.confirmarMovimiento = confirmarMovimiento;