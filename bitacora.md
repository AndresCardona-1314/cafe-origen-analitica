# Diccionario de datos

| Propiedad | Tipo de dato (JavaScript) | Significado y formato |
|---|---|---|
| `id` | `number` | Identificador numérico único y secuencial de cada transacción de venta (del 1 al 12). |
| `fecha` | `string` | Fecha en la que se registró la venta, con formato ISO `AAAA-MM-DD`. |
| `cliente` | `string` | Código identificador del comprador (de `C01` a `C08`). |
| `producto` | `string` | Nombre comercial y presentación del artículo de café o accesorio vendido. |
| `ciudad` | `string` | Ciudad de destino o lugar donde se realizó la compra. |
| `cantidad` | `number` | Número entero de unidades adquiridas en esa transacción. |
| `precio` | `number` | Valor unitario del producto en pesos colombianos (COP), sin puntos ni símbolos. |

# Casos borde detectados 

Al auditar los 12 registros, se identifican tres situaciones de calidad de datos y las decisiones técnicas recomendadas antes de realizar cálculos.

## Inconsistencia de capitalización en ciudad (fila 4 / id `5`)

- **Problema detectado:** El registro con `id: 5` tiene el valor `medellín` con la inicial en minúscula, mientras que los registros con `id: 1`, `id: 4` e `id: 11` tienen `Medellín`. 

- **Decisión técnica:** Normalizar las cadenas de la propiedad `ciudad` antes de agrupar o filtrar.

## Cantidad igual a cero en una venta registrada (fila 7 / id `8`)

- **Problema detectado:** El registro con `id: 8` (cliente `C06`, producto `Origen Huila 500 g`) tiene `cantidad: 0`. Aunque `0 * 42000 = 0` no modifica los ingresos totales, este registro puede distorsionar métricas como el conteo de transacciones exitosas, el ticket promedio y el conteo de clientes activos.

- **Decisión técnica:** Excluir los registros con cantidad menor o igual a cero de las métricas de ventas válidas, por ejemplo, con `.filter(v => v.cantidad > 0)`, y reportarlos como transacciones anuladas o incompletas.

## Clientes recurrentes frente a clientes únicos (ids `1`, `4`, `11`; `2`, `7`; y `3`, `9`)

- **Problema detectado:** Hay 12 filas, pero los códigos de cliente se repiten: `C01` aparece 3 veces, `C02` aparece 2 veces y `C03` aparece 2 veces. Por lo tanto, hay 8 clientes únicos, no 12. Usar `ventas.length` para contar clientes produciría un resultado erróneo.

- **Decisión técnica:** Contar clientes únicos extrayendo sus códigos sin duplicados.

# Plan en pseudocódigo de los indicadores

Los cálculos se harán recorriendo el arreglo `ventas` definido en `src/datos.js`. Para considerar únicamente ventas válidas, se incluirán los registros cuya `cantidad` sea mayor que cero. El valor de cada venta se calcula como `cantidad * precio`.

## 1. Total vendido

```text
iniciar totalVendido en 0
para cada venta en ventas:
    si venta.cantidad > 0:
        calcular importe como venta.cantidad * venta.precio
        acumular importe en totalVendido
mostrar totalVendido en COP
```

## 2. Unidades vendidas

```text
iniciar unidadesVendidas en 0
para cada venta en ventas:
    si venta.cantidad > 0:
        acumular venta.cantidad en unidadesVendidas
mostrar unidadesVendidas
```

## 3. Venta más grande

Se compara el importe total de cada transacción, no el precio unitario del producto.

```text
iniciar importeMayor en 0
iniciar ventaMayor en nulo
para cada venta en ventas:
    si venta.cantidad > 0:
        calcular importe como venta.cantidad * venta.precio
        si importe > importeMayor:
            asignar importe a importeMayor
            asignar venta a ventaMayor
mostrar importeMayor en COP y los datos de ventaMayor
```

## 4. Ticket promedio por compra

Cada registro válido cuenta como una compra, aunque un mismo cliente aparezca en varios registros.

```text
iniciar totalCompras en 0
iniciar cantidadCompras en 0
para cada venta en ventas:
    si venta.cantidad > 0:
        calcular importe como venta.cantidad * venta.precio
        acumular importe en totalCompras
        aumentar cantidadCompras en 1
si cantidadCompras > 0:
    calcular ticketPromedio como totalCompras / cantidadCompras
    mostrar ticketPromedio en COP
si no:
    informar que no hay compras válidas para calcular el promedio
```

