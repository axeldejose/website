"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { MINIATURA_ALTO, MINIATURA_ANCHO, miniatura } from "@/data/galeria";

type TarjetaCarrusel = {
  id: string;
  alt: string;
  // Posición de la foto dentro de la galería. Es lo que se le pasa al visor, que
  // muestra la galería completa y no solo la selección del carrusel.
  indice: number;
};

type CarruselGaleriaProps = {
  fotos: TarjetaCarrusel[];
  onAbrir: (indice: number) => void;
  // Con false el giro se detiene sin que haya interacción: lo usa la página
  // para congelar el carrusel mientras el visor está abierto.
  activo?: boolean;
  // Relleno lateral del riel: es lo que alinea la primera tarjeta con el eje
  // del contenido, y ese eje no está en el mismo sitio en las dos pantallas que
  // usan el carrusel. En /galeria el encabezado va centrado con max-w-6xl; en
  // /menu el carrusel vive dentro de la columna derecha de una retícula de dos.
  // El valor por omisión es el de /galeria, así que esa ruta no cambia.
  rellenoRiel?: string;
  // Tamaño de la tarjeta: la clase de ancho y el `sizes` que le corresponde,
  // que van siempre juntos -- si se cambia el ancho sin cambiar el sizes,
  // next/image sigue pidiendo el archivo del tamaño anterior. También por
  // pantalla: en /galeria el carrusel ES el contenido de la página y sus
  // tarjetas son grandes; en /menu es una tira entre dos secciones y tiene que
  // leerse como tira, con varias fotos a la vista. El valor por omisión es el
  // de /galeria.
  tarjeta?: { clase: string; sizes: string };
};

const TARJETA_GALERIA = {
  clase: "w-[min(62vw,17rem)]",
  sizes: "(min-width: 640px) 17rem, 62vw",
};

// RITMO. 26px por segundo. Una tarjeta con su hueco mide ~258px en un teléfono
// de 390px, así que cada foto tarda unos 10 segundos en cruzar: se percibe como
// una deriva, no como un carrusel que avanza. El movimiento se calcula por
// tiempo transcurrido y no por fotograma, así que la velocidad es la misma en
// una pantalla de 60Hz y en una de 120.
const VELOCIDAD_PX_S = 26;
// Cuánto espera para reanudar después de la última interacción. Suficiente para
// leer una foto sin que se escape, y no tanto como para que parezca que el
// carrusel se rompió.
const REANUDA_MS = 2600;
// Tres copias de la selección, no dos. Con dos, el usuario que arrastra hacia
// atrás desde el arranque choca con el principio de la primera copia; con tres
// y la posición de reposo en la del medio, quedan 14 tarjetas de holgura para
// cada lado antes de que haya que envolver.
const COPIAS = 3;

