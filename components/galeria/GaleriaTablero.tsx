"use client";

import Image from "next/image";
import { useState } from "react";

import { VisorBaraja } from "@/components/VisorBaraja";
import {
  GALERIA,
  GALERIA_ALTO,
  GALERIA_ANCHO,
  completa,
  miniatura,
} from "@/data/galeria";

// ═══════════════════════════════════════════════════════════════════════════
// EL TABLERO DE /galeria
//
// ES UN COMPONENTE NUEVO Y NO UNA VARIANTE DE GaleriaCliente. Aquella vive en
// components/GaleriaCliente.tsx, la usan /galeria y /menu, y ya se bifurca con
// seis props entre dos carruseles y dos superficies de visor. Meterle un tercer
// modo -- un mosaico, que no es un carrusel -- habría hecho de ella tres
// componentes disfrazados de uno. Ésta es solo de esta ruta; GaleriaCliente se
// queda intacta para /menu.
//
// EL VISOR SÍ SE REUSA, SIN TOCARLO. VisorBaraja ya acepta `fondo="shell"` --
// la superficie clara que estrena la guía de largos de /menu --, así que la
// paleta clara sale de configurarlo, no de modificarlo ni de duplicar sus 1394
// líneas de física de arrastre.
// ═══════════════════════════════════════════════════════════════════════════

// LAS 56, EN SU ORDEN CRONOLÓGICO, apuntando a las versiones completas. Que la
// lista exista no significa que se descarguen: el visor recibe ventana={1} y
// monta la activa más sus dos vecinas, así que nunca hay más de tres <img>.
const LAMINAS = GALERIA.map((f) => ({
  id: f.id,
  archivo: completa(f.id),
  alt: f.alt,
}));

// ─── EL RITMO DEL MOSAICO ─────────────────────────────────────────────────
// Las 56 están recortadas a 4:5, así que con celdas iguales la retícula sale
// perfectamente uniforme y se lee como cuadrícula de catálogo. El carácter de
// tablero lo da que unas ocupen más que otras.
//
// TRES FORMATOS, y los tres salen de recortar distinto con object-cover:
// ninguna fotografía se amplía, así que no hay pérdida de nitidez en ninguna.
//
//   grande  2 columnas x 8 filas   4:5 al doble de tamaño   6 fotos
//   alta    1 columna  x 5 filas   recorte más vertical    14 fotos
//   normal  1 columna  x 4 filas   4:5 exacto              36 fotos
//
// EL REPARTO VA ESCRITO A MANO Y NO AL AZAR. Un Math.random() daría
// composiciones distintas en servidor y cliente -- error de hidratación -- y
// además lo aleatorio se agrupa. Estas posiciones siguen un motivo de periodo
// 11: 11 no divide a 56 ni coincide con 2, 3, 4 ni 5 columnas, así que el
// patrón nunca se alinea con ninguna cuenta y el ojo no le encuentra la
// repetición. Las seis grandes van separadas por nueve posiciones o más.
const GRANDES = new Set([3, 14, 24, 33, 43, 52]);
const ALTAS = new Set([1, 7, 9, 12, 18, 20, 27, 30, 36, 39, 45, 47, 50, 54]);

function formato(i: number): "grande" | "alta" | "normal" {
  if (GRANDES.has(i)) return "grande";
  if (ALTAS.has(i)) return "alta";
  return "normal";
}

// ─── CARGA PROGRESIVA ─────────────────────────────────────────────────────
// Las ocho primeras se piden de inmediato -- son las que caen sobre el pliegue
// en cualquiera de las cuatro cuentas de columnas -- y las otras 48 llevan
// `loading="lazy"` nativo, que las descarga conforme la persona baja. Sin
// JavaScript, sin observadores y sin espera artificial.
const INMEDIATAS = 8;

// El ancho que ocupa cada celda en cada tramo, para que next/image pida el
// archivo del tamaño de la celda y no el de 640 en las 56.
const SIZES_NORMAL =
  "(min-width: 1440px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";
const SIZES_GRANDE =
  "(min-width: 1440px) 40vw, (min-width: 1024px) 50vw, (min-width: 640px) 66vw, 100vw";

export function GaleriaTablero() {
  const [abierto, setAbierto] = useState(false);
  const [indice, setIndice] = useState(0);

  return (
    <>
      <ul className="gal-tablero">
        {GALERIA.map((foto, i) => {
          const f = formato(i);
          return (
            <li key={foto.id} className={`gal-celda gal-celda-${f}`}>
              <button
                type="button"
                onClick={() => {
                  setIndice(i);
                  setAbierto(true);
                }}
                className="gal-foto"
                aria-label={`Ver en grande: ${foto.alt}`}
              >
                <Image
                  src={miniatura(foto.id)}
                  alt=""
                  fill
                  sizes={f === "grande" ? SIZES_GRANDE : SIZES_NORMAL}
                  priority={i < INMEDIATAS}
                  loading={i < INMEDIATAS ? undefined : "lazy"}
                  className="object-cover"
                  // EL FUNDIDO DE ENTRADA se marca en el nodo desde el evento de
                  // carga y no con estado: 56 piezas de estado re-renderizarían
                  // el tablero entero cada vez que llega una fotografía. El
                  // atributo lo lee el CSS.
                  onLoad={(e) => {
                    e.currentTarget.dataset.cargada = "si";
                  }}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {/* El visor es el mismo de /menu y /galeria de siempre, sin una línea
          tocada. Lo único que cambia es lo que se le pasa: la superficie clara
          y las 56 láminas completas. */}
      <VisorBaraja
        laminas={LAMINAS}
        ancho={GALERIA_ANCHO}
        alto={GALERIA_ALTO}
        abierto={abierto}
        indiceInicial={indice}
        onCerrar={() => setAbierto(false)}
        etiqueta="Galería de trabajos"
        fondo="shell"
        fisica
        textoAnterior="Foto anterior"
        textoSiguiente="Foto siguiente"
        anuncio={(i) => `Foto ${i + 1} de ${LAMINAS.length}. ${LAMINAS[i].alt}`}
        ventana={1}
        altoCabecera="min-h-11"
      />
    </>
  );
}
