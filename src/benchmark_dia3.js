const { performance } = require("perf_hooks");
const ventasDia1 = require("./datos");
const { generarVentas } = require("./generador");
const {
  clientesRecurrentes,
  clientesRecurrentesSet,
  clientesRecurrentesMap
} = require("./analitica");

function sonIgualesOrdenados(arrA, arrB) {
  if (arrA.length !== arrB.length) return false;
  const ordA = [...arrA].sort();
  const ordB = [...arrB].sort();
  return ordA.every((valor, idx) => valor === ordB[idx]);
}

// ==========================================
// PASO 4: VERIFICACIÓN DE EQUIVALENCIA
// ==========================================
console.log("=== 1. VERIFICACIÓN DE EQUIVALENCIA ===");

const rOrig1 = clientesRecurrentes(ventasDia1);
const rSet1 = clientesRecurrentesSet(ventasDia1);
const rMap1 = clientesRecurrentesMap(ventasDia1);

console.log(
  "Datos Día 1 (12 ventas):",
  sonIgualesOrdenados(rOrig1, rSet1) && sonIgualesOrdenados(rOrig1, rMap1)
    ? `OK -> ${JSON.stringify([...rSet1].sort())}`
    : "DIFERENTE"
);

const ventas5k = generarVentas(5000);
const rOrig5k = clientesRecurrentes(ventas5k);
const rSet5k = clientesRecurrentesSet(ventas5k);
const rMap5k = clientesRecurrentesMap(ventas5k);

console.log(
  `Muestra 5.000 ventas (${rSet5k.length} recurrentes):`,
  sonIgualesOrdenados(rOrig5k, rSet5k) && sonIgualesOrdenados(rOrig5k, rMap5k)
    ? "OK (Idénticos al ordenar)"
    : "DIFERENTE"
);

// ==========================================
// PASO 5: MEDICIÓN DE RENDIMIENTO
// ==========================================
function medirMs(fn, datos) {
  const inicio = performance.now();
  fn(datos);
  return performance.now() - inicio;
}

// Calentamiento del motor V8
clientesRecurrentesSet(generarVentas(200));
clientesRecurrentesMap(generarVentas(200));

const tamanos = [1000, 10000, 100000];
const tabla = [];

for (const n of tamanos) {
  const datos = generarVentas(n);

  // La versión original O(n^2) solo se ejecuta hasta n = 10.000 (en 100.000 tarda >10s)
  const tiempoOriginal =
    n <= 10000 ? `${medirMs(clientesRecurrentes, datos).toFixed(2)} ms` : "Omitido (> 10.000 ms)";
  const tiempoSet = `${medirMs(clientesRecurrentesSet, datos).toFixed(2)} ms`;
  const tiempoMap = `${medirMs(clientesRecurrentesMap, datos).toFixed(2)} ms`;

  tabla.push({
    "n (ventas)": n.toLocaleString("es-CO"),
    "Original O(n²)": tiempoOriginal,
    "Con Set O(n)": tiempoSet,
    "Con Map O(n)": tiempoMap
  });
}

console.log("\n=== 2. COMPARATIVA DE TIEMPOS DE EJECUCIÓN ===");
console.table(tabla);