# Verificación manual con tablas de traza



## Traza 1: total vendido

| id | Cantidad | Precio unitario (COP) | Importe de la venta (COP) | Total acumulado (COP) |
|---:|---:|---:|---:|---:|
| 1 | 2 | 42.000 | 84.000 | 84.000 |
| 2 | 1 | 26.000 | 26.000 | 110.000 |
| 3 | 1 | 95.000 | 95.000 | 205.000 |
| 4 | 1 | 42.000 | 42.000 | 247.000 |
| 5 | 3 | 45.000 | 135.000 | 382.000 |
| 6 | 2 | 26.000 | 52.000 | 434.000 |
| 7 | 1 | 120.000 | 120.000 | 554.000 |
| 8 | 0 | 42.000 | 0 | 554.000 |
| 9 | 2 | 45.000 | 90.000 | 644.000 |
| 10 | 4 | 42.000 | 168.000 | 812.000 |
| 11 | 1 | 95.000 | 95.000 | 907.000 |
| 12 | 3 | 26.000 | 78.000 | 985.000 |

**Resultado manual:** `985.000 COP`.

**Resultado del programa:** `Total vendido: 985000`. Coinciden.

## Traza 2: ticket promedio por compra

Se acumula el importe de cada registro con `cantidad > 0` y se cuenta cada registro válido como una compra. El id `8` no incrementa el acumulado ni el contador.

| id | Importe (COP) | ¿Se cuenta? | Total válido acumulado (COP) | Compras acumuladas |
|---:|---:|:---:|---:|---:|
| 1 | 84.000 | Sí | 84.000 | 1 |
| 2 | 26.000 | Sí | 110.000 | 2 |
| 3 | 95.000 | Sí | 205.000 | 3 |
| 4 | 42.000 | Sí | 247.000 | 4 |
| 5 | 135.000 | Sí | 382.000 | 5 |
| 6 | 52.000 | Sí | 434.000 | 6 |
| 7 | 120.000 | Sí | 554.000 | 7 |
| 8 | 0 | No | 554.000 | 7 |
| 9 | 90.000 | Sí | 644.000 | 8 |
| 10 | 168.000 | Sí | 812.000 | 9 |
| 11 | 95.000 | Sí | 907.000 | 10 |
| 12 | 78.000 | Sí | 985.000 | 11 |

**Cálculo manual:** `985.000 / 11 = 89.545,4545... COP` por compra.

**Resultado del programa:** `Ticket promedio: 89545.45454545454`. Coincide, considerando la representación decimal de JavaScript.

# Preguntas de recorrido, filtrado, transformación y acumulación por función

## `valorVenta(venta)`

- **¿Qué recorro?** No recorro un arreglo; recibo una venta individual.
- **¿Qué filtro?** No filtro registros.
- **¿Qué transformo?** Transformo `cantidad` y `precio` en el importe de la venta mediante `cantidad * precio`.
- **¿Qué acumulo?** No acumulo valores.
- **¿Cómo agrupo?** No agrupo datos.

## `normalizar(texto)`

- **¿Qué recorro?** No recorro un arreglo; recibo una cadena de texto.
- **¿Qué filtro?** No filtro caracteres.
- **¿Qué transformo?** Elimino espacios con `trim()` y convierto el texto a minúsculas con `toLowerCase()`.
- **¿Qué acumulo?** No acumulo valores.
- **¿Cómo agrupo?** No agrupo datos.

## `totalVendido(ventas)`

- **¿Qué recorro?** Recorro cada venta del arreglo `ventas`.
- **¿Qué filtro?** No excluyo registros; esta versión suma todas las ventas.
- **¿Qué transformo?** Convierto cada venta en su importe mediante `valorVenta(v)`.
- **¿Qué acumulo?** Acumulo los importes parciales en `total`.
- **¿Cómo agrupo?** No agrupo; obtengo un total general.

## `unidadesVendidas(ventas)`

- **¿Qué recorro?** Recorro cada venta del arreglo `ventas`.
- **¿Qué filtro?** Solo considero las ventas cuya `cantidad` sea mayor que `0`.
- **¿Qué transformo?** Uso directamente `v.cantidad` como unidades vendidas.
- **¿Qué acumulo?** Acumulo la cantidad de unidades válidas en `totalUnidades`.
- **¿Cómo agrupo?** No agrupo; obtengo el total de unidades.

