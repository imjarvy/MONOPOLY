// ranking.js - Lógica principal para la página de ranking

// Variables globales
let rankingData = [];
let countryFlags = {};

// Elementos del DOM
const loadingContainer = document.getElementById('loadingContainer');
const errorContainer = document.getElementById('errorContainer');
const rankingContainer = document.getElementById('rankingContainer');
const errorText = document.getElementById('errorText');
const rankingTableBody = document.getElementById('rankingTableBody');
const noData = document.getElementById('noData');

// Elementos de estadísticas
const totalPlayers = document.getElementById('totalPlayers');
const totalGames = document.getElementById('totalGames');
const totalCountries = document.getElementById('totalCountries');

// Función principal que se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de ranking cargada');
    cargarRanking();
});

// Función para cargar el ranking
async function cargarRanking() {
    try {
        mostrarCargando();
        
        console.log('Iniciando carga del ranking...');
        const data = await window.rankingService.getHistoricalRanking();
        
        if (!data || data.length === 0) {
            mostrarSinDatos();
            return;
        }
        
        rankingData = data;
        console.log('Datos procesados:', rankingData);
        
        await procesarDatosRanking();
        mostrarRanking();
        
    } catch (error) {
        console.error('Error al cargar el ranking:', error);
        mostrarError(error.message);
    }
}

// Función para procesar los datos del ranking
async function procesarDatosRanking() {
    console.log('Procesando datos del ranking...');
    
    // Ordenar por puntuación (score) de mayor a menor
    rankingData.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    // Obtener banderas para todos los países únicos
    const paisesUnicos = [...new Set(rankingData.map(item => item.countryCode))];
    console.log('Países únicos encontrados:', paisesUnicos);
    
    // Cargar banderas de forma paralela
    const promesasBanderas = paisesUnicos.map(async (countryCode) => {
        if (countryCode && !countryFlags[countryCode]) {
            try {
                const flagData = await window.rankingService.getCountryFlag(countryCode);
                countryFlags[countryCode] = flagData;
            } catch (error) {
                console.warn(`Error al cargar bandera para ${countryCode}:`, error);
                countryFlags[countryCode] = {
                    flag: '🏳️',
                    name: window.rankingService.getCountryName(countryCode)
                };
            }
        }
    });
    
    await Promise.all(promesasBanderas);
    console.log('Banderas cargadas:', countryFlags);
}

// Función para mostrar el ranking en la tabla
function mostrarRanking() {
    console.log('Mostrando ranking en la tabla...');
    
    // Actualizar estadísticas
    actualizarEstadisticas();
    
    // Limpiar tabla
    rankingTableBody.innerHTML = '';
    
    if (rankingData.length === 0) {
        mostrarSinDatos();
        return;
    }
    
    // Crear filas de la tabla
    rankingData.forEach((jugador, index) => {
        const fila = crearFilaRanking(jugador, index + 1);
        rankingTableBody.appendChild(fila);
    });
    
    // Mostrar container del ranking
    rankingContainer.style.display = 'block';
    loadingContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    noData.style.display = 'none';
}

// Función para crear una fila del ranking
function crearFilaRanking(jugador, posicion) {
    const fila = document.createElement('tr');
    
    // Determinar clase de posición
    let claseRank = 'rank-other';
    if (posicion === 1) claseRank = 'rank-1';
    else if (posicion === 2) claseRank = 'rank-2';
    else if (posicion === 3) claseRank = 'rank-3';
    
    // Obtener información del país
    const countryInfo = countryFlags[jugador.countryCode] || {
        flag: '🏳️',
        name: window.rankingService.getCountryName(jugador.countryCode || 'unknown')
    };
    
    // Calcular promedio - si solo hay 1 partida, el promedio es igual al score
    const promedio = jugador.gamesPlayed > 0 ? (jugador.score / jugador.gamesPlayed).toFixed(1) : jugador.score.toFixed(1);
    
    fila.innerHTML = `
        <td class="rank-col">
            <div class="rank-position ${claseRank}">
                ${posicion}
            </div>
        </td>
        <td class="flag-col">
            ${crearElementoBandera(countryInfo, jugador.countryCode)}
        </td>
        <td class="player-col">
            <div class="player-info">
                <div class="player-avatar">
                    ${(jugador.playerName || 'Anónimo').charAt(0).toUpperCase()}
                </div>
                <div class="player-details">
                    <h4>${jugador.playerName || 'Jugador Anónimo'}</h4>
                    <p>${countryInfo.name}</p>
                </div>
            </div>
        </td>
        <td class="score-col">
            <span class="score-badge">
                ${(jugador.score || 0).toLocaleString()}
            </span>
        </td>
        <td class="games-col">
            <span class="games-count">
                ${jugador.gamesPlayed || 0}
            </span>
        </td>
        <td class="avg-col">
            <span class="avg-score">
                ${promedio}
            </span>
        </td>
    `;
    
    return fila;
}

