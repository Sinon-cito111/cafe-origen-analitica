const { generarVentas } = require("./generador");
const { totalCiudadCadena, totalCiudadUnaPasada } = require("./analitica");

const ventas10k = generarVentas(10000);
const ciudadPrueba = "  MEDELLÍN ";

const resCadena = totalCiudadCadena(ventas10k, ciudadPrueba);
const resUnaPasada = totalCiudadUnaPasada(ventas10k, ciudadPrueba);

console.log("=== VERIFICACIÓN CON 10.000 VENTAS ===");
console.log("totalCiudadCadena:   ", resCadena);
console.log("totalCiudadUnaPasada:", resUnaPasada);
console.log("Estado:              ", resCadena === resUnaPasada ? "OK (Idénticos)" : "DIFERENTE");