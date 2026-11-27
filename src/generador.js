const CATALOGO = [
  { producto: "Origen Huila 500 g", precio: 42000 },
  { producto: "Origen Nariño 250 g", precio: 26000 },
  { producto: "Origen Sierra 500 g", precio: 45000 },
  { producto: "Prensa francesa", precio: 95000 },
  { producto: "Molino manual", precio: 120000 }
];

const CIUDADES = ["Medellín", "Bogotá", "Cali", "Pereira", "Barranquilla"];

function enteroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarVentas(n) {
  const ventas = [];
  const maxClientes = Math.max(1, Math.floor(n / 3));

  for (let i = 1; i <= n; i++) {
    const item = CATALOGO[enteroAleatorio(0, CATALOGO.length - 1)];
    const ciudad = CIUDADES[enteroAleatorio(0, CIUDADES.length - 1)];
    const numCliente = enteroAleatorio(1, maxClientes);
    const cliente = `C${String(numCliente).padStart(2, "0")}`;
    const cantidad = enteroAleatorio(1, 5);
    const dia = String(enteroAleatorio(1, 28)).padStart(2, "0");

    ventas.push({
      id: i,
      fecha: `2026-09-${dia}`,
      cliente,
      producto: item.producto,
      ciudad,
      cantidad,
      precio: item.precio
    });
  }

  return ventas;
}

module.exports = { generarVentas };