import Image from "next/image";
import { waLink } from "@/lib/site";

export default function MenuLayout({ children }: LayoutProps<"/menu">) {
  return (
    <>
      {/* Fondo fijo con foto + oscurecimiento, mismo lenguaje que la landing.
          Las cajas de cristal de cada fila quedan sobre esta imagen. */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/back-servicios.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-black/70" />
      </div>

      <div className="mx-auto min-h-dvh min-w-0 max-w-6xl px-6 pt-8 pb-4 lg:grid lg:grid-cols-[19rem_1fr] lg:gap-16 lg:px-8 lg:pt-16">
        {children}
      </div>

      {/* Barra fija de WhatsApp (móvil). */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-white/20 bg-black/40 backdrop-blur-lg lg:hidden">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <a
            href={waLink("Hola Axel, vi tus servicios y quiero agendar una cita.")}
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
