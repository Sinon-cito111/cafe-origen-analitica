const { generarVentas } = require("./generador");
const {
  primeraVenta,
  totalVendidoContado,
  ventaMayorContado,
  totalPorCiudadContado
} = require("./analitica");

const tamanos = [100, 1000, 10000, 100000];
const resultados = [];

for (const n of tamanos) {
  const ventas = generarVentas(n);

  const cPrimera = { ops: 0 };
  primeraVenta(ventas, cPrimera);

  const cTotal = { ops: 0 };
  totalVendidoContado(ventas, cTotal);

  const cMayor = { ops: 0 };
  ventaMayorContado(ventas, cMayor);

  const cCiudad = { ops: 0 };
  totalPorCiudadContado(ventas, cCiudad);

  resultados.push({
    "n (registros)": n,
    "primeraVenta O(1)": cPrimera.ops,
    "totalVendido": cTotal.ops,
    "ventaMayor": cMayor.ops,
    "totalPorCiudad": cCiudad.ops
  });
}

console.log("=== MEDICIÓN DE OPERACIONES BÁSICAS POR TAMAÑO DE ENTRADA ===");
console.table(resultados);