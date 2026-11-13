# Revisión de Masiva Home — 13 de noviembre de 2026

Se conserva la dirección minimalista: tipografías, paleta, distribución, dos productos en Inicio y catálogo separado. Se corrigen navegación, continuidad de compra y trabajo innecesario del navegador. No se añaden dependencias ni respaldos locales.

## Skills aplicadas

| Skill | Aplicación concreta |
| --- | --- |
| Vercel Web Design Guidelines | Enlace real de búsqueda, URL recuperable, foco, avisos accesibles y movimiento reducido. |
| React Best Practices | Suscripciones del carrito limitadas a quienes necesitan su estado; metadatos de galería reutilizados; carga diferida del 3D conservada. |
| Composition Patterns | Acciones estables y estado separados dentro del mismo proveedor; aviso de compra y contador del catálogo como componentes independientes. Compatible con React 18. |
| Bencium Controlled UX Designer | Se mantiene la dirección visual aprobada, sin introducir una estética distinta. |
| UI UX Pro Max | Recorridos con teclado, foco al cerrar diálogos, duración del aviso y recuperación de filtros. |

Referencia de auditoría: [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md). No se aplica asesoramiento exclusivo de React 19 a este proyecto React 18.

## Hallazgos resueltos

- `web/src/blocks/Header.tsx:209` — La búsqueda de cabecera no tenía acción. Ahora abre el catálogo con el cierre coordinado del menú y enfoca el campo; conserva apertura en otra pestaña.
- `web/src/blocks/Catalog.tsx:21` — La búsqueda y el orden se perdían al recargar. Categoría, consulta y orden se recuperan de la URL y del historial. Escribir no genera una entrada de historial por tecla.
- `web/src/components/CartNotice.tsx:6` — El aviso vencía incluso con el usuario interactuando. Su tiempo se pausa con foco, cursor o bolsa abierta. El diálogo devuelve el foco al botón de origen.
- `web/src/lib/cart.ts:31` — Alcanzar el límite podía anunciar un agregado que no ocurrió. El reductor actualiza cantidad y aviso juntos, informa del máximo de 99 y evita que un temporizador antiguo cierre un aviso nuevo.
- `web/src/lib/CartContext.tsx:20` — Los consumidores de acciones recibían cambios del aviso y actualizaban el showroom. Se separan acciones estables del estado visible, manteniendo la misma bolsa y almacenamiento.
- `web/src/content/catalogMedia.ts:29` — Las tarjetas reconstruían metadatos de galería sin cambios. Se reutiliza el resultado por producto.
- `web/src/components/HeroVideo.tsx:32` — Movimiento reducido pausaba el video pero lo descargaba. Ahora muestra el póster sin solicitar MP4. Se conserva reproducción silenciada en modo normal.
- `web/src/styles/commerce.css` — El aviso respeta el área segura del dispositivo.

## Mediciones locales

Chrome aislado, compilación de producción, ventana de 1440 × 1000. Se compara el estado anterior con esta revisión. Son observaciones de laboratorio, no Core Web Vitals de usuarios reales.

| Medida | Antes | Después |
| --- | ---: | ---: |
| Bytes de video descargados con movimiento reducido durante la carga inicial | 1.413.972 | 0 |
| Llamadas de dibujo WebGL durante los 6,5 s que incluyen el vencimiento del aviso, cámara quieta | 265 | 0 |
| JavaScript principal comprimido con gzip | 115.114 bytes | 115.971 bytes |
| Descarga del módulo Showroom3D al abrir la portada, antes de aproximarse a la sección | No | No |
| Dibujos WebGL en reposo / fuera de pantalla después de la revisión | — | 0 / 0 |

El JavaScript principal aumenta 857 bytes gzip por las mejoras de interacción. La optimización medida elimina transferencia de video en movimiento reducido y repintados del showroom; no se afirma una reducción del bundle. El archivo MP4 actual mide 1.413.972 bytes (1,4 MB); se corrigió la referencia histórica de 17 MB. El tráfico del video en modo normal depende de las solicitudes parciales y de la ventana de medición; no se usa como comparación de ahorro.

## Verificación

- `npm run build` y `check:cart`: TypeScript, compilación, datos persistidos inválidos, cantidades, límite, clics repetidos y temporizadores obsoletos.
- `check:audit-usability`: búsqueda de cabecera, categoría/consulta/orden tras recarga y volver atrás, aviso y retorno del foco; 390 y 1440 px.
- `check:experience`: recorridos en 320, 390, 768, 1024 y 1440 px, incluida preferencia de movimiento reducido.
- `check:catalog-view`, `check:catalog-navigation` y `check:catalog-visual`: filtros, galerías, acabados, imágenes diferidas, precios pendientes, orden y ausencia de desbordamiento; revisión de capturas móvil/escritorio.
- `check:bag` y `check:showroom-commerce`: cantidades compartidas entre Inicio, catálogo y showroom, recarga, eliminación y subtotal.
- `check:showroom-hotspots`: indicadores, selección y cámara, móvil/escritorio.
- `check:header-experience`, `check:transitions`, `check:showroom-transition` y `check:menu-position`: menú, foco, fundido nativo/alternativo y conservación de la posición de origen.
- `check:render`, `audit:performance` y `audit:feedback-render`: renderizado bajo demanda, transferencia y comportamiento al vencer el aviso.

La prueba de movimiento reducido del video se adapta al comportamiento nuevo. Las pruebas antiguas de vista del catálogo y experiencia se actualizan a los selectores del diseño vigente, conservando sus comprobaciones funcionales.

## Pendientes para publicación

Vite mantiene la advertencia de tamaño del módulo 3D (unos 905 kB sin comprimir, 250 kB gzip). Se carga de forma diferida; dividir o sustituir sus dependencias requiere una evaluación específica. No se ocultó ni elevó el umbral de la advertencia.

La bolsa sigue siendo local (`mh-cart-v1`); no crea pedidos ni procesa pagos. La integración con el catálogo WordPress/WooCommerce existente, stock, entrega y checkout necesita el contrato con backend. Los precios públicos siguen usando Carga General; los productos sin precio confirmado mantienen consulta. Esta ronda verifica Chrome local, no constituye una certificación de accesibilidad, FPS ni compatibilidad exhaustiva con todos los navegadores.
