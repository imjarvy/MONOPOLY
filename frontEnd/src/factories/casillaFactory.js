import { TableroHelper } from '../utils/tableroHelper.js';

/**
 * Factory para crear elementos de casilla (patrón Factory)
 */
export class CasillaFactory {
    constructor() {
        this.tableroHelper = new TableroHelper();
    }

    crearCasilla(datosServ, idx, seccion) {
        const posicion = this.tableroHelper.calcularPosicionAbsoluta(seccion, idx);
        const clasePosition = this.tableroHelper.determinarClaseCasilla(seccion, idx, 10);
        
        return {
            datos: datosServ,
            position: posicion,
            positionClass: clasePosition,
            seccion: seccion,
            indice: idx,
            type: datosServ.type,
            color: datosServ.color,
            html: this.generarHTMLCasilla(datosServ),
            gridStyle: this.tableroHelper.calcularGridPosition(seccion, idx)
        };
    }

    generarHTMLCasilla(casilla) {
        let html = `<div class="nombre">${casilla.name}</div>`;

        // Precio
        if (casilla.price) {
            html += `<div class="precio">$${casilla.price}</div>`;
        }

        // Casas
        if (casilla.casas && casilla.casas > 0) {
            html += '<div class="casas">';
            for (let i = 0; i < casilla.casas; i++) {
                html += '<span class="icon-casa">🏠</span>';
            }
            html += '</div>';
        }

        // Hotel
        if (casilla.hotel && casilla.hotel > 0) {
            html += '<div class="hotel">';
            for (let i = 0; i < casilla.hotel; i++) {
                html += '<span class="icon-hotel">🏨</span>';
            }
            html += '</div>';
        }

        return html;
    }
}