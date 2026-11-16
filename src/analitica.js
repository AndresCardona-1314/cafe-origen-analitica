// Se importa el arreglo de objetos

const ventas = require('./datos');


const valorVenta = (venta) => venta.cantidad * venta.precio;

// Se normaliza el texto

const normalizar = (texto) => texto.trim().toLowerCase();

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



