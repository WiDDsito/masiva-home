# Masiva Home — web local

Home en React + TypeScript + Vite, con catálogo filtrable, carrito local y showroom 3D. No se ha publicado ni se ha conectado a WordPress/WooCommerce.

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

Consulta `REVISION-2026-11-11.md` para los hallazgos, fuentes, validaciones y límites de esta entrega.

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


## Catálogo y acceso rápido (13 de noviembre de 2026)

El catálogo conserva la identidad de Masiva Home y toma de muebles.es la navegación por familias con previsualización. Incluye cinco accesos directos, menú agrupado con las 31 familias, filtro por familia/ambiente, búsqueda por nombre/SKU/acabado, orden por precio y acceso al carrito compartido. Los productos sin precio confirmado quedan al final de ambos órdenes por precio, muestran «Precio por confirmar» y ofrecen consulta; no se añaden al carrito desde este catálogo.

`CatalogCard` y `CatalogPreview` pertenecen al catálogo; los componentes compartidos de Inicio y Showroom no se modifican. La galería usa los WebP de `assets/images/aparadores`, con dos acabados de Arden y cuatro de Arian, fotografías de detalle y medidas. `catalogMedia.ts` mantiene únicamente sus URL: las fotos de galería se descargan al abrir la vista rápida. Los precios y medidas de inventario no se alteran. Los datos pendientes siguen pendientes hasta contrastarlos con Carga General.

Inicio/Tienda se reduce a dos productos y el botón «Ver catálogo completo». Se conservan cabecera, hero/video, showroom, servicios, contacto y pie. No se agregan dependencias.

Validación: `npm run build`, `npm run check:catalog-navigation` (390/1440 px) y `npm run check:catalog-visual` (320/390/768/1024/1440 px). Las pruebas cubren selección rápida, búsqueda por SKU, 31 familias, galería de seis aparadores, acabados, retorno del foco al cerrar, carrito, estados vacíos, orden por precio, carga de fotos diferida y desbordamiento. Los scripts aceptan `URL` para probar la compilación estática. No equivale a una auditoría de Core Web Vitals.

## Video moderno y menú Tienda (13 de noviembre de 2026)

La portada usa `assets/videos/modern-template.mp4`, conservando reproducción inline, silencio forzado, pausa manual, pausa fuera de pantalla y respeto de movimiento reducido. No se altera el archivo original; pesa 1,4 MB. Con movimiento reducido se mantiene el póster y no se descarga el MP4.

Se corrigió el espacio entre el disparador Tienda y el panel: el área de navegación abarca toda la altura de la cabecera y el cierre por salida del cursor tolera 180 ms. El estado distingue apertura por hover de apertura fijada por clic/teclado. Clic tras hover mantiene el panel, Escape y clic fuera lo cierran y el foco no vuelve a abrirlo por CSS. Las categorías se agrupan en Sala y comedor, Dormitorio y Oficina y orden; la imagen responde al cursor o foco y permite navegar. En móvil, Tienda despliega las mismas categorías dentro del menú.

Pruebas: `npm run check:header-menu` reproduce el recorrido lento que fallaba en el menú original. `npm run check:header-experience` verifica móvil/escritorio, teclado, foco, cabecera compacta, cierre exterior, navegación por imagen, selección y reproducción silenciada del video. Ambos aceptan `URL`.

## Transiciones y bolsa local (13 de noviembre de 2026)

La ficha de los productos destacados reutiliza la galería de `CatalogPreview`, con fotos y medidas, entrada local y salida animada. Abrir/cerrar una ficha ya no inicia una transición de página completa. El cierre respeta movimiento reducido y devuelve el foco a la imagen de origen. El CTA «Ver catálogo completo» usa la misma variante primaria que «Ver tienda».

Al elegir una categoría desde la cabecera, se espera la animación de cierre antes de cambiar la ruta: las capturas de View Transitions no incluyen un menú semitransparente. Se evita reabrir por un cursor estacionado durante el cambio y se conserva el acceso por clic/teclado. En móvil se anima la salida del menú antes de retirarlo.

