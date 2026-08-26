import type { Service } from "@/data/services";
import { mxn } from "@/data/services";
import { waLink } from "@/lib/site";

type ServiceRowProps = {
  service: Service;
};

export function ServiceRow({ service }: ServiceRowProps) {
  return (
    <li className="border-t border-clay first:border-t-0">
      <a
        href={waLink(`Hola Axel, me interesa ${service.name}.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Escríbele a Axel por WhatsApp sobre ${service.name}`}
        className="group block px-1 py-4 transition-colors duration-150 hover:bg-shell-lift"
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-display text-base text-tierra">{service.name}</span>

          <span className="text-dune-deep">
            {service.min === service.max
              ? mxn(service.min)
              : `${mxn(service.min)} – ${mxn(service.max)}`}
          </span>
        </div>

        {service.note && (
          <p className="mt-1 text-xs uppercase text-casa">{service.note}</p>
        )}

        <p className="mt-2 max-w-prose text-sm text-casa">{service.copy}</p>

        <span
          aria-hidden="true"
          className="mt-3 block text-xs uppercase tracking-widest text-dune-deep opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          Escríbeme por WhatsApp →
        </span>
      </a>
    </li>
  );
}
