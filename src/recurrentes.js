const ventas = require('./datos');

const {
    generarVentas
} = require('./generador');

function clientesRecurrentes(ventas){
    const recurrentes = [];
    for (let i = 0; i < ventas.length; i++){
        for (let j = i + 1; j < ventas.length; j++){
            if (ventas[i].cliente === ventas[j].cliente && !recurrentes.includes(ventas[i].cliente)){
                recurrentes.push(ventas[i].cliente);
            }
        }
    }
    return recurrentes;
    
}

/* console.log('\nClientes recurrentes: ', clientesRecurrentes(ventas));

for (const n of [1000, 2000, 4000, 8000, 16000, 100000]){
    const ventasPrueba = generarVentas(n);
    console.time(`n = ${n.toLocaleString('es-CO')}`);
    clientesRecurrentes(ventasPrueba);
    console.timeEnd(`n = ${n.toLocaleString('es-CO')}`);
} */





