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

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad
};

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
  return ventasValidas === 0 ? 0 : total / ventasValidas;
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
  return ventasValidas === 0 ? 0 : total / ventasValidas;
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

  return Object.entries(totalesPorProducto)
    .map(([producto, total]) => ({ producto, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, k);
}

// ==========================================
// FILTRO POR FECHA (v0.1)
// ==========================================

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
  ventasDelDia
};
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
// ==========================================
// COMPLEJIDAD ESPACIAL Y ENCADENAMIENTO (Día 2 - Parte 3)
// ==========================================

function totalCiudadCadena(ventas, ciudad) {
  const ciudadBuscada = ciudad.trim().toLowerCase();

  return ventas
    .map((venta) => ({
      ...venta,
      ciudad: venta.ciudad.trim().toLowerCase()
    })) // Recorrido 1 -> Arreglo nuevo 1 (n objetos clonados)
    .filter(
      (venta) => venta.cantidad > 0 && venta.ciudad === ciudadBuscada
    ) // Recorrido 2 -> Arreglo nuevo 2 (m <= n objetos)
    .map((venta) => valorVenta(venta)) // Recorrido 3 -> Arreglo nuevo 3 (m números)
    .reduce((acum, valor) => acum + valor, 0); // Recorrido 4 -> Escalar (sin arreglo)
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
// ==========================================
// OPTIMIZACIÓN DE CLIENTES RECURRENTES (Día 3)
// ==========================================

function clientesRecurrentesSet(ventas) {
  const vistos = new Set();
  const recurrentes = new Set();

  for (const venta of ventas) {
    const cliente = venta.cliente;
    if (vistos.has(cliente)) {
      recurrentes.add(cliente);
    } else {
      vistos.add(cliente);
    }
  }

  return Array.from(recurrentes);
}

function comprasPorCliente(ventas) {
  const conteo = new Map();

  for (const venta of ventas) {
    const cliente = venta.cliente;
    conteo.set(cliente, (conteo.get(cliente) || 0) + 1);
  }

  return conteo;
}

function clientesRecurrentesMap(ventas) {
  const conteo = comprasPorCliente(ventas);
  const recurrentes = [];

  for (const [cliente, compras] of conteo.entries()) {
    if (compras > 1) {
      recurrentes.push(cliente);
    }
  }

  return recurrentes;
}
// ==========================================
// CAMPAÑA FIN DE AÑO: TARJETAS REGALO Y FIDELIZACIÓN
// ==========================================

// Paso 2: Fuerza bruta O(m^2) donde m = catalogo.length
function comboRegaloBruta(catalogo, valor) {
  for (let i = 0; i < catalogo.length; i++) {
    for (let j = i + 1; j < catalogo.length; j++) {
      if (catalogo[i].precio + catalogo[j].precio === valor) {
        return [catalogo[i], catalogo[j]];
      }
    }
  }
  return null;
}

// Paso 3: Optimizada con Map de complementos O(m)
function comboRegalo(catalogo, valor) {
  const vistos = new Map(); // precio -> objeto producto

  for (const actual of catalogo) {
    const complemento = valor - actual.precio;
    if (vistos.has(complemento)) {
      return [vistos.get(complemento), actual];
    }
    // Guardamos el precio actual si aún no existe para conservar el primero visto
    if (!vistos.has(actual.precio)) {
      vistos.set(actual.precio, actual);
    }
  }

  return null;
}

// Paso 5: Producto estrella (más apariciones en ventas válidas) por ciudad
function productoEstrellaPorCiudad(ventas) {
  const conteosPorCiudad = new Map(); // ciudad -> Map(producto -> apariciones)

  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      const ciudad = normalizarCiudad(venta.ciudad);
      const producto = venta.producto.trim();

      if (!conteosPorCiudad.has(ciudad)) {
        conteosPorCiudad.set(ciudad, new Map());
      }

      const mapaProductos = conteosPorCiudad.get(ciudad);
      mapaProductos.set(producto, (mapaProductos.get(producto) || 0) + 1);
    }
  }

  const resultado = {};
  for (const [ciudad, mapaProductos] of conteosPorCiudad.entries()) {
    let estrella = null;
    let maxApariciones = 0;

    for (const [producto, apariciones] of mapaProductos.entries()) {
      if (apariciones > maxApariciones) {
        maxApariciones = apariciones;
        estrella = { producto, apariciones };
      }
    }

    resultado[ciudad] = estrella;
  }

  return resultado;
}

// Paso 6: Primer cliente en orden cronológico con una sola compra en todo el historial
function primerClienteUnico(ventas) {
  const conteo = new Map();

  // Primer recorrido: contar cuántas compras válidas hizo cada cliente
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      const cliente = venta.cliente.trim();
      conteo.set(cliente, (conteo.get(cliente) || 0) + 1);
    }
  }

  // Segundo recorrido: encontrar el primero en orden de aparición con conteo === 1
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      const cliente = venta.cliente.trim();
      if (conteo.get(cliente) === 1) {
        return cliente;
      }
    }
  }

  return null;
}
// ==========================================
// VENTANA DESLIZANTE Y DOS PUNTEROS
// ==========================================

// Paso 1: Fuerza bruta O(n * k) para encontrar los k días consecutivos con mayor suma
function mejorSemanaBruta(dias, k) {
  if (!Array.isArray(dias) || k <= 0 || dias.length < k) {
    return null;
  }

  let maxSuma = -Infinity;
  let diaInicio = 0;

  for (let i = 0; i <= dias.length - k; i++) {
    let sumaActual = 0;
    for (let j = i; j < i + k; j++) {
      sumaActual += dias[j];
    }

    if (sumaActual > maxSuma) {
      maxSuma = sumaActual;
      diaInicio = i;
    }
  }

  return { totalMaximo: maxSuma, diaInicio };
}

// Paso 2: Ventana deslizante O(n)
function mejorSemana(dias, k) {
  if (!Array.isArray(dias) || k <= 0 || dias.length < k) {
    return null;
  }

  // Calcular la suma de la primera ventana [0 ... k - 1]
  let sumaVentana = 0;
  for (let i = 0; i < k; i++) {
    sumaVentana += dias[i];
  }

  let maxSuma = sumaVentana;
  let diaInicio = 0;

  // Deslizar la ventana: entra dias[i], sale dias[i - k]
  for (let i = k; i < dias.length; i++) {
    sumaVentana += dias[i] - dias[i - k];

    if (sumaVentana > maxSuma) {
      maxSuma = sumaVentana;
      diaInicio = i - k + 1;
    }
  }

  return { totalMaximo: maxSuma, diaInicio };
}

// Paso 5: Dos punteros sobre catálogo ordenado O(m log m) por el ordenamiento + O(m) búsqueda
function parMasCercano(catalogo, presupuesto) {
  if (!Array.isArray(catalogo) || catalogo.length < 2) {
    return null;
  }

  // Copia ordenada de menor a mayor precio para no mutar el arreglo original
  const ordenados = [...catalogo].sort((a, b) => a.precio - b.precio);

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
      izq++; // Buscamos una suma mayor sin pasarnos del presupuesto
    } else {
      der--; // Nos pasamos del presupuesto; reducimos el precio mayor
    }
  }

  return mejorPar ? { productos: mejorPar, total: mejorSuma } : null;
}