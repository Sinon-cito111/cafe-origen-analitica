# Bitácora de Análisis de Datos - Café Origen (`v0.1`)

## 1. Diccionario de datos

| Propiedad | Tipo de dato (JS) | Significado y descripción |
| :--- | :--- | :--- |
| `id` | `number` | Identificador único y secuencial de la transacción. |
| `fecha` | `string` | Fecha en la que se registró la venta en formato ISO (`YYYY-MM-DD`). |
| `cliente` | `string` | Código identificador único del cliente que realizó la compra (ej. `C01`). |
| `producto` | `string` | Nombre comercial y presentación del café o accesorio vendido. |
| `ciudad` | `string` | Ciudad desde donde se realizó o despachó el pedido. |
| `cantidad` | `number` | Número de unidades adquiridas del producto en esa transacción. |
| `precio` | `number` | Valor unitario del producto en pesos colombianos (COP), sin impuestos ni descuentos aplicados. |

---

## 2. Casos borde detectados en la muestra cruda

1. **Inconsistencia de formato en la propiedad `ciudad` (Registro `id: 5`)**
   * **Problema:** En los registros `1`, `4` y `11` aparece `"Medellín"` con inicial mayúscula, mientras que en el registro `5` aparece `"medellín"` en minúscula. Si se agrupa por ciudad sin normalizar, JavaScript tratará ambas cadenas como ciudades distintas.
   * **Decisión:** Normalizar los textos de la propiedad `ciudad` antes de realizar agrupaciones o conteos aplicando `.trim().toLowerCase()` y estandarizando a formato Título.

2. **Venta con `cantidad` igual a cero (Registro `id: 8`)**
   * **Problema:** El registro `8` (`cliente: "C06"`, `producto: "Origen Huila 500 g"`) tiene `cantidad: 0` con un `precio: 42000`. Esto genera un ingreso de `$0` y puede distorsionar métricas como el ticket promedio por transacción o el conteo de ventas efectivas.
   * **Decisión:** Excluir los registros con `cantidad <= 0` de los cálculos financieros y métricas de ventas efectivas, manteniéndolos en `datos.js` como registros anulados o errores del sistema origen.

3. **Recurrencia de clientes con múltiples compras (Clientes `C01`, `C02` y `C03`)**
   * **Problema:** Un mismo código de cliente aparece en múltiples registros (`C01` en `1`, `4` y `11`; `C02` en `2` y `7`; `C03` en `3` y `9`). Contar los registros totales creyendo que equivalen a clientes únicos sobreestimaría la base de compradores.
   * **Decisión:** Diferenciar entre número de transacciones válidas y clientes únicos al calcular indicadores.

---

## 3. Plan en pseudocódigo (Indicadores con ciclos `for...of`)

* **`valorVenta(venta)`**
  * **Operación:** Devuelve `venta.cantidad * venta.precio`.
* **`totalVendido(ventas)`**
  * **Inicio:** `total = 0`.
  * **Recorrido y condición:** Recorrer cada `venta` en `ventas`; si `venta.cantidad > 0`, acumular `total += valorVenta(venta)`.
  * **Retorno (incluye `[]`):** Devuelve `total` (`0` si está vacío).
* **`unidadesVendidas(ventas)`**
  * **Inicio:** `unidades = 0`.
  * **Recorrido y condición:** Recorrer cada `venta` en `ventas`; si `venta.cantidad > 0`, acumular `unidades += venta.cantidad`.
  * **Retorno (incluye `[]`):** Devuelve `unidades` (`0` si está vacío).
* **`ventaMayor(ventas)`**
  * **Inicio:** `mayor = null`.
  * **Recorrido y condición:** Recorrer cada `venta` en `ventas`; si `venta.cantidad > 0` y (`mayor === null` o `valorVenta(venta) > valorVenta(mayor)`), actualizar `mayor = venta`.
  * **Retorno (incluye `[]`):** Devuelve el objeto `mayor` (`null` si está vacío o sin ventas válidas).
* **`ticketPromedio(ventas)`**
  * **Inicio:** `total = 0`, `ventasValidas = 0`.
  * **Recorrido y condición:** Recorrer cada `venta` en `ventas`; si `venta.cantidad > 0`, sumar `total += valorVenta(venta)` e incrementar `ventasValidas += 1`.
  * **Retorno (incluye `[]`):** Si `ventasValidas === 0`, devolver `0` (evita `NaN`); de lo contrario devolver `total / ventasValidas`.
* **`ventasPorCiudad(ventas, ciudad)`**
  * **Inicio:** `totalCiudad = 0`, `ciudadBuscada = ciudad.trim().toLowerCase()`.
  * **Recorrido y condición:** Recorrer cada `venta`; si `venta.cantidad > 0` y `venta.ciudad.trim().toLowerCase() === ciudadBuscada`, sumar `totalCiudad += valorVenta(venta)`.
  * **Retorno (incluye `[]`):** Devuelve `totalCiudad` (`0` si no hay coincidencias).

---

## 4. Verificación a mano: Tablas de traza

### Traza 1: `totalVendido(ventas)`, `unidadesVendidas(ventas)` y `ticketPromedio(ventas)`

* **Estado inicial:** `total = 0`, `unidades = 0`, `ventasValidas = 0`

