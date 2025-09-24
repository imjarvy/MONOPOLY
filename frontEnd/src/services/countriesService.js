/**
 * COUNTRIES SERVICE - Servicio para gestionar países
 * 
 * Funciona con el backend que devuelve countries.json en formato:
 * [{ "ad": "Andorra" }, { "ae": "Emiratos Árabes Unidos" }, ...]
 * 
 * Arquitectura: /src/services/countriesService.js
 * Consumo: Backend /countries endpoint
 * Uso: window.countriesService.obtenerPaises()
 */

const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * Obtiene la lista completa de países desde el backend
 * @returns {Promise<Array>} Array de objetos país en formato [{"código": "nombre"}]
 */
async function obtenerPaises() {
    try {
        console.log('🌍 Obteniendo países desde el backend...');
        const response = await fetch(`${API_BASE_URL}/countries`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const countries = await response.json();
        console.log('✅ Países obtenidos del backend:', countries.length, 'países');
        
        // El backend devuelve: [{"ad": "Andorra"}, {"ae": "Emiratos Árabes Unidos"}, ...]
        return countries;
        
    } catch (error) {
        console.error('❌ Error al obtener países del backend:', error);
        console.log('🔄 Usando fallback de países principales...');
        
        // Fallback con países principales si el backend no responde
        return getCountriesFallback();
    }
}

/**
 * Convierte la respuesta del backend a un formato más fácil de usar
 * @returns {Promise<Object>} Objeto con códigos como keys y nombres como values
 */
async function obtenerPaisesComoObjeto() {
    try {
        const countries = await obtenerPaises();
        
        // Convertir [{"ad": "Andorra"}, {"ae": "UAE"}] a {"ad": "Andorra", "ae": "UAE"}
        const countriesObject = {};
        countries.forEach(countryObj => {
            const code = Object.keys(countryObj)[0];
            const name = countryObj[code];
            countriesObject[code] = name;
        });
        
        console.log('🔄 Países convertidos a objeto:', Object.keys(countriesObject).length, 'países');
        return countriesObject;
        
    } catch (error) {
        console.error('❌ Error al convertir países:', error);
        return {};
    }
}

/**
 * Busca un país por código
 * @param {string} countryCode - Código del país (ej: 'co', 'mx')
 * @returns {Promise<string>} Nombre del país o código en mayúsculas si no se encuentra
 */
async function obtenerNombrePais(countryCode) {
    try {
        const countries = await obtenerPaisesComoObjeto();
        return countries[countryCode.toLowerCase()] || countryCode.toUpperCase();
    } catch (error) {
        console.error('❌ Error al buscar país:', error);
        return countryCode.toUpperCase();
    }
}

/**
 * Fallback con países principales si el backend falla
 * @returns {Array} Array de países principales
 */
function getCountriesFallback() {
    return [
        { 'co': 'Colombia' }, { 'mx': 'México' }, { 'ar': 'Argentina' }, { 'br': 'Brasil' },
        { 'cl': 'Chile' }, { 'pe': 'Perú' }, { 've': 'Venezuela' }, { 'ec': 'Ecuador' },
        { 'uy': 'Uruguay' }, { 'py': 'Paraguay' }, { 'bo': 'Bolivia' }, { 'pa': 'Panamá' },
        { 'cr': 'Costa Rica' }, { 'gt': 'Guatemala' }, { 'hn': 'Honduras' }, { 'sv': 'El Salvador' },
        { 'ni': 'Nicaragua' }, { 'cu': 'Cuba' }, { 'do': 'República Dominicana' }, { 'pr': 'Puerto Rico' },
        { 'es': 'España' }, { 'fr': 'Francia' }, { 'de': 'Alemania' }, { 'it': 'Italia' },
        { 'gb': 'Reino Unido' }, { 'pt': 'Portugal' }, { 'us': 'Estados Unidos' }, { 'ca': 'Canadá' }
    ];
}

// ============== EXPORTACIÓN GLOBAL ==============
// Hacer disponible globalmente para toda la aplicación
window.countriesService = {
    obtenerPaises,
    obtenerPaisesComoObjeto,
    obtenerNombrePais,
    getCountriesFallback
};

// Para compatibilidad con código existente
window.obtenerPaises = obtenerPaises;
window.obtenerNombrePais = obtenerNombrePais;

console.log('✅ CountriesService cargado correctamente - Disponible globalmente');