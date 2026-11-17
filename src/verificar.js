const ventas = require('./datos');

const {
    totalVendido,
    totalVendidoM,
    unidadesVendidas,
    unidadesVendidasM,
    ventaMayor,
    ventaMayorM,
    ticketPromedio,
    ticketPromedioM,
    ventasPorCiudad,
    ventasPorCiudadM
} = require('./analitica');

function verificarPar(nombre, valorCiclo, valorMetodo) {
    const sonIguales = JSON.stringify(valorCiclo) === JSON.stringify(valorMetodo);
    const estado = sonIguales ? "OK" : "DIFERENTE";
    console.log(`${nombre}: ${estado}`);
}

console.log("=== VERIFICACIÓN CON DATASET COMPLETO ===");
verificarPar("totalVendido", totalVendido(ventas), totalVendidoM(ventas));
verificarPar("unidadesVendidas", unidadesVendidas(ventas), unidadesVendidasM(ventas));
verificarPar("ventaMayor", ventaMayor(ventas), ventaMayorM(ventas));
verificarPar("ticketPromedio", ticketPromedio(ventas), ticketPromedioM(ventas));
verificarPar("ventasPorCiudad (Medellín)", ventasPorCiudad(ventas, "medellín"), ventasPorCiudadM(ventas, "medellín"));

console.log("\n=== VERIFICACIÓN CON ARREGLO VACÍO ([]) ===");
verificarPar("totalVendido []", totalVendido([]), totalVendidoM([]));
verificarPar("unidadesVendidas []", unidadesVendidas([]), unidadesVendidasM([]));
verificarPar("ventaMayor []", ventaMayor([]), ventaMayorM([]));
verificarPar("ticketPromedio []", ticketPromedio([]), ticketPromedioM([]));
verificarPar("ventasPorCiudad []", ventasPorCiudad([], "Bogotá"), ventasPorCiudadM([], "Bogotá"));