La bolsa de cabecera usa la cantidad del carrito compartido y abre su diálogo sin cambiar la ruta. El aviso de agregado incorpora icono, mayor contraste y «Ver bolsa»; permanece seis segundos y reinicia su tiempo al agregar de nuevo el mismo producto. El carrito conserva cantidades entre inicio, catálogo y recarga local. Sigue pendiente la integración comercial con WooCommerce.

Pruebas nuevas: `npm run check:transitions` (incluye inspección de la cabecera al iniciar View Transitions) y `npm run check:bag` (contador, aviso, apertura sin redirección, cantidades, persistencia y eliminación), en móvil y escritorio. Aceptan `URL`.

## Showroom: indicadores y continuidad de compra (13 de noviembre de 2026)

Los muebles comprables muestran un indicador «+» anclado a su posición 3D: Fabela y Kevin en Sala, Escanor en Comedor y Runa en Dormitorio. Se pueden activar con ratón, toque o teclado, muestran el nombre al pasar el cursor/enfocar y reflejan la selección con una marca de verificación. Siguen el zoom, la rotación y el cambio de ambiente; se ocultan detrás de la geometría. La decoración no lleva indicadores. Se mantienen los controles inferiores como alternativa accesible. No hay pulsaciones o animaciones continuas de los indicadores.

La prueba de comercio del showroom se actualizó a la estructura actual del catálogo y amplió el recorrido: Fabela ×2 + Kevin ×1 desde showroom, Escanor ×1 desde catálogo, vuelta a Inicio y recarga en Catálogo. Se comprueba la misma bolsa con cuatro unidades en tres líneas y subtotal S/ 3,656.00, conservando selección, filtros y precios.

«Explorar el catálogo» conserva la transición de página y ahora restablece el scroll antes de capturar la vista de destino. El catálogo aparece desde su encabezado, también al venir desde una sección profunda. Cuando no existe View Transitions, hay una entrada breve de opacidad/desplazamiento; movimiento reducido sigue ofreciendo el cambio inmediato.

Pruebas: `check:showroom-hotspots`, `check:showroom-commerce`, `check:showroom-transition` (nativa y alternativa) y `check:render`. Se verificó cero llamadas de dibujo WebGL en reposo y fuera de pantalla; esto no equivale a una certificación de FPS o Core Web Vitals.

## Ajuste del fundido Showroom → Catálogo (13 de noviembre de 2026)

El enlace «Explorar el catálogo» usa una transición específica de opacidad sobre la vista completa. Se evita que View Transitions anime el rectángulo de todo el contenido (en la prueba anterior se desplazaba desde y=-2009 px y cambiaba su altura de unos 5800 a 1900 px), y se retiran el zoom y la máscara de esta navegación. La salida dura 220 ms y la entrada 420 ms, con un solapamiento breve y sin mover el encuadre. La cabecera conserva su capa estable.

Las primeras fotografías visibles se preparan antes de capturar el destino, con espera máxima de 180 ms para no bloquear la navegación en una conexión lenta. Sin la API nativa se aplica salida/entrada por opacidad; con movimiento reducido el cambio sigue siendo inmediato. Las demás rutas mantienen sus transiciones existentes. La prueba `check:showroom-transition` inspecciona los fotogramas para comprobar que no hay transformación del contenido largo y que el destino está al inicio del catálogo.

## Fundido del CTA de Inicio (13 de noviembre de 2026)

El botón «Ver catálogo completo» de Inicio reutiliza el fundido de «Explorar el catálogo», incluidas preparación de fotografías y alternativa sin la API nativa. «Ver todo el catálogo» del menú Tienda también utiliza este fundido. La navegación se coordina desde App para capturar la posición actual antes de restablecer el scroll de la vista de destino. Los accesos individuales a categorías conservan su variante anterior.


## Menú: catálogo desde la posición actual (13 de noviembre de 2026)

«Ver todo el catálogo» cierra el menú sin desplazar el foco y realiza el fundido desde el punto donde estaba el usuario. El scroll del catálogo se reinicia después de capturar el origen; no se recorre Inicio. La prueba `check:menu-position` comprueba el scroll en el instante del clic y al iniciar la transición desde Showroom, Servicios y Contacto, en móvil y escritorio. El historial de cambios se mantiene en Git/GitHub; no se crean nuevos respaldos locales.


