# Bitácora de Análisis de Datos - Café Origen

## Diccionario de datos

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

## Casos borde detectados

1. **Inconsistencia de formato en la propiedad `ciudad` (Registro `id: 5`)**
   * **Problema:** En los registros `1`, `4` y `11` aparece `"Medellín"` con inicial mayúscula, mientras que en el registro `5` aparece `"medellín"` en minúscula. Si se agrupa por ciudad sin normalizar, JavaScript tratará ambas cadenas como ciudades distintas.
   * **Decisión:** Normalizar los textos de la propiedad `ciudad` antes de realizar agrupaciones o conteos (por ejemplo, aplicando `.trim()` y estandarizando a formato Título o minúsculas comparables).

2. **Venta con `cantidad` igual a cero (Registro `id: 8`)**
   * **Problema:** El registro `8` (`cliente: "C06"`, `producto: "Origen Huila 500 g"`) tiene `cantidad: 0` con un `precio: 42000`. Esto genera un ingreso de `$0` y puede distorsionar métricas como el ticket promedio por transacción o el conteo de ventas efectivas.
   * **Decisión:** Excluir los registros con `cantidad <= 0` de los cálculos financieros y métricas de ventas efectivas, pero mantenerlos documentados como posibles registros anulados o errores de digitación en el sistema origen.

3. **Recurrencia de clientes con múltiples compras (Clientes `C01`, `C02` y `C03`)**
   * **Problema:** Un mismo código de cliente aparece en múltiples registros (por ejemplo, `C01` en los registros `1`, `4` y `11`; `C02` en `2` y `7`; `C03` en `3` y `9`). Contar los registros totales creyendo que equivalen a clientes únicos sobreestimaría la base de compradores.
   * **Decisión:** Diferenciar claramente entre **número de transacciones** (cantidad de registros) y **clientes únicos** (usando estructuras como `Set` sobre la propiedad `cliente`) al generar los indicadores en `analitica.js`[cite: 1].
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

## Verificación a mano: Tablas de traza (Paso 7)

Para comprobar que las funciones con ciclos `for...of` calculan exactamente lo esperado, se realizaron trazas manuales paso a paso sobre los 12 registros de `src/datos.js` y se contrastaron con la salida real de `node src/probar.js`.

### 1. Traza manual de `totalVendido(ventas)` y `unidadesVendidas(ventas)`

* **Estado inicial:** `total = 0`, `unidades = 0`

| `id` | `producto` | `cantidad` | `precio` | ¿`cantidad > 0`? | `valorVenta` (`cant × precio`) | `total` acumulado | `unidades` acumuladas |
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

* **Resultado manual:** `total = 985000`, `unidades = 21`, `ventasValidas = 11` $\implies$ `ticketPromedio = 985000 / 11 = 89545.45454545454`.
* **Salida del programa (`node src/probar.js`):** `985000`, `21` y `89545.45454545454` (**coincidencia exacta**).

---

### 2. Traza manual de `ventasPorCiudad(ventas, "  MEDELLÍN ")`

* **Normalización inicial:** `ciudadBuscada = "  MEDELLÍN ".trim().toLowerCase() = "medellín"`
* **Estado inicial:** `totalCiudad = 0`

| `id` | `ciudad` original | `ciudadVenta` normalizada | ¿`cantidad > 0` y coincide? | `valorVenta` | `totalCiudad` acumulado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | `"Medellín"` | `"medellín"` | **Sí** | `$84.000` | `$84.000` |
| `2..3` | `"Bogotá"`, `"Cali"` | `"bogotá"`, `"cali"` | No | — | `$84.000` |
| `4` | `"Medellín"` | `"medellín"` | **Sí** | `$42.000` | `$126.000` |
| `5` | `"medellín"` | `"medellín"` | **Sí** *(resuelve caso borde)* | `$135.000` | `$261.000` |
| `6..10` | Varias | Varias | No | — | `$261.000` |
| `11` | `"Medellín"` | `"medellín"` | **Sí** | `$95.000` | **`$356.000`** |
| `12` | `"Bogotá"` | `"bogotá"` | No | — | **`$356.000`** |

* **Resultado manual:** `356000`.
* **Salida del programa (`node src/probar.js`):** `356000` (**coincidencia exacta**).
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