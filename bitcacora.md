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