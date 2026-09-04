import { waLink } from "@/lib/site";

export function ContactoAside() {
  return (
    <div className="mt-10 hidden lg:block">
      <p className="text-sm text-shell-lift/80">
        ¿Tienes dudas sobre qué te queda mejor?
      </p>

      <a
        href={waLink("Hola Axel, tengo una duda sobre tus servicios.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex min-h-11 items-center justify-between rounded-lg border border-white/25 bg-white/10 px-5 py-3 text-sm uppercase tracking-widest text-shell-lift backdrop-blur-sm transition-colors duration-150 hover:bg-white/20"
      >
        Escríbeme por WhatsApp
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
