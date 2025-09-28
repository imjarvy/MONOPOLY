/**
 * Datos de configuración para propiedades
 * Separado para mantener el código limpio
 */

export const preciosBase = {
    'marron': { compra: 60, renta: [2, 10, 30, 90, 160, 250], casaCosto: 50 },
    'azul-claro': { compra: 100, renta: [6, 30, 90, 270, 400, 550], casaCosto: 50 },
    'rosa': { compra: 140, renta: [10, 50, 150, 450, 625, 750], casaCosto: 100 },
    'naranja': { compra: 180, renta: [14, 70, 200, 550, 750, 950], casaCosto: 100 },
    'rojo': { compra: 220, renta: [18, 90, 250, 700, 875, 1050], casaCosto: 150 },
    'amarillo': { compra: 260, renta: [22, 110, 330, 800, 975, 1150], casaCosto: 150 },
    'verde': { compra: 300, renta: [26, 130, 390, 900, 1100, 1275], casaCosto: 200 },
    'azul-oscuro': { compra: 400, renta: [50, 200, 600, 1400, 1700, 2000], casaCosto: 200 }
};

export const tiposEspeciales = {
    'ferrocarril': { 
        compra: 200, 
        renta: [50, 100, 150, 200],
        hipoteca: 100
    },
    'servicio': { 
        compra: 150, 
        rentaMultiplicador: [4, 10],
        hipoteca: 75
    }
};

export const propiedadesPorColor = {
    'marron': ['prop-1', 'prop-3'],
    'azul-claro': ['prop-6', 'prop-8', 'prop-9'], 
    'rosa': ['prop-11', 'prop-13', 'prop-14'],
    'naranja': ['prop-16', 'prop-18', 'prop-19'],
    'rojo': ['prop-21', 'prop-23', 'prop-24'],
    'amarillo': ['prop-26', 'prop-27', 'prop-29'],
    'verde': ['prop-31', 'prop-32', 'prop-34'],
    'azul-oscuro': ['prop-37', 'prop-39']
};

export const ferrocarriles = ['prop-5', 'prop-15', 'prop-25', 'prop-35'];
export const servicios = ['prop-12', 'prop-28'];

// ✅ COLORES PARA VISUALIZACIÓN:
export const coloresPorTipo = {
    'marron': '#8B4513',
    'azul-claro': '#87CEEB',
    'rosa': '#FFC0CB',
    'naranja': '#FFA500',
    'rojo': '#FF0000',
    'amarillo': '#FFFF00',
    'verde': '#008000',
    'azul-oscuro': '#000080',
    'ferrocarril': '#2F4F4F',
    'servicio': '#FF6347'
};

console.log('📊 PropiedadesData cargado');