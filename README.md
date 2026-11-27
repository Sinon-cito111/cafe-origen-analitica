# Café Origen — Motor de Analítica de Ventas (`v1.0`)

Herramienta de línea de comandos construida en **Node.js** para procesar, limpiar, analizar y reportar el rendimiento comercial de **Café Origen**. Está diseñada para generar métricas ejecutivas, indicadores de campaña y análisis de rendimiento con complejidad lineal $O(n)$ en las consultas críticas, cumpliendo los requisitos de respuesta del *marketplace*.

---

## ¿Cómo ejecutarlo?

No requiere dependencias externas (`npm install` no es necesario); funciona de forma nativa con **Node.js**.

### Reporte con los datos base del Día 1
```bash
node src/reporte.js