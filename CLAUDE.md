# Axel De José — sitio web

Sitio de un hair artist en CDMX. Reemplaza por completo un WordPress (Elementor + JupiterX) que solo funcionaba en móvil.

**Objetivo único de la página:** que alguien que llega desde TikTok o Instagram sepa qué servicios ofrece Axel, en qué rango de precio se mueven, y le escriba por WhatsApp para definir el suyo. La conversión es la conversación, no el número en pantalla. Todo lo que no sirva a eso, no va.

## Stack

- Next.js 16, App Router, TypeScript
- Tailwind CSS v4 (config en CSS con @theme, no tailwind.config.js)
- Sin base de datos, sin CMS, sin auth
- Deploy en Vercel, push a main publica

**No agregar dependencias sin autorización.** Si algo parece necesitar una librería, propónlo antes de instalarlo. Este proyecto debe poder mantenerse dentro de dos años sin arqueología.

## Rutas

- `/` — Landing. Reemplaza a la vieja `/m/`. Nombre, tagline, tres enlaces (Mis servicios, Tratamientos, Hablemos por WhatsApp) y un nav aparte de redes con TikTok e Instagram como iconos.
- `/menu` — La carta de color.
- `/menu/tratamientos` — Tratamientos. Ruta propia, no una sección de `/menu`.

### Redirects (obligatorios, en next.config.ts)

- `/m` → `/` — 301 permanente

Axel repartió el link de `/m/` en su bio de TikTok. Si se rompe, se rompe su único canal de captación. Este redirect no es opcional.

## Datos

`data/services.ts` es la única fuente de verdad de precios. Está tipado y exporta los tipos, `LENGTHS`, `CATEGORIES` y el formateador `mxn`.

**Ningún precio se escribe en un componente.** Si un número aparece hardcodeado en JSX, es un bug.

Actualizar precios = editar ese archivo y hacer push. No hay panel de admin y no se va a construir uno.

## Precios de color: siempre en rango

Los servicios de color tienen rango de precio porque dependen del largo del cabello, del tipo de cabello y del estado en que llegue la clienta. En el sitio viejo eso vivía en un popup que casi nadie abría, y la clienta se quedaba viendo "$3,100 – $5,900" sin saber qué esperar.

**El sitio no calcula precios.** No hay ni va a haber un cálculo que le diga a la clienta "tu precio es X" — depende de demasiadas variables que solo se evalúan en persona. Los servicios de rango siempre muestran el rango completo (mínimo – máximo). Los de precio fijo (Retoque, Corte, todos los tratamientos) muestran un solo número. El precio final se define en consulta con Axel, nunca en el navegador.

`GuiaLargos` (en `/menu`) es puramente informativo: explica los cuatro tramos (corto, mediano, largo, extra largo) con su referencia anatómica, para que la clienta entienda de qué depende el rango. No es un control — es un Server Component sin estado ni interactividad, no recalcula nada.

## Diseño

Móvil primero, pero **escritorio no es la versión móvil estirada** — ese fue exactamente el error del sitio anterior.

- Móvil: una columna. Carta, `GuiaLargos` después de la lista de color, barra fija de WhatsApp al pie.
- Escritorio (breakpoint lg): dos columnas. Panel izquierdo sticky con back-link, título, bajada y `ContactoAside`. Columna derecha con la carta y `GuiaLargos`. Sin barra fija — el panel izquierdo ya tiene el mismo CTA de WhatsApp vía `ContactoAside`.

### Tokens

Viven en `app/globals.css` dentro de @theme. Todo color y tipografía sale de ahí. **Ningún hex suelto en un componente.**

La paleta de color es definitiva: tierra, shell, dune, dune-deep, verde, clay, casa. `shell-lift` y `dune-deep` son derivados de trabajo (superficies elevadas/hover y rellenos con texto claro encima, respectivamente) — no son colores oficiales de la paleta de marca.

PENDIENTE: las tipografías (Bodoni Moda / Jost, vía next/font/google) siguen siendo provisionales hasta que el PM entregue las definitivas.

### Piso de calidad (no negociable)

- Responsive real de 360px en adelante
- Foco de teclado visible en todo lo interactivo
- prefers-reduced-motion respetado
- Contraste AA mínimo sobre el fondo claro
- lang="es-MX" en el html (el sitio viejo declaraba en-US)

## WhatsApp

Único canal de conversión. No hay formularios, no hay calendario, no hay email.

- Formato wa.me con mensaje prellenado, no wa.link acortado
- Cada servicio de la carta enlaza con su propio mensaje: "Hola Axel, me interesa {servicio}."
- El número y los mensajes viven en `lib/site.ts`

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

Blog, e-commerce, reservas con calendario, login de clientas, multi-idioma, modo oscuro. Si se piden, se cotizan aparte.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
