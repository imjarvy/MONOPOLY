/**
 * Renderer especializado para el tablero de Monopoly
 */
export class TableroRenderer {
    constructor(tableroElement) {
        this.tablero = tableroElement;
        this.verificarElemento();
    }

    verificarElemento() {
        if (!this.tablero) {
            throw new Error('Elemento tablero no encontrado en el DOM');
        }
    }

    limpiarTablero() {
        this.tablero.innerHTML = '';
    }

    renderizarTodasLasCasillas(casillasPorSeccion) {
        // Renderizar en orden específico del Monopoly
        this.renderizarSeccion(casillasPorSeccion.bottom, 'bottom');
        this.renderizarSeccion(casillasPorSeccion.left, 'left');
        this.renderizarSeccion(casillasPorSeccion.top, 'top');
        this.renderizarSeccion(casillasPorSeccion.right, 'right');
        
        this.agregarCentroTablero();
    }

    renderizarSeccion(casillas, seccion) {
        casillas.forEach(casilla => {
            const elemento = this.crearElementoCasilla(casilla);
            this.tablero.appendChild(elemento);
        });

        console.log(`✅ Sección ${seccion} renderizada: ${casillas.length} casillas`);
    }

    crearElementoCasilla(casilla) {
        const div = document.createElement('div');
        div.className = `casilla ${casilla.positionClass}`;
        
        // Data attributes para identificación
        div.dataset.type = casilla.type;
        div.dataset.color = casilla.color;
        div.dataset.position = casilla.position;

        // Contenido HTML
        div.innerHTML = casilla.html;

        // Estilos de grid
        this.aplicarEstilosGrid(div, casilla.gridStyle);

        return div;
    }

    aplicarEstilosGrid(elemento, gridStyle) {
        if (gridStyle.gridRow) {
            elemento.style.gridRow = gridStyle.gridRow;
        }
        if (gridStyle.gridColumn) {
            elemento.style.gridColumn = gridStyle.gridColumn;
        }
    }

    agregarCentroTablero() {
        const centro = document.createElement('div');
        centro.className = 'centro';
        centro.textContent = 'MONOPOLY';
        this.tablero.appendChild(centro);
    }

    // Método para actualizar casillas específicas (útil para propiedades)
    actualizarCasilla(position, nuevaData) {
        const casillaElement = this.tablero.querySelector(`[data-position="${position}"]`);
        if (casillaElement && nuevaData.html) {
            casillaElement.innerHTML = nuevaData.html;
        }
    }
}