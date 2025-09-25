import Propiedad from "./jugador";
export class Jugador {
  constructor(nickname, pais, fichaColor) {
    this.nickname = nickname;       // Nombre del jugador
    this.pais = pais;               // Código del país (ej: "co")
    this.fichaColor = fichaColor;   // Color único de ficha
    this.dinero = 1500;             // Dinero inicial
    this.posicion = 0;              // Casilla actual en el tablero
    this.propiedades = [];          // Propiedades que posee
    this.hipotecas = [];            // Propiedades hipotecadas
    this.enCarcel = false;          // Si está en la cárcel
    this.turnosCarcel = 0;          // Turnos restantes en cárcel
    this.prestamos = 0;             // Dinero prestado
    this.tieneCartaSalirCarcel = false; // Carta especial "Salir de la cárcel"
    this.activo = true;             // Si sigue en juego o en bancarrota
  }

  mover(casillas) {
    this.posicion = (this.posicion + casillas) % 40; // Tablero de 40 casillas
  }

  comprarPropiedad(propiedad) {
    if (this.saldo >= propiedad.precio && !propiedad.dueno) {
      this.saldo -= propiedad.precio;
      propiedad.dueno = this;
      this.propiedades.push(propiedad);
      console.log(`${this.nombre} compró ${propiedad.nombre}`);
    } else {
      console.log(`${this.nombre} no puede comprar ${propiedad.nombre}`);
    }
  }
  
  listarPropiedades(){
    if(this.propiedades.length === 0){
    return`${this.nombre} no tiene propiedades.`;
    }
    return this.propiedades.map(prop => prop.getInfo()).join('\n');
  }
  agregarPropiedad(propiedad) {
    this.propiedades.push(propiedad);
    propiedad.dueno = this;
  }
  pagar(cantidad) {
    this.saldo -= cantidad;
  }

  cobrar(cantidad) {
    this.saldo += cantidad;
  }
   /**
   * Valida si el jugador puede comprar una casa en un grupo de color.
   * 
   * Para que un jugador pueda comprar una casa en propiedades de cierto color:
   *  - Debe poseer TODAS las propiedades de ese color.
   *  - En Monopoly, siempre son 3 propiedades por color (según tu regla).
   * 
   * @param {string} color - El color del grupo (ej: "Rojo", "Azul").
   * @returns {boolean} true si tiene todas las propiedades del color, false si no.
   */
    puedeComprarCasa(color) {
    let contador = 0;

    // Recorremos todas las propiedades del jugador
    this.propiedades.forEach((prop) => {
      if (prop.color === color) {
        contador++;
      }
    });

    // Validamos si tiene las 3 propiedades de ese color
    if (contador === 3) {
      return true;
    } else {
      return false;
    }
}
}

//para poder usarla en otros archivos
    module.exports =  Jugador ;













