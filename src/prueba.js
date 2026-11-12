const ventas = require("./datos.js");
const {
    valorVenta,
    totalVendido,
    unidadesVendidas,
    ventaMayor,
    ticketPromedio,
    ventasPorCiudad
} = require("./analitica.js");

const ventaUnica = [ventas[0]];
const ventasVacias = [];
console.log("========== ARREGLO COMPLETO ==========");
console.log("Total vendido:", totalVendido(ventas));
console.log("Unidades vendidas:", unidadesVendidas(ventas));
console.log("Venta mayor:", ventaMayor(ventas));
console.log("Ticket promedio:", ticketPromedio(ventas));
console.log("Ventas Medellín:", ventasPorCiudad(ventas, " MEDELLÍN "));
console.log("========== UNA SOLA VENTA ==========");
console.log("Valor venta:", valorVenta(ventaUnica[0]));
console.log("Total vendido:", totalVendido(ventaUnica));
console.log("Unidades vendidas:", unidadesVendidas(ventaUnica));
console.log("Venta mayor:", ventaMayor(ventaUnica));
console.log("Ticket promedio:", ticketPromedio(ventaUnica));
console.log("Ventas Medellín:", ventasPorCiudad(ventaUnica, "Medellín"));
console.log("========== ARREGLO VACÍO ==========");
console.log("Total vendido:", totalVendido(ventasVacias));
console.log("Unidades vendidas:", unidadesVendidas(ventasVacias));
console.log("Venta mayor:", ventaMayor(ventasVacias));
console.log("Ticket promedio:", ticketPromedio(ventasVacias));
console.log("Ventas Medellín:", ventasPorCiudad(ventasVacias, "Medellín"));