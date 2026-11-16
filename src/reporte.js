const { performance } = require("perf_hooks");
const ventasReales = require("./datos");
const catalogo = require("./catalogo");
const { generarVentas } = require("./generador");
const {
  valorVenta,
  totalVendidoM,
  unidadesVendidasM,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  totalCiudadUnaPasada,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  clientesRecurrentesSet,
  productoEstrellaPorCiudad,
  comboRegalo,
  primerClienteUnico,
  mejorSemana
} = require("./analitica");

const ventasDiariasSeptiembre = [
  320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
  480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
  710, 380, 360, 440, 500, 590, 650, 720, 400, 370
];

function formatearCOP(valor) {
  return `$${Math.round(valor).toLocaleString("es-CO")}`;
}

function lineaSeparadora(caracter = "=", longitud = 68) {
  return caracter.repeat(longitud);
}

function obtenerDataset(argN) {
  if (!argN) {
    return {
      datos: ventasReales,
      fuente: `Datos reales del Día 1 (${ventasReales.length} registros)`
    };
  }

  const n = Number(argN);
  if (!Number.isInteger(n) || n <= 0) {
    console.error("Error: El parámetro n debe ser un entero positivo. Ej: node src/reporte.js 100000");
    process.exit(1);
  }

  return {
    datos: generarVentas(n),
    fuente: `Historial sintético generado (${n.toLocaleString("es-CO")} registros)`
  };
}