## `ventaMayor(ventas)`

- **¿Qué recorro?** Recorro cada venta del arreglo `ventas`.
- **¿Qué filtro?** Si el arreglo está vacío, no proceso registros y devuelvo `null`; no excluyo ventas dentro de un arreglo no vacío.
- **¿Qué transformo?** Convierto cada venta a su importe y lo comparo con el importe de `mayor`.
- **¿Qué acumulo?** Mantengo el registro completo de la venta de mayor importe en `mayor`.
- **¿Cómo agrupo?** No agrupo; selecciono una venta representativa.

## `ticketPromedio(ventas)`

- **¿Qué recorro?** Recorro cada venta del arreglo `ventas`.
- **¿Qué filtro?** Solo considero registros cuya `cantidad` sea mayor que `0`.
- **¿Qué transformo?** Convierto cada venta válida en su importe y cuento la venta como una compra.
- **¿Qué acumulo?** Acumulo los importes en `totalVentas` y el número de compras válidas en `cantidadVentas`.
- **¿Cómo agrupo?** No agrupo por atributo; calculo el promedio general dividiendo el total entre la cantidad de ventas válidas.

## `ventasPorCiudad(ventas, ciudad)`

- **¿Qué recorro?** Recorro cada venta del arreglo `ventas`.
- **¿Qué filtro?** Solo considero las ventas cuya ciudad normalizada coincida con la ciudad solicitada normalizada.
- **¿Qué transformo?** Normalizo la ciudad de la venta y convierto la venta en su importe.
- **¿Qué acumulo?** Acumulo los importes de las ventas coincidentes en `total`.
- **¿Cómo agrupo?** No creo varios grupos; selecciono un único grupo identificado por `ciudad`.

## `totalVendidoM(ventas)`

- **¿Qué recorro?** Recorro `ventas` mediante `reduce`.
- **¿Qué filtro?** No filtro registros; esta versión suma todas las ventas.
- **¿Qué transformo?** Convierto cada venta en su importe con `valorVenta(v)`.
- **¿Qué acumulo?** Acumulo cada importe en el acumulador `acc`, iniciado en `0`.
- **¿Cómo agrupo?** No agrupo; devuelvo un único total.

## `unidadesVendidasM(ventas)`

- **¿Qué recorro?** Recorro `ventas` después de aplicar `filter` y luego mediante `reduce`.
- **¿Qué filtro?** Conservo únicamente registros con `cantidad > 0`.
- **¿Qué transformo?** Mantengo `v.cantidad` como dato numérico de unidades.
- **¿Qué acumulo?** Acumulo las cantidades válidas en `acc`, iniciado en `0`.
- **¿Cómo agrupo?** No agrupo; devuelvo el total de unidades.

## `ventasPorCiudadM(ventas, ciudad)`

- **¿Qué recorro?** Recorro `ventas` mediante `filter` y después `reduce`.
- **¿Qué filtro?** Conservo las ventas cuya ciudad normalizada sea igual a la ciudad solicitada normalizada.
- **¿Qué transformo?** Convierto cada venta coincidente en su importe con `valorVenta(v)`.
- **¿Qué acumulo?** Acumulo los importes en `acc`, iniciado en `0`.
- **¿Cómo agrupo?** No agrupo varios grupos; opero sobre las ventas de una sola ciudad.

## `ventaMayorM(ventas)`

- **¿Qué recorro?** Recorro `ventas` mediante `reduce`.
- **¿Qué filtro?** Si el arreglo está vacío, devuelvo `null`; no aplico filtros adicionales a los registros.
- **¿Qué transformo?** Comparo el importe de cada venta con el importe del registro acumulado como mayor.
- **¿Qué acumulo?** Mantengo en `mayor` el objeto de la venta de mayor importe.
- **¿Cómo agrupo?** No agrupo; selecciono un único máximo.

## `ticketPromedioM(ventas)`

- **¿Qué recorro?** Recorro `ventas` una vez para filtrar las válidas y otra vez para acumular sus importes.
- **¿Qué filtro?** Conservo únicamente registros con `cantidad > 0`.
- **¿Qué transformo?** Convierto cada venta válida en su importe y cuento su registro como una compra.
- **¿Qué acumulo?** Acumulo los importes de las ventas válidas en `total`; el denominador es `validas.length`.
- **¿Cómo agrupo?** No agrupo por atributo; calculo el promedio general de todas las ventas válidas.

