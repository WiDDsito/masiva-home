# Spec técnica: Rediseño de Masiva Home (fase 1)

> **Copia aprobada para distribución.** Publicada en `docs/` el 2026-11-11 desde `plan/SPEC-masiva-home.md` (v0.9). La fuente de trabajo vive en `plan/`: para actualizar este documento se modifica la fuente y se publican de nuevo las copias de `docs/`. No editar este archivo directamente. En `docs/`, el equivalente de negocio es `01-guia-supervisores.md` y el cuestionario operativo es `03-preguntas-pendientes.md`.

> Versión: **0.9** — decisiones D-01 a D-24 aprobadas por el usuario; pendiente de respuestas de negocio (`PA-xx`).
> Última revisión: 2026-11-11. Cambios respecto a 0.1 a 0.8 en el registro final.
> Alcance: especificación funcional y de contenidos, arquitectura inicial y justificación tecnológica.
> No incluye código de implementación; los contratos de 4.4 son especificación de tipos, no archivos entregables.

**Documento complementario.** Este archivo es la **espec técnica**: va dirigido a desarrollo y usa requisitos con identificador, contratos y criterios de aceptación verificables. La misma información traducida a lenguaje de negocio para supervisores y otras áreas vive en el documento hermano de esta misma carpeta: `GUIA-negocio-masiva-home.md`. Los dos documentos comparten identificadores (`D-xx`, `RF-xx`, `RNF-xx`, `PA-xx`) para poder cruzarlos. Ninguno sustituye al otro; si discrepan, manda esta espec y el error se reporta como incidencia de documentación.

**Actoría y ubicación.** Toda la documentación del proyecto vive en `DISCO EXTER/Freelance/masiva-home`:

```text
masiva-home/
├── plan/
│   ├── SPEC-masiva-home.md            ← este documento (espec técnica)
│   └── GUIA-negocio-masiva-home.md    ← guía en lenguaje de negocio
├── docs/                              ← documentos aprobados finales
│   ├── 01-guia-supervisores.md
│   ├── 02-especificacion-tecnica.md
│   └── 03-preguntas-pendientes.md
└── web/                               ← frontend local (home construida, E-11 y E-12)
```

**Cómo leer este documento.** Las secciones 1 a 12 son la especificación vigente. Las secciones 13 a 17 son soporte: registro de cambios, glosario, supuestos de prototipo, matriz de trazabilidad y auditoría de la revisión 0.2. Cuando un requisito depende de información no confirmada, se marca **Condicionado** y apunta a una pregunta abierta (`PA-xx`); no se elimina ni se convierte en supuesto silencioso.

**Vocabulario de estado.** Se usa un solo juego de estados en todo el documento:

| Estado | Significado |
|---|---|
| Aprobada | Instrucción explícita del usuario registrada en la conversación |
| Condicionada | Aprobada en principio, pero su ejecución depende de una validación concreta |
| Propuesta pendiente | Recomendación del equipo, requiere aprobación |
| Pendiente con responsable | Falta información; tiene dueño asignado |
| Reemplazada | Decisión anterior conservada con su motivo |

## Registro de decisiones

| ID | Decisión | Estado |
|---|---|---|
| D-01 | Arquitectura lógica: monolito frontend modular | Aprobada |
| D-02 | Estilo: componentes + arquitectura limpia + hexagonal | Aprobada |
| D-03 | Frontend: React + TypeScript sobre WordPress/Elementor | Aprobada (mecanismo de publicación de bundles en PA-01) |
| D-04 | Next.js y Astro fuera de la primera etapa; previstos para el futuro | Condicionada (ver D-17) |
| D-05 | WooCommerce y checkout actuales se conservan | Aprobada |
| D-06 | Administración progresiva; Sheets como fuente operativa en etapa 1 | Aprobada |
| D-07 | Sin modificaciones de PHP, plugins existentes ni WooCommerce | Aprobada |
| D-08 | Instalación de plugins permitida con autorización | Aprobada |
| D-09 | Precio público = Precio Directo (incluye IGV); Retail solo distribución | Aprobada |
| D-10 | Envío se suma solo si el cliente lo selecciona; sin envío = recojo | Aprobada |
| D-11 | WhatsApp = atención, información y cotización | Aprobada |
| D-12 | Showroom: experiencia 3D con Three.js, React Three Fiber y Drei; el contrato visual no cambia | Aprobada (actualizada 2026-11-11) |
| D-13 | Microfrontends descartados en esta etapa | Aprobada |
| D-14 | El precio publicado por WooCommerce debe ser idéntico al Precio Directo aprobado, con verificación automática | Aprobada (ver 4.9) |
| D-15 | Listado y ficha se sirven como HTML de WooCommerce/Elementor; React se monta como islas de interacción | Aprobada (ver 4.8) |
| D-16 | La modalidad de entrega admite el estado `to_define` para no publicar totales de envío no confirmados | Aprobada (ver 4.4) |
| D-17 | Next.js o Astro se incorporan solo cuando exista un criterio objetivo de despliegue o render independiente | Aprobada (ver 5.2) |
| D-18 | Todo cambio se prueba primero en el entorno de pruebas y exige punto de restauración | Aprobada (ver RNF-20) |
| D-19 | Documentación en doble registro: espec técnica (este archivo) y guía de negocio con los mismos identificadores | Aprobada |
| D-20 | Paleta y tipografía: negro para títulos, gris oscuro para contenido, dorado mostaza como único acento; Instrument Serif + Instrument Sans | Reemplazada por D-21 |
| D-21 | Paleta definitiva: carbón `#191817`, marfil `#F5F3EF`, greige `#D8D0C4`, nogal `#8C6A49`, bronce `#B18A50`; familia de bronce para claro/oscuro; Cormorant Garamond + Manrope; modo claro y oscuro | Aprobada (ver 6.2 y 6.3) |
| D-22 | Sistema de movimiento: revelado al entrar en pantalla, microinteracciones que responden a la acción y hover dorado en la navegación; sin bucles ni parallax decorativo | Aprobada (ver 6.5) |
| D-23 | Stack de animación: GSAP (scroll, líneas de tiempo y parallax), Motion (interacciones de componente) y Lenis (desplazamiento suave). Three.js queda previsto para el showroom 3D futuro | Aprobada (ver 6.5) |
| D-24 | Showroom 3D: Three.js + React Three Fiber + Drei; tres productos modelados proceduralmente (comedor, centro de mesa y mesa de TV); carga diferida y respeto de movimiento reducido | Aprobada (ver 7.3) |

Nota sobre D-04/D-17: el usuario pidió que Next.js y Astro «deberán ser implementadas en un futuro». Sin un disparador verificable, ese enunciado no es accionable y podría forzar una reescritura sin beneficio. El usuario aprobó el reformulado como decisión con criterios objetivos de incorporación (5.2), no como compromiso de fecha.

## Fuentes de datos y su rol

| Fuente | Uso | Prioridad |
|---|---|---|
| Carga General | Contenido público: título, descripción, SKU, variantes, dimensiones, color | Alta |
| Cotizaciones | Precio Directo (venta propia), aprobación comercial, tipo | Alta (precio) |
| Cotizaciones | Precio Retail | Excluido del frontend de Masiva Home |
| Drive | Imágenes por modelo y variante | Alta |
| Google Sheets | Fuente operativa en etapa 1 | Transitoria |

Regla de desempate: ante diferencia entre Carga General y Cotizaciones sobre **precio**, prevalece `Precio Directo` de Cotizaciones. El contenido descriptivo sigue tomando Carga General.

### El precio tiene dos capas que no deben confundirse

La versión 0.1 mezclaba dos afirmaciones que parecían contradictorias: «el precio público es el Precio Directo» y «el frontend no consume el Precio Directo». Se separan:

1. **Regla comercial (D-09).** El precio que paga el cliente es el `Precio Directo` aprobado en Cotizaciones, con IGV incluido. El `Precio Retail` no se publica en Masiva Home.
2. **Regla de implementación (D-14).** Ese valor se carga en WooCommerce como precio de venta del canal y es WooCommerce quien lo entrega al navegador, al carrito y al checkout. El navegador nunca recibe la hoja de Cotizaciones ni el Precio Retail.

Ambas reglas solo son compatibles si se cumple un invariante verificable:

> `precio de venta en WooCommerce` = `Precio Directo` del modelo o variante aprobado en Cotizaciones.

Ese invariante se comprueba en cada importación y en cada cambio manual de precio. Si falla, el producto no se publica (ver RAD-04 y 7.6). Sin esta comprobación, la regla de mínimo privilegio se convierte en una fuente de precios distintos entre la ficha y el checkout.

Queda pendiente (PA-15) si el Precio Directo es por modelo o por variante; hoy Cotizaciones aprueba por modelo y Carga General describe variantes.

## Clasificación de información

El vocabulario de estado de las decisiones ya está definido al inicio del documento. Esta sección agrega las categorías que no son decisiones y que se usan en las secciones 14 a 17:

| Categoría | Significado | Dónde se usa |
|---|---|---|
| Hecho verificado | Comprobado por lectura directa de las fuentes o confirmado por el usuario | Fuentes de datos, inventario de plugins |
| Supuesto para prototipo | Se usa solo en prototipos; se marca en la pieza y se valida antes de implementar | Sección 15 |
| Pendiente con responsable | Falta información; tiene dueño y pregunta abierta asignada | Sección 11 |
| Requisito condicionado | Aprobado, pero no se construye hasta cumplir su condición | Sección 1.1.1 |

Una misma afirmación no puede tener dos categorías. Si un hecho deja de ser cierto, se degrada a pendiente o a supuesto, y se registra el cambio; no se borra.

---

# 1. Requisitos funcionales

## 1.1 Alcance del sitio

