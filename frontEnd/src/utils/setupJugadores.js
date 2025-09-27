/**
 * Script para configurar jugadores de ejemplo en localStorage
 * Ejecutar este script en la consola del navegador para agregar jugadores
 */
function configurarJugadoresEjemplo() {
  const jugadoresEjemplo = [
    {
      "id": 1758907370520,
      "nickname": "hhhh", 
      "pais": "bb",
      "ficha": "🚗",
      "fichaNombre": "Auto",
      "color": "#3b82f6",
      "dinero": 1500,
      "propiedades": [],
      "hipotecas": [],
      "posicion": 0
    },
    {
      "id": 1758907370521,
      "nickname": "rtyui",
      "pais": "ax", 
      "ficha": "🎩",
      "fichaNombre": "Sombrero",
      "color": "#f59e42",
      "dinero": 1500,
      "propiedades": [],
      "hipotecas": [],
      "posicion": 0
    },
    {
      "id": 1758907370522,
      "nickname": "alanSapid",
      "pais": "au",
      "ficha": "🐶",
      "fichaNombre": "Perro", 
      "color": "#10b981",
      "dinero": 1500,
      "propiedades": [],
      "hipotecas": [],
      "posicion": 0
    }
  ];

  localStorage.setItem('jugadores', JSON.stringify(jugadoresEjemplo));
  localStorage.setItem('turnoActual', '0');
  
  console.log('✅ Jugadores de ejemplo configurados:', jugadoresEjemplo);
  console.log('🎮 Ya puedes jugar en el tablero!');
  
  return jugadoresEjemplo;
}

// Ejecutar automáticamente si no hay jugadores
if (!localStorage.getItem('jugadores')) {
  configurarJugadoresEjemplo();
}

// Hacer función disponible globalmente
window.configurarJugadoresEjemplo = configurarJugadoresEjemplo;