# Actualizaciones

## 2026-11-27

- El carrito de WooCommerce reutiliza el nonce, limita cada solicitud a 15 segundos y consulta la sesión si el resultado de una modificación es incierto. El carrito y el resumen de compra permiten ajustar cantidades y eliminar líneas.
- El catálogo recorre las páginas de categorías y conserva el mapa mientras la aplicación está abierta. La búsqueda espera 300 ms desde la última pulsación y mantiene las tarjetas visibles mientras actualiza los resultados.
- Las fichas indexan variantes por ID y solicitan hasta dos páginas simultáneas después de la primera. El showroom carga el módulo 3D al entrar su escenario en pantalla.
- La portada solicita el video al montarse. El video inicia silenciado, se pausa fuera de pantalla y respeta la preferencia de movimiento reducido.
- El carrito y el checkout comparten el cálculo del subtotal para consultas por WhatsApp. Se retiraron los componentes de categoría y mobiliario antiguos y el observador de visibilidad que ya no tenía consumidores.
- Se consolidaron las instrucciones de desarrollo en el README y las decisiones de integración en el plan.
- El historial del frontend se recuperó del antiguo README de `web/` y se distribuyó en cuatro documentos. La [guía del frontend](../web/GUIA-FRONTEND.md) y el [índice principal](../README.md#documentación) enlazan todas las entregas.