| ID | Requisito | Criterio de aceptación |
|---|---|---|
| RF-01 | Inicio con jerarquía editorial | El primer pantallazo comunica la propuesta de valor y muestra productos reales; no existe contenido de demostración |
| RF-02 | Navegación principal por categorías | Todas las categorías publicadas son alcanzables desde el menú principal en escritorio y móvil |
| RF-03 | Catálogo por categoría | Cada categoría muestra sus productos en grilla con imagen, nombre, modelo y precio |
| RF-04 | Filtros del catálogo | El visitante filtra por los atributos que existan como dato propio en la fuente: categoría, color, precio y disponibilidad. Material y dimensiones se incorporan solo cuando existan como campo normalizado (ver 1.1.1) |
| RF-05 | Ordenamiento | El visitante ordena por relevancia, precio ascendente y descendente, y novedades; «novedades» usa el campo `publishedAt` |
| RF-06 | Búsqueda | La búsqueda devuelve productos por nombre, modelo y SKU; requiere un índice que cubra SKU, porque la búsqueda nativa de WordPress no lo indexa por defecto (PA-20) |
| RF-07 | Ficha de producto | La ficha presenta galería, descripción, medidas, variantes de color, precio, disponibilidad y CTA de compra; los materiales se muestran cuando existen como dato propio |
| RF-08 | Selección de variante | Elegir color actualiza imagen, precio y disponibilidad; la variante se refleja en la URL compartible |
| RF-09 | Medidas | Las medidas se muestran en cm con el formato del dato maestro, sin conversiones implícitas |
| RF-10 | Carrito | El visitante añade productos con variante y cantidad; el carrito muestra líneas, subtotal y total |
| RF-11 | Checkout | El checkout conserva el flujo actual de WooCommerce y los métodos de pago existentes |
| RF-12 | Cotización por WhatsApp | El carrito genera un mensaje con productos, variantes, cantidades y datos del cliente hacia el número oficial |
| RF-13 | Opción de recojo | El checkout permite elegir recojo en tienda/almacén sin costo de envío |
| RF-14 | Opción de envío | Cuando el cliente selecciona envío, el total incluye el costo de envío |
| RF-15 | Showroom 2D | El visitante explora productos con vistas por ambiente, ángulos, medidas y variantes |
| RF-16 | Contenido institucional | Servicios, historia, contacto, garantía, entrega y datos legales están publicados y son correctos |
| RF-17 | Páginas de política | Privacidad, términos, cookies, envíos, cambios y garantías están publicados |
| RF-18 | Responsive | Toda la experiencia funciona entre 320 px y 1440 px |
| RF-19 | Accesibilidad de teclado | Todos los controles interactivos son alcanzables y operables por teclado con foco visible |
| RF-20 | Promociones futuras | El modelo de datos admite precio promocional y cupón sin mostrarlos en la interfaz actual |
| RF-21 | Comprobante de pago | El cliente indica boleta o factura; si elige factura, registra RUC y razón social. El comprobante se emite según la configuración fiscal vigente (PA-17) |
| RF-22 | Libro de Reclamaciones | Existe un acceso visible al Libro de Reclamaciones virtual con constancia para el cliente (PA-18) |
| RF-23 | Consentimiento de cookies | No se carga analítica ni terceros no esenciales antes del consentimiento, y el consentimiento puede retirarse |
| RF-24 | Continuidad de URLs | Toda URL existente con tráfico conserva un destino equivalente mediante redirección permanente y un mapa documentado |
| RF-25 | Textos alternativos | Toda imagen de producto tiene texto alternativo descriptivo y nombre de archivo estable ligado a SKU y variante |
| RF-26 | Cotización por WhatsApp robusta | El mensaje se genera desde una plantilla versionada, respeta el límite de longitud de un enlace y resume el detalle cuando lo excede |
| RF-27 | Notificaciones de pedido | El cliente recibe confirmación de compra y cambios de estado por correo; WhatsApp se usa según el procedimiento interno definido |
| RF-28 | Búsqueda sin resultados | Una búsqueda sin resultados propone categorías y productos cercanos; nunca devuelve una página vacía |

### 1.1.1 Requisitos condicionados

Un requisito condicionado no se implementa a medias ni se declara terminado. Se construye cuando la condición se cumple; hasta entonces, la interfaz no debe prometer lo que no puede cumplir.

| Requisito | Condición para construirlo | Qué queda bloqueado mientras tanto |
|---|---|---|
| RF-04 | Campos `material` y dimensiones normalizados en la fuente | Filtros por material y medida; el filtro por dimensiones se limita a rangos si el dato existe |
| RF-06 | Índice de búsqueda que cubra SKU y modelo | Búsqueda por SKU en producción |
| RF-08 | Variantes reales en WooCommerce con imagen y precio propios | Selector de variante y URL por variante |
| RF-13 | Método de recojo configurado en WooCommerce con puntos y horarios | Finalización de pedidos con recojo |
| RF-14 | Reglas, tarifas y cobertura de envío aprobadas, incluido el tratamiento del IGV del envío | Cálculo de envío; solo se ofrece cotización |
| RF-15 | Fotografías por ambiente y por ángulo por modelo | Showroom con más de una vista por producto |
| RF-21 | Configuración fiscal de WooCommerce validada | Emisión correcta de boleta y factura |
| RF-22 | Texto y responsable legal designados | Publicación del Libro de Reclamaciones |

## 1.2 Requisitos de administración (progresivos)

| ID | Requisito | Prioridad | Criterio de aceptación |
|---|---|---|---|
| RAD-01 | Producto y variante editables desde WordPress | Media | El personal interno autorizado actualiza precio, disponibilidad e imágenes sin tocar código |
| RAD-02 | Aprobación de publicación | Media | Un producto no publicado no aparece en el catálogo público |
| RAD-03 | Importación controlada | Alta | La importación desde Sheets es reproducible, con validación de campos obligatorios y reporte de rechazos |
| RAD-04 | Reporte de sincronización | Media | Cada ejecución indica altas, actualizaciones, omitidos y errores, y verifica que el precio publicado sea igual al Precio Directo (D-14) |
| RAD-05 | Panel administrativo propio | Fuera de alcance | No se construye en esta etapa |

### Tensión que hay que resolver en 1.2

RAD-01 y RAD-03 piden automatización, pero el rol disponible es **editor**, no administrador, y las modificaciones de código están prohibidas. Con ese rol probablemente no se pueda instalar un importador ni ejecutar procesos programados. Las salidas posibles son:

| Salida | Ventaja | Coste | Autorización necesaria |
|---|---|---|---|
| Importación manual asistida desde Sheets | No requiere plugins ni permisos nuevos | Lenta y propensa a error humano | Ninguna |
| Plugin de importación (por ejemplo, un importador de CSV para WooCommerce) | Repetible y con reporte | Requiere instalar plugin, configurar plantillas de importación y probar | Supervisor |
| Script externo que use la API de WooCommerce | Automatizable | Requiere credenciales y un lugar de ejecución fuera del hosting | Supervisor y desarrollo |

Hasta que se elija una salida, RAD-03 y RAD-04 se consideran **condicionados** (PA-19). No se promete automatización que el rol no puede ejecutar.


## 1.3 Reglas comerciales

- El precio público es el **Precio Directo** y **incluye IGV**.
- El precio retail **no** se muestra en Masiva Home; existe para Ripley, Saga Falabella, Somidac y similares.
- Total = productos con IGV + envío, solo si se selecciona envío.
- Sin envío = recojo en tienda o almacén.
- El monto mostrado en la interfaz debe coincidir con el monto cobrado por el checkout.
- El precio se muestra en soles con dos decimales y separador de miles: `S/ 1,234.50`. No se redondea en la interfaz: se muestra el valor que cobra el checkout.
- La interfaz indica que los precios incluyen IGV. No se muestra un desglose de impuesto salvo que la configuración fiscal lo exija.
- Un cliente con dudas o que requiera una cotización contacta por WhatsApp; atención al cliente cierra el proceso comercial.

Pendiente con impacto directo en el total: **si el envío lleva IGV y cómo se declara** (PA-16). Hasta resolverlo, el envío no se cobra en el frontend; se cotiza.

## 1.4 Fuera de alcance de esta etapa

- Modelos 3D, renderizado en tiempo real y realidad aumentada.
- Aplicación Next.js o Astro en esta etapa; su incorporación futura queda condicionada a D-17 y se documenta en 5.2. No se declara «fuera de alcance para siempre».
- Checkout propio; se conserva el de WooCommerce.
- Panel administrativo propio.
- Integraciones con ERP, inventario o contabilidad no confirmadas.
- Campañas promocionales activas; solo se prepara el modelo.
- Migración de hosting, dominio, tema o plugins existentes.
- Traducción a otros idiomas; Loco Translate está disponible, pero no hay contenido bilingüe aprobado.

---

# 2. Requisitos no funcionales

| ID | Categoría | Requisito | Criterio de aceptación |
|---|---|---|---|
| RNF-01 | Rendimiento | LCP de la página de inicio | ≤ 2,5 s en perfil móvil emulado de gama media con 4G |
| RNF-02 | Rendimiento | CLS | ≤ 0,1 en las plantillas principales |
| RNF-03 | Rendimiento | Presupuesto de JavaScript por vista | ≤ 150 KB comprimidos en catálogo y ficha de producto; el contenido institucional no carga bundles de aplicación |
| RNF-04 | Rendimiento | Imágenes | Formatos modernos, `srcset`, `loading="lazy"` salvo la imagen principal, y dimensiones reservadas para evitar desplazamiento de maquetación |
| RNF-05 | Accesibilidad | Conformidad | WCAG 2.1 AA en los flujos de catálogo, ficha, carrito y checkout; contraste ≥ 4,5:1 en texto normal y ≥ 3:1 en texto grande |
| RNF-06 | Accesibilidad | Semántica | Un único `h1` por página, jerarquía de encabezados sin saltos y puntos de referencia semánticos |
| RNF-07 | Accesibilidad | Movimiento | Se respeta `prefers-reduced-motion`; ninguna animación bloquea la lectura |
| RNF-08 | Responsive | Puntos de corte | 320, 768, 1024 y 1440 px sin desbordes horizontales ni pérdida de función |
| RNF-09 | SEO | Metadatos | Título y descripción únicos por página; canonical absoluto; datos estructurados `Product`, `BreadcrumbList` y `Organization` |
| RNF-10 | SEO | Renderizado | El listado y la ficha entregan HTML con productos, precios y enlaces antes de ejecutar JavaScript (ver 4.8) |
| RNF-11 | Seguridad | Frontend | Sin datos sensibles en el bundle; el código de cliente no expone credenciales ni reglas de checkout |
| RNF-12 | Seguridad | Sesiones | La sesión de carrito y checkout se conserva al navegar y no se reinicia al cambiar de página |
| RNF-13 | Compatibilidad | Navegadores | Chrome, Edge, Safari y Firefox de las dos últimas versiones en escritorio y móvil |
| RNF-14 | Mantenibilidad | Aislamiento | Ningún componente depende de un plugin específico; si Elementor, Variation Swatches o un slider cambian, el módulo sigue funcionando |
| RNF-15 | Mantenibilidad | Dependencias | Versiones fijadas; sin dependencias duplicadas que generen bundles inconsistentes |
| RNF-16 | Localización | Formato | Importes en soles con dos decimales y separador de miles; medidas en centímetros; fechas en `America/Lima` |
| RNF-17 | Resiliencia | Estados vacíos y de error | Ninguna vista queda en blanco; existen estados de carga, vacío y error con acción clara |
| RNF-18 | Contenido | Verdad de los datos | Todo precio, medida y disponibilidad publicada proviene de la fuente aprobada; no hay datos de demostración en producción |
| RNF-19 | Rendimiento | Pipeline de imágenes | Toda imagen se sirve convertida a formato moderno, con anchos definidos y sin superar el doble del tamaño de presentación |
| RNF-20 | Operación | Cambios seguros | Ningún cambio se aplica en producción sin prueba previa y punto de restauración documentado |
| RNF-21 | Mantenimiento | Actualizaciones | WordPress, WooCommerce y plugins se actualizan primero en pruebas, con registro de versión y verificación de catálogo, carrito y checkout |
| RNF-22 | Observabilidad | Errores | Los errores de catálogo, carrito y checkout se registran sin datos personales y llegan a un responsable |
| RNF-23 | Privacidad | Datos de cotización | Los datos personales de una cotización no se persisten en el navegador ni en registros del frontend |
| RNF-24 | Accesibilidad | Showroom | El showroom es operable por teclado, respeta movimiento reducido y ofrece una alternativa textual con las mismas medidas |
| RNF-25 | Seguridad | Formularios | Los formularios públicos tienen protección anti-abuso sin bloquear a usuarios legítimos |
| RNF-26 | Resiliencia | Dependencia de terceros | Si WhatsApp o un medio de pago no responde, el flujo ofrece una alternativa y no pierde el carrito |
| RNF-27 | Estabilidad | Alternancia de tema | Cambiar entre modo claro y oscuro no modifica dimensiones ni posiciones: el espacio del scrollbar se reserva con `scrollbar-gutter: stable` y los tokens solo cambian color |

