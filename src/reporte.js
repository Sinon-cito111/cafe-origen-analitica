const ventas = require("./datos.js");

const {
    totalVendido,
    unidadesVendidas,
    ventaMayor,
    ticketPromedio,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    ventasDelDia
} = require("./analitica.js");

// Formato de pesos colombianos
function pesos(valor) {
    return "$ " + valor.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function titulo(texto) {
    console.log("\n" + "=".repeat(55));
    console.log(texto.toUpperCase());
    console.log("=".repeat(55));
}

// RESUMEN GENERAL
titulo("1. Resumen general");

const mayor = ventaMayor(ventas);

console.log("Total vendido:".padEnd(30), pesos(totalVendido(ventas)));
console.log("Unidades vendidas:".padEnd(30), unidadesVendidas(ventas));
console.log("Ticket promedio:".padEnd(30), pesos(ticketPromedio(ventas)));

console.log(
    "Venta más grande:".padEnd(30),
    mayor ? pesos(mayor.cantidad * mayor.precio) : pesos(0)
);

if (mayor) {
    console.log("Producto:".padEnd(30), mayor.producto);
}

// VENTAS POR CIUDAD
titulo("2. Ventas por ciudad");

const ciudades = totalPorCiudad(ventas);

const nombresCiudad = {
    "medellín": "Medellín",
    "bogotá": "Bogotá",
    "cali": "Cali",
    "pereira": "Pereira"
};

for (const [ciudad, total] of Object.entries(ciudades)) {
    console.log(
        (nombresCiudad[ciudad] || ciudad).padEnd(30),
        pesos(total)
    );
}

// UNIDADES POR PRODUCTO
titulo("3. Unidades por producto");

const productos = unidadesPorProducto(ventas);

for (const [producto, unidades] of Object.entries(productos)) {
    console.log(producto.padEnd(35), unidades);
}

// TOP 3 POR VALOR
titulo("4. Top 3 productos por valor");

const top3 = topProductosPorValor(ventas, 3);

top3.forEach((producto, indice) => {
    console.log(
        `${indice + 1}. ${producto.producto}`.padEnd(38),
        pesos(producto.total)
    );
});

// RESUMEN DE DOS DÍAS
titulo("5. Comparación de ventas por día");

const diaConVentas = ventasDelDia(ventas, "2026-09-01");
const diaSinVentas = ventasDelDia(ventas, "2026-09-07");

function mostrarDia(dia) {
    console.log("\nFecha:", dia.fecha);
    console.log("Cantidad de ventas:".padEnd(30), dia.cantidadVentas);
    console.log("Unidades:".padEnd(30), dia.unidades);
    console.log("Total vendido:".padEnd(30), pesos(dia.totalVendido));
    console.log("Ticket promedio:".padEnd(30), pesos(dia.ticketPromedio));
}

mostrarDia(diaConVentas);
mostrarDia(diaSinVentas);

console.log("\n" + "=".repeat(55));
console.log("FIN DEL REPORTE - CAFÉ ORIGEN ANALÍTICA v0.1");
console.log("=".repeat(55));