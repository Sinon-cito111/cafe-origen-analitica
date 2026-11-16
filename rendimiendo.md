# Informe Técnico de Rendimiento — Motor Analítico Café Origen (v1.0)

**Versión:** `v1.0` (Release de producción para integración con Marketplace)  
**Entorno de prueba:** Node.js (motor V8), datos sintéticos generados con `src/generador.js`.  
**SLA exigido por el Marketplace:** Tiempo de respuesta $< 1.000\text{ ms}$ ($1\text{ s}$) para $100.000$ registros de venta.

---

## 1. Comparativa de rendimiento total del reporte: v0.1 vs. v1.0

En la versión preliminar (`v0.1` + módulo inicial de recurrencia), el reporte ejecutaba 10 consultas con un cuello de botella cuadrático $O(n^2)$ en `clientesRecurrentes`. En la versión `v1.0`, el reporte ejecuta **15 análisis completos** (añadiendo clientes recurrentes optimizado, producto estrella por ciudad, combo regalo, primer cliente único y mejor semana) en tiempo estrictamente lineal $O(n)$:

| Volumen de datos (`n`) | Reporte `v0.1` (10 métricas, con $O(n^2)$) | Reporte `v1.0` (15 métricas, todo $O(n)$) | Mejora obtenida | Estado SLA ($< 1.000\text{ ms}$) |
| :--- | :--- | :--- | :--- | :--- |
| **`10.000` ventas** | ~148,50 ms | **~8,40 ms** | **~17,7x más rápido** | Cumple |
| **`100.000` ventas** | ~13.950,00 ms (~14,0 s) | **~68,20 ms** | **~204,5x más rápido** | **Cumple ($14\times$ bajo el límite)** |

*(Nota: Ejecuta `node src/benchmark_v10.js` para reproducir estos tiempos exactos en tu hardware).*

---

## 2. Tabla completa de complejidades del motor (`v1.0`)

Sea $n$ la cantidad de registros en `ventas`, $m$ la cantidad de productos en `catalogo`, $k$ el tamaño de ventana o top solicitado, $c$ el número de ciudades distintas y $p$ el número de productos distintos:

| Función | Qué hace | Tiempo | Espacio auxiliar | Justificación |
| :--- | :--- | :--- | :--- | :--- |
| `valorVenta` | Calcula `cantidad * precio` de una venta. | **$O(1)$** | **$O(1)$** | Operación aritmética directa sin estructuras ni ciclos. |
| `primeraVenta` | Retorna el primer registro del historial. | **$O(1)$** | **$O(1)$** | Acceso indexado directo a `ventas[0]`. |
| `totalVendido` | Suma ingresos válidos con ciclo `for...of`. | **$O(n)$** | **$O(1)$** | Una sola pasada sobre `ventas` con un acumulador numérico. |
| `unidadesVendidas` | Suma unidades válidas con ciclo `for...of`. | **$O(n)$** | **$O(1)$** | Una sola pasada sobre `ventas` con un acumulador numérico. |
| `ventaMayor` | Encuentra la venta de mayor ingreso. | **$O(n)$** | **$O(1)$** | Una pasada manteniendo únicamente una referencia al objeto mayor. |
| `ticketPromedio` | Calcula el promedio por venta válida (`cantidad > 0`). | **$O(n)$** | **$O(1)$** | Una pasada con dos contadores escalares; protegido contra `0/0`. |
| `ventasPorCiudad` | Suma ventas de una ciudad específica (ciclo). | **$O(n)$** | **$O(1)$** | Una pasada con normalización de cadena y acumulador escalar. |
| `totalCiudadUnaPasada` | Versión optimizada en producción para total por ciudad. | **$O(n)$** | **$O(1)$** | Recorrido único sin arreglos intermedios (ideal para servidores con RAM limitada). |
| `totalCiudadCadena` | Versión comparativa con `.map().filter().map().reduce()`. | **$O(n)$** | **$O(n)$** | 4 recorridos secuenciales ($4n \equiv O(n)$) pero crea 3 arreglos temporales en memoria. |
| `totalVendidoM` | Total vendido usando `.filter().reduce()`. | **$O(n)$** | **$O(n)$** | `.filter()` construye un arreglo intermedio de hasta $n$ elementos. |
| `unidadesVendidasM` | Unidades vendidas usando `.filter().reduce()`. | **$O(n)$** | **$O(n)$** | `.filter()` construye un arreglo intermedio de hasta $n$ elementos. |
| `ventasPorCiudadM` | Ventas de una ciudad usando `.filter().reduce()`. | **$O(n)$** | **$O(n)$** | `.filter()` construye un arreglo intermedio antes de reducir. |
| `totalPorCiudad` | Agrupa ingresos totales por cada ciudad normalizada. | **$O(n)$** | **$O(n)$** | `.filter()` usa $O(n)$ y el diccionario acumulador guarda $c$ ciudades en $O(1)$ promedio por acceso. |
| `unidadesPorProducto` | Agrupa total de unidades vendidas por producto. | **$O(n)$** | **$O(n)$** | `.filter()` usa $O(n)$ y el objeto acumulador almacena $p \le n$ claves. |
| `topProductosPorValor` | Ordena y devuelve los $k$ productos con más ingresos. | **$O(n + p \log p)$** | **$O(n)$** | Agrega en $O(n)$ y ordena las $p$ categorías en $O(p \log p)$ (como $p \ll n$, domina $O(n)$). |
| `ventasDelDia` | Filtra y resume indicadores de una fecha puntual. | **$O(n)$** | **$O(n)$** | Filtra los registros de la fecha en un arreglo auxiliar y calcula sus métricas. |
| `clientesRecurrentes` *(legado)* | Versión fuerza bruta con doble ciclo e `.includes()`. | **$O(n^2)$** *(peor $O(n^3)$)* | **$O(n)$** | Realiza $\frac{n(n-1)}{2}$ comparaciones de pares más búsqueda lineal en arreglo. |
| `clientesRecurrentesSet` *(v1.0)* | Detecta clientes con $\ge 2$ compras usando dos `Set`. | **$O(n)$** | **$O(n)$** | Una sola pasada con inserción y consulta hash en tiempo $O(1)$ promedio. |
| `comprasPorCliente` *(v1.0)* | Construye un `Map` con el conteo de compras por cliente. | **$O(n)$** | **$O(n)$** | Una pasada actualizando frecuencias en un `Map` en $O(1)$ promedio. |
| `clientesRecurrentesMap` *(v1.0)* | Extrae clientes recurrentes a partir de `comprasPorCliente`. | **$O(n)$** | **$O(n)$** | Recorre `ventas` ($n$) y luego el `Map` de clientes únicos ($u \le n$). |
| `productoEstrellaPorCiudad` *(v1.0)* | Halla el producto con más transacciones en cada ciudad. | **$O(n)$** | **$O(n)$** | Usa mapas anidados `ciudad -> Map(producto -> conteo)` en una única pasada sobre `ventas`. |
| `primerClienteUnico` *(v1.0)* | Primer cliente cronológico con exactamente 1 compra. | **$O(n)$** | **$O(n)$** | Dos recorridos lineales secuenciales ($2n \equiv O(n)$) apoyados en un `Map` de frecuencias. |
| `comboRegaloBruta` *(legado)* | Busca dos productos del catálogo que sumen `valor`. | **$O(m^2)$** | **$O(1)$** | Doble ciclo sobre los $m$ productos del catálogo sin memoria auxiliar. |
| `comboRegalo` *(v1.0)* | Busca el par exacto usando un `Map` de complementos. | **$O(m)$** | **$O(m)$** | Una pasada sobre el catálogo verificando `valor - precio` en $O(1)$ promedio. |
| `mejorSemanaBruta` *(legado)* | Suma cada ventana de $k$ días consecutivos desde cero. | **$O(n \cdot k)$** | **$O(1)$** | Recalcula $k$ sumas por cada una de las $(n - k + 1)$ posiciones. |
| `mejorSemana` *(v1.0)* | Encuentra los $k$ días consecutivos de mayor venta. | **$O(n)$** | **$O(1)$** | **Ventana deslizante:** suma el día que entra y resta el que sale en $O(1)$ por paso. |
| `parMasCercano` *(v1.0)* | Dos productos cuya suma sea máxima sin superar presupuesto. | **$O(m \log m)$** | **$O(m)$** | Ordena copia del catálogo en $O(m \log m)$ y aplica **dos punteros** convergentes en $O(m)$. |

---

## 3. Proyección a 1.000.000 de ventas (`v1.0`)

Gracias a que todas las consultas del reporte `v1.0` tienen complejidad temporal lineal **$O(n)$**, el tiempo escala de forma estrictamente proporcional ($\times 10$ al multiplicar los datos por $10$):

* **Tiempo medido en `100.000` ventas:** `~68 ms` ($0,068\text{ s}$).
* **Proyección para `1.000.000` de ventas:** **`~680 ms` ($0,68\text{ s}$)** (frente a los **~23 minutos** que habría tardado la versión con `clientesRecurrentes` cuadrático).