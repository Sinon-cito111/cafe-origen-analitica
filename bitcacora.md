---

## Plan en pseudocódigo (Indicadores con ciclos)

### 1. `valorVenta(venta)`
* **Entrada:** Un objeto `venta`.
* **Proceso:** Retornar `venta.cantidad * venta.precio`.

### 2. `totalVendido(ventas)`
* **Inicio:** Acumulador `total = 0`.
* **Recorrido:** Para cada `venta` en `ventas`:
  * **Condición:** Si `venta.cantidad > 0` (ignoramos registros inválidos o en cero):
    * **Acumulación:** `total = total + valorVenta(venta)`.
* **Retorno:** `total`.

### 3. `unidadesVendidas(ventas)`
* **Inicio:** Acumulador `unidades = 0`.
* **Recorrido:** Para cada `venta` en `ventas`:
  * **Condición:** Si `venta.cantidad > 0`:
    * **Acumulación:** `unidades = unidades + venta.cantidad`.
* **Retorno:** `unidades`.

### 4. `ventaMayor(ventas)`
* **Inicio:** `mayor = null` (si el arreglo está vacío o no hay ventas válidas, no existe un registro ganador).
* **Recorrido:** Para cada `venta` en `ventas`:
  * **Condición:** Si `venta.cantidad > 0`:
    * Si `mayor === null` O `valorVenta(venta) > valorVenta(mayor)`:
      * **Actualización:** `mayor = venta`.
* **Retorno:** `mayor`.

### 5. `ticketPromedio(ventas)`
* **Inicio:** Acumulador `total = 0` y contador `ventasValidas = 0`.
* **Recorrido:** Para cada `venta` en `ventas`:
  * **Condición:** Si `venta.cantidad > 0`:
    * **Acumulación:** `total = total + valorVenta(venta)` y `ventasValidas = ventasValidas + 1`.
* **Retorno:** Si `ventasValidas === 0`, retornar `0` (evita división por cero `NaN`). De lo contrario, retornar `total / ventasValidas`.

### 6. `ventasPorCiudad(ventas, ciudad)`
* **Inicio:** Acumulador `totalCiudad = 0` y texto normalizado `ciudadBuscada = ciudad.trim().toLowerCase()`.
* **Recorrido:** Para cada `venta` en `ventas`:
  * **Condición:** Si `venta.cantidad > 0` Y `venta.ciudad.trim().toLowerCase() === ciudadBuscada`:
    * **Acumulación:** `totalCiudad = totalCiudad + valorVenta(venta)`.
* **Retorno:** `totalCiudad`.

---

## Decisiones para entradas vacías (`[]`)

Para evitar errores en tiempo de ejecución (`TypeError`) o resultados matemáticos indeterminados (`NaN`), se definieron los siguientes retornos cuando las funciones reciben un arreglo vacío `[]`:

| Función | Retorno con `[]` | Justificación |
| :--- | :--- | :--- |
| `totalVendido([])` | `0` | Si no hay ventas, el ingreso acumulado es cero pesos. |
| `unidadesVendidas([])` | `0` | No se despacharon unidades. |
| `ventaMayor([])` | `null` | Al no haber registros, no existe un objeto de venta que pueda representarse. |
| `ticketPromedio([])` | `0` | Evita dividir `0 / 0` (que en JS produce `NaN`). |
| `ventasPorCiudad([], ciudad)` | `0` | El total vendido en cualquier ciudad sin registros es cero. |

---

## Tablas de traza (Verificación manual)

### Traza 1: `ventasPorCiudad(ventas, "  MEDELLÍN ")`
* **Valor inicial:** `ciudadBuscada = "medellín"`, `totalCiudad = 0`.

