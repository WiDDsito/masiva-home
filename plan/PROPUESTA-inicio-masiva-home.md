# Propuesta de inicio — MasivaHome.com

> Versión: 0.4 — 10 de noviembre de 2026.
> Estado: **propuesta pendiente de aprobación**. No se ha escrito código.
> Cambio respecto a 0.3: paleta definitiva (carbón, marfil, greige, nogal y bronce), familia de bronce para claro/oscuro, soporte de ambos modos, tipografía Cormorant Garamond + Manrope y tres líneas de referencia visual. Registro en `REGISTRO-trabajo.md` (E-10).

---

## 1. Qué debe lograr la home

No es un escaparate: es el primer filtro del negocio. Debe conseguir tres cosas, en este orden:

1. **Que se entienda qué vende Masiva Home y por qué es distinto** en menos de cinco segundos: muebles funcionales, fabricados por ellos, con precio directo.
2. **Que el visitante entre a la tienda** con una categoría en mente, no que explore a ciegas.
3. **Que quien no está listo para comprar escriba por WhatsApp** con contexto, en lugar de irse.

Y una cuarta, que es la que se recuerda: **que vea el showroom**.

| Métrica | Objetivo inicial | Cómo se mide |
|---|---|---|
| Clics a tienda desde la home | ≥ 35 % de las sesiones | Analítica (PA-25) |
| Consultas por WhatsApp desde la home | ≥ 3 % de las sesiones | Enlaces con parámetro de origen |
| Rebote en móvil | ≤ 55 % | Analítica |
| LCP móvil | ≤ 2,5 s | RNF-01 |

---

## 2. Punto de partida real

`masivahome.com` es hoy una página "Próximamente" de Hostinger, con tres atributos de marca y enlaces a Falabella y Sodimac. No hay catálogo publicado ni navegación.

Consecuencias:

- **No hay deuda visual que respetar:** el rebrand parte de cero.
- **Hay tres claim verificables:** diseño funcional, fabricación propia, atención personalizada. No se inventan otros.
- **Los marketplaces son parte del negocio**, pero no protagonizan: la web empuja la venta directa.
- **El pago habilitado hoy es transferencia bancaria** según la propia web. La home no promete tarjetas ni cuotas hasta que el checkout lo confirme (PA-07).

---

## 3. Mapa del sitio: cinco páginas

| Página | Ruta | Trabajo | Contenido principal |
|---|---|---|---|
| **Inicio** | `/` | Orientar y derivar | Cinco bloques (sección 5) |
| **Tienda** | `/tienda/` | Vender y filtrar | Catálogo completo, categorías, filtros, búsqueda, ficha de producto |
| **Showroom** | `/showroom/` | Explorar en contexto | Escenario 3D con tres muebles, giro y selección |
| **Servicios** | `/servicios/` | Resolver dudas comerciales | Cómo comprar, entrega y recojo, cotización, garantía, fabricación propia, preguntas frecuentes |
| **Contacto** | `/contacto/` | Hablar con una persona | WhatsApp, teléfono, correo, ciudad, horario, libro de reclamaciones |

**Navegación definida:** `Inicio · Tienda · Showroom · Servicios · Contacto`.

La tienda va segunda: la intención de compra es mayoritaria y conviene que el catálogo esté a un clic del inicio. El showroom va tercero, como diferenciador que invita a explorar después de ver los productos.

No se añaden "Nosotros" ni "Blog" al menú. "Nosotros" vive dentro de Servicios y en el pie; el blog no existe todavía.

---

## 4. Dirección visual

### La idea

Un catálogo de muebles se lee como un plano: medidas, materiales y proporción. La interfaz toma ese lenguaje **una sola vez por bloque**, con **líneas de cota**: reglas finas que muestran la medida real de un mueble destacado. No es adorno: responde la objeción número uno del comprador online —«¿entrará en mi sala?»— y prepara el terreno del showroom.

