# Interacciones y showroom del 12 de noviembre de 2026

Registro histórico del frontend. La ficha comercial actual identifica cada variante mediante los datos de WooCommerce. Las rutas de código y los comandos de esta entrega se leen desde `web/`. [Estado actual](actualizaciones.md)

## Interacciones de producto y Servicios (12 de noviembre de 2026)

Los botones de acción comparten el componente `Button` y el mismo muelle de `Magnetic`, con un área de interacción estable. El efecto no se aplica con movimiento reducido ni con punteros táctiles. Las imágenes de producto abren una ficha rápida accesible (`ProductDetails`); el botón de agregar conserva su acción independiente. La ficha permite consultar foto, precio, acabado, medidas y SKU, añadir al carrito y cerrar con Escape, recuperando el foco.

En Servicios, el relleno circular parte del punto de entrada del puntero, crece hasta cubrir el bloque y se contrae al salir. También se activa con foco visible. El tamaño se calcula una sola vez al entrar y se anima solo la transformación, sin bucles.

## Sistema de animaciones (12 de noviembre de 2026)

| Efecto | Implementación |
|---|---|
| Cinematic Mask Reveal | Máscara de entrada del Hero y revelado de imágenes de categorías al entrar en pantalla. |
| Split Text Reveal | Palabras escalonadas en el Hero y títulos de las secciones; el texto conserva su estructura accesible. |
| Scroll-driven Hero | Escala y posición de la imagen, desplazamiento y opacidad del contenido ligados al scroll. |
| Magnetic Cursor | Muelle compartido de los CTA, selectores de ambientes y piezas y enlace destacado del showroom. |
| Shared Element Transition | La fotografía conserva un nombre único al pasar de tarjeta a ficha y al volver. |
| 3D Tilt Product Cards | Perspectiva y rotación suave de hasta unos dos grados según el cursor; puntero fino únicamente. |
| Interactive Room Exploration | Sala, comedor y dormitorio ilustrativos; rotación, zoom por controles, desplazamiento opcional y selección de muebles con información de la representación. |
| Room Morphing | Cambio progresivo de composición con salida/entrada, giro, cámara, fondo e iluminación. No se interpolan los vértices de muebles de topología diferente. |
| Sticky Storytelling | Imagen, indicador y título de Servicios permanecen fijos en escritorio y cambian según el bloque más próximo al centro de lectura; se conserva el relleno circular. |
| Fluid Page Transitions | Máscaras, escala y opacidad entre Inicio y catálogo, además de la continuidad de la fotografía de producto. |

`src/lib/viewTransition.ts` utiliza View Transitions cuando están disponibles y aplica el cambio de inmediato como alternativa. El historial y el foco no dependen de la animación. No hay navegación a nuevas rutas de servidor: se mantienen las vistas por hash existentes.

El 3D sigue cargándose de forma diferida; se renderiza bajo demanda, se pausa fuera de pantalla y en pestañas ocultas, y el giro automático sigue siendo opcional. Los ambientes y materiales son ilustrativos, no reproducciones ni características confirmadas de productos a la venta. Los datos comerciales del catálogo no se modificaron.

Con movimiento reducido se omiten máscaras, escalonados, perspectiva, transiciones de vistas y viajes animados de cámara. El contenido y los controles siguen disponibles; Servicios pierde la fijación. En móvil se evita la inclinación por cursor y se adapta el encuadre de los ambientes completos.

Comprobaciones: `npm run check:new-motion`, `npm run check:render` y `WIDTH=390 npm run check:render`, además de los controles de catálogo, productos, servicios y experiencia existentes. Chrome local registró cero llamadas de dibujo WebGL en reposo y fuera de pantalla, también a 390 px. La prueba de selección 3D utiliza un clic real sobre el ropero, además de los controles accesibles. Se verifica también la navegación sin View Transitions.

Peso del JavaScript principal: unos 107,7 KB gzip frente a 105,8 KB de la versión previa; el bloque 3D diferido queda en unos 223,5 KB gzip. Esta comparación de archivos no equivale a una medición de Lighthouse ni a una certificación de Core Web Vitals. No se incorporaron dependencias nuevas.

Referencias técnicas: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ y https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition

## Showroom de catálogo y video de portada (12 de noviembre de 2026)

