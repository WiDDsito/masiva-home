# Guía de negocio: Rediseño de MasivaHome.com (fase 1)

> **Copia aprobada para distribución.** Publicada en `docs/` el 2026-11-11 desde `plan/GUIA-negocio-masiva-home.md` (v0.9). La fuente de trabajo vive en `plan/`: para actualizar este documento se modifica la fuente y se publican de nuevo las copias de `docs/`. No editar este archivo directamente. En `docs/`, el equivalente técnico es `02-especificacion-tecnica.md`.

> Versión: **0.9** — 11 de noviembre de 2026. Estado: decisiones aprobadas; pendiente de respuestas de negocio.
> **¿Para quién es este documento?** Para supervisores, administración, marketing y cualquier persona del equipo que no programa. Explica el proyecto en lenguaje cotidiano y lo que necesitamos de cada área.
> El documento hermano `SPEC-masiva-home.md` es la versión técnica completa para los encargados de desarrollo. Ambos comparten la misma información y el mismo numerado: si esta guía menciona una decisión «D-14» o una pregunta «PA-16», ahí está la versión detallada.

---

## 1. El proyecto en pocas palabras

Vamos a renovar masivahome.com para que el visitante pueda, sin ayuda externa:

- **Recorrer todo el catálogo** de muebles por categoría, con fotos reales, medidas y precios.
- **Ver cada producto con detalle**: galería de fotos, variantes de color, medidas exactas, disponibilidad y precio final.
- **Comprar en línea** con los métodos de pago que la empresa ya usa hoy: Yape, Plin, Mercado Pago y tarjetas.
- **Elegir cómo recibir su pedido**: recoger en tienda o almacén sin costo, o pedir envío cuando existan tarifas aprobadas.
- **Cotizar por WhatsApp** con todos los productos que le interesan, para que atención al cliente cierre la venta.
- **Explorar el showroom 3D**: girar el espacio, ver tres muebles de madera y elegir uno para observarlo de cerca.

Lo que **no** cambia: seguimos usando WordPress como base, el sistema de cobros actual intacto, el mismo hosting y el mismo dominio. Nadie toca lo que ya funciona; todo el trabajo nuevo es la capa visual y de experiencia.

Dos palabras que conviene fijar desde ahora para evitar malentendidos:

- **Precio Directo** es el precio de venta al público en la tienda propia. Es el que ve el cliente y **incluye IGV**.
- **Precio Retail** es el precio para distribuidores y marketplaces (Ripley, Saga Falabella, Somidac y similares). En la web nueva **jamás aparece**. Si lo ves en las hojas de cálculo, no es un error: simplemente no es un dato del sitio.

---

## 2. Lo que ya está decidido (y qué significa para ti)

Cada decisión fue aprobada explícitamente durante el proyecto. Aquí está la lista completa, traducida a su consecuencia práctica.

