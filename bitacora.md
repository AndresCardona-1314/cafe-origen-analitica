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





