---

# 3. Casos de uso e historias de usuario

## 3.1 Casos de uso del sistema (nivel de usuario)

| ID | Caso de uso | Actor principal | Precondición | Resultado esperado |
|---|---|---|---|---|
| CU-01 | Explorar catálogo | Visitante | Catálogo publicado | El visitante encuentra productos por categoría, filtro y búsqueda |
| CU-02 | Evaluar un producto | Visitante | Producto publicado | El visitante compara variantes, medidas e imágenes antes de decidir |
| CU-03 | Configurar una compra | Visitante | Producto con variante | El visitante añade una variante y cantidad al carrito |
| CU-04 | Comprar en línea | Visitante | Carrito con líneas | El visitante paga con el flujo actual y con el precio directo |
| CU-05 | Recoger en tienda | Visitante | Carrito con líneas | El cliente elige recojo y el pedido se completa sin costo de envío |
| CU-06 | Cotizar por WhatsApp | Visitante | Carrito o ficha de producto | Se genera un mensaje con el detalle y atención al cliente continúa |
| CU-07 | Explorar en 2D | Visitante | Showroom publicado | El visitante visualiza productos en contexto y consulta sus medidas |
| CU-08 | Administrar catálogo | Personal interno | Acceso autorizado | Se actualizan productos, variantes, precios e imágenes |
| CU-09 | Sincronizar datos | Personal interno / proceso | Archivo fuente disponible | Se importan altas y cambios con validación y reporte |
| CU-10 | Presentar un reclamo | Visitante | Sitio publicado | El visitante registra un reclamo y obtiene constancia |
| CU-11 | Elegir comprobante | Visitante | Checkout en curso | El pedido se emite con boleta o factura según lo elegido |
| CU-12 | Revisar el estado de su pedido | Visitante | Pedido creado | El visitante reconoce el estado y el siguiente paso sin llamar |

## 3.2 Historias de usuario

### Catálogo

- **HU-01** — Como visitante, quiero filtrar el catálogo por categoría, color, precio y disponibilidad para reducir resultados a productos que me interesan, y por material o medidas cuando esos datos existan.
- **HU-02** — Como visitante, quiero buscar por nombre, modelo o SKU porque recuerdo la referencia del mueble que vi en Instagram.
- **HU-03** — Como visitante, quiero ordenar por precio para comparar opciones dentro de un presupuesto.
- **HU-04** — Como visitante, quiero que los filtros se reflejen en la URL para poder compartir o guardar una selección.
- **HU-05** — Como visitante, quiero que una búsqueda sin resultados me proponga alternativas en lugar de dejarme en una página vacía.

### Ficha de producto

- **HU-06** — Como visitante, quiero ver varias fotografías del mueble para juzgar la calidad del acabado.
- **HU-07** — Como visitante, quiero cambiar la variante de color y ver la imagen y el precio actualizarse sin recargar la página.
- **HU-08** — Como visitante, quiero ver las medidas en centímetros junto a la descripción técnica.
- **HU-09** — Como visitante, quiero saber si el producto está disponible o se fabrica bajo pedido antes de añadirlo al carrito.
- **HU-10** — Como visitante, quiero consultar por WhatsApp desde la ficha cuando tenga dudas, sin perder los datos del producto que estoy viendo.
- **HU-11** — Como visitante que usa lector de pantalla, quiero que cada imagen describa el mueble y su acabado, para entender qué estoy viendo.

### Carrito y compra

- **HU-12** — Como visitante, quiero añadir una variante con su cantidad y ver el carrito actualizarse de inmediato.
- **HU-13** — Como visitante, quiero ver el desglose del total con IGV incluido y el envío cuando lo selecciono.
- **HU-14** — Como visitante, quiero elegir entre recojo y envío, y ver cómo cambia el total.
- **HU-15** — Como visitante, quiero pagar con los métodos que ya usa la empresa sin aprender un flujo nuevo.
- **HU-16** — Como visitante, quiero solicitar una cotización por WhatsApp conservando el detalle exacto de mi carrito.
- **HU-17** — Como visitante, quiero que la cotización incluya todo mi carrito aunque tenga muchos productos, sin un mensaje cortado.
- **HU-18** — Como visitante, quiero elegir boleta o factura y saber qué dato necesito para cada una.
- **HU-19** — Como visitante, quiero saber cuándo llegará mi pedido y qué debo hacer si tengo un problema.

### Showroom

- **HU-20** — Como visitante, quiero ver el mueble en un ambiente para imaginar cómo encaja en mi espacio.
- **HU-21** — Como visitante, quiero cambiar de ángulo para inspeccionar los detalles, cuando el modelo tenga más de una vista.
- **HU-22** — Como visitante, quiero volver al producto que estaba mirando al cerrar el showroom, sin perder el contexto del catálogo.
- **HU-23** — Como visitante que usa teclado, quiero recorrer el showroom y leer las medidas sin depender del ratón.

### Administración

- **HU-24** — Como personal interno, quiero actualizar el precio directo de un producto y que se refleje en la tienda sin intervención técnica.
- **HU-25** — Como personal interno, quiero adjuntar imágenes a una variante concreta y verlas en la ficha.
- **HU-26** — Como personal interno, quiero marcar un producto como bajo pedido y que el sitio lo comunique con claridad.
- **HU-27** — Como responsable de catálogo, quiero un reporte de qué registros se importaron y cuáles fueron rechazados, con el motivo.
- **HU-28** — Como responsable del sitio, quiero probar cualquier cambio en el entorno de pruebas y poder restaurar el estado anterior.

### Legal y confianza

- **HU-29** — Como visitante, quiero presentar un reclamo y recibir una constancia, sin depender de enviar un correo.
- **HU-30** — Como visitante, quiero decidir qué cookies acepto y poder cambiar esa decisión después.

---

# 4. Arquitectura inicial

## 4.1 Vista general

```text
┌───────────────────────────────────────────────────────────────┐
│  WordPress + Elementor                                       │
│  ├── Contenido institucional (páginas estáticas)              │
│  ├── Puntos de montaje para módulos React                    │
│  └── WooCommerce: productos, checkout, pedidos, pagos        │
└───────────────────────────────────────────────────────────────┘
              │  REST API de WordPress / Store API de WooCommerce
              ▼
┌───────────────────────────────────────────────────────────────┐
│  Frontend modular — React + TypeScript                        │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│  │ website-     │ catalog      │ showroom     │ cart-quote │ │
│  │ content      │              │              │            │ │
│  └──────────────┴──────────────┴──────────────┴────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ shared-ui: tokens, componentes base, utilidades         │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
              │                              │
              ▼                              ▼
   Adaptadores externos            Dominio de negocio
   (WooCommerce, Drive,             (Producto, Variante,
    WhatsApp, Sheets)                Precio, Carrito, Cotización)
```

## 4.2 Capas y regla de dependencia

Las dependencias apuntan **hacia adentro**. El dominio no conoce la tecnología.

```
UI (componentes React)
      ↓
Aplicación (casos de uso, puertos)
      ↓
Dominio (entidades y reglas)
      ↑
Adaptadores (implementan los puertos contra sistemas externos)
```

| Capa | Responsabilidad | No debe contener |
|---|---|---|
| Dominio | Producto, Variante, Precio, Carrito, Cotización, reglas de venta | React, HTTP, nombres de plugins, llamadas a la API |
| Aplicación | Casos de uso: listar catálogo, obtener producto, seleccionar variante, añadir al carrito, preparar cotización, obtener medios | Manipulación directa del DOM, acceso a `window` |
| Puertos | Interfaces que la aplicación necesita: catálogo, carrito, checkout, cotización, medios | Implementaciones concretas |
| Adaptadores | Implementaciones contra WooCommerce, Drive, WhatsApp, Sheets | Lógica de negocio |
| UI | Componentes, estados de carga/vacío/error, accesibles | Cálculos de precio o reglas de carrito |

## 4.3 Módulos

| Módulo | Responsabilidad | Depende de |
|---|---|---|
| `shared-ui` | Tokens de diseño, primitivas visuales, formateo de moneda y medidas | — |
| `website-content` | Inicio, servicios, historia, contacto | `shared-ui` |
| `catalog` | Listado, filtros, búsqueda, ordenamiento, ficha, variantes | `shared-ui` |
| `showroom` | Exploración 2D, ambientes, medidas | `catalog`, `shared-ui` |
| `cart-quote` | Estado del carrito, totales, selección de envío/recojo, cotización | `catalog`, `shared-ui` |
| `commerce-adapter` | Puente hacia WooCommerce: carrito, checkout, disponibilidad | Los puertos definidos por `cart-quote` (no depende del módulo) |

Regla: `catalog` y `showroom` **no** conocen el checkout. `cart-quote` conoce al catálogo. `commerce-adapter` es el único punto que conoce a WooCommerce.

Corrección respecto a 0.1: la versión anterior decía que `commerce-adapter` depende de `cart-quote` «por inversión de control», lo que contradice la regla de dependencias. La formulación correcta es: `cart-quote` define los puertos que necesita (`CartPort`, `CheckoutPort`, `AvailabilityPort`); `commerce-adapter` los implementa. El adaptador conoce a WooCommerce; el módulo de carrito no. Si mañana el checkout se reescribe, se sustituye el adaptador y el dominio no cambia.

## 4.4 Contratos entre módulos

Definidos antes de la implementación, en términos de dominio y no de respuestas HTTP.

