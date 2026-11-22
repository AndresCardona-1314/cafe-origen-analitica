const ventas = require('./datos');

const {
    normalizar,
    valorVenta
} = require('./analitica');
const { generarVentas } = require('./generador');

const contador = { operaciones: 0 };


function totalVendidoInst(ventas, contador) {
    let total = 0;
    for (const v of ventas) {
        contador.operaciones++; 
        total += valorVenta(v);
    }
    return total;
}

/* console.log(`\nTotal vendido: `, totalVendidoInst(generarVentas(10*10), contador) );
console.log(`Operaciones realizadas: `, contador.operaciones); */


function ventaMayorInst(ventas, contador) {
    if (ventas.length === 0) {
        return null;
    }
    let mayor = ventas[0];
    for (const v of ventas) {
        contador.operaciones++; 
        if (valorVenta(v) > valorVenta(mayor)) {
            mayor = v;
        }
    }
    return mayor;
}

/* console.log(`\nVenta mayor: `, ventaMayorInst(generarVentas(10*10), contador) );
console.log(`Operaciones realizadas: `, contador.operaciones); */



function totalPorCiudadInst(ventas, contador) {
    const totales = {};
    for (const v of ventas) {
        contador.operaciones++; 
        if (v.cantidad > 0) {
            const limpia = normalizar(v.ciudad);
            const ciudadTitulo = limpia.charAt(0).toUpperCase() + limpia.slice(1);
            totales[ciudadTitulo] = (totales[ciudadTitulo] || 0) + valorVenta(v);
        }
    }
    return totales;
}

/* console.log(`\nTotal por ciudad: `, totalPorCiudadInst(generarVentas(10*10), contador) );
console.log(`Operaciones realizadas: `, contador.operaciones); */


function primeraVentaInst(ventas, contador) {
    contador.operaciones++; 
    if (ventas.length === 0) {
        return null;
    }
    return ventas[0];
}


module.exports = {
    totalVendidoInst,
    ventaMayorInst,
    totalPorCiudadInst,
    primeraVentaInst
}