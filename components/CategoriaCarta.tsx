"use client";

import { useState } from "react";
import type { Category } from "@/data/services";
import { ServiceRow } from "@/components/ServiceRow";
import { FilaEditorial } from "@/components/FilaEditorial";

type CategoriaCartaProps = {
  category: Category;
  // Oculta el nombre de la categoría cuando repetirlo no separa nada (p. ej.
  // una página con una sola categoría cuyo h1 ya lo dice). Subtítulo, kicker y
  // lista se mantienen.
  ocultarTitulo?: boolean;
  // Cambia las tarjetas de cristal por la estructura editorial de dos columnas
  // con regla vertical (FilaEditorial). Solo /menu la pide; /menu/tratamientos
  // sigue con ServiceRow.
  editorial?: boolean;
};

export function CategoriaCarta({
  category,
  ocultarTitulo = false,
  editorial = false,
}: CategoriaCartaProps) {
  // Acordeón exclusivo: un solo servicio abierto a la vez dentro de la
  // categoría. Arranca con el primero abierto.
  const [openSlug, setOpenSlug] = useState<string | null>(
    category.services[0]?.slug ?? null,
  );

  const isColor = category.slug === "color";
  const headingId = `${category.slug}-heading`;

  // Kicker editorial (nota discreta). En las categorías con intro va bajo ella,
  // a mt-4.
  //
  // En Color no hay intro, ni barra de degradado (se movió a GuiaLargos), ni
  // encabezado de sección (se quitó por repetir lo que dice la bajada): el
  // kicker es lo único que hace de puente entre el bloque de encabezado y la
  // carta, así que su espaciado es asimétrico a propósito. En móvil lleva
  // mt-4, que sumado al mt-4 del contenedor de la columna da 32px por arriba
  // contra 16px por abajo: al estar el doble de lejos del encabezado que de la
  // lista, se lee como rótulo de la carta y no como una línea suelta entre dos
  // bloques. En lg no hace falta (lg:mt-0) porque ahí esta columna es
  // independiente y el kicker abre en su borde superior, a la altura del
  // titular del panel.
  const kicker = (
    <p
      className={`${isColor ? "mt-4 lg:mt-0" : "mt-4"} text-[11px] uppercase tracking-[0.25em] text-shell-lift/70`}
    >
      Toca para descubrir cada servicio
    </p>
  );

  return (
    <section
      aria-labelledby={ocultarTitulo ? undefined : headingId}
      aria-label={ocultarTitulo ? category.name : undefined}
    >
      {!ocultarTitulo && (
        <h2
          id={headingId}
          className="text-xl uppercase tracking-widest text-shell-lift"
        >
          {category.name}
        </h2>
      )}

      {isColor && kicker}

      {/* La intro es opcional: Color no la lleva. Con el título oculto el
          subtítulo ocupa el lugar del encabezado, sin margen superior, para
          conservar el mismo espacio bajo el separador. */}
      {category.intro && (
        <p
          className={`${ocultarTitulo ? "" : "mt-4"} text-sm text-shell-lift/90`}
        >
          {category.intro}
        </p>
      )}

      {!isColor && kicker}

      {/* En editorial las filas van contiguas y divide-y pone la regla
          horizontal SOLO entre servicios (no arriba de la primera ni bajo la
          última). El gap-3 de las tarjetas desaparece: con separación entre
          filas la lista dejaría de leerse como un bloque continuo.

          lg:max-w-[32rem] no es una decisión de composición sino de contraste.
          Al quedar el precio alineado al canto derecho del bloque, en 1024-1200
          ese canto cae sobre la mitad visible de la rueda de colorimetría, y sin
          el cristal tintado que antes lo protegía el crema medía 2.46-2.49:1
          contra el mínimo AA de 4.5. El hueco libre más estrecho hasta la rueda
          es de 528px (a 1024). Con el tope en 512px el eje de cifras queda a 20px
          de la rueda ahí, y a 100-536px en el resto de los anchos. */}
      <ul
        className={
          editorial
            ? "mt-4 divide-y divide-shell-lift/15 lg:max-w-[32rem]"
            : "mt-4 flex flex-col gap-3"
        }
      >
        {category.services.map((service, index) => {
          const alternar = () =>
            setOpenSlug((current) =>
              current === service.slug ? null : service.slug,
            );
          return editorial ? (
            <FilaEditorial
              key={service.slug}
              service={service}
              isOpen={openSlug === service.slug}
              onToggle={alternar}
            />
          ) : (
            <ServiceRow
              key={service.slug}
              service={service}
              index={index}
              beige={isColor}
              isOpen={openSlug === service.slug}
              onToggle={alternar}
            />
          );
        })}
      </ul>
    </section>
  );
}
