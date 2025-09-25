export class Jugador {
  constructor(nickname, pais, fichaColor, figura) {
    this.nickname = nickname;           // Nick del jugador
    this.pais = pais;                   // Código país (ej: 'CO')
    this.fichaColor = fichaColor;       // Color único de la ficha
    this.figura = figura;               // Aquí guardas el emoji seleccionado
    this.dinero = 1500;                 // Dinero inicial
    this.posicion = 0;                  // Casilla actual (0 = salida)
    this.propiedades = [];              // Propiedades activas (no hipotecadas)
    this.hipotecas = [];                // Propiedades hipotecadas
    this.enCarcel = false;              // ¿Está en la cárcel?
    this.turnosCarcel = 0;              // Turnos restantes en la cárcel
    this.tieneCartaSalirCarcel = false; // ¿Tiene carta de "Salir de la cárcel"?
    this.activo = true;                 // ¿Sigue en juego?
    this.bancarrota = false;            // ¿Está en bancarrota?
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

  // Hipotecar una propiedad
  hipotecarPropiedad(propiedad) {
    if (this.propiedades.includes(propiedad) && !propiedad.hipotecada) {
      propiedad.hipotecada = true;
      this.dinero += propiedad.mortgage;
      this.hipotecas.push(propiedad);
      this.propiedades = this.propiedades.filter(p => p !== propiedad);
      return true;
    }
    return false;
  }

  // Deshipotecar una propiedad (paga mortgage + 10%)
  deshipotecarPropiedad(propiedad) {
    const costo = Math.ceil(propiedad.mortgage * 1.1);
    if (this.hipotecas.includes(propiedad) && this.dinero >= costo) {
      propiedad.hipotecada = false;
      this.dinero -= costo;
      this.propiedades.push(propiedad);
      this.hipotecas = this.hipotecas.filter(p => p !== propiedad);
      return true;
    }
    return false;
  }

  // Verifica si puede construir en un grupo de color
  puedeConstruir(color, tablero) {
    // Busca todas las propiedades de ese color en el tablero
    const grupo = tablero.filter(c => c.color === color && c.type === "property");
    // Verifica si el jugador tiene todas y ninguna está hipotecada
    return grupo.every(p => p.propietario === this && !p.hipotecada);
  }
}

//para poder usarla en otros archivos
    module.exports =  Jugador ;













