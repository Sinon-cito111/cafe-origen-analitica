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