El resto de la página se mantiene en silencio: fotografía grande, tipografía contenida, espacio en blanco.

### Paleta: carbón, marfil y bronce envejecido

La marca no tiene color propio; la paleta se construye con materiales reales —carbón, marfil, greige, nogal y bronce— para que la fotografía sea la protagonista y la interfaz no compita. Cinco colores base y una familia de acento, nada más.

| Color | Token | Valor | Papel |
|---|---|---|---|
| Charcoal | `charcoal` | `#191817` | Fondos oscuros y texto principal |
| Warm Ivory | `ivory` | `#F5F3EF` | Fondo claro base |
| Greige | `greige` | `#D8D0C4` | Superficies secundarias, separadores |
| Walnut | `walnut` | `#8C6A49` | Detalles y referencia a madera |
| Antique Brass | `brass` | `#B18A50` | Acento, iconos, botón principal |

**Familia de acento (bronce envejecido).** El mismo dorado no funciona en ambos modos: en claro se pierde y en oscuro deslumbra. Se usa una familia, no un valor único:

| Miembro | Valor | Dónde |
|---|---|---|
| Dark Brass | `#765629` | Acento sobre fondos claros cuando se necesita más peso; hover en oscuro |
| Brand Brass | `#B18A50` | Identidad y acento base |
| Light Brass | `#D0AE76` | Acento sobre fondos oscuros |

La identidad se mantiene porque los tres pertenecen a la misma familia cálida; lo que cambia es la luminosidad según el fondo.

**Distribución:** 65 % neutros claros (marfil, greige), 25 % tonos oscuros (carbón), 10 % acentos. El bronce puede ocupar menos del 5 %: es una guía, no una cuota.

### Modo claro y modo oscuro

No son dos diseños: son dos asignaciones de los mismos tokens. Los valores semánticos evitan que cada componente decida su color.

| Rol semántico | Modo claro | Modo oscuro |
|---|---|---|
| `bg` | `ivory` #F5F3EF | `charcoal` #191817 |
| `surface` | `#FFFFFF` | `#232120` |
| `text` | `charcoal` #191817 | `ivory` #F5F3EF |
| `text-muted` | charcoal al 70 % | ivory al 70 % |
| `border` | `greige` #D8D0C4 | `#3A3633` |
| `accent` | `brass` #B18A50 | `light brass` #D0AE76 |
| `accent-hover` | brass + 8 % charcoal | `brass` #B18A50 |
| `state-wood` | `walnut` #8C6A49 | `light brass` #D0AE76 |

Reglas:

- **Botón principal:** fondo `accent`, etiqueta `charcoal` en ambos modos. Nunca texto blanco sobre bronce (2,4:1) ni bronce como texto sobre marfil (2,3:1).
- **Hover:** variación tonal del mismo bronce, no un color nuevo.
- **Navbar:** marfil en claro, carbón en oscuro.
- **Footer:** siempre carbón, en ambos modos.
- **Separadores:** greige en claro; en oscuro, un carbón más claro, nunca greige (rompería la penumbra).
- **Iconografía:** carbón o bronce; nunca dos acentos en el mismo icono.

**Modo por defecto:** la web sigue la preferencia del sistema (`prefers-color-scheme`) y ofrece un botón en la cabecera para cambiarlo manualmente. La elección se recuerda y tiene prioridad sobre el sistema.

**Contraste verificado, no estimado:** marfil sobre carbón ≈13:1; carbón sobre bronce ≈5,4:1; carbón sobre bronce claro ≈8:1; marfil sobre bronce oscuro ≈5,9:1. Si un par falla, se ajusta el token, nunca el requisito (RNF-05).

### Tipografía

El logo usa una serif de alto contraste con aire editorial. La tipografía de la web la acompaña, no compite con ella.

