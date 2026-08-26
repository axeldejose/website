import { waLink } from "@/lib/site";

export default function MenuLayout({ children }: LayoutProps<"/menu">) {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-4 sm:px-6 lg:grid lg:grid-cols-[19rem_1fr] lg:gap-16 lg:px-8 lg:pt-16">
        {children}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-clay bg-shell/90 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <a
            href={waLink("Hola Axel, vi tus servicios y quiero agendar una cita.")}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg bg-dune-deep px-4 py-3 text-center text-sm uppercase tracking-widest text-shell transition-colors duration-150 hover:bg-dune"
          >
            Escríbeme por WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
