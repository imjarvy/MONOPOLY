<<<<<<< HEAD
// Servicio para enviar el resultado final de la partida
export async function sendScore({ nick_name, score, country_code }) {
  try {
    const response = await fetch('http://127.0.0.1/score-recorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick_name, score, country_code })
    });
    if (!response.ok) throw new Error('No se pudo enviar el puntaje');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
=======
// Servicio para enviar el resultado final de la partida
export async function sendScore({ nick_name, score, country_code }) {
  try {
    const response = await fetch('http://127.0.0.1/score-recorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick_name, score, country_code })
    });
    if (!response.ok) throw new Error('No se pudo enviar el puntaje');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
>>>>>>> jarvy
}