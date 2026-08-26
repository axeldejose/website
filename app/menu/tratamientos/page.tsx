import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/data/services";
import { CategoriaCarta } from "@/components/CategoriaCarta";
import { ContactoAside } from "@/components/ContactoAside";

export const metadata: Metadata = {
  title: "Tratamientos",
};

const tratamientos = CATEGORIES.find((category) => category.slug === "tratamientos")!;

export default function TratamientosPage() {
  return (
    <>
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <Link
          href="/menu"
          className="inline-block text-xs uppercase tracking-widest text-casa transition-colors duration-150 hover:text-dune-deep"
        >
          ← Mis servicios
        </Link>

        <h1 className="mt-4 font-display text-4xl text-tierra sm:text-5xl">
          Tratamientos
        </h1>

        <p className="mt-3 max-w-prose text-sm text-casa">
          Cuando tu melena necesita recuperarse, estos son los tratamientos
          con los que trabajo.
        </p>

        <ContactoAside />
      </aside>

      <div className="pb-28 lg:pb-0">
        <div className="mt-10 flex flex-col gap-14 lg:mt-0 lg:gap-16">
          <CategoriaCarta category={tratamientos} />

          <p className="border-t border-clay pt-6 text-sm text-casa">
            Precios en pesos mexicanos. Sujetos a cambio sin previo aviso.
          </p>
        </div>
      </div>
    </>
  );
}
