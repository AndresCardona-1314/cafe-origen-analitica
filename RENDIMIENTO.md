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
| `azar(min, max)` | Genera un entero aleatorio dentro del rango indicado | $O(1)$ | $O(1)$ | Una llamada a `Math.random()` y operaciones aritméticas constantes. | Al generar 10.000 ventas: 60.000 llamadas (6 por venta). |
| `comboRegalo(catalogo, valor)` | Encuentra dos productos cuyo precio suma el valor objetivo | $O(m^2)$ | $O(1)$ | Compara los pares de productos, donde $m$ es el tamaño del catálogo, sin estructuras auxiliares proporcionales. | Con 8 productos: hasta 28 pares; para el combo de `$87.000` retorna tras 8 comparaciones. |
| `comboRegaloMap(catalogo, valor)` | Encuentra el mismo combo con una búsqueda por complemento | $O(m)$ promedio | $O(m)$ | Recorre el catálogo una vez y guarda precios vistos en un `Map`. | Con 8 productos: el combo de `$87.000` se encuentra en 3 iteraciones; máximo 8. |
| `productoEstrellaPorCiudad(ventas)` | Encuentra el producto con más apariciones por ciudad y desempata por unidades | $O(n)$ promedio | $O(n)$ | Agrupa ciudades y productos en `Map`; el segundo recorrido visita las combinaciones agrupadas, cuyo total no supera $n$. | Con 10.000 ventas sintéticas: 10.000 actualizaciones y hasta 20 combinaciones ciudad-producto revisadas (5 productos × 4 ciudades). |
| `primerClienteUnico(ventas)` | Devuelve el primer cliente que aparece una sola vez | $O(n)$ promedio | $O(u)$ | Cuenta frecuencias en un `Map` y hace un segundo recorrido hasta hallar frecuencia 1; $u$ es el número de clientes distintos. | Con 10.000 ventas: 10.000 actualizaciones de frecuencia y hasta 10.000 comprobaciones de cliente (máximo 20.000 visitas). |
| `mejorSemanaBruta(dias, k)` | Encuentra la ventana de $k$ días con mayor total recalculando cada suma | $O((d-k+1)k)$ | $O(1)$ | Para cada inicio válido vuelve a sumar $k$ valores; $d$ es la cantidad de días. | Con 100.000 días y $k=1.000$: 99.001 ventanas, 99.001.000 sumas y 99.001 comparaciones del máximo. |
| `mejorSemana(dias, k)` | Encuentra la ventana de $k$ días con mayor total usando ventana deslizante | $O(d)$ | $O(1)$ | Suma la ventana inicial y luego actualiza el total agregando un día y quitando otro. | Con 100.000 días y $k=1.000$: 1.000 sumas iniciales, 99.000 actualizaciones (199.000 sumas/restas en total) y 99.000 comparaciones. |
| `parMasCercano(precios, presupuesto)` | Encuentra el par de precios con mayor suma que no supera el presupuesto | $O(m\log m)$ | $O(m)$ | Copia y ordena los $m$ elementos, luego busca el par con dos punteros en $O(m)$. | Con el catálogo de 8 precios y presupuesto `$100.000`: 8 precios ordenados y 6 comparaciones con los dos punteros. |
| `clientesRecurrentesSet(ventas)` | Encuentra clientes repetidos con conjuntos | $O(n)$ promedio | $O(n)$ | Recorre las ventas una vez y usa dos `Set` para clientes vistos y recurrentes. | Con 10.000 ventas: 10.000 comprobaciones `Set.has()` y 10.000 llamadas a `Set.add()`. |
| `comprasPorCliente(ventas)` | Cuenta las compras de cada cliente | $O(n)$ promedio | $O(u)$ | Una pasada actualiza un `Map` con una entrada por cliente distinto; $u \le n$. | Con 10.000 ventas: 10.000 actualizaciones del `Map`; hasta 3.333 claves distintas con el generador del proyecto. |
| `clientesRecurrentesMap(ventas)` | Devuelve clientes con dos o más compras usando frecuencias | $O(n)$ promedio | $O(u)$ | Construye frecuencias con `comprasPorCliente` y recorre las $u$ claves para seleccionar recurrentes. | Con 10.000 ventas: 10.000 actualizaciones de frecuencia y hasta 3.333 comprobaciones de clientes distintos. |
| `formatearCOP(valor)` | Convierte un importe a texto con formato monetario colombiano | $O(d)$ | $O(d)$ | `toLocaleString()` procesa y crea texto proporcional a sus $d$ dígitos; $d$ es pequeño para los importes del reporte. | En el reporte de 10.000 ventas: hasta 31 conversiones, con 4 ciudades, top 3 y dos muestras de hasta 5 ventas. |
| `formatearListaVentas(lista, limite)` | Prepara una muestra formateada de ventas para el reporte | $O(q)$ | $O(q)$ | `slice()` y `map()` procesan hasta $q=\min(n,\text{limite})$ ventas y crean la muestra resultante. | En el reporte: 2 llamadas, máximo 5 ventas por llamada (hasta 10 filas formateadas). |
| `medirEjecucion(fnInstrumentada, datos)` | Mide una ejecución instrumentada y devuelve operaciones y tiempo | $O(T_f(n))$ | $O(S_f(n))$ | Ejecuta una vez `fnInstrumentada`; el costo depende de la función recibida, más trabajo constante de medición y formato. | Para $n=10.000$: 4 llamadas registran 10.000 + 10.000 + 10.000 + 1 = 30.001 operaciones instrumentadas. |
| `medirTiempoMs(fn, datos)` | Mide el tiempo de una función sobre un dataset | $O(T_f(n))$ | $O(S_f(n))$ | Ejecuta una vez `fn`; la complejidad temporal y espacial dependen de esa función. | Para $n=10.000$: 3 mediciones, una ejecución cada una (versión original, `Set` y `Map`). |
| `verificarPar(nombre, valorCiclo, valorMetodo)` | Compara dos resultados e informa si son iguales | $O(r)$ | $O(r)$ | Serializa ambos resultados con `JSON.stringify`; $r$ representa el tamaño de los resultados. | En el dataset de 10.000 ventas: 5 verificaciones de pares de resultados. |
| `verificarRecurrentes(dataset, etiqueta)` | Compara y valida las versiones de clientes recurrentes | $O(n^2)$ | $O(n)$ | Ejecuta la versión original cuadrática, las versiones optimizadas y ordena sus resultados para compararlos. | Proyección para 10.000 ventas: 49.995.000 comparaciones de pares en la versión original, más los recorridos y ordenamientos de resultados. |

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

## Análisis de Rendimiento — Café Origen

### 1. Comparativa de Tiempo Total: Reporte v0.1 vs. Reporte v1.0

En la versión **v0.1**, el cuello de botella principal era la detección de clientes recurrentes por fuerza bruta ($O(n^2)$) y los recorridos múltiples innecesarios. En la **v1.0**, las consultas sobre transacciones operan en tiempo lineal **$O(n)$** mediante tablas hash (`Set` y `Map`), ventana deslizante y acumulación en una sola pasada.

Los tiempos de la siguiente tabla incluyen la impresión real del reporte:

| Volumen de ventas ($n$) | Tiempo Reporte v0.1 (Fuerza Bruta) | Tiempo Reporte v1.0 (Optimizado) | Mejora Observada |
| :--- | :---: | :---: | :---: |
| **$10.000$ registros** | `652.194 ms` | `23.534 ms` | **27.7× más rápido** |
| **$100.000$ registros** | `85352.928 ms` | `131.998 ms` | **646.6× más rápido** |
