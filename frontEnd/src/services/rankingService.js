// Servicio para gestionar el ranking
const API_BASE_URL = 'http://127.0.0.1:5000';

async function getHistoricalRanking() {
    try {
        const response = await fetch(`${API_BASE_URL}/ranking`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos del ranking recibidos:', data);
        
        // Mapear los datos a la estructura esperada
        const mappedData = data.map(item => ({
            playerName: item.nick_name,
            countryCode: item.country_code,
            score: item.score,
            gamesPlayed: 1 // Como no tienes este campo, asumimos 1 partida
        }));
        
        console.log('Datos mapeados:', mappedData);
        return mappedData;
    } catch (error) {
        console.error('Error al obtener ranking:', error);
        throw error;
    }
}

async function getCountryFlag(countryCode) {
    try {
        // Usar la API REST Countries para obtener la bandera real
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode.toLowerCase()}`);
        
        if (response.ok) {
            const countryData = await response.json();
            if (countryData && countryData[0]) {
                return {
                    flag: countryData[0].flags.svg || countryData[0].flags.png,
                    name: countryData[0].name.common,
                    isImage: true // Indica que es una URL de imagen
                };
            }
        }
    } catch (error) {
        console.warn(`Error al obtener bandera de API para ${countryCode}:`, error);
    }
    
    // Fallback: usar emojis de banderas
    const flagEmojis = {
        'co': '🇨🇴',
        'mx': '🇲🇽', 
        'ar': '🇦🇷',
        'es': '🇪🇸',
        'us': '🇺🇸',
        'br': '🇧🇷',
        'cl': '🇨🇱',
        'pe': '🇵🇪',
        'ca': '🇨🇦',
        'fr': '🇫🇷',
        'de': '🇩🇪',
        'it': '🇮🇹',
        'uk': '🇬🇧',
        'gb': '🇬🇧',
        've': '🇻🇪',
        'ec': '🇪🇨',
        'uy': '🇺🇾',
        'py': '🇵🇾',
        'bo': '🇧🇴',
        'pa': '🇵🇦',
        'cr': '🇨🇷',
        'gt': '🇬🇹',
        'hn': '🇭🇳',
        'sv': '🇸🇻',
        'ni': '🇳🇮',
        'cu': '🇨🇺',
        'do': '🇩🇴',
        'pr': '🇵🇷'
    };
    
    return {
        flag: flagEmojis[countryCode.toLowerCase()] || '🏳️',
        name: getCountryName(countryCode),
        isImage: false // Indica que es un emoji
    };
}/**
 * Obtiene el nombre del país usando countriesService (sin duplicación)
 * @param {string} countryCode - Código del país
 * @returns {string} Nombre del país
 */
function getCountryName(countryCode) {
    // 🌍 Usar countriesService en lugar de hardcode
    if (typeof window.countriesService !== 'undefined' && window.countriesCache) {
        return window.countriesCache[countryCode.toLowerCase()] || countryCode.toUpperCase();
    }
    
    // ⚠️ Fallback básico solo si countriesService no está disponible
    console.warn('⚠️ countriesService/cache no disponible en rankingService');
    const basicCountries = {
        'co': 'Colombia', 'mx': 'México', 'ar': 'Argentina', 'es': 'España',
        'us': 'Estados Unidos', 'br': 'Brasil', 'cl': 'Chile', 'pe': 'Perú'
    };
    
    return basicCountries[countryCode.toLowerCase()] || countryCode.toUpperCase();
}


window.rankingService = {
    getHistoricalRanking,
    getCountryFlag,
    getCountryName
};
