const ventas = require("./datos");
const {
  totalVendido,
  totalVendidoM,
  unidadesVendidas,
  unidadesVendidasM,
  ventasPorCiudad,
  ventasPorCiudadM
} = require("./analitica");

function comparar(nombre, valorCiclo, valorMetodo) {
  const estado = valorCiclo === valorMetodo ? "OK" : "DIFERENTE";
  console.log(`${nombre}: ${estado} (Ciclo: ${valorCiclo} | Método: ${valorMetodo})`);
}

console.log("=== VERIFICACIÓN DE PARIDAD (CICLOS VS. MÉTODOS) ===");
comparar("Total vendido", totalVendido(ventas), totalVendidoM(ventas));
comparar("Unidades vendidas", unidadesVendidas(ventas), unidadesVendidasM(ventas));
comparar(
  "Ventas Medellín",
  ventasPorCiudad(ventas, "  MEDELLÍN "),
  ventasPorCiudadM(ventas, "  MEDELLÍN ")
);
comparar(
  "Ventas Bogotá",
  ventasPorCiudad(ventas, "Bogotá "),
  ventasPorCiudadM(ventas, "Bogotá ")
);

console.log("\n=== VERIFICACIÓN CON ARREGLO VACÍO ===");
comparar("Total vendido []", totalVendido([]), totalVendidoM([]));
comparar("Unidades vendidas []", unidadesVendidas([]), unidadesVendidasM([]));
comparar("Ventas Cali []", ventasPorCiudad([], "Cali"), ventasPorCiudadM([], "Cali"));