```ts
// Tipos base del dominio
type Money = { amount: number; currency: 'PEN' }   // amount con dos decimales, IGV incluido
type Dimensions = { widthCm: number; depthCm: number; heightCm: number }
type MediaRef = { id: string; url: string; alt: string; width: number; height: number }
type Availability = 'in_stock' | 'made_to_order' | 'out_of_stock'

// Catálogo
interface ProductSummary {
  id: string
  sku: string
  model: string
  categoryId: string
  name: string
  price: Money              // precio de venta del canal Masiva Home, IGV incluido
  availability: Availability
  leadTimeHint?: string     // solo cuando availability === 'made_to_order'
  publishedAt: string       // ISO 8601, orden «novedades»
  image?: MediaRef
}

interface ProductDetail extends ProductSummary {
  description: string
  dimensions: Dimensions
  material?: string         // opcional mientras no exista campo normalizado
  variants: Variant[]
  gallery: MediaRef[]
}

interface Variant {
  id: string
  sku: string
  colorName: string
  price: Money
  availability: Availability
  image?: MediaRef
}

// Carrito
interface CartLine {
  productId: string
  variantId?: string
  quantity: number
  unitPrice: Money
}

// Cotización
interface QuoteRequest {
  lines: CartLine[]
  customer: { name: string; phone: string; note?: string }
  fulfilment: 'pickup' | 'delivery' | 'to_define'
}
```

Reglas de los contratos:

- `price` es el precio de venta del canal, nunca el Precio Directo crudo ni el retail (ver 4.9).
- `availability` reemplaza a los campos separados `available` y `madeToOrder` de 0.1, que podían contradecirse entre sí. Es un cambio incompatible respecto a 0.1, aceptable porque **no existe implementación**; a partir de ahora rige la regla de compatibilidad.
- `leadTimeHint` solo tiene sentido con `made_to_order`; con cualquier otro estado se ignora.
- `material` es opcional porque hoy se deduce de la descripción y no es un dato propio (PA-14).
- `fulfilment` permite `to_define` porque las reglas de envío aún no están confirmadas.
- Un contrato nuevo se añade como campo opcional; no se modifica uno existente de forma incompatible.
- Ningún contrato transporta `retailPrice`, datos de Cotizaciones ni identificadores internos de la hoja.

## 4.5 Fuente de verdad por dato

| Dato | Dueño | Consumo desde el frontend |
|---|---|---|
| Precio de venta del canal | WooCommerce | API pública de WooCommerce |
| Contenido y variantes | WordPress | REST API de WordPress |
| Imágenes | WordPress (destino final) | Durante la preparación: Drive |
| Reglas de envío | Pendiente de definición (PA-16) | Se encapsula en `commerce-adapter` |
| Pago | WooCommerce (Mercado Pago, PayPal) | Checkout actual, sin reimplementación |
| Comprobante | Configuración fiscal de WooCommerce (PA-17) | Checkout actual |
| Reclamos | Pendiente legal (PA-18) | Página propia |

## 4.6 Puntos de integración en WordPress

| Punto | Contenido | Interactividad |
|---|---|---|
| Plantillas de página | Contenido editorial | Ninguna |
| Puntos de montaje de catálogo | Listado generado por WooCommerce; filtros y orden como islas | React sobre HTML |
| Puntos de montaje de producto | Galería, variantes, CTA como islas | React sobre HTML |
| Puntos de montaje de showroom | Explorador 2D | React |
| Carrito y checkout | WooCommerce nativo | Nativa |

Regla de aislamiento: **cada módulo debe funcionar aunque Elementor, Variation Swatches o HT Slider cambien o se desactiven.** Si un componente depende de un plugin específico, queda registrado como deuda técnica con responsable.

## 4.7 Gestión de estado

| Tipo de estado | Mecanismo |
|---|---|
| Estado de la vista (filtro abierto, imagen activa) | Local en el componente |
| Filtros, búsqueda y ordenamiento | Parámetros de URL |
| Carrito | Store API de WooCommerce como fuente; el estado en cliente es una vista derivada. **Condicionado:** si el checkout es de shortcode clásico, la Store API y la sesión del checkout pueden no compartir carrito (PA-21) |
| Datos de servidor | Caché y revalidación con deduplicación de peticiones |
| Tema y tokens | Contexto de solo lectura |

## 4.8 Estrategia de renderizado: islas, no aplicación completa

La versión 0.1 tenía una contradicción que conviene resolver antes de implementar:

- RNF-10 exige contenido y enlaces rastreables sin ejecutar JavaScript.
- El diagrama de 4.1 mostraba todo el catálogo y la ficha como componentes React montados en WordPress.

Si el listado y la ficha se pintan solo en el navegador, el contenido no existe para un rastreador que no ejecute el bundle, y RNF-09 (datos estructurados `Product`) tampoco se puede cumplir de forma fiable. D-15 resuelve la contradicción:

| Superficie | Quién genera el HTML | Qué aporta React | Indexable sin JS |
|---|---|---|---|
| Inicio y páginas institucionales | Elementor | Nada o acordeones menores | Sí |
| Listado y categoría | WooCommerce / Elementor | Filtros, orden, cambio de vista, carga incremental | Sí: la primera página de productos llega en HTML |
| Ficha de producto | WooCommerce / Elementor | Galería, selector de variante, actualización de precio, añadir al carrito | Sí: nombre, precio, medidas, descripción e imágenes |
| Showroom | Elementor (contenedor) | Experiencia completa | No requerido; necesita alternativa textual |
| Carrito y checkout | WooCommerce | Nada | No indexable por diseño |

Consecuencias:

- El presupuesto de RNF-03 se aplica a las islas, no a toda la página.
- Un fallo de JavaScript degrada la interacción, no la compra: el enlace al producto y el botón nativo de WooCommerce siguen funcionando.
- La isla de variantes necesita confirmar si el selector nativo de WooCommerce y Variation Swatches ya resuelven el caso. Si lo resuelven, no se construye un selector propio: se estiliza el existente. Construir dos selectores sincronizados es una fuente conocida de errores de precio y stock.
- La isla debe recibir del servidor los datos que ya están en el HTML (precio, variantes) para no duplicar la fuente ni provocar un salto de precio al hidratar.

Esta estrategia **no** cambia D-01 ni D-03: sigue siendo un monolito modular de React + TypeScript dentro de WordPress. Cambia dónde se monta y qué parte del HTML se delega al servidor.

## 4.9 Invariante de precio

La regla comercial (D-09) y la regla de implementación (D-14) se sostienen solo si se cumple:

```
precio_de_venta_woocommerce  ==  precio_directo_aprobado
```

Comprobaciones mínimas:

| Momento | Comprobación | Si falla |
|---|---|---|
| Importación desde Sheets | Comparar el precio cargado con el Precio Directo del registro aprobado | El producto se rechaza y se reporta (RAD-04) |
| Edición manual en WordPress | Revisión del reporte de cambios de precio | Se corrige antes de publicar |
| Publicación | Verificar que el producto no tenga precio vacío, cero o negativo | No se publica |
| Antes del lanzamiento | Recorrido de una muestra por categoría comparando ficha y checkout | Se bloquea el lanzamiento de esa categoría |

No se implementa una segunda fuente de precio en el frontend para «corregir» a WooCommerce. Si el precio está mal, se corrige en el origen; el frontend no compensa datos incorrectos.

---

# 5. Tecnologías y justificación

## 5.1 Decisiones

| Capa | Tecnología | Justificación | Alternativas descartadas |
|---|---|---|---|
| Contenedor y contenido | **WordPress + Elementor** | Es el sistema confirmado, ya administra el negocio y cumple el canal de entrega por rol de editor | Rehacer el backend: prohibido en esta etapa |
| Comercio | **WooCommerce** | Conserva checkout, Mercado Pago, PayPal, pedidos y cupones | Checkout propio: alto riesgo de duplicar y perder integraciones validadas |
| Framework del frontend | **React + TypeScript** | Ecosistema necesario para el showroom 2D y futuro 3D; tipado estricto para contratos entre módulos; el equipo ya lo propone | Angular/Vue: sin ventaja para este alcance; JS puro: costo de mantenimiento inviable a esta escala |
| Empaquetado | **Vite** con salida estática | Entrega un bundle por módulo, carga por entorno y no exige Node en el hosting | Webpack en configuración custom: más complejidad sin beneficio |
| Estilado | **CSS con tokens + CSS Modules** | Sin dependencia de runtime, control total de especificidad y salida pequeña | Tailwind: válido, pero exige unificar criterio visual con Elementor; CSS plano global: riesgo alto de colisiones con el tema |
| Estado remoto | **React Query** | Caché, revalidación y deduplicación frente a una API REST; evita duplicar estado del servidor | Estado global propio: duplicaría lógica de caché |
| Estado cliente | **Context + hooks** | Suficiente para el alcance; evita introducir una librería global prematuramente | Redux/Zustand: solo si el número de estados compartidos crece |
| Estrategia de renderizado | **Islas de React sobre HTML de WooCommerce** | Mantiene indexación y compra sin JavaScript; reduce el bundle por vista (D-15) | Aplicación React que pinte todo el catálogo: contradice RNF-10 y encarece la hidratación |
| Integración con WooCommerce | **Store API** | API pública pensada para carrito, checkout y catálogo; coincide con el modelo de sesión por cookie | REST API autenticada: expondría credenciales en el navegador |
| Formularios | **HTML nativo + validación en dominio** | Menor peso, mejor accesibilidad y control de mensajes | WPForms Lite para flujos internos: no es crítico para esta etapa |
| Pruebas | **Vitest + Testing Library + Playwright** | Pruebas unitarias de dominio y recorridos críticos de compra | Sin cobertura de dominio: inviable mantener las reglas de precio |

Advertencia sobre la Store API: es la elección prevista, pero **no está validada contra el checkout actual**. Si el checkout es de shortcode clásico, la Store API y el carrito de sesión pueden no ser el mismo carrito. Esa validación es PA-21 y condiciona `commerce-adapter`, no la arquitectura.

## 5.2 Por qué React/TypeScript y no Next.js o Astro en esta etapa

- El canal de entrega confirmado es la integración dentro de WordPress con rol de editor. Next.js y Astro requieren un despliegue y una integración que todavía no están aprobados.
- Next.js aporta un servidor de render y un enrutador propio, capacidades que hoy no se necesitan: el contenido se sirve desde WordPress y el catálogo desde la Store API.
- Astro resolvería bien contenido estático, que en esta etapa es responsabilidad de Elementor.
- React + TypeScript como **biblioteca de componentes** cubre el catálogo, las variantes, el carrito y el showroom sin añadir un runtime de servidor.
- Decisión registrada: **Next.js y Astro quedan previstos para una fase futura**, cuando exista un módulo que justifique un despliegue propio, por ejemplo el showroom 3D o un canal de contenido independiente.

Criterio objetivo para evaluar Next.js o Astro en el futuro: un módulo con ciclo de desarrollo propio, carga o despliegue independiente, o necesidad de renderizado en servidor que no pueda resolver WordPress.

Para que ese criterio no dependa de una interpretación, se fija así:

| Disparador | Qué lo cumpliría | Qué se evaluaría |
|---|---|---|
| Render independiente | El showroom 3D necesita un servidor propio o un presupuesto de carga que WordPress no puede sostener | Next.js con el visualizador como ruta propia |
| Despliegue independiente | Un módulo requiere publicar varias veces al día sin tocar producción de WordPress | Astro o Next.js como canal separado |
| Contenido que WordPress no puede servir | Blog editorial o landing con requisitos de rendimiento imposibles en el tema actual | Astro para contenido, conservando WooCommerce |

Mientras ninguno se cumpla, la incorporación de Next.js o Astro sería un cambio de plataforma sin problema que resolver. La decisión queda registrada, no descartada.

## 5.3 Autoría de componentes dentro de Elementor

Elementor aloja el punto de montaje; React aporta la interacción. El bundle se entrega como archivo estático. La publicación del bundle y la habilitación de scripts en el entorno de pruebas se consideran **decisión técnica pendiente de validación**, porque depende de las capacidades reales del rol de editor y del hosting.

Criterio de aceptación para esta decisión: un componente React de prueba carga y opera correctamente en el entorno de pruebas sin modificar PHP ni WooCommerce.

## 5.4 Dependencias y riesgos técnicos

| Riesgo | Impacto | Mitigación | Responsable |
|---|---|---|---|
| El rol de editor no permite insertar scripts externos | Alto: bloquea la interactividad React | Validar en entorno de pruebas antes de comprometer la arquitectura; preparar variante con scripts en línea de menor alcance | Usuario + supervisor |
| No existe medio autorizado para publicar bundles JS/CSS | Alto | Confirmar con el equipo de desarrollo; alternativa: alojar en el propio WordPress como medios | Supervisor |
| Variation Swatches activo interfiere con el selector de variantes | Medio | Auditar su comportamiento antes de construir el selector propio; reutilizarlo si es viable | Equipo de desarrollo |
| Plugins desactualizados | Medio | Inventario con versiones y plan de actualización previo al lanzamiento | Supervisor |
| API habilitada solo en pruebas | Medio | Verificar disponibilidad en producción antes de depender de ella | Equipo de desarrollo |
| Cache de página o plugin interfiere con el carrito | Medio | Revisar caché y cookies de sesión en pruebas de flujo completo | Equipo de desarrollo |
| Elementor Pro inactivo | Bajo | No diseñar sobre funciones exclusivas de Pro | Equipo de desarrollo |
| Datos incompletos en algunas categorías | Medio | Criterio de publicación por producto; categorías incompletas se excluyen | Supervisor |
| El checkout actual es de shortcode y no comparte sesión con la Store API | Alto: rompe la continuidad carrito → checkout | Validar el tipo de checkout (PA-21) antes de construir `commerce-adapter`; si no comparte, usar la API de sesión que use el checkout | Equipo de desarrollo |
| Los plugins de pago no son compatibles con el checkout de bloques | Alto: se pierde un método de pago | Verificar compatibilidad de Mercado Pago y PayPal Payments en el entorno de pruebas | Equipo de desarrollo |
| El listado se renderiza en el cliente y pierde indexación | Alto en un catálogo que depende de búsqueda orgánica | Aplicar D-15 (islas sobre HTML) y verificar el HTML entregado sin JavaScript | Diseño + desarrollo |
| No existe mecanismo autorizado de importación con rol de editor | Medio: la carga se vuelve manual y propensa a error | Definir salida en PA-19 antes de prometer RAD-03 | Supervisor |
| Edición de plantillas en producción sin respaldo | Alto: una plantilla mal guardada deja el sitio inutilizable | RNF-20 y D-18: probar en staging y crear punto de restauración | Supervisor |
| Sin pipeline de imágenes, el catálogo pesa demasiado | Medio: incumple RNF-01 y RNF-19 | Definir responsable y herramienta de conversión (PA-23) | Diseño + marketing |

---

# 6. Dirección visual

## 6.1 Principios

- El monograma actual es la base de la identidad y se reserva para momentos de marca, no como decoración repetida.
- La fotografía real del producto es la protagonista; el texto acompaña, no compite.
- Nada de sliders automáticos en el inicio: la primera vista es una decisión editorial.
- El showroom es el elemento memorable; el resto de la interfaz permanece sobrio.
- Movimiento solo cuando responde a una acción: cambiar variante, abrir medidas, añadir al carrito, rotar en el showroom.

## 6.2 Tokens aprobados

Aprobados el 2026-11-10 (D-21). Reemplazan la paleta de D-20.

### Colores base de marca

| Color | Token | Valor | Papel |
|---|---|---|---|
| Charcoal | `color-charcoal` | `#191817` | Fondos oscuros y texto principal |
| Warm Ivory | `color-ivory` | `#F5F3EF` | Fondo claro base |
| Greige | `color-greige` | `#D8D0C4` | Superficies secundarias y separadores |
| Walnut | `color-walnut` | `#8C6A49` | Detalles y referencia a madera |
| Antique Brass | `color-brass` | `#B18A50` | Acento, iconos y botón principal |

### Familia de acento

Un solo dorado no funciona en ambos modos: sobre marfil pierde contraste y sobre carbón deslumbra. Se define una familia, no un valor:

| Token | Valor | Uso |
|---|---|---|
| `accent-dark` | `#765629` | Acento con más peso sobre fondos claros; hover en modo oscuro |
| `accent` | `#B18A50` | Identidad y acento base |
| `accent-light` | `#D0AE76` | Acento sobre fondos oscuros |

### Tokens semánticos

Los componentes no usan colores de marca directamente: usan roles. Así el cambio de modo no obliga a reescribir estilos.

| Rol | Modo claro | Modo oscuro |
|---|---|---|
| `bg` | `#F5F3EF` | `#191817` |
| `surface` | `#FFFFFF` | `#232120` |
| `text` | `#191817` | `#F5F3EF` |
| `text-muted` | charcoal 70 % | ivory 70 % |
| `border` | `#D8D0C4` | `#3A3633` |
| `accent` | `#B18A50` | `#D0AE76` |
| `accent-hover` | brass + 8 % charcoal | `#B18A50` |
| `state-wood` | `#8C6A49` | `#D0AE76` |

Reglas de uso:

- **Botón principal:** fondo `accent` y etiqueta `charcoal` en ambos modos. Blanco sobre bronce da 2,4:1 y no se usa; bronce como texto sobre marfil da 2,3:1 y tampoco.
- **Hover:** variación tonal del mismo bronce, nunca un color nuevo.
- **Navbar:** marfil en claro, carbón en oscuro. **Footer:** carbón siempre.
- **Separadores:** greige en claro; en oscuro, un carbón más claro. Greige sobre carbón rompe la penumbra.
- **Iconografía:** carbón o bronce; no se mezclan dos acentos en el mismo icono.
- **Foco:** anillo de 2 px en `text`; nunca se elimina ni se sustituye por color de marca.
- **Errores:** texto explícito y borde `text`; el color no es el único indicador.
- **Distribución:** 65 % neutros claros, 25 % oscuros, 10 % acentos. El bronce puede quedar por debajo del 5 %.
- Todo par texto/fondo se verifica con medidor antes de implementar; si falla, se ajusta el token, no el requisito (RNF-05).

**Modo por defecto:** se respeta `prefers-color-scheme` y existe un botón de cambio en la cabecera (E-12). La elección manual se guarda en el navegador y tiene prioridad sobre el sistema; si no hay elección guardada, la web sigue al sistema en vivo.

Escala mínima que debe quedar definida junto con los tokens: espaciado (4/8/12/16/24/32/48/64), radios (0/2/4), tamaños tipográficos y pesos. Sin esa escala, cada módulo improvisa y el sistema se rompe en la tercera pantalla.

## 6.3 Tipografía

| Rol | Familia | Tratamiento |
|---|---|---|
| Títulos | **Cormorant Garamond** | 500/600, escala amplia, `text` |
| Texto y datos | **Manrope** | 400/500, `text-muted` o `text`, cifras tabulares |

- Cormorant Garamond **no se usa por debajo de 24 px ni en párrafos**: sus trazos finos se pierden. Se limita a titulares, precios destacados y cifras de sección.
- Manrope asume navegación, botones, fichas, formularios y tablas.
- Sin mayúsculas sostenidas en títulos de interfaz.
- Los precios y medidas usan cifras tabulares y no se truncan.
- Jerarquía por escala y espacio, no por color.

Se descartan las variantes con mayúsculas sostenidas sobre cada título, las etiquetas decorativas y los subrayados de una sola palabra.

## 6.4 Patrones que se rechazan

- Bloques de tarjetas idénticas con la misma sombra suave.
- Héroe genérico con titular, subtítulo y dos botones.
- Etiquetas del tipo `CATEGORÍA — ETIQUETA` sobre cada sección.
- Animaciones sin función: bucles infinitos, parallax decorativo, movimiento que no responde a una acción.
- Degradados decorativos sin función.

## 6.5 Movimiento

El movimiento explica o confirma; no decora. Tres reglas:

1. **Revelado suave y completo.** Cada bloque aparece una vez al entrar en pantalla (18 px, 900 ms, curva suave) y siempre llega a opacidad completa: ninguna sección queda atenuada. El recorrido del scroll se cuenta con parallax, no con la opacidad.
2. **Microinteracciones.** Responden a una acción: hover, foco, clic. La navegación se pinta de dorado; los botones se elevan 1 px; las imágenes se acercan; los hotspots crecen; el bento se rellena de dorado. El cambio se confirma, no se festeja.
3. **Parallax como narración.** El fondo del héroe y su contenido se mueven a distinta velocidad al salir, y las imágenes de categorías y showroom tienen un desplazamiento sutil ligado al scroll. Sin bucles, sin contadores, sin elementos que se muevan solos.

Detalles del sistema:

| Elemento | Movimiento | Por qué |
|---|---|---|
| Navegación | Color a dorado y subrayado que se dibuja | Señala el destino antes de pulsar |
| Cabecera | Se compacta al desplazar | Gana espacio de lectura sin desaparecer |
| Botones | Elevación de 1 px y cambio tonal | Confirma que es accionable |
| Tarjetas de categoría | Zoom de 4 % de la imagen y nombre que sube 2 px | Indica que la imagen es un enlace |
| Productos | Zoom de 3 % | Mismo motivo, con más contención |
| Cota | La línea se dibuja de izquierda a derecha | Representa una medida real |
| Showroom | Un anillo recorre el hotspot una sola vez | Invita a interactuar sin distraer |
| Aparición de bloques | Opacidad y 18 px de desplazamiento | Ordena la lectura sin retrasarla |
| Héroe | Máscara de entrada y parallax de imagen + alejamiento del contenido | Impacto y profundidad al salir |
| Categorías y showroom | Parallax sutil de la imagen (14 % de escala) | Profundidad al recorrer |
| Iconos de cabecera | Color a dorado y escala 8 % al pasar; 92 % al pulsar | Confirma el objetivo táctil |
| Servicios (bento) | Relleno dorado que recorre el recuadro al pasar | Señala que se puede hacer clic |
| Pie de página | Columnas escalonadas al entrar en pantalla | Cierra la página con ritmo |