// Función para crear el elemento de bandera
function crearElementoBandera(countryInfo, countryCode) {
    if (countryInfo.isImage && countryInfo.flag.startsWith('http')) {
        // Es una URL de imagen de la API REST Countries
        return `
            <img src="${countryInfo.flag}" 
                 alt="${countryInfo.name}" 
                 class="country-flag"
                 title="${countryInfo.name}"
                 style="width: 32px; height: 24px; border-radius: 4px; object-fit: cover; border: 1px solid #e5e7eb;"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
            <span style="display: none; font-size: 20px;">${getCountryEmoji(countryCode)}</span>
        `;
    } else {
        // Es un emoji
        return `
            <span style="font-size: 28px; display: inline-block;" title="${countryInfo.name}">
                ${countryInfo.flag}
            </span>
        `;
    }
}

// Función helper para obtener emoji de bandera como fallback
function getCountryEmoji(countryCode) {
    const flagEmojis = {
        'co': '🇨🇴', 'mx': '🇲🇽', 'ar': '🇦🇷', 'es': '🇪🇸', 'us': '🇺🇸',
        'br': '🇧🇷', 'cl': '🇨🇱', 'pe': '🇵🇪', 'ca': '🇨🇦', 'fr': '🇫🇷',
        'de': '🇩🇪', 'it': '🇮🇹', 'uk': '🇬🇧', 'gb': '🇬🇧', 've': '🇻🇪',
        'ec': '🇪🇨', 'uy': '🇺🇾', 'py': '🇵🇾', 'bo': '🇧🇴', 'pa': '🇵🇦'
    };
    return flagEmojis[countryCode.toLowerCase()] || '🏳️';
}

// Función para actualizar las estadísticas
function actualizarEstadisticas() {
    const jugadoresUnicos = new Set(rankingData.map(j => j.playerName)).size;
    const paisesUnicos = new Set(rankingData.map(j => j.countryCode)).size;
    const partidasTotales = rankingData.reduce((total, j) => total + (j.gamesPlayed || 0), 0);
    
    // Animar contadores
    animarContador(totalPlayers, jugadoresUnicos);
    animarContador(totalGames, partidasTotales);
    animarContador(totalCountries, paisesUnicos);
}

// Función para animar contadores
function animarContador(elemento, valorFinal) {
    let valorActual = 0;
    const incremento = Math.ceil(valorFinal / 20);
    const intervalo = setInterval(() => {
        valorActual += incremento;
        if (valorActual >= valorFinal) {
            valorActual = valorFinal;
            clearInterval(intervalo);
        }
        elemento.textContent = valorActual.toLocaleString();
    }, 50);
}

// Funciones para mostrar diferentes estados
function mostrarCargando() {
    loadingContainer.style.display = 'block';
    errorContainer.style.display = 'none';
    rankingContainer.style.display = 'none';
    noData.style.display = 'none';
}

function mostrarError(mensaje) {
    errorText.textContent = mensaje;
    errorContainer.style.display = 'block';
    loadingContainer.style.display = 'none';
    rankingContainer.style.display = 'none';
    noData.style.display = 'none';
}

function mostrarSinDatos() {
    noData.style.display = 'block';
    loadingContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    rankingContainer.style.display = 'none';
}

function irAlInicio() {
  window.location.href = '../../index.html'; 
}

// Función global para reintentar carga (llamada desde el botón)
window.cargarRanking = cargarRanking;