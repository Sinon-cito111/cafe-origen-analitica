const { performance } = require("perf_hooks");
const ventasDia1 = require("./datos");
const catalogo = require("./catalogo");
const { generarVentas } = require("./generador");
const {
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  clientesRecurrentesDesdeMap,
  productoEstrellaPorCiudad,
  comboRegalo,
  primerClienteUnico,
  mejorSemana
} = require("./analitica");

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

function formatearPesos(valor) {
  return formatoCOP.format(valor || 0);
}

function obtenerVentasDeEntrada(args) {
  const rawN = args[2];
  if (rawN !== undefined) {
    const n = Number(rawN);
    if (!Number.isInteger(n) || n <= 0) {
      throw new Error(
        `Cantidad inválida "${rawN}". Usa un entero positivo, por ejemplo: node src/reporte.js 100000`
      );
    }
    return {
      ventas: generarVentas(n),
      fuente: `Generador sintético (${n.toLocaleString("es-CO")} ventas)`,
      esSintetico: true
    };
  }

  return {
    ventas: ventasDia1,
    fuente: `Historial base Día 1 (${ventasDia1.length} registros)`,
    esSintetico: false
  };
}

function construirSerieDiaria(ventas, esSintetico) {
  if (!esSintetico) {
    // Serie diaria en miles de pesos para el historial base
    return [320, 410, 280, 390, 510, 620, 700];
  }

  const porDia = new Map();
  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      const actual = porDia.get(venta.fecha) || 0;
      porDia.set(venta.fecha, actual + venta.cantidad * venta.precio);
    }
  }

  return Array.from(porDia.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, total]) => Math.round(total / 1000));
}

function ejecutarReporte(args = process.argv) {
  const tInicio = performance.now();
  const { ventas, fuente, esSintetico } = obtenerVentasDeEntrada(args);

  const total = totalVendido(ventas);
  const unidades = unidadesVendidas(ventas);
  const promedio = ticketPromedio(ventas);
  const mayor = ventaMayor(ventas);
  const porCiudad = totalPorCiudad(ventas);
  const porProducto = unidadesPorProducto(ventas);
  const top3 = topProductosPorValor(ventas, 3);
  const diaSinVentas = ventasDelDia(ventas, "2026-09-10");
  const fechaConDatos = esSintetico ? "2026-09-05" : "2026-09-02";
  const diaConVentas = ventasDelDia(ventas, fechaConDatos);

  const recurrentes = clientesRecurrentesDesdeMap(ventas);
  const estrellasCiudad = productoEstrellaPorCiudad(ventas);
  const combo87k = comboRegalo(catalogo, 87000);
  const clienteCupon = primerClienteUnico(ventas);

  const serieDiaria = construirSerieDiaria(ventas, esSintetico);
  const ventanaK = Math.min(7, serieDiaria.length);
  const semanaTop = ventanaK > 0 ? mejorSemana(serieDiaria, ventanaK) : null;

  const tTotalMs = performance.now() - tInicio;

  console.log("==========================================================");
  console.log("        CAFÉ ORIGEN — REPORTE EJECUTIVO (v1.0)");
  console.log("==========================================================");
  console.log(`Fuente de datos: ${fuente}`);

  console.log("\n--- 1. RESUMEN GENERAL ---");
  console.log(`Total vendido:     ${formatearPesos(total)}`);
  console.log(`Unidades vendidas: ${unidades.toLocaleString("es-CO")}`);
  console.log(`Ticket promedio:   ${formatearPesos(Math.round(promedio))}`);
  if (mayor) {
    console.log(
      `Venta mayor:       ${mayor.producto} (${mayor.cliente}, ${mayor.ciudad}) — ${formatearPesos(mayor.cantidad * mayor.precio)}`
    );
  } else {
    console.log("Venta mayor:       Sin ventas válidas");
  }

  console.log("\n--- 2. VENTAS POR CIUDAD ---");
  for (const [ciudad, monto] of Object.entries(porCiudad)) {
    console.log(`- ${ciudad}: ${formatearPesos(monto)}`);
  }

  console.log("\n--- 3. UNIDADES POR PRODUCTO ---");
  for (const [producto, cant] of Object.entries(porProducto)) {
    console.log(`- ${producto}: ${cant.toLocaleString("es-CO")} uds.`);
  }

  console.log("\n--- 4. TOP 3 PRODUCTOS POR VALOR ---");
  top3.forEach((item, idx) => {
    console.log(
      `${idx + 1}. ${item.producto}: ${formatearPesos(item.total)}`
    );
  });

  console.log("\n--- 5. CONSULTA POR FECHA (ventasDelDia) ---");
  console.log(
    `Fecha ${diaConVentas.fecha}: ${diaConVentas.transacciones} trans. | ${diaConVentas.unidades} uds. | Total ${formatearPesos(diaConVentas.total)} | Ticket prom. ${formatearPesos(Math.round(diaConVentas.ticketPromedio))}`
  );
  console.log(
    `Fecha ${diaSinVentas.fecha} (sin ventas): ${diaSinVentas.transacciones} trans. | ${diaSinVentas.unidades} uds. | Total ${formatearPesos(diaSinVentas.total)} | Ticket prom. ${formatearPesos(Math.round(diaSinVentas.ticketPromedio))}`
  );

  console.log("\n--- 6. CLIENTES RECURRENTES ---");
  console.log(
    `Total recurrentes (${recurrentes.length}): ${recurrentes.slice(0, 15).join(", ")}${recurrentes.length > 15 ? "..." : ""}`
  );

  console.log("\n--- 7. PRODUCTO ESTRELLA POR CIUDAD ---");
  for (const [ciudad, info] of Object.entries(estrellasCiudad)) {
    console.log(
      `- ${ciudad}: ${info.producto} (${info.apariciones.toLocaleString("es-CO")} apariciones)`
    );
  }

  console.log("\n--- 8. COMBO DE REGALO SUGERIDO ($87.000) ---");
  if (combo87k) {
    console.log(
      `- ${combo87k[0].producto} (${formatearPesos(combo87k[0].precio)}) + ${combo87k[1].producto} (${formatearPesos(combo87k[1].precio)}) = ${formatearPesos(combo87k[0].precio + combo87k[1].precio)}`
    );
  } else {
    console.log("- Sin combinación exacta disponible");
  }

  console.log("\n--- 9. CLIENTE PARA CUPÓN (PRIMER CLIENTE ÚNICO) ---");
  console.log(`- Cliente seleccionado: ${clienteCupon || "Ninguno"}`);

  console.log("\n--- 10. MEJOR SEMANA DE VENTAS ---");
  if (semanaTop) {
    const unidadEtiqueta = esSintetico ? "miles COP (serie diaria)" : "miles COP (muestra base)";
    console.log(
      `- Inicia en día/posición ${semanaTop.diaInicio} (ventana de ${ventanaK} días): Total ${semanaTop.total.toLocaleString("es-CO")} ${unidadEtiqueta}`
    );
  } else {
    console.log("- Datos insuficientes para calcular ventana semanal");
  }

  console.log("\n----------------------------------------------------------");
  console.log(`Tiempo total de ejecución del reporte: ${tTotalMs.toFixed(2)} ms`);
  console.log("==========================================================");
}

if (require.main === module) {
  ejecutarReporte();
}

module.exports = { ejecutarReporte };