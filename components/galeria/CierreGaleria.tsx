import Link from "next/link";
import { site, waLink } from "@/lib/site";

// EL CIERRE DE /galeria. Antes no había ninguno: debajo del carrusel quedaban
// doscientos píxeles de fondo vacío, sin salida y sin llamada a la acción.
//
// Tres tiempos, el mismo lenguaje claro que el cierre de /menu/tratamientos:
//
//   1. Un subtítulo suelto sobre el fondo, con la construcción del titular.
//   2. La ventana de conversión: convierte el gesto de mirar en el de escribir,
//      y lleva la única acción sólida de la página.
//   3. La ventana de referencia: las dos salidas y la ubicación.
//
// LAS CLASES SON PROPIAS DE ESTA RUTA (gal-*) y no las de tratamientos
// (trat-*), aunque el material sea el mismo. Compartirlas habría atado dos
// páginas por una superficie que cada una calibra contra SU fondo: el de
// tratamientos es una fotografía desenfocada y el de aquí un degradado plano,
// así que las densidades de vidrio que funcionan en una no son las de la otra.
export function CierreGaleria() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
      {/* ─── 1. EL SUBTÍTULO ────────────────────────────────────────────────
          Misma construcción que el titular de la página -- redonda arriba,
          cursiva desplazada abajo, interletrado cerrado, sin margen entre
          renglones -- y subordinado por cuerpo y peso, no por color.

          LA SANGRÍA VA EN LA PRIMERA LÍNEA porque aquí la segunda es la más
          larga: sangrar la larga empuja su remate a la derecha y deja el
          costado izquierdo vacío. Con la corta sangrada, la larga define los
          dos extremos y el bloque queda equilibrado. */}
      <p className="gal-subtitulo mt-16 text-center">
        <span className="inline-block text-left">
          <span className="block">Todas estas empezaron</span>
          <span className="block italic">con una foto y una conversación.</span>
        </span>
      </p>

      {/* ─── 2. LA VENTANA DE CONVERSIÓN ────────────────────────────────────
          La secuencia se lee de corrido: hay una que no puedes dejar de ver ->
          mándamela -> escríbeme. El botón es el final de esa frase.

          EL MENSAJE PRELLENADO ES PROPIO DE ESTA RUTA. Dice que viene de la
          galería, que es lo que le da a Axel el contexto con el que abrir la
          conversación. */}
      <div className="gal-ventana mt-7">
        <div className="px-6 py-6 sm:px-8">
          <p className="gal-frase">
            <span className="block">¿Hay una que no</span>
            <span className="block italic">puedas dejar de ver?</span>
          </p>

          <p className="gal-entrada">
            Mándamela y te digo qué haría falta para llegar ahí.
          </p>
        </div>

        {/* A SANGRE POR EL PIE DE LA VENTANA: no lleva radio propio, lo recorta
            el overflow de la ventana contra su curva. Es el único relleno
            saturado de la página. */}
        <a
          href={waLink("Hola Axel, vi tu galería y hay un trabajo que me gustó.")}
          target="_blank"
          rel="noopener noreferrer"
          className="gal-wa-boton"
        >
          <span className="gal-wa-texto">Escríbeme por WhatsApp</span>
          <span aria-hidden="true" className="gal-wa-flecha">
            →
          </span>
        </a>
      </div>

      {/* ─── 3. LA VENTANA DE REFERENCIA ────────────────────────────────────
          Vidrio más ligero, contorno dibujado y sin elevación: se distingue de
          la de arriba por tener MENOS materia, no por ser más oscura.

          DOS SALIDAS Y NO UNA. Desde la galería tienen sentido las dos cartas,
          no solo el menú de color.

          SIN NOTA DE PRECIOS: aquí no hay precios a los que se refiera. */}
      <div className="gal-ventana-ligera mt-4">
        <div className="px-6 py-5 sm:px-8">
          <div className="gal-cierre-fila">
            <div className="gal-cierre-enlaces">
              <Link href="/menu" className="gal-pastilla">
                Diseños de color
                <span aria-hidden="true" className="gal-pastilla-flecha">
                  →
                </span>
              </Link>

              <Link href="/menu/tratamientos" className="gal-pastilla">
                Tratamientos
                <span aria-hidden="true" className="gal-pastilla-flecha">
                  →
                </span>
              </Link>
            </div>

            {/* Zona, nunca dirección: sale de lib/site.ts. */}
            <p className="gal-lugar">{site.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