export function CarruselGaleria({
  fotos,
  onAbrir,
  activo = true,
  rellenoRiel = "px-6 lg:pl-[max(2rem,calc(50vw-34rem))] lg:pr-[max(2rem,calc(50vw-34rem))]",
  tarjeta = TARJETA_GALERIA,
}: CarruselGaleriaProps) {
  const pista = useRef<HTMLDivElement>(null);
  const riel = useRef<HTMLUListElement>(null);
  // Posición en coma flotante. No se puede acumular sobre scrollLeft leyéndolo
  // y volviéndolo a escribir: a 26px/s cada fotograma avanza 0.43px, y el
  // redondeo se comería el avance. Se lleva aparte y se vuelve a sincronizar
  // desde el elemento cada vez que el usuario lo mueve.
  const posicion = useRef(0);
  const pausado = useRef(false);
  const enPantalla = useRef(true);
  const relojReanuda = useRef(0);

  // Una copia de la selección avanza esto. Se mide sobre el DOM en vez de
  // dividir scrollWidth entre tres: el riel lleva hueco entre tarjetas, así que
  // scrollWidth/3 se queda corto por un hueco y la costura se iría desplazando
  // un puñado de píxeles en cada vuelta.
  const unidad = useCallback(() => {
    const r = riel.current;
    if (!r || r.children.length <= fotos.length) return 0;
    const primera = r.children[0] as HTMLElement;
    const siguienteCopia = r.children[fotos.length] as HTMLElement;
    return siguienteCopia.offsetLeft - primera.offsetLeft;
  }, [fotos.length]);

  // DÓNDE ARRANCA, y por qué depende del movimiento reducido.
  //
  // Con giro, arranca en la copia del medio: así hay una copia entera de
  // holgura para arrastrar hacia atrás desde el primer segundo. El precio es
  // que el primer fotograma ya muestra una tarjeta cortada por el canto
  // izquierdo, y no importa, porque a 26px/s la tira se ha movido de todas
  // formas antes de que nadie la mire.
  //
  // Sin giro (prefers-reduced-motion) ese fotograma es PERMANENTE: la tira no
  // se mueve nunca, así que una tarjeta cortada al azar en el canto se queda
  // ahí. Para esos usuarios arranca en el origen del riel, donde la primera
  // tarjeta cae exactamente en el eje del titular, y la holgura hacia atrás la
  // pierden a cambio de una composición que sí está compuesta.
  useLayoutEffect(() => {
    const el = pista.current;
    if (!el) return;
    const sinMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const inicio = sinMovimiento ? 0 : unidad();
    posicion.current = inicio;
    el.scrollLeft = inicio;
  }, [unidad]);

  const pausar = useCallback(() => {
    pausado.current = true;
    const el = pista.current;
    if (el) posicion.current = el.scrollLeft;
    clearTimeout(relojReanuda.current);
    relojReanuda.current = window.setTimeout(() => {
      const e = pista.current;
      if (e) posicion.current = e.scrollLeft;
      pausado.current = false;
    }, REANUDA_MS);
  }, []);

  // Congelar sin temporizador: mientras `activo` sea false no se reanuda.
  useEffect(() => {
    if (activo) return;
    pausado.current = true;
    clearTimeout(relojReanuda.current);
    return () => {
      const el = pista.current;
      if (el) posicion.current = el.scrollLeft;
      pausado.current = false;
    };
  }, [activo]);

  // El giro. Un solo requestAnimationFrame para todo el componente; lo único
  // que hace por fotograma es escribir scrollLeft, así que el desplazamiento lo
  // resuelve el compositor y no hay render de React de por medio.
  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const movimientoReducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let raf = 0;
    let previo = 0;

    const paso = (t: number) => {
      raf = requestAnimationFrame(paso);
      if (!previo) {
        previo = t;
        return;
      }
      // Tope de 64ms: si la pestaña estuvo dormida, el primer fotograma al
      // volver no debe dar un salto de varios segundos de recorrido.
      const dt = Math.min(64, t - previo);
      previo = t;

      // prefers-reduced-motion se consulta en cada fotograma, no al montar:
      // así respeta el cambio en caliente desde el sistema operativo. El
      // carrusel sigue existiendo y se puede recorrer con el dedo o con el
      // tabulador; lo que no hay es giro automático.
      if (
        pausado.current ||
        !enPantalla.current ||
        movimientoReducido.matches ||
        document.hidden
      ) {
        return;
      }

      const u = unidad();
      if (u <= 0) return;
      posicion.current += (VELOCIDAD_PX_S * dt) / 1000;
      // La costura: al pasar de la copia del medio a la tercera, se resta una
      // copia. El contenido de las dos es idéntico, así que el salto no se ve.
      if (posicion.current >= u * 2) posicion.current -= u;
      el.scrollLeft = posicion.current;
    };

    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [unidad]);

  // Envoltura del recorrido del usuario. Solo actúa cuando el movimiento es
  // suyo -- es decir, con el giro en pausa --, para no pelearse con el
  // desplazamiento por inercia del navegador.
  const alDesplazar = () => {
    const el = pista.current;
    if (!el || !pausado.current) return;
    const u = unidad();
    if (u <= 0) return;
    if (el.scrollLeft >= u * 2) el.scrollLeft -= u;
    else if (el.scrollLeft < u * 0.5) el.scrollLeft += u;
    posicion.current = el.scrollLeft;
  };

  // Se detiene cuando el carrusel no está a la vista. No es solo ahorro: si
  // girara fuera de pantalla, al volver a él estaría en un punto cualquiera del
  // recorrido sin que el usuario lo haya movido.
  useEffect(() => {
    const el = pista.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([e]) => {
        enPantalla.current = e.isIntersecting;
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // La unidad depende del ancho de la tarjeta, que es relativo al viewport.
  useEffect(() => {
    const alRedimensionar = () => {
      const el = pista.current;
      if (el) posicion.current = el.scrollLeft;
    };
    window.addEventListener("resize", alRedimensionar);
    return () => window.removeEventListener("resize", alRedimensionar);
  }, []);

  useEffect(() => () => clearTimeout(relojReanuda.current), []);

  // Tres copias. La primera es la real: entra en el orden del tabulador y es la
  // que anuncia un lector de pantalla. Las otras dos existen solo para que el
  // bucle no tenga costura, así que van aria-hidden y con tabIndex -1: serían
  // catorce paradas repetidas del tabulador y catorce anuncios duplicados.
  //
  // Siguen siendo <button> y no <div>, y eso importa por dos cosas. Una, que
  // una tarjeta visible que no responde al dedo se siente rota, y en reposo las
  // que se ven son casi siempre copias. Dos, el FOCO: al pulsar un <button> el
  // navegador se lo queda, así que al cerrar el visor el <dialog> nativo
  // devuelve el foco a la tarjeta desde la que se abrió. Con un <div> el foco
  // se quedaba en el <body> -- medido -- y el usuario perdía el sitio.
  const tarjetas = Array.from({ length: COPIAS }, (_, copia) =>
    fotos.map((f) => ({ ...f, copia, clave: `${copia}-${f.id}` })),
  ).flat();

  return (
    <div
      ref={pista}
      onScroll={alDesplazar}
      onPointerDown={pausar}
      onTouchStart={pausar}
      onWheel={pausar}
      onMouseEnter={pausar}
      onFocusCapture={pausar}
      className="carrusel-pista overflow-x-auto pb-2"
    >
      {/* EL RELLENO LATERAL ALINEA LA PRIMERA TARJETA CON EL EJE DEL
          CONTENIDO, y ese eje depende de la pantalla, así que llega por prop.
          En una columna es px-6 en las dos rutas, porque ahí el contenedor ES
          el viewport. En lg cambia: en /galeria el encabezado va centrado con
          max-w-6xl y el relleno tiene que seguir su canto izquierdo --
          max(2rem, 50vw - 34rem), que es el px-8 del contenedor más la mitad
          de lo que sobra cuando el viewport pasa de 72rem --, mientras que en
          /menu el eje es el canto izquierdo de la columna derecha de la
          retícula. Sin esto, medido a 1280px en /galeria, el titular arrancaba
          en x=96 y la primera tarjeta en x=32. */}
      {/* El nombre va en el <ul> y no en el contenedor con scroll: un div sin
          rol no acepta nombre accesible y el aria-label se perdía. En la lista
          sí cuenta, y las copias no suman -- van aria-hidden --, así que se
          anuncia "Selección de trabajos, lista, 14 elementos". */}
      <ul
        ref={riel}
        aria-label="Selección de trabajos"
        className={`flex w-max items-stretch gap-4 ${rellenoRiel}`}
      >
        {tarjetas.map((f) =>
          f.copia === 0 ? (
            <li key={f.clave} className="shrink-0">
              <button
                type="button"
                onClick={() => onAbrir(f.indice)}
                className={`block ${tarjeta.clase} cursor-pointer overflow-hidden rounded-2xl transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!`}
              >
                <Image
                  src={miniatura(f.id)}
                  alt={f.alt}
                  width={MINIATURA_ANCHO}
                  height={MINIATURA_ALTO}
                  sizes={tarjeta.sizes}
                  loading="lazy"
                  draggable={false}
                  className="h-auto w-full"
                />
              </button>
            </li>
          ) : (
            <li key={f.clave} aria-hidden="true" className="shrink-0">
              <button
                type="button"
                tabIndex={-1}
                onClick={() => onAbrir(f.indice)}
                className={`block ${tarjeta.clase} cursor-pointer overflow-hidden rounded-2xl transition-opacity duration-150 hover:opacity-90`}
              >
                <Image
                  src={miniatura(f.id)}
                  alt=""
                  width={MINIATURA_ANCHO}
                  height={MINIATURA_ALTO}
                  sizes={tarjeta.sizes}
                  loading="lazy"
                  draggable={false}
                  className="h-auto w-full"
                />
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
