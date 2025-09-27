/**
 * Helper para operaciones de tablero (NO confundir con backend service)
 */
export class TableroHelper {
    constructor() {
        this.positionMap = {
            0: 'esquinaIa',   // Salida
            10: 'esquinaDa',  // Cárcel  
            20: 'esquinaIb',  // Parqueo
            30: 'esquinaDb'   // Ve a la Cárcel
        };
    }

    getPositionClass(position) {
        // Esquinas especiales
        if (this.positionMap[position]) {
            return this.positionMap[position];
        }
        
        // Posiciones regulares
        if (position > 0 && position < 10) return 'abajo';
        if (position > 10 && position < 20) return 'izquierda';
        if (position > 20 && position < 30) return 'arriba';
        if (position > 30 && position < 40) return 'derecha';
        
        return '';
    }

    calcularGridPosition(seccion, idx, totalCasillas) {
        const gridPositions = {
            bottom: {
                gridRow: '11',
                gridColumn: `${11 - idx}` // Derecha a izquierda
            },
            left: {
                gridColumn: '1',
                gridRow: `${11 - idx}` // Abajo hacia arriba
            },
            top: {
                gridRow: '1', 
                gridColumn: `${idx + 2}` // Izquierda a derecha (empezar en columna 2)
            },
            right: {
                gridColumn: '11',
                gridRow: `${idx + 2}` // Arriba hacia abajo (empezar en fila 2)
            }
        };

        return gridPositions[seccion] || {};
    }

    determinarClaseCasilla(seccion, idx, totalCasillas) {
        const clasesPorSeccion = {
            bottom: (idx) => {
                if (idx === 0) return 'esquinaIa'; // Salida
                return 'abajo';
            },
            left: (idx) => {
                if (idx === 0) return 'esquinaDa'; // Cárcel
                if (idx === totalCasillas - 1) return 'esquinaIb'; // Parqueo
                return 'izquierda';
            },
            top: (idx) => {
                if (idx === totalCasillas - 1) return 'esquinaDb'; // Ve a la cárcel
                return 'arriba';
            },
            right: () => 'derecha'
        };

        const claseFn = clasesPorSeccion[seccion];
        return claseFn ? claseFn(idx) : '';
    }

    calcularPosicionAbsoluta(seccion, idx) {
        const basePositions = {
            bottom: 0,
            left: 10, 
            top: 21,
            right: 31
        };

        return basePositions[seccion] + idx;
    }
}