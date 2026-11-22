const ventas = require('./datos');


const {
    normalizar
} = require('./analitica')

const productosPrueba = Array.from(new Set(ventas.map(v => v.producto)));
const preciosPrueba = Array.from(new Set(ventas.map (v => v.precio)));
const ciudadesPrueba = Array.from (new Set(ventas.map(v => normalizar(v.ciudad))));

const azar = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function generarVentas(n){
    const clientes = Math.max(1, Math.floor(n / 3));
    const ventasPrueba = [];

    for (let i = 1; i <= n; i++) {
        const p = productosPrueba[azar(0, productosPrueba.length - 1)];
        ventasPrueba.push({
            id: i, fecha: "2026-09-" + String(azar(1,30)).padStart(2, "0"),
            cliente: "C" + String(azar(1, clientes)).padStart(2,"0"),
            producto: p, ciudad: ciudadesPrueba[azar(0,ciudadesPrueba.length - 1)],
            cantidad: azar(1,5), precio: preciosPrueba[azar(0, preciosPrueba.length - 1)]
        });

    }

    return ventasPrueba;
}

console.table(generarVentas(10));

module.exports = {
    generarVentas
}