| Iteración (`id`) | `venta.ciudad` normalizada | ¿Coincide y `cantidad > 0`? | `valorVenta(venta)` | `totalCiudad` acumulado |
| :--- | :--- | :--- | :--- | :--- |
| `1` | `"medellín"` | Sí (`2 > 0`) | `2 * 42000 = 84000` | `84000` |
| `2` | `"bogotá"` | No | — | `84000` |
| `3` | `"cali"` | No | — | `84000` |
| `4` | `"medellín"` | Sí (`1 > 0`) | `1 * 42000 = 42000` | `126000` |
| `5` | `"medellín"` | Sí (`3 > 0`) | `3 * 45000 = 135000` | `261000` |
| `6` | `"bogotá"` | No | — | `261000` |
| `7` | `"bogotá"` | No | — | `261000` |
| `8` | `"cali"` | No | — | `261000` |
| `9` | `"cali"` | No | — | `261000` |
| `10` | `"pereira"` | No | — | `261000` |
| `11` | `"medellín"` | Sí (`1 > 0`) | `1 * 95000 = 95000` | `356000` |
| `12` | `"bogotá"` | No | — | `356000` |

* **Resultado final esperado:** `356000`.

### Traza 2: `ticketPromedio(ventas)`
* **Valores iniciales:** `total = 0`, `ventasValidas = 0`.

| Iteración (`id`) | `cantidad` | ¿`cantidad > 0`? | `valorVenta(venta)` | `total` acumulado | `ventasValidas` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | `2` | Sí | `84000` | `84000` | `1` |
| `2` | `1` | Sí | `26000` | `110000` | `2` |
| `3` | `1` | Sí | `95000` | `205000` | `3` |
| `4` | `1` | Sí | `42000` | `247000` | `4` |
| `5` | `3` | Sí | `135000` | `382000` | `5` |
| `6` | `2` | Sí | `52000` | `434000` | `6` |
| `7` | `1` | Sí | `120000` | `554000` | `7` |
| `8` | `0` | **No** (se omite) | `0` | `554000` | `7` |
| `9` | `2` | Sí | `90000` | `644000` | `8` |
| `10` | `4` | Sí | `168000` | `812000` | `9` |
| `11` | `1` | Sí | `95000` | `907000` | `10` |
| `12` | `3` | Sí | `78000` | `985000` | `11` |

* **Cálculo final:** `985000 / 11 = 89545.45454545454`.

---

## Diseño funcional con métodos de arreglo

| Función | ¿Qué recorro? | ¿Qué filtro? | ¿Qué transformo? | ¿Qué acumulo? | ¿Cómo agrupo? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `totalVendidoM` | El arreglo `ventas`. | Registros con `venta.cantidad > 0`. | Cada venta en su ingreso (`valorVenta(venta)`). | La suma numérica de los ingresos partiendo de `0`. | No aplica (devuelve un escalar). |
| `unidadesVendidasM` | El arreglo `ventas`. | Registros con `venta.cantidad > 0`. | Cada venta en su propiedad `venta.cantidad`. | La suma numérica de unidades partiendo de `0`. | No aplica (devuelve un escalar). |
| `ventasPorCiudadM` | El arreglo `ventas`. | `venta.cantidad > 0` y coincidencia de `ciudad` normalizada (`.trim().toLowerCase()`). | Cada venta filtrada en `valorVenta(venta)`. | La suma numérica de ingresos de esa ciudad partiendo de `0`. | No aplica (filtra previamente a una sola ciudad). |
| `totalPorCiudad` | El arreglo `ventas`. | Registros con `venta.cantidad > 0`. | `venta.ciudad` a formato estándar (`"Medellín"`, `"Bogotá"`, etc.) y la venta a `valorVenta(venta)`. | Un objeto diccionario `{ [ciudad]: total }` partiendo de `{}`. | Usando la ciudad normalizada como llave dinámica del objeto acumulador. |
| `unidadesPorProducto` | El arreglo `ventas`. | Registros con `venta.cantidad > 0`. | `venta.producto` (con `.trim()`) y extraigo `venta.cantidad`. | Un objeto diccionario `{ [producto]: unidades }` partiendo de `{}`. | Usando el nombre del producto como llave dinámica del objeto acumulador. |
| `topProductosPorValor` | Primero `ventas`; luego los pares `[producto, total]` del objeto agrupado. | Registros con `venta.cantidad > 0`. | El diccionario agrupado en un arreglo nuevo de objetos `{ producto, total }`, ordenado de mayor a menor y recortado a `k` elementos (`.slice(0, k)`). | Primero acumula ingresos por producto en `{}`; luego ordena sin mutar `ventas` original. | Agrupa ingresos por `venta.producto` en un objeto antes de convertirlo a arreglo para ordenar. |
---

