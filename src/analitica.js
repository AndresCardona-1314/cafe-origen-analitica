// Se importa el arreglo de objetos

const ventas = require('./datos');



const valorVenta = (venta) => venta.cantidad * venta.precio;

// Se normaliza el texto

const normalizar = (texto) => texto.trim().toLowerCase();

const { catalogo } = require('./catalogo');

module.exports.normalizar = normalizar;

const { generarVentas } = require('./generador');

// Total vendido

function totalVendido(ventas) {
    let total = 0;
    for (const v of ventas){
        total += valorVenta(v);
    } 
    return total;
}


// Unidades 

function unidadesVendidas(ventas){
    let totalUnidades = 0;
    for (const v of ventas){
        if (v.cantidad > 0){
            totalUnidades += v.cantidad;
        }
    }
    return totalUnidades;
}


// Venta mayor

function ventaMayor(ventas){
    if(ventas.length === 0){
        return null;
    } 
    let mayor = ventas [0];
    for (const v of ventas) {
        if (valorVenta(v) > valorVenta(mayor)){
            mayor = v;
        } 
    }
    return mayor;
}


// Ticket promedio

function ticketPromedio(ventas){
    let totalVentas = 0;
    let cantidadVentas = 0;
    for(const v of ventas){
        if (v.cantidad > 0){
            totalVentas += valorVenta(v);
            cantidadVentas ++;
        }
    } 

    if (cantidadVentas > 0){
        return totalVentas / cantidadVentas;      

        
    }
    else {
        
        return 0;
    }
}

// Ventas por ciudad

function ventasPorCiudad(ventas, ciudad){
    let total = 0;
    for (const v of ventas) {
        if (normalizar(v.ciudad) === normalizar(ciudad)){
            total += valorVenta(v);
        } 
    }
    return total;
}


// ============================================================================
// 5. PRUEBAS CON TRES ENTRADAS Y DOCUMENTACIÓN DE ARREGLO VACÍO
// ============================================================================
/*
DOCUMENTACIÓN DE COMPORTAMIENTO CON ARREGLO VACÍO ([]):
- totalVendido([]): Devuelve 0 (elemento neutro de la suma; sin ventas el ingreso es $0).
- unidadesVendidas([]): Devuelve 0 (sin transacciones se vendieron 0 unidades).
- ventaMayor([]): Devuelve null (representa explícitamente la ausencia de un objeto/registro).
- ticketPromedio([]): Devuelve 0 (evita la división por cero 0/0 que produciría NaN).
- ventasPorCiudad([], "Medellín"): Devuelve 0 (no hay ingresos registrados en esa ciudad).
*/


const unElemento = [ventas[0]];
const vacio = [];


console.log("=== 1. PRUEBA CON ARREGLO COMPLETO ===");
console.log("Total vendido:", totalVendido(ventas));
console.log("Unidades vendidas:", unidadesVendidas(ventas));
console.log("Venta mayor:", ventaMayor(ventas));
console.log("Ticket promedio:", ticketPromedio(ventas));
console.log("Ventas Medellín (con espacios/minúsculas):", ventasPorCiudad(ventas, "  medellín "));

console.log("\n=== 2. PRUEBA CON UN SOLO ELEMENTO ===");
console.log("Total vendido:", totalVendido(unElemento));
console.log("Unidades vendidas:", unidadesVendidas(unElemento));
console.log("Venta mayor:", ventaMayor(unElemento));
console.log("Ticket promedio:", ticketPromedio(unElemento));
console.log("Ventas Medellín:", ventasPorCiudad(unElemento, "Medellín"));

console.log("\n=== 3. PRUEBA CON ARREGLO VACÍO ===");
console.log("Total vendido:", totalVendido(vacio));
console.log("Unidades vendidas:", unidadesVendidas(vacio));
console.log("Venta mayor:", ventaMayor(vacio));
console.log("Ticket promedio:", ticketPromedio(vacio));
console.log("Ventas Medellín:", ventasPorCiudad(vacio, "Medellín"));


function totalVendidoM(ventas){
    return ventas.reduce((acc,v) => acc + valorVenta(v), 0);
}

function unidadesVendidasM(ventas){
    return ventas
        .filter((v) => v.cantidad > 0)
        .reduce((acc,v) => acc + v.cantidad, 0);
}

function ventasPorCiudadM(ventas, ciudad){
    return ventas
        .filter((v) => normalizar(v.ciudad) === normalizar(ciudad))
        .reduce((acc, v) => acc + valorVenta(v), 0)
}


function ventaMayorM(ventas){
    let mayor = ventas [0];
    if (ventas.length === 0) {
        return null;
    } 
    
    return ventas.reduce((mayor,v) => (valorVenta(v) > valorVenta(mayor) ? v : mayor));
    
}

function ticketPromedioM (ventas){
    const validas = ventas.filter((v) => v.cantidad > 0);

    if (validas.length === 0) {
        return 0;
    }

    const total = validas.reduce((acc, v) => acc + valorVenta(v), 0);
    return total / validas.length;
}