| `id` | `producto` | `cantidad` | `precio` | ¿`cantidad > 0`? | `valorVenta` | `total` acum. | `unidades` acum. |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | Origen Huila 500 g | `2` | `42.000` | Sí | `$84.000` | `$84.000` | `2` |
| `2` | Origen Nariño 250 g | `1` | `26.000` | Sí | `$26.000` | `$110.000` | `3` |
| `3` | Prensa francesa | `1` | `95.000` | Sí | `$95.000` | `$205.000` | `4` |
| `4` | Origen Huila 500 g | `1` | `42.000` | Sí | `$42.000` | `$247.000` | `5` |
| `5` | Origen Sierra 500 g | `3` | `45.000` | Sí | `$135.000` | `$382.000` | `8` |
| `6` | Origen Nariño 250 g | `2` | `26.000` | Sí | `$52.000` | `$434.000` | `10` |
| `7` | Molino manual | `1` | `120.000` | Sí | `$120.000` | `$554.000` | `11` |
| `8` | Origen Huila 500 g | `0` | `42.000` | **No** (ignorada) | `$0` | `$554.000` | `11` |
| `9` | Origen Sierra 500 g | `2` | `45.000` | Sí | `$90.000` | `$644.000` | `13` |
| `10` | Origen Huila 500 g | `4` | `42.000` | Sí | `$168.000` | `$812.000` | `17` |
| `11` | Prensa francesa | `1` | `95.000` | Sí | `$95.000` | `$907.000` | `18` |
| `12` | Origen Nariño 250 g | `3` | `26.000` | Sí | `$78.000` | **`$985.000`** | **`21`** |

* **Comprobación:** `total = 985000`, `unidades = 21`, `ventasValidas = 11` $\implies$ `ticketPromedio = 985000 / 11 = 89545.45454545454`. Coincide exactamente con `node src/probar.js`.

### Traza 2: `ventasPorCiudad(ventas, "  MEDELLÍN ")`

* **Normalización inicial:** `ciudadBuscada = "medellín"`, `totalCiudad = 0`

| `id` | `ciudad` original | `ciudadVenta` normalizada | ¿`cantidad > 0` y coincide? | `valorVenta` | `totalCiudad` acum. |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | `"Medellín"` | `"medellín"` | **Sí** | `$84.000` | `$84.000` |
| `2..3` | `"Bogotá"`, `"Cali"` | `"bogotá"`, `"cali"` | No | — | `$84.000` |
| `4` | `"Medellín"` | `"medellín"` | **Sí** | `$42.000` | `$126.000` |
| `5` | `"medellín"` | `"medellín"` | **Sí** *(caso borde)* | `$135.000` | `$261.000` |
| `6..10` | Varias | Varias | No | — | `$261.000` |
| `11` | `"Medellín"` | `"medellín"` | **Sí** | `$95.000` | **`$356.000`** |
| `12` | `"Bogotá"` | `"bogotá"` | No | — | **`$356.000`** |

* **Comprobación:** Resultado manual `356000` coincide exactamente con `node src/probar.js`.

---

## 5. Diseño funcional con métodos de arreglo

| Función | ¿Qué recorro? | ¿Qué filtro? | ¿Qué transformo? | ¿Qué acumulo? | ¿Cómo agrupo? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `totalVendidoM` | El arreglo `ventas`. | Registros con `venta.cantidad > 0`. | Cada venta en su ingreso (`valorVenta(venta)`). | La suma numérica de los ingresos partiendo de `0`. | No aplica (devuelve un escalar). |
| `unidadesVendidasM` | El arreglo `ventas`. | Registros con `venta.cantidad > 0`. | Cada venta en su propiedad `venta.cantidad`. | La suma numérica de unidades partiendo de `0`. | No aplica (devuelve un escalar). |
| `ventasPorCiudadM` | El arreglo `ventas`. | `venta.cantidad > 0` y coincidencia de `ciudad` normalizada (`.trim().toLowerCase()`). | Cada venta filtrada en `valorVenta(venta)`. | La suma numérica de ingresos de esa ciudad partiendo de `0`. | No aplica (filtra previamente a una sola ciudad). |
| `totalPorCiudad` | El arreglo `ventas`. | Registros con `venta.cantidad > 0`. | `venta.ciudad` a formato estándar (`"Medellín"`, `"Bogotá"`, etc.) y la venta a `valorVenta(venta)`. | Un objeto diccionario `{ [ciudad]: total }` partiendo de `{}`. | Usando la ciudad normalizada como llave dinámica del objeto acumulador. |
| `unidadesPorProducto` | El arreglo `ventas`. | Registros con `venta.cantidad > 0`. | `venta.producto` (con `.trim()`) y extraigo `venta.cantidad`. | Un objeto diccionario `{ [producto]: unidades }` partiendo de `{}`. | Usando el nombre del producto como llave dinámica del objeto acumulador. |
| `topProductosPorValor` | Primero `ventas`; luego los pares `[producto, total]` del objeto agrupado. | Registros con `venta.cantidad > 0`. | El diccionario agrupado en un arreglo nuevo de objetos `{ producto, total }`, ordenado de mayor a menor y recortado a `k` elementos (`.slice(0, k)`). | Primero acumula ingresos por producto en `{}`; luego ordena sin mutar `ventas` original. | Agrupa ingresos por `venta.producto` en un objeto antes de convertirlo a arreglo para ordenar. |

