"use client";

import Image from "next/image";
import { useRef } from "react";

// Botón "Conóceme más" + modal con la biografía completa de Axel.
// Usa el <dialog> nativo: showModal() da foco atrapado, cierre con Escape y
// devolución de foco al botón al cerrar de forma automática. El clic en el
// backdrop se cierra comparando el target con el propio <dialog>.
//
// COMPARTIDO ENTRE LA LANDING Y /menu. El disparador no se toca aquí: /menu lo
// reviste por la prop `className` y cualquier cambio en sus clases base movería
// las dos rutas. Lo que se rediseñó es la ventana.
export function ConoceMas({ className = "" }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const onBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) close();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`flex min-h-[40px] items-center justify-center rounded-full border border-white/50 bg-white/10 px-3 text-xs text-shell-lift transition-colors duration-150 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep ${className}`}
      >
        Conóceme más <span aria-hidden="true">→</span>
      </button>

      {/* ─────────────────────────────────────────────────────────────────────
          LA VENTANA: EL MURO DE LA FOTOGRAFÍA COMO PÁGINA.

          El nombre no va encima de la foto ni en un bloque aparte: va DENTRO de
          la escena, escrito sobre el muro vacío que hay junto a Axel. Es lo que
          hace que imagen y palabras se apoyen en vez de apilarse.

          POR QUÉ AHÍ Y NO EN OTRA PARTE. La fotografía original (941x1672, sin
          canal alfa) tiene una banda de muro liso arriba, de x 320 a 941 y de
          y 0 a 520, con desviación típica de 1.2 a 3.7: prácticamente sin
          textura. Medido sobre el recorte que se sirve, el texto `tierra` en la
          caja del nombre da 10.24:1 de media y 5.63:1 en el peor parche de
          32x32 -- ese peor caso es el canto en sombra del nicho, y sigue por
          encima del mínimo AA de 4.5 para texto normal y muy por encima del 3
          que pide el texto grande.

          El piso de madera de abajo se descartó para escribir: su media daría
          6.6:1 en crema, pero hay reflejos en las duelas donde cae a 2.66:1.

          EL RECORTE. Un solo archivo, public/ae.webp de 941x1176 (4:5), tomado
          del original entre y=40 y y=1216: conserva el muro, el nicho, el
          mueble de vidrios de color y a Axel de la cabeza a las rodillas. El
          encuadre de móvil sale del mismo archivo por recorte de CSS (6:5 con
          object-top), no de un segundo archivo que se pueda desincronizar. 941
          de ancho es el máximo útil y también el máximo disponible: el modal
          mide 358px en un teléfono de 390, que a densidad 3x pide 1074.

          SIN CAJAS DENTRO DE CAJAS. La lámina va al sangre por los tres cantos
          superiores y la recorta el radio del propio <dialog> (su overflow-y
          recorta a la caja de relleno redondeada). No hay marco, ni borde, ni
          divisor entre la imagen y el texto: los separa el aire.

          EL RITMO DEL TEXTO son cuatro tiempos y una nota, y NO CAMBIA UNA SOLA
          PALABRA de la biografía: solo dónde parte el párrafo y con qué escala
          se lee cada tramo. Entrada a 17px en peso ligero (Jost tiene el eje
          completo, así que el 300 es real y no sintético), cuerpo a 15px, y el
          "Solo con cita previa." aparte en la voz display -- el mismo par de
          voces con que la carta marca su nota de rangos.

          EL DESVANECIMIENTO. La ventana no lo tenía: aparecía y desaparecía de
          golpe (medido, animation-name: none y ninguna duración). Se añade con
          la misma receta que el visor de largos, y por el mismo motivo por el
          que ahí costó tres intentos: SOLO OPACIDAD. Ni `scale` ni cambio de
          geometría, así que la ventana no se contrae al cerrarse. Las
          propiedades discretas (display y overlay) necesitan
          transition-behavior: allow-discrete para que el elemento siga en el
          árbol mientras se desvanece, y @starting-style para tener un estado de
          partida al abrir. Todo con utilidades, para no tocar la hoja global.
          ───────────────────────────────────────────────────────────────────── */}
      <dialog
        ref={dialogRef}
        onClick={onBackdropClick}
        aria-labelledby="bio-titulo"
        className="m-auto w-[min(92vw,32rem)] overflow-y-auto rounded-2xl bg-shell p-0 text-tierra opacity-0 transition-[opacity,display,overlay] transition-discrete duration-200 ease-out backdrop:bg-tierra/0 backdrop:transition-[background-color,display,overlay] backdrop:transition-discrete backdrop:duration-200 open:opacity-100 open:backdrop:bg-tierra/70 starting:open:opacity-0 starting:open:backdrop:bg-tierra/0"
      >
        {/* LA LÁMINA. aspect-[6/5] en móvil recorta la mitad baja del archivo
            con object-top, así que lo visible es el retrato de medio cuerpo con
            el muro completo arriba; desde sm el contenedor toma la proporción
            nativa del archivo (4:5) y se ve entero, sin recorte. */}
        <div className="relative aspect-[6/5] w-full sm:aspect-[4/5]">
          <Image
            src="/ae.webp"
            alt="Axel De José sentado en el sillón de su estudio, con el mueble de tintes y el muro claro al fondo."
            fill
            sizes="(min-width: 640px) 32rem, 92vw"
            className="object-cover object-top"
          />

          {/* EL ANCLA. Una sola voz por línea: el nombre en display a 56/80px
              y el apellido en Jost a 11px con versalita espaciada. El contraste
              es de escala, familia y espaciado -- no hay ornamento ni fondo
              detrás del texto. Las dos palabras juntas son el nombre accesible
              de la ventana (aria-labelledby). */}
          <h2
            id="bio-titulo"
            className="absolute inset-x-0 top-0 px-6 pt-6 sm:px-8 sm:pt-8"
          >
            <span className="block font-display text-[3.5rem] leading-[0.82] font-normal tracking-[-0.015em] text-tierra sm:text-[5rem]">
              Axel
            </span>
            <span className="mt-2 block text-[11px] uppercase tracking-[0.28em] text-tierra/80">
              De José
            </span>
          </h2>

          {/* Cierre al alcance del pulgar, sobre el muro (peor parche medido en
              esa esquina: 7.28:1). Sin superficie en reposo para no meter una
              caja sobre la foto; el realce aparece al interactuar. 44x44 de
              área de toque. */}
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full text-tierra transition-colors duration-150 hover:bg-shell/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* EL TEXTO. Medida corta en la entrada (max-w) para que la primera
            frase se lea de un tirón y funcione como punto de entrada; el resto
            va a la medida completa. */}
        <div className="px-6 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-8">
          <p className="max-w-[30ch] text-[1.0625rem] leading-[1.5] font-light text-tierra sm:max-w-[34ch] sm:text-[1.125rem]">
            Soy estilista especialista en colorimetría capilar y diseño de
            color, reconocido como uno de los mejores coloristas de México tras
            mi participación en el reality show Style &amp; Colour Trophy México
            de L&apos;Oréal Professionnel.
          </p>

          <p className="mt-5 text-[0.9375rem] leading-[1.65] text-tierra/85">
            Mi paso por los laboratorios de L&apos;Oréal, en el Research &amp;
            Innovation Center, me enseñó a leer el cabello y los activos de los
            tratamientos, para calificar con precisión qué productos usar.
          </p>

          <p className="mt-4 text-[0.9375rem] leading-[1.65] text-tierra/85">
            Ya sea con cabello dañado por decoloraciones anteriores o buscando
            un diseño de color desde cero, logro un resultado suave, brillante y
            manejable.
          </p>

          <p className="mt-5 text-[0.9375rem] leading-[1.65] text-tierra">
            Cada cita es un servicio uno a uno: te escucho, te guío y te dedico
            toda mi atención, sin prisas ni interrupciones.
          </p>

          <p className="mt-6 font-display text-[0.8125rem] italic text-tierra/75">
            Solo con cita previa.
          </p>

          <button
            type="button"
            onClick={close}
            className="mt-7 flex min-h-11 items-center rounded-full bg-dune-deep px-5 py-2 text-sm text-shell transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
          >
            Cerrar
          </button>
        </div>
      </dialog>
    </>
  );
}
