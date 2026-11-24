


const catalogo = [
  { producto: "Origen Nariño 250 g", precio: 26000 },
  { producto: "Origen Huila 500 g", precio: 42000 },
  { producto: "Origen Sierra 500 g", precio: 45000 },
  { producto: "Filtros de papel x100", precio: 18000 },
  { producto: "Taza de cerámica", precio: 35000 },
  { producto: "Origen Huila 1 kg", precio: 79000 },
  { producto: "Prensa francesa", precio: 95000 },
  { producto: "Molino manual", precio: 120000 },
];


function comboRegalo(catalogo, valor){
    for (let i = 0; i < catalogo.length; i++){
        for (let j = i + 1; j < catalogo.length; j++){
            if(catalogo[i].precio + catalogo[j].precio === valor){
                return [catalogo[i].producto, catalogo[j].producto];
            }
        }
    }
    return null;
}



function comboRegaloMap(catalogo, valor){
    const vistos = new Map();

    for (const item of catalogo){
        const complemento = valor - item.precio;

        if (vistos.has(complemento)){
            return [vistos.get(complemento), item.producto];
        }
        vistos.set(item.precio, item.producto);
    }
    return null;
}

console.log("\n=== PRUEBAS COMBO REGALO ===");
console.log(`\nCombo $87.000: ${comboRegalo(catalogo, 87000)}`);
console.log(`Combo $87.000 (Map): ${comboRegaloMap(catalogo, 87000)}`);
console.log(`\nCombo $61.000: ${comboRegalo(catalogo, 61000)} `);
console.log(`Combo $61.000 (Map): ${comboRegaloMap(catalogo, 61000)} `);
console.log(`\nCombo $50.000: ${comboRegalo(catalogo, 50000)}`);
console.log(`Combo $50.000 (Map): ${comboRegalo(catalogo, 50000)}`);


module.exports = {catalogo};