### Reparto por biblioteca (D-23)

Cada biblioteca hace una sola cosa, para que la suma no compita con el rendimiento:

| Biblioteca | Responsabilidad | Dónde actúa |
|---|---|---|
| **GSAP + ScrollTrigger** | Líneas de tiempo, revelado al scroll y parallax | Héroe, revelado de bloques, parallax |
| **Motion** | Interacciones de componente: hover, botones y pulsos | Botón magnético, hotspots del showroom |
| **Lenis** | Desplazamiento suave | Toda la página, con anclas suaves |
| **Three.js** | Showroom 3D | Implementado: escenario de estudio con tres muebles |

GSAP y Lenis se cargan de forma diferida (tras el primer pintado) porque solo se necesitan para el scroll; el bundle inicial queda en ~102 KB comprimidos y el motor de scroll llega por separado. Motion se mantiene en el bundle inicial porque actúa al renderizar.

### Intensidad por sección

El movimiento no se reparte por igual: se concentra donde aporta identidad.

| Sección | Intensidad | Qué se busca |
|---|---|---|
| Héroe | Alta | Impacto: máscara, revelado de texto y parallax |
| Tienda | Media | Fluidez: grid escalonado y hover |
| Showroom | Alta | Sorpresa: hotspots y selección |
| Servicios | Media | Elegancia: tarjetas escalonadas |
| Contacto | Baja | Sobriedad: enlaces y formulario |

### Animaciones diferidas (requieren sus páginas)

El showroom 3D ya cubre el giro, el acercamiento (OrbitControls) y la selección de producto. Quedan diferidas, para cuando existan sus páginas: Quick View y filtros (Tienda), cambio de ambiente con crossfade (Showroom), transiciones de formulario (Contacto) e intercambio de fotografía por variante (ficha de producto).

Reglas técnicas:

- Solo se animan `opacity` y `transform`; nunca propiedades que recalculen el layout.
- La duración máxima es 900 ms y la espera entre elementos de un mismo grupo, 90 ms.
- El hover de la navegación usa `--nav-hover`: bronce oscuro `#765629` sobre marfil (6:1) y bronce claro `#d0ae76` sobre carbón (8:1). No se usa el bronce base como texto sobre marfil.
- Con `prefers-reduced-motion`, todo aparece de inmediato y no hay animación de anillo.
- Sin JavaScript, el contenido se muestra completo: el ocultamiento inicial depende de la clase `js` en `<html>`.
- La alternancia de tema no cambia el layout (RNF-27): el scrollbar reserva su espacio y los tokens solo modifican color.

---

# 7. Contenidos

## 7.1 Mapa del sitio

| Ruta | Propósito | Tipo | Depende de |
|---|---|---|---|
| `/` | Inicio | Editorial | Contenido aprobado + catálogo |
| `/catalogo/` | Catálogo completo | Aplicación | Datos |
| `/categoria/{categoria}/` | Listado por categoría | Aplicación | Datos |
| `/producto/{slug}/` | Ficha de producto | Aplicación | Datos |
| `/showroom/` | Explorador 2D | Aplicación | Catálogo + medios |
| `/carrito/` | Carrito | WooCommerce | Sesión |
| `/checkout/` | Checkout | WooCommerce | Reglas de envío |
| `/servicios/` | Servicios | Editorial | Copy aprobado |
| `/nosotros/` | Historia de la marca | Editorial | Copy aprobado |
| `/contacto/` | Contacto y datos | Editorial | Datos oficiales |
| `/garantia/`, `/envios/`, `/cambios/` | Información comercial | Editorial | Copy aprobado |
| `/privacidad/`, `/terminos/`, `/cookies/` | Legal | Editorial | Textos aprobados |
| `/reclamaciones/` | Libro de Reclamaciones | Legal | Texto y responsable (PA-18) |
| `/cotizar/` | Confirmación de solicitud | Aplicación | WhatsApp |

Advertencia de rutas: WooCommerce controla las URLs de producto y categoría con su propia configuración de enlaces permanentes. Las rutas de esta tabla son la **intención editorial**, no una decisión de implementación. Antes de publicar se debe:

1. Inventariar las URLs actuales con tráfico (incluidas las de producto existentes).
2. Fijar la estructura de enlaces permanentes en el entorno de pruebas.
3. Crear un mapa de redirecciones permanentes y verificarlo (RF-24).
4. Confirmar que `/carrito/` y `/checkout/` son las páginas reales de WooCommerce y no una suposición.

Cambiar los enlaces permanentes sin mapa de redirecciones es la forma más rápida de perder el tráfico que el rediseño pretende captar.

## 7.2 Contenido del inicio

| Bloque | Contenido | Origen |
|---|---|---|
| Apertura | Imagen protagonista + propuesta de valor en una línea | Copy aprobado + foto real |
| Categorías | Acceso visual a todas las categorías | Datos |
| Productos destacados | Selección de productos reales | Decisión de catálogo |
| Showroom | Acceso a la experiencia 2D | Media |
| Servicios | Compra, envío/recojo, garantía | Copy aprobado |
| Confianza | Materiales, entrega, garantía, con datos verificables | Copy aprobado |
| Contacto | WhatsApp, correo, redes | Datos oficiales |

No se incluirán testimonios, blog ni estadísticas mientras no exista contenido real aprobado.

## 7.3 Inventario de contenidos pendientes de redacción

| Bloque | Estado |
|---|---|
| Propuesta de valor | Pendiente |
| Historia de la marca | Existe un texto parcial en el sitio actual, requiere depuración de comillas y erratas |
| Servicios | Pendiente |
| Garantía y entrega | El sitio actual menciona garantía de 7 días por defecto de fábrica; requiere confirmación de vigencia |
| Datos de contacto | Parcial: teléfono y correo; falta dirección y redes verificadas |
| Políticas | Pendiente |
| FAQs | Pendiente |
| Textos de categoría | Pendiente |
| Textos del showroom | Pendiente |

## 7.4 Contenido que debe retirarse del sitio actual

- Productos de demostración: *Aliquam Ododiam*, *Classic Wooden Table*, *Consectetur Dipiscing*, *Viverra adipiscing*, *Mattis nunc*, *Elementum integer*.
- Bloques de blog y testimonios con texto de relleno.
- Bloque de descuento del 20 % mientras no exista una campaña aprobada.
- Contenido en inglés y latinillo en el sitio actual.
- Enlaces a `#` y rutas de servicios inexistentes.

## 7.5 Diccionario de datos

| Campo | Tipo | Fuente | Requerido | Notas |
|---|---|---|---|---|
| `sku` | string | Carga General | Sí | Identificador estable **propuesto**; no confirmado como clave única entre hojas (PA-14) |
| `variantSku` | string | Carga General / WooCommerce | Condicional | Necesario si cada variante se vende por separado |
| `slug` | string | Generado | Sí | Derivado del título; estable después de publicar |
| `title` | string | Carga General | Sí | Incluye producto, marca, modelo y características principales |
| `description` | string | Carga General | Sí | Texto largo con beneficios, especificaciones y notas |
| `model` | string | Carga General | Sí | Agrupa variantes |
| `category` | string | Por confirmar | Sí | Mapeo oficial pendiente (PA-03) |
| `colorName` | string | Carga General | Sí | Color comercial de la variante |
| `colorDisplay` | string | Carga General | Sí | Color de melamina, texto libre |
| `dimensions` | object | Carga General | Sí | Ancho, profundidad, alto en cm; el orden se fija para evitar lecturas distintas |
| `unitPrice` | money | Cotizaciones (Precio Directo) | Sí | Incluye IGV; se importa como precio de venta del canal |
| `taxClass` | string | WooCommerce | Sí | Debe reflejar precio con IGV incluido para no duplicar impuesto |
| `retailPrice` | money | Cotizaciones | No | Excluido del frontend de Masiva Home |
| `material` | string | Por normalizar | Condicional | Hoy se deduce de la descripción; se convierte en filtro solo con campo propio (PA-14) |
| `finish` | string | Por normalizar | No | Acabado; útil para filtros y descripciones |
| `images` | lista | Drive | Sí | Al menos una por modelo; idealmente por variante |
| `imageOrder` | number | Drive / WordPress | Sí | Orden de la galería; el orden alfabético de archivo no es un criterio válido |
| `altText` | string | Redacción | Sí | Describe el mueble y su acabado; no repite el título sin aportar |
| `room` | string | Decisión de catálogo | No | Ambiente para el showroom; habilita la vista por ambiente (RF-15) |
| `availability` | enum | Por definir | Sí | `in_stock`, `made_to_order`, `out_of_stock` |
| `leadTime` | string | Por definir | Condicional | Obligatorio si `availability = made_to_order` (PA-12) |
| `requiresAssembly` | boolean | Descripción | Sí | La descripción indica entrega armado o requiere armado |
| `installationIncluded` | boolean | Por definir | No | Reglas por categoría |
| `careInstructions` | string | Por definir | No | Cuidado del material; reduce consultas repetidas |
| `warranty` | string | Por definir | No | Reglas por producto o política general (PA-08) |
| `shippingClass` | enum | Por definir | Condicional | Necesario para calcular envío (PA-05) |
| `packagedWeight` | number | Por definir | Condicional | Necesario para calcular envío |
| `packagedDimensions` | object | Por definir | Condicional | Necesario para volumetría y transporte |
| `publishedAt` | date | WordPress | Sí | Orden «novedades» y datos estructurados |
| `isPublished` | boolean | WordPress | Sí | Controla visibilidad pública |
| `featured` | boolean | WordPress | No | Selección de destacados |
| `instagramVariant` | boolean | Carga General | No | Indicador existente para publicación en redes |

Campos de la tabla que hoy **no existen** en la fuente: `material`, `finish`, `availability`, `leadTime`, `installationIncluded`, `careInstructions`, `warranty`, `shippingClass`, `packagedWeight`, `packagedDimensions`, `room` y `altText`. Se declaran porque el modelo los necesita; ninguno se inventa al importar. Un producto puede publicarse sin los opcionales, pero no sin los marcados como obligatorios.

## 7.6 Criterios de publicación

Un producto se publica cuando cumple, como mínimo:

- `sku`, `title`, `description`, `model`, `category`, `dimensions` y `unitPrice` presentes.
- Al menos una imagen principal con `altText`, más una imagen por variante de color cuando la variante exista.
- `availability` definida; si es `made_to_order`, `leadTime` presente y comprensible para el cliente.
- `publishedAt` asignado.
- Precio de venta del canal coincidente con el Precio Directo aprobado (4.9).
- `slug` único y sin colisión con una URL existente que tenga tráfico.

Un producto que no cumple los criterios no se publica; no se publica con datos incompletos ni con contenido de relleno. Un producto que deja de cumplirlos se despublica, no se oculta parcialmente: una ficha a medias es peor que una ficha ausente.

---

