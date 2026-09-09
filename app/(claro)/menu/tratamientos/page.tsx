import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/data/services";
import { VentanaTratamiento } from "@/components/tratamientos/VentanaTratamiento";
import { ContactoAsideClaro } from "@/components/tratamientos/ContactoAsideClaro";
import { CierreTratamientos } from "@/components/tratamientos/CierreTratamientos";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tratamientos",
};

// El contenido sale de data/services.ts, la única fuente de verdad: la
// categoría "tratamientos", que es todo lo que no es color (color vive en
// /menu). Ningún precio ni ningún nombre se escribe en esta página.
const tratamientos = CATEGORIES.find(
  (category) => category.slug === "tratamientos",
)!;

export default function TratamientosPage() {
  return (
    <>
      {/* ─── EL ENCABEZADO ─────────────────────────────────────────────────
          Mismo lenguaje tipográfico que /menu -- kicker en versalita espaciada,
          titular en la display serif, bajada en la de cuerpo -- en tonos
          oscuros sobre fondo claro. */}
      <aside className="lg:sticky lg:top-16 lg:self-start">
        <p className="text-[11px] uppercase tracking-[0.25em] text-casa">
          Salud capilar
        </p>

        {/* EL BOTÓN DE REGRESO VA EN LA COMPOSICIÓN, no suelto en una esquina:
            comparte fila con el titular y se alinea con su línea base, así que
            se lee como la primera pieza del lockup y no como un control
            flotando aparte.

            items-end y no items-center: centrado verticalmente, el círculo
            quedaba a media altura de una caja de línea mucho más alta que él y
            se veía descolgado del titular.

            EL TAMAÑO DEL TITULAR LO FIJA EL ANCHO DISPONIBLE, no el gusto.
            "Tratamientos" es una palabra larga que no puede envolver, y ahora
            además comparte fila con el botón (44px más el gap de 12). Medido
            contra la columna útil: 312px a 360 de viewport, 342 a 390, y 304 en
            el panel de escritorio, que es el más estrecho de los tres. De ahí
            que en lg vuelva a bajar. */}
        <div className="mt-3 flex items-end gap-3">
          <Link
            href="/menu"
            aria-label="Atrás"
            className="trat-pastilla mb-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-dune-deep"
          >
            <span
              aria-hidden="true"
              className="inline-block text-lg leading-none animate-[back-nudge_1.8s_ease-in-out_infinite]"
            >
              ←
            </span>
          </Link>

          <h1 className="min-w-0 font-display text-[2.25rem] leading-none tracking-tight text-tierra min-[400px]:text-[2.6rem] sm:text-[3.25rem] lg:text-[2rem]">
            Tratamientos
          </h1>
        </div>

        <p className="mt-6 max-w-prose text-sm leading-relaxed text-casa">
          Cuando tu melena necesita recuperarse, estos son los tratamientos con
          los que trabajo.
        </p>

        {/* LA NOTA DE PRECIO ÚNICO, subida al encabezado. Antes era el `intro`
            de la categoría y se pintaba dentro del bloque de la lista, a media
            página: ahí llegaba como una aclaración tardía, después de que la
            clienta ya había visto el primer precio. Aquí enmarca los cinco
            tratamientos antes de que vea ninguno.

            Va en la display serif en cursiva y no en la de cuerpo: es el mismo
            recurso con el que el sitio marca una voz aparte -- la nota de rango
            de /menu usa exactamente este par -- y a la vez la despega de la
            bajada que tiene encima, que es texto corrido normal.

            El texto sale de data/services.ts (category.intro), no se escribe
            aquí. */}
        {tratamientos.intro && (
          <p className="mt-5 font-display text-[1.0625rem] italic leading-snug text-dune-deep">
            {tratamientos.intro}
          </p>
        )}

        <div aria-hidden="true" className="mt-7 h-px w-20 bg-clay/45" />

        <ContactoAsideClaro />
      </aside>

      {/* ─── LAS CINCO VENTANAS ────────────────────────────────────────────
          Mucho aire entre ellas (56px en móvil, 80 en escritorio) y respiro
          alrededor: la página se lee como una sucesión de piezas espaciadas, no
          como una lista compacta. La prioridad es la calma, no la densidad.

          pb-32 en móvil deja pasar la barra fija de WhatsApp sin que tape el
          final del cierre. En lg no hay barra, así que no hay nada que dejar
          pasar. */}
      <div className="mt-14 pb-32 lg:mt-0 lg:pb-8">
        <div className="flex flex-col gap-14 lg:gap-20">
          {tratamientos.services.map((service, index) => (
            <VentanaTratamiento
              key={service.slug}
              service={service}
              // La foto alterna de lado en escritorio: impares a la derecha.
              invertido={index % 2 === 1}
              prioridad={index === 0}
            />
          ))}
        </div>

        <CierreTratamientos />
      </div>

      {/* ─── LA BARRA FIJA DE MÓVIL ────────────────────────────────────────
          Mismo comportamiento que tenía esta pantalla -- fija al pie, solo en
          móvil, mismo destino y mismo mensaje prellenado -- con el material
          rematerializado en claro: el vidrio blanco de .trat-barra en vez del
          bg-black/40 de antes, y la pastilla dune-deep dentro.

          Se conserva y no se quita porque la conversión es el objetivo único
          del sitio: dejar el CTA siempre alcanzable en móvil pesa más que la
          limpieza de no tener barra. Lo que cambió es de qué está hecha.

          pb-[env(safe-area-inset-bottom)] respeta el indicador de gesto de los
          teléfonos sin botón físico; el layout raíz ya declara viewportFit:
          "cover", así que la variable trae valor. */}
      <div className="trat-barra fixed inset-x-0 bottom-0 z-10 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <a
            href={waLink(
              "Hola Axel, vi tus tratamientos y quiero agendar una cita.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center rounded-full bg-dune-deep px-4 py-3 text-center text-sm uppercase tracking-[0.18em] text-shell-lift transition-colors duration-150 hover:bg-dune"
          >
            Escríbeme por WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
