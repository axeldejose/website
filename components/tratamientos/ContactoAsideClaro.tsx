import { waLink } from "@/lib/site";

// Duplicado en claro de components/ContactoAside.tsx. El original se quedó
// intacto y lo sigue usando /menu: es el mismo bloque -- pregunta corta más
// CTA a WhatsApp en el panel sticky de escritorio -- pero su material es
// cristal blanco al 25% con contorno claro y texto crema, que sobre este fondo
// luminoso desaparece. Aquí la superficie es vidrio claro y la tinta oscura.
//
// Por qué existe: en escritorio no hay barra fija (CLAUDE.md), así que el panel
// izquierdo tiene que llevar el mismo CTA de WhatsApp que la barra da en móvil.
export function ContactoAsideClaro() {
  return (
    <div className="mt-10 hidden lg:block">
      <p className="text-sm text-casa">¿No sabes cuál necesita tu melena?</p>

      <a
        href={waLink("Hola Axel, tengo una duda sobre tus tratamientos.")}
        target="_blank"
        rel="noopener noreferrer"
        className="trat-pastilla mt-3 flex min-h-11 items-center justify-between rounded-full px-5 py-3 text-[0.8125rem] uppercase tracking-[0.18em] text-dune-deep"
      >
        Escríbeme por WhatsApp
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
