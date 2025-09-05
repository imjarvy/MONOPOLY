// Servicio para obtener la lista de países
export async function getCountries() {
  try {
    const response = await fetch('http://127.0.0.1:5000/countries');
    if (!response.ok) throw new Error('No se pudo obtener la lista de países');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}