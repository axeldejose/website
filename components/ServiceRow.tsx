"use client";

import type { Service } from "@/data/services";
import { mxn } from "@/data/services";
import { waLink } from "@/lib/site";

type ServiceRowProps = {
  service: Service;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
};

// Tonos alternos, variaciones sutiles del mismo tinte cálido (dune) para que
// las cajas vecinas no se vean idénticas. Todas conservan el efecto de cristal.
const BACKGROUNDS = ["bg-dune/8", "bg-dune/12", "bg-dune/16"];

export function ServiceRow({ service, index, isOpen, onToggle }: ServiceRowProps) {
  const panelId = `servicio-${service.slug}`;
  const price =
    service.min === service.max
      ? mxn(service.min)
      : `${mxn(service.min)} – ${mxn(service.max)}`;

  return (
    // Cada fila es una caja de cristal independiente (tinte terracota + blur +
    // borde claro), separadas por el gap del <ul>. Al expandirse, una guía
    // vertical de acento (crema) en el borde izquierdo marca la fila activa.
    <li
      className={`relative overflow-hidden rounded-2xl border border-white/20 ${BACKGROUNDS[index % BACKGROUNDS.length]} backdrop-blur-md ${
        isOpen ? "border-l-2 border-l-shell-lift" : ""
      }`}
    >
      {/* Vial de laboratorio, puramente decorativo: trazo fino, sin relleno,
          asomando por la esquina inferior derecha. Va como primer hijo (detrás
          del contenido) y el overflow-hidden del <li> lo recorta, así nunca se
          superpone al nombre, precio, descripción ni al chevron, ni colapsado
          ni expandido. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 48"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="pointer-events-none absolute -bottom-4 -right-3 h-16 w-8 rotate-[25deg] text-clay opacity-20"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 4v24a3 3 0 0 0 6 0V4"
        />
        <path strokeLinecap="round" d="M7 4h10" />
      </svg>

      {/* La fila completa es el control del acordeón: <button> nativo => operable
          con Enter/Space y foco de teclado. aria-expanded refleja el estado. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-150 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
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
        className="animate-[accordion-in_200ms_ease-out] px-4 pb-4"
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

        <a
          href={waLink(`Hola Axel, me interesa ${service.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center text-xs uppercase tracking-widest text-shell-lift transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
        >
          Ver servicio
          <span aria-hidden="true" className="ml-1">↗</span>
        </a>
      </div>
    </li>
  );
}
