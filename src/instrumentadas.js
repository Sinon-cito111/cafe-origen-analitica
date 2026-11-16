// ==========================================
// FUNCIONES INSTRUMENTADAS Y O(1) (Día 2)
// ==========================================

function primeraVenta(ventas, contador = { ops: 0 }) {
  contador.ops += 1; // Acceso directo / verificación de existencia
  return ventas.length > 0 ? ventas[0] : null;
}

function totalVendidoContado(ventas, contador) {
  let total = 0;

  for (const venta of ventas) {
    contador.ops += 1; // Visita al elemento
    contador.ops += 1; // Comparación venta.cantidad > 0
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
    }
  }

  return total;
}

function ventaMayorContado(ventas, contador) {
  let mayor = null;

  for (const venta of ventas) {
    contador.ops += 1; // Visita al elemento
    contador.ops += 1; // Comparación venta.cantidad > 0
    if (venta.cantidad > 0) {
      contador.ops += 1; // Comparación mayor === null
      if (mayor === null) {
        mayor = venta;
      } else {
        contador.ops += 1; // Comparación valorVenta(venta) > valorVenta(mayor)
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
    contador.ops += 1; // Visita al elemento
    contador.ops += 1; // Comparación venta.cantidad > 0
    if (venta.cantidad > 0) {
      const ciudad = normalizarCiudad(venta.ciudad);
      contador.ops += 1; // Verificación/acumulación en el diccionario por clave
      acum[ciudad] = (acum[ciudad] || 0) + valorVenta(venta);
    }
  }

  return acum;
}