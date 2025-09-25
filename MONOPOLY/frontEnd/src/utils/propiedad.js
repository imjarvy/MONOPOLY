// Clase Propiedad para Monopoly
class Propiedad {
  constructor(nombre, precio, renta) {
    this.nombre = nombre;  
    this.precio = precio;  // Precio de compra
    this.renta = renta;    // Costo de renta
    this.hipotecada = hipotecada; // Referencia al jugador dueño
  }

  hipotecar(){
    this.hipotecada = true;
  }
  
 levantarHipoteca(){
    this.hipotecada = false;
 }

  getInfo(){
    return `${this.nombre} - Precio: ${this.precio}, Renta: ${this.renta}, Hipotecada: ${this.hipotecada}`;
  }
 
  
}

  //para poder usarla en otros archivos 
   module.exports =  Propiedad ;


