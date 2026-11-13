# Preguntas pendientes del proyecto MasivaHome.com

> Versión: 0.3 — 10 de noviembre de 2026.
> **¿Para quién es este documento?** Es el formulario operativo para conseguir las respuestas de negocio que el proyecto necesita. Cada pregunta tiene responsable, motivo de su importancia y lo que bloquea si no se responde.
> Fuente: preguntas `PA-01` a `PA-25` de `02-especificacion-tecnica.md` (sección 11). Esta hoja no introduce información nueva: solo las organiza para responderlas.

## Cómo responder

1. Responde **en el espacio marcado Respuesta** de cada pregunta. Una respuesta corta y clara vale más que una larga e imprecisa.
2. No es necesario responderlas todas hoy. Empieza por las marcadas **prioridad alta**: son las que desbloquean más trabajo.
3. Si una respuesta es provisional, escríbelo así: *(provisional, sujeta a confirmación)*. El proyecto la registra como parcial, no como final.
4. Si no hay respuesta porque la información todavía no existe, eso también sirve: se convierte en pendiente y la función correspondiente se pospone con transparencia.
5. El equipo del proyecto transfiere cada respuesta a la espec técnica y a la guía de negocio, y lo deja registrado en la sección 6 de este mismo documento.

## Tablero de estado

Marca la casilla cuando la respuesta esté registrada en la espec y en la guía.

| ID | Prioridad | Responsable | Respondida |
|---|---|---|---|
| PA-01 | Alta | Supervisor + desarrollo | ☐ |
| PA-02 | Alta | Desarrollo | ☐ |
| PA-03 | Alta | Supervisor | ☐ |
| PA-04 | Alta | Supervisor | ☐ |
| PA-05 | Alta | Supervisor | ☐ |
| PA-06 | Media | Supervisor | ☐ |
| PA-07 | Alta | Supervisor | ☐ |
| PA-08 | Media | Supervisor | ☐ |
| PA-09 | Media | Supervisor | ☐ |
| PA-10 | Media | Supervisor | ☐ |
| PA-11 | Baja (fase futura) | Diseño y marketing | ☐ |
| PA-12 | Media | Supervisor | ☐ |
| PA-13 | Media | Supervisor | ☐ |
| PA-14 | **Alta — crítica** | Supervisor + datos | ☐ |
| PA-15 | **Alta — crítica** | Supervisor | ☐ |
| PA-16 | Alta | Supervisor + contabilidad | ☐ |
| PA-17 | Alta | Supervisor + contabilidad | ☐ |
| PA-18 | Alta | Supervisor + asesor legal | ☐ |
| PA-19 | Media | Supervisor | ☐ |
| PA-20 | Media | Desarrollo | ☐ |
| PA-21 | **Alta — crítica** | Desarrollo | ☐ |
| PA-22 | Media | Supervisor | ☐ |
| PA-23 | Alta | Diseño + marketing | ☐ |
| PA-24 | Alta | Supervisor + hosting | ☐ |
| PA-25 | Media | Supervisor | ☐ |

---

# 1. Supervisor

### PA-03 — Lista oficial de categorías

- **Pregunta:** ¿Cuál es la lista oficial y completa de categorías del catálogo? ¿Cómo se resuelven las diferencias de nombre entre fuentes, por ejemplo «31. Carpetas» frente a «31. Pupitres», o «Cabeceras», que aparece solo en algunas fuentes?
- **Por qué importa:** las categorías son el menú del sitio y la base del catálogo completo del lanzamiento.
- **Bloquea:** RF-02 (navegación) y RF-03 (catálogo por categoría).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-04 — Regla de precio y stock que se importa

- **Pregunta:** ¿Qué regla de precio y disponibilidad se carga en WooCommerce y cómo se refleja la aprobación comercial de la hoja Cotizaciones?
- **Por qué importa:** define el proceso operativo de publicación de precios y sostiene la regla de precio mostrado = precio cobrado.
- **Bloquea:** RF-07 (ficha de producto) y RAD-01 (edición interna).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-05 — Cálculo del envío y tiempos de entrega

- **Pregunta:** ¿Cómo se calculan el envío y los tiempos de entrega por producto, tamaño y destino? ¿Existen tarifas por zona, por peso o por volumen?
- **Por qué importa:** mientras no existan reglas, el sitio no puede cobrar envío ni prometer plazos; todo se cotiza de forma manual.
- **Bloquea:** RF-14 (envío en el checkout).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-06 — Puntos de recojo

- **Pregunta:** ¿Cuáles son los puntos de recojo (tienda, almacén) y cuál es el proceso para avisar al cliente que su pedido está listo?
- **Por qué importa:** el recojo sin costo es la modalidad aprobada por defecto y necesita un proceso real detrás.
- **Bloquea:** RF-13 (recojo en el checkout) y RF-27 (notificaciones).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-07 — Flujo completo de los métodos de pago