## `totalPorCiudad(ventas)`

- **¿Qué recorro?** Recorro cada venta del arreglo `ventas` mediante `reduce`.
- **¿Qué filtro?** No filtro registros.
- **¿Qué transformo?** Normalizo `v.ciudad` y convierto la venta en su importe.
- **¿Qué acumulo?** Acumulo el importe de cada venta en el valor asociado a su ciudad dentro de `acc`.
- **¿Cómo agrupo?** Agrupo por ciudad normalizada; el resultado es un objeto donde cada clave representa una ciudad.

## `unidadesPorProducto(ventas)`

- **¿Qué recorro?** Recorro las ventas válidas mediante `filter` y `reduce`.
- **¿Qué filtro?** Conservo únicamente registros con `cantidad > 0`.
- **¿Qué transformo?** Normalizo `v.producto` y extraigo `v.cantidad` como cantidad vendida.
- **¿Qué acumulo?** Acumulo las unidades de cada venta en el valor asociado a su producto dentro de `acc`.
- **¿Cómo agrupo?** Agrupo por producto normalizado; el resultado es un objeto con una suma de unidades por producto.

## `topProductosPorValor(ventas, k)`

- **¿Qué recorro?** Recorro las ventas para agrupar importes y luego recorro las entradas del objeto agrupado.
- **¿Qué filtro?** Conservo ventas con `cantidad > 0`; si el arreglo está vacío o `k <= 0`, devuelvo un arreglo vacío.
- **¿Qué transformo?** Normalizo cada producto y convierto cada venta en su importe; luego transformo `Object.entries()` en objetos `{ producto, total }`.
- **¿Qué acumulo?** Acumulo el importe total de cada producto en `totalesPorProducto`.
- **¿Cómo agrupo?** Agrupo por producto normalizado, ordeno los totales de mayor a menor y tomo los primeros `k` productos.

## Errores reportados

#### Bug #1: Duplicación de ciudades en los reportes agrupados

- **Síntoma:** Al generar el resumen de ventas agrupado por ciudad, una misma ciudad (como `"Bogotá"` o `"Medellín"`) aparece dividida en dos filas o claves distintas dentro del reporte.
- **Entrada que lo produce:** Un arreglo de ventas donde la propiedad `ciudad` tiene variaciones de mayúsculas/minúsculas o espacios extra, como en el registro `id: 5` (`ciudad: "medellín"`) frente a `id: 1` (`ciudad: "Medellín"`), o entradas como `"Bogotá"` vs `"bogotá "`.
- **Hipótesis:** El código preliminar agrupa utilizando el texto crudo (`v.ciudad`) como clave directa del objeto acumulador sin aplicar normalización previa, por lo que JavaScript trata `"Medellín"` y `"medellín"` como dos claves diferentes.
- **Prueba realizada:** Se ejecutó la función `totalPorCiudad(ventas)` y `ventasPorCiudadM(ventas, "  medellín ")` sobre el dataset completo (que contiene 3 registros como `"Medellín"` y 1 registro como `"medellín"`).
- **Causa:** Ausencia de estandarización de cadenas (`.trim()` y control de capitalización) antes de agrupar o comparar los nombres de ciudades.
- **Corrección:** En `analitica.js` v0.1 se implementó la función `normalizar(texto)` (`String(texto).trim().toLowerCase()`) para las comparaciones en `ventasPorCiudad` / `ventasPorCiudadM`, y se estandarizó la clave en formato título al construir el objeto agrupado en `totalPorCiudad`, consolidando todos los registros en una única entrada (`Medellín: $221.000`).

#### Bug #2: `NaN` en el ticket promedio al filtrar días sin ventas

- **Síntoma:** Cuando se filtra una fecha sin transacciones registradas y se calcula el ticket promedio sobre ese subconjunto, el sistema imprime `NaN` (*Not a Number*) o `$NaN`.
- **Entrada que lo produce:** `ticketPromedioM(ventasDelDia(ventas, "2026-09-07"))` (o cualquier fecha inexistente en el dataset, lo que pasa un arreglo vacío `[]` a la función del promedio).
- **Hipótesis:** La versión preliminar divide la suma total de ventas entre la longitud del arreglo (`total / ventas.length`) sin validar si el divisor es `0`, provocando la operación indeterminada `0 / 0`, que en JavaScript evalúa a `NaN`.
- **Prueba realizada:** Se ejecutó `ticketPromedio(ventasDelDia(ventas, "2026-09-07"))` y `ticketPromedioM([])` dentro de `src/verificar.js` y `src/reporte.js`.
- **Causa:** Falta de una cláusula de guarda (*guard clause*) que intercepte arreglos vacíos o conjuntos sin ventas válidas (`cantidad > 0`) antes de ejecutar la división.
- **Corrección:** En `analitica.js` v0.1 se incorporó la validación `if (validas.length === 0) return 0;` (en `ticketPromedioM`) y `if (cantidadVentas > 0) ... return 0;` (en `ticketPromedio`), garantizando que ante un día sin ventas el motor devuelva `0` (`$0`) de forma segura.




