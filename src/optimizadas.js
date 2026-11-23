const ventas = require('./datos');
const { normalizar } = require('./analitica');


function clientesRecurrentesSet(ventas){
    const vistos = new Set();
    const recurrentes = new Set();

    for (const v of ventas){
        const cliente = v.cliente.trim();
        if (vistos.has(cliente)){
            recurrentes.add(cliente);
        }
        else {
            vistos.add(cliente);
        }
    }
    return [...recurrentes];
}

console.log(`\nClientes recurrentes: ${clientesRecurrentesSet(ventas)}`);


function comprasPorCliente(ventas){
    const compras = new Map();
    for (const v of ventas){
        const cliente = v.cliente.trim();
        compras.set(cliente, (compras.get(cliente) || 0) + 1);
    }
    return compras;
}

function clientesRecurrentesMap(ventas) {
    const compras = comprasPorCliente(ventas);
    const recurrentes = [];

    for (const [cliente, totalCompras] of compras.entries()) {
        if (totalCompras >= 2) {
            recurrentes.push(cliente);
        }
    }
    return recurrentes;
}

console.log(`\nClientes recurrentes Map: ${clientesRecurrentesMap(ventas)}`);



module.exports = {
    clientesRecurrentesSet,
    comprasPorCliente,
    clientesRecurrentesMap
};

