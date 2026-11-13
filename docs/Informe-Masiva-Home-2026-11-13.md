# Masiva Home — Informe de alineamiento de diseño y WordPress

**Fecha:** 13 de noviembre de 2026  
**Participantes:** coordinación, diseño/frontend y desarrollo WordPress/backend  
**Estado:** documento para revisión y acuerdos en reunión; no representa una integración terminada.

## 1. Objetivo de hoy

Acordar cómo aplicar el nuevo diseño sobre el catálogo que el equipo ya tiene en WordPress, aprovechando sus productos, administración y proceso de compra. Antes de construir funcionalidades adicionales, necesitamos revisar qué existe y asignar responsables a lo pendiente.

**Propuesta:** conservar la base comercial existente y adaptar su presentación y navegación. El prototipo local es una referencia de diseño e interacción; todavía no está conectado a WordPress. No debemos asumir que su código se puede trasladar directamente sin adaptar plantillas, datos y carrito.

## 2. Estado y alcance

| Frente | Lo que sabemos hoy | Lo que falta confirmar |
|---|---|---|
| WordPress | El equipo informa que ya existe un catálogo y una vista desarrollados. | Demostración del sitio, entorno de pruebas, tema/constructor, plugins y estado de WooCommerce. |
| Diseño local | Inicio/Tienda con dos destacados y acceso al catálogo; navegación por categorías, búsqueda y vista rápida con galería. | Qué componentes se pueden adaptar sobre las plantillas existentes y cuáles requieren desarrollo específico. |
| Productos y fotos | El prototipo contiene 12 modelos, incluidos seis aparadores. Arden tiene dos acabados visuales y Arian, cuatro. | Correspondencia con productos, variantes, SKU y medios ya cargados en WordPress. No son 12 variantes comerciales verificadas. |
| Datos comerciales | Siete registros locales tienen precios de Carga General; cinco aparadores adicionales tienen precio y medidas pendientes. | Vigencia, importación, impuestos, stock y aprobación de los datos que se publicarán. |
| Compra | El prototipo permite una selección en carrito local y consulta por WhatsApp. | Carrito real, sesión, disponibilidad, envío y continuidad con el checkout existente. El prototipo no crea pedidos ni cobra. |
| Showroom | Existe una experiencia 3D local con selección de muebles y acceso al carrito local. | Identificadores comerciales e integración con el mismo carrito de WordPress. La compra debe seguir disponible si el 3D no puede mostrarse. |

## 3. Recorrido que debemos implementar juntos

**Catálogo → Aparadores → Vista rápida → Acabado → Carrito → Checkout existente.**

- Acceso a Aparadores desde el menú del catálogo en una selección, sin recorrer categorías ajenas.
- Previsualización con fotos, acabado, medidas, precio y disponibilidad, conservando el contexto al cerrar.
- Cada acabado vendible debe identificar su variante real; una foto diferente no demuestra que exista una variante comercial.
- Catálogo, ficha y showroom deben agregar al mismo carrito. Al continuar al checkout, deben conservarse producto, variante y cantidad.
- Los precios pendientes se muestran como «Precio por confirmar» y permiten consulta; no se presentan como productos gratuitos.

## 4. Lenguaje común del proyecto — ubiquitous language

| Término | Significado acordable para este proyecto |
|---|---|
| Catálogo | Conjunto de productos publicados para consulta o compra. No significa únicamente la cuadrícula de fotos. |
| Categoría o familia | Tipo de mueble: Aparadores, Mesas de centro, Roperos. Usaremos «categoría» en la interfaz y documentaremos su equivalencia técnica. |
| Ambiente | Espacio de uso: Sala, Comedor o Dormitorio. Es un criterio diferente de categoría. |
| Modelo / producto padre | Diseño del mueble, por ejemplo Aparador Arian. Puede agrupar varias variantes. |
| Acabado | Combinación visible de color/material. Solo será una variante comprable si está configurada comercialmente. |
| Variante | Opción concreta que se vende, con sus atributos, identificador, SKU y datos comerciales cuando corresponda. |
| SKU | Código comercial del artículo vendible; no debe confundirse con el ID interno de WordPress. |
| Vista rápida / previsualización | Panel que permite inspeccionar un producto sin abandonar el catálogo. No sustituye necesariamente su página permanente. |
| Precio público | Importe de venta aprobado que verá el cliente. Su fuente para esta entrega es Carga General; el servidor valida el importe comercial. |
| Disponibilidad | Estado comercial confirmado: disponible, bajo pedido o agotado. «Por confirmar» no equivale a disponible. |
| Carrito | Selección de productos y cantidades previa al pedido. El carrito local del prototipo no es todavía el carrito comercial. |
| Pedido / checkout | El pedido es el registro comercial; el checkout es el proceso para confirmar datos, entrega y pago. Añadir al carrito no crea una venta. |
| Staging | Copia de pruebas de WordPress donde se revisa la integración antes de publicarla. |

