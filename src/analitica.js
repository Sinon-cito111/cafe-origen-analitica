function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

// ==========================================
// VERSIONES CON CICLOS (Etapa 2)
// ==========================================

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

// ==========================================
// VERSIONES CON MÉTODOS DE ARREGLO (Etapa 3)
// ==========================================

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

  // Object.entries crea un arreglo nuevo, por lo que .sort() no muta el arreglo 'ventas' original
  return Object.entries(totalesPorProducto)
    .map(([producto, total]) => ({ producto, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, k);
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
  topProductosPorValor
};