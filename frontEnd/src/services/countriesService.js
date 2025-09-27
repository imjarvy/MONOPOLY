// Servicio para obtener la lista de países
async function getCountries() {
  try {
    const response = await fetch('http://127.0.0.1:5000/countries');
    if (!response.ok) throw new Error('No se pudo obtener la lista de países');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Función para convertir array a objeto
async function obtenerPaisesComoObjeto() {
  try {
    const paises = await getCountries();
    const paisesObjeto = {};
    
    paises.forEach(pais => {
      if (pais.code) {
        paisesObjeto[pais.code.toLowerCase()] = pais.name || pais.nombre;
      }
    });
    
    return paisesObjeto;
  } catch (error) {
    console.error('Error al convertir países a objeto:', error);
    return {};
  }
}

// ✅ AGREGAR: Función para obtener nombre específico de país
async function obtenerNombrePais(codigo) {
  try {
    const paisesObj = await obtenerPaisesComoObjeto();
    return paisesObj[codigo.toLowerCase()] || codigo.toUpperCase();
  } catch (error) {
    console.error(`Error obteniendo país ${codigo}:`, error);
    return codigo.toUpperCase();
  }
}

// Crear objeto de servicio
const countriesService = {
  obtenerPaises: getCountries,
  obtenerPaisesComoObjeto,
  getCountries // Mantener compatibilidad
};


//export { getCountries, countriesService };
// ✅ CAMBIO: Exponer globalmente sin ES6 modules
if (typeof window !== 'undefined') {
  window.countriesService = countriesService;
  window.getCountries = getCountries; // Para compatibilidad total
  
  console.log('✅ Countries Service loaded globally (with backend fetch)');
}
