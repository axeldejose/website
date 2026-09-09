"use client";

import { useState } from "react";

import { CarruselFoco } from "@/components/CarruselFoco";
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
//   calc(...)       es el alto que la ventana PIDE con fotos 4:5, y tiene tres
//                   términos. 96px son las piezas fijas (20+20 de relleno, 28
//                   de pie -- era 44 antes de adelgazar la franja -- y los dos
//                   huecos de 14). El segundo es la CABECERA,
//                   que no es fija: depende del cuerpo del titular, que a su vez
//                   es un clamp sobre vw. Y el tercero es la altura de la foto:
//                   su ancho -- el de la ventana menos el relleno --
//                   multiplicado por 1.25, que es 5/4.
//
// LA CABECERA MIDE 1.9375 VECES EL CUERPO DEL TITULAR. Medido en las tres
// paradas del clamp: 48px -> 93.0, 52.72 -> 102.0, 56 -> 108.5. Los tres
// cocientes dan 1.9375, 1.9347 y 1.9375, así que el factor es constante -- es
// el lockup (1 + 0.85 - 0.22 del montaje) más la caja de línea del nodo de
// espacio que separa las dos piezas, ese {" "} que mantiene el nombre accesible
// en "Galería de color" y no en "Galeríade color".
//
// POR QUÉ NO SIRVE UNA CONSTANTE, y me costó un intento: puse 221px, el valor
// del caso más alto, pensando que en pantallas estrechas el sobrante se lo
// llevaría el hueco de la imagen. No: el marco es `h-full`, así que se come TODA
// la altura disponible y deduce su ancho de ella; cuando ese ancho pasa del
// disponible, el `max-w-full` lo recorta y la PROPORCIÓN SE ROMPE. Medido con
// la constante: a 320px el marco quedaba en 0.7617 en vez de 0.8 y object-cover
// recortaba un 4.8% del ancho de la foto. Con el término variable la cuenta es
// exacta en cada ancho y la proporción vuelve a 0.8.
//
// Al revés no hay problema: en una pantalla baja manda el 92vh, la altura
// disponible es MENOR que la que pide el ancho, y entonces el ancho deducido
// cabe de sobra y no se recorta nada.
//
// Los dos huecos verticales bajaron de 24 a 14px, que es el ajuste de los
// márgenes del marco. Los laterales no se tocan: siguen siendo el relleno de
// 20px de la ventana.
//
// Si cambia el relleno de la ventana, el alto de la cabecera o del pie, o la
// proporción de las fotos, hay que rehacer esta cuenta.
// EL DE /menu, con titular y con 14px de aire vertical.
const ALTO_VENTANA_TITULADO =
  "h-[min(92vh,46rem,calc(96px_+_clamp(5.8125rem,29.0625vw,6.78125rem)_+_1.25_*_(var(--visor-ancho)_-_2.5rem)))]";

// EL DE /galeria, que no lleva titular ni cambió su aire: cabecera de 44px (el
// min-h-11 del cierre solo) y huecos de 24, o sea 40+44+44+48 = 176px de piezas
// fijas. Es el valor que tenía antes de que /menu ganara su titular, y vuelve
// aquí porque la constante era una sola para las dos rutas: con la fórmula
// titulada, la ventana de /galeria quedaba 108px más alta de lo que pide y el
// max-w-full del marco recortaba la proporción. Regresión mía, corregida.
const ALTO_VENTANA_SIMPLE =
  "h-[min(92vh,46rem,calc(176px_+_1.25_*_(var(--visor-ancho)_-_2.5rem)))]";