## Predicción de crecimiento de operaciones (Complejidad Temporal):

- **Hipótesis:** Si el tamaño de entrada $n$ (cantidad de registros de ventas) se multiplica por **10** (por ejemplo, pasando de $n = 100$ a $n = 1.000$, o de $n = 1.000$ a $n = 10.000$), el número de operaciones de **las tres funciones (`totalVendido`, `ventaMayor` y `totalPorCiudad`) también se multiplicará exactamente por 10**.
- **Justificación técnica:** Cada una de estas funciones implementa un único recorrido secuencial sobre los $n$ elementos del arreglo (complejidad lineal **$O(n)$**). En cada iteración se ejecuta un número constante de pasos (una visita y una suma, comparación o asignación en un objeto hash de acceso $O(1)$), por lo que la relación entre el tamaño de los datos y la cantidad de operaciones es directamente proporcional ($T(n) \approx n$).











## Comparación: Predicción vs. Resultados Empíricos

- **Predicción inicial:** Se estimó que al multiplicar el tamaño de entrada $n$ por **10**, las funciones `totalVendido`, `ventaMayor` y `totalPorCiudad` multiplicarían su cantidad de operaciones por **10** (crecimiento lineal), mientras que `primeraVenta` mantendría siempre **1** operación (crecimiento constante).
- **Validación con datos reales (`src/medir.js`):** Los resultados empíricos confirmaron la predicción al **100%**:

| **Tamaño de entrada (n)** | **primeraVenta** | **totalVendido** | **ventaMayor** | **totalPorCiudad** | **Factor de crecimiento observado** |
|---|---:|---:|---:|---:|---|
| $100$ | $1$ op | $100$ ops | $100$ ops | $100$ ops | Base ($\times 1$) |
| $1.000$ | $1$ op | $1.000$ ops | $1.000$ ops | $1.000$ ops | **$\times 1$** en $O(1)$ / **$\times 10$** en $O(n)$ |
| $10.000$ | $1$ op | $10.000$ ops | $10.000$ ops | $10.000$ ops | **$\times 1$** en $O(1)$ / **$\times 10$** en $O(n)$ |
| $100.000$ | $1$ op | $100.000$ ops | $100.000$ ops | $100.000$ ops | **$\times 1$** en $O(1)$ / **$\times 10$** en $O(n)$ |

- **Observación sobre tiempos de ejecución (`performance.now()`):** Aunque `totalVendido`, `ventaMayor` y `totalPorCiudad` ejecutan exactamente el mismo número de iteraciones ($n$), `totalPorCiudad` registra unos milisegundos adicionales en $n = 100.000$. Esto no cambia su clase de complejidad, sino que responde al costo constante por iteración ($c$) de manipular cadenas de texto (`normalizar` con `.trim()`, `.toLowerCase()` y `.slice()`).

#### 2. Clasificación y Justificación Técnica por Función

##### A. `primeraVenta(ventas)` $\rightarrow$ Complejidad Constante **$O(1)$**

- **Justificación con los números:** Al escalar $n$ desde $100$ hasta $100.000$ registros (un incremento de $\times 1.000$), el conteo se mantuvo invariable en **$1$ operación**.
- **Justificación con el código:** No contiene ningún ciclo ni método iterativo. Accede directamente a una posición fija en memoria mediante índice (`return ventas[0]`), lo cual toma el mismo esfuerzo sin importar la longitud del arreglo.

##### B. `totalVendido(ventas)` $\rightarrow$ Complejidad Lineal **$O(n)$**