- **Pregunta:** ¿Cuál es el flujo completo de Mercado Pago, Yape, Plin, tarjetas y PayPal? ¿De qué plugin depende cada método y qué credenciales de producción tiene cada cuenta?
- **Por qué importa:** los pagos se prueban de punta a punta antes del lanzamiento, para no perder una venta ni un método.
- **Bloquea:** RF-11 (checkout sin pérdida de métodos).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-08 — Garantía, instalación y cuidado

- **Pregunta:** ¿Qué reglas de garantía, instalación y cuidado aplican por producto o por categoría? ¿La garantía vigente es la de «7 días por defecto de fábrica» que aparece en el sitio actual?
- **Por qué importa:** son promesas comerciales que se publican; no se escriben por deducción.
- **Bloquea:** RF-16 (contenido institucional) y RF-17 (páginas de política).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-09 — Textos institucionales y legales

- **Pregunta:** ¿Qué textos están aprobados y listos para las páginas institucionales (servicios, historia, contacto) y legales (privacidad, términos, cookies, envíos, cambios)? ¿El número de WhatsApp Business es el oficial y está verificado?
- **Por qué importa:** el sitio no publica textos provisionales ni números sin verificar.
- **Bloquea:** RF-16, RF-17 y RF-26 (plantilla de cotización).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-10 — Destacados y campañas

- **Pregunta:** ¿Qué productos y categorías serán destacados en el inicio? ¿Qué campañas estacionales se contemplan (Navidad, Año Nuevo, Fiestas Patrias) y en qué fechas?
- **Por qué importa:** define el contenido del inicio y prepara el sistema de promociones para su momento.
- **Bloquea:** RF-01 (inicio editorial) y RF-20 (base de promociones).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-12 — Comunicación de los tiempos de fabricación

- **Pregunta:** ¿Cómo se comunican al cliente los tiempos de fabricación de los productos «bajo pedido»? ¿Hay plazos estándar por material o por tamaño?
- **Por qué importa:** la ficha debe decir algo verificable; sin plazo aprobado, el mensaje es genérico y genera consultas repetidas.
- **Bloquea:** RF-07 (ficha completa) y RF-26 (cotización informativa).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-13 — Medición del rediseño

- **Pregunta:** ¿Qué indicadores definirán el éxito del rediseño (ventas en línea, cotizaciones recibidas, consultas resueltas) y con qué herramienta se medirán?
- **Por qué importa:** sin criterio de éxito no se puede evaluar si el proyecto cumplió, ni decidir la siguiente inversión.
- **Bloquea:** criterios de éxito y RF-23 (consentimiento de cookies y analítica).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-14 — Clave estable de producto (crítica)

- **Pregunta:** ¿Cuál es la clave única que relaciona cada producto entre las hojas Carga General, Cotizaciones y la carpeta de Drive? ¿Quién normaliza los campos de material, acabado y dimensiones?
- **Por qué importa:** sin una clave estable, un mismo mueble puede recibir datos de otro: nombre de una hoja, fotos de la otra, precio de una tercera. Es la condición para cargar el catálogo completo con confianza.
- **Bloquea:** RF-04 (filtros) y RAD-03 (importación reproducible).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-15 — Precio por modelo o por variante (crítica)

- **Pregunta:** ¿El Precio Directo es por modelo o por variante? ¿Pueden dos variantes del mismo modelo (por ejemplo, dos colores) tener precios distintos?
- **Por qué importa:** si las variantes tienen precios distintos y el modelo tiene uno solo, la ficha puede mostrar un precio y el checkout cobrar otro. Esta pregunta protege el invariante de precio aprobado (D-14).
- **Bloquea:** RF-07 y RF-08 (selector de variante), verificación del invariante de precio (sección 4.9).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-22 — Volumen del catálogo

- **Pregunta:** ¿Cuántos productos y variantes se esperan en el lanzamiento y a doce meses?
- **Por qué importa:** el volumen define la paginación, el rendimiento del listado y la estrategia de búsqueda.
- **Bloquea:** rendimiento del catálogo y diseño de paginación.
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-19 — Mecanismo de importación viable

- **Pregunta:** ¿Qué mecanismo es viable con el rol de editor actual: carga manual asistida, un plugin de importación aprobado por el supervisor o un script externo por API?
- **Por qué importa:** con rol de editor probablemente no se pueda instalar ni programar nada; no se puede comprometer automatización sin el medio para cumplirla.
- **Bloquea:** RAD-03 y RAD-04 (importación reproducible con reporte).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-24 — Respaldo y restauración

- **Pregunta:** ¿Existe y está probado un procedimiento de respaldo y restauración antes de editar plantillas en producción? ¿Quién lo ejecuta?
- **Por qué importa:** el rol de editor permite cambiar plantillas desde la interfaz; un cambio mal guardado puede dejar el sitio fuera de servicio.
- **Bloquea:** RNF-20 (cambios seguros) y D-18 (staging obligatorio).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

---

# 2. Supervisor con contabilidad y fiscalidad

### PA-16 — IGV del envío

- **Pregunta:** ¿El costo de envío lleva IGV? ¿Cómo se declara en el total del pedido?
- **Por qué importa:** afecta el monto final y el comprobante. Hasta resolverlo, el envío se cotiza y no se cobra en la web.
- **Bloquea:** RF-14 (total con envío).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-17 — Comprobantes de pago

