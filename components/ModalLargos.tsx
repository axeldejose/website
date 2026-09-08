"use client";

import { useState } from "react";

import { VisorBaraja, type Lamina } from "@/components/VisorBaraja";

// Orden fijo, de menor a mayor largo. El alt describe el largo porque la
// etiqueta va impresa DENTRO de la imagen y no existe como texto en el DOM.
const LARGOS: (Lamina & { nombre: string; referencia: string })[] = [
  {
    id: "corto",
    archivo: "/largo-1-corto.webp",
    alt: "Largo corto: el cabello llega a la clavícula.",
    nombre: "Corto",
    referencia: "A la clavícula",
  },
  {
    id: "mediano",
    archivo: "/largo-2-mediano.webp",
    alt: "Largo mediano: el cabello llega al busto.",
    nombre: "Mediano",
    referencia: "Al busto",
  },
  {
    id: "largo",
    archivo: "/largo-3-largo.webp",
    alt: "Largo: el cabello llega a la cintura alta.",
    nombre: "Largo",
    referencia: "A la cintura alta",
  },
  {
    id: "extra",
    archivo: "/largo-4-extra-largo.webp",
    alt: "Extra largo: el cabello llega a la cadera.",
    nombre: "Extra largo",
    referencia: "A la cadera",
  },
];

// Cápsula de la guía de largos. Va al costado del control "¿Por qué el precio
// es un rango?", y de ahí salen tres decisiones (el razonamiento completo, en
// FilaEditorial):
//
// - CONSERVA LA CÁPSULA. Es lo que la separa de la pregunta, que es texto
//   desnudo: superficie = se pulsa y abre algo; etiqueta = se despliega aquí.
//   La superficie es el vidrio teñido en `dune` al 50% con borde a /50, que se
//   intercambió con la del enlace de WhatsApp.
// - ADELGAZADA para que quepa al lado de la pregunta: 28px de alto (era 40) y
//   pl-3/pr-2.5 (era px-5), con el hueco al icono en gap-1.5. El ::after sube a
//   10px por lado para que el acierto siga en 46: la caja adelgaza, el área de
//   toque no.
// - PESO 600. Antes iba en el 400 de Jost; subió a semibold para ganar
//   presencia al lado de la pregunta, que va en 500. El tono está en /80, el
//   mismo de la pregunta, porque se comparan de frente.
// - LLEVA EL SIGNO DE EXPANDIR: dos escuadras opuestas, 12x12 y trazo de 1px,
//   el mismo lenguaje de dibujo que los cheurones de la carta. No gira, al
//   contrario del cheurón de la pregunta, que sí gira porque despliega
//   contenido en el sitio. Es lo que avisa que esto abre una ventana aparte.
//
// El relleno es asimétrico a propósito: 12px a la izquierda contra 10 a la
// derecha, porque contra el canto derecho queda el icono, que no lleva
// interletrado ni lateral, y con relleno simétrico se veía más suelto de ese
// lado.
const CAPSULA_SECUNDARIA =
  "relative inline-flex h-7 items-center gap-1.5 rounded-full border border-dune/50 bg-dune/50 pl-3 pr-2.5 text-[11px] font-semibold uppercase leading-none tracking-[0.25em] text-shell-lift/80 backdrop-blur-xl transition-colors duration-150 after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] hover:bg-dune/60 hover:text-shell-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!";

export function ModalLargos() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className={CAPSULA_SECUNDARIA}
      >
        Guía de largos
        {/* Signo de expandir: dos escuadras opuestas. No es la flecha diagonal
            de enlace externo -- esto no sale del sitio -- ni un cheurón, que
            aquí prometería un despliegue en el lugar. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className="size-3 shrink-0 text-shell-lift/55"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.75 1.75H1.75v3M7.25 10.25h3v-3"
          />
        </svg>
      </button>

      {/* El gesto, la ventana y el bloqueo del fondo viven en VisorBaraja, que
          comparte con la galería de /galeria. Aquí solo quedan los datos y las
          dos piezas propias de esta pantalla: el indicador de largo y los
          cuatro puntos.

          ventana: sin valor, o sea que las cuatro láminas se montan de una. Es
          deliberado -- el sentido de esta ventana es comparar largos, y con
          montaje diferido la siguiente llegaba en blanco tras el cambio. Son
          cuatro archivos; la galería, que son 56, sí pasa ventana. */}
      <VisorBaraja
        laminas={LARGOS}
        ancho={900}
        alto={1599}
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        etiqueta="Guía de largos de cabello"
        textoAnterior="Largo anterior"
        textoSiguiente="Largo siguiente"
        anuncio={(i) =>
          `${LARGOS[i].nombre}, ${LARGOS[i].referencia.toLowerCase()}`
        }
        // La cabecera mide 50.5px con este indicador -- nombre en Bodoni 30px
        // peso 700 más la referencia en versalita de 11px --, así que el pie
        // tiene que igualarlo para que la foto quede centrada en la ventana.
        // Medido: 94.5px de aire arriba y abajo.
        altoPie="min-h-[50.5px]"
        encabezado={(i) => (
          <p className="min-w-0">
            <span className="block font-display text-3xl font-bold leading-none tracking-[-0.056em] text-shell-lift">
              {LARGOS[i].nombre}
            </span>
            <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.25em] text-shell-lift/75">
              {LARGOS[i].referencia}
            </span>
          </p>
        )}
        pie={(i, ir) => (
          <ul className="flex items-center gap-2">
            {LARGOS.map((l, k) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => ir(k)}
                  aria-current={k === i ? "true" : undefined}
                  className={`block size-2 rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift! ${
                    k === i ? "bg-shell-lift" : "bg-shell-lift/40"
                  }`}
                >
                  <span className="sr-only">
                    {l.nombre}, {l.referencia.toLowerCase()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      />
    </>
  );
}