# 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| El rol de editor no admite el bundle React | Media | Alto | Validación temprana en entorno de pruebas; plan alternativo de menor alcance |
| Falta de reglas de envío | Alta | Medio | El checkout cierra en modalidad `to_define` con cotización; no se muestra un total inventado |
| Datos incompletos en categorías | Media | Medio | Criterios de publicación y exclusión de categorías incompletas |
| Cotizaciones expone precios internos | Media | Alto | El frontend solo consume el precio de venta del canal publicado por WooCommerce |
| Plugin de pagos con flujo no documentado | Media | Alto | Pruebas de compra end-to-end antes del lanzamiento |
| Abandono del proyecto por el rol de editor | Media | Alto | Código en repositorio, documentación de decisiones y autonomía de módulos |
| El sitio actual pierde tráfico | Media | Medio | Redirecciones por URL, canonicals y metadatos por página |
| El showroom 3D cambia de dirección | Media | Medio | Contrato de selección estable; el visualizador es reemplazable |
| El catálogo crece sin control y el rendimiento cae | Media | Medio | Medir el volumen antes de diseñar listados; paginación desde el inicio (PA-22) |
| Un cambio de plugin rompe el diseño | Media | Medio | RNF-14; estilos propios encapsulados y pruebas visuales por plantilla |
| La interpretación de una talla o medida difiere entre fuentes | Media | Alto | Fijar el orden de dimensiones en el diccionario y validarlo en la importación |
| Se publican productos con precio de otra lista (retail) | Baja | Alto | Invariante 4.9 y comprobación en cada importación |

---

# 9. Fuera de alcance

Esta sección no repite 1.4: **1.4 es la fuente única del alcance excluido**. Se deja este encabezado solo como punto de referencia y para no romper enlaces internos del documento. Cualquier exclusión nueva se agrega en 1.4, no aquí.

---

# 10. Criterios de éxito

1. Un visitante puede llegar desde el inicio a un producto concreto, elegir variante, añadirlo al carrito y completar la compra en el flujo actual sin asistencia.
2. El importe visible en el carrito coincide con el cobrado en el checkout, y ambos coinciden con el Precio Directo aprobado.
3. Un visitante que no elige envío puede completar el pedido como recojo.
4. Un visitante con dudas puede generar una cotización de WhatsApp con el detalle completo de su selección.
5. Todas las categorías publicadas muestran productos reales, con imagen, precio y medidas.
6. Ninguna página de producción contiene contenido de demostración.
7. El sitio cumple WCAG 2.1 AA en los flujos de catálogo, producto, carrito y checkout.
8. El personal interno puede actualizar precio, disponibilidad e imágenes sin intervención técnica.
9. El sitio mantiene el flujo de pago actual sin pérdida de métodos ni de pedidos.
10. La exploración 2D permite recorrer productos y sus variantes con fotografías reales.
11. El listado y la ficha muestran productos, precios y enlaces con JavaScript desactivado.
12. Un visitante puede presentar un reclamo y obtener constancia sin salir del sitio.
13. Un cambio de precio publicado se detecta si no coincide con el Precio Directo aprobado, antes de llegar al cliente.

---

# 11. Preguntas abiertas

| ID | Pregunta | Responsable | Bloquea |
|---|---|---|---|
| PA-01 | ¿Cuál es el mecanismo autorizado para publicar bundles JS/CSS y habilitarlos en el entorno de pruebas? | Supervisor + desarrollo | RF-07, RF-08, RF-15 |
| PA-02 | ¿Las APIs están habilitadas en producción? | Desarrollo | RF-03, RF-06, RF-10 |
| PA-03 | ¿Cuál es la lista oficial de categorías y cómo se resuelven las discrepancias de nomenclatura (`31. Carpetas` vs `31. Pupitres`, `Cabeceras`)? | Supervisor | RF-02, RF-03 |
| PA-04 | ¿Qué regla de precio y stock se importa a WooCommerce y cómo se refleja la aprobación comercial? | Supervisor | RF-07, RAD-01 |
| PA-05 | ¿Cómo se calculan el envío y los tiempos de entrega por producto, tamaño y destino? | Supervisor | RF-14 |
| PA-06 | ¿Cuáles son los puntos de recojo y el proceso para avisar que el pedido está listo? | Supervisor | RF-13 |
| PA-07 | ¿Cuál es el flujo completo de Mercado Pago, Yape, Plin, tarjetas y PayPal, y qué método depende de qué plugin? | Supervisor | RF-11 |
| PA-08 | ¿Qué reglas de garantía, instalación y cuidado aplican a cada producto? | Supervisor | RF-16, RF-17 |
| PA-09 | ¿Qué textos están aprobados para las páginas institucionales y legales? | Supervisor | RF-16, RF-17 |
| PA-10 | ¿Qué productos y categorías son destacados y qué campañas estacionales se contemplan? | Supervisor | RF-20, RF-01 |
| PA-11 | ¿Qué formato y escala tendrán los modelos 3D y quién los entrega? | Diseño y marketing | Alcance futuro |
| PA-12 | ¿Cómo se comunican los tiempos de fabricación al cliente? | Supervisor | RF-07, RF-26 |
| PA-13 | ¿Qué medirán el resultado del rediseño y con qué herramienta? | Supervisor | Criterios de éxito, RF-23 |
| PA-14 | ¿Cuál es la clave estable de producto entre Carga General, Cotizaciones y Drive, y quién normaliza `material` y dimensiones? | Supervisor + datos | RF-04, RAD-03 |
| PA-15 | ¿El Precio Directo es por modelo o por variante? ¿Pueden dos variantes del mismo modelo tener precios distintos? | Supervisor | RF-07, RF-08, 4.9 |
| PA-16 | ¿El envío lleva IGV y cómo se declara en el total? | Supervisor + contabilidad | RF-14 |
| PA-17 | ¿Qué comprobantes se emiten (boleta, factura) y cómo está configurada el área fiscal de WooCommerce? | Supervisor + contabilidad | RF-21 |
| PA-18 | ¿Quién redacta y responde el Libro de Reclamaciones, y qué obligaciones legales aplican al comercio electrónico? | Supervisor + asesor legal | RF-22 |
| PA-19 | ¿Qué mecanismo de importación es viable con el rol de editor? | Supervisor | RAD-03, RAD-04 |
| PA-20 | ¿Cómo se indexa el SKU para la búsqueda interna? | Desarrollo | RF-06 |
| PA-21 | ¿El checkout actual usa shortcode clásico o bloques, y comparte sesión de carrito con la Store API? | Desarrollo | RF-10, RF-11, `commerce-adapter` |
| PA-22 | ¿Cuál es el volumen esperado de productos y variantes en el lanzamiento y a doce meses? | Supervisor | Rendimiento, paginación |
| PA-23 | ¿Quién produce y convierte las imágenes, y con qué herramienta? | Diseño + marketing | RF-25, RNF-19 |
| PA-24 | ¿Existe respaldo y restauración probados antes de editar plantillas en producción? | Supervisor + hosting | RNF-20, D-18 |
| PA-25 | ¿Qué analítica se quiere y cómo se gestiona el consentimiento? | Supervisor | RF-23 |

---

# 12. Fases propuestas

| Fase | Contenido | Puerta de validación |
|---|---|---|
| 0. Evaluación | Auditoría, decisiones, baseline | Aprobada |
| 1. Especificación | Este documento | **Pendiente de aprobación** |
| 2. Contenidos y diseño | Copy aprobado, sistema visual, prototipos responsive | Aprobación de cliente y supervisor |
| 3. Plan técnico | Contratos, integración, plan de pruebas, plan de datos | Aprobación técnica |
| 4. Implementación por módulos | Vertical: catálogo → producto → carrito → showroom → administración | Hitos con revisión humana |
| 5. Lanzamiento | Pruebas end-to-end, migración, analítica, documentación | Aprobación de publicación |

## Pruebas de viabilidad previas (spikes)

Antes de construir componentes se ejecutan cuatro pruebas pequeñas y desechables en el entorno de pruebas. Su objetivo no es entregar funcionalidad, sino responder preguntas que cambian la arquitectura:

| Spike | Qué se prueba | Pregunta que responde | Si falla |
|---|---|---|---|
| S-1 Montaje | Un componente React mínimo cargado desde el mecanismo disponible | PA-01 | Se replantea la interactividad y se avisa antes de invertir en módulos |
| S-2 Listado | Una plantilla de WooCommerce estilizada sin JS + un filtro como isla | D-15, RNF-10 | Se revisa la estrategia de renderizado |
| S-3 Carrito | Añadir desde una isla y continuar en el checkout real | PA-21 | Se ajusta `commerce-adapter` o se usa el formulario nativo de WooCommerce |
| S-4 Importación | Cargar un producto de prueba con precio y variantes desde la fuente | PA-19, PA-14 | Se mantiene carga manual documentada |

Ninguno de estos spikes es código definitivo y ninguno requiere modificar PHP.

## Orden de construcción por módulos

1. Fundaciones: tokens, tipografía, layout base, contrato de datos de catálogo.
2. Contenido institucional y navegación.
3. Catálogo: listado, filtros, búsqueda, ordenamiento.
4. Ficha de producto: galería, variantes, medidas, disponibilidad.
5. Carrito: líneas, variantes, totales, elección de envío o recojo.
6. Cotización por WhatsApp.
7. Showroom 2D.
8. Administración progresiva e importación validada.
9. Integración del checkout y pruebas end-to-end.
10. Endurecimiento: accesibilidad, rendimiento, SEO, analítica.

Este orden no es una promesa de calendario. Cada paso depende de que el anterior sea verificable y de que las preguntas abiertas que lo bloquean estén resueltas o explícitamente aceptadas como límite.

Cada módulo se entrega como un recorrido vertical funcional y verificable, con puntos de control antes de continuar.

---

# 13. Registro de cambios