- **Pregunta:** ¿Qué comprobantes se emiten (boleta y/o factura)? Qué datos exige cada uno y cómo está configurada la parte fiscal de WooCommerce (precios con IGV incluido y clase de impuesto).
- **Por qué importa:** es obligación fiscal; una compra con el comprobante equivocado genera reclamos y trabajo manual.
- **Bloquea:** RF-21 (boleta y factura en el checkout).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

---

# 3. Supervisor con asesor legal

### PA-18 — Obligaciones legales del comercio electrónico

- **Pregunta:** ¿Quién designa y redacta el Libro de Reclamaciones virtual? ¿Qué otras obligaciones legales aplican al comercio electrónico en Perú (protección de datos, derecho de retracto, publicidad)? ¿Existe asesor legal que las confirme?
- **Por qué importa:** son obligaciones del comercio en línea; el proyecto las registra como requisitos condicionados y no inventa textos legales.
- **Bloquea:** RF-22 (Libro de Reclamaciones).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

---

# 4. Marketing y diseño

### PA-11 — Recursos para el showroom futuro (3D)

- **Pregunta:** ¿Qué formato, escala y calidad tendrán los modelos 3D cuando marketing y diseño los produzcan? ¿Quién los entrega y con qué calendario?
- **Por qué importa:** el showroom 2D se construye con un contrato que permita crecer a 3D; conocer el formato evita diseñar a ciegas.
- **Bloquea:** alcance futuro del showroom (D-12).
- **Estado:** Pendiente (fase futura)
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-23 — Producción de imágenes (crítica)

- **Pregunta:** ¿Quién produce las fotos de producto, quién las convierte a formatos y tamaños adecuados para web y con qué herramienta? ¿Las fotos de Drive están autorizadas para uso comercial y con calidad suficiente?
- **Por qué importa:** cada producto se publica con foto principal más una foto por variante. Sin responsable ni herramienta, el criterio de publicación no se puede cumplir a escala.
- **Bloquea:** RF-25 (texto alternativo y nombres de archivo), RNF-19 (pipeline de imágenes) y los criterios de publicación (sección 7.6).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-25 — Analítica y consentimiento

- **Pregunta:** ¿Qué herramienta de análisis se quiere (si se quiere alguna) y cómo se gestiona el consentimiento de cookies?
- **Por qué importa:** la web no carga servicios de medición sin consentimiento; elegir la herramienta define también el mecanismo de aviso.
- **Bloquea:** RF-23 (consentimiento) y PA-13 (medición).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

---

# 5. Desarrollo

### PA-01 — Publicación del código visual (crítica)

- **Pregunta:** ¿Cuál es el mecanismo autorizado para publicar los archivos JavaScript y CSS compilados y habilitarlos en el entorno de pruebas con el rol de editor?
- **Por qué importa:** es la prueba de viabilidad número uno. Si el rol no lo permite, cambia la estrategia de implementación y conviene saberlo antes de invertir en módulos.
- **Bloquea:** RF-07, RF-08, RF-15 y la prueba de viabilidad S-1 (montaje).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-02 — APIs en producción

- **Pregunta:** ¿Las interfaces (API) de WordPress y WooCommerce están habilitadas en producción y no solo en el entorno de pruebas?
- **Por qué importa:** de ellas depende que la web nueva obtenga catálogo, carrito y disponibilidad.
- **Bloquea:** RF-03, RF-06 y RF-10.
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-20 — Índice de búsqueda por SKU

- **Pregunta:** ¿Cómo se indexa el SKU en la búsqueda interna? ¿Se aprueba instalar un plugin de búsqueda o construir un índice propio?
- **Por qué importa:** la búsqueda nativa de WordPress no busca por SKU, y el cliente suele llegar con la referencia que vio en redes sociales.
- **Bloquea:** RF-06 y RF-28.
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

### PA-21 — Tipo de checkout y sesión de carrito (crítica)

- **Pregunta:** ¿El checkout actual usa el formato clásico (shortcode) o el de bloques? ¿El carrito que gestiona la Store API es el mismo que el del checkout?
- **Por qué importa:** es el punto de unión entre la web nueva y el cobro. Decidir sin esta respuesta arriesga que el cliente añada algo al carrito y pague algo distinto.
- **Bloquea:** RF-10, RF-11, el diseño del adaptador de comercio (`commerce-adapter`) y la prueba de viabilidad S-3 (carrito).
- **Estado:** Pendiente
- **Respuesta:** *(esperando respuesta)*
- **Respondió y fecha:** —

---

# 6. Registro de respuestas recibidas

Lo llena el equipo del proyecto cuando una respuesta llega y se transfiere a la espec y a la guía. Es el historial para no responder dos veces lo mismo.

| Fecha | ID | Resumen de la respuesta | ¿Definitiva o provisional? | ¿Cambió la espec? | ¿Cambió la guía? |
|---|---|---|---|---|---|
| — | — | — | — | — | — |