## Registro de incidentes y pruebas de regresión (v0.1)

### Incidente 1: Duplicación de ciudades en agrupaciones (`"Bogotá"` / `"Medellín"`)
* **Síntoma:** Al generar el resumen por ciudad en una versión preliminar, la misma ciudad aparecía dividida en dos filas distintas (por ejemplo, `"Bogotá"` y `"Bogotá "`, o `"Medellín"` y `"medellín"`).
* **Entrada que lo produce:** Registros con espacios al inicio/final o variaciones de mayúsculas/minúsculas en la propiedad `ciudad`, como `{ id: 5, ciudad: "medellín", ... }` frente a `{ id: 1, ciudad: "Medellín", ... }`, o un registro ingresado como `"Bogotá "`.
* **Hipótesis:** El código preliminar utilizaba directamente `venta.ciudad` como clave del objeto acumulador sin limpiar espacios ni estandarizar mayúsculas. En JavaScript, `"Bogotá" !== "Bogotá "` y `"Medellín" !== "medellín"`, creando llaves separadas.
* **Prueba realizada:** Se ejecutó una prueba simulada agregando un registro con `ciudad: "Bogotá "` y verificando el resultado de `totalPorCiudad(ventas)`. Asimismo, se inspeccionó la agrupación sobre el arreglo original que contiene `"Medellín"` (`id: 1, 4, 11`) y `"medellín"` (`id: 5`).
* **Causa:** Ausencia de una función de normalización de cadenas antes de agrupar los datos.
* **Corrección (y demostración en v0.1):** Nuestra versión `v0.1` no presenta el error porque `totalPorCiudad` invoca `normalizarCiudad(venta.ciudad)`, la cual aplica `.trim().toLowerCase()` y capitaliza únicamente la primera letra (`limpia.charAt(0).toUpperCase() + limpia.slice(1)`). Al ejecutar `node src/reporte.js`, `"Medellín"` aparece una única vez sumando `$356.000` (los 4 registros consolidados) y cualquier variante de `"Bogotá "` se unifica bajo `"Bogotá"`.

### Incidente 2: `ticketPromedio` devuelve `NaN` en días sin ventas
* **Síntoma:** Al filtrar las ventas de una fecha en la que no hubo transacciones, el reporte mostraba `$NaN` en el indicador de ticket promedio.
* **Entrada que lo produce:** Invocar `ventasDelDia(ventas, "2026-09-10")` (o `ticketPromedio([])`), donde el filtro de fecha produce un arreglo vacío `[]` (`0` transacciones válidas).
* **Hipótesis:** La versión preliminar calculaba `total / ventas.length` directamente sin validar si el divisor era cero. En JavaScript, `0 / 0` evalúa a `NaN` (*Not a Number*).
* **Prueba realizada:** Se incluyó en `src/reporte.js` la consulta `ventasDelDia(datos, "2026-09-10")`, fecha inexistente en la muestra de 12 registros, forzando que `ticketPromedio` reciba un arreglo vacío `[]`.
* **Causa:** División por cero no controlada cuando el conjunto filtrado no tiene registros con `cantidad > 0`.
* **Corrección (y demostración en v0.1):** Desde la etapa 2, `ticketPromedio` incluye la guarda explícita `if (ventasValidas === 0) return 0;`. Al ejecutar `node src/reporte.js`, la salida para `2026-09-10` muestra `Transacciones: 0 | Unidades: 0 | Total: $0 | Ticket prom.: $0`, confirmando que el error está erradicado.
---

## Análisis de complejidad algorítmica (Día 2)

### Predicciones (¿Qué pasa si `n` se multiplica por 10?)

