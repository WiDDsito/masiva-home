# Catálogo y navegación del 13 de noviembre de 2026

Registro histórico del frontend. La portada actual solicita directamente el MP4 y el showroom carga al entrar su escenario en pantalla. Las rutas de código y los comandos de esta entrega se leen desde `web/`. [Estado actual](actualizaciones.md)

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

Comprobaciones adicionales: `check:audit-usability` (búsqueda, filtros persistentes, historial, teclado y aviso), `audit:performance` (descargas iniciales y tamaños) y `audit:feedback-render` (dibujos WebGL al vencer el aviso). Aceptan `URL`. Las mediciones y limitaciones están en [revisión archivada](https://github.com/WiDDsito/masiva-home/blob/6da8b32186f5089619c831de1de590f5325977a4/docs/Revision-skills-2026-11-13.md). No se incorporan dependencias ni se modifica la dirección visual.
