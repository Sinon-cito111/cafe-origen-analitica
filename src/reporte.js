const ventas = require("./datos");
const {
  valorVenta,
  totalVendidoM,
  unidadesVendidasM,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia
} = require("./analitica");

function formatearCOP(valor) {
  return `$${Math.round(valor).toLocaleString("es-CO")}`;
}

function lineaSeparadora(caracter = "=", longitud = 62) {
  return caracter.repeat(longitud);
}

function generarReporte(datos) {
  console.log(lineaSeparadora("="));
  console.log("          CAFÉ ORIGEN - REPORTE EJECUTIVO DE VENTAS (v0.1)");
  console.log(lineaSeparadora("="));

  const total = totalVendidoM(datos);
  const unidades = unidadesVendidasM(datos);
  const ticket = ticketPromedio(datos);
  const mayor = ventaMayor(datos);

  console.log("\n1. RESUMEN GENERAL");
  console.log(lineaSeparadora("-"));
  console.log(`${"Total vendido:".padEnd(28)} ${formatearCOP(total)}`);
  console.log(`${"Unidades vendidas:".padEnd(28)} ${unidades.toLocaleString("es-CO")} uds.`);
  console.log(`${"Ticket promedio:".padEnd(28)} ${formatearCOP(ticket)}`);
  if (mayor) {
    console.log(
      `${"Venta más grande:".padEnd(28)} ${formatearCOP(valorVenta(mayor))} (${mayor.producto} - ${mayor.ciudad.trim()})`
    );
  }

  console.log("\n2. VENTAS POR CIUDAD");
  console.log(lineaSeparadora("-"));
  const porCiudad = totalPorCiudad(datos);
  for (const [ciudad, monto] of Object.entries(porCiudad)) {
    console.log(`${ciudad.padEnd(28)} ${formatearCOP(monto).padStart(15)}`);
  }

  console.log("\n3. UNIDADES POR PRODUCTO");
  console.log(lineaSeparadora("-"));
  const porProducto = unidadesPorProducto(datos);
  for (const [producto, cant] of Object.entries(porProducto)) {
    const textoUds = `${cant.toLocaleString("es-CO")} uds.`;
    console.log(`${producto.padEnd(28)} ${textoUds.padStart(15)}`);
  }

  console.log("\n4. TOP 3 PRODUCTOS POR VALOR GENERADO");
  console.log(lineaSeparadora("-"));
  const top3 = topProductosPorValor(datos, 3);
  top3.forEach((item, index) => {
    const puesto = `#${index + 1} ${item.producto}`;
    console.log(`${puesto.padEnd(28)} ${formatearCOP(item.total).padStart(15)}`);
  });

  console.log("\n5. RESUMEN POR FECHA ESPECÍFICA");
  console.log(lineaSeparadora("-"));
  const diaConVentas = ventasDelDia(datos, "2026-09-01");
  const diaSinVentas = ventasDelDia(datos, "2026-09-10");

  for (const resumen of [diaConVentas, diaSinVentas]) {
    console.log(
      `Fecha ${resumen.fecha} -> Transacciones: ${resumen.transacciones} | ` +
      `Unidades: ${resumen.unidades} | ` +
      `Total: ${formatearCOP(resumen.total)} | ` +
      `Ticket prom.: ${formatearCOP(resumen.ticketPromedio)}`
    );
  }

  console.log("\n" + lineaSeparadora("="));
}

generarReporte(ventas);