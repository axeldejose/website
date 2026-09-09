"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { MINIATURA_ALTO, MINIATURA_ANCHO, miniatura } from "@/data/galeria";

type FotoFoco = {
  id: string;
  alt: string;
  // Posición de la foto dentro de la galería completa. Es lo que se le pasa al
  // visor, que muestra las 56 y no solo esta selección.
  indice: number;
};

type CarruselFocoProps = {
  fotos: FotoFoco[];
  onAbrir: (indice: number) => void;
  etiqueta: string;
};

// CARRUSEL DE FOCO CENTRAL. Es un componente aparte y no un modo de
// CarruselGaleria, y eso es deliberado: son dos mecánicas incompatibles. Aquel
// es una tira que deriva sola en bucle infinito, con tres copias del contenido y
// un rAF que escribe scrollLeft cada fotograma; este tiene UNA foto activa, un
// índice discreto y teclado. Meterlos en el mismo archivo habría dejado dos
// caminos de código que no comparten nada salvo la fuente de datos.
//
// /galeria sigue usando el de la deriva, sin tocar.
//
// SIN LIBRERÍA. El arrastre táctil, el momento y el imán los pone el navegador
// con scroll-snap; el índice activo sale de leer scrollLeft; el teclado son
// cuatro teclas. No hay dependencia nueva.
export function CarruselFoco({ fotos, onAbrir, etiqueta }: CarruselFocoProps) {
  const pista = useRef<HTMLDivElement>(null);
  const riel = useRef<HTMLUListElement>(null);
  const [activo, setActivo] = useState(0);
  const rafPendiente = useRef(false);

  // EL ÍNDICE ACTIVO SALE DEL DESPLAZAMIENTO, no de un estado que el gesto
  // tenga que mantener. Es lo que hace que el arrastre nativo, el imán, la
  // inercia del dedo, las flechas del teclado y un salto programático acaben
  // todos en el mismo sitio sin código propio para cada caso: quien manda es
  // scrollLeft, y esto solo lo lee.
  //
  // Se mide contra el centro de la pista y se elige la caja más cercana. El
  // cálculo va dentro de un requestAnimationFrame y con una sola lectura por
  // fotograma, porque `scroll` se dispara muchas más veces que eso.
  const leerActivo = useCallback(() => {
    rafPendiente.current = false;
    const p = pista.current;
    const r = riel.current;
    if (!p || !r) return;
    const centro = p.scrollLeft + p.clientWidth / 2;
    let mejor = 0;
    let dmin = Infinity;
    for (let k = 0; k < r.children.length; k += 1) {
      const caja = r.children[k] as HTMLElement;
      const c = caja.offsetLeft + caja.offsetWidth / 2;
      const d = Math.abs(c - centro);
      if (d < dmin) {
        dmin = d;
        mejor = k;
      }
    }
    setActivo((previo) => (previo === mejor ? previo : mejor));
  }, []);

  const alDesplazar = () => {
    if (rafPendiente.current) return;
    rafPendiente.current = true;
    requestAnimationFrame(leerActivo);
  };

  const ir = useCallback((k: number) => {
    const p = pista.current;
    const r = riel.current;
    if (!p || !r) return;
    const caja = r.children[Math.max(0, Math.min(r.children.length - 1, k))] as
      HTMLElement | undefined;
    if (!caja) return;
    const destino = caja.offsetLeft + caja.offsetWidth / 2 - p.clientWidth / 2;
    // El desplazamiento suave lo neutraliza prefers-reduced-motion desde
    // globals.css, donde .carrusel-foco fija scroll-behavior.
    p.scrollTo({ left: destino, behavior: "smooth" });
  }, []);

  // TECLADO, con tabulador móvil (roving tabindex). La pista es un grupo
  // enfocable: se llega a ella con una sola pulsación de tabulador y se recorre
  // con las flechas; Inicio y Fin saltan a los extremos. De las catorce fotos
  // solo la activa es alcanzable con el tabulador -- las demás llevan
  // tabIndex -1 --, así que el carrusel completo cuesta dos paradas en vez de
  // catorce, y la que se abre con Enter es siempre la que se está viendo.
  const alTeclear = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const paso =
      e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : undefined;
    if (paso !== undefined) {
      e.preventDefault();
      ir(activo + paso);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      ir(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      ir(fotos.length - 1);
    }
  };

  // Al enfocar una foto con el tabulador, el navegador la trae al encuadre por
  // su cuenta pero sin imán: sin esto, la foto enfocada quedaba a medio camino
  // y el foco visual del carrusel no coincidía con el foco del teclado.
  const alEnfocarFoto = (k: number) => {
    if (k !== activo) ir(k);
  };

  // ARRANCA EN LA SEGUNDA, NO EN LA PRIMERA, y es deliberado. El criterio es que
  // sin tocar nada se entienda que hay más fotos A LOS LADOS, en plural. Con la
  // primera activa solo asoma la de la derecha, porque a su izquierda no hay
  // nada; centrado en la segunda asoman las dos.
  //
  // Va sin animación y en un efecto de disposición, antes de que el navegador
  // pinte: con desplazamiento suave se veía el carrusel colocarse solo al
  // cargar, que parece un fallo.
  useLayoutEffect(() => {
    const p = pista.current;
    const r = riel.current;
    if (!p || !r) return;
    const caja = r.children[1] as HTMLElement | undefined;
    if (!caja) return;
    p.scrollLeft = caja.offsetLeft + caja.offsetWidth / 2 - p.clientWidth / 2;
    leerActivo();
  }, [leerActivo]);

  // El ancho de la carta es relativo al viewport, así que al redimensionar hay
  // que volver a decidir cuál es la activa.
  useEffect(() => {
    const alRedimensionar = () => leerActivo();
    window.addEventListener("resize", alRedimensionar);
    return () => window.removeEventListener("resize", alRedimensionar);
  }, [leerActivo]);

  return (
    <div className="carrusel-foco-modulo">
      {/* EL GLOW. Una sola capa para todo el carrusel y por DEBAJO de todas las
          imágenes: vive aquí, fuera de la pista -- que recorta en horizontal --
          y la pista se pone por encima con z-index. Antes había un halo por
          foto, dentro de la caja de cada una, y eso lo dejaba en el contexto de
          apilamiento de su propia caja: quedaba por encima de las vecinas, no
          por debajo de todas.

          No necesita moverse. La activa está siempre en el centro de la pista,
          así que una luz centrada es una luz que está siempre detrás de ella: al
          cambiar de foto, la que llega entra en la luz y la que sale la
          abandona. La receta -- radio mayor que la foto, derrame por los cuatro
          costados y sin ningún canto -- está en globals.css. */}
      <span aria-hidden="true" className="carrusel-foco-glow" />

      {/* LA PISTA. El arrastre táctil es el del navegador: overflow-x auto más
          scroll-snap de imán obligatorio, así que hay inercia, rebote del
          sistema y encaje en el centro sin una línea de código de gesto. El
          relleno lateral vale medio ancho de pista menos medio paso, que es lo
          que permite que la primera y la última foto lleguen al centro. */}
      <div
        ref={pista}
        tabIndex={0}
        role="group"
        aria-label={etiqueta}
        onScroll={alDesplazar}
        onKeyDown={alTeclear}
        className="carrusel-foco focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shell-lift!"
      >
        <ul ref={riel} className="carrusel-foco-riel">
          {fotos.map((f, k) => {
            const esActiva = k === activo;
            return (
              <li
                key={f.id}
                className="carrusel-foco-caja"
                style={{ zIndex: esActiva ? 10 : 1 }}
                // VENTANA DE TRES PIEZAS. Con el paso que hace que las vecinas
                // salgan por el borde de la pantalla, la segunda de cada lado
                // también entraba en cuadro: asomaba una cuarta foto. Todo lo
                // que esté a dos posiciones o más del foco se desvanece, así
                // que en pantalla hay exactamente tres.
                //
                // Se desvanece y no se desmonta: montarla y desmontarla haría
                // que la siguiente llegara en blanco al deslizar, y además
                // rompería la cuenta de cajas de la que sale el índice activo.
                data-fuera={Math.abs(k - activo) >= 2 ? "si" : undefined}
              >
                <button
                  type="button"
                  onClick={() => onAbrir(f.indice)}
                  onFocus={() => alEnfocarFoto(k)}
                  tabIndex={esActiva ? 0 : -1}
                  aria-current={esActiva ? "true" : undefined}
                  className="carrusel-foco-carta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
                  data-activa={esActiva ? "si" : undefined}
                  // DE QUÉ LADO DE LA ACTIVA ESTÁ, que es lo que decide hacia
                  // dónde se desplaza. Las dos laterales no van en la misma
                  // dirección: la de la izquierda cuelga por debajo y la de la
                  // derecha sube por encima, así que las tres se leen como una
                  // diagonal ascendente.
                  //
                  // Tiene que venir de aquí y no del CSS: el lado depende de la
                  // posición respecto del índice activo, y una hoja de estilos
                  // no sabe cuál es el activo. Todas las que quedan a un lado
                  // llevan el mismo desplazamiento, así que la que entra al
                  // centro ya viene desde su altura y sube o baja hasta cero al
                  // tomar el foco.
                  data-lado={esActiva ? undefined : k < activo ? "izq" : "der"}
                >
                  <Image
                    src={miniatura(f.id)}
                    alt={f.alt}
                    width={MINIATURA_ANCHO}
                    height={MINIATURA_ALTO}
                    sizes="(min-width: 640px) 15rem, 62vw"
                    loading={k < 3 ? "eager" : "lazy"}
                    draggable={false}
                    className="h-auto w-full"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* EL CONTADOR SE FUE, y con él la única forma que tenía el carrusel de
          anunciar el cambio de foco a un lector de pantalla: la cifra visible
          llevaba el aria-live. Queda esta región, que dice lo mismo y no se ve.
          No es el contador reaparecido en otro sitio -- no ocupa espacio, no
          tiene tinta y no se puede leer en pantalla --: es lo que impide que
          quitarlo deje el carrusel sin voz al deslizar. */}
      <p aria-live="polite" className="sr-only">
        Fotografía {activo + 1} de {fotos.length}
      </p>
    </div>
  );
}
