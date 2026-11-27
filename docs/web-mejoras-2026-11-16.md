# Mejoras del 16 de noviembre de 2026

Registro histórico del frontend. La implementación posterior del carrito y de los filtros comerciales se recoge en las actualizaciones. Las rutas de código y los comandos de esta entrega se leen desde `web/`. [Estado actual](actualizaciones.md)

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


## Servicios informativos — 16 de noviembre de 2026

La sección conserva su distribución, fotografía lateral con cambio por scroll y llenado circular al entrar/salir el puntero. Sus cuatro servicios son Diseño de interiores, Muebles personalizados, Delivery e Instalación y montaje. Las tarjetas son artículos informativos: no navegan, no muestran «Ver detalle» ni simulan botones, y no añaden paradas de tabulación. La animación respeta movimiento reducido. Las fotografías existentes siguen siendo referencias del catálogo, sin presentarlas como obras o instalaciones realizadas.

«Cotizar mi proyecto» abre una consulta específica por WhatsApp y «Explorar catálogo» usa el fundido existente. Ambos están separados de las tarjetas y accesibles por teclado. Recojo y garantía permanecen en Ayuda; se retira la antigua promesa no confirmada de recojo gratuito de la sección Servicios.

`check:services` verifica el contenido, la semántica informativa, ausencia de navegación al pulsar las tarjetas, origen circular en el cursor, crecimiento/vaciado del relleno, acciones separadas y movimiento reducido. Entrega local, sin respaldos ni subida a GitHub.


## Nuevos aparadores Capra y Cedric — 16 de noviembre de 2026

Se incorporan las carpetas `assets/images/aparadores/capra` y `cedric`, con seis fotografías WebP por modelo. Cada ficha usa su fotografía principal y galería de ambiente, detalles, interior y medidas; la lámina de medidas queda al final. Las imágenes originales se conservan, sin derivados ni metadatos `._` de macOS. Las fotos de detalle siguen cargándose al abrir la vista rápida.

El catálogo suma 14 modelos y el filtro Aparadores muestra ocho. Capra tiene 120 × 85 × 45 cm y Cedric 180 × 80 × 40 cm (largo × alto × fondo), según sus láminas locales. SKU, nombre comercial del acabado y precio siguen pendientes de validación con Carga General: se usa «Acabado según fotografía» y «Precio por confirmar», con consulta por WhatsApp y sin compra a precio cero. Inicio conserva sus dos productos destacados.

`check:catalog-visual` incluye ambas fichas, sus seis imágenes, medidas y consulta de precio a 320/390/768/1024/1440 px. Se actualizan las cantidades esperadas en las pruebas existentes de catálogo, menú y showroom, sin retirar comprobaciones. Entrega compilada en local; sin respaldos ni subida a GitHub.
