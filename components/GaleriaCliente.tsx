"use client";

import { useState } from "react";

import { CarruselGaleria } from "@/components/CarruselGaleria";
import { VisorBaraja } from "@/components/VisorBaraja";
import {
  GALERIA,
  GALERIA_ALTO,
  GALERIA_ANCHO,
  SELECCION_CARRUSEL,
  completa,
} from "@/data/galeria";

// LA FRONTERA DE CLIENTE de /galeria. La página es un Server Component; aquí
// abajo vive lo único que necesita estado: qué foto está abierta en el visor.
//
// Las dos listas se arman una sola vez, fuera del componente: son constantes
// derivadas de los datos, no algo que dependa del render.

// Las 56, en su orden cronológico, apuntando a las versiones completas. Que
// esta lista exista NO significa que se descarguen: VisorBaraja recibe
// ventana={1} y monta la activa más sus dos vecinas, así que en el DOM nunca
// hay más de tres <img>.
const LAMINAS = GALERIA.map((f) => ({
  id: f.id,
  archivo: completa(f.id),
  alt: f.alt,
}));

// La selección del carrusel, en el orden decidido en data/galeria.ts, con la
// posición de cada foto dentro de las 56 -- que es lo que abre el visor en la
// foto correcta. El filtro protege de un id mal escrito en la selección: sin
// él, findIndex devolvería -1 y el visor abriría en una lámina inexistente.
const SELECCION = SELECCION_CARRUSEL.map((id) => {
  const indice = GALERIA.findIndex((f) => f.id === id);
  return indice < 0
    ? null
    : { id, alt: GALERIA[indice].alt, indice, clave: id };
}).filter((f): f is NonNullable<typeof f> => f !== null);

// ALTO DE LA VENTANA DEL VISOR. Es un alto DEFINIDO, no `h-fit`, y la cuenta
// tiene una razón en cada término.
//
// El visor necesita que el alto de la ventana sea una longitud definida para
// que la imagen se pueda encoger cuando la pantalla es baja: el hueco de la
// imagen es `flex-1 min-h-0` y el marco toma su alto con height:100%, y un
// porcentaje contra un padre de alto `fit-content` no resuelve -- Chrome lo
// trata como automático y el marco se queda con su tamaño de contenido. Medido
// con h-fit en una ventana de 390x500: el marco conservaba 312x390 dentro de
// una caja recortada a 460, así que la foto y el pie se salían por abajo
// (-18px) y quedaban cortados por el overflow-hidden.
//
// Con el alto definido, el marco vuelve a deducir su ancho de la altura y todo
// cabe. Los tres términos del min():
//
//   92vh  y  46rem  son los mismos topes de la guía de largos: margen visible
//                   alrededor y un techo para que en escritorio no se estire.
//   calc(...)       es el alto que la ventana PIDE con fotos 4:5. 176px son las
//                   piezas fijas de la composición interior (20+20 de relleno,
//                   44 de cabecera, 44 de pie y los dos huecos de 24), y el
//                   resto es la altura de la foto: su ancho -- el de la ventana
//                   menos el relleno -- multiplicado por 1.25, que es 5/4.
//
// Si cambia el relleno de la ventana, el alto de la cabecera o del pie, o la
// proporción de las fotos, hay que rehacer esta cuenta.
const ALTO_VENTANA =
  "h-[min(92vh,46rem,calc(176px_+_1.25_*_(min(92vw,22rem)_-_2.5rem)))]";

type GaleriaClienteProps = {
  // Relleno lateral del riel del carrusel. Se reenvía tal cual a
  // CarruselGaleria; sin valor queda el de /galeria. /menu pasa el suyo porque
  // ahí el eje del contenido es el canto de la columna derecha.
  rellenoRiel?: string;
  // Tamaño de la tarjeta del carrusel. Se reenvía tal cual; sin valor queda el
  // de /galeria.
  tarjeta?: { clase: string; sizes: string };
};

export function GaleriaCliente({ rellenoRiel, tarjeta }: GaleriaClienteProps) {
  const [abierto, setAbierto] = useState(false);
  const [indice, setIndice] = useState(0);

  return (
    <>
      <CarruselGaleria
        fotos={SELECCION}
        activo={!abierto}
        rellenoRiel={rellenoRiel}
        tarjeta={tarjeta}
        onAbrir={(i) => {
          setIndice(i);
          setAbierto(true);
        }}
      />

      {/* El visor es el mismo componente que la guía de largos de /menu: mismo
          gesto de baraja, misma ventana contenida, misma entrada y salida por
          desvanecimiento. Lo que cambia es lo que se le pasa.

          SIN PUNTOS. Cuatro puntos orientan; 56 son una regla ilegible y 56
          blancos de 8px que nadie puede acertar. En su lugar va el contador, que
          además dice cuántas quedan. */}
      <VisorBaraja
        laminas={LAMINAS}
        ancho={GALERIA_ANCHO}
        alto={GALERIA_ALTO}
        abierto={abierto}
        indiceInicial={indice}
        onCerrar={() => setAbierto(false)}
        etiqueta="Galería de trabajos"
        textoAnterior="Foto anterior"
        textoSiguiente="Foto siguiente"
        anuncio={(i) => `Foto ${i + 1} de ${LAMINAS.length}. ${LAMINAS[i].alt}`}
        ventana={1}
        // Alto automático con tope: las fotos son 4:5, así que el marco tiene
        // que deducir su altura del ancho y no al contrario. Ver el comentario
        // de altoVentana en VisorBaraja.
        altoVentana={ALTO_VENTANA}
        // La cabecera de esta ventana es solo el botón de cerrar. Se le fija el
        // mismo alto que al pie -- 44px, el de las flechas -- para que la foto
        // quede centrada; sin eso la fila del cierre mide 40 y la imagen queda
        // 4px alta.
        altoCabecera="min-h-11"
        pie={(i) => (
          <p className="text-[11px] uppercase tabular-nums tracking-[0.25em] text-shell-lift/70">
            {String(i + 1).padStart(2, "0")} / {LAMINAS.length}
          </p>
        )}
      />
    </>
  );
}
