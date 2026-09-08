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
  // FOCO MÓVIL. Enciende la jerarquía en movimiento: la tarjeta que pasa por el
  // centro del encuadre crece y llega a plena nitidez, y al salir vuelve
  // gradualmente a su tamaño base. Sin este valor todas las tarjetas se ven
  // iguales y quietas -- es decir, /galeria no cambia en nada.
  //
  // El TAMAÑO BASE es uno solo para todas (`tarjeta.clase`). Hubo una versión
  // con tres anchos alternos en un motivo de siete pasos, para dar ritmo de
  // composición a la fila quieta, y se retiró: la única variación de escala es
  // la del centro.
  foco?: boolean;
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

// ── EL FOCO MÓVIL ───────────────────────────────────────────────────────────
// La tarjeta que pasa por el centro del encuadre crece y se muestra a plena
// nitidez; las de los costados se reducen y se atenúan. Es una función continua
// de la distancia al centro, no dos estados con un salto entre ellos.
//
// LA ESCALA VA EN transform, no en el ancho. Un transform no reflowa: la
// retícula del riel, el ancho de una copia y la costura del bucle siguen
// midiendo lo mismo con el foco encendido que sin él. Y por ser una escala
// uniforme, la proporción 4:5 de la foto no se toca -- no hay recorte ni
// deformación posible.
//
// LOS VALORES. 1 en los costados y 1.10 en el centro: los costados están en su
// TAMAÑO BASE -- no se encogen -- y lo único que varía es el crecimiento de la
// protagonista, un 10%. Antes eran 0.92 y 1.04, que repartía la diferencia
// entre las dos y dejaba a las de los lados por debajo de su tamaño propio.
//
// El 10% tiene un techo, y no es estético: la tarjeta realzada se sale de su
// caja la mitad de su crecimiento por arriba y por abajo, y la pista es un
// contenedor con overflow-x:auto -- lo que hace que su overflow-y también sea
// auto --, así que lo que se salga genera desplazamiento vertical. Con la
// tarjeta más alta del proyecto (9rem de ancho, 180px de alto a 640px en
// adelante) el 10% se sale 9px por lado, y el relleno de la pista es de 12.
//
// La atenuación es solo de opacidad, hasta 0.6: ni desenfoque ni sombra ni
// marco, que competirían con la fotografía.
const FOCO_ESCALA_CENTRO = 1.1;
const FOCO_ESCALA_BORDE = 1;
const FOCO_OPACIDAD_BORDE = 0.6;
// Radio de influencia, en fracción del ancho visible de la pista. A 0.44 de un
// teléfono de 390px son 172px, y el paso entre tarjetas ronda los 133: así solo
// la del centro y sus dos vecinas inmediatas reciben algo de realce, y queda
// UNA protagonista clara en vez de tres a medias.
const FOCO_RADIO = 0.44;

