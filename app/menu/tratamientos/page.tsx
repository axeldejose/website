import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/data/services";
import { CategoriaCarta } from "@/components/CategoriaCarta";
import { waLink } from "@/lib/site";
import { ContactoAside } from "@/components/ContactoAside";

export const metadata: Metadata = {
  title: "Tratamientos",
};

// La página de tratamientos muestra las categorías que no son "color" (color
// vive en /menu). Hoy es una sola; si se agrega otra al catálogo, el encabezado
// de cada categoría reaparece solo, porque deja de haber una sola.
const categorias = CATEGORIES.filter((category) => category.slug !== "color");
const ocultarTitulo = categorias.length === 1;

export default function TratamientosPage() {
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
            {/* "Tratamientos" es una sola palabra larga que no puede envolver;
                a text-6xl/7xl desbordaba a 360px y se derramaba fuera de la
                columna estrecha de escritorio (304px). Se dimensiona para caber
                en una línea en cada breakpoint: la columna lg es la más
                estrecha, así que ahí vuelve a ~2.5rem. */}
            <h1 className="relative font-display text-[2.4rem] tracking-tight text-shell-lift sm:text-6xl lg:text-[2.4rem]">
              Tratamientos
            </h1>
          </div>

          <Link
            href="/menu"
            aria-label="Atrás"
            className="pastilla-contorno inline-flex h-11 w-14 shrink-0 items-center justify-center rounded-full"
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
          Cuando tu melena necesita recuperarse, estos son los tratamientos con
          los que trabajo.
        </p>

        {/* Hairline bajo el bloque de título, antes de la primera categoría. */}
        <div aria-hidden="true" className="mt-8 h-px w-20 bg-shell-lift/30" />

        <ContactoAside />
      </aside>

      <div className="pb-28 lg:pb-0">
        <div className="mt-10 flex flex-col gap-14 lg:mt-0 lg:gap-16">
          {categorias.map((categoria) => (
            <CategoriaCarta
              key={categoria.slug}
              category={categoria}
              ocultarTitulo={ocultarTitulo}
            />
          ))}

          <div className="border-t border-white/20 pt-6 text-sm text-shell-lift/90">
            <p>Precios en pesos mexicanos.</p>
            <p>Sujetos a cambios sin previo aviso.</p>
          </div>
        </div>
      </div>
      {/* Barra fija de WhatsApp (móvil). Estaba en app/menu/layout.tsx, que
          esta ruta comparte con /menu; se movió aquí SIN CAMBIARLA cuando /menu
          pasó a llevar su botón en flujo, dentro de la pieza del cierre. Para
          esta pantalla nada cambia: mismo marcado, mismas clases, misma
          posición. */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-white/20 bg-black/40 backdrop-blur-lg lg:hidden">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <a
            href={waLink(
              "Hola Axel, vi tus servicios y quiero agendar una cita.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg bg-dune-deep px-4 py-3 text-center text-sm uppercase tracking-widest text-shell-lift transition-colors duration-150 hover:bg-dune"
          >
            Escríbeme por WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
