function valorVenta(venta) {
    return venta.cantidad * venta.precio;
}
//Reto 2;
function totalVendido(ventas) {
    let total = 0;
    for (const venta of ventas) {
        total += valorVenta(venta);
    }
    return total;
}
function unidadesVendidas(ventas) {
    let total = 0;
    for (const venta of ventas) {
        total += venta.cantidad;
    }
    return total;
}
function ventaMayor(ventas) {
    if (ventas.length === 0) {
        return null;
    }
    let mayor = ventas[0];
    for (const venta of ventas) {
        if (valorVenta(venta) > valorVenta(mayor)) {
            mayor = venta;
        }
    }
    return mayor;
}
function ticketPromedio(ventas) {
    let total = 0;
    let cantidadVentas = 0;
    for (const venta of ventas) {
        if (venta.cantidad > 0) {
            total += valorVenta(venta);
            cantidadVentas++;
        }
    }
    if (cantidadVentas === 0) {
        return 0;
    }
    return total / cantidadVentas;
}
function ventasPorCiudad(ventas, ciudad) {
    let total = 0;
    const ciudadBuscada = ciudad.trim().toLowerCase();
    for (const venta of ventas) {
        const ciudadActual = venta.ciudad.trim().toLowerCase();
        if (ciudadActual === ciudadBuscada) {
            total += valorVenta(venta);
        }
    }
    return total;
}
module.exports = {
    valorVenta,
    totalVendido,
    unidadesVendidas,
    ventaMayor,
    ticketPromedio,
    ventasPorCiudad
};

//Reto 3;
function totalVendidoM(ventas) {
    return ventas.reduce((total, venta) => {
        return total + valorVenta(venta);
    }, 0);
}

function unidadesVendidasM(ventas) {
    return ventas.reduce((total, venta) => {
        return total + venta.cantidad;
    }, 0);
}

function ventasPorCiudadM(ventas, ciudad) {
    const ciudadBuscada = ciudad.trim().toLowerCase();
    const filtradas = ventas.filter(venta =>
        venta.ciudad.trim().toLowerCase() === ciudadBuscada
    );
    return filtradas.reduce((total, venta) => {
        return total + valorVenta(venta);
    }, 0);
}

function totalPorCiudad(ventas) {
    return ventas.reduce((acumulador, venta) => {
        const ciudad = venta.ciudad.trim().toLowerCase();
        acumulador[ciudad] =
            (acumulador[ciudad] || 0) + valorVenta(venta);
        return acumulador;
    }, {});
}

function unidadesPorProducto(ventas) {
    return ventas.reduce((acumulador, venta) => {
        const producto = venta.producto;

        acumulador[producto] =
            (acumulador[producto] || 0) + venta.cantidad;

        return acumulador;
    }, {});
}

function topProductosPorValor(ventas, k) {
    const totales = ventas.reduce((acumulador, venta) => {
        const producto = venta.producto;
        acumulador[producto] =
            (acumulador[producto] || 0) + valorVenta(venta);
        return acumulador;
    }, {});
    return Object.entries(totales)
        .map(([producto, total]) => ({ producto, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, k);
}
//Reto 4;
function ventasDelDia(ventas, fecha) {
    const ventasFiltradas = ventas.filter(venta =>
        venta.fecha === fecha && venta.cantidad > 0
    );
    const totalVendido = ventasFiltradas.reduce((total, venta) => {
        return total + valorVenta(venta);
    }, 0);
    const unidades = ventasFiltradas.reduce((total, venta) => {
        return total + venta.cantidad;
    }, 0);
    const cantidadVentas = ventasFiltradas.length;
    const ticketPromedio = cantidadVentas > 0
        ? totalVendido / cantidadVentas
        : 0;
    return {
        fecha,
        cantidadVentas,
        unidades,
        totalVendido,
        ticketPromedio
    };
}