---

## 6. Registro de incidentes y pruebas de regresión (`v0.1`)

### Incidente 1: Duplicación de ciudades en agrupaciones (`"Bogotá"` / `"Medellín"`)
* **Síntoma:** Al generar el resumen por ciudad en una versión preliminar, la misma ciudad aparecía dividida en dos filas distintas (por ejemplo, `"Bogotá"` y `"Bogotá "`, o `"Medellín"` y `"medellín"`).
* **Entrada que lo produce:** Registros con espacios al inicio/final o variaciones de mayúsculas/minúsculas en la propiedad `ciudad`, como `{ id: 5, ciudad: "medellín", ... }` frente a `{ id: 1, ciudad: "Medellín", ... }`, o un registro ingresado como `"Bogotá "`.
* **Hipótesis:** El código preliminar utilizaba directamente `venta.ciudad` como clave del objeto acumulador sin limpiar espacios ni estandarizar mayúsculas, haciendo que JavaScript tratara `"Bogotá"` y `"Bogotá "` como llaves diferentes.
* **Prueba realizada:** Se ejecutó `node src/probar_errores.js` agregando un registro con `ciudad: "Bogotá "` sobre los datos existentes (que ya incluyen `"Medellín"` y `"medellín"`), comparando una agrupación cruda frente a `totalPorCiudad(ventasSucias)`.
* **Causa:** Ausencia de normalización de cadenas antes de agrupar los datos (`"Bogotá" !== "Bogotá "` y `"Medellín" !== "medellín"`).
* **Corrección (y demostración en `v0.1`):** En nuestra versión `v0.1`, `totalPorCiudad` invoca `normalizarCiudad(venta.ciudad)`, la cual aplica `.trim().toLowerCase()` y capitaliza únicamente la primera letra (`limpia.charAt(0).toUpperCase() + limpia.slice(1)`). La prueba en `node src/probar_errores.js` demostró que `"Medellín"` consolida sus 4 ventas (`356000`) y `"Bogotá"` unifica tanto `"Bogotá"` como `"Bogotá "` en una única clave (`318000`).

### Incidente 2: `ticketPromedio` devuelve `NaN` en días sin ventas
* **Síntoma:** Al filtrar las ventas de una fecha en la que no hubo transacciones, el reporte mostraba `$NaN` en el indicador de ticket promedio.
* **Entrada que lo produce:** Invocar `ventasDelDia(ventas, "2026-09-10")` (o `ticketPromedio([])`), donde el filtro de fecha produce un arreglo vacío `[]` (`0` transacciones válidas).
* **Hipótesis:** La versión preliminar calculaba `total / ventas.length` directamente sin validar si el divisor era cero. En JavaScript, `0 / 0` evalúa a `NaN` (*Not a Number*).
* **Prueba realizada:** Se ejecutó `node src/probar_errores.js` y `node src/reporte.js` consultando `ventasDelDia(ventas, "2026-09-10")`, fecha inexistente en la muestra de 12 registros, contrastando el cálculo directo `0 / 0` frente a `ventasDelDia`.
* **Causa:** División por cero no controlada cuando el conjunto filtrado no tiene registros con `cantidad > 0`.
* **Corrección (y demostración en `v0.1`):** `ticketPromedio` incorpora la guarda explícita `if (ventasValidas === 0) return 0;`, y `ventasDelDia` delega el cálculo en ella. Tanto en `probar_errores.js` como en `reporte.js`, la salida para `2026-09-10` devuelve `Transacciones: 0 | Unidades: 0 | Total: $0 | Ticket prom.: $0`, confirmando que el error está erradicado[cite: 1].
---

## Análisis de complejidad algorítmica (Día 2 — Parte 1)

### Predicciones antes de medir (si `n` se multiplica por 10)

* **`primeraVenta(ventas)`:** Las operaciones **se mantienen constantes ($\times 1$)**, porque accede directamente al índice `0` sin recorrer el arreglo.
* **`totalVendidoContado(ventas, contador)`:** Las operaciones **se multiplican por 10 ($\times 10$)**, porque recorre las $n$ ventas una sola vez realizando una cantidad fija de operaciones por elemento.
* **`ventaMayorContado(ventas, contador)`:** Las operaciones **se multiplican por 10 ($\times 10$)**, porque recorre el arreglo en una única pasada con un número constante de comparaciones por elemento.
* **`totalPorCiudadContado(ventas, contador)`:** Las operaciones **se multiplican por 10 ($\times 10$)**, porque visita cada registro una sola vez y actualiza el objeto acumulador por clave en tiempo constante promedio.
### Resultados obtenidos y clasificación asintótica

Al ejecutar `node src/medir.js`, las predicciones se confirmaron exactamente: cada vez que `n` se multiplicó por 10, `primeraVenta` permaneció constante en `1`, mientras que las otras tres funciones multiplicaron sus operaciones exactamente por 10. Ninguna presentó crecimiento cuadrático $O(n^2)$.

