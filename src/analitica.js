function valorVenta(venta) {
    return venta.cantidad * venta.precio;
}

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