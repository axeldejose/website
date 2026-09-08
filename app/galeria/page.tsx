import type { Metadata } from "next";
import Link from "next/link";

import { GaleriaCliente } from "@/components/GaleriaCliente";

export const metadata: Metadata = {
  // "Galería" es el rótulo que ya usa la tarjeta de la landing que trae hasta
  // aquí, así que el título de la pestaña repite ese nombre y no inventa otro.
  title: "Galería",
};

// COPY APROBADO POR EL PM en esta ronda. El titular repite el rótulo de la
// tarjeta de la landing que trae hasta aquí ("Galería"), así que la pantalla se
// llama igual desde los dos lados.
//
// OJO con la segunda oración de la bajada: es LA MISMA que cierra la bajada de
// /menu. Está aprobada así, pero queda anotado por si se prefiere variarla.
//
// El volado de la segunda línea del lockup se remidió con estas palabras; el
// número y la razón están en el comentario del <span> correspondiente.
const TITULAR = { primera: "Galería", segunda: "de trabajos" };
const BAJADA = [
  "Mira el trabajo que he hecho.",
  "Cuéntame qué buscas y lo resolvemos juntos.",
];

export default function GaleriaPage() {
  return (
    <>
      {/* ENCABEZADO. Mismo lenguaje que el panel de /menu, con las piezas en el
          mismo orden y a las mismas distancias relativas: lockup de dos líneas,
          bajada a mt-1 en una columna angosta, y a mt-5 la fila del botón de
          regreso con la barra de degradado.

          Lo que no viaja desde /menu son sus dos capas decorativas -- la palabra
          "color" de fondo y el mechón --, que son de esa pantalla: aquí las
          fotografías del carrusel son la imagen, y una textura más competiría
          con ellas. */}
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <div className="relative">
          {/* Resplandor suave detrás del título: el mismo blob difuminado del
              panel de /menu. Opacidad baja para no bajar el contraste. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 -left-4 h-32 w-52 rounded-[50%] bg-shell-lift/20 blur-3xl"
          />

          {/* El lockup, igual que en /menu: envoltorio inline-block para que su
              ancho lo fije la primera línea, primera línea en redonda con peso
              500, segunda en cursiva a 0.85em volada por la derecha con margen
              negativo, y el mismo interletrado de -0.056em en las dos.

              El clamp del cuerpo también es el de /menu, así que en pantallas
              chicas se reduce en la misma proporción y las dos pantallas abren
              con el titular del mismo tamaño.

              AQUÍ NO VA EL -mr-[0.85em] DE /menu, y no es un olvido. Ese margen
              negativo existe porque allá la segunda línea ("de color" a 0.85em)
              es MÁS ANGOSTA que la primera ("Diseños"): el envoltorio
              inline-block mide lo que la primera, text-right pega la segunda a
              su canto derecho y el margen negativo es lo único que la saca de
              ahí. Con "de trabajos" la relación se invierte -- la segunda línea
              es más ancha --, así que el envoltorio lo mide ella, sobresale por
              su propio ancho y el margen no tiene efecto: medido a 320px, la
              tinta acaba en x=240.69 con -0.85em y en x=240.69 con 0em, el mismo
              píxel. Dejarlo puesto sería un número mágico que no hace nada.

              El volado que queda es de +47px a 320 y +61 a 414 y más arriba, y
              la tinta acaba a 79px o más del canto del panel en todos los
              anchos, así que no desborda ni genera desplazamiento horizontal.

              text-right SÍ se queda: es el mecanismo que volvería a mandar si
              la segunda línea se acortara. Si eso pasa, hay que volver a
              derivar el margen negativo. */}
          <h1 className="relative font-display text-[clamp(3.4rem,20.4vw-0.61rem,4.55rem)] text-shell-lift lg:text-[3.875rem]">
            <span className="inline-block">
              <span className="block font-medium leading-none tracking-[-0.056em]">
                {TITULAR.primera}
              </span>{" "}
              <span className="-mt-[0.22em] block text-right font-medium text-[0.85em] italic leading-none tracking-[-0.056em]">
                {TITULAR.segunda}
              </span>
            </span>
          </h1>
        </div>

        {/* Bajada: columna angosta a 31ch, el mismo ml-[5px] que alinea con el
            eje óptico del titular y no con su caja, y una oración por bloque
            dentro del mismo párrafo. */}
        <div className="relative ml-[5px] mt-1 max-w-[31ch] text-sm min-[414px]:max-w-none">
          <p className="text-shell-lift/90">
            <span className="block text-balance">{BAJADA[0]}</span>{" "}
            <span className="block font-medium text-balance">{BAJADA[1]}</span>
          </p>
        </div>

        {/* FILA DEL REGRESO Y LA BARRA DE DEGRADADO. Mismas clases, mismo orden
            y mismas medidas que en /menu: el botón abre la fila alineado con el
            eje del contenido y la barra ocupa con flex-1 lo que queda a su
            derecha.

            El foco de teclado va forzado a crema con `!`: la regla global de
            :focus-visible de globals.css no está en una capa, le gana a las
            utilidades y pintaría el anillo en dune-deep, que sobre este fondo
            mide 1.65:1 -- por debajo del mínimo de 3:1. */}
        <div className="ml-[5px] mt-5 flex items-center gap-4">
          <Link
            href="/"
            aria-label="Atrás"
            className="relative inline-flex items-center rounded-full border border-clay/20 bg-clay/10 px-3 py-1 text-shell-lift backdrop-blur-xl transition-colors duration-150 after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] hover:bg-clay/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
          >
            <span
              aria-hidden="true"
              className="inline-block text-base leading-none animate-[back-nudge_1.8s_ease-in-out_infinite]"
            >
              ←
            </span>
          </Link>

          <div
            aria-hidden="true"
            className="hair-swatch h-2 flex-1 rounded-full"
          />
        </div>
      </div>

      {/* EL CARRUSEL, A SANGRE. Va fuera del contenedor del encabezado: su
          recorrido tiene que llegar a los dos cantos de la pantalla, y las
          tarjetas asoman por el canto derecho para que se lea como una tira que
          sigue. El relleno lateral del riel es el mismo px-6 / lg:px-8 del
          encabezado, así que la primera tarjeta arranca en el eje del titular.

          mt-12 / lg:mt-16 lo separa del encabezado con más aire que el que hay
          entre las piezas del encabezado, para que se lea como el otro bloque de
          la página. */}
      <div className="mt-12 lg:mt-16">
        <GaleriaCliente />
      </div>
    </>
  );
}
