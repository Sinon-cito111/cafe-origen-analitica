function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

function totalVendido(ventas) {
  let total = 0;

  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
    }
  }

  return total;
}

function unidadesVendidas(ventas) {
  let unidades = 0;

  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      unidades += venta.cantidad;
    }
  }

  return unidades;
}

function ventaMayor(ventas) {
  let mayor = null;

  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
        mayor = venta;
      }
    }
  }

  return mayor;
}

function ticketPromedio(ventas) {
  let total = 0;
  let ventasValidas = 0;

  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
      ventasValidas += 1;
    }
  }

  if (ventasValidas === 0) {
    return 0;
  }

  return total / ventasValidas;
}

function ventasPorCiudad(ventas, ciudad) {
  let totalCiudad = 0;
  const ciudadBuscada = ciudad.trim().toLowerCase();

  for (const venta of ventas) {
    const ciudadVenta = venta.ciudad.trim().toLowerCase();
    if (venta.cantidad > 0 && ciudadVenta === ciudadBuscada) {
      totalCiudad += valorVenta(venta);
    }
  }

  return totalCiudad;
}

function normalizarCiudad(ciudad) {
  const limpia = ciudad.trim().toLowerCase();
  return limpia.charAt(0).toUpperCase() + limpia.slice(1);
}

function totalVendidoM(ventas) {
  return ventas
    .filter((venta) => venta.cantidad > 0)
    .reduce((acum, venta) => acum + valorVenta(venta), 0);
}

function unidadesVendidasM(ventas) {
  return ventas
    .filter((venta) => venta.cantidad > 0)
    .reduce((acum, venta) => acum + venta.cantidad, 0);
}

function ventasPorCiudadM(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();

  return ventas
    .filter(
      (venta) =>
        venta.cantidad > 0 &&
        venta.ciudad.trim().toLowerCase() === ciudadBuscada
    )
    .reduce((acum, venta) => acum + valorVenta(venta), 0);
}

function totalPorCiudad(ventas) {
  return ventas
    .filter((venta) => venta.cantidad > 0)
    .reduce((acum, venta) => {
      const ciudad = normalizarCiudad(venta.ciudad);
      acum[ciudad] = (acum[ciudad] || 0) + valorVenta(venta);
      return acum;
    }, {});
}

function unidadesPorProducto(ventas) {
  return ventas
    .filter((venta) => venta.cantidad > 0)
    .reduce((acum, venta) => {
      const producto = venta.producto.trim();
      acum[producto] = (acum[producto] || 0) + venta.cantidad;
      return acum;
    }, {});
}

function topProductosPorValor(ventas, k) {
  const totalesPorProducto = ventas
    .filter((venta) => venta.cantidad > 0)
    .reduce((acum, venta) => {
      const producto = venta.producto.trim();
      acum[producto] = (acum[producto] || 0) + valorVenta(venta);
      return acum;
    }, {});

  return Object.entries(totalesPorProducto)
    .map(([producto, total]) => ({ producto, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, k);
}

function ventasDelDia(ventas, fecha) {
  const fechaBuscada = fecha.trim();
  const registrosDia = ventas.filter(
    (venta) => venta.fecha.trim() === fechaBuscada && venta.cantidad > 0
  );

  return {
    fecha: fechaBuscada,
    transacciones: registrosDia.length,
    unidades: unidadesVendidasM(registrosDia),
    total: totalVendidoM(registrosDia),
    ticketPromedio: ticketPromedio(registrosDia)
  };
}

function primeraVenta(ventas, contador = { ops: 0 }) {
  contador.ops += 1;
  return ventas.length > 0 ? ventas[0] : null;
}

function totalVendidoContado(ventas, contador) {
  let total = 0;

  for (const venta of ventas) {
    contador.ops += 1;
    contador.ops += 1;
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
    }
  }

  return total;
}

function ventaMayorContado(ventas, contador) {
  let mayor = null;

  for (const venta of ventas) {
    contador.ops += 1;
    contador.ops += 1;
    if (venta.cantidad > 0) {
      contador.ops += 1;
      if (mayor === null) {
        mayor = venta;
      } else {
        contador.ops += 1;
        if (valorVenta(venta) > valorVenta(mayor)) {
          mayor = venta;
        }
      }
    }
  }

  return mayor;
}

function totalPorCiudadContado(ventas, contador) {
  const acum = {};

  for (const venta of ventas) {
    contador.ops += 1;
    contador.ops += 1;
    if (venta.cantidad > 0) {
      const ciudad = normalizarCiudad(venta.ciudad);
      contador.ops += 1;
      acum[ciudad] = (acum[ciudad] || 0) + valorVenta(venta);
    }
  }

  return acum;
}

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  primeraVenta,
  totalVendidoContado,
  ventaMayorContado,
  totalPorCiudadContado
};