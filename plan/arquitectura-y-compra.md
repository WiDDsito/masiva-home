# Arquitectura y flujo de compra

## Propiedad de los datos

WordPress aloja la tienda y WooCommerce conserva la sesión comercial, precios, stock, variantes, entrega y pago. React presenta el catálogo y envía operaciones a la Store API. La ficha debe resolver el ID de la variante que corresponde al acabado elegido antes de habilitar la compra.

Los productos locales usados para consultas por WhatsApp toman sus precios públicos de Carga General. Cotizaciones sirve como referencia informativa. El catálogo local guarda identificadores y cantidades en el navegador. Sus precios se resuelven al mostrar la selección para que una visita posterior utilice los valores actuales del catálogo local.

## Continuidad entre las vistas

El cliente explora el catálogo, elige una variante y revisa su selección en el carrito o el resumen de compra. Las modificaciones comerciales conservan la cookie de sesión y utilizan el nonce que devuelve WooCommerce. Si una respuesta se pierde, se vuelve a consultar el carrito antes de que el cliente repita la operación.

Con una página de carrito configurada, MasivaHome ofrece el enlace nativo y utiliza la página de checkout configurada para continuar al pago. Cuando WordPress omite la ruta del carrito, el destino acordado es [Finalizar compra en Masiva Home](https://masivahome.com/finalizar-compra/). La instalación que procese el pago debe reconocer la misma sesión comercial.

## Portada y showroom

La portada carga directamente el video. Con movimiento reducido se mantiene en pausa. El showroom carga la escena cuando su área de visualización entra en pantalla y ofrece acceso al catálogo si el dispositivo no puede mostrar el 3D. Sus modelos son representaciones visuales. Las condiciones comerciales se consultan en la ficha del producto.