| `n (registros)` | `primeraVenta O(1)` | `totalVendido` | `ventaMayor` | `totalPorCiudad` |
| :--- | :--- | :--- | :--- | :--- |
| `100` | `1` | `200` | `399` | `300` |
| `1.000` | `1` | `2.000` | `3.999` | `3.000` |
| `10.000` | `1` | `20.000` | `39.999` | `30.000` |
| `100.000` | `1` | `200.000` | `399.999` | `300.000` |

| Función | Complejidad | Justificación por código | Justificación por números |
| :--- | :--- | :--- | :--- |
| `primeraVenta` | **$O(1)$** (Constante) | No contiene ciclos; accede directamente a `ventas[0]` en un solo paso sin importar el tamaño del arreglo. | Para $n = 100$ hizo `1` operación y para $n = 100.000$ siguió haciendo `1` operación ($\times 1$). |
| `totalVendidoContado` | **$O(n)$** (Lineal) | Tiene un único ciclo `for...of` que recorre los $n$ elementos una vez realizando 2 operaciones fijas por iteración (visita + comparación `cantidad > 0`). | Pasó de `200` ($n=100$) a `2.000` ($n=1.000$) y `200.000` ($n=100.000$): relación exacta $2n$. |
| `ventaMayorContado` | **$O(n)$** (Lineal) | Tiene un único ciclo `for...of` sin ciclos anidados. En la primera venta válida hace 3 operaciones (`mayor === null`) y en las $n - 1$ restantes hace 4 operaciones (visita + 3 comparaciones). | Pasó de `399` ($n=100$) a `3.999` ($n=1.000$) y `399.999` ($n=100.000$): relación exacta $4n - 1$, creciendo proporcional a $n$. |
| `totalPorCiudadContado` | **$O(n)$** (Lineal) | Recorre el arreglo en un solo ciclo `for...of`. Actualizar el objeto acumulador (`acum[ciudad]`) es acceso hash en tiempo constante $O(1)$, haciendo 3 operaciones fijas por elemento. | Pasó de `300` ($n=100$) a `3.000` ($n=1.000$) y `300.000` ($n=100.000$): relación exacta $3n$. |
---

## Análisis de cuello de botella: `clientesRecurrentes` ($O(n^2)$)

### 1. Verificación con los 12 datos del Día 1 (Paso 1)
Al ejecutar `clientesRecurrentes(ventas)` con los 12 registros de `src/datos.js`, devuelve `[ 'C01', 'C02', 'C03' ]`, coincidiendo exactamente con los clientes que realizaron más de una compra.

### 2. Traza manual con $n = 5$ ventas y generalización (Paso 2)
Tomando las primeras 5 ventas (`[C01, C02, C03, C01, C04]`):

| Iteración externa (`i`) | Cliente `ventas[i]` | Valores de `j` (`i + 1` hasta `4`) | Comparaciones (`ventas[i].cliente === ventas[j].cliente`) | ¿Se agrega a `recurrentes`? |
| :--- | :--- | :--- | :--- | :--- |
| `i = 0` | `C01` | `1, 2, 3, 4` | **4** comparaciones (`C02`, `C03`, `C01`, `C04`) | Sí, en `j = 3` (`['C01']`) |
| `i = 1` | `C02` | `2, 3, 4` | **3** comparaciones (`C03`, `C01`, `C04`) | No |
| `i = 2` | `C03` | `3, 4` | **2** comparaciones (`C01`, `C04`) | No |
| `i = 3` | `C01` | `4` | **1** comparación (`C04`) | No |
| `i = 4` | `C04` | *(ninguno)* | **0** comparaciones | No |

* **Total para $n = 5$:** $4 + 3 + 2 + 1 + 0 = \mathbf{10}$ comparaciones.
* **Generalización para $n$ ventas:** El ciclo interno ejecuta $(n - 1) + (n - 2) + \dots + 1 = \frac{n(n - 1)}{2} = \frac{n^2 - n}{2}$ comparaciones, cuyo término dominante es $\frac{1}{2}n^2$, lo que define una complejidad base de **$O(n^2)$**.

---

### 3. Medición empírica de tiempos y análisis (Pasos 3, 4 y 5)

Resultados medidos en consola con `node src/benchmark_recurrentes.js`:

| `n (ventas)` | Tiempo medido (`console.time`) | Factor al duplicar `n` | Comparaciones realizadas ($\frac{n(n-1)}{2}$) |
| :--- | :--- | :--- | :--- |
| `1.000` | `8.381 ms` | — | `499.500` |
| `2.000` | `33.312 ms` | `3.89x` | `1.999.000` |
| `4.000` | `59.403 ms` | `1.78x` *(optimización JIT de V8)* | `7.998.000` |
| `8.000` | `257.492 ms` | `4.33x` | `31.996.000` |
| `16.000` | `934.754 ms` | `3.63x` | `127.992.000` |