console.log("\nTotal vendido M: ", totalVendidoM(ventas));
console.log("\nUnidades vendidas M: ", unidadesVendidasM(ventas));
console.log("\nVentas Medellín (con espacios/minúsculas) M:", ventasPorCiudadM(ventas, "  medellín "));
console.log("\nVenta mayor M: ", ventaMayorM(ventas));
console.log("\nTicket promedio M:", ticketPromedioM(ventas));


function totalPorCiudad(ventas){
    return ventas.reduce((acc,v) => {
        const ciudad = normalizar(v.ciudad);
        acc[ciudad] = (acc[ciudad] || 0) + valorVenta(v);
        return acc;

    }, {});
}

console.log("\nTotal por ciudad: ", totalPorCiudad(ventas));

function unidadesPorProducto(ventas) {
    return ventas
        .filter((v) => v.cantidad > 0)
        .reduce((acc, v) => {
            const producto = normalizar(v.producto);
            acc[producto] = (acc[producto] || 0) + v.cantidad;
            return acc;
        }, {});
}

console.log("\nUnidades por producto: ", unidadesPorProducto(ventas));

function topProductosPorValor(ventas, k) {
    if (ventas.length === 0 || k <= 0) {
        return [];
    }

    
    const totalesPorProducto = ventas
        .filter((v) => v.cantidad > 0)
        .reduce((acc, v) => {
            const producto = normalizar(v.producto);
            acc[producto] = (acc[producto] || 0) + valorVenta(v);
            return acc;
        }, {});

    
    return Object.entries(totalesPorProducto)
        .map(([producto, total]) => ({ producto, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, k);
}

console.log("\nTop productos: ", topProductosPorValor(ventas,3));


function ventasDelDia (ventas, fecha){
    
    return ventas.filter((v) => normalizar(v.fecha) === normalizar(fecha) && v.cantidad > 0);
    
  
    
}


console.log("\nVenta día: ", ventasDelDia(ventas,"2026-09-06"));



/* function totalCiudadCadena(ventas, ciudad){
    const objetivo = normalizar(ciudad);

    return ventas
        .map((v) => ({...v, ciudad: normalizar(v.ciudad)}))
        .filter((v) => v.ciudad === objetivo && v.cantidad > 0)
        .map((v) => valorVenta(v))
        .reduce((acc, subtotal) => acc + subtotal, 0);
}

console.log(`\nTotal de Medellín: ${totalCiudadCadena(ventas, "Medellín")}`); */

function totalCiudadUnaPasada(ventas, ciudad){
    const objetivo = normalizar(ciudad);
    let total = 0;

    for (const v of ventas){
        if (v.cantidad > 0 && normalizar(v.ciudad) === objetivo){
            total += valorVenta(v);
        }
    }
    return total;
}

console.log(`\nTotal Medellín una pasada: ${totalCiudadUnaPasada(ventas, "Medellín")}`);

// ============================================================================
// Verificación con 10.000 ventas generadas
// ============================================================================
/* const datos10k = generarVentas(10000);
const resCadena = totalCiudadCadena(datos10k, "  MEDELLÍN ");
const resUnaPasada = totalCiudadUnaPasada(datos10k, "  MEDELLÍN ");

console.log(`\ntotalCiudadCadena (n = 10.000):    $${resCadena.toLocaleString("es-CO")}`);
console.log(`totalCiudadUnaPasada (n = 10.000): $${resUnaPasada.toLocaleString("es-CO")}`);
console.assert(resCadena === resUnaPasada, "ERROR: Los resultados no coinciden");
console.log("Verificación exitosa: ambas devuelven exactamente el mismo valor."); */


function productoEstrellaPorCiudad(ventas){
    const conteoPorCiudad = new Map();

    for (const v of ventas){
        if (v.cantidad <= 0) continue;

        const ciudadLimpia = normalizar(v.ciudad);
        const ciudadTitulo = ciudadLimpia.charAt(0).toUpperCase() + ciudadLimpia.slice(1);
        const producto = v.producto.trim();

        if (!conteoPorCiudad.has(ciudadTitulo)){
            conteoPorCiudad.set(ciudadTitulo, new Map());
        }

        const mapaProductos = conteoPorCiudad.get(ciudadTitulo);
        const actual = mapaProductos.get(producto) || {apariciones: 0, unidades: 0};

        mapaProductos.set(producto, {
            apariciones: actual.apariciones + 1,
            unidades: actual.unidades + v.cantidad
        });
    }

    const estrellas = {};

    for (const [ciudad, mapaProductos] of conteoPorCiudad.entries()){
        let productoEstrella = null;
        let maxApariciones = 0;
        let maxUnidades = 0

        for (const [producto, stats] of mapaProductos.entries()){
            const superaApariciones = stats.apariciones > maxApariciones;
            const superaUnidades = stats.apariciones === maxApariciones && stats.unidades > maxUnidades;
            
            if (superaApariciones || superaUnidades){
                maxApariciones = stats.apariciones;
                maxUnidades = stats.unidades;
                productoEstrella = producto;
            }
        }

        estrellas[ciudad] = {
            producto: productoEstrella,
            apariciones: maxApariciones,
            cantidad: maxUnidades
        };
    }

    return estrellas;
}

console.log(`\nProducto estrella por ciudad: `);
console.table(productoEstrellaPorCiudad(ventas));

function primerClienteUnico(ventas){
    const frecuencias = new Map();

    for (const v of ventas){
        const cliente = v.cliente.trim();
        frecuencias.set(cliente, (frecuencias.get(cliente) || 0) + 1);

    }

    for (const v of ventas){
        const cliente = v.cliente.trim();
        if (frecuencias.get(cliente) === 1){
            return cliente;
        }
    }
    return null;
}

console.log(`\nPrimer cliente único: ${primerClienteUnico(ventas)}`);



const ventasDiarias = [320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
710, 380, 360, 440, 500, 590, 650, 720, 400, 370];


function mejorSemanaBruta(dias, k){
    if (k <= 0 || k > dias.length) return null;
    let maxTotal = -Infinity;
    let diaInicio = -1;

    for (let i = 0; i <= dias.length - k; i++){
        let total = 0;
        for (let j = i; j < i + k; j++){
            total = total + dias[j];
        }
        if (total > maxTotal){
            maxTotal = total;
            diaInicio = i;
        }

    }
    return {total: maxTotal, inicio: diaInicio};
}

/* console.log(`\nMejor semana:  `, mejorSemanaBruta(ventasDiarias,7)); */


function mejorSemana(dias, k){
    if (k <= 0 || k > dias.length) return null;

    let totalActual = 0;

    for (let j = 0; j < k; j++){
        totalActual = totalActual + dias[j];

    }

    let maxTotal = totalActual;
    let diaInicio = 0;

    for (let i = k; i < dias.length; i++){
        totalActual = totalActual + dias[i] - dias[i - k];
        
        if (totalActual > maxTotal){
            maxTotal = totalActual;
            diaInicio = i - k + 1;
        }
    }

    return {total: maxTotal, inicio: diaInicio};


}

/* console.log(`\nMejor semana (ventanas):  `, mejorSemanaBruta(ventasDiarias,7)); */

// ============================================================================
// Verificación en septiembre y con 100.000 días
// ============================================================================

console.log("\n=== SEPTIEMBRE (30  días, k=7) ===");
console.log("Mejor semana (bruta): ", mejorSemanaBruta(ventasDiarias, 7));
console.log("Mejor semana (ventana): ", mejorSemana(ventasDiarias, 7));


const dias100k = Array.from({length: 100000}, () => Math.floor(Math.random() * 601) + 200);  

console.log("\n=== BENCHMARK: 100.000 DÍAS (k = 1.000) ===");
let t0 = performance.now();
const resB = mejorSemanaBruta(dias100k, 1000);
let t1 = performance.now();

let t2 = performance.now();
const resV = mejorSemana(dias100k, 1000);
let t3 = performance.now();

console.assert(JSON.stringify(resB) === JSON.stringify(resV), "ERROR: Resultados distintos");
console.log(`Mejores k ventas (bruta): ${(t1 - t0).toFixed(3)} ms ->`, resB);
console.log(`Mejores k ventas (ventana): ${(t3 - t2).toFixed(3)} ms ->`, resV);

function parMasCercano(precios, presupuesto){
    if (precios.length < 2) return null;

    const preciosOrdenados = [...precios].sort((a, b) => a.precio - b.precio);

    let punteroIzq = 0;
    let punteroDer = preciosOrdenados.length - 1;
    let mejorSuma = -1;
    let mejorPar = null;

    while(punteroIzq < punteroDer){
        const sumaActual = preciosOrdenados[punteroIzq].precio + preciosOrdenados[punteroDer].precio;

        if (sumaActual <= presupuesto){
            if (sumaActual > mejorSuma){
                mejorSuma = sumaActual;
                mejorPar = [preciosOrdenados[punteroIzq], preciosOrdenados[punteroDer]];

            }

            if (sumaActual === presupuesto) break;

            punteroIzq++;

        }

        else{
            punteroDer--;
        }
    }

    return mejorPar;

}

// ============================================================================
// Pruebas con 100.000, 140.000 y 40.000
// ============================================================================
console.log("\n=== PRUEBAS PAR MÁS CERCANO AL PRESUPUESTO ===");
console.log("Presupuesto $100.000:", parMasCercano(catalogo, 100000));
console.log("Presupuesto $140.000:", parMasCercano(catalogo, 140000));
console.log("Presupuesto $40.000: ", parMasCercano(catalogo, 40000));


module.exports = {
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
    ventasDelDia,
    totalPorCiudad,
    unidadesPorProducto,
    topProductosPorValor,
    normalizar,
    productoEstrellaPorCiudad,
    primerClienteUnico,
    parMasCercano,
    mejorSemana,
    ventasDiarias
    
};