| Rol | Familia | Tratamiento | Por qué |
|---|---|---|---|
| Títulos | **Cormorant Garamond** | 500/600, tamaños grandes, `charcoal` o `ivory` | Serif editorial, atemporal y sofisticada; dialoga con el logo |
| Texto y datos | **Manrope** | 400/500, `text-muted` o `text`, cifras tabulares | Moderna, limpia y excelente en interfaces; sostiene precios y medidas |

- **Cormorant nunca por debajo de 24 px ni en textos largos:** sus trazos finos se pierden en tamaños pequeños. Se usa en titulares, precios destacados y cifras de sección, no en párrafos.
- Manrope asume toda la interfaz: navegación, botones, fichas, formularios y tablas.
- Precios con cifras tabulares y dos decimales; sin truncar.
- Jerarquía por escala y espacio, no por color.
- Sin mayúsculas sostenidas como etiqueta decorativa; la referencia las usa en un cartel, no en navegación.

### Las tres líneas de referencia

| Línea | Qué aporta | Dónde se ve en la home |
|---|---|---|
| **Warm Minimalism** | Interiores cálidos, madera, beige y tonos naturales | Fondo marfil, greige en superficies, nogal en detalles |
| **Editorial Minimalism** | Composiciones limpias, tipografía elegante, fotografía protagonista | Héroe a sangre, títulos serif grandes, mucho aire |
| **Contemporary Luxury** | Equilibrio entre diseño comercial y estética premium | Botón bronce único, precios claros, navegación sobria |

La home no imita una tienda de lujo: vende muebles de melamina con fabricación propia. El lujo se expresa en el cuidado —fotografía, proporción, tipografía— no en el precio ni en el gesto.

### Retícula y ritmo

- 12 columnas, texto a la izquierda, ancho de lectura máximo de 68 caracteres.
- Secciones separadas por aire, no por cajas.
- Alternancia de **imagen a sangre** y **texto contenido**: dos velocidades.
- Un solo movimiento orquestado al cargar el héroe; el resto se revela al entrar en pantalla.

### Movimiento

El movimiento se usa para explicar, no para decorar. Cinco reglas:
1. **Cada bloque aparece una vez**, con 18 px de desplazamiento y curva suave; siempre llega a opacidad completa, sin dejar secciones atenuadas.
2. **El hover responde**: la navegación se pinta de dorado, los botones se elevan 1 px, los iconos crecen un 8 %, las imágenes se acercan un 3–4 % y el bento de servicios se rellena de dorado de izquierda a derecha.
3. **La cota se dibuja** y el héroe hace un zoom de entrada sutil: la medida y la imagen explican lo que son.
4. **El parallax narra**: la imagen del héroe y su contenido se mueven a distinta velocidad al salir, y las imágenes de categorías y showroom se desplazan sutilmente con el scroll.
5. **Nada se mueve solo**: sin bucles, sin contadores, sin animaciones de fondo.

El dorado del hover se adapta al fondo para mantener contraste: bronce oscuro sobre marfil, bronce claro sobre carbón. Con movimiento reducido, todo aparece de inmediato. Al alternar entre claro y oscuro, el layout no cambia: el scrollbar reserva su espacio y los tokens solo modifican color.

**Stack (D-23 y D-24).** GSAP + ScrollTrigger para líneas de tiempo, revelado, parallax y scrollstorytelling; Motion para interacciones de componente (botón magnético); Lenis para el desplazamiento suave; Three.js + React Three Fiber + Drei para el showroom 3D. GSAP, Lenis y el escenario 3D cargan después del primer pintado para no competir con el rendimiento. El héroe se revela con una máscara y el texto sube por líneas.

---

## 5. La home: cinco bloques