* **¿Qué pasa cuando `n` se duplica? (Paso 4):** Al duplicar la cantidad de ventas ($\times 2$), el tiempo de ejecución se **multiplica aproximadamente por 4** (`3.89x`, `4.33x`, `3.63x`). Esto responde directamente a la ley cuadrática $O(n^2)$: $(2n)^2 = 4n^2$.
* **Estimación para $100.000$ y $1.000.000$ de ventas (Paso 5):**
  * **Para $100.000$ ventas** ($6,25\times$ más datos que $16.000 \implies 6,25^2 = 39,06\times$ más tiempo): tomando `934.90 ms` en $16.000$, se estima **`36.52 segundos`** (menor a 2 minutos).
  * **Para $1.000.000$ de ventas** ($10\times$ más datos que $100.000 \implies 10^2 = 100\times$ más tiempo): se estima **`3.651,94 segundos` ($\approx 60,9\text{ minutos}$ / más de 1 hora)** con el proceso bloqueado.

---

### 4. Costo oculto: `recurrentes.includes(...)` (Paso 6)
Dentro del doble ciclo `for`, cada vez que `ventas[i].cliente === ventas[j].cliente` es verdadero, se ejecuta `!recurrentes.includes(ventas[i].cliente)`:

1. **¿Qué hace `.includes()`?** Recorre secuencialmente el arreglo `recurrentes` desde la posición `0` hasta encontrar el cliente o llegar al final: tiene complejidad **$O(m)$**, donde $m$ es la cantidad de clientes recurrentes acumulados.
2. **Impacto en el peor caso:** Si hay muchos clientes distintos que compran repetidamente, el tamaño de `recurrentes` crece proporcionalmente a $n$ ($m \approx \frac{n}{2}$). Aunque el operador `&&` hace cortocircuito cuando los clientes no coinciden, en un historial con muchos clientes repetidos la búsqueda lineal interna $O(n)$ se ejecuta repetidamente dentro del doble ciclo $O(n^2)$, empujando el peor caso teórico hacia **$O(n^3)$**.

---

### 5. Conclusión para la gerente (Paso 7)

> **¿Por qué el reporte de clientes recurrentes se vuelve tan lento con el historial anual?**
>
> El reporte funciona rápido con pocas ventas porque revisa el archivo comparando **cada factura contra todas las demás facturas**, una por una, como si tuvieras una lista impresa y por cada renglón volvieras a leer toda la lista hacia abajo para ver si el cliente se repite.
>
> Cuando hay 12 ventas, eso implica apenas unas pocas decenas de revisiones. Pero con un historial anual de cientos de miles de ventas, las revisiones crecen **multiplicadas por sí mismas**: si las ventas aumentan 10 veces, el trabajo del computador aumenta 100 veces; si aumentan 100 veces, el trabajo crece 10.000 veces (pasando de menos de un segundo a más de una hora con un millón de ventas). Además, cada vez que encuentra un cliente repetido, vuelve a leer desde el principio la lista de clientes ya anotados para no duplicarlo.
>
> No es falla del computador ni de los datos; es la forma en que está buscando. Podemos cambiar esa lógica para que el sistema lea el historial **una sola vez de principio a fin**, anotando cada cliente en una tabla rápida, lo que reducirá esos minutos de espera a menos de un segundo.
---

## Análisis de complejidad espacial y recorridos (Día 2 - Parte 3)

### 1. Comparación: `totalCiudadCadena` vs. `totalCiudadUnaPasada` (Paso 4)

Verificado con `node src/verificar_espacio.js` sobre `10.000` ventas aleatorias: ambas funciones devuelven exactamente el mismo monto.

| Métrica | `totalCiudadCadena(ventas, ciudad)` | `totalCiudadUnaPasada(ventas, ciudad)` |
| :--- | :--- | :--- |
| **Recorridos realizados** | **4 recorridos** (`map` $\to$ `filter` $\to$ `map` $\to$ `reduce`). | **1 recorrido** único (`for...of`). |
| **Arreglos nuevos creados** | **3 arreglos intermedios** (el 1.º de tamaño $n$ con objetos clonados; el 2.º y 3.º de tamaño $m \le n$). | **0 arreglos nuevos** (solo variables primitivas: `ciudadBuscada` y `total`). |
| **Complejidad de Tiempo** | **$O(n)$** (Lineal: $n + n + m + m \le 4n$). | **$O(n)$** (Lineal: exactamente $n$ iteraciones). |
| **Complejidad de Espacio (auxiliar)** | **$O(n)$** (Almacena hasta $3n$ elementos extra en memoria en el peor caso). | **$O(1)$** (Memoria adicional constante, independiente del tamaño de `ventas`). |

---

### 2. ¿Por qué ambas son $O(n)$ en tiempo si una recorre 4 veces? (Paso 5)

En notación Big-O medimos **la tasa de crecimiento asintótica** cuando $n \to \infty$, no la cantidad exacta de instrucciones de CPU:

1. **Pasos secuenciales (no anidados):** `totalCiudadCadena` ejecuta cuatro recorridos uno después del otro, realizando como máximo $n + n + n + n = 4n$ operaciones.
2. **Regla de eliminación de constantes:** En Big-O se descartan los factores constantes que multiplican al término dominante: $O(4n) \equiv O(n)$. Tanto $4n$ como $1n$ crecen de manera lineal y proporcional a $n$ (si $n$ se multiplica por 10, ambas hacen $10\times$ más trabajo).
3. **Diferencia real en servidor:** Aunque comparten clase temporal $O(n)$, `totalCiudadCadena` tiene una constante $4\times$ mayor y obliga al *Garbage Collector* de Node.js a reservar y limpiar tres arreglos temporales en memoria.

