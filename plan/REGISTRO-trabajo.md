# Registro de trabajo — MasivaHome.com

> Proyecto: rediseño de MasivaHome.com (fase 1).
> Ubicación de todos los archivos: `DISCO EXTER/Freelance/masiva-home`.
> Última actualización: 12 de noviembre de 2026.

## Para qué sirve este documento

Es la bitácora del proyecto. Se anota **una entrada por cada entrega terminada**: qué se hizo, en qué archivo quedó, qué se decidió y qué quedó pendiente.

Reglas:

1. **No se borran entradas.** Si una decisión se reemplaza, se añade una entrada nueva y en la anterior se marca «reemplazada por E-xx».
2. **Toda entrega tiene archivo.** Nada queda solo en la conversación: si no está en un documento, no existe.
3. **Cada entrada dice qué se necesita de quién.** Una entrega sin responsable pendiente es una entrega incompleta.
4. **El registro no sustituye a los documentos.** Es el índice de qué cambió y cuándo.

## Tabla de entregas

| ID | Fecha | Entrega | Archivo | Estado |
|---|---|---|---|---|
| E-01 | 2026-11-10 | Revisión de fuentes y sitio actual | (conversación) | Completada |
| E-02 | 2026-11-10 | Baseline arquitectónico 0.1 | (conversación) | Aprobada |
| E-03 | 2026-11-10 | Especificación funcional 0.1 | `plan/SPEC-masiva-home.md` | Reemplazada por E-04 |
| E-04 | 2026-11-10 | Auditoría y especificación 0.2 | `plan/SPEC-masiva-home.md` | Reemplazada por E-05 |
| E-05 | 2026-11-10 | Especificación 0.3 y guía de negocio | `plan/SPEC-masiva-home.md`, `plan/GUIA-negocio-masiva-home.md` | Aprobada |
| E-06 | 2026-11-10 | Documentos publicados para distribución | `docs/01-guia-supervisores.md`, `docs/02-especificacion-tecnica.md`, `docs/03-preguntas-pendientes.md` | Publicada |
| E-07 | 2026-11-10 | Propuesta de inicio 0.1 (11 bloques) | `plan/PROPUESTA-inicio-masiva-home.md` | Reemplazada por E-08 |
| E-08 | 2026-11-10 | Propuesta de inicio 0.2 (5 páginas, 5 bloques) | `plan/PROPUESTA-inicio-masiva-home.md` | Reemplazada por E-09 |
| E-09 | 2026-11-10 | Propuesta de inicio 0.3 + paleta y tipografía (v1) | `plan/PROPUESTA-inicio-masiva-home.md`, `plan/SPEC-masiva-home.md` v0.4 | Reemplazada por E-10 |
| E-10 | 2026-11-10 | Propuesta 0.4 + sistema visual definitivo y modo oscuro | `plan/PROPUESTA-inicio-masiva-home.md`, `plan/SPEC-masiva-home.md` v0.5 | **Vigente** |
| E-11 | 2026-11-10 | Esqueleto visual de la home en local | `web/` | Entregado para revisión |
| E-12 | 2026-11-10 | Botón de cambio de modo claro/oscuro | `web/src/lib/useTheme.ts`, `web/src/blocks/Header.tsx` | Verificado |
| E-13 | 2026-11-10 | Sistema de movimiento y hover dorado en la navegación | `web/src/styles/motion.css`, `web/src/lib/useReveal.ts`, `web/src/lib/useScrolled.ts` | Verificado |
| E-14 | 2026-11-10 | Más animaciones y estabilidad de layout entre temas | `web/src/styles/blocks.css`, `web/src/styles/base.css`, `web/src/blocks/Footer.tsx`, `web/scripts/layout-check.mjs` | Verificado |
| E-15 | 2026-11-11 | Stack de animación GSAP + Motion + Lenis | `web/src/lib/useScrollAnimations.ts`, `web/src/components/Magnetic.tsx`, `web/src/blocks/Hero.tsx`, `web/src/blocks/Showroom.tsx` | Verificado |
| E-16 | 2026-11-11 | Imágenes reales en la home, orden de navegación y ajuste de espaciado | `web/src/content/images.ts`, `web/src/content/demo.ts`, `web/src/components/Photo.tsx`, `web/src/blocks/Shop.tsx` | Verificado |
| E-17 | 2026-11-11 | Scrollbar transparente, intercambio de categorías, bento de servicios y logo en el pie | `web/src/styles/base.css`, `web/src/styles/blocks.css`, `web/src/blocks/Services.tsx`, `web/src/blocks/Footer.tsx` | Verificado |
| E-18 | 2026-11-11 | Mesa de TV en Sala, logo más grande, bento clicable con bola dorada y revelado ligado al scroll | `web/src/content/images.ts`, `web/src/blocks/Services.tsx`, `web/src/lib/useScrollAnimations.ts`, `web/src/styles/blocks.css` | Verificado |
| E-19 | 2026-11-11 | Bento con carga dorada, footer con color natural y parallax/scrollstorytelling | `web/src/lib/useScrollAnimations.ts`, `web/src/styles/blocks.css` | Verificado |
| E-20 | 2026-11-11 | Adaptación de referencias de animación y showroom 3D (Three.js + R3F + Drei) | `web/src/three/*`, `web/src/blocks/Showroom.tsx`, `web/src/lib/useInView.ts` | Verificado |
| E-21 | 2026-11-12 | Menú mega muebles.es, imágenes de aparadores y vista rápida integrados sobre el catálogo existente | `web/src/components/MegaMenu.tsx`, `web/src/content/images.ts`, `web/src/content/demo.ts`, `web/src/blocks/Header.tsx`, `web/src/blocks/Shop.tsx`, `web/src/blocks/Catalog.tsx` | Verificado |

