import Propiedad from "./jugador";

const Propiedad = require('./propiedad');
export class Jugador {
  constructor(nombre, saldoInicial = 1500) {
    this.nombre = nombre; // Nombre del jugador
    this.saldo = saldoInicial; // Dinero disponible
    this.posicion = 0;  
    this.color= color; //Posición en el tablero
    this.propiedades = []; // Lista de propiedades adquiridas
    this.enCarcel = false; // Estado: si está en la cárcel
    this.turnosEnCarcel = 0; // Turnos que lleva en la cárcel
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