export function CarruselGaleria({
  fotos,
  onAbrir,
  activo = true,
  rellenoRiel = "px-6 lg:pl-[max(2rem,calc(50vw-34rem))] lg:pr-[max(2rem,calc(50vw-34rem))]",
  tarjeta = TARJETA_GALERIA,
  foco = false,
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

  // ESCALA UNIFORME CON prefers-reduced-motion. Con la preferencia puesta no hay
  // giro ni realce: las catorce fotografías se ven al mismo tamaño y a la misma
  // nitidez. El estado arranca en false en los dos lados -- servidor y cliente
  // -- así que no hay desajuste de hidratación, y el listener deja que responda
  // al cambio en caliente desde el sistema operativo.
  const [uniforme, setUniforme] = useState(false);
  useEffect(() => {
    if (!foco) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sincronizar = () => setUniforme(mq.matches);
    sincronizar();
    mq.addEventListener("change", sincronizar);
    return () => mq.removeEventListener("change", sincronizar);
  }, [foco]);

  const conFoco = foco && !uniforme;

  // Centro de cada tarjeta en coordenadas de contenido del riel, medido UNA vez
  // y no por fotograma: leer una caja por tarjeta en cada cuadro forzaría un
  // recálculo de diseño 60 veces por segundo. Los anchos son relativos al
  // viewport, así que se vuelve a medir al redimensionar.
  const geometria = useRef<{ centro: number; el: HTMLElement }[]>([]);

  const medir = useCallback(() => {
    const p = pista.current;
    const r = riel.current;
    if (!p || !r) {
      geometria.current = [];
      return;
    }
    const cajaPista = p.getBoundingClientRect();
    const sl = p.scrollLeft;
    geometria.current = Array.from(r.children).map((hijo) => {
      const li = hijo as HTMLElement;
      const caja = li.getBoundingClientRect();
      return {
        centro: caja.left - cajaPista.left + sl + caja.width / 2,
        el: li,
      };
    });
  }, []);

  // EL PINTOR. Escribe dos propiedades personalizadas en el <li>; la escala y
  // la opacidad las resuelve el <button> leyéndolas. Así el estado de cursor o
  // de foco de teclado puede fijar su propio valor en el botón y ganarle al
  // heredado, sin marcas de importancia y sin que el pintor tenga que saber
  // nada de la interacción.
  //
  // Solo calcula las tarjetas dentro del radio -- tres o cuatro en un teléfono.
  // Las de fuera valen exactamente el valor de borde, así que se escriben una
  // sola vez al cruzar la frontera y no en cada cuadro.
  const pintarFoco = useCallback((sl: number) => {
    const p = pista.current;
    const g = geometria.current;
    if (!p || !g.length) return;
    const centroVista = sl + p.clientWidth / 2;
    const radio = p.clientWidth * FOCO_RADIO;
    if (radio <= 0) return;
    for (let i = 0; i < g.length; i += 1) {
      const { el } = g[i];
      const d = Math.abs(g[i].centro - centroVista);
      if (d >= radio) {
        if (el.dataset.foco !== "borde") {
          el.dataset.foco = "borde";
          el.style.setProperty("--foco-escala", String(FOCO_ESCALA_BORDE));
          el.style.setProperty("--foco-opacidad", String(FOCO_OPACIDAD_BORDE));
        }
        continue;
      }
      // Suavizado de tercer grado: llega y sale del centro sin aristas, así que
      // no hay ningún instante en que el realce parezca encenderse.
      const x = 1 - d / radio;
      const f = x * x * (3 - 2 * x);
      el.dataset.foco = "cerca";
      el.style.setProperty(
        "--foco-escala",
        (
          FOCO_ESCALA_BORDE +
          (FOCO_ESCALA_CENTRO - FOCO_ESCALA_BORDE) * f
        ).toFixed(4),
      );
      el.style.setProperty(
        "--foco-opacidad",
        (FOCO_OPACIDAD_BORDE + (1 - FOCO_OPACIDAD_BORDE) * f).toFixed(3),
      );
    }
  }, []);

  // Al apagarse -- por movimiento reducido o porque la ruta no pide foco -- se
  // limpian las dos propiedades y el botón cae en sus valores por omisión
  // (escala 1, opacidad 1): todas las tarjetas iguales, sin realce.
  useEffect(() => {
    if (conFoco) return;
    geometria.current.forEach(({ el }) => {
      delete el.dataset.foco;
      el.style.removeProperty("--foco-escala");
      el.style.removeProperty("--foco-opacidad");
    });
  }, [conFoco]);

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
    medir();
    if (conFoco) pintarFoco(inicio);
  }, [unidad, medir, pintarFoco, conFoco]);

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
      // Una sola lectura de scrollLeft, y arriba: el pintor escribe estilos al
      // final del cuadro, así que leer después de escribir alternaría lectura y
      // escritura de diseño en cada fotograma.
      const sl = conFoco ? el.scrollLeft : 0;
      if (!previo) {
        previo = t;
        if (conFoco) pintarFoco(sl);
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
        // Quieto no significa desactualizado: mientras el usuario arrastra, el
        // giro está en pausa y el foco tiene que seguir su dedo.
        if (conFoco) pintarFoco(sl);
        return;
      }

      const u = unidad();
      if (u <= 0) {
        if (conFoco) pintarFoco(sl);
        return;
      }
      posicion.current += (VELOCIDAD_PX_S * dt) / 1000;
      // La costura: al pasar de la copia del medio a la tercera, se resta una
      // copia. El contenido de las dos es idéntico, así que el salto no se ve.
      if (posicion.current >= u * 2) posicion.current -= u;
      el.scrollLeft = posicion.current;
      if (conFoco) pintarFoco(posicion.current);
    };

    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [unidad, conFoco, pintarFoco]);

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
      // Los anchos son relativos al viewport, así que los centros cambian.
      medir();
      if (conFoco && el) pintarFoco(el.scrollLeft);
    };
    window.addEventListener("resize", alRedimensionar);
    return () => window.removeEventListener("resize", alRedimensionar);
  }, [medir, pintarFoco, conFoco]);

  // Se encendió o apagó el foco, así que hay que rehacer la medida: el relleno
  // vertical de la pista cambia con él y los centros se mueven.
  useEffect(() => {
    medir();
    const el = pista.current;
    if (conFoco && el) pintarFoco(el.scrollLeft);
  }, [uniforme, foco, medir, pintarFoco, conFoco]);

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

  // LA ESCALA Y LA OPACIDAD LAS RESUELVE EL BOTÓN, leyendo las dos propiedades
  // que el pintor escribe en el <li>. Los estados de cursor y de foco de teclado
  // fijan su propio valor aquí mismo, y por estar declarados en el propio
  // elemento le ganan al heredado: una tarjeta atenuada bajo el cursor o con el
  // anillo de foco puesto se ve mal, y así llega a plena nitidez sin que el
  // pintor tenga que enterarse.
  //
  // El realce de opacidad al pasar el cursor se retira cuando el foco está
  // encendido: ahí la opacidad ya la gobierna la distancia al centro, y dos
  // reglas peleándose por la misma propiedad daban un parpadeo.
  const claseFoco = conFoco
    ? "[transform:scale(var(--foco-escala,1))] [opacity:var(--foco-opacidad,1)] transition-[transform,opacity] duration-150 ease-out hover:[--foco-escala:1.1] hover:[--foco-opacidad:1] focus-visible:[--foco-escala:1.1] focus-visible:[--foco-opacidad:1]"
    : "transition-opacity duration-150 hover:opacity-90";

  return (
    <div
      ref={pista}
      onScroll={alDesplazar}
      onPointerDown={pausar}
      onTouchStart={pausar}
      onWheel={pausar}
      onMouseEnter={pausar}
      onFocusCapture={pausar}
      // pb-2 sin foco, py-3 con él: la tarjeta del centro se sale de su caja la
      // mitad de su crecimiento por arriba y por abajo -- 9px con la tarjeta
      // más alta --, y la pista es un contenedor con overflow-x:auto, lo que
      // hace que su overflow-y también sea auto. Sin ese hueco, la tarjeta
      // realzada generaba desplazamiento vertical dentro de la tira.
      className={`carrusel-pista overflow-x-auto ${foco ? "py-3" : "pb-2"}`}
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
        // items-center con foco: la tarjeta realzada crece desde su centro, así
        // que las catorce comparten eje horizontal y el crecimiento se reparte
        // por igual arriba y abajo. Sin foco, stretch y center son equivalentes
        // -- todas miden lo mismo y nada las escala --, así que /galeria queda
        // igual.
        className={`flex w-max gap-4 ${foco ? "items-center" : "items-stretch"} ${rellenoRiel}`}
      >
        {tarjetas.map((f) =>
          f.copia === 0 ? (
            <li key={f.clave} className="shrink-0">
              <button
                type="button"
                onClick={() => onAbrir(f.indice)}
                className={`block ${tarjeta.clase} cursor-pointer overflow-hidden rounded-2xl ${claseFoco} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!`}
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
                className={`block ${tarjeta.clase} cursor-pointer overflow-hidden rounded-2xl ${claseFoco}`}
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
