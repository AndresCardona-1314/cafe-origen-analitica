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

Se usan los 12 registros de `src/datos.js`. Los importes de cada transacción se calculan como `cantidad * precio`. En la función `totalVendido` del programa se recorren todos los registros; el registro con cantidad cero aporta un importe de cero. Para el ticket promedio, el programa solo cuenta registros cuya cantidad sea mayor que cero.

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

## Comprobación adicional de los otros indicadores

- **Unidades vendidas:** `2 + 1 + 1 + 1 + 3 + 2 + 1 + 0 + 2 + 4 + 1 + 3 = 21`; el programa muestra `Unidades vendidas: 21`.
- **Venta más grande:** el importe mayor es `4 * 42.000 = 168.000 COP`, correspondiente al registro con `id: 10`; el programa devuelve ese registro.