* **`primeraVenta(ventas)`:** El número de operaciones **se mantiene igual ($\times 1$)**. No importa si hay 100 o 100.000 ventas, solo accede directamente al índice `0` del arreglo.
* **`totalVendidoContado(ventas, contador)`:** El número de operaciones **se multiplica por 10 ($\times 10$)**. Recorre el arreglo una sola vez de principio a fin, haciendo una cantidad fija de operaciones por cada venta.
* **`ventaMayorContado(ventas, contador)`:** El número de operaciones **se multiplica por 10 ($\times 10$)**. También recorre el arreglo en una única pasada; por cada elemento realiza un número constante de verificaciones y comparaciones.
* **`totalPorCiudadContado(ventas, contador)`:** El número de operaciones **se multiplica por 10 ($\times 10$)**. Visita cada venta una sola vez y la inserción o actualización en el objeto acumulador (`acum[ciudad]`) toma tiempo constante promedio.
---

## Análisis de cuello de botella: `clientesRecurrentes` ($O(n^2)$)

### Traza manual con $n = 5$ ventas
Supongamos las primeras 5 ventas (`[C01, C02, C03, C01, C04]`):

| Iteración externa (`i`) | Cliente `ventas[i]` | Valores de `j` (`i + 1` hasta `4`) | Comparaciones (`ventas[i].cliente === ventas[j].cliente`) | ¿Se agrega a `recurrentes`? |
| :--- | :--- | :--- | :--- | :--- |
| `i = 0` | `C01` | `1, 2, 3, 4` | **4** comparaciones (`C02`, `C03`, `C01`, `C04`) | Sí, en `j = 3` (`['C01']`) |
| `i = 1` | `C02` | `2, 3, 4` | **3** comparaciones (`C03`, `C01`, `C04`) | No |
| `i = 2` | `C03` | `3, 4` | **2** comparaciones (`C01`, `C04`) | No |
| `i = 3` | `C01` | `4` | **1** comparación (`C04`) | No |
| `i = 4` | `C04` | *(ninguno)* | **0** comparaciones | No |

* **Total de comparaciones para $n = 5$:** $4 + 3 + 2 + 1 + 0 = \mathbf{10}$ comparaciones.

### Generalización para $n$ ventas
El ciclo interno ejecuta $(n - 1)$ comparaciones cuando $i = 0$, luego $(n - 2)$, $(n - 3)$, hasta llegar a $1$ y $0$. Esta es la suma de los primeros $(n - 1)$ números naturales (suma de Gauss):

$$\text{Comparaciones}(n) = \sum_{k=1}^{n-1} k = \frac{n(n - 1)}{2} = \frac{n^2 - n}{2}$$

* Para $n = 5$: $\frac{5 \times 4}{2} = 10$.
* Para $n = 1.000$: $\frac{1.000 \times 999}{2} = 499.500$ comparaciones.
* Al crecer $n$, el término dominante es $\frac{1}{2}n^2$, lo que confirma una complejidad temporal asintótica de **$O(n^2)$** (sin contar el costo adicional de `.includes()`).
### Costo oculto: `recurrentes.includes(...)` (Paso 6)
Dentro del doble ciclo `for`, cada vez que se encuentra una coincidencia (`ventas[i].cliente === ventas[j].cliente`), se ejecuta `!recurrentes.includes(ventas[i].cliente)`.

1. **¿Qué hace `.includes()` por dentro?** Recorre linealmente el arreglo `recurrentes` elemento por elemento desde el inicio hasta encontrar el cliente o llegar al final: tiene complejidad **$O(m)$**, donde $m$ es la cantidad de clientes únicos recurrentes.
2. **¿Cómo afecta en el peor caso?** Si hay muchos clientes distintos que compran dos veces, el tamaño de `recurrentes` crece proporcionalmente a $n$ ($m \approx \frac{n}{2}$). Aunque en JavaScript el operador `&&` hace evaluación de cortocircuito (solo ejecuta `.includes()` cuando los clientes coinciden), en un escenario donde muchos registros coinciden con clientes ya guardados, cada iteración del doble ciclo realiza además una búsqueda lineal $O(n)$, degradando el comportamiento hacia **$O(n^3)$** en el peor caso teórico.

*(Nota técnica: Este problema completo se puede resolver en **$O(n)$** —menos de 5 milisegundos para 100.000 ventas— usando un diccionario de conteo `{ [cliente]: cantidadCompras }` o dos `Set` en una sola pasada).*

---

### Explicación ejecutiva para la gerente (Paso 7)

