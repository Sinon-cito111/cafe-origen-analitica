const ventas = require("./datos.js");

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
} = require("./analitica.js");

function verificar(nombre, resultadoCiclo, resultadoMetodo) {
    console.log(
        nombre,
        resultadoCiclo === resultadoMetodo ? "OK" : "DIFERENTE"
    );
}

verificar(
    "Total vendido:",
    totalVendido(ventas),
    totalVendidoM(ventas)
);
verificar(
    "Unidades vendidas:",
    unidadesVendidas(ventas),
    unidadesVendidasM(ventas)
);
verificar(
    "Ventas por Medellín:",
    ventasPorCiudad(ventas, "Medellín"),
    ventasPorCiudadM(ventas, "Medellín")
);

console.log("\nTOTAL POR CIUDAD:");
console.log(totalPorCiudad(ventas));

console.log("\nUNIDADES POR PRODUCTO:");
console.log(unidadesPorProducto(ventas));

console.log("\nTOP 3 PRODUCTOS POR VALOR:");
console.table(topProductosPorValor(ventas, 3));