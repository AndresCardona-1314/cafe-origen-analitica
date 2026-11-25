const ventasReales = require('./datos');

const {generarVentas} = require('./generador');

const {catalogo, comboRegaloMap} = require('./catalogo');


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
    ventasDelDia,
    mejorSemana,
    ventasDiarias,
    parMasCercano,
    primerClienteUnico,
    productoEstrellaPorCiudad
} = require('./analitica');

const {
    clientesRecurrentesSet,
    
    
} = require('./optimizadas');


const argCantidad = Number(process.argv[2]);
const esSintetico = Number.isInteger(argCantidad) && argCantidad > 0;
const ventas = esSintetico ? generarVentas(argCantidad) : ventasReales;
const origenDatos = esSintetico
    ? `Dataset Sintético (${argCantidad.toLocaleString("es-CO")} registros)`
    : `Datos Reales Día 1 (${ventas.length} registros)`;

const inicioReporte = performance.now();

const fecha1 = "2026-09-04";
const fecha2 = "2026-09-07";

const formatearCOP = (valor) => `$${valor.toLocaleString("es-CO")}`;

console.log(`\n=============================
=== Reporte de ventas ===
=== Fuente: ${origenDatos}
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


const formatearListaVentas = (lista, limite = 5) => {
    if (lista.length === 0) {
        return "No hay ventas registradas en esta fecha";
    }

    const muestra = lista.slice(0, limite).map((v) => ({
        id: v.id,
        cliente: v.cliente,
        producto: v.producto,
        ciudad: v.ciudad,
        cantidad: v.cantidad,
        precio: formatearCOP(v.precio),
        subtotal: formatearCOP(v.cantidad * v.precio)
    }));

    return {
        totalRegistrosEnFecha: lista.length,
        mostrandoPrimeros: muestra.length,
        muestraVentas: muestra
    };
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

console.log("\n=============================");
console.log("Clientes recurrentes: ");
console.log(clientesRecurrentesSet(ventas));
console.log("=============================");


console.log("\n=============================");
console.log("Producto estrella por ciudad: ");
console.table(productoEstrellaPorCiudad(ventas));
console.log("=============================");

console.log("\n=============================");
console.log("Cliente para cupón de fidelización: ");
const primerCliente = primerClienteUnico(ventas)
console.log(primerCliente || "Ninguno");
console.log("=============================");

console.log("\n=============================");
console.log("Combo regalo: ");
console.log(comboRegaloMap(catalogo, 87000));
console.log("=============================");

console.log("\n=============================");
console.log("Combo más cercano: ");
console.log(parMasCercano(catalogo, 100000));
console.log("=============================");

console.log("\n=============================");
console.log("Mejor semana septiembre: ");
console.log(mejorSemana(ventasDiarias, 7));
console.log("=============================");

const finReporte = performance.now();
console.log(`\n==================================================`);
console.log(`Tiempo total de ejecución v1.0: ${(finReporte - inicioReporte).toFixed(3)} ms`);
console.log(`==================================================\n`);