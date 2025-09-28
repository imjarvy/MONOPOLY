// Modal de registro de usuarios para Monopoly
// PRONT:Crea un modal de registro de usuarios para un juego de Monopoly con las siguientes características:
// - Permite seleccionar una ficha y un color únicos para cada jugador
// - Muestra un resumen de la configuración antes de iniciar el juego y consuma la api del backend 
//  que trae la lista de países, además puedes escoger su color favorito.

function mostrarModalRegistroUsuarios() {
    // Fichas y colores únicos
    const fichas = [
        { emoji: '🚗', nombre: 'Auto', color: '#3b82f6' },
        { emoji: '🎩', nombre: 'Sombrero', color: '#f59e42' },
        { emoji: '🐶', nombre: 'Perro', color: '#10b981' },
        { emoji: '🚢', nombre: 'Barco', color: '#ef4444' }
    ];
    let paises = [];
    
    // Obtener jugadores existentes desde la variable global
    const jugadoresExistentes = window.jugadores || [];
    let numJugadores = Math.max(2, jugadoresExistentes.length); // Mínimo 2, o los que ya existen

    // 🌍 PASO 1: Obtener países usando countriesService (arquitectura correcta)
    if (typeof window.countriesService !== 'undefined') {
        // Usar el servicio oficial
        window.countriesService.obtenerPaises()
            .then(data => {
                paises = Array.isArray(data) ? data : [];
                console.log('✅ Países cargados desde countriesService:', paises.length);
                renderModal();
            })
            .catch((error) => {
                console.error('❌ Error con countriesService:', error);
                paises = window.countriesService.getCountriesFallback();
                renderModal();
            });
    } else {
        // Fallback si countriesService no está disponible
        console.warn('⚠️ countriesService no disponible, usando fetch directo');
        fetch('http://127.0.0.1:5000/countries')
            .then(res => res.json())
            .then(data => {
                paises = Array.isArray(data) ? data : [];
                renderModal();
            })
            .catch(() => {
                // Usar fallback básico solo como última opción
                paises = [ 
                    { co: 'Colombia' }, { mx: 'México' }, { ar: 'Argentina' }, 
                    { es: 'España' }, { cl: 'Chile' }, { br: 'Brasil' },
                    { us: 'Estados Unidos' }, { ca: 'Canadá' }
                ];
                renderModal();
            });
    }

    function renderModal() {
        const contenido = `
            <form class="modal-form" id="formRegistroUsuarios">
                <div style="text-align:center; margin-bottom:18px;">
                    <h3 style="margin-bottom:8px; color:#374151;">Registro de Jugadores</h3>
                    <div style="font-size:1.1rem; color:#6b7280;">Cada jugador inicia con <strong>$1500</strong></div>
                </div>
                <div class="modal-form-group" style="margin-bottom:18px;">
                    <label class="modal-form-label">Número de jugadores</label>
                    <div style="display:flex; gap:12px; justify-content:center;">
                        <button type="button" class="modal-btn modal-btn-secondary" id="btn2">2</button>
                        <button type="button" class="modal-btn modal-btn-secondary" id="btn3">3</button>
                        <button type="button" class="modal-btn modal-btn-secondary" id="btn4">4</button>
                    </div>
                </div>
                <div id="jugadoresRegistro"></div>
                <div class="modal-form-actions" style="margin-top:24px;">
                    <button type="button" class="modal-btn modal-btn-secondary" onclick="window.Modal.close()">Cancelar</button>
                    <button type="submit" class="modal-btn modal-btn-primary">Registrar</button>
                </div>
            </form>
        `;
        const estilos = `
            .modal-form-label { font-size:1rem; color:#374151; font-weight:600; }
            .modal-btn-secondary { background:#f3f4f6; color:#374151; border:1px solid #d1d5db; }
            .modal-btn-secondary.selected { background:#3b82f6; color:#fff; border-color:#3b82f6; }
            .modal-btn-primary { background:#10b981; }
            .modal-btn-primary:hover { background:#059669; }
            .modal-form-input, .modal-form-select { font-size:1rem; border-radius:6px; border:1px solid #d1d5db; padding:10px 12px; margin-bottom:8px; }
            .modal-form-input:focus, .modal-form-select:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
            .ficha-preview { font-size:2rem; margin-right:8px; vertical-align:middle; }
            .ficha-option { display:flex; align-items:center; gap:6px; }
        `;
        window.Modal.show(contenido, {
            title: 'Registro de Jugadores',
            customStyles: estilos,
            size: 'md',
            closeOnOverlay: true
        });
        // Renderizar jugadores
        function renderJugadores() {
            const container = document.getElementById('jugadoresRegistro');
            if (!container) return;
            let html = '';
            for (let i = 0; i < numJugadores; i++) {
                // Datos del jugador existente o valores por defecto
                const jugadorExistente = jugadoresExistentes[i];
                const nickname = jugadorExistente ? jugadorExistente.nickname : '';
                const paisSeleccionado = jugadorExistente ? (jugadorExistente.pais.length <= 2 ? jugadorExistente.pais : '') : '';
                const fichaSeleccionada = jugadorExistente ? fichas.findIndex(f => f.emoji === jugadorExistente.ficha) : -1;
                const colorSeleccionado = jugadorExistente ? jugadorExistente.color : fichas[i % fichas.length].color;
                
                html += `
                <div class="modal-form-group" style="background:#fafbff; border-radius:12px; padding:16px; margin-bottom:16px; border-left:6px solid ${colorSeleccionado}; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <label class="modal-form-label">Jugador ${i+1}</label>
                    <input type="text" class="modal-form-input" name="nickname${i}" placeholder="Escribe tu nickname aquí..." value="${nickname}" required>
                    <select class="modal-form-select" name="pais${i}" required>
                        <option value="">Selecciona tu país...</option>
                        ${paises.map(p => {
                            const clave = Object.keys(p)[0];
                            const nombre = p[clave];
                            const selected = paisSeleccionado === clave ? 'selected' : '';
                            return `<option value="${clave}" ${selected}>${nombre}</option>`;
                        }).join('')}
                    </select>
                    <select class="modal-form-select" name="ficha${i}" required>
                        <option value="">Elige tu ficha...</option>
                        ${fichas.map((f, idx) => {
                            const selected = fichaSeleccionada === idx ? 'selected' : '';
                            return `<option value="${idx}" style="color:${f.color};" ${selected}>${f.emoji} ${f.nombre}</option>`;
                        }).join('')}
                    </select>
                    <div class="color-input-container" style="border-color: ${colorSeleccionado};">
                        <input type="color" name="color${i}" value="${colorSeleccionado}" id="colorInput${i}">
                        <label for="colorInput${i}" class="color-input-label">Toca para elegir tu color único</label>
                        <span class="ficha-preview" id="preview${i}" style="font-size: 1.8em; margin-left: auto;">${fichaSeleccionada >= 0 ? fichas[fichaSeleccionada].emoji : fichas[i % fichas.length].emoji}</span>
                    </div>
                </div>
                `;
            }
            container.innerHTML = html;
            // Actualizar preview de ficha y color al cambiar select
            for (let i = 0; i < numJugadores; i++) {
                const selectFicha = document.querySelector(`select[name='ficha${i}']`);
                const preview = document.getElementById(`preview${i}`);
                const colorInput = document.querySelector(`input[name='color${i}']`);
                if (selectFicha && preview) {
                    selectFicha.addEventListener('change', function() {
                        const idx = this.value;
                        preview.textContent = idx !== '' ? fichas[idx].emoji : '';
                        if (colorInput && idx !== '') {
                            // Actualizar el color del input con el color de la ficha
                            colorInput.value = fichas[idx].color;
                            // Actualizar el contenedor visual
                            const container = colorInput.closest('.color-input-container');
                            if (container) {
                                container.style.borderColor = fichas[idx].color;
                            }
                            // Actualizar el borde izquierdo del grupo también
                            const parentGroup = this.closest('.modal-form-group');
                            if (parentGroup) {
                                parentGroup.style.borderLeftColor = fichas[idx].color;
                            }
                        }
                    });
                }
                // Event listener para el input de color
                if (colorInput) {
                    colorInput.addEventListener('change', function() {
                        const container = this.closest('.color-input-container');
                        if (container) {
                            container.style.borderColor = this.value;
                        }
                        // Actualizar el borde izquierdo del grupo también
                        const parentGroup = this.closest('.modal-form-group');
                        if (parentGroup) {
                            parentGroup.style.borderLeftColor = this.value;
                        }
                    });
                }
            }
        }
        renderJugadores();
        // Botones de número de jugadores
        ['btn2','btn3','btn4'].forEach((id, idx) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.onclick = function() {
                    numJugadores = idx+2;
                    document.querySelectorAll('.modal-btn-secondary').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    renderJugadores();
                };
                if (numJugadores === idx+2) btn.classList.add('selected');
            }
        });
        // Validación y submit
        setTimeout(() => {
            const form = document.getElementById('formRegistroUsuarios');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    let jugadoresConfig = [];
                    let fichasUsadas = new Set();
                    let coloresUsados = new Set();
                    let valid = true;
                    for (let i = 0; i < numJugadores; i++) {
                        const nickname = form[`nickname${i}`].value.trim();
                        const paisCodigo = form[`pais${i}`].value;
                        // 🎯 ARREGLO: Guardar CÓDIGO de país, no el nombre completo
                        const pais = paisCodigo; // Solo el código (ej: 'co', 'mx')
                        const fichaIdx = form[`ficha${i}`].value;
                        const color = form[`color${i}`].value;
                        if (!nickname || !pais || fichaIdx === '' || !color) {
                            valid = false;
                            break;
                        }
                        if (fichasUsadas.has(fichaIdx) || coloresUsados.has(color)) {
                            valid = false;
                            break;
                        }
                        fichasUsadas.add(fichaIdx);
                        coloresUsados.add(color);
                        jugadoresConfig.push({
                            id: Date.now() + i, // ID único para cada jugador
                            nickname,
                            pais,
                            ficha: fichas[fichaIdx].emoji,
                            fichaNombre: fichas[fichaIdx].nombre,
                            color,
                            dinero: 1500
                        });
                    }
                    if (!valid) {
                        if (typeof window.Toast !== 'undefined' && window.Toast) {
                            window.Toast.warning("Completa todos los campos y asegúrate de que cada ficha y color sean únicos.", "Datos Incompletos");
                        } else {
                            alert('Completa todos los campos y asegúrate de que cada ficha y color sean únicos.');
                        }
                        return;
                    }
                    // Guardar jugadores en el array global y actualizar la UI
                    if (typeof window.agregarJugadoresDesdeModal === 'function') {
                        window.agregarJugadoresDesdeModal(jugadoresConfig);
                    }
                    window.Modal.close();
                });
            }
        }, 200);
    }
}

// Puedes llamar mostrarModalRegistroUsuarios() desde cualquier parte para iniciar el registro.
document.addEventListener('DOMContentLoaded', function() {
    const agregarBtn = document.getElementById('agregarBtn');
    if (agregarBtn) {
        agregarBtn.addEventListener('click', mostrarModalRegistroUsuarios);
        console.log('Event listener agregado al botón');
    }
});