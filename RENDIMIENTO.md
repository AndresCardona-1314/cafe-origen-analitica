# Informe de rendimiento del motor de Café Origen

## Tabla de funciones y rendimiento con 10.000 ventas

Las mediciones se realizaron en el entorno actual con datos sintéticos de 10.000 ventas. Los tiempos pueden variar por la carga del equipo, JIT y estado del recolector de basura. Los totales instrumentados representan recorridos teóricos exactos.

| Función | Qué hace | Complejidad temporal | Complejidad espacial | Justificación | Operaciones o tiempo medido con 10.000 ventas |
|---|---|---|---|---|---|
| `valorVenta(venta)` | Calcula `cantidad * precio` | $O(1)$ | $O(1)$ | Solo opera sobre una venta y devuelve un número. | Operación constante. |
| `normalizar(texto)` | Aplica `trim()` y `toLowerCase()` | $O(s)$, donde $s$ es la longitud del texto | $O(s)$ si se considera la cadena creada | Procesa una cadena individual; respecto al tamaño $n$ de ventas puede tratarse como costo constante por elemento. | Operación constante para cadenas cortas. |
| `totalVendido(ventas)` | Suma el importe de todas las ventas | $O(n)$ | $O(1)$ | Un recorrido con una suma escalar por elemento. | Medición sintética: $10.000$ operaciones y aproximadamente `6.828 ms`. |
| `unidadesVendidas(ventas)` | Suma unidades con `cantidad > 0` | $O(n)$ | $O(1)$ | Un recorrido, una comparación y una suma. | $10.000$ operaciones teóricas. |
| `ventaMayor(ventas)` | Encuentra la venta de mayor importe | $O(n)$ | $O(1)$ | Conserva una sola referencia a la venta mayor. | Medición sintética: aproximadamente `0.581 ms`. |
| `ticketPromedio(ventas)` | Calcula importe válido dividido entre compras válidas | $O(n)$ | $O(1)$ | Usa dos acumuladores escalares en un recorrido. | $10.000$ operaciones teóricas. |
| `ventasPorCiudad(ventas, ciudad)` | Suma ventas de una ciudad normalizada | $O(n)$ | $O(1)$ | Recorre una vez y acumula solo coincidencias válidas. | $10.000$ operaciones teóricas. |
| `totalVendidoM(ventas)` | Versión con `reduce` del total vendido | $O(n)$ | $O(1)$ | `reduce` mantiene un acumulador escalar. | $10.000$ operaciones de visita. |
| `unidadesVendidasM(ventas)` | Filtra ventas válidas y reduce cantidades | $O(n)$ | $O(n)$ | `filter` crea un arreglo intermedio de hasta $n$ elementos. | $20.000$ visitas teóricas: 10.000 en `filter` y 10.000 en `reduce`. |
| `ventasPorCiudadM(ventas, ciudad)` | Filtra una ciudad y reduce importes | $O(n)$ | $O(n)$ | El arreglo intermedio de `filter` puede contener hasta $n$ elementos. | $20.000$ visitas teóricas. |
| `ventaMayorM(ventas)` | Versión con `reduce` de la venta mayor | $O(n)$ | $O(1)$ | Mantiene una referencia al mayor sin arreglos adicionales. | $10.000$ visitas teóricas. |
| `ticketPromedioM(ventas)` | Filtra válidas y calcula su promedio | $O(n)$ | $O(n)$ | El arreglo `validas` puede contener hasta $n$ ventas. | $20.000$ visitas teóricas. |
| `totalPorCiudad(ventas)` | Agrupa importe total por ciudad | $O(n)$ | $O(n)$ | Un recorrido lineal, pero el objeto puede crear hasta $n$ claves distintas. | Medición sintética: aproximadamente `1.471 ms`; 10.000 visitas teóricas. |
| `unidadesPorProducto(ventas)` | Agrupa unidades válidas por producto | $O(n)$ | $O(n)$ | `filter` crea memoria proporcional a $n$ y el objeto puede guardar un grupo por producto. | Hasta $20.000$ visitas teóricas, además de las claves de agrupación. |
| `topProductosPorValor(ventas, k)` | Agrupa, ordena y entrega los $k$ productos superiores | $O(n \log n)$ por el ordenamiento, con agrupación lineal | $O(n)$ | Después de agrupar es necesario ordenar hasta $n$ productos; temporales incluyen `filter`, objeto, `Object.entries()` y `map()`. | $10.000$ ventas filtradas y agrupadas antes del ordenamiento; tiempo no estable medido con el dataset pequeño. |
| `ventasDelDia(ventas, fecha)` | Devuelve ventas válidas de una fecha | $O(n)$ | $O(n)$ | `filter` crea un resultado de hasta $n$ ventas. | $10.000$ comparaciones teóricas. |
| `totalCiudadCadena(ventas, ciudad)` | Normaliza, filtra, transforma y suma mediante métodos encadenados | $O(n)$ | $O(n)$ | Ejecuta cuatro recorridos; crea tres arreglos intermedios proporcionalmente grandes. | Aproximadamente 40.000 visitas y `4.673 ms` medidos con datos sintéticos. |
| `totalCiudadUnaPasada(ventas, ciudad)` | Suma el total de una ciudad en un recorrido | $O(n)$ | $O(1)$ | Solo conserva `objetivo` y `total`, sin arreglos auxiliares. | Aproximadamente 10.000 visitas y `1.526 ms` medidos con datos sintéticos. |
| `generarVentas(n)` | Genera $n$ ventas sintéticas | $O(n)$ | $O(n)$ | Cada iteración añade un objeto al arreglo `ventasPrueba`. | 10.000 objetos creados. |
| `clientesRecurrentes(ventas)` | Encuentra clientes presentes en más de un registro | $O(n^2)$ por comparaciones, peor caso con `includes()` puede crecer adicionalmente | $O(n)$ | Compara cada venta con las posteriores y guarda hasta $n$ clientes distintos. | 49.995.000 comparaciones teóricas de pares; medición sintética: `371.327 ms` a 10.000 ventas. |
| `totalVendidoInst(ventas, contador)` | Versión instrumentada del total vendido | $O(n)$ | $O(1)$ | Incrementa el contador una vez por venta y acumula el total. | 10.000 operaciones instrumentadas esperadas. |
| `ventaMayorInst(ventas, contador)` | Versión instrumentada de venta mayor | $O(n)$ | $O(1)$ | Una comparación instrumentada por recorrido. | 10.000 operaciones instrumentadas esperadas. |
| `totalPorCiudadInst(ventas, contador)` | Versión instrumentada de agrupación por ciudad | $O(n)$ | $O(n)$ | Cada venta visita el objeto `totales`, que puede tener hasta $n$ claves. | 10.000 operaciones instrumentadas esperadas. |
| `primeraVentaInst(ventas, contador)` | Devuelve la primera venta o `null` | $O(1)$ | $O(1)$ | Solo accede al índice 0 o verifica el arreglo vacío. | 1 operación instrumentada. |

