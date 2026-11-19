const ventas = require('./datos');

const {
    valorVenta,
    totalVendido,
    totalVendidoM,
    unidadesVendidas,
    unidadesVendidasM,
    ventaMayor,
    ventaMayorM,
    ticketPromedio,
    ticketPromedioM,
    ventasPorCiudad,
    ventasPorCiudadM,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    ventasDelDia
} = require('./analitica');

const fecha1 = "2026-09-04";
const fecha2 = "2026-09-07";

const formatearCOP = (valor) => `$${valor.toLocaleString("es-CO")}`;

console.log(`\n=============================
=== Reporte de ventas ===
=============================`);

console.log(`=============================
Resumen general`);


console.log("\nTotal vendido:", formatearCOP(totalVendidoM(ventas)));
console.log("Total unidades vendidas:", unidadesVendidasM(ventas));
console.log("Ticket promedio:", formatearCOP(ticketPromedioM(ventas)));


const mayor = ventaMayorM(ventas);
console.log("\nVenta mayor:", mayor ? {
    ...mayor,
    precio: formatearCOP(mayor.precio),
    totalVenta: formatearCOP(mayor.cantidad * mayor.precio)
} : "Sin ventas");


const formatearListaVentas = (lista) => {
    if (lista.length === 0) {
        return "No hay ventas registradas en esta fecha";
    }
    return lista.map((v) => ({
        ...v,
        precio: formatearCOP(v.precio),
        subtotal: formatearCOP(v.cantidad * v.precio)
    }));
};

console.log(`\nVentas del ${fecha1}:`, formatearListaVentas(ventasDelDia(ventas, fecha1)));
console.log(`\nVentas del ${fecha2}:`, formatearListaVentas(ventasDelDia(ventas, fecha2)));
console.log("=============================");


console.log("\n=============================");
console.log("Ventas por ciudad:");
const ciudadesFormateadas = Object.fromEntries(
    Object.entries(totalPorCiudad(ventas)).map(([ciudad, total]) => [ciudad, formatearCOP(total)])
);
console.table(ciudadesFormateadas);
console.log("=============================");


console.log("\n=============================");
console.log("Unidades por producto:");
console.table(unidadesPorProducto(ventas));
console.log("=============================");


console.log("\n=============================");
console.log("Top 3 productos más vendidos:");
const topFormateado = topProductosPorValor(ventas, 3).map((item) => ({
    producto: item.producto,
    total: formatearCOP(item.total)
}));
console.log(topFormateado);
console.log("=============================");