| # | Decisión | Qué significa en palabras simples | Referencia técnica |
|---|---|---|---|
| D-01 | Un solo proyecto frontend, dividido en módulos | No se construye una pieza aislada por cada cosa: todo forma parte de un mismo sitio coherente | D-01 |
| D-02 | Código organizado por piezas pequeñas e independientes | Si mañana se cambia una pieza, las demás siguen funcionando | D-02 |
| D-03 | Diseño e interacción en React/TypeScript **dentro de** WordPress | Los filtros, galerías y variantes se hacen con herramientas modernas, pero viven dentro del mismo WordPress de siempre | D-03 |
| D-04 / D-17 | Tecnologías más modernas (Next.js, Astro) quedan para el futuro, con criterios claros | No se descartan, pero tampoco se adoptan sin motivo. Se incorporan cuando exista una necesidad concreta que lo justifique | D-04, D-17 |
| D-05 | Se conservan WooCommerce y su checkout tal como hoy | El cobro no cambia: mismos métodos de pago, mismo flujo para el cliente | D-05 |
| D-06 | La administración del catálogo se hace de forma progresiva con hojas de cálculo | Al inicio, el catálogo se alimenta desde Excel/Sheets; todavía no hay un panel propio | D-06 |
| D-07 | No se toca el código interno de WordPress ni sus plugins | Evita romper lo que ya está funcionando | D-07 |
| D-08 | Se pueden instalar plugins si el supervisor lo autoriza | Si el equipo propone un plugin, pasa por aprobación antes de instalarse | D-08 |
| D-09 | El precio que publica la web es exactamente el Precio Directo aprobado | El cliente no ve sorpresas: precio mostrado = precio cobrado. El retail nunca se muestra en la web | D-09 |
| D-10 | El envío se cobra solo si el cliente elige envío | Si prefiere recoger en tienda o almacén, el total no cambia | D-10 |
| D-11 | WhatsApp es el canal de atención, información y cotización | El equipo comercial cierra la venta; la web no reemplaza ese rol | D-11 |
| D-12 | El showroom es 3D | El cliente puede girar el espacio, ver tres muebles de madera (comedor, centro de mesa y mesa de TV) y elegir uno para destacarlo | D-12 |
| D-13 | Sin microfrontends (una tecnología que complica el trabajo sin necesidad) | Se sigue trabajando como un solo equipo y un solo sitio | D-13 |
| D-14 | Verificación automática de que el precio publicado coincide con el aprobado | Si alguien equivoca un precio, el sistema lo detecta **antes** de que el cliente lo vea | D-14 |
| D-15 | Las páginas se cargan primero con el HTML ya listo desde el servidor | El sitio carga rápido, Google lo indexa bien y la venta funciona aunque JavaScript falle | D-15 |
| D-16 | Mientras no haya costo de envío aprobado, la web ofrece «modalidad por definir» | No se inventa un precio de envío; se cotiza. Honestidad ante todo | D-16 |
| D-17 | Criterios objetivos para evaluar tecnologías nuevas en el futuro | Nadie incorpora una herramienta «porque sí»; hay que justificarla con un problema real | D-17 |
| D-18 | Todo cambio se prueba primero en el entorno de pruebas y con punto de restauración | Se evita dañar el sitio real | D-18 |
| D-19 | La documentación existe en dos versiones: técnica y de negocio | Esta guía es la versión de negocio; la espec es la técnica | D-19 |
| D-20 | Primera paleta (negro, gris y dorado) | Reemplazada: se ajustó a la paleta definitiva de la marca | D-20 |
| D-21 | Paleta y letras definitivas | Carbón, marfil, greige, nogal y bronce; botón en bronce; títulos con serif editorial y textos con letra moderna. La web se adapta al modo claro u oscuro del dispositivo y tiene un botón para cambiarlo | D-21 |
| D-22 | Animaciones de la web | La página aparece suavemente al bajar, los enlaces se pintan de dorado al pasar el mouse y los botones responden. Nada se mueve solo ni distrae, y al cambiar de modo claro a oscuro nada se desplaza de sitio | D-22 |
| D-23 | Tecnología de las animaciones | Tres herramientas: una para las secuencias al bajar, otra para los efectos al pasar el mouse y otra para el desplazamiento suave. El showroom 3D usa una cuarta | D-23 |
| D-24 | Showroom 3D | Un escenario de estudio con tres muebles de madera que el cliente puede girar y explorar; se carga solo cuando se acerca a esa sección | D-24 |

---

## 3. Así compraría el cliente nuevo

Un caso real, de principio a fin:

1. **Llega al inicio.** Ve imágenes del catálogo real y categorías claras. No hay texto de relleno ni productos falsos: ese contenido se retira.
2. **Entra a una categoría.** Ve los muebles con foto, nombre, modelo y precio.
3. **Abre un producto.** Ve galería, medidas, variantes de color y disponibilidad: «disponible», «se fabrica bajo pedido» o «agotado».
4. **Elige variante y añade al carrito.** El precio se actualiza al momento.
5. **En el carrito escoge entrega**: recojo, envío o «por definir» mientras no exista tarifa aprobada.
6. **Paga** con el flujo de siempre: Yape, Plin, Mercado Pago o tarjetas. Sin cambios de proceso para el cliente ni para el personal.
7. **O decide cotizar**: genera un mensaje de WhatsApp con detalle de todo el carrito, listo para el equipo comercial.

### El showroom en la vida real