## Proyección

La proyección a 1.000.000 de ventas usa los tiempos medidos como referencia y las clases asintóticas conocidas. Es una estimación, no una garantía de tiempo real.

| Función o reporte | Base medida | Factor teórico a 1.000.000 | Estimación para 1.000.000 |
|---|---|---|---|
| `totalVendido(ventas)` | `6.828 ms` a 10.000 | $100\times$ al pasar a 100 veces los datos | Aproximadamente `683 ms` |
| `ventaMayor(ventas)` | `0.581 ms` a 10.000 | $100\times$ | Aproximadamente `58 ms` |
| `totalPorCiudad(ventas)` | `1.471 ms` a 10.000 | $100\times$ | Aproximadamente `147 ms` |
| `totalCiudadUnaPasada(ventas, ciudad)` | `1.526 ms` a 10.000 | $100\times$ | Aproximadamente `153 ms` |
| `totalCiudadCadena(ventas, ciudad)` | `4.673 ms` a 10.000 | $100\times$ por crecimiento lineal | Aproximadamente `467 ms`, sin incluir variaciones del recolector de basura |
| `topProductosPorValor(ventas, k)` | No se obtuvo una medida estable con 10.000 ventas | Aproximadamente $n\log n$, aunque $k$ sea pequeño | Crecimiento cercano a $100.000\log(100.000)$ frente a $10.000\log(10.000)$; se estima aproximadamente $13,7\times$ más trabajo que a 10.000, sin convertir esa razón directamente en milisegundos |
| `clientesRecurrentes(ventas)` | `38.997 s` a 100.000 en la medición sintética | $100\times$ al pasar de 100.000 a 1.000.000 para $O(n^2)$ | Aproximadamente `3899.7 s`, o cerca de `65 minutos` |

