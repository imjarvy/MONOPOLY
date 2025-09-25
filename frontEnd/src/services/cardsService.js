// Servicio para obtener cartas (esto depende si el backend expone cards, ajusta el endpoint si es diferente)
export async function getCards(type = 'chance') {
  // type puede ser 'chance' o 'community'
  try {
    const response = await fetch(`http://127.0.0.1:5000/cards?type=${type}`);
    if (!response.ok) throw new Error(`No se pudieron obtener las cartas de tipo ${type}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}