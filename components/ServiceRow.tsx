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
        {/*
          Grid en vez de flex: el precio debe quedar fijo junto al nombre
          (fila 1, columna 2) sin robarle ancho a nota/copy, que ocupan las
          dos columnas en las filas siguientes. El auto-placement de grid
          coloca nota/copy en la fila que corresponda aunque no haya nota.
        */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 lg:max-w-[640px]">
          <span className="col-start-1 row-start-1 font-display text-base text-tierra">
            {service.name}
          </span>

          <span className="col-start-2 row-start-1 w-36 shrink-0 whitespace-nowrap text-right text-dune-deep">
            {service.min === service.max
              ? mxn(service.min)
              : `${mxn(service.min)} – ${mxn(service.max)}`}
          </span>

          {service.note && (
            <p className="col-span-2 mt-1 text-xs uppercase text-casa lg:col-span-1">
              {service.note}
            </p>
          )}

          <p className="col-span-2 mt-2 text-sm text-casa lg:col-span-1">
            {service.copy}
          </p>
        </div>

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
