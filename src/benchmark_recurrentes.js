const { performance } = require("perf_hooks");
const { generarVentas } = require("./generador");
const { clientesRecurrentes } = require("./analitica");

const tamanos = [1000, 2000, 4000, 8000, 16000];
const mediciones = [];

// Calentamiento breve del motor V8
clientesRecurrentes(generarVentas(200));

console.log("=== MEDICIÓN DE TIEMPO: clientesRecurrentes (console.time) ===");
for (const n of tamanos) {
  const ventas = generarVentas(n);
  const etiqueta = `n = ${n.toLocaleString("es-CO")}`;

  const inicio = performance.now();
  console.time(etiqueta);
  clientesRecurrentes(ventas);
  console.timeEnd(etiqueta);
  const fin = performance.now();

  mediciones.push({ n, ms: fin - inicio });
}

console.log("\n=== TABLA DE CRECIMIENTO AL DUPLICAR n ===");
const tabla = mediciones.map((actual, idx) => {
  const anterior = idx > 0 ? mediciones[idx - 1] : null;
  const factor = anterior ? (actual.ms / anterior.ms).toFixed(2) + "x" : "—";
  return {
    "n (ventas)": actual.n.toLocaleString("es-CO"),
    "Tiempo (ms)": actual.ms.toFixed(2),
    "Factor vs n/2": factor
  };
});
console.table(tabla);

// Estimación cuadrática basada en el último punto medido (n = 16.000)
const base = mediciones[mediciones.length - 1];
const est100kMs = base.ms * Math.pow(100000 / base.n, 2);
const est1MMs = base.ms * Math.pow(1000000 / base.n, 2);

console.log("=== ESTIMACIONES POR ESCALAMIENTO CUADRÁTICO O(n²) ===");
console.log(`Estimación para 100.000 ventas: ${(est100kMs / 1000).toFixed(2)} segundos`);
console.log(
  `Estimación para 1.000.000 ventas: ${(est1MMs / 1000).toFixed(2)} segundos (~${(est1MMs / 60000).toFixed(1)} minutos)`
);

// Paso 5: Ejecutar 100.000 SOLO si la estimación es menor a 2 minutos (120.000 ms)
if (est100kMs < 120000) {
  console.log("\nLa estimación para 100.000 es menor a 2 minutos. Ejecutando prueba real...");
  const ventas100k = generarVentas(100000);
  console.time("n = 100.000 (real)");
  clientesRecurrentes(ventas100k);
  console.timeEnd("n = 100.000 (real)");
} else {
  console.log("\nSe omite la ejecución de 100.000 porque supera los 2 minutos estimados.");
}