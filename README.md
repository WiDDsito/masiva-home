# Masiva Home

Tienda de muebles con catálogo React, showroom 3D e integración con la Store API de WooCommerce. El catálogo comercial, las variantes y el carrito usan datos de WooCommerce. La selección local para consultas por WhatsApp tiene sus propios artículos y subtotal.

## Desarrollo local

Desde la raíz del repositorio, con Node.js 20 o superior y npm, ejecuta estos comandos.

```sh
cd web
npm ci
npm run dev
```

Vite abre el servicio en el puerto 5173. En desarrollo, las consultas a productos se envían mediante proxy a Masiva Home y el simulador de Vite atiende las adiciones al carrito local de pruebas. Los scripts de navegador requieren Chrome. Los comandos disponibles están en [package.json](web/package.json).

## Integración en WordPress

Desde `web/`, ejecuta `npm run build:wordpress` para generar los archivos en `dist/` con rutas de recursos relativas. La instalación de WordPress debe servir la aplicación en el mismo origen que su Store API bajo `/wp-json/wc/store/v1/`. La compilación genera los archivos para integrar en el sitio.

Antes de montar React, el tema o plugin puede exponer `window.MASIVA_FRONT` con `cartUrl`, `checkoutUrl` y `restNonce`. El frontend también reconoce el elemento `mh-frontend-bridge-css`. El carrito usa las cookies de la sesión y guarda en memoria el nonce que devuelve la Store API. La ruta acordada cuando el puente omite el carrito figura en el [plan de integración](plan/arquitectura-y-compra.md).

## Documentación

| Ubicación | Qué contiene |
|---|---|
| [Código web](web/src/) | Vistas en `blocks/`, componentes en `components/`, catálogo y variantes en `content/`, carrito e integración en `lib/`. |
| [Actualizaciones](docs/actualizaciones.md) | Cambios nuevos ordenados por fecha. |
| [Plan](plan/arquitectura-y-compra.md) | Decisiones de arquitectura, diseño y flujo de compra que deben conservarse al evolucionar la tienda. |
| [Guía del frontend](web/GUIA-FRONTEND.md) | Punto de entrada para trabajar dentro de `web/`. |
| [Prototipo web de noviembre de 2026](docs/web-prototipo.md) | Entorno local, fuentes de precios, componentes y requisitos comerciales del prototipo. |
| [Interacciones y showroom del 12 de noviembre de 2026](docs/web-interacciones-2026-11-12.md) | Interacciones de producto, animaciones, showroom y familias de muebles. |
| [Catálogo y navegación del 13 de noviembre de 2026](docs/web-navegacion-2026-11-13.md) | Menús, búsqueda, transiciones, bolsa local y revisión de usabilidad. |
| [Mejoras del 16 de noviembre de 2026](docs/web-mejoras-2026-11-16.md) | Mejoras de accesibilidad, movimiento, servicios y nuevos aparadores. |
