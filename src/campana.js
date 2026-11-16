const catalogo = require("./catalogo");
const ventas = require("./datos");
const {
  comboRegaloBruta,
  comboRegalo,
  productoEstrellaPorCiudad,
  primerClienteUnico
} = require("./analitica");

console.log("=== 1. PRUEBAS DE COMBO TARJETA REGALO ===");
for (const valor of [87000, 61000, 50000]) {
  const resBruta = comboRegaloBruta(catalogo, valor);
  const resOpt = comboRegalo(catalogo, valor);

  console.log(`\nValor tarjeta: $${valor.toLocaleString("es-CO")}`);
  console.log("  Fuerza bruta:", resBruta ? `${resBruta[0].producto} + ${resBruta[1].producto}` : null);
  console.log("  Optimizada:  ", resOpt ? `${resOpt[0].producto} + ${resOpt[1].producto}` : null);
}

console.log("\n=== 2. PRODUCTO ESTRELLA POR CIUDAD (DATOS DÍA 1) ===");
console.log(productoEstrellaPorCiudad(ventas));

console.log("\n=== 3. PRIMER CLIENTE ÚNICO DE LA TEMPORADA ===");
console.log("Cliente seleccionado para cupón:", primerClienteUnico(ventas));