type GaleriaClienteProps = {
  // Relleno lateral del riel del carrusel. Se reenvía tal cual a
  // CarruselGaleria; sin valor queda el de /galeria. /menu pasa el suyo porque
  // ahí el eje del contenido es el canto de la columna derecha.
  rellenoRiel?: string;
  // Tamaño de la tarjeta del carrusel. Se reenvía tal cual; sin valor queda el
  // de /galeria.
  tarjeta?: { clase: string; sizes: string };
  // CARRUSEL DE FOCO CENTRAL en vez de la tira que deriva. Son dos componentes
  // distintos, no dos modos del mismo: uno tiene índice activo y teclado; el
  // otro es un bucle infinito que se mueve solo. Sin este valor se
  // renderiza el de la deriva, que es el que quiere /galeria.
  focoCentral?: boolean;
  // VISOR SOBRE SUPERFICIE CLARA, con su titular. Enciende las tres cosas que
  // van juntas y que no tendrían sentido por separado: el fondo blanco de la
  // ventana, el titular "Galería de color" y la tinta oscura del contador.
  //
  // Sin este valor la ventana es la de siempre. Es lo que deja a /galeria
  // intacta: la pide /menu, que es donde se pidió el cambio.
  visorClaro?: boolean;
  // Clave de almacenamiento local para el "me gusta" de cada fotografía. Se
  // reenvía tal cual al visor; sin valor no hay corazón, que es lo que deja a
  // /galeria intacta.
  claveFavoritos?: string;
  // Física de baraja del visor. Se reenvía tal cual; sin valor el gesto es el
  // de siempre, que es lo que deja a /galeria intacta.
  fisicaVisor?: boolean;
};