| # | Bloque | Trabajo | Contenido | CTA |
|---|---|---|---|---|
| 1 | **Héroe** | Decir qué es y cómo se ve | Foto real de ambiente; titular de dos líneas; una línea de apoyo; los tres claim en una franja fina; cota con la medida de un mueble | Ver tienda · Cotizar por WhatsApp |
| 2 | **Tienda** | Permitir entrar con una intención | Seis categorías con foto en grilla asimétrica; debajo, tres productos con foto, nombre, modelo y precio visible desde el inicio | Ver toda la tienda |
| 3 | **Showroom** | Ser el recuerdo de la marca | Escenario 3D con comedor, centro de mesa y mesa de TV; leyenda de selección | Entrar al showroom |
| 4 | **Servicios** | Resolver cómo se compra | Bento de cuatro bloques: compra en línea; cotización por WhatsApp; entrega, recojo y garantía; instalación y montaje | Ver todos los servicios |
| 5 | **Contacto** | Cerrar con una acción humana | WhatsApp, teléfono, correo, ciudad y horario si existe | Escribir por WhatsApp |

### Por qué cinco y no once

La versión 0.1 tenía once bloques. Se recortó sin perder información: cada bloque eliminado tiene ahora una página donde vive mejor.

| Antes | Ahora |
|---|---|
| Franja de marca separada | Dentro del héroe, como línea fina |
| Categorías y selección separadas | Un solo bloque «Tienda», dos filas |
| Cómo comprar | Página Servicios |
| Fabricación propia | Página Servicios |
| Ambientes | Página Tienda, como filtro por ambiente |
| Antes de comprar (FAQ) | Página Servicios y página Contacto |
| Contacto + pie | Bloque 5 y pie de página |

### Wireframes

**Bloque 1 — héroe**

```
┌──────────────────────────────────────────────────────────────┐
│ MH    Inicio   Tienda   Showroom   Servicios   Contacto   ⌕  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   [ fotografía a sangre: comedor real, luz natural ]         │
│                                                              │
│   Muebles que transforman                                    │
│   tu hogar.                                                  │
│   Diseño funcional, fabricado en Lima.                       │
│   [ Ver tienda ]   Cotizar por WhatsApp                      │
│   ───────────  ───────────  ───────────                      │
│   Fabricación    Diseño       Atención                       │
│   propia         funcional    personalizada                  │
│                                              ├── 220 cm ──┤  │
└──────────────────────────────────────────────────────────────┘
```

**Bloque 2 — tienda**

```
┌───────────────────────────────┬──────────────┬──────────────┐
│                               │   Comedor    │  Dormitorio  │
│        Sala (destacada)       ├──────────────┼──────────────┤
│                               │  Escritorio  │  Almacenaje  │
└───────────────────────────────┴──────────────┴──────────────┘
┌───────────────┬───────────────┬───────────────┐
│ producto      │ producto      │ producto      │
│ modelo · S/000│ modelo · S/000│ modelo · S/000│
└───────────────┴───────────────┴───────────────┘
                          Ver toda la tienda
```

**Bloque 3 — showroom**

```
┌──────────────────────────────────────────────────────────────┐
│        [ escenario 3D · comedor, centro de mesa y mesa de TV ]│
│   [ Comedor ] [ Centro de mesa ] [ Mesa de TV ]   ← leyenda   │
│   Míralo en el espacio antes de comprarlo.                    │
│   [ Ver la tienda ]                                           │
└──────────────────────────────────────────────────────────────┘
```

### Comportamiento móvil

| Bloque | Cambio |
|---|---|
| Héroe | Foto vertical; texto sobre la parte inferior con velo suficiente; CTA a ancho completo; la franja de claim pasa a dos líneas |
| Tienda | Dos columnas de categoría; productos en scroll horizontal de una pieza y media, sin autoplay |
| Showroom | Leyenda de productos de 44 px mínimo |
| Servicios | Tres bloques en vertical |
| Contacto | WhatsApp como botón principal; el resto como enlaces |

---

## 6. Qué no va en la home

- Testimonios, estadísticas o «+500 clientes» sin dato verificable.
- Descuentos o cuotas si no hay campaña aprobada.
- «Envío gratis» mientras las reglas de envío no existan (PA-05).
- Sellos de pago que el checkout no tenga confirmados (PA-07).
- Contenido en inglés o texto de relleno.
- Botón de compra directa: antes debe existir producto y variante elegidos.