- **Justificación con los números:** Cada vez que $n$ se multiplicó por $10$, las operaciones crecieron exactamente en la misma proporción ($100 \rightarrow 1.000 \rightarrow 10.000 \rightarrow 100.000$).
- **Justificación con el código:** Utiliza un único bucle simple (`for (const v of ventas)`) que visita cada elemento una sola vez para ejecutar una operación aritmética constante (`total += valorVenta(v)`). No existen ciclos anidados.

##### C. `ventaMayor(ventas)` $\rightarrow$ Complejidad Lineal **$O(n)$**

- **Justificación con los números:** Presenta un crecimiento estrictamente proporcional a $n$, realizando $n$ visitas/comparaciones (o $n - 1$ si inicia en el índice $1$).
- **Justificación con el código:** Recorre secuencialmente el arreglo mediante un único ciclo (`for...of`) manteniendo una variable auxiliar `mayor` y ejecutando una comparación simple (`if (valorVenta(v) > valorVenta(mayor))`) por cada elemento.

##### D. `totalPorCiudad(ventas)` $\rightarrow$ Complejidad Lineal **$O(n)$**

- **Justificación con los números:** Realiza exactamente $n$ operaciones de recorrido ($100.000$ operaciones para $n = 100.000$), manteniendo una pendiente lineal frente al crecimiento de los datos.
- **Justificación con el código:** Recorre el arreglo una sola vez (`for...of`) y agrupa los resultados utilizando un objeto diccionario (`totales[ciudadTitulo]`). Dado que la búsqueda e inserción por clave en un objeto JavaScript (tabla hash) tiene costo promedio **$O(1)$**, no introduce ciclos internos y conserva la eficiencia lineal **$O(n)$**.


## Traza de `clientesRecurrentes(ventas)` con 5 ventas

Para contar las comparaciones del ciclo anidado, usamos estas cinco ventas de ejemplo (el algoritmo compara el campo `cliente`):

```js
const ventas = [
  { cliente: "C01" },
  { cliente: "C02" },
  { cliente: "C01" },
  { cliente: "C03" },
  { cliente: "C02" }
];
```

| Índice | Cliente |
|---:|:---|
| 0 | C01 |
| 1 | C02 |
| 2 | C01 |
| 3 | C03 |
| 4 | C02 |

El ciclo externo fija `i` y el interno compara esa venta con las que vienen después (`j = i + 1` hasta `n - 1`):

| `i` | Comparaciones de clientes (`ventas[i].cliente === ventas[j].cliente`) | Comparaciones |
|---:|:---|---:|
| 0 | `C01 === C02` → falso; `C01 === C01` → verdadero; `C01 === C03` → falso; `C01 === C02` → falso | 4 |
| 1 | `C02 === C01` → falso; `C02 === C03` → falso; `C02 === C02` → verdadero | 3 |
| 2 | `C01 === C03` → falso; `C01 === C02` → falso | 2 |
| 3 | `C03 === C02` → falso | 1 |
| 4 | No hay valores posteriores que comparar | 0 |
| **Total** | **`4 + 3 + 2 + 1 + 0`** | **10** |

El resultado de la función para este ejemplo es `["C01", "C02"]`. Además de las 10 comparaciones entre clientes, el código llama a `recurrentes.includes(...)` cuando encuentra una coincidencia: al encontrar `C01`, la lista está vacía y no se compara ningún elemento; al encontrar `C02`, se compara con `C01` una vez. Por tanto, en esta traza hay **1 comparación adicional** dentro de `includes` (11 comparaciones de igualdad en total).

### Generalización

Con `n` ventas, el ciclo interno realiza `n - 1` comparaciones para `i = 0`, `n - 2` para `i = 1`, y así sucesivamente hasta 0. Las comparaciones entre clientes son:

$$
C(n) = (n - 1) + (n - 2) + \dots + 1 + 0
     = \frac{n(n - 1)}{2}
$$

Para `n = 5`, `C(5) = 5 × 4 / 2 = 10`. Esta fórmula cuenta las comparaciones del ciclo anidado; las realizadas por `includes` dependen de los clientes repetidos y del contenido de `recurrentes`. El ciclo anidado por sí solo tiene crecimiento **$O(n^2)$**. Como `includes` también recorre `recurrentes`, la función completa puede llegar a **$O(n^3)$** en el peor caso.


## Tabla de resultados medidos

Los tiempos son los que arrojó `console.timeEnd` al ejecutar `node src/recurrentes.js` en esta terminal. La columna teórica cuenta las comparaciones entre pares, con $C(n) = n(n-1)/2$.

