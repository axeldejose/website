# Axel De José — sitio web

Sitio de un hair artist en CDMX. Reemplaza por completo un WordPress (Elementor + JupiterX) que solo funcionaba en móvil.

**Objetivo único de la página:** que alguien llegue desde TikTok o Instagram, entienda cuánto le va a costar su servicio, y abra WhatsApp para agendar. Todo lo que no sirva a eso, no va.

## Stack

- Next.js 16, App Router, TypeScript
- Tailwind CSS v4 (config en CSS con @theme, no tailwind.config.js)
- Sin base de datos, sin CMS, sin auth
- Deploy en Vercel, push a main publica

**No agregar dependencias sin autorización.** Si algo parece necesitar una librería, propónlo antes de instalarlo. Este proyecto debe poder mantenerse dentro de dos años sin arqueología.

## Rutas

- `/` — Landing. Reemplaza a la vieja `/m/`. Nombre, tagline y 4 accesos: carta, WhatsApp, TikTok, Instagram.
- `/menu` — La carta completa. Color y tratamientos como dos secciones de la MISMA página.

### Redirects (obligatorios, en next.config.ts)

- `/m` → `/` — 301 permanente
- `/menu/tratamientos` → `/menu` — 301 permanente

Axel repartió el link de `/m/` en su bio de TikTok. Si se rompe, se rompe su único canal de captación. Estos redirects no son opcionales.

## Datos

`data/services.ts` es la única fuente de verdad de precios. Está tipado y exporta las categorías, el helper de precio por largo y el formateador de MXN.

**Ningún precio se escribe en un componente.** Si un número aparece hardcodeado en JSX, es un bug.

Actualizar precios = editar ese archivo y hacer push. No hay panel de admin y no se va a construir uno.

## El elemento firma: selector de largo

Los servicios de color tienen rango de precio porque dependen del largo del cabello. En el sitio viejo eso vivía en un popup que casi nadie abría, y la clienta se quedaba viendo "$3,100 – $5,900" sin saber cuál le tocaba.

Aquí el selector sube al inicio de `/menu` y **toda la carta se recalcula** al elegir. Cuatro tramos: corto, medio, largo, extra largo.

Reglas:

- Sin largo elegido, los servicios de rango muestran el rango completo, no un precio inventado.
- Los servicios de precio fijo (Retoque, Corte, todos los tratamientos) nunca cambian, sin importar el largo.
- El precio calculado se etiqueta como estimado. Nunca se presenta como cerrado — el precio real se confirma en consulta.
- El estado vive en la página con useState. No hay persistencia ni URL param a menos que se pida explícitamente.

## Diseño

Móvil primero, pero **escritorio no es la versión móvil estirada** — ese fue exactamente el error del sitio anterior.

- Móvil: una columna. Selector arriba, carta debajo, barra fija de WhatsApp al pie.
- Escritorio (breakpoint lg): dos columnas. Panel izquierdo sticky con nombre, contexto y selector de largo. Columna derecha con la carta corriendo. Sin barra fija — ahí el selector siempre está visible.

### Tokens

Viven en `app/globals.css` dentro de @theme. Todo color y tipografía sale de ahí. **Ningún hex suelto en un componente.**

PENDIENTE: los valores actuales son provisionales. Faltan los códigos oficiales de marca y la definición de tipografías. No pulir el diseño visual hasta que el PM los entregue.

### Piso de calidad (no negociable)

- Responsive real de 360px en adelante
- Foco de teclado visible en todo lo interactivo
- prefers-reduced-motion respetado
- Contraste AA mínimo sobre el fondo oscuro
- lang="es-MX" en el html (el sitio viejo declaraba en-US)

## WhatsApp

Único canal de conversión. No hay formularios, no hay calendario, no hay email.

- Formato wa.me con mensaje prellenado, no wa.link acortado
- Cada servicio de la carta enlaza con su propio mensaje: "Hola Axel, quiero agendar {servicio}."
- El número y los mensajes viven en `lib/site.ts`

PENDIENTE: número real de WhatsApp. El placeholder en lib/site.ts no sirve — verificarlo antes de cualquier deploy a producción.

## Copy

La voz de Axel es en primera persona y ya existe en el sitio actual: "Creé este tratamiento…", "Mi objetivo es…". **Conservarla.** No es un salón corporativo, es una persona.

Al escribir copy nuevo: verbos activos, sentence case, sin relleno. Un botón dice exactamente qué pasa al tocarlo.

La ubicación se menciona solo como zona, "Condesa, CDMX". Nunca dirección exacta — ni calle, ni número, en ningún archivo del proyecto.

Sin emojis en el sitio.

## Flujo de trabajo

- Ramas por feature, PR a main
- Antes de cualquier push: `npm run build` tiene que pasar limpio
- Commits en español, imperativo: "agrega selector de largo"
- Vercel genera preview por PR — revisar ahí en móvil real antes de mergear

## Decisiones de negocio y marca

Cualquier decisión sobre precios, servicios, copy de marca, paleta o tipografía se detiene y se pregunta al PM. No se elige por cuenta propia.

## Fuera de alcance

Blog, e-commerce, reservas con calendario, login de clientas, multi-idioma, modo claro. Si se piden, se cotizan aparte.
