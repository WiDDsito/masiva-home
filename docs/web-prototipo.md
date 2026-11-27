# Prototipo web de noviembre de 2026

Registro histórico del frontend. El catálogo comercial actual consulta WooCommerce. La selección local sigue disponible para consultas por WhatsApp. Las rutas de código y los comandos de esta entrega se leen desde `web/`. [Estado actual](actualizaciones.md)

## Ejecutar

Node.js 20+ y Chrome instalado para las comprobaciones visuales.

```bash
npm install           # solo si faltan dependencias
npm run dev           # http://localhost:5173
npm run build         # TypeScript + compilación de producción
npm run check:cart    # lógica y recuperación del carrito
npm run check:theme   # servidor activo
npm run check:layout
npm run check:motion
npm run check:showroom
npm run check:catalog-view # inicio resumido y vista de catálogo
npm run check:products     # imágenes, ficha rápida, carrito y rebote
npm run check:services     # burbuja circular de Servicios
npm run check:experience
node scripts/render-check.mjs
```

Los scripts de navegador aceptan `URL=http://127.0.0.1:5174` si se utiliza otro puerto. `check:experience` guarda capturas en `.screenshots/`; se puede cambiar con `SHOTS_DIR`.

## Contenido y precios

`src/content/demo.ts` conserva el nombre del archivo por compatibilidad, pero ahora contiene una selección de siete variantes reales con fotografía local, SKU, acabado, medidas y precio de **Carga General**. La propiedad `source` identifica hoja, fila y columna de cada precio. No hay sincronización automática con Sheets.

Fuente: https://docs.google.com/spreadsheets/d/1sK0HtvRHqECUFTHMY-pITcnVcdDVgmRU/edit

Cotizaciones se utiliza como referencia informativa; no alimenta precios públicos. Esta instrucción del usuario sustituye para esta entrega las reglas de precio anteriores en `../plan/` y `../docs/`, que se conservan como documentación histórica.

La disponibilidad se presenta como pendiente de confirmar. No se trasladó el valor de stock de ejemplo `999` de la hoja a la web. Los precios no incluyen un envío calculado. `IS_DEMO` identifica que la web sigue siendo una vista local con catálogo parcial y sin checkout conectado.

## Implementación

- `src/blocks/Shop.tsx`: dos productos destacados en el inicio y botón «Ver catálogo completo».
- `src/blocks/Catalog.tsx`: vista independiente `#catalogo`, con todos los productos cargados, búsqueda por nombre/SKU/color, ambiente, orden y estado sin resultados. Comparte carrito con el inicio y admite recarga, enlaces directos y navegación Atrás/Adelante.
- `src/lib/cart.ts`: cantidades enteras entre 1 y 99, eliminación y recuperación validada.
- `src/lib/CartContext.tsx`: estado compartido y persistencia de IDs y cantidades. Los precios siempre se toman del catálogo actual.
- `src/components/Cart.tsx`: diálogo nativo, teclado/Escape, restauración del foco, subtotal y consulta por WhatsApp. No envía mensajes automáticamente.
- `src/blocks/Showroom.tsx`: sección de ancho completo, selección accesible, giro opcional, zoom y restablecimiento.
- `src/three/`: modelos procedurales ilustrativos, una pieza visible, transición de salida/entrada, carga diferida y renderizado bajo demanda. Se detiene fuera de pantalla y con pestaña oculta.
- `src/lib/useScrollAnimations.ts`: GSAP + ScrollTrigger + Lenis diferidos. `matchMedia` revierte animaciones al activar movimiento reducido. El contenido permanece visible si el motor no carga.
- `src/styles/commerce.css`: catálogo y carrito adaptables; `tokens.css` mantiene la paleta y tipografía existentes.
- `assets/images/`: imágenes WebP comprimidas y redimensionadas; originales conservados en el respaldo previo a esta revisión.

Los controles de zoom son botones para que la rueda y los gestos de desplazamiento no atrapen al visitante en el visor. Los productos del showroom son reconstrucciones aproximadas basadas en las fotografías y las medidas del catálogo; los detalles ocultos en las fotos no están certificados. Se indica en la sección.

## Antes de vender en línea

Falta conectar el carrito y checkout de WooCommerce, verificar sesión/nonces y precios desde el servidor, completar el catálogo y sus variantes/fotos, confirmar stock, entrega y políticas de negocio. El carrito local no crea pedidos ni cobra pagos. La selección puede consultarse por WhatsApp.

Consulta [revisión archivada](https://github.com/WiDDsito/masiva-home/blob/6da8b32186f5089619c831de1de590f5325977a4/web/REVISION-2026-11-11.md) para los hallazgos, fuentes, validaciones y límites de esta entrega.