Un cliente que está decorando quiere «ver» el aparador en su sala antes de comprarlo. Con el showroom 3D puede girar el espacio, acercarse a un comedor, un centro de mesa o una mesa de TV, y observar el acabado de la madera antes de medir su pared. No es el camino de compra más frecuente, pero es la experiencia que distingue a Masiva Home de un catálogo plano.

---

## 4. Lo que necesitamos de cada área (lo más importante de leer)

Estas son las pendientes concretas con dueño. Hasta que no se respondan, las funciones ligadas **no se lanzan ni se prometen**. Preferimos decir «todavía no está disponible» antes que inventar un dato.

### Supervisor

| Pregunta | ¿Por qué importa? | ID |
|---|---|---|
| ¿Cuál es la lista oficial de categorías? Encontramos «31. Carpetas» y «31. Pupitres» en fuentes distintas: ¿son lo mismo? | Define la navegación y el menú del sitio | PA-03 |
| ¿El Precio Directo es por modelo o por cada variante de color? ¿Pueden dos colores tener precios distintos? | La ficha y el inventario deben mostrar el precio correcto en cada caso | PA-15 |
| ¿Cuál es la clave única que relaciona cada producto entre las hojas y Drive? | Sin clave estable se pueden mezclar datos de dos muebles distintos | PA-14 |
| ¿Quién normaliza material, medidas y disponibilidad? | Son filtros del catálogo y necesitan un dato confiable, no una deducción | PA-14 |
| ¿Cómo se calcula el envío? ¿Cuál es la regla de tiempos de entrega por producto? | El cliente espera saber cuándo tendrá el mueble y cuánto cuesta traerlo | PA-05, PA-12 |
| ¿El envío lleva IGV y cómo se declara en el total? | Afecta el monto final que se cobra | PA-16 |
| ¿Cuáles son los puntos de recojo y quién avisa que el pedido está listo? | Es el proceso necesario para vender con recojo | PA-06 |
| ¿Qué comprobante se emite (boleta, factura) y con qué requisitos? | Es obligación fiscal; el cliente lo pedirá, sobre todo las empresas | PA-17 |
| ¿Quién responde el Libro de Reclamaciones y hay revisión legal del comercio web? | Es obligación del comercio electrónico en Perú | PA-18 |
| ¿Existen copias de seguridad y restauración comprobadas antes de editar plantillas en producción? | Un error al editar puede dejar el sitio fuera de servicio | PA-24 |

### Marketing y diseño

| Pregunta | ¿Por qué importa? | ID |
|---|---|---|
| ¿Quién produce, convierte y sube las fotos de producto con calidad suficiente? | Una ficha sin fotos no cumple el criterio de publicación y queda fuera del catálogo | PA-23 |
| ¿Se requiere fotografía por ambiente para el showroom? ¿Con qué alcance por producto? | El showroom necesita imágenes por ambiente y ángulo; sin ellas, un solo plano por mueble | RF-15, PA-11 |
| ¿Qué se medirá al final del rediseño y con qué analítica? | Hay que definir el éxito del proyecto antes de terminarlo | PA-13, PA-25 |

### Desarrollo

| Pregunta | ¿Por qué importa? | ID |
|---|---|---|
| ¿El rol de editor permite publicar el código visual nuevo (JavaScript y CSS)? ¿Con qué mecanismo? | Si no, cambia la estrategia de implementación y conviene saberlo antes de invertir horas | PA-01 |
| ¿Las interfaces (API) están habilitadas en producción y no solo en el entorno de pruebas? | De ellas depende que la web nueva y el carrito se comuniquen | PA-02 |
| ¿El checkout actual usa el formato clásico o el de bloques? ¿Comparte carrito con la web nueva? | Es el punto de unión entre carrito y cobro; se valida antes de construirlo | PA-21 |
| ¿Cómo se indexa el SKU en la búsqueda interna? | El cliente busca por referencia, no solo por nombre | PA-20 |
| ¿Cuál es el flujo completo de cada método de pago? | Se prueba de punta a punta para no perder una venta ni un método | PA-07 |

**Regla general:** si una de estas preguntas no se responde, no se estrena esa función, no se inventa el dato y no se oculta la limitación: se declara condición pendiente en el documento.

