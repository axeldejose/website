"use client";

import { useState } from "react";
import type { Category } from "@/data/services";
import { ServiceRow } from "@/components/ServiceRow";

type CategoriaCartaProps = {
  category: Category;
  // Oculta el nombre de la categoría cuando repetirlo no separa nada (p. ej.
  // una página con una sola categoría cuyo h1 ya lo dice). Subtítulo, kicker y
  // lista se mantienen.
  ocultarTitulo?: boolean;
};

export function CategoriaCarta({
  category,
  ocultarTitulo = false,
}: CategoriaCartaProps) {
  // Acordeón exclusivo: un solo servicio abierto a la vez dentro de la
  // categoría. Arranca con el primero abierto.
  const [openSlug, setOpenSlug] = useState<string | null>(
    category.services[0]?.slug ?? null,
  );

  const isColor = category.slug === "color";
  const headingId = `${category.slug}-heading`;

  // Kicker editorial (nota discreta): en Color va justo bajo la barra de
  // degradado; en las demás categorías, justo bajo el texto de introducción.
  const kicker = (
    <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-shell-lift/70">
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

      {/* Solo en Color: muestrario de tinte con tonos reales de cabello. */}
      {isColor && (
        <div
          aria-hidden="true"
          className="hair-swatch mt-3 h-2 w-full rounded-full"
        />
      )}

      {isColor && kicker}

      {/* Con el título oculto el subtítulo ocupa el lugar del encabezado: sin
          margen superior, para conservar el mismo espacio bajo el separador. */}
      <p
        className={`${ocultarTitulo ? "" : "mt-4"} text-sm text-shell-lift/90`}
      >
        {category.intro}
      </p>

      {!isColor && kicker}

      <ul className="mt-4 flex flex-col gap-3">
        {category.services.map((service, index) => (
          <ServiceRow
            key={service.slug}
            service={service}
            index={index}
            isOpen={openSlug === service.slug}
            onToggle={() =>
              setOpenSlug((current) =>
                current === service.slug ? null : service.slug,
              )
            }
          />
        ))}
      </ul>
    </section>
  );
}