## 5. Puntos que necesitamos resolver con backend

| Prioridad | Pregunta / acuerdo necesario | Responsable propuesto |
|---|---|---|
| P0 | Mostrar el catálogo y una compra de prueba existentes. ¿Qué está funcionando y qué sigue en desarrollo? | WordPress/backend |
| P0 | Confirmar tema, constructor y forma de adaptar las vistas: plantillas, componentes existentes o módulos React donde se justifiquen. | Frontend + WordPress/backend |
| P0 | Identificar el registro maestro de productos y cómo se actualiza desde Carga General. ¿Quién aprueba precios y disponibilidad? | Comercial + WordPress/backend |
| P0 | Definir la correspondencia modelo → producto, acabado → variante, SKU → ID comercial. | WordPress/backend + frontend |
| P0 | Acordar cómo se agrega al carrito real y cómo se mantiene su sesión hasta el checkout actual. | WordPress/backend |
| P1 | Confirmar búsqueda por nombre y SKU, filtros de categoría/ambiente y comportamiento de categorías sin productos. | Frontend + WordPress/backend |
| P1 | Entregar galería ordenada por producto/acabado; definir quién mantiene portadas, fotos de medidas y textos alternativos. | Contenidos + frontend |
| P1 | Conservar enlaces de categorías y productos existentes; acordar redirecciones solo si cambian. Las rutas con `#` son del prototipo. | WordPress/backend + frontend |
| P1 | Definir staging, repositorio compartido, forma de entrega del diseño, revisión y responsable de publicación. | Coordinación + desarrollo |

**Datos mínimos a intercambiar:** ID del producto y de la variante cuando aplique, SKU, nombre, categoría, ambiente, atributos/acabados, precio público y tratamiento de impuestos, disponibilidad, medidas, galería ordenada y URL permanente. Backend debe indicar qué existe y qué falta; no se propone crear otra base de productos.

**Discrepancia documental a resolver:** documentos anteriores de `plan/` y `docs/` indican que Cotizaciones alimenta el precio público. La instrucción vigente del proyecto y el README local establecen **Carga General para precios y Cotizaciones solo como información**. Debe actualizarse la documentación compartida y comprobarse qué regla usa hoy WordPress. No se debe implementar la regla antigua por arrastre.

## 6. Próximo incremento propuesto

Integrar primero **Aparadores en staging**, usando un producto con precio confirmado para probar la compra y uno con acabados para validar la galería y el mapeo de variantes. Si este último no tiene datos comerciales aprobados, se prueba solo la consulta; la compra por variante requiere un registro confirmado.

Se considera validado cuando:

- La categoría se encuentra directamente y la vista rápida funciona en móvil y escritorio.
- Fotos, acabado, medidas y precio corresponden al mismo artículo.
- Un producto comprable llega al carrito real y al checkout de prueba con la cantidad y el precio correctos.
- Se conserva el funcionamiento comercial existente y se documentan las diferencias pendientes.

Después se extiende el patrón al resto del catálogo y se conecta el showroom. La fecha de entrega se acuerda tras revisar el WordPress existente; este informe no fija un plazo sin esa revisión.

## 7. Acuerdos para completar antes de cerrar la reunión

| Acuerdo | Responsable nominal | Fecha / evidencia |
|---|---|---|
| URL de staging y demostración del catálogo existente | Por asignar | Por acordar |
| Estrategia de adaptación del nuevo diseño | Por asignar | Por acordar |
| Fuente de precios y responsable de aprobación | Por asignar | Por acordar |
| Producto y variante elegidos para la primera integración | Por asignar | Por acordar |
| Repositorio/carpeta común y canal para registrar decisiones | Por asignar | Por acordar |
| Próxima revisión conjunta | Por asignar | Por acordar |

**Base del informe:** instrucciones vigentes del proyecto, revisión del prototipo local y su `web/README.md`, y contraste con la documentación histórica de `plan/` y `docs/`. La instalación WordPress del otro equipo no ha sido auditada en esta revisión.
