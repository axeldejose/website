import { waLink } from "@/lib/site";

export function ContactoAside() {
  return (
    <div className="mt-10 hidden lg:block">
      <p className="text-sm text-casa">
        ¿Tienes dudas sobre qué te queda mejor?
      </p>

      <a
        href={waLink("Hola Axel, tengo una duda sobre tus servicios.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex min-h-11 items-center justify-between rounded-lg bg-dune-deep px-5 py-3 text-sm uppercase tracking-widest text-shell transition-colors duration-150 hover:bg-dune"
      >
        Escríbeme por WhatsApp
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
