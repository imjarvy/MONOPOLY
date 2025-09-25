<<<<<<< HEAD
// Servicio para obtener el tablero y propiedades
export async function getBoard() {
  try {
    const response = await fetch('http://127.0.0.1:5000/board');
    if (!response.ok) throw new Error('No se pudo obtener el tablero');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
=======
// Servicio para obtener el tablero y propiedades
export async function getBoard() {
  try {
    const response = await fetch('http://127.0.0.1:5000/board');
    if (!response.ok) throw new Error('No se pudo obtener el tablero');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
>>>>>>> jarvy
}