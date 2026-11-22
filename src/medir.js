const {
    generarVentas
} = require('./generador');

const {
    totalVendidoInst,
    ventaMayorInst,
    totalPorCiudadInst,
    primeraVentaInst
} = require('./instrumentadas');

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