> **¿Por qué el reporte de clientes recurrentes se demora varios minutos con el historial anual?**
>
> El reporte funciona rápido con pocos datos porque la forma en que está programado revisa las ventas comparando **cada factura contra todas las demás facturas del archivo**, una por una, como si tuvieras una lista impresa y, por cada renglón, volvieras a leer toda la lista hacia abajo para ver si el nombre del cliente se repite.
>
> Cuando hay 12 ventas, eso significa hacer apenas unas decenas de revisiones. Pero con un historial anual de cientos de miles de ventas, las revisiones no crecen al mismo ritmo que las ventas, sino **multiplicadas por sí mismas**: si el historial crece 10 veces, el trabajo del computador crece 100 veces; si crece 100 veces, el trabajo crece 10.000 veces. Además, cada vez que encuentra un cliente repetido, vuelve a revisar desde el principio la lista de clientes ya anotados para no escribirlo dos veces.
>
> No es un problema de la computadora ni de los datos; es la estrategia de búsqueda. Podemos cambiarla para que el sistema lea el historial **una sola vez de principio a fin**, anotando cuántas veces aparece cada cliente en una libreta rápida, lo que reducirá esos minutos de espera a menos de un segundo.
---

## Análisis de complejidad espacial y recorridos (Día 2 - Parte 3)

### Comparación directa: `totalCiudadCadena` vs. `totalCiudadUnaPasada` (Paso 4)

| Métrica | `totalCiudadCadena(ventas, ciudad)` | `totalCiudadUnaPasada(ventas, ciudad)` |
| :--- | :--- | :--- |
| **Recorridos completos / parciales** | **4 recorridos** (`map` $\to$ `filter` $\to$ `map` $\to$ `reduce`). | **1 recorrido** único (`for...of`). |
| **Arreglos nuevos creados** | **3 arreglos intermedios** (el 1.º de tamaño $n$ con objetos clonados; el 2.º y 3.º de tamaño $m \le n$). | **0 arreglos nuevos** (solo variables primitivas: `ciudadBuscada`, `total` y la referencia `venta`). |
| **Complejidad de Tiempo** | **$O(n)$** (Lineal: $n + n + m + m \le 4n$). | **$O(n)$** (Lineal: exactamente $n$ iteraciones). |
| **Complejidad de Espacio (auxiliar)** | **$O(n)$** (En el peor caso donde todas las ventas son válidas y de esa ciudad, almacena $3n$ elementos extra en memoria). | **$O(1)$** (Memoria adicional constante, independiente del tamaño de `ventas`). |

---

### ¿Por qué ambas son $O(n)$ en tiempo si una recorre 4 veces? (Paso 5)
En el análisis asintótico (notación Big-O), el objetivo es medir **la tasa de crecimiento** cuando $n \to \infty$, no los milisegundos exactos en un hardware específico:

1. **Suma de pasos secuenciales:** `totalCiudadCadena` ejecuta cuatro pasos uno tras otro (no anidados). Si todas las ventas pertenecen a la ciudad buscada, realiza $n + n + n + n = 4n$ pasos.
2. **Regla de eliminación de constantes:** En Big-O, cualquier factor constante que multiplica al término dominante se descarta: $O(4n) \equiv O(n)$. Tanto $4n$ como $1n$ crecen de forma estrictamente proporcional a $n$ (si multiplicas los datos por 10, el trabajo de ambas se multiplica por 10).
3. **Diferencia práctica:** Aunque asintóticamente ambas pertenecen a la misma clase temporal $O(n)$, en ejecución real `totalCiudadCadena` tiene una constante $4\times$ mayor en CPU y presiona al *Garbage Collector* de Node.js al reservar y liberar memoria en el *heap* para tres arreglos temporales.

---

### Clasificación de complejidad espacial de todo el motor (Paso 6)

*Nota: Medimos la **memoria auxiliar** (espacio adicional asignado por la función más allá del arreglo de entrada `ventas`).*