## Revisión con skills: navegación, catálogo y bolsa

La búsqueda de cabecera abre el catálogo mediante su transición y enfoca el campo. Categoría, consulta y orden quedan en la URL (`categoria`, `q`, `orden`), se recuperan al recargar o volver atrás y no crean una entrada del historial por cada tecla. Se conservan las categorías y fotografías existentes.

El aviso de agregado pausa su vencimiento mientras recibe foco, cursor o la bolsa está abierta. El cierre de la bolsa devuelve el foco al botón de origen. Si un producto alcanza 99 unidades, el aviso informa del límite en vez de confirmar un agregado inexistente. Las acciones estables del carrito se separan de su estado, evitando actualizar las tarjetas y el showroom al desaparecer un aviso. La galería reutiliza sus metadatos.

Comprobaciones adicionales: `check:audit-usability` (búsqueda, filtros persistentes, historial, teclado y aviso), `audit:performance` (descargas iniciales y tamaños) y `audit:feedback-render` (dibujos WebGL al vencer el aviso). Aceptan `URL`. Las mediciones y limitaciones están en `../docs/Revision-skills-2026-11-13.md`. No se incorporan dependencias ni se modifica la dirección visual.


## Iteración de prioridades altas — 16 de noviembre de 2026

La bolsa escucha cambios del almacenamiento de otras pestañas y vuelve a leer la selección al recuperar foco. Cada operación lee los datos vigentes antes de guardar; Web Locks serializa los cambios simultáneos en navegadores compatibles y contexto seguro (también localhost). No se escribe al montar ni al recibir cambios remotos, evitando sobrescribir una selección existente. Se conserva `mh-cart-v1`. Sin Web Locks se mantiene la sincronización y lectura reciente, aunque no se garantiza atomicidad entre escrituras simultáneas; con almacenamiento bloqueado la bolsa sigue funcionando en memoria. Esto no sustituye la sesión comercial de WooCommerce.

En móvil (hasta 640 px), la ficha seleccionada del showroom aparece debajo del visor y conserva precio, compra y contraste de foco; el modelo queda libre de la ficha. Escritorio mantiene la composición existente.

Las categorías del pie abren el catálogo con su filtro. Preguntas frecuentes, entrega/recojo y garantía abren `#ayuda?tema=…`, con información confirmada y consultas específicas por WhatsApp. No se inventan políticas, plazos ni cobertura. Privacidad y términos se identifican como consultas; el Libro de reclamaciones pendiente no simula un enlace publicado.

`npm run check:priority-one` comprueba sincronización entre pestañas, agregados simultáneos, eliminación y recarga, almacenamiento bloqueado, ficha móvil a 320/390/640 px, categorías del pie y destinos de ayuda. La prueba de bolsa espera la operación de almacenamiento antes de comprobar cantidades, conservando sus aserciones.

Esta entrega se compila para revisión local. La subida a GitHub queda pendiente de aprobación. Las prioridades medias continúan fuera de esta iteración.


## Iteración de prioridades medias — 16 de noviembre de 2026

Cambiar cantidades conserva el orden de los productos. La bolsa se cierra con salida de 180 ms y fundido del fondo, mediante botón, Escape o «Seguir explorando»; permanece modal hasta terminar y restituye el foco. Con movimiento reducido se usa solo un fundido de 80 ms. Las animaciones terminadas se limpian para permitir reaperturas. Se conserva la sincronización entre pestañas de la iteración anterior.

Si falla la creación del 3D o se pierde su contexto WebGL, el showroom muestra fotografías reales del catálogo por ambiente. Mantiene selección, precio y compra; retira controles e instrucciones de giro/zoom que no corresponden a fotografías. «Ver fotos y medidas» abre el catálogo filtrado con el fundido existente. No se cambia la selección a fotografías cuando el contexto 3D funciona.

El hero móvil conserva el video y distribución, ajustando su encuadre y el sombreado detrás del texto. El texto secundario gana contraste. La comprobación controlada sobre fondo blanco a 390 px midió como mínimo 4,94:1 en los puntos de texto muestreados; no equivale a certificar toda la página. Escritorio conserva su tratamiento.

