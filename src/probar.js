const ventas = require("./datos");
const {
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad
} = require("./analitica");

const unElemento = [ventas[0]]; // id: 1, cantidad: 2, precio: 42000, ciudad: "Medellín"
const vacio = [];

console.log("=== 1. ARREGLO COMPLETO (12 registros) ===");
console.log("Total vendido:", totalVendido(ventas)); // 985000
console.log("Unidades vendidas:", unidadesVendidas(ventas)); // 22
console.log("Venta mayor:", ventaMayor(ventas)); // Registro id: 10 ($168.000)
console.log("Ticket promedio:", ticketPromedio(ventas)); // 89545.45454545454
console.log("Ventas en Medellín (con espacios y mayúsculas):", ventasPorCiudad(ventas, "  MEDELLÍN ")); // 356000

console.log("\n=== 2. ARREGLO DE UN SOLO ELEMENTO ===");
console.log("Total vendido:", totalVendido(unElemento)); // 84000
console.log("Unidades vendidas:", unidadesVendidas(unElemento)); // 2
console.log("Venta mayor:", ventaMayor(unElemento)); // Registro id: 1
console.log("Ticket promedio:", ticketPromedio(unElemento)); // 84000
console.log("Ventas en Medellín:", ventasPorCiudad(unElemento, "Medellín")); // 84000

console.log("\n=== 3. ARREGLO VACÍO ===");
console.log("Total vendido:", totalVendido(vacio)); // 0
console.log("Unidades vendidas:", unidadesVendidas(vacio)); // 0
console.log("Venta mayor:", ventaMayor(vacio)); // null
console.log("Ticket promedio:", ticketPromedio(vacio)); // 0
console.log("Ventas en Medellín:", ventasPorCiudad(vacio, "Medellín")); // 0