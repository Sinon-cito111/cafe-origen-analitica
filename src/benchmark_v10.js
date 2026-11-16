const { performance } = require("perf_hooks");
const catalogo = require("./catalogo");
const { generarVentas } = require("./generador");
const {
  totalVendidoM,
  unidadesVendidasM,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  totalCiudadUnaPasada,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  clientesRecurrentes,
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

function ejecutarFlujoV01(datos) {
  totalVendidoM(datos);
  unidadesVendidasM(datos);
  ventaMayor(datos);
  ticketPromedio(datos);
  totalPorCiudad(datos);
  unidadesPorProducto(datos);
  topProductosPorValor(datos, 3);
  ventasDelDia(datos, "2026-09-01");
  ventasDelDia(datos, "2026-09-31");
  clientesRecurrentes(datos); // Cuello de botella O(n^2) incorporado antes de v1.0
}

function ejecutarFlujoV10(datos) {
  totalVendidoM(datos);
  unidadesVendidasM(datos);
  ventaMayor(datos);
  ticketPromedio(datos);
  totalPorCiudad(datos);
  totalCiudadUnaPasada(datos, "Medellín");
  unidadesPorProducto(datos);
  topProductosPorValor(datos, 3);
  ventasDelDia(datos, "2026-09-01");
  ventasDelDia(datos, "2026-09-31");
  clientesRecurrentesSet(datos);
  productoEstrellaPorCiudad(datos);
  comboRegalo(catalogo, 87000);
  primerClienteUnico(datos);
  mejorSemana(ventasDiariasSeptiembre, 7);
}

// Calentamiento del motor V8
const warmup = generarVentas(300);
ejecutarFlujoV01(warmup);
ejecutarFlujoV10(warmup);

const tamanos = [10000, 100000];
const comparativa = [];

for (const n of tamanos) {
  const datos = generarVentas(n);

  const t0V01 = performance.now();
  ejecutarFlujoV01(datos);
  const msV01 = performance.now() - t0V01;

  const t0V10 = performance.now();
  ejecutarFlujoV10(datos);
  const msV10 = performance.now() - t0V10;

  const mejora = (msV01 / msV10).toFixed(1) + "x más rápido";

  comparativa.push({
    "n (ventas)": n.toLocaleString("es-CO"),
    "Reporte v0.1 (con O(n²))": `${msV01.toFixed(2)} ms`,
    "Reporte v1.0 (todo O(n))": `${msV10.toFixed(2)} ms`,
    "Aceleración": mejora
  });
}

console.log("=== BENCHMARK INTEGRAL: REPORTE v0.1 VS. REPORTE v1.0 ===");
console.table(comparativa);