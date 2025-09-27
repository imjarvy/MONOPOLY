// Servicio para obtener el tablero y propiedades
export async function getBoard() {
  try {
    const response = await fetch('http://127.0.0.1:5000/board');
    if (!response.ok) throw new Error('No se pudo obtener el tablero desde el backend');
    return await response.json();
  } catch (error) {
    console.warn('Backend no disponible, usando datos locales:', error);
    // Usar datos locales como respaldo
    return getBoardLocal();
  }
}

// Datos locales del tablero para cuando el backend no esté disponible
function getBoardLocal() {
  return {
    "bottom": [
      {
        "action": {
          "money": 200
        },
        "id": 0,
        "name": "Salida",
        "type": "special"
      },
      {
        "color": "brown",
        "id": 1,
        "mortgage": 30,
        "name": "Avenida Mediterráneo",
        "price": 60,
        "rent": {
          "base": 2,
          "withHotel": 250,
          "withHouse": [10, 30, 90, 160]
        },
        "type": "property"
      },
      {
        "id": 2,
        "name": "Caja de Comunidad",
        "type": "community_chest"
      },
      {
        "color": "brown",
        "id": 3,
        "mortgage": 30,
        "name": "Avenida Báltica",
        "price": 60,
        "rent": {
          "base": 4,
          "withHotel": 450,
          "withHouse": [20, 60, 180, 320]
        },
        "type": "property"
      },
      {
        "action": {
          "money": -200
        },
        "id": 4,
        "name": "Impuesto sobre ingresos",
        "type": "tax"
      },
      {
        "id": 5,
        "mortgage": 100,
        "name": "Ferrocarril Reading",
        "price": 200,
        "rent": {
          "1": 25,
          "2": 50,
          "3": 100,
          "4": 200
        },
        "type": "railroad"
      },
      {
        "color": "purple",
        "id": 6,
        "mortgage": 50,
        "name": "Avenida Oriental",
        "price": 100,
        "rent": {
          "base": 6,
          "withHotel": 550,
          "withHouse": [30, 90, 270, 400]
        },
        "type": "property"
      },
      {
        "id": 7,
        "name": "Sorpresa",
        "type": "chance"
      },
      {
        "color": "purple",
        "id": 8,
        "mortgage": 50,
        "name": "Avenida Vermont",
        "price": 100,
        "rent": {
          "base": 6,
          "withHotel": 550,
          "withHouse": [30, 90, 270, 400]
        },
        "type": "property"
      },
      {
        "color": "purple",
        "id": 9,
        "mortgage": 60,
        "name": "Avenida Connecticut",
        "price": 120,
        "rent": {
          "base": 8,
          "withHotel": 600,
          "withHouse": [40, 100, 300, 450]
        },
        "type": "property"
      }
    ],
    "left": [
      {
        "id": 10,
        "name": "Cárcel / Solo de visita",
        "type": "special"
      },
      {
        "color": "pink",
        "id": 11,
        "mortgage": 70,
        "name": "Plaza St. Charles",
        "price": 140,
        "rent": {
          "base": 10,
          "withHotel": 750,
          "withHouse": [50, 150, 450, 625]
        },
        "type": "property"
      },
      {
        "action": {
          "money": -50
        },
        "id": 12,
        "name": "Impuesto Electricidad",
        "type": "tax"
      },
      {
        "color": "pink",
        "id": 13,
        "mortgage": 70,
        "name": "Avenida States",
        "price": 140,
        "rent": {
          "base": 10,
          "withHotel": 750,
          "withHouse": [50, 150, 450, 625]
        },
        "type": "property"
      },
      {
        "color": "pink",
        "id": 14,
        "mortgage": 80,
        "name": "Avenida Virginia",
        "price": 160,
        "rent": {
          "base": 12,
          "withHotel": 900,
          "withHouse": [60, 180, 500, 700]
        },
        "type": "property"
      },
      {
        "id": 15,
        "mortgage": 100,
        "name": "Ferrocarril Pennsylvania",
        "price": 200,
        "rent": {
          "1": 25,
          "2": 50,
          "3": 100,
          "4": 200
        },
        "type": "railroad"
      },
      {
        "color": "orange",
        "id": 16,
        "mortgage": 90,
        "name": "Plaza St. James",
        "price": 180,
        "rent": {
          "base": 14,
          "withHotel": 950,
          "withHouse": [70, 200, 550, 750]
        },
        "type": "property"
      },
      {
        "id": 17,
        "name": "Caja de Comunidad",
        "type": "community_chest"
      },
      {
        "color": "orange",
        "id": 18,
        "mortgage": 90,
        "name": "Avenida Tennessee",
        "price": 180,
        "rent": {
          "base": 14,
          "withHotel": 950,
          "withHouse": [70, 200, 550, 750]
        },
        "type": "property"
      },
      {
        "color": "orange",
        "id": 19,
        "mortgage": 100,
        "name": "Avenida Nueva York",
        "price": 200,
        "rent": {
          "base": 16,
          "withHotel": 1000,
          "withHouse": [80, 220, 600, 800]
        },
        "type": "property"
      }
    ],
    "top": [
      {
        "id": 20,
        "name": "Parqueo Gratis",
        "type": "special"
      },
      {
        "color": "red",
        "id": 21,
        "mortgage": 110,
        "name": "Avenida Kentucky",
        "price": 220,
        "rent": {
          "base": 18,
          "withHotel": 1050,
          "withHouse": [90, 250, 700, 875]
        },
        "type": "property"
      },
      {
        "id": 22,
        "name": "Sorpresa",
        "type": "chance"
      },
      {
        "color": "red",
        "id": 23,
        "mortgage": 110,
        "name": "Avenida Indiana",
        "price": 220,
        "rent": {
          "base": 18,
          "withHotel": 1050,
          "withHouse": [90, 250, 700, 875]
        },
        "type": "property"
      },
      {
        "color": "red",
        "id": 24,
        "mortgage": 120,
        "name": "Avenida Illinois",
        "price": 240,
        "rent": {
          "base": 20,
          "withHotel": 1100,
          "withHouse": [100, 300, 750, 925]
        },
        "type": "property"
      },
      {
        "id": 25,
        "mortgage": 100,
        "name": "Ferrocarril B&O",
        "price": 200,
        "rent": {
          "1": 25,
          "2": 50,
          "3": 100,
          "4": 200
        },
        "type": "railroad"
      },
      {
        "color": "yellow",
        "id": 26,
        "mortgage": 130,
        "name": "Avenida Atlántico",
        "price": 260,
        "rent": {
          "base": 22,
          "withHotel": 1150,
          "withHouse": [110, 330, 800, 975]
        },
        "type": "property"
      },
      {
        "color": "yellow",
        "id": 27,
        "mortgage": 130,
        "name": "Avenida Ventnor",
        "price": 260,
        "rent": {
          "base": 22,
          "withHotel": 1150,
          "withHouse": [110, 330, 800, 975]
        },
        "type": "property"
      },
      {
        "action": {
          "money": -50
        },
        "id": 28,
        "name": "Impuesto Agua",
        "type": "tax"
      },
      {
        "color": "yellow",
        "id": 29,
        "mortgage": 140,
        "name": "Jardines Marvin",
        "price": 280,
        "rent": {
          "base": 24,
          "withHotel": 1200,
          "withHouse": [120, 360, 850, 1025]
        },
        "type": "property"
      }
    ],
    "right": [
      {
        "action": {
          "goTo": "jail"
        },
        "id": 30,
        "name": "Ve a la Cárcel",
        "type": "special"
      },
      {
        "color": "green",
        "id": 31,
        "mortgage": 150,
        "name": "Avenida Pacífico",
        "price": 300,
        "rent": {
          "base": 26,
          "withHotel": 1275,
          "withHouse": [130, 390, 900, 1100]
        },
        "type": "property"
      },
      {
        "color": "green",
        "id": 32,
        "mortgage": 150,
        "name": "Avenida Carolina del Norte",
        "price": 300,
        "rent": {
          "base": 26,
          "withHotel": 1275,
          "withHouse": [130, 390, 900, 1100]
        },
        "type": "property"
      },
      {
        "id": 33,
        "name": "Caja de Comunidad",
        "type": "community_chest"
      },
      {
        "color": "green",
        "id": 34,
        "mortgage": 160,
        "name": "Avenida Pensilvania",
        "price": 320,
        "rent": {
          "base": 28,
          "withHotel": 1400,
          "withHouse": [150, 450, 1000, 1200]
        },
        "type": "property"
      },
      {
        "id": 35,
        "mortgage": 100,
        "name": "Ferrocarril Short Line",
        "price": 200,
        "rent": {
          "1": 25,
          "2": 50,
          "3": 100,
          "4": 200
        },
        "type": "railroad"
      },
      {
        "id": 36,
        "name": "Sorpresa",
        "type": "chance"
      },
      {
        "color": "blue",
        "id": 37,
        "mortgage": 175,
        "name": "Avenida Parque",
        "price": 350,
        "rent": {
          "base": 35,
          "withHotel": 1500,
          "withHouse": [175, 500, 1100, 1300]
        },
        "type": "property"
      },
      {
        "action": {
          "money": -100
        },
        "id": 38,
        "name": "Impuesto de lujo",
        "type": "tax"
      },
      {
        "color": "blue",
        "id": 39,
        "mortgage": 200,
        "name": "Paseo del Parque",
        "price": 400,
        "rent": {
          "base": 50,
          "withHotel": 2000,
          "withHouse": [200, 600, 1400, 1700]
        },
        "type": "property"
      }
    ],
    "chance": [
      {
        "action": {
          "money": 150
        },
        "description": "Recibe $150 por ganar la lotería",
        "id": 1,
        "type": "chance"
      },
      {
        "action": {
          "money": -75
        },
        "description": "Paga $75 por multa de tráfico",
        "id": 2,
        "type": "chance"
      },
      {
        "action": {
          "money": 100
        },
        "description": "Recibe $100 por devolución de impuestos",
        "id": 3,
        "type": "chance"
      },
      {
        "action": {
          "money": -150
        },
        "description": "Paga $150 por gastos legales",
        "id": 4,
        "type": "chance"
      },
      {
        "action": {
          "money": 50
        },
        "description": "Recibe $50 por un premio sorpresa",
        "id": 5,
        "type": "chance"
      }
    ],
    "community_chest": [
      {
        "action": {
          "money": 100
        },
        "description": "Recibe $100 por venta de acciones",
        "id": 1,
        "type": "community_chest"
      },
      {
        "action": {
          "money": -50
        },
        "description": "Paga $50 por gastos médicos",
        "id": 2,
        "type": "community_chest"
      },
      {
        "action": {
          "money": 200
        },
        "description": "Recibe $200 por herencia",
        "id": 3,
        "type": "community_chest"
      },
      {
        "action": {
          "money": -100
        },
        "description": "Paga $100 por reparación de propiedades",
        "id": 4,
        "type": "community_chest"
      },
      {
        "action": {
          "money": 50
        },
        "description": "Recibe $50 de reembolso de impuestos",
        "id": 5,
        "type": "community_chest"
      }
    ]
  };
}