import { 
  accionPropiedad, 
  accionFerrocarril, 
  accionServicio, 
  accionCartaEspecial, 
  construir 
} from '../utils/acciones.js';

const modal = document.getElementById('modalAccion');
const contenido = modal.querySelector('.contenido-modal');
const btnConfirmar = modal.querySelector('.btn-confirmar');
const btnCancelar = modal.querySelector('.btn-cancelar');

let estadoActual = null; 

// Abrir modal según casilla/acción

function abrirModal(jugador, casilla, jugadores, dados = null, carta = null) {
  let resultado;

  switch (casilla.tipo) {
    case 'propiedad':
      resultado = accionPropiedad(jugador, casilla, jugadores);
      break;
    case 'ferrocarril':
      resultado = accionFerrocarril(jugador, casilla);
      break;
    case 'servicio':
      if (dados) {
        resultado = accionServicio(jugador, casilla, dados);
      }
      break;
    case 'cartaEspecial':
      if (carta) {
        resultado = accionCartaEspecial(jugador, carta, jugadores);
      }
      break;
    default:
      resultado = { tipo: 'sinAccion' };
  }

  // Guardar también el jugador actual
  estadoActual = { ...resultado, jugador };

  mostrarContenido(estadoActual);
  modal.style.display = 'block';
}

// Mostrar modal según resultado

function mostrarContenido(resultado) {
  switch (resultado.tipo) {
    // Propiedades
    case 'propiedadLibre':
      contenido.innerHTML = `<p>La propiedad <b>${resultado.casilla.nombre}</b> está libre. ¿Quieres comprarla por $${resultado.casilla.precio}?</p>`;
      mostrarBotones(true);
      break;
    case 'puedeConstruir':
      contenido.innerHTML = `<p>Puedes construir casas o un hotel en <b>${resultado.casilla.nombre}</b>. ¿Quieres construir?</p>`;
      mostrarBotones(true);
      break;
    case 'pagoRentaPropiedad':
      contenido.innerHTML = `<p>Debes pagar renta de $${resultado.monto} al jugador ${resultado.a.nickname}</p>`;
      mostrarBotones(false);
      break;

    // Ferrocarriles
    case 'ferrocarrilLibre':
      contenido.innerHTML = `<p>El ferrocarril <b>${resultado.casilla.nombre}</b> está libre. ¿Quieres comprarlo por $${resultado.casilla.precio}?</p>`;
      mostrarBotones(true);
      break;
    case 'pagoRentaFerrocarril':
      contenido.innerHTML = `<p>Debes pagar renta de $${resultado.monto} al jugador ${resultado.a.nickname}</p>`;
      mostrarBotones(false);
      break;

    // Servicios
    case 'servicioLibre':
      contenido.innerHTML = `<p>El servicio público <b>${resultado.casilla.nombre}</b> está libre. ¿Quieres comprarlo por $${resultado.casilla.precio}?</p>`;
      mostrarBotones(true);
      break;
    case 'pagoRentaServicio':
      contenido.innerHTML = `<p>Debes pagar renta de $${resultado.monto} al jugador ${resultado.a.nickname}</p>`;
      mostrarBotones(false);
      break;

    // Cartas
    case 'dinero':
      contenido.innerHTML = `<p>Has recibido $${resultado.monto}</p>`;
      mostrarBotones(false);
      break;
    case 'salirCarcelGuardada':
      contenido.innerHTML = `<p>Has guardado una carta para salir de la cárcel.</p>`;
      mostrarBotones(false);
      break;
    case 'mover':
      contenido.innerHTML = `<p>Te has movido a la casilla ${resultado.destino}</p>`;
      mostrarBotones(false);
      break;
    case 'irCarcel':
      contenido.innerHTML = `<p>Has sido enviado a la cárcel.</p>`;
      mostrarBotones(false);
      break;

    // Impuestos y bancarrota
    case 'pagoImpuesto':
      contenido.innerHTML = `<p>Has pagado un impuesto de $${resultado.monto}</p>`;
      mostrarBotones(false);
      break;
    case 'bancarrota':
      contenido.innerHTML = `<p>Has quedado en bancarrota con una deuda de $${resultado.deuda}</p>`;
      mostrarBotones(false);
      break;

    // Default
    case 'sinAccion':
    default:
      contenido.innerHTML = `<p>No hay acción para realizar.</p>`;
      mostrarBotones(false);
  }
}

function mostrarBotones(confirmarVisible) {
  btnConfirmar.style.display = confirmarVisible ? 'inline-block' : 'none';
  btnCancelar.style.display = 'inline-block';
}

// Confirmar acción
btnConfirmar.addEventListener('click', () => {
  if (!estadoActual) return;

  const jugador = estadoActual.jugador;
  const casilla = estadoActual.casilla;

  switch (estadoActual.tipo) {
    case 'propiedadLibre':
    case 'ferrocarrilLibre':
    case 'servicioLibre':
      if (jugador.dinero >= casilla.precio) {
        jugador.dinero -= casilla.precio;
        casilla.propietario = jugador;
        if (!jugador.propiedades) jugador.propiedades = [];
        jugador.propiedades.push(casilla);
        alert(`Has comprado ${casilla.nombre} por $${casilla.precio}`);
      } else {
        alert('No tienes suficiente dinero para comprar esta casilla.');
      }
      break;

    case 'puedeConstruir':
      const construccion = construir(jugador, casilla);
      alert(`Construcción realizada: ${construccion.tipo}`);
      break;
  }

  cerrarModal();
});

// Cancelar acción

btnCancelar.addEventListener('click', cerrarModal);

function cerrarModal() {
  modal.style.display = 'none';
  estadoActual = null;
}

export { abrirModal, cerrarModal };