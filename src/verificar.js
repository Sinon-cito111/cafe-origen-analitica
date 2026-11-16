const ventas = require("./datos");
const {
  totalVendido,
  totalVendidoM,
  unidadesVendidas,
  unidadesVendidasM,
  ventasPorCiudad,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor
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

console.log("\n=== NUEVOS INDICADORES PARA LA GERENCIA ===");
console.log("Total por ciudad:", totalPorCiudad(ventas));
console.log("Unidades por producto:", unidadesPorProducto(ventas));
console.log("Top 3 productos por dinero generado:", topProductosPorValor(ventas, 3));