function generarReporte(datos, fuente) {
  const inicioReporte = performance.now();

  console.log(lineaSeparadora("="));
  console.log("          CAFÉ ORIGEN - REPORTE EJECUTIVO DE VENTAS (v1.0)");
  console.log(`          Fuente: ${fuente}`);
  console.log(lineaSeparadora("="));

  // 1. RESUMEN GENERAL
  const total = totalVendidoM(datos);
  const unidades = unidadesVendidasM(datos);
  const ticket = ticketPromedio(datos);
  const mayor = ventaMayor(datos);

  console.log("\n1. RESUMEN GENERAL");
  console.log(lineaSeparadora("-"));
  console.log(`${"Total vendido:".padEnd(32)} ${formatearCOP(total)}`);
  console.log(`${"Unidades vendidas:".padEnd(32)} ${unidades.toLocaleString("es-CO")} uds.`);
  console.log(`${"Ticket promedio:".padEnd(32)} ${formatearCOP(ticket)}`);
  if (mayor) {
    console.log(
      `${"Venta más grande:".padEnd(32)} ${formatearCOP(valorVenta(mayor))} (${mayor.producto} - ${mayor.ciudad.trim()})`
    );
  }

  // 2. VENTAS POR CIUDAD
  console.log("\n2. VENTAS POR CIUDAD");
  console.log(lineaSeparadora("-"));
  const porCiudad = totalPorCiudad(datos);
  for (const [ciudad, monto] of Object.entries(porCiudad)) {
    console.log(`${ciudad.padEnd(32)} ${formatearCOP(monto).padStart(18)}`);
  }
  const verificacionMedellin = totalCiudadUnaPasada(datos, "Medellín");
  console.log(`${"(Verificación O(1) esp. Medellín):".padEnd(32)} ${formatearCOP(verificacionMedellin).padStart(18)}`);

  // 3. UNIDADES POR PRODUCTO
  console.log("\n3. UNIDADES POR PRODUCTO");
  console.log(lineaSeparadora("-"));
  const porProducto = unidadesPorProducto(datos);
  for (const [producto, cant] of Object.entries(porProducto)) {
    const textoUds = `${cant.toLocaleString("es-CO")} uds.`;
    console.log(`${producto.padEnd(32)} ${textoUds.padStart(18)}`);
  }

  // 4. TOP 3 PRODUCTOS POR VALOR GENERADO
  console.log("\n4. TOP 3 PRODUCTOS POR VALOR GENERADO");
  console.log(lineaSeparadora("-"));
  const top3 = topProductosPorValor(datos, 3);
  top3.forEach((item, index) => {
    const puesto = `#${index + 1} ${item.producto}`;
    console.log(`${puesto.padEnd(32)} ${formatearCOP(item.total).padStart(18)}`);
  });

  // 5. CONSULTA DIARIA (DÍA CON VENTAS VS. DÍA SIN VENTAS)
  console.log("\n5. RESUMEN POR FECHA ESPECÍFICA");
  console.log(lineaSeparadora("-"));
  const diaConVentas = ventasDelDia(datos, "2026-09-01");
  const diaSinVentas = ventasDelDia(datos, "2026-09-31");

  for (const resumen of [diaConVentas, diaSinVentas]) {
    console.log(
      `Fecha ${resumen.fecha} -> Transacciones: ${resumen.transacciones.toLocaleString("es-CO")} | ` +
      `Unidades: ${resumen.unidades.toLocaleString("es-CO")} | ` +
      `Total: ${formatearCOP(resumen.total)} | ` +
      `Ticket prom.: ${formatearCOP(resumen.ticketPromedio)}`
    );
  }

  // 6. CLIENTES RECURRENTES (O(n) CON SET)
  console.log("\n6. CLIENTES RECURRENTES (> 1 COMPRA)");
  console.log(lineaSeparadora("-"));
  const recurrentes = clientesRecurrentesSet(datos);
  const muestraRecurrentes = recurrentes.slice(0, 10).join(", ");
  const sufijo = recurrentes.length > 10 ? ` ... (+${(recurrentes.length - 10).toLocaleString("es-CO")} más)` : "";
  console.log(`${"Total clientes recurrentes:".padEnd(32)} ${recurrentes.length.toLocaleString("es-CO")} clientes`);
  console.log(`${"Muestra:".padEnd(32)} ${recurrentes.length > 0 ? muestraRecurrentes + sufijo : "Ninguno"}`);

  // 7. PRODUCTO ESTRELLA POR CIUDAD
  console.log("\n7. PRODUCTO ESTRELLA POR CIUDAD");
  console.log(lineaSeparadora("-"));
  const estrellas = productoEstrellaPorCiudad(datos);
  for (const [ciudad, info] of Object.entries(estrellas)) {
    console.log(
      `${ciudad.padEnd(20)} ${info.producto.padEnd(26)} (${info.apariciones.toLocaleString("es-CO")} ventas)`
    );
  }

  // 8. COMBO DE REGALO SUGERIDO (TARJETA $87.000)
  console.log("\n8. COMBO DE REGALO SUGERIDO (TARJETA $87.000)");
  console.log(lineaSeparadora("-"));
  const combo = comboRegalo(catalogo, 87000);
  if (combo) {
    console.log(
      `Sugerencia: ${combo[0].producto} (${formatearCOP(combo[0].precio)}) + ` +
      `${combo[1].producto} (${formatearCOP(combo[1].precio)}) = ${formatearCOP(combo[0].precio + combo[1].precio)}`
    );
  } else {
    console.log("Sugerencia: Sin combinación exacta disponible.");
  }

  // 9. CLIENTE PARA CUPÓN DE REGRESO (PRIMER CLIENTE ÚNICO)
  console.log("\n9. FIDELIZACIÓN: PRIMER CLIENTE CON UNA SOLA COMPRA");
  console.log(lineaSeparadora("-"));
  const clienteCupon = primerClienteUnico(datos);
  console.log(
    `${"Cliente seleccionado para cupón:".padEnd(32)} ${clienteCupon || "Ninguno (todos son recurrentes)"}`
  );

  // 10. MEJOR SEMANA DE VENTAS (VENTANA DESLIZANTE k = 7 DÍAS)
  console.log("\n10. MEJOR SEMANA DE SEPTIEMBRE (7 DÍAS CONSECUTIVOS)");
  console.log(lineaSeparadora("-"));
  const semanaTop = mejorSemana(ventasDiariasSeptiembre, 7);
  if (semanaTop) {
    console.log(
      `Ventana óptima: Días ${semanaTop.diaInicio + 1} al ${semanaTop.diaInicio + 7} de septiembre ` +
      `| Total acumulado: $${semanaTop.totalMaximo.toLocaleString("es-CO")} mil`
    );
  }

  const tiempoTotalMs = performance.now() - inicioReporte;
  console.log("\n" + lineaSeparadora("="));
  console.log(`Tiempo total de análisis y generación del reporte: ${tiempoTotalMs.toFixed(2)} ms`);
  console.log(lineaSeparadora("="));
}

const { datos, fuente } = obtenerDataset(process.argv[2]);
generarReporte(datos, fuente);