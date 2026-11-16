const { performance } = require("perf_hooks");
const catalogo = require("./catalogo");
const {
  mejorSemanaBruta,
  mejorSemana,
  parMasCercano
} = require("./analitica");

const ventasDiarias = [
  320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
  480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
  710, 380, 360, 440, 500, 590, 650, 720, 400, 370
];

// ==========================================
// PASO 4: MEJOR SEMANA (SEPTIEMBRE Y 100.000 DÍAS)
// ==========================================
console.log("=== 1. MEJOR SEMANA DE SEPTIEMBRE (k = 7) ===");
const resSepBruta = mejorSemanaBruta(ventasDiarias, 7);
const resSepVentana = mejorSemana(ventasDiarias, 7);

console.log("Fuerza bruta:     ", resSepBruta);
console.log("Ventana deslizante:", resSepVentana);
console.log(
  `La mejor semana inicia en el índice ${resSepVentana.diaInicio} (día ${resSepVentana.diaInicio + 1} de septiembre) con $${resSepVentana.totalMaximo} mil.`
);

// Prueba con 100.000 días generados al azar
const n = 100000;
const diasAleatorios = Array.from({ length: n }, () => Math.floor(Math.random() * 800) + 100);

const t0Bruta = performance.now();
const res100kBruta = mejorSemanaBruta(diasAleatorios, 7);
const msBruta = performance.now() - t0Bruta;

const t0Ventana = performance.now();
const res100kVentana = mejorSemana(diasAleatorios, 7);
const msVentana = performance.now() - t0Ventana;

console.log("\n=== 2. COMPARATIVA CON 100.000 DÍAS ALEATORIOS ===");
console.log(
  "¿Coinciden los resultados?",
  res100kBruta.totalMaximo === res100kVentana.totalMaximo &&
  res100kBruta.diaInicio === res100kVentana.diaInicio
    ? "OK (Exactos)"
    : "DIFERENTE"
);
console.log(`Tiempo mejorSemanaBruta: ${msBruta.toFixed(2)} ms`);
console.log(`Tiempo mejorSemana:      ${msVentana.toFixed(2)} ms`);

// ==========================================
// PASO 6: PAR MÁS CERCANO AL PRESUPUESTO
// ==========================================
console.log("\n=== 3. COMBO CORPORATIVO MÁS CERCANO AL PRESUPUESTO ===");
for (const presupuesto of [100000, 140000, 40000]) {
  const res = parMasCercano(catalogo, presupuesto);
  console.log(`\nPresupuesto: $${presupuesto.toLocaleString("es-CO")}`);
  if (res) {
    console.log(
      `  Combinación: ${res.productos[0].producto} ($${res.productos[0].precio.toLocaleString("es-CO")}) + ` +
      `${res.productos[1].producto} ($${res.productos[1].precio.toLocaleString("es-CO")}) = $${res.total.toLocaleString("es-CO")}`
    );
  } else {
    console.log("  Combinación: null (ningún par cabe en el presupuesto)");
  }
}