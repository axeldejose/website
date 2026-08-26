import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/data/services";
import { CategoriaCarta } from "@/components/CategoriaCarta";
import { GuiaLargos } from "@/components/GuiaLargos";

export const metadata: Metadata = {
  title: "Mis servicios",
};

const color = CATEGORIES.find((category) => category.slug === "color")!;

export default function ServiciosPage() {
  return (
    <>
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <Link
          href="/"
          className="inline-block text-xs uppercase tracking-widest text-casa transition-colors duration-150 hover:text-dune-deep"
        >
          ← Axel De José
        </Link>

        <h1 className="mt-4 font-display text-4xl text-tierra sm:text-5xl">
          Mis servicios
        </h1>

        <p className="mt-3 max-w-prose text-sm text-casa">
          Aquí está todo lo que puedo hacer por tu melena. Cuéntame qué
          buscas y lo vemos juntos.
        </p>

        <div className="mt-6">
          <GuiaLargos />
        </div>
      </aside>

      <div className="pb-28 lg:pb-0">
        <div className="mt-10 flex flex-col gap-14 lg:mt-0 lg:gap-16">
          <CategoriaCarta category={color} />

          <Link
            href="/menu/tratamientos"
            className="flex min-h-11 items-center justify-between rounded-lg border border-clay bg-shell-lift/40 px-5 py-3 text-sm uppercase tracking-widest text-tierra transition-colors duration-150 hover:border-dune"
          >
            Ver tratamientos
            <span aria-hidden="true" className="text-dune">
              →
            </span>
          </Link>

          <p className="border-t border-clay pt-6 text-sm text-casa">
            Precios en pesos mexicanos. En color son estimados: el precio
            final lo confirmamos juntos, según cómo esté tu cabello.
            Sujetos a cambio sin previo aviso.
          </p>
        </div>
      </div>
    </>
  );
}