Como comparación cuadrática, 10.000 ventas tardaron `371.327 ms` y 100.000 tardaron `38.997 s`. Este salto es consistente con $n^2$: al multiplicar $n$ por 10, las comparaciones teóricas se multiplican por 100.

## Riesgos

El riesgo se ordena por combinación de complejidad, memoria auxiliar y probabilidad de bloqueo al crecer el volumen. Se considera primero el crecimiento asintótico y luego la creación de estructuras intermedias.

| Orden | Riesgo | Funciones | Criterio |
|---|---|---|---|
| 1 | **Crítico** | `clientesRecurrentes(ventas)` | Es cuadrática: recorre pares $n(n-1)/2$ y además usa `includes()`. También puede almacenar hasta $n$ clientes recurrentes. |
| 2 | **Alto** | `topProductosPorValor(ventas, k)` | Agrupa en $O(n)$ pero ordena hasta los productos distintos, lo que lleva el costo a $O(n\log n)$ y usa varios arreglos u objetos temporales. |
| 3 | **Medio-alto** | `unidadesPorProducto`, `ticketPromedioM`, `unidadesVendidasM`, `ventasPorCiudadM`, `ventasDelDia` | Son lineales, pero crean arreglos de hasta $n$ o objetos agrupados que pueden duplicar o retener memoria. |
| 4 | **Medio** | `totalPorCiudad`, `totalPorCiudadInst`, `generarVentas`, `totalCiudadCadena` | Son lineales, pero acumulan resultados por grupo o crean arreglos temporales; `totalCiudadCadena` duplica trabajo con cuatro pasadas. |
| 5 | **Bajo** | `totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `ventasPorCiudad` y sus versiones directas con `reduce` | Recorridos lineales con memoria auxiliar constante, salvo las implementaciones que crean filtros explícitos. |
| 6 | **Muy bajo** | `valorVenta`, `normalizar`, `primeraVentaInst` y `totalCiudadUnaPasada` | Realizan trabajo constante o un recorrido lineal sin almacenamiento auxiliar proporcional en cada llamada. |

## Plan de optimización

### Función de mayor riesgo: `clientesRecurrentes(ventas)`

**¿Qué trabajo se repite?** El ciclo interno vuelve a comparar pares de ventas aunque el cliente ya haya sido encontrado. Además, `recurrentes.includes(cliente)` busca nuevamente entre los clientes recurrentes después de encontrar una coincidencia.

**Idea de mejora:** Reemplazaría la lógica de pares y búsquedas lineales por una estructura de frecuencia que guarde el estado de cada cliente durante un único recorrido:

- Crear una colección tipo `Map` o `Set` para recordar los clientes ya vistos.
- Crear otro `Set` para almacenar únicamente los clientes recurrentes.
- Recorrer `ventas` una sola vez.
- Por cada venta, comprobar si el cliente ya está en el conjunto visto.
- Si ya existe, añadirlo al conjunto de recurrentes; si no existe, guardarlo como visto.
- Devolver al final los elementos del conjunto recurrente como arreglo.

**Información que se podría guardar para no buscarla de nuevo:**

- `clientesVistos`: conjunto de códigos que ya aparecieron.
- `clientesRecurrentes`: conjunto de códigos confirmados como repetidos.
- Opcionalmente, un objeto o `Map` con la cantidad de apariciones por cliente si el reporte necesitara más que la simple presencia.

Con estas estructuras, habría una búsqueda promedio $O(1)$ por cliente y el recorrido completo sería lineal $O(n)$, dejando el resultado recurrente en memoria proporcional al número de clientes repetidos, $O(k)$, donde $k \le n$.