- Portada: `assets/videos/template-header-vid.mp4` sustituye a la imagen conservando textos, distribución y animaciones. El archivo de trabajo se exportó sin pista de audio mediante AVFoundation en modo passthrough, sin recodificar la imagen. También se fuerza `muted`, `defaultMuted` y volumen cero. Incluye pausa, reproducción inline, pausa fuera de pantalla/con pestaña oculta y respeto de movimiento reducido. El original con audio se conserva en el respaldo.
- Ambiente inicial: Sala. Los selectores siguen Sala → Comedor → Dormitorio y los productos inferiores se filtran por el ambiente activo. Sala: Centro de mesa / Mesa de TV; Comedor: Aparador Escanor; Dormitorio: Ropero. La cama, mesa de comedor, sofá y accesorios son ambientación, no productos añadidos al catálogo.
- Selección: pulsa el mueble o su botón para enfocar. La cámara desplaza su punto de interés hacia el producto y reduce su distancia un 16 %. Pulsar de nuevo, elegir Vista general, pulsar Escape en el showroom o hacer clic en espacio vacío deselecciona y recupera la vista general. Restablecer vista también limpia la selección. Se detiene el giro automático al seleccionar para poder inspeccionar el producto.
- Referencias: copias locales de las fotos de Drive ya utilizadas por el catálogo. Se verificó también la fotografía «Sin fondo.jpg» de Fabela en https://drive.google.com/drive/folders/1JC3XYgz7MZjCaKSvVT_cPk3TW4tWlGmH . No se editaron archivos de Drive ni precios.
- Fabela: proporciones de 110 × 40 × 60 cm, sobre negro, cuerpo con almacenamiento abierto, división lateral, cajón y patas negras. Kevin: 200 × 50 × 40 cm, estructura en tono madera, frentes plomo y nichos superiores. Escanor: 130 × 100 × 35 cm, geometría diagonal y base blanca escalonada. Runa: 230 × 220 × 50 cm, seis puertas, centro acanalado, frentes claros y tiradores largos.
- La sala integra a Kevin en la pared de fondo para mantener visibles sus frentes. Se incorporan suelo de tablas, paredes, zócalos, ventana, cortinas y mobiliario de ambientación. Los materiales de madera y tejido son texturas procedurales locales; el entorno de iluminación se calcula una vez y no descarga HDR externos.
- Son reconstrucciones visuales, no escaneos 3D ni planos de fabricación. Las fotos y medidas permiten aproximar volumen y acabado; traseras, herrajes interiores y perfiles ocultos no están definidos por estas referencias.

`npm run check:showroom-realism` comprueba en móvil y escritorio el video, el silencio permanente, la pausa fuera de pantalla, el orden y filtrado de los controles, el zoom de selección y el retorno por deselección. Las pruebas existentes de catálogo, carrito, animaciones, teclado y movimiento reducido se conservan. La comprobación de renderizado espera a que finalice el movimiento inicial de cámara antes de medir el reposo; mantiene las exigencias de cero llamadas de dibujo en reposo y fuera de pantalla.

## Compra desde showroom y categorías del filtro

La ficha del mueble seleccionado muestra el mismo precio del catálogo (formato PEN) y permite agregarlo directamente al carrito compartido. No cambia de vista ni limpia la selección; conserva las cantidades, la persistencia y la confirmación de agregado existentes. El panel acepta eventos de puntero para que el botón pueda operarse sobre el visor 3D, y el precio mantiene su énfasis en móvil.

El desplegable de categoría conserva los cinco filtros por ambiente y añade las 31 familias de los archivos de inventario/Drive. No se añadieron productos ni controles nuevos. Las siete variantes cargadas se clasifican por familia en `src/content/catalogFilters.ts`; una familia sin productos cargados muestra el estado vacío existente. Se conserva «Carpetas / Pupitres» como etiqueta conjunta de las dos denominaciones de las fuentes.

`npm run check:showroom-commerce` verifica precio, agregado directo y repetido, selección conservada, carrito compartido entre vistas, opciones del desplegable, filtros por familia y estado vacío en móvil y escritorio.

## Menú mega y aparadores de Drive (12 de noviembre de 2026)

- **Menú mega (referencia muebles.es):** «Tienda» abre en la cabecera un panel con las categorías que tienen producto (Aparadores, Mesas de centro, Mesas de TV, Roperos, Escritorios, Archivadores) y una imagen destacada que sigue al hover. Elegir una categoría navega a `#catalogo?categoria=<id>`; «Todos los muebles» abre el catálogo completo. El patrón vive en `src/components/MegaMenu.tsx` y los estilos en `styles/blocks.css`.
- **Aparadores:** se añadieron a `images.ts` y `demo.ts` los seis aparadores con fotografía local de Drive (Escanor, Aira, Arden, Arian, Ars, Bruyne), clasificados en la familia `aparadores` de `catalogFilters.ts`. Como sus datos comerciales aún no están en Carga General, se marcan «por mientras»: precio `0` → la interfaz muestra «Consultar», y las medidas quedan «por confirmar».
- **Vista rápida:** se reutiliza el diálogo `ProductDetails` existente (foto, acabado, medidas, SKU y agregar al carrito) como previsualización; no se duplicó un modal propio.
- **Navegación:** `App.tsx` interpreta `#catalogo?categoria=<id>` y pasa la categoría inicial al catálogo; `CategoryTile` hace `preventDefault` para que la selección controle el destino. `formatPEN` devuelve «Consultar» para precios en 0.
- **Reconciliación:** se eliminaron los duplicados de la tanda anterior (`content/catalog.ts`, `components/QuickView.tsx`, `styles/catalog.css`) para no mantener dos catálogos; su contenido se integró en la estructura existente sin tocar carrito, showroom, héroe ni el resto.