---

## 7. Contenido necesario para construirla

| Elemento | Cantidad | Responsable | Estado |
|---|---|---|---|
| Foto de héroe, horizontal y vertical | 1 | Marketing / PA-23 | Pendiente |
| Fotos de categoría | 6 | Marketing / PA-23 | Pendiente |
| Productos con foto, nombre, modelo y precio | 3 | Supervisor / PA-15 | Pendiente |
| Escenario 3D y tres muebles | Implementado | Three.js + R3F + Drei |
| Texto de los tres claim | 3 | Supervisor | Existen, requieren validación |
| Datos de contacto y horario | — | Supervisor | Parcial: teléfono y correo existen |

---

## 8. Implementación local

La home se construye con el stack aprobado (React + TypeScript + Vite), sin WordPress. El código vive en `masiva-home/web/`:

```text
web/
├── index.html
├── src/
│   ├── App.tsx            composición de la página
│   ├── blocks/            un archivo por bloque de la home
│   ├── components/        botón, cota, marco de foto, tarjetas
│   ├── content/demo.ts    datos de demostración, marcados como tales
│   ├── lib/format.ts      formato de moneda
│   └── styles/            tokens, base, componentes y bloques
└── scripts/shots.mjs      capturas de control visual
```

Decisiones de implementación:

- **Tokens en un solo archivo** (`styles/tokens.css`). Ningún bloque escribe un color literal; todos usan roles semánticos, y el modo oscuro solo reasigna esos roles.
- **CSS por capas, no por componente**: los estilos se agrupan en tokens, base, componentes y bloques, con prefijos por bloque para evitar colisiones. Suficiente para una página; se revisará si el proyecto crece.
- **Marcos honestos**: mientras no haya fotografía, `Photo.tsx` dibuja la proporción final con una etiqueta de lo que falta. No se simula una imagen ni se usan fotos de terceros.
- **Contenido de demostración aislado** en `content/demo.ts` y señalizado en el pie. Sustituirlo no obliga a tocar componentes.

Al migrar a WordPress, los bloques editoriales se reproducen en Elementor y la interacción se monta como islas (D-15).

---

## 9. Decisiones aprobadas

| Decisión | Estado |
|---|---|
| Nombre de la sección: **Tienda** | Aprobada |
| Orden de navegación: `Inicio · Tienda · Showroom · Servicios · Contacto` | Aprobada (actualizada 2026-11-11) |
| Productos de la home con foto, nombre, modelo y precio visible desde el inicio | Aprobada |
| Paleta: carbón `#191817`, marfil `#F5F3EF`, greige `#D8D0C4`, nogal `#8C6A49`, bronce `#B18A50` | Aprobada |
| Familia de bronce para claro y oscuro: `#765629`, `#B18A50`, `#D0AE76` | Aprobada |
| Distribución 65 % neutros claros / 25 % oscuros / 10 % acentos | Aprobada como guía |
| Títulos en **Cormorant Garamond**; texto en **Manrope** | Aprobada |
| Soporte de modo claro y oscuro | Aprobada |
| Sustituida la paleta anterior (negro/gris/dorado `#C8971B` e Instrument Serif/Sans) | Reemplazada por D-21 |

## 10. Puntos a validar en pantalla

1. **Modo por defecto.** La web sigue la preferencia del sistema y el botón de la cabecera permite cambiarla. Si se quiere además un acceso en el pie, se añade sin tocar los tokens.
2. **Bronce sobre fotografía.** El botón debe leerse sobre imágenes claras y oscuras. Si en alguna foto el bronce se pierde, se aplica un velo de carbón bajo el texto o se usa el botón sobre fondo sólido; no se cambia el color de marca.
3. **Cormorant en tamaños pequeños.** Se verifica que ningún titular baje de 24 px; si ocurre, ese texto pasa a Manrope.