---

### 3. Clasificación de complejidad espacial del motor completo (Paso 6)

*Medida sobre la **memoria auxiliar** asignada por cada función más allá del arreglo de entrada `ventas`:*

| Función | Espacio auxiliar | Justificación |
| :--- | :--- | :--- |
| `valorVenta` | **$O(1)$** | Realiza una multiplicación y retorna un número. |
| `primeraVenta` | **$O(1)$** | Retorna la referencia directa a `ventas[0]` sin copiar datos. |
| `totalVendido` | **$O(1)$** | Solo usa la variable acumuladora `total`. |
| `unidadesVendidas` | **$O(1)$** | Solo usa la variable acumuladora `unidades`. |
| `ventaMayor` | **$O(1)$** | Solo guarda una referencia (`mayor`) al objeto ganador. |
| `ticketPromedio` | **$O(1)$** | Solo usa dos variables escalares (`total` y `ventasValidas`). |
| `ventasPorCiudad` | **$O(1)$** | Solo usa `totalCiudad` y la cadena `ciudadBuscada`. |
| `totalCiudadUnaPasada` | **$O(1)$** | Solo usa acumuladores primitivos (`total`, `ciudadBuscada`). |
| `totalCiudadCadena` | **$O(n)$** | Construye 3 arreglos intermedios en memoria proporcionales a $n$. |
| `totalVendidoM` / `unidadesVendidasM` / `ventasPorCiudadM` | **$O(n)$** | El método `.filter()` inicial crea un arreglo nuevo de hasta $n$ elementos antes de reducir. |
| `ventasDelDia` | **$O(n)$** | Crea el arreglo intermedio `registrosDia` con `.filter()`, que en el peor caso (todas las ventas en esa fecha) ocupa $O(n)$. |
| `clientesRecurrentes` | **$O(n)$** | El arreglo `recurrentes` puede crecer hasta $\lfloor n/2 \rfloor$ clientes distintos (proporcional a $n$). |
| `totalPorCiudad` | **$O(n)$** *(o $O(1)$ si ciudades fijas)* | `.filter()` crea primero un arreglo intermedio de hasta $n$ registros ($O(n)$). El objeto diccionario `{ [ciudad]: total }` ocupa $O(c)$ donde $c$ es el número de ciudades distintas ($O(1)$ con un catálogo fijo de ciudades, o hasta $O(n)$ si entraran ciudades distintas en cada registro). |
| `unidadesPorProducto` | **$O(n)$** | `.filter()` crea un arreglo intermedio de hasta $n$ elementos ($O(n)$) y el diccionario ocupa $O(p)$ según productos distintos ($p \le n$). |
| `topProductosPorValor` | **$O(n)$** | Crea el arreglo filtrado $O(n)$, el diccionario por producto $O(p)$ y luego `Object.entries().map()` genera otro arreglo de tamaño $p$ para ordenarlo con `.sort()` sin mutar `ventas`. |

---

### 4. Decisión técnica para el motor (Paso 7)

* **Versión elegida para producción:** `totalCiudadUnaPasada` (que comparte la misma estrategia de recorrido único que `ventasPorCiudad`).
* **Justificación (Legibilidad vs. Recursos):**
  * Dado que el marketplace correrá en un **servidor con memoria limitada**, evitar la clonación de objetos (`{ ...venta }`) y los 3 arreglos temporales de `totalCiudadCadena` reduce la memoria auxiliar de **$O(n)$ a $O(1)$** y evita presión sobre el *Garbage Collector*.
  * Un ciclo `for...of` con una condición clara delegando en `valorVenta(venta)` mantiene alta legibilidad y facilidad de mantenimiento sin comprometer los recursos del servidor.
