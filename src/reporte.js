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
    topProductosPorValor
} = require('./analitica');


console.log("=============================");
console.log("=== Reporte de ventas ===")
console.log("=============================");

console.log("\n=============================");
console.log("\nResumen general ");

console.log("\nTotal vendido: ", totalVendidoM(ventas));
console.log("\nTotal unidades vendidas: ", unidadesVendidasM(ventas));
console.log("\nVenta mayor: ", ventaMayorM(ventas));
console.log("\nTicket promedio: ", ticketPromedioM(ventas));
console.log("=============================");

console.log("\n=============================");
console.log("\nVentas por ciudad ");
console.log("\nVentas por ciudad: ", ventasPorCiudadM(ventas));
console.log("=============================");


console.log("\n=============================");
console.log("\nUnidades por prodcucto ");
console.log("\nUnidades por producto: ", unidadesPorProducto(ventas));
console.log("=============================");


console.log("\n=============================");
console.log("\nTop 3 productos más vendidos ");
console.log("\nTop 3 productos más vendidos: ", unidades(ventas));






