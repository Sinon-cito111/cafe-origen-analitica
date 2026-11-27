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

function clientesRecurrentes(ventas) {
  const recurrentes = [];
  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      if (
        ventas[i].cliente === ventas[j].cliente &&
        !recurrentes.includes(ventas[i].cliente)
      ) {
        recurrentes.push(ventas[i].cliente);
      }
    }
  }
  return recurrentes;
}

function totalCiudadCadena(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();

  return ventas
    .map((venta) => ({
      ...venta,
      ciudad: venta.ciudad.trim().toLowerCase()
    }))
    .filter((venta) => venta.cantidad > 0 && venta.ciudad === ciudadBuscada)
    .map((venta) => valorVenta(venta))
    .reduce((acum, valor) => acum + valor, 0);
}

function totalCiudadUnaPasada(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();
  let total = 0;

  for (const venta of ventas) {
    if (
      venta.cantidad > 0 &&
      venta.ciudad.trim().toLowerCase() === ciudadBuscada
    ) {
      total += valorVenta(venta);
    }
  }

  return total;
}

function clientesRecurrentesSet(ventas) {
  const vistos = new Set();
  const recurrentes = new Set();

  for (const venta of ventas) {
    if (vistos.has(venta.cliente)) {
      recurrentes.add(venta.cliente);
    } else {
      vistos.add(venta.cliente);
    }
  }

  return Array.from(recurrentes);
}

function comprasPorCliente(ventas) {
  const conteo = new Map();

  for (const venta of ventas) {
    const actual = conteo.get(venta.cliente) || 0;
    conteo.set(venta.cliente, actual + 1);
  }

  return conteo;
}

function clientesRecurrentesDesdeMap(ventas) {
  const conteo = comprasPorCliente(ventas);
  const recurrentes = [];

  for (const [cliente, cantidad] of conteo.entries()) {
    if (cantidad > 1) {
      recurrentes.push(cliente);
    }
  }

  return recurrentes;
}

function comboRegaloFuerzaBruta(catalogo, valor) {
  for (let i = 0; i < catalogo.length; i++) {
    for (let j = i + 1; j < catalogo.length; j++) {
      if (
        catalogo[i].producto !== catalogo[j].producto &&
        catalogo[i].precio + catalogo[j].precio === valor
      ) {
        return [catalogo[i], catalogo[j]];
      }
    }
  }
  return null;
}

function comboRegalo(catalogo, valor) {
  const preciosVistos = new Map();

  for (const item of catalogo) {
    const complemento = valor - item.precio;

    if (preciosVistos.has(complemento)) {
      const anterior = preciosVistos.get(complemento);
      if (anterior.producto !== item.producto) {
        return [anterior, item];
      }
    }

    if (!preciosVistos.has(item.precio)) {
      preciosVistos.set(item.precio, item);
    }
  }

  return null;
}

function productoEstrellaPorCiudad(ventas) {
  const porCiudad = new Map();

  for (const venta of ventas) {
    if (venta.cantidad <= 0) continue;

    const ciudad = normalizarCiudad(venta.ciudad);
    const producto = venta.producto.trim();

    if (!porCiudad.has(ciudad)) {
      porCiudad.set(ciudad, new Map());
    }

    const conteoProductos = porCiudad.get(ciudad);
    conteoProductos.set(producto, (conteoProductos.get(producto) || 0) + 1);
  }

  const resultado = {};

  for (const [ciudad, conteoProductos] of porCiudad.entries()) {
    let estrella = null;
    let maxApariciones = 0;

    for (const [producto, apariciones] of conteoProductos.entries()) {
      if (apariciones > maxApariciones) {
        maxApariciones = apariciones;
        estrella = producto;
      }
    }

    resultado[ciudad] = {
      producto: estrella,
      apariciones: maxApariciones
    };
  }

  return resultado;
}

function primerClienteUnico(ventas) {
  const conteoClientes = new Map();

  for (const venta of ventas) {
    const actual = conteoClientes.get(venta.cliente) || 0;
    conteoClientes.set(venta.cliente, actual + 1);
  }

  for (const venta of ventas) {
    if (conteoClientes.get(venta.cliente) === 1) {
      return venta.cliente;
    }
  }

  return null;
}

// ==========================================
// VENTANA DESLIZANTE Y DOS PUNTEROS
// ==========================================

function mejorSemanaBruta(dias, k) {
  if (!Array.isArray(dias) || k <= 0 || dias.length < k) {
    return null;
  }

  let maxTotal = -Infinity;
  let diaInicio = 0;

  for (let i = 0; i <= dias.length - k; i++) {
    let suma = 0;
    for (let j = 0; j < k; j++) {
      suma += dias[i + j];
    }
    if (suma > maxTotal) {
      maxTotal = suma;
      diaInicio = i + 1; // Día 1-indexado (1..dias.length)
    }
  }

  return {
    total: maxTotal,
    diaInicio
  };
}

function mejorSemana(dias, k) {
  if (!Array.isArray(dias) || k <= 0 || dias.length < k) {
    return null;
  }

  let sumaVentana = 0;
  for (let i = 0; i < k; i++) {
    sumaVentana += dias[i];
  }

  let maxTotal = sumaVentana;
  let diaInicio = 1;

  for (let i = k; i < dias.length; i++) {
    sumaVentana = sumaVentana + dias[i] - dias[i - k];
    if (sumaVentana > maxTotal) {
      maxTotal = sumaVentana;
      diaInicio = i - k + 2; // Día 1-indexado donde inicia la ventana
    }
  }

  return {
    total: maxTotal,
    diaInicio
  };
}

function parMasCercano(precios, presupuesto) {
  if (!Array.isArray(precios) || precios.length < 2 || presupuesto <= 0) {
    return null;
  }

  // Copia ordenada de menor a mayor sin mutar el arreglo original
  const ordenados = [...precios].sort((a, b) => a.precio - b.precio);

  let izq = 0;
  let der = ordenados.length - 1;
  let mejorSuma = -1;
  let mejorPar = null;

  while (izq < der) {
    const suma = ordenados[izq].precio + ordenados[der].precio;

    if (suma <= presupuesto) {
      if (suma > mejorSuma) {
        mejorSuma = suma;
        mejorPar = [ordenados[izq], ordenados[der]];
      }
      izq++;
    } else {
      der--;
    }
  }

  return mejorPar;
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
  totalPorCiudadContado,
  clientesRecurrentes,
  totalCiudadCadena,
  totalCiudadUnaPasada,
  clientesRecurrentesSet,
  comprasPorCliente,
  clientesRecurrentesDesdeMap,
  comboRegaloFuerzaBruta,
  comboRegalo,
  productoEstrellaPorCiudad,
  primerClienteUnico,
  mejorSemanaBruta,
  mejorSemana,
  parMasCercano
};