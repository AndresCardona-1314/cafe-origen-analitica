const ventas = require('./datos');
const { generarVentas } = require('./generador');

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
    ventasPorCiudadM,
    topProductosPorValor,
    totalPorCiudad,
    ventasDelDia
} = require('./analitica');

const { clientesRecurrentes } = require('./recurrentes');

const {
    clientesRecurrentesSet,
    clientesRecurrentesMap
} = require('./optimizadas');

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





// Errores reportados

const ciudadesPrueba = [
    {ciudad: "Bogotá", producto: "Origen Huila 500 g", cantidad: 2, precio: 42000},
    {ciudad: "BOGOTÁ", producto: "Origen Huila 500 g", cantidad: 1, precio: 42000},
    {ciudad: "BoGotá ", producto: "Origen Huila 500 g", cantidad: 3, precio: 42000}
]

console.log(`\nDemostración de corrección de errores
    
    \n`, totalPorCiudad(ciudadesPrueba));

const diaSinVentas = ventasDelDia(ventas, "2026-09-07");
console.log(`Ticket promedio de un día sin ventas: `, ticketPromedioM(diaSinVentas));


// ============================================================================
// Verificación de clientes recurrentes (Original vs Set vs Map)
// ============================================================================
function verificarRecurrentes(dataset, etiqueta) {
    const resOriginal = [...clientesRecurrentes(dataset)].sort();
    const resSet = [...clientesRecurrentesSet(dataset)].sort();
    const resMap = [...clientesRecurrentesMap(dataset)].sort();

    const coinciden =
        JSON.stringify(resOriginal) === JSON.stringify(resSet) &&
        JSON.stringify(resSet) === JSON.stringify(resMap);

    console.log(`[${etiqueta}] ¿Las 3 versiones coinciden?: ${coinciden ? "OK (SÍ)" : "ERROR (NO)"}`);
    if (etiqueta === "Día 1 (12 ventas)") {
        console.log("   Clientes recurrentes detectados:", resSet);
    }
    console.assert(coinciden, `ERROR: Discrepancia detectada en ${etiqueta}`);
}

console.log("\n=== 4. CONSISTENCIA DE CLIENTES RECURRENTES (ORIGINAL vs SET vs MAP) ===");
verificarRecurrentes(ventas, "Día 1 (12 ventas)");
verificarRecurrentes(generarVentas(5000), "Sintético (5.000 ventas)");


