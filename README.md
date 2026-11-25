# Café Origen — Motor de Analítica Comercial v1.0

## ¿Qué es este proyecto?

Motor de análisis de ventas desarrollado en Node.js. Convierte registros de Café Origen en indicadores comerciales, reportes, sugerencias de combos y análisis de patrones. Usa `Set` y `Map` para resolver en tiempo lineal promedio algunas consultas sobre transacciones; también conserva implementaciones de referencia menos eficientes para comparar su rendimiento. Consulta [RENDIMIENTO.md](./RENDIMIENTO.md) para ver sus complejidades y mediciones.

## Requisitos

- Node.js instalado.
- No se requieren dependencias externas.

## ¿Cómo ejecutarlo?

Abre una terminal en la carpeta raíz del proyecto y ejecuta:

```bash
node src/reporte.js
```

Sin argumentos, usa las ventas de ejemplo de `src/datos.js`. Pasa un entero positivo para generar un conjunto sintético; por ejemplo, 100.000 ventas:

```bash
node src/reporte.js 100000
```

El reporte muestra la fuente y el número de registros; el total vendido, las unidades vendidas, el ticket promedio y la venta de mayor valor; las ventas de `2026-09-04` y `2026-09-07` (hasta cinco filas por fecha); los totales por ciudad y las unidades por producto; los tres productos con mayor valor vendido; los clientes recurrentes y el producto estrella de cada ciudad; el primer cliente único para un cupón; un combo regalo de `$87.000` y el combo del catálogo más cercano a `$100.000`; y la mejor semana de septiembre calculada con los datos diarios de ejemplo. Al final informa el tiempo total de ejecución.

### Verificación y mediciones

```bash
node src/verificar.js
node src/medir.js
```

- `src/verificar.js` compara resultados y revisa casos borde.
- `src/medir.js` compara operaciones y tiempos para distintos tamaños de datos. Incluye la versión original cuadrática de clientes recurrentes hasta 100.000 registros, por lo que puede tardar considerablemente.

Para inspeccionar los registros de ejemplo:

```bash
node src/explorar.js
```

- `src/explorar.js` muestra los registros y algunos datos del conjunto de ventas.

## Estructura del proyecto

```text
.
├── README.md
├── RENDIMIENTO.md
├── bitacora.md
└── src/
    ├── analitica.js
    ├── catalogo.js
    ├── datos.js
    ├── explorar.js
    ├── generador.js
    ├── instrumentadas.js
    ├── medir.js
    ├── optimizadas.js
    ├── recurrentes.js
    ├── reporte.js
    └── verificar.js
```

- `src/analitica.js`: funciones para calcular indicadores, agrupar ventas y resolver análisis como el producto estrella y la mejor semana.
- `src/catalogo.js`: catálogo de productos y funciones para buscar combos.
- `src/datos.js`: conjunto de ventas de ejemplo.
- `src/explorar.js`: inspección de los datos de ventas.
- `src/generador.js`: generación de ventas sintéticas para pruebas y mediciones.
- `src/instrumentadas.js`: versiones de funciones que cuentan operaciones.
- `src/medir.js`: medición de operaciones y comparación de rendimiento.
- `src/optimizadas.js` y `src/recurrentes.js`: implementaciones optimizadas y original para encontrar clientes recurrentes.
- `src/pruebas.js`: pruebas y comparación de las versiones del reporte.
- `src/reporte.js`: genera el reporte de ventas en la terminal.
- `src/totalCiudad.js`: archivo auxiliar para el análisis de ventas por ciudad.
- `src/verificar.js`: valida que las distintas implementaciones produzcan resultados equivalentes.
- `RENDIMIENTO.md`: tabla de complejidades, mediciones, proyecciones y análisis de rendimiento.
- `bitacora.md`: registro del desarrollo del proyecto.

## Preguntas de negocio que responde

1. **Salud financiera:** ¿Cuánto se vendió, cuántas unidades se vendieron, cuál fue el ticket promedio y cuál fue la venta de mayor valor?
2. **Desempeño geográfico:** ¿Cuáles son los ingresos por ciudad y qué producto tuvo más apariciones en cada una (con unidades como desempate)? También muestra las unidades por producto y los tres productos con mayor valor vendido.
3. **Fidelización:** ¿Qué clientes realizaron dos o más compras y cuál es el primer cliente que aparece en una sola compra?
4. **Estrategia comercial:** ¿Qué par de productos suma exactamente `$87.000` y qué par del catálogo se acerca más al presupuesto de `$100.000`?
5. **Estacionalidad:** ¿Cuál es la mejor ventana móvil de siete días en la serie de 30 valores diarios de ejemplo? Este cálculo usa esos datos de ejemplo, no reconstruye ventas diarias desde las transacciones.