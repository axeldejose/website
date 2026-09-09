import Link from "next/link";
import { site, waLink } from "@/lib/site";

// EL CIERRE DE /menu/tratamientos, en tres tiempos y de más aire a más acción.
//
// No reusa el pie de /menu y no podía: aquel es una lámina oscura flotante
// (bg-tierra/34 amplificando el fondo con backdrop-brightness) rematada por una
// franja dune sólida. Aquí sería el único elemento oscuro de la pantalla y
// rompería lo que la página entera sostiene.
//
//   1. La firma editorial. Texto suelto sobre el fondo, sin superficie.
//   2. La ventana de cierre, en el mismo vidrio claro de los cinco
//      tratamientos, para que el final se lea como parte del sistema y no como
//      un pie pegado al último bloque.
//   3. La barra fija de móvil, rematerializada en claro (vive en la página, no
//      aquí, porque va fija al viewport y no al flujo de esta pieza).
export function CierreTratamientos() {
  return (
    <>
      {/* ─── 1. LA FIRMA ─────────────────────────────────────────────────────
          Dos voces, una oración cada una, sin contenedor ni contorno. Es el
          mismo mecanismo que cierra /menu, invertido en tono: allá crema sobre
          oscuro, aquí tinta sobre claro.

          La primera línea va en la tipografía de cuerpo (Jost), a 15px y en
          `casa`, que es el tono de apoyo de la paleta. La segunda en la display
          serif en cursiva, a 26px y en `tierra`, el tono más oscuro que hay.
          El salto es de 1.73 veces el cuerpo más el cambio de familia, de
          estilo y de tono: por eso la segunda domina y la primera se lee como
          su entrada.

          Interlineado ajustado en las dos y sin margen entre ellas, para que se
          lean como una frase partida y no como dos elementos. Un solo <p> con
          dos bloques: la unidad semántica es la frase completa.

          El aire por arriba (mt-24, 96px) es el hueco más grande de la página.
          Es lo que despega la firma de la última ventana. */}
      <p className="mt-24 text-center">
        <span className="block text-[0.9375rem] leading-tight text-casa">
          Tu cabello me dice qué necesita.
        </span>
        <span className="block font-display text-[1.625rem] italic leading-tight tracking-[-0.02em] text-tierra">
          Yo solo lo entiendo.
        </span>
      </p>

      {/* ─── 2. LA VENTANA DE CIERRE ───────────────────────────────────────
          Mismo material que las cinco ventanas de tratamiento (.trat-ventana),
          en una sola pieza ancha. */}
      <div className="trat-ventana mt-12">
        <div className="px-6 py-8 sm:px-8 lg:px-9 lg:py-10">
          <p className="font-display text-[1.375rem] leading-snug tracking-tight text-tierra">
            El tuyo lo definimos hablando.
          </p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-casa">
            Cuéntame cómo sientes tu melena hoy y te digo con cuál empezaría.
          </p>

          {/* LA ACCIÓN PRINCIPAL, y el único relleno saturado de toda la
              página. Sobre tanto claro no necesita tamaño para dominar: le
              basta con ser lo único sólido. Crema sobre dune-deep mide 6.07:1.

              A ancho completo en móvil y ajustada al contenido desde sm, para
              que en escritorio no se estire hasta parecer una franja.

              EL CUERPO BAJA A 12px EN MÓVIL y no es una preferencia: el rótulo
              son 22 caracteres en versalita espaciada, y a 14px con 0.18em de
              interletrado mide 249px contra los 216 que deja la ventana a 360
              de viewport (360 menos los dos rellenos de 24 de la página y los
              dos de 24 de la ventana, menos los 48 de la pastilla). Se partía
              en dos renglones con la flecha descolgada al canto. A 12px con
              0.16em mide 205 y entra con 11px de sobra en el ancho más justo
              del piso de calidad.

              Y va sin flecha: en la pastilla sólida no dice nada que no diga ya
              el relleno saturado, y era justo lo que empujaba el renglón. Las
              pastillas de contorno sí la conservan, ahí sí distingue. */}
          <a
            href={waLink(
              "Hola Axel, vi tus tratamientos y quiero agendar una cita.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex min-h-12 w-full items-center justify-center rounded-full bg-dune-deep px-6 py-3.5 text-xs uppercase tracking-[0.16em] text-shell-lift transition-colors duration-150 hover:bg-dune sm:w-auto sm:self-start sm:px-7 sm:text-sm sm:tracking-[0.18em]"
          >
            Escríbeme por WhatsApp
          </a>

          {/* Regla fina y, debajo, el regreso: subordinado a la conversión, no
              compitiendo con ella. clay solo como línea, nunca como tinta. */}
          <div aria-hidden="true" className="mt-8 h-px w-full bg-clay/35" />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-4">
            <Link
              href="/menu"
              className="inline-flex min-h-11 items-center gap-2 text-[0.8125rem] text-casa transition-colors duration-150 hover:text-tierra"
            >
              <span
                aria-hidden="true"
                className="inline-block animate-[back-nudge_1.8s_ease-in-out_infinite]"
              >
                ←
              </span>
              Volver a la carta de color
            </Link>

            <p className="text-[11px] uppercase tracking-[0.25em] text-casa">
              {site.location}
            </p>
          </div>

          <p className="mt-6 text-[0.8125rem] leading-[1.35] text-casa">
            Precios en pesos mexicanos.
            <br />
            Sujetos a cambios sin previo aviso.
          </p>
        </div>
      </div>
    </>
  );
}