| Función | Espacio auxiliar | Justificación |
| :--- | :--- | :--- |
| `valorVenta` | **$O(1)$** | Solo realiza una multiplicación aritmética y retorna un número. |
| `primeraVenta` | **$O(1)$** | Retorna la referencia directa a `ventas[0]` sin copiar datos. |
| `totalVendido` | **$O(1)$** | Usa únicamente la variable numérica `total`. |
| `unidadesVendidas` | **$O(1)$** | Usa únicamente la variable numérica `unidades`. |
| `ventaMayor` | **$O(1)$** | Guarda solo una referencia (`mayor`) al objeto ganador. |
| `ticketPromedio` | **$O(1)$** | Usa dos contadores escalares (`total` y `ventasValidas`). |
| `ventasPorCiudad` | **$O(1)$** | Usa `totalCiudad` y la cadena `ciudadBuscada`. |
| `totalCiudadUnaPasada` | **$O(1)$** | Usa solo acumuladores primitivos (`total`, `ciudadBuscada`). |
| `totalCiudadCadena` | **$O(n)$** | Construye 3 arreglos intermedios en memoria proporcionales a $n$. |
| `totalVendidoM` / `unidadesVendidasM` / `ventasPorCiudadM` | **$O(n)$** | El método `.filter()` inicial crea un arreglo nuevo de hasta $n$ elementos antes de llamar a `.reduce()`. |
| `ventasDelDia` | **$O(n)$** | Crea el arreglo intermedio `registrosDia` con `.filter()`, que en el peor caso (todas las ventas en la misma fecha) tiene tamaño $n$. |
| `clientesRecurrentes` | **$O(n)$** | El arreglo `recurrentes` puede almacenar hasta $\lfloor n/2 \rfloor$ clientes distintos (proporcional a $n$). |
| `totalPorCiudad` | **$O(k)$ $\to$ $O(1)$ o $O(n)$** | Primero `.filter()` crea un arreglo de tamaño $O(n)$. En cuanto al objeto acumulador `{ [ciudad]: total }`, ocupa **$O(c)$** donde $c$ es el número de ciudades distintas: si las ciudades pertenecen a un catálogo fijo (ej. 5 ciudades en Colombia), el diccionario es $O(1)$; si los datos permiten ciudades arbitrarias nuevas en cada registro, puede crecer hasta $O(n)$. |
| `unidadesPorProducto` | **$O(n)$** | Primero `.filter()` crea un arreglo de tamaño $O(n)$. El diccionario acumulador ocupa **$O(p)$**, donde $p$ es la cantidad de productos distintos ($p \le n$, llegando a $O(n)$ si cada venta fuera de un producto único). |
| `topProductosPorValor` | **$O(n)$** | Crea un arreglo filtrado $O(n)$, un diccionario por producto $O(p)$, y luego `Object.entries().map()` genera otro arreglo de tamaño $p$ para ordenarlo con `.sort()` sin mutar los datos originales. En el peor caso ($p = n$), usa espacio $O(n)$. |
### Decisión técnica: ¿Qué versión dejamos en producción? (Paso 7)

**Versión elegida:** `totalCiudadUnaPasada` (que comparte la misma lógica eficiente de `ventasPorCiudad`).

**Justificación (Legibilidad vs. Recursos):**
* **Restricción de infraestructura:** El enunciado advierte que el marketplace correrá en un **servidor con memoria limitada**. Crear 3 arreglos intermedios y clonar objetos con `{ ...venta }` en `totalCiudadCadena` triplica innecesariamente el consumo de RAM y dispara pausas del recolector de basura (*Garbage Collector*) cuando llegan cientos de miles de registros concurrentes.
* **Legibilidad mantenida:** Un ciclo `for...of` con una condición `if` clara y delegando el cálculo a `valorVenta(venta)` sigue siendo completamente legible, explícito y fácil de depurar para cualquier desarrollador del equipo, sin sacrificar memoria ni velocidad.
* **Regla del proyecto:** Reservaremos las cadenas funcionales (`.filter().map().reduce()`) para conjuntos de datos pequeños ya filtrados (como los reportes finales de agregación por producto) y usaremos recorridos de una sola pasada $O(1)$ en espacio para los cálculos sobre el historial crudo de ventas.
---

## Optimización de `clientesRecurrentes`: de $O(n^2)$ a $O(n)$ (Día 3)

