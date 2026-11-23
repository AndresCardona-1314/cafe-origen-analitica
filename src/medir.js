const { performance } = require('perf_hooks');

const {
    generarVentas
} = require('./generador');

const {
    totalVendidoInst,
    ventaMayorInst,
    totalPorCiudadInst,
    primeraVentaInst
} = require('./instrumentadas');

const { clientesRecurrentes } = require('./recurrentes');

const {
    clientesRecurrentesSet,
    clientesRecurrentesMap
} = require('./optimizadas');

function medirEjecucion(fnInstrumentada, datos) {
    const contador = { operaciones: 0 };
    
    const inicio = performance.now();
    fnInstrumentada(datos, contador);
    const fin = performance.now();
    
    const tiempoMs = (fin - inicio).toFixed(3); 
    return `${contador.operaciones.toLocaleString("es-CO")} ops (${tiempoMs} ms)`;
}

const n = [100, 1000, 10000, 100000];

const resultado = [];

for (const v of n) {
    
    const datosPrueba = generarVentas(v);

    
    resultado.push({
        n: v,
        totalVendido: medirEjecucion(totalVendidoInst, datosPrueba),
        ventaMayor: medirEjecucion(ventaMayorInst, datosPrueba),
        totalPorCiudad: medirEjecucion(totalPorCiudadInst, datosPrueba),
        primeraVenta: medirEjecucion(primeraVentaInst, datosPrueba)
    });
}

console.log("=== NÚMERO DE OPERACIONES POR TAMAÑO DE ENTRADA (n) ===");
console.table(resultado);


// ============================================================================
// Comparativa de tiempos O(n²) vs Set O(n) vs Map O(n)
// ============================================================================
function medirTiempoMs(fn, datos) {
    const inicio = performance.now();
    fn(datos);
    const fin = performance.now();
    return `${(fin - inicio).toFixed(3)} ms`;
}


const tablaTiempos = [];

for (const v of n) {
    const datosPrueba = generarVentas(v);

    tablaTiempos.push({
        n: v.toLocaleString("es-CO"),
        "Original O(n²)": medirTiempoMs(clientesRecurrentes, datosPrueba),
        "Set O(n)": medirTiempoMs(clientesRecurrentesSet, datosPrueba),
        "Map O(n)": medirTiempoMs(clientesRecurrentesMap, datosPrueba)
    });
}

console.log("\n=== TIEMPOS: clientesRecurrentes O(n²) vs O(n) ===");
console.table(tablaTiempos);