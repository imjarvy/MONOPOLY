// /src/components/ranking.js
// Componente para mostrar el ranking global de jugadores
import { getRanking } from '../services/rankingService.js';

/**
 * Renderiza el ranking en un contenedor dado
 * @param {HTMLElement} container - Elemento donde se mostrará el ranking
 */
export async function renderRanking(container) {
  container.innerHTML = '<div class="ranking-title">Ranking Global</div><div>Cargando...</div>';
  const ranking = await getRanking();
  if (!ranking.length) {
    container.innerHTML = '<div class="ranking-title">Ranking Global</div><div>No hay datos de ranking.</div>';
    return;
  }
  const list = document.createElement('ul');
  list.className = 'ranking-list';
  ranking.forEach((jugador, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>#${idx + 1}</span>
      <img class="ranking-flag" src="https://flagsapi.com/${jugador.country_code.toUpperCase()}/flat/32.png" alt="${jugador.country_code}">
      <span class="ranking-nickname">${jugador.nick_name}</span>
      <span class="ranking-score">${jugador.score}</span>
    `;
    list.appendChild(li);
  });
  container.innerHTML = '<div class="ranking-title">Ranking Global</div>';
  container.appendChild(list);
}

// Ejemplo de uso:
// import { renderRanking } from '../components/ranking.js';
// renderRanking(document.getElementById('ranking-container'));
