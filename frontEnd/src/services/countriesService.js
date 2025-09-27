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

// Crear objeto de servicio
const countriesService = {
  obtenerPaises: getCountries,
  obtenerPaisesComoObjeto,
  getCountries // Mantener compatibilidad
};

// Exportar tanto la función individual como el objeto
export { getCountries, countriesService };

// Exponer globalmente para uso en configuracion.js
if (typeof window !== 'undefined') {
  window.countriesService = countriesService;
}
