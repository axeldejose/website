import Image from "next/image";
import type { Service } from "@/data/services";
import { mxn } from "@/data/services";
import { waLink } from "@/lib/site";

// LAS FOTOGRAFÍAS, una por tratamiento. El mapa es explícito y no una plantilla
// `/${slug}.png` a propósito: si mañana se agrega un tratamiento al catálogo sin
// su foto, aquí queda `undefined` y la ventana se pinta sin imagen -- con un
// 404 silencioso en el navegador, en cambio, se vería el hueco roto.
//
// Los textos alternativos describen lo que se ve. No son copy de marca: son el
// contenido de la imagen para quien no puede verla, y la fotografía es la que
// comunica el carácter de salud de cada tratamiento, así que dejarlos vacíos
// habría borrado justo eso.
const FOTOS: Record<string, { src: string; alt: string }> = {
  antishock: {
    src: "/antishock.png",
    alt: "Manos enguantadas revisando un mechón rubio, separándolo del resto de la melena",
  },
  hidratante: {
    src: "/hidratante.png",
    alt: "Melena castaña con reflejos sostenida sobre el lavabo durante el tratamiento",
  },
  reestructuracion: {
    src: "/reestructuracion.png",
    alt: "Melena larga y ondulada con reflejos rubios, vista de espalda",
  },
  "sellado-de-color": {
    src: "/sellado-de-color.png",
    alt: "Clienta sentada con la melena castaña luminosa después del sellado",
  },
  ampolletas: {
    src: "/ampolletas.png",
    alt: "Aplicación de una ampolleta con pincel sobre el cuero cabelludo",
  },
};

type VentanaTratamientoProps = {
  service: Service;
  // Cruza la fotografía al otro lado en escritorio. Solo tiene efecto desde lg:
  // en móvil las cinco ventanas apilan foto arriba y texto abajo, siempre igual.
  invertido?: boolean;
  // Solo la primera ventana. Su fotografía entra en el primer viewport, así que
  // se precarga; las otras cuatro se quedan en carga diferida.
  prioridad?: boolean;
};

export function VentanaTratamiento({
  service,
  invertido = false,
  prioridad = false,
}: VentanaTratamientoProps) {
  const foto = FOTOS[service.slug];
  // Los cinco tratamientos son de precio fijo (min === max), pero el rango se
  // resuelve igual: el día que un tratamiento deje de serlo, la ventana ya lo
  // sabe pintar. Ningún número se escribe aquí -- todos salen de data/services.
  const precio =
    service.min === service.max
      ? mxn(service.min)
      : `${mxn(service.min)} – ${mxn(service.max)}`;

  return (
    // LA VENTANA DE VIDRIO. Material, contorno y sombra viven en globals.css
    // (.trat-ventana), porque son degradados y mezclas de color que no se
    // pueden escribir con utilidades y porque así ningún hex entra al JSX.
    <article className="trat-ventana">
      {/* En móvil, una columna: la fotografía ocupa el ancho completo de la
          ventana y el texto va debajo. Desde lg se parte en dos mitades de
          altura pareja y la foto cambia de lado según `invertido`.

          items-stretch (por omisión en grid) es lo que le da a la fotografía la
          altura de la columna de texto en escritorio: sin él, la imagen se
          quedaría en su propia caja y la ventana abriría un hueco de vidrio
          debajo. */}
      <div className="lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <div
          className={`relative aspect-[4/5] w-full min-[560px]:aspect-[3/2] lg:aspect-auto lg:min-h-[24rem] ${
            invertido ? "lg:order-2" : ""
          }`}
        >
          {foto && (
            // LA FOTOGRAFÍA MANDA EN LA VENTANA. En móvil es un 4:5 a ancho
            // completo -- alta, no una miniatura al costado del texto -- porque
            // es lo que comunica el carácter de salud. Entre 560px y lg pasa a
            // 3:2 para no empujar el texto fuera de la pantalla, y en lg ocupa
            // su mitad de alto completo.
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              priority={prioridad}
              sizes="(min-width: 1024px) 24rem, (min-width: 768px) 44rem, 100vw"
              className="object-cover"
            />
          )}
          {/* Fundido finísimo en el canto donde la foto se encuentra con el
              vidrio, para que no haya un corte duro entre los dos materiales.
              En móvil cae abajo; en escritorio, al costado que toca el texto.

              El cambio de dirección lo hace globals.css con su propia consulta
              de medios y NO un `lg:` de Tailwind: el prefijo de variante solo
              funciona sobre utilidades que Tailwind conoce, y estas son reglas
              propias. Aquí se declaran las dos clases siempre; la de costado
              solo tiene efecto a partir de 1024px. */}
          <span
            aria-hidden="true"
            className={`trat-foto-canto pointer-events-none absolute inset-0 ${
              invertido ? "trat-foto-canto-izq" : "trat-foto-canto-der"
            }`}
          />
        </div>

        <div className="flex flex-col justify-center px-6 pt-7 pb-8 sm:px-8 lg:px-9 lg:py-11">
          <h2 className="font-display text-[1.875rem] leading-tight tracking-tight text-tierra sm:text-[2.125rem]">
            {service.name}
          </h2>

          {/* El precio en dune-deep: es el único acento cálido del bloque de
              texto, así que la cifra se separa del nombre sin necesidad de más
              tamaño. Medido sobre el vidrio claro da 5.9:1, por encima del
              mínimo AA de 4.5 para texto chico. */}
          <p className="mt-2.5 text-[1.0625rem] font-medium tracking-tight text-dune-deep">
            {precio}
          </p>

          <p className="mt-4 max-w-prose text-sm leading-relaxed text-casa">
            {service.copy}
          </p>

          {service.note && (
            <p className="mt-2 text-xs uppercase tracking-wide text-casa">
              {service.note}
            </p>
          )}

          {/* EL ACCESO A WHATSAPP DE LA VENTANA. Discreto y idéntico en las
              cinco: pastilla de contorno, no de relleno. El único relleno
              saturado de la página es el CTA del cierre, y que sea el único es
              lo que lo vuelve el punto focal; cinco pastillas sólidas repartidas
              por la página se lo comerían.

              min-h-11 da los 44px de alto de toque. El mensaje prellenado es el
              que manda CLAUDE.md: "Hola Axel, me interesa {servicio}." */}
          <a
            href={waLink(`Hola Axel, me interesa ${service.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="trat-pastilla mt-6 inline-flex min-h-11 items-center gap-1.5 self-start rounded-full px-5 py-3 text-[0.8125rem] uppercase tracking-[0.18em] text-dune-deep"
          >
            Habla conmigo
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}
