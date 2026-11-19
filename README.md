# Café Origen: análisis de ventas

## ¿Qué es este proyecto?

Es un proyecto de análisis de ventas hecho con JavaScript y Node.js. Usa un conjunto de registros de ventas de Café Origen, almacenado en `src/datos.js`, para calcular indicadores y generar reportes en la terminal. Incluye ejemplos de cálculos con ciclos y con métodos de arreglos.

## Requisitos

- Node.js instalado.
- No se requieren dependencias externas.

## ¿Cómo ejecutarlo?

Abre una terminal en la carpeta raíz del proyecto y ejecuta:

```bash
node src/reporte.js
```

Este comando muestra el reporte general, las ventas de fechas seleccionadas, los totales por ciudad, las unidades por producto y los tres productos con mayor valor vendido.

Otros comandos disponibles:

```bash
node src/explorar.js
node src/verificar.js
```

- `src/explorar.js` muestra los registros y algunos datos del conjunto de ventas.
- `src/verificar.js` compara los resultados de las implementaciones con ciclos y métodos de arreglos, e incluye casos con arreglos vacíos y días sin ventas.

## ¿Qué preguntas responde?

- ¿Cuál es el valor total vendido?
- ¿Cuántas unidades se vendieron?
- ¿Cuál es el ticket promedio por compra válida?
- ¿Cuál fue la venta de mayor valor?
- ¿Qué ventas se registraron en una fecha específica?
- ¿Cuál es el valor total de ventas por ciudad?
- ¿Cuántas unidades se vendieron de cada producto?
- ¿Qué tres productos acumularon el mayor valor vendido?