---

## Detalle de entregas

### E-01 — Revisión de fuentes y sitio actual

- **Qué se hizo:** lectura de las hojas Carga General y Cotizaciones, de la estructura de Drive y del sitio publicado. Identificación de plugins, tema y estado del contenido.
- **Hallazgos relevantes:**
  - Carga General: 62 variantes y 38 modelos en Aparadores; sin stock, peso ni plazos normalizados.
  - Cotizaciones: precio directo y retail separados; 38 modelos aprobados; fotos vacías en el rango exportado.
  - Drive: fotos por categoría y modelo; Escanor con seis JPG.
  - Sitio actual: página «Próximamente» con tres claim de marca y enlaces a Falabella y Sodimac. Pago declarado: transferencia bancaria.
  - Sin clave única confirmada entre hojas y Drive.
- **Pendiente:** inventario oficial de categorías, clave de producto y reglas de envío.

### E-02 — Baseline arquitectónico 0.1

- **Qué se hizo:** propuesta de monolito frontend modular, WordPress/Elementor como contenedor, React/TypeScript como capa de interacción, WooCommerce conservado.
- **Decisión del usuario:** aprobado. Next.js y Astro fuera de la primera etapa, previstos para el futuro.
- **Pendiente:** validar el mecanismo real de publicación del código.

### E-03 — Especificación funcional 0.1

- **Qué se hizo:** 20 requisitos funcionales, 18 no funcionales, 9 casos de uso, 21 historias, arquitectura por capas, tecnologías y mapa de contenidos.
- **Pendiente:** revisión de consistencia (origen de E-04).

### E-04 — Auditoría y especificación 0.2

- **Qué se hizo:** auditoría del propio documento. Se detectaron y corrigieron 12 contradicciones; entre ellas, la más costosa: el catálogo exigía ser indexable sin JavaScript pero estaba planteado como aplicación React completa.
- **Cambios principales:**
  - Invariante de precio: precio publicado = precio directo aprobado.
  - Estrategia de islas de React sobre HTML de WooCommerce.
  - Corrección de la inversión de dependencia del adaptador de comercio.
  - Requisitos condicionados y 12 preguntas abiertas nuevas (PA-14 a PA-25).
  - Glosario, supuestos, matriz de trazabilidad y registro de auditoría.
- **Pendiente:** aprobación del usuario.

### E-05 — Especificación 0.3 y guía de negocio

- **Qué se hizo:** el usuario aprobó las cinco decisiones propuestas (D-14 a D-18) y se añadió D-19 (documentación en doble registro). Se separó la documentación en dos archivos con los mismos identificadores.
- **Archivos:**
  - `plan/SPEC-masiva-home.md` — espec técnica v0.3.
  - `plan/GUIA-negocio-masiva-home.md` — guía en lenguaje de negocio.
- **Pendiente:** respuestas del supervisor a PA-14, PA-15, PA-01 y PA-21.

### E-06 — Documentos publicados para distribución

- **Qué se hizo:** publicación de las copias aprobadas en `docs/` con sello de versión y regla de edición (se edita en `plan/`, se republica en `docs/`). Se creó el formulario operativo de preguntas pendientes.
- **Archivos:**
  - `docs/01-guia-supervisores.md`
  - `docs/02-especificacion-tecnica.md`
  - `docs/03-preguntas-pendientes.md`
- **Contenido del formulario:** 25 preguntas con prioridad, responsable, motivo, requisito bloqueado y espacio de respuesta; tablero de estado y registro de respuestas.

### E-07 — Propuesta de inicio 0.1 (reemplazada)