export function GaleriaCliente({
  rellenoRiel,
  tarjeta,
  focoCentral = false,
  visorClaro = false,
  claveFavoritos,
  fisicaVisor = false,
}: GaleriaClienteProps) {
  const [abierto, setAbierto] = useState(false);
  const [indice, setIndice] = useState(0);

  return (
    <>
      {focoCentral ? (
        <CarruselFoco
          fotos={SELECCION}
          etiqueta="Selección de trabajos"
          onAbrir={(i) => {
            setIndice(i);
            setAbierto(true);
          }}
        />
      ) : (
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
      )}

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
        etiqueta={visorClaro ? "Galería de color" : "Galería de trabajos"}
        // La superficie: el beige de la marca en /menu, el café de siempre en
        // /galeria. La tercera receta -- terracota -- es la de la guía de
        // largos y no se usa aquí.
        fondo={visorClaro ? "shell" : "tierra"}
        claveFavoritos={claveFavoritos}
        fisica={fisicaVisor}
        textoAnterior="Foto anterior"
        textoSiguiente="Foto siguiente"
        anuncio={(i) => `Foto ${i + 1} de ${LAMINAS.length}. ${LAMINAS[i].alt}`}
        ventana={1}
        // Alto automático con tope: las fotos son 4:5, así que el marco tiene
        // que deducir su altura del ancho y no al contrario. Ver el comentario
        // de altoVentana en VisorBaraja.
        altoVentana={visorClaro ? ALTO_VENTANA_TITULADO : ALTO_VENTANA_SIMPLE}
        // 14px de aire vertical solo en /menu, que es donde se pidió; /galeria
        // se queda con los 24 por omisión.
        aireMarco={visorClaro ? "mt-3.5" : undefined}
        // La cabecera lleva el botón de cerrar y, en la variante clara, el
        // titular. Se le fija el mismo alto que al pie -- 44px, el de las
        // flechas -- para que la foto quede centrada; sin eso la fila del
        // cierre mide 40 y la imagen queda 4px alta.
        altoCabecera="min-h-11"
        // EL TITULAR, PIEZA HERMANA DEL DE LA PÁGINA. Es el mismo lockup que el
        // <h1> de /menu, clase por clase: envoltorio inline-block para que su
        // ancho sea el de la línea más larga y "de color" tenga contra qué
        // alinearse por la derecha; primera línea en redonda; segunda en
        // cursiva al 0.85 del cuerpo, alineada a la derecha, montada -0.22em
        // sobre la primera y volada -0.85em fuera del bloque; leading-none e
        // interletrado -0.056em en las dos.
        //
        // EL CUERPO, DE 48 A 56px, Y EL TOPE LO PONE EL BOTÓN DE CERRAR. La
        // ventana mide 92vw con tope de 22rem, así que el ancho útil del titular
        // es el de la ventana menos su relleno, menos el disco de 44px del
        // cierre. Medido el volado de "de color" -- que sale -0.85em fuera del
        // bloque -- contra el canto izquierdo del cierre:
        //
        //   cuerpo   holgura a 320px   a 360px   a 390px o más
        //     48px        32.9px         69.7         90.5
        //     52          17.8           54.6         75.4
        //     56           2.7           39.5         60.3
        //     60         -12.5           24.4         45.2
        //
        // A 56px fijos el titular roza el cierre en la pantalla más estrecha
        // (2.7px) y a 60 lo pisa. De ahí el clamp: 48px a 320, 53 a 360 y 56
        // desde 383, que es donde la ventana deja de crecer. La recta pasa
        // justo por esos dos extremos.
        //
        // Para comparar, el <h1> de la página mide 63.7px a 360 y 69.8 a 390;
        // aquí no se llega ahí porque la ventana es 60px más estrecha que el
        // panel y además comparte renglón con el cierre.
        //
        // Con 56px la cabecera mide 108.5px medidos, y ese número está metido
        // en la cuenta de ALTO_VENTANA (arriba): subir el cuerpo sin rehacer
        // esa cuenta le quita altura a la foto.
        //
        // El nombre accesible del <dialog> pasa a decir lo mismo que se ve
        // ("Galería de color"), así que el titular no introduce una segunda
        // versión del nombre.
        encabezado={
          visorClaro
            ? () => (
                <h2 className="font-display text-[clamp(3rem,15vw,3.5rem)] text-tierra">
                  <span className="inline-block">
                    <span className="block font-medium leading-none tracking-[-0.056em]">
                      Galería
                    </span>{" "}
                    <span className="-mt-[0.22em] -mr-[0.85em] block text-right text-[0.85em] font-medium italic leading-none tracking-[-0.056em]">
                      de color
                    </span>
                  </span>
                </h2>
              )
            : undefined
        }
        // El contador sigue al fondo de la ventana: tierra/70 sobre blanco da
        // 6.14:1 y crema/70 sobre el café 7.26. En claro NO se queda en /55,
        // que es el tono de la pista de uso sobre oscuro: sobre blanco eso cae a
        // 3.77:1, por debajo del mínimo de 4.5 para 11px.
        // EL ALTO DEL PIE. En la variante clara es una franja delgada: 28px, el
        // de sus flechas, contra los 44 de la oscura. Con 44 quedaban 24px de
        // caja vacía alrededor de un cheurón de 12, y entre la foto y el canto
        // inferior de la ventana se acumulaban 78px de nada. Ahora son 62, y el
        // área de toque de las flechas sigue en 44 por su ::after.
        //
        // Este número entra en la cuenta de ALTO_VENTANA_TITULADO: si cambia,
        // hay que rehacerla.
        altoPie={visorClaro ? "min-h-7" : undefined}
        // EL PIE DE LA GALERÍA CLARA: "Desliza" en el centro, no un contador.
        // En /galeria (la piel oscura) el contador se queda: ahí son 56 fotos y
        // saber en cuál vas es información, no ornamento.
        //
        // flex-1 y text-center: la pieza ocupa todo el espacio entre las dos
        // flechas, así que la palabra queda centrada en la barra y no pegada a
        // una de ellas.
        //
        // EL TONO ES tierra AL 70% Y NO MENOS. Se probó al 55% buscando algo más
        // discreto y medido sobre el beige daba 3.44:1, por debajo del mínimo AA
        // de 4.5 para texto pequeño; al 70% mide 5.29, el mismo tono y el mismo
        // contraste que las flechas que lo acompañan. Lo que lo mantiene
        // subordinado no es la opacidad sino la escala: 11px contra los 56 del
        // titular, en versalita y con 0.25em de interletrado.
        pie={(i) =>
          visorClaro ? (
            <p className="flex-1 text-center text-[11px] uppercase tracking-[0.25em] text-tierra/70">
              Desliza
            </p>
          ) : (
            <p className="text-[11px] uppercase tracking-[0.25em] tabular-nums text-shell-lift/70">
              {String(i + 1).padStart(2, "0")} / {LAMINAS.length}
            </p>
          )
        }
      />
    </>
  );
}
