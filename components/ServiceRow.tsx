"use client";

import type { Service } from "@/data/services";
import { mxn, RANGE_NOTE } from "@/data/services";
import { waLink } from "@/lib/site";

type ServiceRowProps = {
  service: Service;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  // Tinte beige (clay) en vez del dune oscuro. Solo /menu (color).
  beige?: boolean;
};

// Tonos alternos, variaciones sutiles del mismo tinte cálido para que las cajas
// vecinas no se vean idénticas. Todas conservan el efecto de cristal.
// Beige (clay): opacidades altas pero por debajo del techo donde el texto crema
// dejaría de pasar contraste sobre el fondo oscuro (clay/40 medido: desc 4.77).
const BACKGROUNDS_BEIGE = ["bg-clay/30", "bg-clay/35", "bg-clay/40"];
const BACKGROUNDS_DUNE = ["bg-dune/8", "bg-dune/12", "bg-dune/16"];

export function ServiceRow({
  service,
  index,
  isOpen,
  onToggle,
  beige = false,
}: ServiceRowProps) {
  const backgrounds = beige ? BACKGROUNDS_BEIGE : BACKGROUNDS_DUNE;
  const panelId = `servicio-${service.slug}`;
  const esRango = service.min !== service.max;
  const price = esRango
    ? `${mxn(service.min)} – ${mxn(service.max)}`
    : mxn(service.min);

  return (
    // Cada fila es una caja de cristal independiente (tinte terracota + blur +
    // borde claro), separadas por el gap del <ul>.
    //
    // El contorno no depende del estado: `border border-white/20` en los cuatro
    // costados, abierta o cerrada. Antes el estado abierto añadía
    // `border-l-2 border-l-shell-lift`, una guía de acento en el canto
    // izquierdo: 2px de crema opaca (rgb 242,234,218, luminancia medida 234)
    // contra 1px de blanco al 20% (luminancia 111) del resto de los cantos. Se
    // leía como un trazo luminoso y, además, al pasar el borde de 1px a 2px
    // corría el contenido 1px en cada apertura. El estado abierto ya se
    // distingue por el chevron que gira y por aria-expanded.
    <li
      className={`group relative overflow-hidden rounded-2xl border border-white/20 ${backgrounds[index % backgrounds.length]} backdrop-blur-md`}
    >
      {/* Realce de hover. Va aquí, cubriendo la tarjeta completa, y no en el
          <button>: el <button> ocupa todo el <li> cuando está cerrada pero solo
          la cabecera cuando está abierta, así que su hover:bg-white/5 pintaba
          una banda de 64px con un escalón duro de ~9 puntos de luminancia justo
          en la frontera con el panel. Cerrada se leía como un cambio parejo del
          material; abierta, como una franja de plástico en la parte de arriba.
          Con el realce en el <li> el estado cerrado queda idéntico (el área
          cubierta es la misma) y el abierto se aclara parejo, sin frontera.

          No se puede poner el hover directo en el <li>: ahí ya vive el tinte
          (bg-clay/*), y otro background-color en el mismo elemento lo
          reemplazaría en vez de superponerse. De ahí la capa aparte. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-colors duration-150 group-hover:bg-white/5"
      />
      {/* La fila completa es el control del acordeón: <button> nativo => operable
          con Enter/Space y foco de teclado. aria-expanded refleja el estado. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="relative flex w-full items-center gap-3 px-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
      >
        {/* Colapsado: solo el nombre. Precio y descripción viven en el panel. */}
        <span className="min-w-0 flex-1 break-words font-display text-2xl font-semibold italic tracking-tight text-shell-lift">
          {service.name}
        </span>

        {/* Flecha de acento (crema): apunta abajo colapsada, gira 180° al abrir.
            La transición la neutraliza prefers-reduced-motion. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-7 w-7 shrink-0 text-shell-lift transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!isOpen}
        className="relative animate-[accordion-in_200ms_ease-out] px-4 pb-4"
      >
        <p className="text-lg font-medium text-shell-lift">{price}</p>

        <p className="mt-2 text-sm break-words text-shell-lift/90">
          {service.copy}
        </p>

        {service.note && (
          <p className="mt-1 text-xs break-words uppercase tracking-wide text-shell-lift/90">
            {service.note}
          </p>
        )}

        {/* Acción principal de la tarjeta, con superficie propia. Reusa el
            tratamiento de la barra de WhatsApp del layout -- relleno dune-deep,
            rounded-lg, px-5 py-3, hover a dune -- que es el botón de acción
            principal que ya existe en el sitio y, además, el mismo destino.
            Los otros dos botones (ContactoAside y "Ver tratamientos") van en
            cristal sobre la foto; aquí no servía, porque la tarjeta ya es una
            superficie de cristal y un botón de cristal encima no se despega.

            min-h-11 con py-3 y text-sm da exactamente 44px de alto de toque.
            Posición, texto y comportamiento sin tocar. */}
        <a
          href={waLink(`Hola Axel, me interesa ${service.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-dune-deep px-5 py-3 text-sm uppercase tracking-widest text-shell-lift transition-colors duration-150 hover:bg-dune focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
        >
          Habla conmigo
          <span aria-hidden="true" className="ml-1">↗</span>
        </a>

        {/* Solo en las tarjetas de rango: explica por qué el precio no es una
            cifra cerrada. En las de precio fijo diría algo falso, de ahí la
            condición.

            La jerarquía se construye sin trazos, con tres contrastes:

            1. ESPACIO. mt-8 (32px) contra los 8-12px que separan al resto de
               los bloques del panel. Es el aire, y no una línea, lo que la
               aísla.
            2. ESCALA. 12px contra los 14px de la descripción.
            3. VOZ. Cursiva de la familia display (Bodoni) contra la redonda de
               la body (Jost) del resto del panel. Es el mismo par que usa todo
               el sitio -- Bodoni itálica para los nombres de servicio y el
               titular, Jost para el texto corrido -- así que leerla en la voz
               display la marca como aparte. Y de paso baja el peso óptico: las
               astas finas del Didone a 12px cubren mucha menos tinta que Jost
               a 14px, lo que la hace ver más discreta aun al mismo color.

            El color se queda en /90, igual que la descripción, y no más bajo:
            sobre bg-clay/40 a anchos de escritorio el crema a /80 cae a
            4.00-4.27:1, debajo del mínimo AA de 4.5 para texto chico. Ver el
            reporte. */}
        {esRango && (
          <p className="mt-8 font-display text-xs italic text-shell-lift/90">
            {RANGE_NOTE}
          </p>
        )}
      </div>
    </li>
  );
}
