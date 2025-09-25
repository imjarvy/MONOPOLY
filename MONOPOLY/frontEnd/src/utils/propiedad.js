// Clase Propiedad para Monopoly
export class Propiedad {
  /**
   * @param {Object} data - Objeto de datos de la propiedad (del JSON del backend)
   */
  constructor(data) {
    this.id = data.id;
    this.nombre = data.name;
    this.precio = data.price;
    this.color = data.color || null;
    this.mortgage = data.mortgage || 0;
    this.rent = data.rent || {}; // { base, withHouse: [], withHotel }
    this.tipo = data.type || "property";
    this.propietario = null; // Jugador dueño
    this.hipotecada = false;
    this.casas = 0; // 0 a 4
    this.hotel = false;
  }

  // Devuelve la renta actual según casas/hotel
  calcularRenta() {
    if (this.hipotecada) return 0;
    if (this.hotel) return this.rent.withHotel || 0;
    if (this.casas > 0) return this.rent.withHouse ? this.rent.withHouse[this.casas - 1] : 0;
    return this.rent.base || 0;
  }

  // Hipotecar la propiedad
  hipotecar() {
    if (!this.hipotecada) {
      this.hipotecada = true;
      return this.mortgage;
    }
    return 0;
  }

  // Levantar hipoteca (paga mortgage + 10%)
  levantarHipoteca() {
    if (this.hipotecada) {
      this.hipotecada = false;
      return Math.ceil(this.mortgage * 1.1);
    }
    return 0;
  }

  // Construir casa (máx 4)
  construirCasa() {
    if (!this.hipotecada && !this.hotel && this.casas < 4) {
      this.casas++;
      return true;
    }
    return false;
  }

  // Construir hotel (requiere 4 casas)
  construirHotel() {
    if (!this.hipotecada && !this.hotel && this.casas === 4) {
      this.hotel = true;
      this.casas = 0;
      return true;
    }
    return false;
  }

  // Información resumida
  getInfo() {
    return `${this.nombre} - Precio: $${this.precio}, Color: ${this.color || "-"}, Casas: ${this.casas}, Hotel: ${this.hotel ? "Sí" : "No"}, Hipotecada: ${this.hipotecada ? "Sí" : "No"}`;
  }
}