Se elimina el reinicio global a `0.01ms`. Cada componente decide su alternativa: sin traslaciones, zoom de hover o barrido de burbuja; se conservan estados visibles y transiciones breves de color u opacidad. El video sigue sin descargarse con movimiento reducido.

Guías consultadas de Modern Web Guidance: `animate-to-from-top-layer` (mantener la capa modal hasta finalizar y encaminar Escape por el mismo cierre) y `motion` (reducir por componente, sin anular globalmente el feedback). El cierre usa Web Animations y `data-closing` mientras el diálogo sigue abierto, sin depender de transiciones discretas de `display`/`overlay` ausentes en algunos navegadores.

Pruebas: `check:cart` añade orden estable; `check:priority-medium` cubre cierre y reapertura, Escape, foco, movimiento reducido, WebGL deshabilitado, selección fotográfica y compra. `check:experience` espera la sincronización y el cierre antes de continuar, manteniendo sus comprobaciones. Sin dependencias nuevas, respaldos ni subida a GitHub.


## Ajuste perceptible del cierre y entrada del hero — 16 de noviembre de 2026

La medición por fotogramas detectó que la salida anterior sí se ejecutaba, pero a los 80–90 ms ya había desplazado casi todo el panel y reducido su opacidad a aproximadamente 0,09: visualmente parecía desaparecer. La bolsa ahora conserva su opacidad durante un deslizamiento de 320 ms con curva de aceleración/desaceleración. El fondo usa la misma duración y el diálogo permanece modal hasta terminar. Movimiento reducido utiliza solo un fundido de 160 ms. Se conservan Escape, reapertura y retorno del foco. La duración está coordinada mediante `--cart-close-duration`.

La entrada del hero ahora la controla CSS desde su primer render, sin esperar los imports diferidos de GSAP. Una capa visual revela y reescala el video mientras título, descripción, botones, medidas y atributos aparecen de forma coordinada. El scroll posterior del video continúa en una capa distinta, sin competir por el mismo transform. La introducción ocurre una vez al visitar Inicio durante la carga actual del documento; no se repite al volver desde Catálogo. Una recarga permite verla de nuevo. Con movimiento reducido se muestra el estado final sin desplazamientos, y cambiar esa preferencia durante la entrada la detiene.

`check:cart-hero-motion` mide visibilidad y desplazamiento durante la parte central de la salida, tanto en Inicio como en Catálogo; comprueba reapertura/foco y el hero a 390/1440 px con GSAP retrasado. Esta verificación sustituye la suposición de que encontrar una animación activa basta para demostrar que el cierre se percibe suave. Los ajustes anteriores de 180/80 ms quedan sustituidos por 320/160 ms en esta revisión. No se crean respaldos ni se publica en GitHub.


La comprobación sobre producción detectó y corrigió una diferencia adicional: el minificador CSS expresa `320ms` como `.32s`. El controlador convierte explícitamente segundos o milisegundos a la unidad que espera Web Animations, para que el cierre compilado conserve la misma duración. Se verifica la visibilidad intermedia contra el `dist` servido, además de la ejecución en desarrollo.


## Entrada del menú principal — 16 de noviembre de 2026

Al cargar el documento, Inicio, Tienda, Showroom, Servicios y Contacto aparecen con un desplazamiento vertical de 8 px y opacidad progresiva. Cada enlace dura 420 ms con un escalonado de 60 ms, empezando a los 120 ms para acompañar la entrada del hero. Se anima el botón Tienda, no su contenedor, conservando el anclaje del desplegable al ancho del header. El logotipo y las acciones de búsqueda/tema/bolsa no se animan. En móvil entra solo el botón que abre el menú.

La animación termina una vez y no se repite al navegar o cambiar cantidades. Se cancela al interactuar o enfocar la cabecera y al activar movimiento reducido. La navegación conserva su disponibilidad durante la entrada. `check:header-entry` comprueba ambos tamaños, ausencia de animación en otros controles, desplegable, navegación y teclado con movimiento reducido. Compilación local, sin respaldos ni publicación en GitHub.