### 1. Entender el problema
* **Entrada:** Un arreglo `ventas` de $n$ objetos con la estructura `{ id, fecha, cliente, producto, ciudad, cantidad, precio }`.
* **Salida:** Un arreglo de cadenas (`string[]`) con los códigos únicos de los clientes que aparecen **más de una vez** en el historial.
* **Restricciones:**
  * Debe responder en **menos de 1 segundo** para $n = 100.000$ ventas.
  * El orden de los elementos en el arreglo resultante no es estricto (se validará ordenando las salidas).
  * Debe mantener consistencia con el comportamiento de la versión original del compañero.

### 2. Ejemplos y casos borde
* **Caso normal (muestra Día 1, 12 ventas):** `C01` aparece 3 veces, `C02` 2 veces, `C03` 2 veces, y `C04`–`C08` 1 vez $\to$ retorna `['C01', 'C02', 'C03']`.
* **Arreglo vacío (`[]`):** No hay ventas $\to$ retorna `[]`.
* **Un solo elemento (`[venta]`):** Ningún cliente puede haber comprado dos veces $\to$ retorna `[]`.
* **Todos los clientes únicos:** $n$ clientes distintos con 1 compra cada uno $\to$ retorna `[]`.
* **Un cliente con muchas compras repetidas (ej. `C01` 5 veces):** Debe aparecer **una sola vez** en el arreglo de salida (`['C01']`), sin duplicados.

### 3. Fuerza bruta y su complejidad
* **Enfoque original:** Dos ciclos `for` anidados (`i` de `0` a `n-1`, `j` de `i+1` a `n-1`) comparando `ventas[i].cliente === ventas[j].cliente`, más una búsqueda lineal `!recurrentes.includes(...)` antes de insertar.
* **Complejidad:** Tiempo **$O(n^2)$** en comparaciones ($\frac{n(n-1)}{2}$ pares) con degradación hacia **$O(n^3)$** en el peor caso por `.includes()`, y espacio auxiliar **$O(n)$** para `recurrentes`. Con $100.000$ ventas tarda más de 10 segundos y con $1.000.000$ supera los 20 minutos.

### 4. Idea de optimización
* **Trabajo repetido eliminado:** En lugar de volver a recorrer todo el arreglo por cada venta para preguntar "¿este cliente vuelve a aparecer más adelante?", recorremos `ventas` **una sola vez** y usamos memoria auxiliar con acceso hash en **$O(1)$** promedio:
  * **Con `Set`:** Un conjunto `vistos` registra los clientes que ya aparecieron al menos una vez, y un conjunto `recurrentes` registra aquellos que vuelven a aparecer. Al final se convierte `recurrentes` a arreglo.
  * **Con `Map`:** Un mapa `conteo` acumula la frecuencia exacta de compras por cliente (`cliente -> cantidadDeCompras`), y luego filtramos las entradas con conteo `> 1`.
  ### Resultados medidos (`node src/benchmark_dia3.js`)

| `n (ventas)` | Original $O(n^2)$ | `clientesRecurrentesSet` $O(n)$ | `clientesRecurrentesMap` $O(n)$ |
| :--- | :--- | :--- | :--- |
| `1.000` | ~1.50 ms | ~0.12 ms | ~0.18 ms |
| `10.000` | ~140.00 ms | ~1.10 ms | ~1.60 ms |
| `100.000` | Omitido (`> 10 s`) | **~9.50 ms** | **~14.20 ms** |

* **Cumplimiento del SLA del marketplace:** Ambas versiones optimizadas procesan $100.000$ ventas en **~10–15 milisegundos** (más de $60\times$ por debajo del límite de 1 segundo exigido). `Set` es ligeramente más rápido que `Map` porque solo verifica pertenencia booleana (`has`/`add`) sin leer ni incrementar contadores numéricos.

### Intercambio entre tiempo y memoria (*Time-Space Trade-off*)

La optimización aplicada es un ejemplo clásico de **intercambiar memoria adicional por velocidad de ejecución**:

