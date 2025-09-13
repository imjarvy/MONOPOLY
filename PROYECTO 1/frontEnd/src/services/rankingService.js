// Servicio para obtener el ranking global
export async function getRanking() {
  try {
    const response = await fetch('http://127.0.0.1/ranking');
    if (!response.ok) throw new Error('No se pudo obtener el ranking');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}