---

## 5. Lo que no se hace en esta fase

Para que nadie espere algo que no está en el plan:

- **Modelos 3D y realidad aumentada.** El showroom 3D ya existe con tres muebles; la realidad aumentada y más ambientes quedan para más adelante.
- **Checkout nuevo.** Se conserva el checkout actual; si algún día se rediseña, será otra fase.
- **Panel administrativo propio.** El catálogo se administra con Sheets + WordPress de forma progresiva (D-06).
- **Campañas o descuentos activos.** El sistema queda preparado, pero no se muestra ningún descuento hasta que la campaña esté definida y aprobada.
- **Traducciones a otros idiomas.**
- **Cambios de hosting, dominio o sistema.**

---

## 6. La protección del negocio

**Nada importa más que el precio que ve el cliente sea el precio que paga.** El mecanismo es simple:

1. El **Precio Directo** aprobado en la hoja «Cotizaciones» es el único dato que se usa como precio de venta.
2. Ese precio se registra en WooCommerce (el sistema de ventas de WordPress) con **verificación automática** en cada carga.
3. Si coincide → el producto se publica. Si no coincide → el producto se detiene y se reporta. Se corrige el dato en el origen; nunca «se arregla» en la pantalla.

**El precio Retail nunca llega al cliente.** Si se le ve publicado en la web, es un incidente grave y se corrige de inmediato.

También hay protecciones frente a otros errores de operación:

- El sitio no se edita directamente en producción: se prueba en el entorno de pruebas y con respaldo antes de tocar nada (D-18).
- Si WhatsApp o un medio de pago falla, el carrito del cliente no se pierde y se ofrece una alternativa clara.
- Las URLs que hoy reciben visitas conservan su destino después del rediseño: no se pierde el tráfico ganado.

---

## 7. Las etapas del proyecto (y qué se valida en cada una)

| Etapa | Qué se hace | ¿Cómo se valida? |
|---|---|---|
| 0. Evaluación | Revisar lo que hay, tomar decisiones | ✅ Completada |
| 1. Especificación | Definir qué se hace (espec técnica + esta guía) | **En curso** — esta guía y la espec |
| 2. Contenido y diseño | Textos reales aprobados, colores, tipografía, prototipos | Supervisor aprueba textos y dirección visual |
| 3. Plan técnico | Contratos, integraciones, plan de pruebas y de datos | Aprobación técnica |
| 4. Implementación | Construcción por tramos: catálogo → producto → carrito → showroom | Cada tramo se revisa antes de continuar |
| 5. Lanzamiento | Pruebas completas de compra, migración, medición, formación al personal | Se aprueba la salida a producción |

Antes de construir la fase 4 se harán **cuatro pruebas pequeñas** en el entorno de pruebas, para confirmar dudas técnicas con hechos y no con supuestos: (1) que el código nuevo se puede montar, (2) que el listado funciona sin JavaScript, (3) que el carrito y el checkout se entienden, (4) que la carga de datos desde las hojas es viable. Si alguna falla, se corrige a tiempo y no al final del proyecto.

---

## 8. Cómo usar esta pareja de documentos

| Documento | ¿Quién lo lee? | Uso |
|---|---|---|
| `GUIA-negocio-masiva-home.md` (esta guía) | Supervisores, administración, marketing | Entender el proyecto, los pendientes y lo que corresponde a cada área |
| `SPEC-masiva-home.md` | Desarrollo (y supervisores con detalle) | Fuente completa: requisitos numerados, arquitectura, criterios de aceptación |
| `docs/` (creados) | Todo el equipo | Versión final aprobada, lista para distribuir |

Ambos documentos comparten los mismos identificadores (D-xx, RF-xx, PA-xx). Si en una reunión alguien menciona «D-09», los dos documentos señalan exactamente el mismo objeto. No hay versiones paralelas de una decisión.

---

## 9. En una sola frase

> La web nueva se construye como un mueble: con materiales modernos para el acabado visible y la estructura existente como cimientos; sin prometer lo que aún no está definido y asegurando que lo que el cliente ve en pantalla es exactamente lo que paga.