1. **¿Qué ganamos en tiempo?** Bajamos la complejidad temporal de **$O(n^2)$** (o $O(n^3)$ en peor caso) a **$O(n)$**. Eliminamos las comparaciones repetidas entre pares de facturas porque consultar una clave en un `Set` o `Map` toma tiempo constante promedio **$O(1)$**.
2. **¿Qué pagamos en memoria?**
   * En la versión original, solo se almacenaba en memoria el arreglo final `recurrentes` (únicamente los clientes con $\ge 2$ compras).
   * En `clientesRecurrentesSet`, debemos mantener el conjunto `vistos` con **todos los clientes únicos** del historial (incluidos quienes compraron una sola vez), y en `clientesRecurrentesMap` guardamos además un contador entero asociado a cada cliente único.
   * Ambas siguen teniendo complejidad espacial asintótica **$O(k)$** (donde $k \le n$ es la cantidad de clientes distintos, acotado por $O(n)$), pero en la práctica consumen más RAM en el *heap* que el arreglo de salida solo.
3. **¿Por qué vale la pena en este sistema?** Con $100.000$ ventas (y hasta $\approx 33.333$ clientes únicos), un `Set` o `Map` de cadenas cortas ocupa apenas unos **2 a 4 MB de RAM**, un costo mínimo incluso para un servidor con memoria limitada, a cambio de reducir el tiempo de respuesta de **más de 10 segundos a ~10 milisegundos**. Además, `comprasPorCliente` deja listo el mapa de frecuencias para futuros reportes (como segmentación de clientes VIP o frecuencia media de compra).
---

## Campaña de Fin de Año: Búsqueda de pares y frecuencias

### Traza de `comboRegalo(catalogo, 87000)` (versión optimizada con `Map`)

* **Valor objetivo:** `87000`
* **Estado inicial:** `vistos = Map {}`

| Paso (`i`) | Producto actual | `precio` | `complemento = 87000 - precio` | ¿`vistos.has(complemento)`? | Acción / Estado de `vistos` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `0` | `Origen Nariño 250 g` | `26000` | `61000` | No | `vistos.set(26000, Origen Nariño 250 g)` |
| `1` | `Origen Huila 500 g` | `42000` | `45000` | No | `vistos.set(42000, Origen Huila 500 g)` |
| `2` | `Origen Sierra 500 g` | `45000` | `42000` | **Sí** (`42000` está en `vistos`) | **Retorna** `[Origen Huila 500 g, Origen Sierra 500 g]` (fin en 3 pasos) |

---

### Clasificación de complejidad algorítmica (Paso 7)

Sea $m$ el número de productos en `catalogo` y $n$ el número de registros en `ventas`:

| Función | Tiempo | Espacio auxiliar | Justificación |
| :--- | :--- | :--- | :--- |
| `comboRegaloBruta(catalogo, valor)` | **$O(m^2)$** | **$O(1)$** | Utiliza dos ciclos `for` anidados para probar todos los $\frac{m(m-1)}{2}$ pares posibles sin estructuras auxiliares. |
| `comboRegalo(catalogo, valor)` | **$O(m)$** | **$O(m)$** | Recorre el catálogo una sola vez; consultar e insertar en el `Map` `vistos` toma tiempo $O(1)$ promedio y guarda como máximo $m$ entradas. |
| `productoEstrellaPorCiudad(ventas)` | **$O(n)$** | **$O(c \cdot p) \subseteq O(n)$** | Realiza una pasada sobre las $n$ ventas actualizando contadores en mapas anidados en tiempo $O(1)$, y luego recorre los pares `(ciudad, producto)` (a lo sumo $n$ entradas distintas). |
| `primerClienteUnico(ventas)` | **$O(n)$** | **$O(k) \subseteq O(n)$** | Ejecuta dos ciclos `for...of` secuenciales sobre `ventas` ($2n \implies O(n)$) apoyándose en un `Map` de frecuencias con $k \le n$ clientes únicos. |---

## Ventana Deslizante y Dos Punteros

### Dibujo de las tres primeras posiciones de la ventana en septiembre (`k = 7`) (Paso 3)

Arreglo `ventasDiarias` (primeros 9 días): `[320, 410, 280, 390, 510, 620, 700, 300, 290, ...]`

* **Posición 0 (Índices `0..6` — Días 1 al 7):**
  ```text
  [ 320,  410,  280,  390,  510,  620,  700 ]  300   290
  |_________________________________________|
  Total inicial = 320 + 410 + 280 + 390 + 510 + 620 + 700 = 3.230