# Informe Técnico de Rendimiento — Motor de Analítica Café Origen (`v0.2`)

Documento técnico preparado para el *marketplace* y la gerencia de **Café Origen** sobre el comportamiento temporal y espacial del motor de analítica en **Node.js**, respaldado por mediciones empíricas y análisis asintótico.

---

## 1. Clasificación de funciones (Tiempo, Espacio y Medición con `10.000` ventas)

*Notas metodológicas:*
* Los tiempos (`ms_10k`) corresponden a mediciones reales en consola con `node src/benchmark_v02.js` sobre `10.000` registros generados con `generarVentas(10000)`.
* La **complejidad espacial** indica memoria auxiliar adicional más allá del arreglo de entrada `ventas`.

| Función | Qué hace | Complejidad temporal | Complejidad espacial (auxiliar) | Justificación | Medición con `n = 10.000` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `valorVenta(venta)` | Calcula `cantidad * precio` de una venta. | $O(1)$ | $O(1)$ | Multiplicación aritmética directa sobre un registro, sin ciclos ni estructuras extra. | Operación directa `1` paso (~0.00 ms) |
| `primeraVenta(ventas)` | Retorna la primera venta (`ventas[0]`) o `null` si está vacío. | $O(1)$ | $O(1)$ | Acceso directo por índice `0` sin recorrer el arreglo. | `0.108 ms` (`1` op.) |
| `totalVendido(ventas)` | Suma el valor de ventas con `cantidad > 0` usando `for...of`. | $O(n)$ | $O(1)$ | Un ciclo único sobre `ventas` acumulando en `total`. | `3.72 ms` (~`20.000` pasos) |
| `unidadesVendidas(ventas)` | Suma `cantidad` de ventas válidas usando `for...of`. | $O(n)$ | $O(1)$ | Un ciclo único sobre `ventas` acumulando en `unidades`. | `1.934 ms` (~`20.000` pasos) |
| `ventaMayor(ventas)` | Obtiene el objeto de venta con mayor `valorVenta` (`cantidad > 0`). | $O(n)$ | $O(1)$ | Un ciclo único comparando contra la referencia actual `mayor`. | `2.493 ms` (~`39.999` pasos) |
| `ticketPromedio(ventas)` | Calcula `total / ventasValidas` (`cantidad > 0`), devolviendo `0` si no hay válidas. | $O(n)$ | $O(1)$ | Un ciclo único con dos acumuladores numéricos (`total`, `ventasValidas`) y guarda contra división por cero. | `6.185 ms` (~`20.000` pasos) |
| `ventasPorCiudad(ventas, ciudad)` | Suma ingresos de una ciudad (`cantidad > 0`) ignorando mayúsculas y espacios. | $O(n)$ | $O(1)$ | Un ciclo único comparando `ciudad` normalizada y acumulando en un escalar. | `3.541 ms` (~`20.000` pasos) |
| `totalVendidoM(ventas)` | Suma ingresos de ventas válidas encadenando `.filter()` y `.reduce()`. | $O(n)$ | $O(n)$ | Dos recorridos secuenciales; `.filter()` crea un arreglo intermedio de hasta $n$ elementos. | `1.728 ms` |
| `unidadesVendidasM(ventas)` | Suma unidades de ventas válidas encadenando `.filter()` y `.reduce()`. | $O(n)$ | $O(n)$ | Dos recorridos secuenciales; `.filter()` reserva un arreglo temporal de hasta $n$ elementos. | `1.344 ms` |
| `ventasPorCiudadM(ventas, ciudad)` | Suma ingresos de una ciudad encadenando `.filter()` y `.reduce()`. | $O(n)$ | $O(n)$ | Dos recorridos secuenciales; `.filter()` genera un arreglo intermedio de hasta $n$ elementos. | `2.588 ms` |
| `totalPorCiudad(ventas)` | Agrupa y suma ingresos por ciudad normalizada en un objeto diccionario. | $O(n)$ | $O(n)$ *(diccionario $O(c)$)* | `.filter()` crea un arreglo intermedio $O(n)$; el objeto acumulador guarda $c$ ciudades (acceso hash $O(1)$ promedio). | `9.169 ms` (`30.000` ops. en versión contada) |
| `unidadesPorProducto(ventas)` | Agrupa y suma unidades vendidas por `producto` en un objeto diccionario. | $O(n)$ | $O(n)$ *(diccionario $O(p)$)* | `.filter()` crea un arreglo intermedio $O(n)$ y el objeto acumula $p$ productos distintos ($p \le n$). | `3.051 ms` |
| `topProductosPorValor(ventas, k)` | Agrupa ingresos por producto, ordena de mayor a menor sin mutar el origen y toma `k`. | $O(n + p \log p)$ | $O(n)$ | Crea arreglo filtrado, objeto por producto y arreglo mapeado para `.sort()` (sin mutar `ventas`). | `3.507 ms` |
| `ventasDelDia(ventas, fecha)` | Filtra ventas válidas de una `fecha` y retorna transacciones, unidades, total y ticket promedio. | $O(n)$ | $O(n)$ | `.filter()` crea `registrosDia` (hasta $n$ elementos en el peor caso) y calcula métricas sobre ese subconjunto. | `1.643 ms` |
| `clientesRecurrentes(ventas)` | Identifica clientes con más de una compra mediante bucles anidados y `.includes()`. | $O(n^2)$ *(peor caso $O(n^3)$ con `.includes()`)* | $O(n)$ | Doble ciclo $\frac{n(n-1)}{2}$ más búsqueda lineal `.includes()` sobre `recurrentes` (hasta $O(n)$ elementos). | `400.129 ms` |
| `totalCiudadCadena(ventas, ciudad)` | Normaliza con `.map()`, filtra con `.filter()`, calcula valor con `.map()` y suma con `.reduce()`. | $O(n)$ | $O(n)$ | Realiza 4 recorridos secuenciales ($\le 4n$) y crea **3 arreglos intermedios** (incluyendo clonación de objetos). | `4.81 ms` |
| `totalCiudadUnaPasada(ventas, ciudad)` | Calcula el total de una ciudad en un solo ciclo `for...of` sin arreglos intermedios. | $O(n)$ | $O(1)$ | Un solo recorrido ($n$ iteraciones) y solo variables escalares/cadena; sin arreglos temporales. | `2.659 ms` |