```[cite: 1]

---

### 5. Guardar y subir a GitHub (Paso 7)

```bash
git add .
git commit -m "perf: compara encadenamiento vs una pasada, clasifica complejidad espacial O(1) y O(n)"
git push origin main
```[cite: 1]
---

## Revisión de pares del informe `RENDIMIENTO.md` (`v0.2`)

* **Compañero revisor:** `[Nombre del compañero]`
* **Observación recibida:** `[Observación del compañero — por ejemplo, si pidió aclarar por qué totalCiudadCadena tarda más o cómo se calcula la proyección a 1.000.000 de ventas]`
* **Respuesta y aclaración:** Se revisó el informe `RENDIMIENTO.md` contrastando los tiempos medidos en `src/benchmark_v02.js` (`10.000` ventas) con las reglas de Big-O y el escalamiento cuadrático $(100)^2 = 10.000\times$ para `clientesRecurrentes` (`400.129 ms` $\to$ ~`4.001,29 s` $\approx 66,7\text{ min}$), dejando explícita tanto la diferencia constante/espacial entre `totalCiudadCadena` y `totalCiudadUnaPasada` como la prioridad de optimizar primero `clientesRecurrentes`.
---

## Optimización de `clientesRecurrentes` a tiempo lineal $O(n)$ (Día 3)

### 1. Entender el problema
* **Entradas:** `ventas`, un arreglo de objetos de venta (cada uno con propiedades como `id`, `fecha`, `cliente`, `producto`, `ciudad`, `cantidad`, `precio`).
* **Salida:** Un arreglo con los identificadores de `cliente` (ej. `["C01", "C02", "C03"]`) que aparecen **más de una vez** en `ventas`, sin duplicados dentro del resultado.
* **Restricciones y consideraciones:**
  * El reporte debe responder en **menos de 1 segundo** con `100.000` ventas.
  * El orden de los clientes devueltos puede variar según la estrategia (al comparar ordenados, el conjunto de clientes recurrentes es el mismo).
  * Si un cliente compra 3 o más veces, debe aparecer **una sola vez** en el resultado.

### 2. Ejemplos y casos borde
* **Muestra del Día 1 (12 ventas):** `C01` (3 compras), `C02` (2 compras) y `C03` (2 compras) compran más de una vez $\implies$ `["C01", "C02", "C03"]`.
* **Arreglo vacío (`[]`):** No hay compras repetidas $\implies$ `[]`.
* **Arreglo de 1 sola venta (`[v1]`):** Ningún cliente supera una compra $\implies$ `[]`.
* **Todos los clientes compran exactamente 1 vez:** Ningún cliente es recurrente $\implies$ `[]`.
* **Un mismo cliente compra 4 veces (`C01`, `C01`, `C01`, `C01`):** Debe aparecer una sola vez en el resultado (`["C01"]`), no repetido.

### 3. Fuerza bruta y su complejidad
* **Enfoque (`clientesRecurrentes`):** Doble ciclo `for` (`i` de `0` a `n-1`, `j` de `i+1` a `n-1`) comparando `ventas[i].cliente === ventas[j].cliente` y verificando `!recurrentes.includes(ventas[i].cliente)`.
* **Complejidad temporal:** $\frac{n(n-1)}{2}$ comparaciones base $\implies O(n^2)$ en tiempo (y hasta $O(n^3)$ en el peor caso si `.includes()` recorre un arreglo `recurrentes` grande de tamaño $O(n)$). En `10.000` ventas ya toma ~`400 ms` y en `100.000` escala a decenas de segundos.
* **Complejidad espacial auxiliar:** $O(n)$ por el arreglo `recurrentes` (en el peor caso hasta $\lfloor n/2 \rfloor$ clientes).

### 4. Idea de optimización
* Eliminar el doble ciclo y las búsquedas lineales `.includes()` recorriendo `ventas` **una sola vez** ($O(n)$ en tiempo) y usando estructuras con búsqueda/inserción en tiempo constante promedio $O(1)$:
  1. **Con `Set` (`clientesRecurrentesSet`):** Un `Set` `vistos` guarda los clientes ya encontrados al menos una vez; si al recorrer una venta el cliente ya está en `vistos`, se agrega a un segundo `Set` `recurrentes` (que evita duplicados automáticamente).
  2. **Con `Map` (`comprasPorCliente`):** Un `Map` lleva el conteo exacto de compras por `cliente` (`conteo.set(cliente, (conteo.get(cliente) || 0) + 1)`), y luego se filtran las entradas con cantidad `> 1`.
  ### Medición de las tres versiones (`1.000`, `10.000` y `100.000` ventas)

Resultados obtenidos ejecutando `node src/verificar_recurrentes.js`:

* **Paridad verificada:** Con los 12 registros del Día 1 (`3` clientes recurrentes) y con `5.000` ventas generadas (`1.349` clientes recurrentes), las tres versiones coinciden al compararlas ordenadas.

| `n (ventas)` | Original $O(n^2)$ | `clientesRecurrentesSet` $O(n)$ | `clientesRecurrentesDesdeMap` $O(n)$ |
| :--- | :--- | :--- | :--- |
| `1.000` | `4.144 ms` | `0.144 ms` | `0.056 ms` |
| `10.000` | `494.94 ms` | `1.308 ms` | `1.183 ms` |
| `100.000` | *Omitido (>10k)* | `14.788 ms` | `5.194 ms` |

* Con `100.000` ventas, tanto la solución con `Set` (`14.788 ms` $\approx 0.015\text{ s}$) como la basada en `Map` (`5.194 ms` $\approx 0.005\text{ s}$) cumplen holgadamente el requisito del *marketplace* de responder en menos de un segundo.

### Intercambio (trade-off) entre tiempo y memoria

* **Lo que ganamos en tiempo:** Pasamos de complejidad cuadrática **$O(n^2)$** (con búsqueda lineal `.includes()` adicional) a complejidad lineal **$O(n)$** en una sola pasada sobre `ventas`. Al multiplicar `n` por 10 (de `10.000` a `100.000`), el tiempo crece de forma lineal (`1.308 ms` $\to$ `14.788 ms` en `Set`; `1.183 ms` $\to$ `5.194 ms` en `Map`), evitando el colapso cuadrático.
* **Lo que invertimos en memoria:** A cambio de esa velocidad, asignamos estructuras auxiliares en memoria proporcionales a la cantidad de clientes distintos $c \le n$:
  * `clientesRecurrentesSet` mantiene dos `Set` (`vistos` y `recurrentes`), con espacio auxiliar **$O(c)$** (en el peor caso $O(n)$ si casi todos los clientes son distintos).
  * `comprasPorCliente` / `clientesRecurrentesDesdeMap` mantiene un `Map` con el conteo por cada cliente (`cliente -> cantidad`), con espacio auxiliar **$O(c)$** (en el peor caso $O(n)$).
* **Conclusión del intercambio:** En un servidor con memoria limitada, gastar unos pocos megabytes de memoria $O(c)$ para evitar ciclos anidados $O(n^2)$ y lograr respuestas en ~`5–15 ms` para `100.000` ventas es un intercambio altamente favorable, siempre que el número de clientes distintos no sature la RAM disponible.
---

## Campaña de fin de año: Complementos (`Map`) y frecuencias (Día 4)

### 1. Traza de `comboRegalo(catalogo, 87000)` con `Map` (Paso 4)

* **Objetivo (`valor`):** `87.000`.
* **Catálogo recorrido en orden:**
  1. `Origen Nariño 250 g` (`26.000`)
  2. `Origen Huila 500 g` (`42.000`)
  3. `Origen Sierra 500 g` (`45.000`)
  4. `Filtros de papel x100` (`18.000`)
  5. `Taza de cerámica` (`35.000`)
  6. `Origen Huila 1 kg` (`79.000`)
  7. `Prensa francesa` (`95.000`)
  8. `Molino manual` (`120.000`)

| Paso | Producto actual (`item`) | `precio` | `complemento = 87.000 - precio` | ¿Está `complemento` en `preciosVistos`? | Acción en `preciosVistos` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | Origen Nariño 250 g | `26.000` | `61.000` | No | Guarda `26000 -> Origen Nariño 250 g` |
| `2` | Origen Huila 500 g | `42.000` | `45.000` | No | Guarda `42000 -> Origen Huila 500 g` |
| `3` | Origen Sierra 500 g | `45.000` | `42.000` | **Sí** (`Origen Huila 500 g`, distinto producto) | **Retorna `[Origen Huila 500 g (42.000), Origen Sierra 500 g (45.000)]`** |

* **Otras pruebas realizadas:**
  * `61.000`: encuentra `[Origen Nariño 250 g (26.000), Taza de cerámica (35.000)]` (`26.000 + 35.000 = 61.000`).
  * `50.000` (sin combinación posible): recorre el catálogo y retorna `null`.

---

### 2. Clasificación de complejidad de las funciones de campaña (Pasos 2 y 7)

*Sea $k$ el tamaño del catálogo (`comboRegaloFuerzaBruta` / `comboRegalo`) y $n$ el número de ventas (`productoEstrellaPorCiudad` / `primerClienteUnico`), con $c$ ciudades y $p$ productos distintos:*

| Función | Complejidad temporal | Complejidad espacial (auxiliar) | Justificación |
| :--- | :--- | :--- | :--- |
| `comboRegaloFuerzaBruta(catalogo, valor)` | **$O(k^2)$** | **$O(1)$** | Dos ciclos anidados prueban $\frac{k(k-1)}{2}$ pares sin estructuras auxiliares grandes. |
| `comboRegalo(catalogo, valor)` | **$O(k)$** | **$O(k)$** | Un solo recorrido sobre `catalogo` con consultas e inserciones en `Map` en tiempo constante promedio $O(1)$; guarda hasta $k$ precios en el `Map`. |
| `productoEstrellaPorCiudad(ventas)` | **$O(n)$** | **$O(c \cdot p)$** *(en práctica acotada por catálogo)* | Un recorrido lineal sobre `ventas` actualiza un `Map` anidado por ciudad y producto en $O(1)$ promedio, y luego recorre las ciudades y productos acumulados para hallar el máximo de cada ciudad. |
| `primerClienteUnico(ventas)` | **$O(n)$** | **$O(u)$** *(hasta $O(n)$ si todos los clientes son distintos)* | Realiza dos recorridos lineales secuenciales ($2n \implies O(n)$): el primero cuenta compras por cliente en un `Map` y el segundo devuelve el primer cliente con conteo igual a `1`. |

### Resultados medidos (`node src/probar_ventana_punteros.js`)

* **Septiembre (`k = 7`):** Tanto `mejorSemanaBruta` como `mejorSemana` coinciden (`{ total: 3670, diaInicio: 24 }`).
* **Benchmark con `100.000` días aleatorios (`k = 7`):**
  * `mejorSemanaBruta`: **`6.436 ms`** (`{ total: 4598, diaInicio: 17500 }`).
  * `mejorSemana` (ventana deslizante): **`1.735 ms`** (`{ total: 4598, diaInicio: 17500 }`).
  * Ambas devuelven exactamente el mismo resultado (`true`) y la ventana deslizante resulta más rápida al evitar sumar los $k$ elementos desde cero en cada desplazamiento.
* **Par más cercano al presupuesto (`parMasCercano`):**
  * Presupuesto `100.000`: `Filtros de papel x100` (`18.000`) + `Origen Huila 1 kg` (`79.000`) = `97.000`.
  * Presupuesto `140.000`: `Origen Sierra 500 g` (`45.000`) + `Prensa francesa` (`95.000`) = `140.000`.
  * Presupuesto `40.000`: `null` (sin combinación posible dentro del presupuesto).