- **Qué se hizo:** primera propuesta de home con once bloques y sistema visual basado en líneas de cota.
- **Por qué se reemplaza:** el usuario estableció un máximo de cinco páginas y una home más liviana; también fijó el nombre `Tienda` y la paleta sobria.

### E-08 — Propuesta de inicio 0.2

- **Qué se hizo:** reescritura de la propuesta según las restricciones nuevas.
- **Decisiones aplicadas:**
  - Sitio de cinco páginas: Inicio, Tienda, Showroom, Servicios, Contacto.
  - Showroom con entrada propia en el menú.
  - Home de cinco bloques: héroe, tienda, showroom, servicios y contacto.
  - Nombre `Tienda` sustituye a `Catálogo`.
  - Paleta de seis valores sobre blanco y negro, con un solo acento verde bosque y un color de estado para «bajo pedido».
  - Todo lo que se quitó de la home tiene una página donde vive: servicios, FAQ, ambientes, fabricación.
- **Archivo:** `plan/PROPUESTA-inicio-masiva-home.md` v0.2.
- **Pendiente de aprobación:**
  1. Nombre y orden de las cinco entradas.
  2. Validación de la paleta (o comparación con una segunda opción de acento).
  3. Si los productos de la home muestran precio desde el inicio.

---

### E-09 — Propuesta de inicio 0.3 y sistema visual aprobado

- **Qué se hizo:** se aplicaron las decisiones del cliente sobre navegación, contenido de la home y paleta, y se alineó la especificación técnica con el sistema visual aprobado.
- **Decisiones aplicadas:**
  - Nombre **Tienda** confirmado; orden `Inicio · Showroom · Tienda · Servicios · Contacto`.
  - Los productos del bloque Tienda muestran foto, nombre, modelo y **precio desde el inicio**.
  - Títulos en negro `#111111`; contenido en gris oscuro `#3F4345`.
  - Dorado mostaza `#C8971B` como único acento de acción, tomado de la referencia de materiales de la marca.
  - Tipografía: **Instrument Serif** para títulos e **Instrument Sans** para texto y datos.
  - Regla de contraste: dorado siempre como superficie con etiqueta negra; nunca texto dorado sobre blanco ni texto blanco sobre dorado.
- **Archivos actualizados:**
  - `plan/PROPUESTA-inicio-masiva-home.md` v0.3.
  - `plan/SPEC-masiva-home.md` v0.4: decisión D-20, sección 6.2 con tokens aprobados, sección 6.3 con tipografía y registro de cambios.
  - `plan/GUIA-negocio-masiva-home.md` v0.4: decisión D-20 en lenguaje de negocio.
  - `docs/01-guia-supervisores.md` y `docs/02-especificacion-tecnica.md`: republicados con el sello de versión 0.4.
