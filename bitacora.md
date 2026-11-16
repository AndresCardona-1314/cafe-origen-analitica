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