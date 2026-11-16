const ventas = require("./datos");

console.log("Cantidad de registros:", ventas.length);
console.log("Primer registro:", ventas[0]);
console.log("Último registro:", ventas[ventas.length - 1]);
console.log("Producto en la posición 4:", ventas[4].producto);

console.log("\nTabla completa de ventas:");
console.table(ventas);