| Fecha | Versión | Cambio | Motivo |
|---|---|---|---|
| 2026-11-10 | 0.1 | Especificación inicial: requisitos, historias, arquitectura, tecnologías | Fase de especificación solicitada tras aprobación del baseline |
| 2026-11-10 | 0.2 | Auditoría de consistencia; corrección de contradicciones (precio, renderizado, dependencia del adaptador, checklist de publicación); 8 requisitos funcionales y 8 no funcionales nuevos; 12 preguntas abiertas nuevas; glosario, supuestos, trazabilidad y registro de auditoría | Revisión solicitada: consistencia, contradicciones, documentación faltante |
| 2026-11-10 | 0.3 | Aprobación formal de D-14 a D-18; decisión D-19 (doble registro documental); el documento se separa en espec técnica (este archivo) y guía de negocio; definida la estructura de `docs/` para los aprobados | Usuario aprobó los cinco puntos y pidió separar documentación empresarial y técnica |
| 2026-11-10 | 0.4 | D-20: paleta y tipografía aprobadas. Se reemplazan los tokens preliminares (sage, danger, focus azul) por negro, gris oscuro y dorado mostaza; tipografía definida como Instrument Serif + Instrument Sans; reglas de contraste del dorado | El cliente aportó la referencia de materiales y fijó el color de títulos, texto y botón principal |
| 2026-11-10 | 0.5 | D-21: paleta definitiva carbón/marfil/greige/nogal/bronce con familia de bronce para claro y oscuro; tokens semánticos y modo oscuro; Cormorant Garamond + Manrope. D-20 queda reemplazada | El cliente definió la paleta final, la estrategia de acento por modo y la tipografía |
| 2026-11-10 | 0.6 | D-22: sistema de movimiento (revelado al entrar, microinteracciones, hover dorado en navegación, sin bucles). Nueva sección 6.5 y corrección de 6.4 | El cliente pidió animaciones con sentido en toda la página y hover dorado en la cabecera |
| 2026-11-10 | 0.7 | RNF-27: la alternancia de tema no cambia el layout. Nuevas microinteracciones (zoom del héroe, iconos, servicios, pie escalonado) | El cliente reportó que alternar modo claro/oscuro redimensionaba la página y pidió más animaciones |
| 2026-11-11 | 0.8 | D-23: stack de animación GSAP + Motion + Lenis (Three.js previsto para 3D). Héroe con máscara y revelado de texto; parallax; reparto por biblioteca; carga diferida del motor de scroll para mantener el presupuesto de bundle | El cliente integró el stack de animación y pidió mantener rendimiento, consistencia y accesibilidad |
| 2026-11-11 | 0.9 | D-24: showroom 3D con Three.js + React Three Fiber + Drei (comedor, centro de mesa y mesa de TV modelados proceduralmente). D-12 actualizada. Revelado de títulos con máscara | El cliente aportó referencias de animación y una imagen de escenario, y pidió avanzar al showroom 3D |

---

# 14. Glosario

| Término | Definición en este proyecto |
|---|---|
| Carga General | Hoja con contenido público del producto: título, descripción, SKU, variantes, medidas y color |
| Cotizaciones | Hoja con `Precio Directo`, `Precio Retail`, aprobación comercial y tipo de producto |
| Precio Directo | Precio de venta de Masiva Home, con IGV incluido, aprobado en Cotizaciones |
| Precio Retail | Precio para marketplaces y distribuidores; excluido del frontend de Masiva Home |
| Precio de canal | Precio que WooCommerce publica al navegador; debe ser igual al Precio Directo (4.9) |
| Modelo | Conjunto de variantes que comparten diseño y descripción |
| Variante | Combinación vendible de un modelo, normalmente por color, con SKU propio |
| Bajo pedido | Producto que se fabrica tras la compra; exige plazo y condiciones claras |
| Recojo | Entrega en tienda o almacén, sin costo de envío |
| `to_define` | Estado de entrega que indica que la modalidad o el costo aún no se confirma |
| Isla | Componente React montado sobre HTML ya generado por el servidor |
| Punto de montaje | Contenedor en una plantilla de Elementor donde se inicializa una isla |
| Bundle | Archivo compilado de JavaScript y CSS que se publica como activo estático |
| Staging | Entorno WordPress de pruebas, separado de producción |
| Invariante | Condición que debe cumplirse siempre; si falla, se bloquea la publicación |

---

# 15. Supuestos para prototipo

Un supuesto no es un hecho: se usa solo en prototipos, se marca en la pieza y se valida antes de implementar. Si el supuesto resulta falso, cambia el alcance indicado.

| ID | Supuesto | Se valida con | Si es falso |
|---|---|---|---|
| S-01 | Un modelo tiene un Precio Directo y sus variantes comparten precio | PA-15 | La ficha y el carrito necesitan precio por variante desde el inicio |
| S-02 | El catálogo inicial no supera ~300 variantes | PA-22 | Se replantean paginación, búsqueda y estrategia de listado |
| S-03 | Las fotos de Drive están autorizadas para uso comercial y tienen calidad suficiente | PA-23 | Se necesita una sesión de fotografía antes del lanzamiento |
| S-04 | Existe un número de WhatsApp Business único y verificado | PA-09 | La cotización necesita otro canal de destino |
| S-05 | Las cuentas de Mercado Pago y PayPal operan en producción con las mismas credenciales probadas | PA-07 | El lanzamiento no puede cobrar hasta resolver credenciales |
| S-06 | El tema Blocksy permite plantillas de WooCommerce modificables sin PHP | S-2 | Se replantea el contenedor de las islas |
| S-07 | El envío se cotiza por separado al inicio | PA-05, PA-16 | El checkout necesita tarifas antes de operar |
| S-08 | El catálogo se publica completo en el lanzamiento | PA-03, PA-14 | Se lanza con las categorías que cumplan 7.6 |

---

# 16. Matriz de trazabilidad

Las historias se numeraron de nuevo en 0.2 para agruparlas por flujo. Esta matriz evita que un requisito quede sin historia y que una historia quede sin requisito.

| Requisito | Caso de uso | Historias | Pregunta abierta |
|---|---|---|---|
| RF-01, RF-02 | CU-01 | HU-01 a HU-05 | PA-03, PA-10 |
| RF-03, RF-04, RF-05 | CU-01 | HU-01, HU-03, HU-04 | PA-14, PA-22 |
| RF-06, RF-28 | CU-01 | HU-02, HU-05 | PA-20 |
| RF-07, RF-09 | CU-02 | HU-06 a HU-09, HU-11 | PA-08, PA-15 |
| RF-08 | CU-02, CU-03 | HU-07 | PA-15, PA-21 |
| RF-10, RF-12 | CU-03, CU-06 | HU-12, HU-16, HU-17 | PA-21 |
| RF-11 | CU-04 | HU-15 | PA-07, PA-21 |
| RF-13, RF-14 | CU-05 | HU-13, HU-14 | PA-05, PA-06, PA-16 |
| RF-15 | CU-07 | HU-20 a HU-23 | PA-11, PA-23 |
| RF-16, RF-17 | — | — | PA-08, PA-09 |
| RF-18, RF-19 | — | HU-23 | — |
| RF-21 | CU-11 | HU-18 | PA-17 |
| RF-22 | CU-10 | HU-29 | PA-18 |
| RF-23 | — | HU-30 | PA-25 |
| RF-24 | — | — | PA-03 |
| RF-25 | — | HU-11 | PA-23 |
| RF-26 | CU-06 | HU-17 | PA-09 |
| RF-27 | CU-12 | HU-19 | PA-07 |
| RAD-01 a RAD-04 | CU-08, CU-09 | HU-24 a HU-27 | PA-19 |
| RNF-20, RNF-21 | — | HU-28 | PA-24 |

---

# 17. Registro de auditoría 0.2

## 17.1 Contradicciones detectadas y resolución

| ID | Contradicción | Dónde estaba | Resolución |
|---|---|---|---|
| C-01 | «El precio público es el Precio Directo» y «el frontend no consume el Precio Directo» | Fuentes de datos | Se separan regla comercial y regla de implementación; se agrega el invariante 4.9 (D-14) |
| C-02 | RNF-10 exige contenido indexable sin JS, pero todo el catálogo era React | 1.1, 4.1, RNF-10 | Se adopta la estrategia de islas (D-15, 4.8) |
| C-03 | `commerce-adapter` «depende de `cart-quote`» | 4.3 | Se corrige a inversión de dependencia: `cart-quote` define puertos, el adaptador los implementa |
| C-04 | RF-14 exige cobrar envío, pero las reglas de envío no existen | 1.1, 1.3 | RF-14 queda condicionado; se agrega PA-05 y PA-16 |
| C-05 | RAD-01 y RAD-03 prometen automatización con rol de editor | 1.2 | Se documentan tres salidas posibles; RAD-03/04 quedan condicionados (PA-19) |
| C-06 | `available` y `madeToOrder` podían contradecirse | 4.4 | Se reemplazan por `availability` con estados excluyentes |
| C-07 | RF-05 ordena por «novedades» sin fecha en el modelo | 1.1, 7.5 | Se agrega `publishedAt` |
| C-08 | RF-04 filtra por material y medidas que no existen como campo | 1.1, 7.5 | Filtros limitados a atributos confirmados; material y dimensiones condicionados (PA-14) |
| C-09 | RF-06 busca por SKU, que WordPress no indexa por defecto | 1.1 | Se declara la dependencia de un índice (PA-20) |
| C-10 | Rutas propuestas contra enlaces permanentes reales de WooCommerce | 7.1 | Se separa intención editorial de implementación y se agrega RF-24 |
| C-11 | Dos secciones «Fuera de alcance» con contenido distinto | 1.4 y 9 | 1.4 queda como fuente única; 9 apunta a 1.4 |
| C-12 | Estados de decisión inconsistentes («Aprobada como propuesta») | Registro de decisiones | Se fija un vocabulario único de cinco estados |

## 17.2 Requisitos faltantes incorporados

| Área | Qué faltaba | Requisito nuevo |
|---|---|---|
| Fiscal | Comprobante de pago y datos de facturación | RF-21 |
| Legal | Libro de Reclamaciones y obligaciones del comercio electrónico | RF-22, PA-18 |
| Privacidad | Consentimiento de cookies y analítica | RF-23, PA-25 |
| SEO | Redirecciones y conservación de URLs existentes | RF-24 |
| Accesibilidad | Texto alternativo de imágenes y nombres de archivo | RF-25, RNF-19 |
| Marketing | Cotización por WhatsApp con límite de longitud | RF-26 |
| Postventa | Notificaciones y estados del pedido | RF-27, CU-12 |
| UX | Búsqueda sin resultados | RF-28 |
| Operación | Respaldo, staging y actualización de plugins | RNF-20, RNF-21 |
| Observabilidad | Registro de errores sin datos personales | RNF-22 |
| Privacidad | No persistir datos de cotización | RNF-23 |
| Showroom | Accesibilidad y alternativa textual | RNF-24 |
| Seguridad | Anti-abuso en formularios | RNF-25 |
| Resiliencia | Caída de WhatsApp o de un medio de pago | RNF-26 |
| Sistema visual | Tokens de foco, error y borde; escala de espaciado | 6.2 |

## 17.3 Lo que esta revisión no resuelve

- No valida técnicamente el entorno: los spikes S-1 a S-4 siguen pendientes.
- No fija precios, categorías ni textos: son decisiones del cliente.
- No convierte supuestos en hechos: S-01 a S-08 siguen siendo supuestos.
- No cierra el alcance legal: requiere revisión de un asesor.
- No estima plazos ni costos: no hay volumen ni velocidad de equipo confirmados.

## 17.4 Riesgo principal del documento

El documento ya es coherente consigo mismo, pero su punto más frágil sigue siendo externo: **que el rol de editor no permita ejecutar el frontend interactivo**. Si S-1 falla, la especificación funcional se mantiene y cambia la estrategia de implementación, no el objetivo del producto. Conviene resolverlo antes de la fase 3.
