import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/data/services";
import { CategoriaCarta } from "@/components/CategoriaCarta";
import { ContactoAside } from "@/components/ContactoAside";
import { GuiaLargos } from "@/components/GuiaLargos";

export const metadata: Metadata = {
  title: "Mis servicios",
};

const color = CATEGORIES.find((category) => category.slug === "color")!;

export default function ServiciosPage() {
  return (
    <>
      <aside className="lg:sticky lg:top-8 lg:self-start">
        {/* Título a la izquierda, back-link (círculo solo con flecha) a la
            derecha de la misma fila. */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative min-w-0">
            {/* Resplandor suave detrás del título: blob difuminado, cálido
                claro, descentrado. Opacidad baja para no bajar el contraste. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-4 -top-4 h-32 w-52 rounded-[50%] bg-shell-lift/20 blur-3xl"
            />
            <h1 className="relative font-display text-6xl leading-[0.9] tracking-tight text-shell-lift sm:text-7xl">
              Mis <span className="italic">servicios</span>
            </h1>
          </div>

          <Link
            href="/"
            aria-label="Atrás"
            className="inline-flex h-11 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-dune/10 text-shell-lift backdrop-blur-md transition-colors duration-150 hover:bg-dune/20"
          >
            <span
              aria-hidden="true"
              className="inline-block text-lg leading-none animate-[back-nudge_1.8s_ease-in-out_infinite]"
            >
              ←
            </span>
          </Link>
        </div>

        <p className="mt-6 max-w-prose text-sm text-shell-lift/90">
          Aquí encontrarás cada servicio en el que trabajo, explicado con
          calma. Cuéntame qué buscas y lo resolvemos juntos.
        </p>

        {/* Hairline bajo el bloque de título, antes de la primera categoría. */}
        <div aria-hidden="true" className="mt-8 h-px w-20 bg-shell-lift/30" />

        <ContactoAside />
      </aside>

      <div className="pb-28 lg:pb-0">
        <div className="mt-10 flex flex-col gap-14 lg:mt-0 lg:gap-16">
          <CategoriaCarta category={color} />

          <GuiaLargos />

          <Link
            href="/menu/tratamientos"
            className="flex min-h-11 items-center justify-between rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm uppercase tracking-widest text-shell-lift backdrop-blur-sm transition-colors duration-150 hover:bg-white/20"
          >
            Ver tratamientos
            <span aria-hidden="true">→</span>
          </Link>

          <div className="border-t border-white/20 pt-6 text-sm text-shell-lift/90">
            <p>Precios en pesos mexicanos.</p>
            <p>Sujetos a cambios sin previo aviso.</p>
          </div>
        </div>
      </div>
    </>
  );
}