---

## 2. Proyección para `1.000.000` de ventas

A partir de las mediciones obtenidas en el proyecto:

* **Funciones de una sola pasada $O(n)$ en tiempo y $O(1)$ en espacio** (`totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `ventasPorCiudad`, `totalCiudadUnaPasada`):
  * Para $1.000.000$ de ventas ($100\times$ respecto a $10.000$), escalan linealmente en el orden de **~0.13 s a ~0.62 s** según la función (por ejemplo, `totalCiudadUnaPasada` de `2.659 ms` pasa a ~`265.9 ms` $\approx 0.27\text{ s}$), con memoria auxiliar constante $O(1)$.
* **Funciones con métodos de arreglo / agrupaciones** (`totalVendidoM`, `unidadesVendidasM`, `ventasPorCiudadM`, `totalPorCiudad`, `unidadesPorProducto`, `ventasDelDia`, `totalCiudadCadena`, `topProductosPorValor`):
  * Mantienen crecimiento lineal en tiempo ($\times 100$ respecto a $10.000$ ventas), estimándose en **~0.13 s a ~0.92 s** (por ejemplo, `totalCiudadCadena` de `4.81 ms` pasa a ~`481 ms` $\approx 0.48\text{ s}$, y `totalPorCiudad` de `9.169 ms` a ~`916.9 ms` $\approx 0.92\text{ s}$), pero con **memoria auxiliar $O(n)$** por arreglos intermedios.
* **Función `clientesRecurrentes(ventas)` ($O(n^2)$ / costo de `.includes()`):**
  * Partiendo de `400.129 ms` en $n = 10.000$, escalar a $1.000.000$ de ventas ($100\times$ más registros $\implies 100^2 = 10.000\times$ más trabajo cuadrático) arroja una estimación de **~`4.001,29 segundos` ($\approx 66,7\text{ minutos}$ / más de una hora)** bloqueando el hilo de ejecución.

---

## 3. Riesgos (de mayor a menor riesgo al crecer los datos)

**Criterio de ordenamiento:** Se prioriza primero el **crecimiento temporal asintótico** ($O(n^2)$ frente a $O(n)$ frente a $O(1)$) y, dentro de una misma clase temporal, el **consumo de memoria auxiliar** ($O(n)$ con arreglos intermedios/clonación frente a $O(1)$ con variables escalares) en un servidor con memoria limitada.

1. **`clientesRecurrentes` — Riesgo Crítico:** Complejidad temporal $O(n^2)$ (con búsqueda `.includes()` adicional) y espacio $O(n)$. Con `400.129 ms` en `10.000` ventas, se vuelve inviable en historiales grandes.
2. **`topProductosPorValor` — Riesgo Alto:** Tiempo $O(n + p \log p)$ y espacio $O(n)$ por múltiples estructuras intermedias (filtrado, diccionario y arreglo ordenado sin mutar la entrada).
3. **`totalCiudadCadena` — Riesgo Medio-Alto:** Tiempo $O(n)$ pero con 4 recorridos y **3 arreglos intermedios** (`map` clonando objetos, `filter`, `map`, `reduce`), generando mayor asignación de memoria y trabajo del *Garbage Collector* que `totalCiudadUnaPasada` (`4.81 ms` vs. `2.659 ms` en `10.000` ventas).
4. **`totalPorCiudad`, `unidadesPorProducto`, `ventasDelDia` — Riesgo Medio:** Tiempo $O(n)$ y espacio auxiliar $O(n)$ por arreglos intermedios (`.filter()`) y estructuras acumuladoras según ciudades/productos/fechas.
5. **`totalVendidoM`, `unidadesVendidasM`, `ventasPorCiudadM` — Riesgo Medio-Bajo:** Tiempo $O(n)$ (2 pasadas), pero crean un arreglo intermedio en `.filter()` ($O(n)$ en espacio) a diferencia de las versiones con `for...of`.
6. **`totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `ventasPorCiudad`, `totalCiudadUnaPasada` — Riesgo Bajo:** Tiempo lineal $O(n)$ en una sola pasada y **memoria auxiliar constante $O(1)$**.
7. **`valorVenta` y `primeraVenta` — Riesgo Mínimo:** Tiempo constante $O(1)$ (`0.108 ms` en `primeraVenta` para `10.000` ventas) y memoria auxiliar $O(1)$.

---

## 4. Plan de optimización (sin implementar en `v0.2`)

**Función objetivo (mayor riesgo):** `clientesRecurrentes(ventas)`.

* **¿Qué trabajo se repite?**
  1. Cada venta `i` se compara contra todas las ventas posteriores `j` ($\frac{n(n-1)}{2}$ pares), repitiendo comparaciones incluso para clientes ya identificados.
  2. Ante cada coincidencia, `!recurrentes.includes(ventas[i].cliente)` recorre desde el inicio el arreglo `recurrentes` para comprobar si el cliente ya está incluido.
* **¿Qué información se podría guardar para no buscarla de nuevo?**
  * Recorrer `ventas` **una sola vez** ($O(n)$ en tiempo) y guardar en un diccionario/objeto o `Map` (`conteoPorCliente`) el número de compras acumuladas por cliente (y un `Set` de `agregados` para registrar en $O(1)$ cuando el conteo supere `1`).
  * Así se eliminan los ciclos anidados y las búsquedas lineales repetidas, reduciendo el tiempo de cientos de milisegundos/minutos a unos pocos milisegundos incluso en volúmenes altos.