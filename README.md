# Masiva Home

Rediseño de la experiencia web y catálogo de Masiva Home, empresa peruana de muebles. Incluye inicio minimalista, catálogo por categorías, vista rápida con galerías/acabados, carrito local y showroom 3D.

## Ejecutar la web local

Requiere Node.js 20+ y npm. Las comprobaciones visuales requieren Google Chrome instalado.

```sh
cd web
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

## Organización

- [`web/`](web/): código React + TypeScript + Vite, fotografías y videos locales, pruebas y documentación de implementación.
- [`docs/Informe-Masiva-Home-2026-11-13.md`](docs/Informe-Masiva-Home-2026-11-13.md): informe para alinear diseño, WordPress/backend y lenguaje del equipo.
- [`web/README.md`](web/README.md): funciones implementadas, fuentes de datos, comprobaciones y límites actuales.
- `docs/` y `plan/`: especificaciones y decisiones históricas. Sus supuestos deben contrastarse con las instrucciones vigentes y el informe de alineamiento.

## Estado de integración

Esta entrega es un prototipo funcional local. Todavía no está integrado en WordPress/WooCommerce ni crea pedidos o cobra pagos. El siguiente paso es adaptar el diseño al catálogo WordPress existente, conservar sus datos y conectar el carrito y checkout reales.

Los precios públicos de esta entrega provienen de **Carga General**. **Cotizaciones** se utiliza como información y no alimenta los precios públicos. Esta regla sustituye las referencias antiguas que indiquen lo contrario en `docs/` o `plan/`. Los productos sin precio confirmado permiten consulta desde el catálogo.

El video actual de portada es `web/assets/videos/modern-template.mp4`, con audio silenciado. El archivo original pesa aproximadamente 17 MB; su optimización para publicación sigue pendiente.

No se versionan dependencias instaladas, compilaciones, capturas de prueba, respaldos ni archivos de configuración privados.
