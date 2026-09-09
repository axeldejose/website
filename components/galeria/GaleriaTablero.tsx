"use client";

import Image from "next/image";
import { useState } from "react";

import { VisorBaraja } from "@/components/VisorBaraja";
import {
  CATEGORIAS_GALERIA,
  CATEGORIA_POR_FOTO,
  GALERIA,
  GALERIA_ALTO,
  GALERIA_ANCHO,
  MINIATURA_ALTO,
  MINIATURA_ANCHO,
  completa,
  miniatura,
} from "@/data/galeria";
import type { CategoriaGaleria } from "@/data/galeria";

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

// LAS LÁMINAS DEL VISOR SE DERIVAN DE LO QUE SE VE, no de las 56 fijas. Con un
// filtro activo, el visor navega solo entre las fotos de esa categoría: abrir
// la tercera rubia y encontrarse una castaña al deslizar sería una sorpresa
// desagradable. Con "Todos" la lista es la de siempre, en su orden cronológico.
//
// Que la lista exista no significa que se descarguen: el visor recibe
// ventana={1} y monta la activa más sus dos vecinas, así que nunca hay más de
// tres <img>.
function laminasDe(fotos: typeof GALERIA) {
  return fotos.map((f) => ({
    id: f.id,
    archivo: completa(f.id),
    alt: f.alt,
  }));
}

// ─── EL MOSAICO, EN DOS COLUMNAS QUE FLUYEN SOLAS ────────────────────────
// ANTES ERA UNA RETÍCULA CON SALTOS DE FILA. Cada celda pedía 4, 5 u 8 filas
// de una cuadrícula común, y como esos tres números no tejen entre sí, las
// filas se alineaban por la pieza más alta y quedaban huecos entre una
// fotografía y la siguiente.
//
// AHORA NO HAY FILAS. Son dos columnas independientes, cada una una pila
// vertical con su propia separación: dentro de una columna, la foto siguiente
// arranca donde termina la anterior, así que no queda hueco por construcción.
// Es el reparto de un masonry, sin medir nada en JavaScript.
//
// EL REPARTO ES ALTERNO -- par a la izquierda, impar a la derecha -- y no
// "las primeras 28 en la columna izquierda", que es lo que haría `columns` de
// CSS. Con el reparto alterno el orden cronológico se sigue leyendo de
// izquierda a derecha y las que cargan primero son las de arriba de las dos
// columnas, no las de media página de la primera.
//
// LAS FOTOGRAFÍAS YA NO SE RECORTAN. Cada una entra con su tamaño natural
// (640x800) y la celda toma el alto que le corresponde: no hay object-cover
// que corte ni alto de fila que deforme.
const COLUMNAS = 2;

function repartir<T>(items: T[]): T[][] {
  const columnas: T[][] = Array.from({ length: COLUMNAS }, () => []);
  items.forEach((item, i) => columnas[i % COLUMNAS].push(item));
  return columnas;
}

// ─── CARGA PROGRESIVA ─────────────────────────────────────────────────────
// Las ocho primeras se piden de inmediato -- son las que caen sobre el pliegue
// en cualquiera de las cuatro cuentas de columnas -- y las otras 48 llevan
// `loading="lazy"` nativo, que las descarga conforme la persona baja. Sin
// JavaScript, sin observadores y sin espera artificial.
const INMEDIATAS = 8;

// Con dos columnas fijas, cada celda mide siempre la mitad del marco. Un solo
// valor: no hay tramo en el que la cuenta de columnas cambie.
const SIZES_CELDA = "50vw";

// `null` es "Todos": la ausencia de filtro, no una categoría más. Tenerlo como
// null y no como la cadena "todos" evita que el estado inicial dependa de un
// valor mágico que también podría venir de CATEGORIAS_GALERIA.
type Filtro = CategoriaGaleria | null;

export function GaleriaTablero() {
  const [abierto, setAbierto] = useState(false);
  const [indice, setIndice] = useState(0);
  const [filtro, setFiltro] = useState<Filtro>(null);

  // La lista visible y las láminas del visor salen las dos de aquí, así que el
  // índice que guarda el botón sirve para las dos sin traducción.
  const visibles =
    filtro === null
      ? GALERIA
      : GALERIA.filter((f) => CATEGORIA_POR_FOTO[f.id] === filtro);
  const laminas = laminasDe(visibles);

  // Cambiar de filtro reordena el tablero entero: el índice guardado apuntaría
  // a otra foto. Se cierra el visor y se vuelve al principio.
  const cambiarFiltro = (siguiente: Filtro) => {
    setFiltro(siguiente);
    setIndice(0);
    setAbierto(false);
  };

  return (
    <>
      {/* ─── LAS PASTILLAS DE FILTRO ──────────────────────────────────────
          Un grupo de botones, no una lista de enlaces: no cambian de ruta ni
          de URL, solo de lo que se ve. `aria-pressed` es lo que anuncia cuál
          está activa a quien no ve el relleno. */}
      <div
        role="group"
        aria-label="Filtrar por tono"
        className="gal-filtros"
      >
        <button
          type="button"
          onClick={() => cambiarFiltro(null)}
          aria-pressed={filtro === null}
          className="gal-filtro"
        >
          Todos
        </button>

        {CATEGORIAS_GALERIA.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => cambiarFiltro(c.id)}
            aria-pressed={filtro === c.id}
            className="gal-filtro"
          >
            {c.etiqueta}
          </button>
        ))}
      </div>

      {/* CADA COLUMNA ES SU PROPIA LISTA. El índice que viaja con cada foto es
          el que tiene dentro de `visibles` -- no el de la columna --, que es
          exactamente lo que el visor necesita para abrir en la correcta. */}
      <div className="gal-tablero">
        {repartir(visibles.map((foto, i) => ({ foto, i }))).map((columna, c) => (
          <ul key={c} className="gal-columna">
            {columna.map(({ foto, i }) => (
              <li key={foto.id} className="gal-celda">
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
                    width={MINIATURA_ANCHO}
                    height={MINIATURA_ALTO}
                    sizes={SIZES_CELDA}
                    priority={i < INMEDIATAS}
                    loading={i < INMEDIATAS ? undefined : "lazy"}
                    className="gal-img"
                    // EL FUNDIDO DE ENTRADA se marca en el nodo desde el evento
                    // de carga y no con estado: 56 piezas de estado
                    // re-renderizarían el tablero entero cada vez que llega una
                    // fotografía. El atributo lo lee el CSS.
                    onLoad={(e) => {
                      e.currentTarget.dataset.cargada = "si";
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* El visor es el mismo de /menu y /galeria de siempre, sin una línea
          tocada. Lo único que cambia es lo que se le pasa: la superficie clara
          y las láminas completas de lo que esté a la vista. */}
      <VisorBaraja
        laminas={laminas}
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
        anuncio={(i) => `Foto ${i + 1} de ${laminas.length}. ${laminas[i].alt}`}
        ventana={1}
        altoCabecera="min-h-11"
      />
    </>
  );
}