- **Decisión reemplazada:** los tokens preliminares `sage` (#5F6B5C), `danger` (#B3261E) y `focus` azul (#1A5FB4) de la versión 0.2 quedan retirados. Motivo: el cliente fijó una paleta sobria de negro, gris y dorado; añadir verdes y rojos rompía la uniformidad. El foco pasa a tinta y los errores se comunican con texto, no con color.
- **Pendiente de validar en pantalla:** el tono exacto del dorado (`#C8971B` frente a `#B0840F`). Se decide sobre la home construida.
- **Siguiente paso:** esqueleto visual en local (tokens, estructura y cinco bloques con contenido de ejemplo marcado).

---

### E-10 — Sistema visual definitivo y modo oscuro

- **Qué se hizo:** se reemplazó la paleta de E-09 por la paleta final del cliente y se definió la estrategia de acento para modo claro y oscuro. Se cambió también la tipografía.
- **Decisiones aplicadas:**
  - Base: Charcoal `#191817`, Warm Ivory `#F5F3EF`, Greige `#D8D0C4`, Walnut `#8C6A49`, Antique Brass `#B18A50`.
  - Acento por modo: Dark Brass `#765629`, Brand Brass `#B18A50`, Light Brass `#D0AE76`.
  - Distribución: 65 % neutros claros, 25 % oscuros, 10 % acentos; el bronce puede quedar bajo el 5 %.
  - Tipografía: **Cormorant Garamond** para títulos (nunca bajo 24 px) y **Manrope** para texto e interfaz.
  - Modo claro y oscuro: tokens semánticos (`bg`, `surface`, `text`, `border`, `accent`), con preferencia del sistema como modo por defecto.
  - Tratamientos por elemento: navbar marfil o carbón; hero fotográfico; footer siempre carbón; separadores greige en claro.
- **Reglas de contraste registradas:** marfil/carbón ≈13:1; carbón/bronce ≈5,4:1; carbón/bronce claro ≈8:1; marfil/bronce oscuro ≈5,9:1. El botón usa etiqueta carbón sobre bronce en ambos modos.
- **Archivos actualizados:**
  - `plan/PROPUESTA-inicio-masiva-home.md` v0.4.
  - `plan/SPEC-masiva-home.md` v0.5: D-21, secciones 6.2 y 6.3 reescritas, D-20 marcada como reemplazada.
  - `plan/GUIA-negocio-masiva-home.md` v0.5: D-21 en lenguaje de negocio.
  - `docs/01-guia-supervisores.md` y `docs/02-especificacion-tecnica.md`: republicados con sello 0.5.
- **Decisión reemplazada:** D-20 (negro `#111111`, gris `#3F4345`, dorado `#C8971B`, Instrument Serif/Sans). Motivo: el cliente entregó la paleta definitiva y la dirección tipográfica editorial.
- **Pendiente de validar en pantalla:** modo por defecto (sistema, con botón de cambio desde E-12), legibilidad del bronce sobre fotografías y uso de Cormorant en tamaños pequeños.

---

### E-11 — Esqueleto visual de la home en local

- **Qué se hizo:** se creó el proyecto frontend en `masiva-home/web/` y se construyó la home completa en local con los cinco bloques aprobados: héroe, tienda (categorías y productos), showroom, servicios y contacto, más cabecera y pie.
- **Stack:** React + TypeScript + Vite. Sin WordPress y sin dependencias de WooCommerce en esta etapa.
- **Estructura:** bloques separados en `src/blocks/`, componentes reutilizables en `src/components/`, datos de demostración aislados en `src/content/demo.ts`, tokens en `src/styles/tokens.css`.
- **Sistema visual aplicado:**
  - Tokens de color y roles semánticos, con reasignación automática en modo oscuro (`prefers-color-scheme`).
  - Cormorant Garamond para títulos (con regla de no bajar de 24 px) y Manrope para interfaz y datos.
  - Botón principal en bronce con etiqueta carbón; hover tonal; foco de 2 px.
  - Distribución 65 % neutros / 25 % oscuro / 10 % acentos: el pie y el showroom son carbón; el resto, marfil.
- **Accesibilidad incorporada:** salto al contenido, foco visible, navegación móvil por teclado cerrable con Escape, objetivos táctiles de 44 px, `prefers-reduced-motion`, estados de disponibilidad con texto y color.
- **Contenido:** todo es demostración y está señalizado en el pie. No se usan fotos de terceros: `Photo.tsx` dibuja marcos con la proporción final y la etiqueta de lo que falta.
- **Verificación:**
  - `npm run build` pasa sin errores de TypeScript.
  - Bundle de producción: 49,9 KB de JavaScript comprimido y 4,3 KB de CSS. Dentro del presupuesto de RNF-03.
  - Capturas generadas en cuatro combinaciones: escritorio y móvil, claro y oscuro (`npm run shots`).
- **Correcciones hechas durante la revisión visual:** se quitaron pies duplicados en categorías y productos, se reforzó el degradado de las tarjetas de categoría, se ajustó la alineación de contacto y se movió el aviso de demostración del flotante al pie.
- **Pendiente:**
  - Revisión de la marca sobre estas pantallas (tono del bronce y jerarquías).
  - Sustituir contenido de demostración por fotos y productos reales.
  - Construir las páginas Showroom, Tienda, Servicios y Contacto.

---

### E-12 — Botón de cambio de modo claro/oscuro

- **Qué se hizo:** se añadió un botón en la cabecera que alterna entre modo claro y oscuro, con icono de luna en claro y sol en oscuro.
- **Comportamiento:**
  - Sin elección previa, la web sigue la preferencia del sistema y reacciona a sus cambios en vivo.
  - Al pulsar el botón, la elección se guarda en `localStorage` (`mh-theme`) y deja de seguir al sistema.
  - Un script mínimo en `index.html` aplica el tema guardado **antes de pintar**, para evitar el destello del modo contrario al recargar.
  - El tema se controla con `data-theme` en `<html>`; los tokens se reasignan por atributo y no por componente.
- **Accesibilidad:** `aria-label` describe la acción («Cambiar a modo oscuro» / «Cambiar a modo claro»), `aria-pressed` comunica el estado y el botón conserva el objetivo táctil de 44 px.
- **Archivos:** `src/lib/useTheme.ts`, `src/blocks/Header.tsx`, `index.html`, `src/styles/tokens.css`, `src/styles/components.css`, `scripts/theme-check.mjs`.
- **Verificación:** `npm run check:theme` comprueba nueve puntos y todos pasan:
  1. Inicia en claro con el sistema en claro.
  2. El botón activa `data-theme="dark"`.
  3. El fondo cambia a carbón.
  4. La elección persiste al recargar.
  5. Vuelve a modo claro.
  6. El botón principal mantiene fondo bronce y texto carbón en claro.
  7. Lo mismo en oscuro.
  8. Sin elección previa, sigue a un sistema en modo oscuro.
  9. El botón fuerza el modo claro aunque el sistema esté en oscuro.
- **Pendiente:** nada funcional. La revisión visual del icono y su peso junto al resto de la cabecera queda dentro de la revisión general de marca.

---

### E-13 — Sistema de movimiento y hover dorado

- **Qué se hizo:** se implementó un sistema de movimiento único para toda la home, en lugar de animaciones aisladas, y se cambió el hover de la navegación a dorado en ambos modos.
- **Movimiento implementado:**
  - Revelado al entrar en pantalla, una sola vez por bloque, con 18 px de desplazamiento y 720 ms.
  - Retraso escalonado en categorías (70 ms), productos y servicios (90 ms).
  - Cabecera que se compacta al desplazar (72 px a 60 px) y gana fondo sólido.
  - Botones que se elevan 1 px; enlaces con subrayado y color dorado al pasar el mouse.
  - Categorías con zoom de 4 % y nombre que sube 2 px; productos con zoom de 3 %.
  - Cota que se dibuja de izquierda a derecha, porque representa una medida.
  - Anillo que recorre cada hotspot del showroom una sola vez.
- **Dorado del hover y contraste:**
  - Modo claro: bronce oscuro `#765629` sobre marfil, 6:1.
  - Modo oscuro: bronce claro `#d0ae76` sobre carbón, 8:1.
  - No se usa el bronce base como texto sobre marfil porque no alcanza AA.
- **Accesibilidad y degradación:**
  - Con `prefers-reduced-motion`, el contenido aparece sin transición y el anillo no se anima.
  - Sin JavaScript, nada se oculta: la clase `js` se añade en `index.html`.
  - Solo se animan `opacity` y `transform`; el foco visible se mantiene.
- **Archivos:** `styles/motion.css`, `lib/useReveal.ts`, `lib/useScrolled.ts`, `blocks/Header.tsx`, `blocks/Shop.tsx`, `blocks/Showroom.tsx`, `blocks/Services.tsx`, `blocks/Contact.tsx`, `components/CategoryTile.tsx`, `components/ProductCard.tsx`, `styles/tokens.css`, `styles/components.css`, `styles/blocks.css`, `scripts/motion-check.mjs`.
- **Verificación:** `npm run check:motion` comprueba once puntos y todos pasan:
  1. La navegación se pinta de dorado en claro.
  2. La cabecera no está compactada al inicio en claro.
  3. El contenido bajo el pliegue comienza oculto en claro.
  4. El contenido aparece al entrar en pantalla en claro.
  5. La cabecera se compacta al desplazar en claro.
  6. Las cinco comprobaciones anteriores también pasan en modo oscuro.
  7. Con movimiento reducido, todo el contenido es visible.
- **Pendiente:** revisión de la intensidad por parte de la marca. Los tiempos están en tokens (`--reveal-duration`), así que ajustarlos no obliga a tocar componentes.

---

### E-14 — Más animaciones y estabilidad de layout entre temas

- **Qué se hizo:** se amplió el sistema de movimiento y se corrigió el cambio de layout al alternar modo claro y oscuro.
- **Diagnóstico del layout:** una comprobación automatizada (`scripts/layout-check.mjs`) confirmó que el alto del héroe, el ancho del contenido y el ancho de la página no cambiaban al alternar el tema; lo único que cambiaba era `color-scheme`, que dispara el redibujado del scrollbar y de la interfaz del navegador. Se aplicó `scrollbar-gutter: stable` en `html` para reservar el espacio del scrollbar y que ningún cambio de tema desplace el contenido.
- **Animaciones añadidas:**
  - Zoom sutil de entrada en la imagen del héroe (6 % → 1), una vez.
  - Iconos de cabecera que se pintan de dorado y crecen un 8 % al pasar; se comprimen al pulsar.
  - Botones que se comprimen al pulsarlos.
  - Servicios que suben 2 px y pintan el título de dorado.
  - Enlaces de contacto que se pintan de dorado al pasar.
  - Columnas del pie escalonadas (60 ms a 240 ms) al entrar en pantalla.
- **Sin cambios de regla:** se mantiene D-22. No se añadieron bucles ni parallax.
- **Archivos:** `styles/blocks.css`, `styles/components.css`, `styles/base.css`, `blocks/Footer.tsx`, `scripts/layout-check.mjs`.
- **Verificación:**
  - `npm run check:layout`: en escritorio y móvil, ninguna medida cambia al alternar el tema (solo `color-scheme`, que es lo esperado).
  - `npm run check:motion` y `npm run check:theme` siguen pasando.
  - Build en 50,7 KB de JavaScript comprimido.
- **Pendiente:** revisión visual de la intensidad del zoom del héroe y del escalonado del pie.

---

### E-15 — Stack de animación GSAP + Motion + Lenis

- **Qué se hizo:** se integró el stack de animación y se repartió la responsabilidad entre bibliotecas, sin descuidar rendimiento ni accesibilidad.
- **Reparto:**
  - **GSAP + ScrollTrigger**: línea de tiempo del héroe (máscara de la imagen con `clip-path` + revelado del título por líneas), parallax sutil del fondo y revelado de bloques al entrar en pantalla.
  - **Motion**: botón magnético del héroe (`Magnetic.tsx`) y pulso de los hotspots del showroom.
  - **Lenis**: desplazamiento suave con anclas internas (margen de cabecera de 72 px).
- **Rendimiento:** GSAP y Lenis se cargan con import dinámico tras el primer pintado. El bundle inicial pasó de 152 KB a **101,8 KB comprimidos**; el motor de scroll (GSAP 28 KB, ScrollTrigger 18 KB, Lenis 5,7 KB) llega por separado. Motion se mantiene en el bundle inicial porque actúa al renderizar.
- **Accesibilidad:** con `prefers-reduced-motion` no se monta GSAP ni Lenis, el botón magnético se desactiva y los hotspots no pulsan; el CSS muestra todo. Sin JavaScript, nada se oculta (clase `js`).
- **Consistencia:** duraciones (720 ms), desplazamiento (18 px) y curva (`power3.out`) salen de los tokens; cada biblioteca hace una sola cosa.
- **Archivos:** `lib/useScrollAnimations.ts`, `components/Magnetic.tsx`, `blocks/Hero.tsx`, `blocks/Showroom.tsx`, `styles/motion.css`, `styles/blocks.css`, `styles/components.css`, `styles/base.css`. Se eliminó `lib/useReveal.ts` (reemplazado por GSAP).
- **Verificación:** build sin errores de TypeScript; `check:layout`, `check:motion` y `check:theme` pasan contra el build de producción; captura del héroe confirma máscara resuelta (`clip-path: inset(0 0 0%)`) y título visible.
- **Diferido:** Quick View y filtros (Tienda), zoom/paneo y cambio de ambiente (Showroom), transiciones de formulario (Contacto) e intercambio de foto por variante se implementan al construir esas páginas.

---

### E-16 — Imágenes reales, orden de navegación y espaciado

- **Qué se hizo:** se referenciaron las imágenes reales de `web/assets/images/` en las secciones correspondientes, se corrigió el orden de navegación y se eliminó el hueco entre el héroe y la tienda.
- **Imágenes:**
  - Convención de nombres alineada con Drive: `ap-` (aparadores), `acvd-` (archivadores), `ect-` (escritorios), `mdc-` (mesas de centro), `rp-` (roperos) + nombre del modelo.
  - Héroe → Aparador Escanor; categorías → Sala (Irene), Comedor (Escanor), Dormitorio (Runa), Escritorio (Yoshi), Almacenaje (Gina); productos → Escanor, Fabela, Runa; showroom → Escanor.
  - `Photo.tsx` muestra la imagen cuando existe y cae al marco de «fotografía pendiente» cuando no; el héroe carga la imagen de inmediato (LCP) y el resto, en `lazy`.
  - El logo (`masiva-home-logo.webp`) queda disponible; no se usó en la cabecera porque hay que confirmar la variante de color para fondo claro y oscuro.
- **Orden de navegación:** cambió a `Inicio · Tienda · Showroom · Servicios · Contacto` (la tienda pasa a segunda posición).
- **Espaciado:** la sección Tienda usa `section--top-tight` para cerrar el hueco blanco tras el héroe.
- **Observación de rendimiento:** las imágenes entregadas son pesadas (el héroe pesa ~1 MB). No afectan al layout, pero conviene una versión comprimida antes de producción para cumplir LCP ≤ 2,5 s (RNF-01).
- **Verificación:** build sin errores; `check:layout`, `check:motion` y `check:theme` pasan; capturas en escritorio y móvil con las imágenes reales.
- **Pendiente:** comprimir imágenes (o definir tamaños máximos), confirmar variante del logo para claro/oscuro y sustituir los precios de demostración por la fuente aprobada.

---

### E-17 — Scrollbar transparente, categorías, bento de servicios y logo

- **Qué se hizo:** ajustes de detalle en la home.
- **Scrollbar:** franja y pista transparentes; pulgar tenue del color del texto (`--scrollbar-thumb`, distinto por tema). `scrollbar-width: thin` en Firefox y estilos webkit en los demás. Sigue reservando espacio con `scrollbar-gutter: stable` para no desplazar el layout.
- **Categorías (Tienda):** se intercambian las imágenes — Comedor usa la que tenía Sala (Irene) y Sala usa la mesa de centro restante (Fabela), a falta de una carpeta «mesas de TV» en `assets/images`.
- **Cursor:** los productos muestran puntero de selección al pasar el mouse.
- **Footer:** el logo reemplaza al texto «Masiva Home», conservando nota, columnas e índices.
- **Servicios (bento):** la sección pasa de tres columnas con bordes a un bento minimalista de cuatro celdas (7/5, 5/7) con una celda de acento oscuro para la cotización. Se añade el cuarto servicio **Instalación y montaje**.
- **Pantalla completa de Servicios:** la sección usa `section--screen` (`min-height: calc(100svh - header)`), de modo que al hacer clic en «Servicios» la vista se muestra completa y no deja ver Contacto; este último queda junto al pie como excepción.
- **Verificación:** build sin errores; `check:layout`, `check:motion` y `check:theme` pasan; capturas en escritorio y móvil.
- **Pendiente:** confirmar imagen para la categoría «Sala» (mesa de TV) si existe en Drive y la variante de color del logo para el pie en modo claro.

---

### E-18 — Mesa de TV, logo, bento clicable y revelado suave

- **Qué se hizo:** ajustes de contenido e interacción y mejora del ritmo de las animaciones.
- **Mesa de TV:** la imagen `mesas-de-tv/mdtv-kevin.webp` se usa ahora en la categoría Sala.
- **Logo:** el logo del pie pasa de 2,5 rem a 3,5 rem de alto.
- **Servicios (bento clicable):** cada celda es ahora un enlace completo, con «Ver detalle» como texto accesible (no un enlace anidado). Al pasar el cursor o enfocar con teclado aparece una bola de color dorado tenue (radial) detrás del contenido, señalando que se puede hacer clic; en la celda oscura la bola usa bronce claro.
- **Animaciones suaves ligadas al scroll:** el revelado de bloques deja de ser un tween único (`once`) y pasa a `scrub`, de modo que los elementos siguen el recorrido del usuario (aparecen y se asientan con el desplazamiento, sin brusquedad). La cota ahora se dibuja dentro de la misma línea de tiempo. La curva del héroe se suaviza a `power2.out`.
- **Archivos:** `content/images.ts`, `content/demo.ts`, `blocks/Services.tsx`, `blocks/Footer.tsx`, `lib/useScrollAnimations.ts`, `styles/blocks.css`, `styles/motion.css`, `scripts/motion-check.mjs`.
- **Verificación:** build sin errores; `check:layout`, `check:motion` y `check:theme` pasan; capturas en escritorio y móvil con la mesa de TV y el bento.

---

### E-19 — Bento con carga dorada, footer natural y parallax

- **Qué se hizo:** refinamiento del bento, corrección del footer y profundidad de scroll.
- **Bento:** la bola estática se sustituyó por una **carga dorada** que rellena el recuadro de izquierda a derecha en 300 ms al pasar el cursor o enfocar con teclado, coloreándolo por completo de dorado tenue para indicar que es clicable. La celda oscura usa bronce claro.
- **Footer:** el revelado pasó de scrub (que dejaba el pie atenuado por no tener scroll restante) a un tween único que siempre llega a opacidad 1; el footer recupera su color natural.
- **Parallax y scrollstorytelling:** la imagen del héroe y su contenido se mueven a distinta velocidad (la imagen baja mientras el texto se aleja y se desvanece al salir); las imágenes de categorías y showroom tienen un parallax sutil (escala 1,14 con desplazamiento ±5 %).
- **Revelado:** los bloques aparecen una vez con curva suave (900 ms, `power2.out`), garantizando opacidad completa en toda la página.
- **Verificación:** build sin errores; `check:layout`, `check:motion` y `check:theme` pasan; comprobación de opacidad del footer y del contacto en 1 tras el scroll.
- **Pendiente:** nada funcional; ajustar la intensidad del parallax según el gusto de la marca (los valores están en `useScrollAnimations.ts`).

---

### E-20 — Referencias de animación y showroom 3D

- **Qué se hizo:** se adaptaron patrones de las referencias y se implementó el showroom 3D.
- **Animación adaptada:** los títulos de sección se revelan con una máscara (de abajo hacia arriba), un patrón editorial presente en las referencias; se suma al sistema ya existente (héroe con máscara, parallax, bento con carga dorada, botón magnético).
- **Showroom 3D (D-24):**
  - Stack: Three.js + React Three Fiber + Drei (versiones compatibles con React 18).
  - Escenario de estudio: suelo claro, luz suave y sombras de contacto.
  - Tres muebles modelados proceduralmente con formas naturales (no cajas planas): **comedor** (sobre redondeado, faldón y patas cónicas), **centro de mesa** (sobre, entrepaño y patas) y **mesa de TV** (cuerpo bajo, frentes de cajón y pies).
  - Interacción: OrbitControls (girar y acercar, auto-rotación sutil) y selección por clic o por la leyenda de productos.
  - Accesibilidad y rendimiento: auto-rotación desactivada con `prefers-reduced-motion`; la leyenda de productos es operable por teclado; el escenario se monta solo al acercarse (lazy + IntersectionObserver) y se carga en un chunk aparte.
- **Rendimiento:** el bundle inicial sigue en ~102 KB comprimidos; el chunk del showroom 3D (Three + R3F + Drei) pesa ~223 KB comprimidos y carga bajo demanda.
- **Verificación:** build sin errores; `check:layout`, `check:motion` y `check:theme` pasan; lectura de píxeles del lienzo confirma que el escenario renderiza los muebles (tonos de madera sobre el suelo), no un lienzo vacío.
- **Pendiente:** ajustar materiales/iluminación y proporciones de los muebles según la imagen de referencia (que el modelo no pudo leer), y decidir si el auto-rotado se deja fijo o por defecto.

---

### E-21 — Menú mega, imágenes de aparadores y vista rápida sobre el catálogo existente

- **Contexto:** al retomar el proyecto había trabajo paralelo (página `#catalogo` con búsqueda/filtros/orden, carrito, `ProductDetails`, vídeo en el héroe y transiciones de vista). Mis cambios previos chocaban con él y dejaban el build roto. El cliente aprobó **integrar sobre lo existente**.
- **Qué se hizo:**
  - **Arreglo del build:** se eliminaron las props que Header/Shop exigían y ya no se pasaban, y se reconcilió el flujo de navegación.
  - **Menú mega (referencia muebles.es):** en la cabecera, «Tienda» abre un panel con las categorías (Aparadores, Mesas de centro, Mesas de TV, Roperos, Escritorios, Archivadores) y una imagen destacada que sigue al hover. Al elegir una categoría se navega a `#catalogo?categoria=<id>`.
  - **Imágenes de aparadores:** se añadieron los 6 aparadores de Drive (Escanor, Aira, Arden, Arian, Ars, Bruyne) al `demo.ts`/`images.ts`, con su imagen principal, marcados «por mientras» (precio en 0 → se muestra «Consultar» y medidas por confirmar).
  - **Vista rápida:** se reutilizó el diálogo `ProductDetails` existente (imagen + color + medidas + agregar al carrito) como previsualización del producto.
- **Reconciliación de navegación:** `App.tsx` ahora interpreta `#catalogo?categoria=<id>` y pasa la categoría inicial al catálogo; `CategoryTile` hace `preventDefault` para que la selección controle la navegación.
- **Eliminados (duplicados míos):** `content/catalog.ts`, `components/QuickView.tsx` y `styles/catalog.css`; los estilos del menú mega se movieron a `styles/blocks.css`.
- **Formato:** `formatPEN` devuelve «Consultar» para precios en 0.
- **Verificación:** build sin errores; `check:layout`, `check:motion` y `check:theme` pasan; comprobación funcional: el menú mega abre al hover, al elegir «Aparadores» navega a `#catalogo?categoria=aparadores` y muestra 6 aparadores, y el diálogo `ProductDetails` abre.
- **Pendiente:** completar SKU, precios y medidas reales de los 6 aparadores cuando estén en Carga General; decidir si las variantes de color (Arden y Arian) se muestran como productos separados.

---

## Próximos pasos previstos

| Orden | Paso | Estado | Depende de |
|---|---|---|---|
| 1 | Aprobar la propuesta de inicio | Completado (E-09, E-10) | Usuario |
| 2 | Construir el esqueleto visual en local | Completado (E-11) | Paso 1 |
| 3 | Revisar el prototipo en escritorio, móvil y modo oscuro | En curso | Paso 2 |
| 4 | Ajustar tono del bronce, jerarquías y contenido de ejemplo | Pendiente | Paso 3 |
| 5 | Construir Showroom, Tienda, Servicios y Contacto | Parcial: catálogo (#catalogo) y vista rápida listos | Paso 4 |
| 6 | Reproducir la home en el entorno de pruebas de WordPress | Pendiente | PA-01 y paso 4 |

---

## Plantilla para la siguiente entrada

```text
### E-22 — [título de la entrega]

- Qué se hizo:
- Decisiones aplicadas:
- Archivo(s):
- Pendiente de aprobación:
- Responsable del siguiente paso:
```