| **Tamaño de entrada ($n$)** | **Comparaciones teóricas** | **Tiempo medido (`console.timeEnd`)** | **Factor frente al anterior** |
|---:|---:|---:|---:|
| $1.000$ | $499.500$ | `9.762 ms` | Base |
| $2.000$ | $1.999.000$ | `26.938 ms` | $\times 2,76$ |
| $4.000$ | $7.998.000$ | `116.088 ms` | $\times 4,31$ |
| $8.000$ | $31.996.000$ | `525.554 ms` | $\times 4,53$ |
| $16.000$ | $127.992.000$ | `1.474 s` | $\times 2,81$ |
| $100.000$ | $4.999.950.000$ | `1:47.133 (m:ss.mmm)` | $\times 72,68$ |

### Análisis de duplicación de $n$ y relación con $O(n^2)$

> **Análisis:** Al duplicar $n$, las comparaciones entre pares se multiplican aproximadamente por cuatro. La relación teórica exacta es $C(2n)/C(n) = 2(2n-1)/(n-1)$, que tiende a 4 cuando $n$ crece. En esta ejecución, los factores de tiempo observados fueron $\times 2,76$, $\times 4,31$, $\times 4,53$ y $\times 2,81$: muestran variación y no un factor constante. Los tiempos pueden cambiar entre ejecuciones por la generación aleatoria de ventas, la optimización JIT, el recolector de basura y la carga del equipo.
>
> **Relación con $O(n^2)$:** Los dos ciclos anidados comparan cada venta con las que le siguen, sumando $n(n-1)/2$ comparaciones. Por eso, el conteo del ciclo crece cuadráticamente: al sustituir $n$ por $2n$, el término dominante pasa de $n^2$ a $(2n)^2 = 4n^2$. El tiempo total también incluye la búsqueda de `recurrentes.includes(...)`, así que no tiene por qué seguir exactamente esa proporción.

### Estimación para $100.000$ y $1.000.000$ de ventas

Usando como referencia el tiempo medido para $n = 16.000$ (`1.474 s`):

- **Para $n = 100.000$:** el tamaño crece $6,25$ veces; la regla cuadrática predice un factor de $6,25^2 = 39,0625$. El tiempo estimado es $1,474 \text{ s} \times 39,0625 \approx 57,578 \text{ s}$. En esta ejecución, el terminal midió realmente **`1:47.133`** para $n = 100.000$ (1 minuto y 47,133 segundos), menos de dos minutos. La diferencia respecto a la estimación muestra que la regla es aproximada y que los costos de `includes` y la variación de la prueba afectan el tiempo.
- **Para $n = 1.000.000$:** frente a $n = 16.000$, el tamaño crece $62,5$ veces; la regla predice un factor de $62,5^2 = 3.906,25$. Desde el tiempo de referencia de `1.474 s`, la estimación es $1,474 \text{ s} \times 3.906,25 \approx 5.757,8 \text{ s}$, aproximadamente **1 hora, 35 minutos y 58 segundos**. No se ejecutó la prueba de un millón de ventas; es una extrapolación, no un tiempo medido. Como referencia alternativa, extrapolar cien veces la medición real de $100.000$ daría cerca de **2 horas y 58 minutos**.

### Costo de `recurrentes.includes(...)` en el peor caso

> **Costo adicional:** `.includes()` busca linealmente en `recurrentes`, por lo que puede revisar hasta $k$ elementos si el arreglo contiene $k$ clientes recurrentes. Esta búsqueda solo se ejecuta cuando la comparación de clientes del ciclo interno encuentra una coincidencia.
>
> **Peor caso:** Si se acumulan proporcionalmente a $n$ clientes recurrentes y muchas coincidencias ocurren cuando esa lista ya es grande, las búsquedas de `includes` pueden elevar el peor caso de la función completa a **$O(n^3)$**. Esto es distinto del ciclo anidado, que por sí solo es **$O(n^2)$**. Además, `src/generador.js` no usa un catálogo fijo: establece la cantidad de clientes sintéticos como `Math.floor(n / 3)`, que también crece con $n$.

### Conclusión para la gerente

> **Nota para Gerencia:**
>
> El reporte de clientes recurrentes se vuelve más lento cuando crece el volumen de ventas porque el sistema compara cada venta con todas las que aparecen después. Con pocas ventas, el proceso es rápido; al multiplicar por diez el historial, las comparaciones entre pares crecen aproximadamente cien veces.

