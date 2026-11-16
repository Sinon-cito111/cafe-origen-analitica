# Café Origen — Motor de Analítica de Ventas (`v1.0`)

Motor de inteligencia comercial desarrollado en **Node.js** para procesar, depurar y analizar historiales transaccionales de **Café Origen**, diseñado para integrarse con la plataforma del marketplace respondiendo reportes completos sobre **100.000 ventas en menos de 100 milisegundos**.

---

## Cómo ejecutarlo

No requiere dependencias externas ni instalación de paquetes (`npm install` no es necesario); funciona de forma nativa con **Node.js** ($\ge$ v16).

### 1. Reporte ejecutivo completo (comando principal)
* **Con los datos reales del Día 1 (12 transacciones):**
  ```bash
  node src/reporte.js