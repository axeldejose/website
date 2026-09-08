"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// VISOR DE BARAJA. Ventana contenida con una pila de imágenes que se navega
// deslizando: la de arriba sigue al dedo y se inclina, y al soltar sale de
// cuadro con impulso mientras la siguiente entra disolviéndose.
//
// Vive aparte porque lo usan dos pantallas con datos y cabeceras distintas: la
// guía de largos de /menu (cuatro láminas con su indicador de largo) y la
// galería de trabajos (56 fotografías). Lo que cambia entre las dos se pasa por
// props; el gesto, la ventana, el bloqueo del desplazamiento de atrás, el
// teclado y la accesibilidad son los mismos y viven aquí una sola vez.
//
// Lo que NO trae: el control que la abre. Cada pantalla tiene el suyo -- una
// cápsula de vidrio en la guía, una tarjeta del carrusel en la galería -- y es
// la que manda `abierto`.

export type Lamina = {
  id: string;
  archivo: string;
  alt: string;
};

type VisorBarajaProps = {
  laminas: Lamina[];
  // Dimensiones intrínsecas de los archivos. Fijan la proporción del marco por
  // estilo en línea y no por clase de Tailwind, para que el componente sirva a
  // cualquier proporción sin que haya que declararla en las dos puntas.
  ancho: number;
  alto: number;
  abierto: boolean;
  onCerrar: () => void;
  // Lámina por la que abre. En la guía siempre es la primera; en la galería es
  // la que se tocó en el carrusel.
  indiceInicial?: number;
  // aria-label del <dialog>: es la única etiqueta que tiene, porque la ventana
  // no lleva encabezado de texto en todos los casos.
  etiqueta: string;
  // Bloque de la izquierda de la cabecera, a la altura del botón de cerrar.
  encabezado?: (i: number) => ReactNode;
  // Centro del pie: los puntos en la guía, el contador en la galería. Recibe
  // `ir` porque los puntos de la guía saltan a una lámina cualquiera, no solo
  // a la vecina.
  pie?: (i: number, ir: (k: number) => void) => ReactNode;
  // Lo que se anuncia a lectores de pantalla al cambiar de lámina.
  anuncio: (i: number) => string;
  textoAnterior: string;
  textoSiguiente: string;
  // Alto mínimo de la cabecera. Con una cabecera que solo lleva el botón de
  // cerrar hay que forzarlo: el botón mide 44px pero su -mt-1 deja la fila en
  // 40, y el pie no puede bajar de 44 porque las flechas son de 44. Sin esto la
  // imagen queda 4px alta.
  altoCabecera?: string;
  // Alto mínimo del pie. Es lo que centra la imagen en la ventana: tiene que
  // igualar la altura de la cabecera, que depende de lo que se le pase. Con el
  // valor por omisión (44px) coincide con una cabecera que solo lleva el botón
  // de cerrar.
  altoPie?: string;
  // Alto de la ventana. Es la pieza que decide QUIÉN manda en el tamaño del
  // marco de la imagen, y depende de la proporción de las láminas:
  //
  // - Con alto fijo (el de la guía, `h-[min(92vh,46rem)]`), el hueco de la
  //   imagen tiene altura definida, el marco toma esa altura y de ella deduce su
  //   ancho por la proporción. Sirve para láminas MUY verticales -- 900x1599 --,
  //   donde el ancho que sale de la altura cabe de sobra.
  // - Con alto de contenido y tope (el de la galería, `h-fit max-h-[...]`), el
  //   hueco no tiene altura definida, así que el marco toma el ancho del
  //   contenedor y de ahí deduce su altura. Es lo que necesitan las láminas 4:5:
  //   medido, con alto fijo el ancho que pedía la proporción era 451px contra
  //   312 disponibles, el max-w-full recortaba el marco a 312x564 -- proporción
  //   0.553 en vez de 0.8 -- y object-cover se comía los costados de la foto.
  //
  // Cuando el tope entra en juego (pantallas bajas) el alto vuelve a ser
  // definido y el marco vuelve a deducir su ancho de la altura, así que la
  // imagen se encoge y sigue cabiendo entera. Los dos casos quedan cubiertos.
  //
  // Tiene que ser `h-fit` y no `h-auto`: .modal-largos fija position:fixed con
  // inset:0 -- que es lo que mantiene la geometría idéntica abierta y cerrada
  // durante el fundido --, y con `height:auto` entre top:0 y bottom:0 el
  // navegador resuelve el sobredeterminado estirando la caja de arriba abajo.
  // Medido: la ventana medía los 844px enteros del viewport. `fit-content` no
  // es `auto`, así que no entra en esa resolución y los márgenes automáticos la
  // siguen centrando.
  altoVentana?: string;
  // Cuántas láminas vecinas se montan además de la activa. Sin valor se montan
  // TODAS, que es lo que quiere la guía: sus cuatro archivos son ligeros y el
  // sentido de esa ventana es comparar, así que ninguna debe llegar en blanco.
  // La galería pasa 1: con 56 completas a ~160 KB, montarlas todas serían 9 MB
  // de red en la primera apertura.
  ventana?: number;
};

const GRADOS_POR_PX = 0.04; // ~4 grados a 100px de arrastre
const TOPE_GRADOS = 7;
// Espera antes de traer las vecinas. La activa se pide sola al abrir; las de
// los lados llegan mientras el usuario mira la primera, así que la apertura
// cuesta un archivo y el gesto siguiente ya encuentra la vecina descargada.
const RETRASO_VECINAS = 450;

export function VisorBaraja({
  laminas,
  ancho,
  alto,
  abierto,
  onCerrar,
  indiceInicial = 0,
  etiqueta,
  encabezado,
  pie,
  anuncio,
  textoAnterior,
  textoSiguiente,
  altoCabecera = "",
  altoPie = "min-h-11",
  altoVentana = "h-[min(92vh,46rem)]",
  ventana,
}: VisorBarajaProps) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(indiceInicial);
  // `montado` se enciende en la primera apertura y no se vuelve a apagar. Es lo
  // que permite que la salida se anime: si el contenido se desmontara al cerrar
  // -- como hacía antes -- la ventana se iría vacía, porque el transition de
  // salida corre después de close().
  const [montado, setMontado] = useState(abierto);
  const [vecinas, setVecinas] = useState(false);
  // Ajuste de estado en el render, no en un efecto: el contenido tiene que
  // existir ANTES de que corra showModal(), porque el navegador mueve el foco
  // al primer elemento enfocable del diálogo al abrir. Con un useEffect el
  // orden se invertía.
  const [visto, setVisto] = useState(abierto);
  if (abierto !== visto) {
    setVisto(abierto);
    if (abierto) {
      setMontado(true);
      setI(indiceInicial);
      setVecinas(false);
    }
  }

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  // BLOQUEO DEL DESPLAZAMIENTO DE ATRÁS. showModal() vuelve inerte el documento
  // pero NO impide que se desplace: medido, con la ventana abierta la rueda del
  // ratón movía la página de scrollY 300 a 700, así que al cerrar el usuario
  // aparecía en otro punto de la página.
  //
  // El padding compensa el ancho de la barra de desplazamiento cuando existe
  // (escritorio); si no se compensara, al ocultar el overflow la página de
  // atrás daría un salto horizontal. En móvil ese ancho es 0 y no hace nada.
  useEffect(() => {
    if (!abierto) return;
    const cuerpo = document.body;
    const overflowAnterior = cuerpo.style.overflow;
    const padAnterior = cuerpo.style.paddingRight;
    const barra = window.innerWidth - document.documentElement.clientWidth;
    cuerpo.style.overflow = "hidden";
    if (barra > 0) cuerpo.style.paddingRight = `${barra}px`;
    return () => {
      cuerpo.style.overflow = overflowAnterior;
      cuerpo.style.paddingRight = padAnterior;
    };
  }, [abierto]);

  // El <dialog> nativo cierra con Escape por su cuenta y emite "close": esto
  // solo sincroniza el estado de quien lo abrió.
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    const alCerrar = () => onCerrar();
    d.addEventListener("close", alCerrar);
    return () => d.removeEventListener("close", alCerrar);
  }, [onCerrar]);

  // Las vecinas, con retraso. Se rearma en cada cambio de lámina: al llegar a
  // una nueva se monta ella sola y sus lados vuelven a esperar.
  useEffect(() => {
    if (!abierto || ventana === undefined) return;
    setVecinas(false);
    const reloj = window.setTimeout(() => setVecinas(true), RETRASO_VECINAS);
    return () => clearTimeout(reloj);
  }, [abierto, i, ventana]);

  // ---- Pista de deslizamiento ----------------------------------------------
  //
  // Dos señales, y cada una cubre lo que la otra no:
  //
  // 1. EL EMPUJÓN. Al abrir, la carta de arriba se desplaza 28px a la
  //    izquierda, deja ver la siguiente por el canto y vuelve con rebote. No
  //    añade ningún elemento a la pantalla: enseña el gesto haciéndolo.
  // 2. EL RÓTULO "Desliza", que se va al primer gesto y es lo que sostiene la
  //    indicación con prefers-reduced-motion, donde el empujón no corre.
  const [pista, setPista] = useState(true);

  const mover = useCallback(
    (delta: number) => {
      setPista(false);
      setI((actual) =>
        Math.min(laminas.length - 1, Math.max(0, actual + delta)),
      );
    },
    [laminas.length],
  );

  const ir = useCallback(
    (k: number) => {
      setI(Math.min(laminas.length - 1, Math.max(0, k)));
    },
    [laminas.length],
  );

  const alTeclear = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      mover(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      mover(-1);
    }
  };

  // ---- Gesto de baraja ------------------------------------------------------
  //
  // Todo el arrastre se escribe DIRECTO al nodo por ref dentro de un
  // requestAnimationFrame: si pasara por estado de React habría un render por
  // fotograma y el gesto se sentiría con retraso.
  //
  // POR QUÉ SE TRABABA, y qué cambió. Antes el cambio de imagen se confirmaba
  // en el `transitionend` de la carta que salía, y mientras esa salida corría
  // (240ms) el gesto quedaba bloqueado con un `if (saliendo) return` en
  // pointerdown. Medido: cuatro arrastres seguidos a ritmo de teléfono
  // producían dos cambios -- uno de cada dos gestos se perdía. Ahora:
  //
  //   1. El índice se confirma AL SOLTAR, no al terminar la animación.
  //   2. La carta que sale se copia a una capa aparte (`saliendoDe`) que vuela
  //      y se desvanece por su cuenta, y se desmonta por temporizador, no por
  //      transitionend -- que no dispara si la transición se interrumpe.
  //   3. pointerdown ya no rechaza nada: se puede empezar un gesto nuevo
  //      encima de la salida anterior.
  //
  // La disolución de entrada convive con la baraja en vez de anularla: durante
  // el arrastre la carta de abajo sube de opacidad con la distancia (0.2 a 0.5),
  // y al confirmar, la nueva activa arranca en esa misma opacidad y termina en
  // 1 en 220ms.
  const carta = useRef<HTMLDivElement>(null);
  const nodoRevelado = useRef<HTMLDivElement>(null);
  const nodoSaliente = useRef<HTMLDivElement>(null);
  const inicioX = useRef<number | null>(null);
  const inicioY = useRef(0);
  const dx = useRef(0);
  const ultimo = useRef({ x: 0, t: 0 });
  const velocidad = useRef(0);
  const rafPendiente = useRef(false);
  const eje = useRef<"sin definir" | "horizontal" | "vertical">("sin definir");
  const [revelado, setRevelado] = useState<number | null>(null);
  const [saliendoDe, setSaliendoDe] = useState<{
    idx: number;
    dx: number;
  } | null>(null);
  // Opacidad a la que llegó la carta de abajo durante el arrastre. La nueva
  // activa arranca ahí para que la disolución no dé un salto al confirmar.
  const opacidadEntrada = useRef(0.5);
  // Temporizadores del empujón de apertura. Se cancelan en cuanto el usuario
  // toca la baraja: si no, sus escrituras de transform pisaban el arrastre.
  const relojesPista = useRef<number[]>([]);

  const reducido = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pintar = () => {
    rafPendiente.current = false;
    const n = carta.current;
    if (!n) return;
    const d = dx.current;
    const g = Math.max(-TOPE_GRADOS, Math.min(TOPE_GRADOS, d * GRADOS_POR_PX));
    n.style.transform = `translate3d(${d}px,0,0) rotate(${g}deg)`;

    // La carta de abajo se disuelve con el gesto: cuanto más lejos va el dedo,
    // más presente está la siguiente.
    const r = nodoRevelado.current;
    if (r) {
      const avance = Math.min(1, Math.abs(d) / ((n.offsetWidth || 300) * 0.55));
      const o = 0.2 + 0.3 * avance;
      opacidadEntrada.current = o;
      r.style.opacity = String(o);
    }
  };

  const puedeIr = (delta: number) =>
    i + delta >= 0 && i + delta < laminas.length;

  const alBajar = (e: React.PointerEvent<HTMLDivElement>) => {
    setPista(false);
    relojesPista.current.forEach((t) => clearTimeout(t));
    relojesPista.current = [];
    inicioX.current = e.clientX;
    inicioY.current = e.clientY;
    dx.current = 0;
    eje.current = "sin definir";
    velocidad.current = 0;
    ultimo.current = { x: e.clientX, t: performance.now() };
    const n = carta.current;
    if (n) {
      n.style.transition = "none";
      n.style.opacity = "1";
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const alMover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (inicioX.current === null) return;
    const bx = e.clientX - inicioX.current;
    const by = e.clientY - inicioY.current;

    // Decide el eje una sola vez: si el dedo va claramente en vertical, suelta
    // el gesto para que la página siga desplazándose.
    if (eje.current === "sin definir") {
      if (Math.abs(bx) < 8 && Math.abs(by) < 8) return;
      eje.current = Math.abs(bx) > Math.abs(by) ? "horizontal" : "vertical";
      if (eje.current === "vertical") {
        inicioX.current = null;
        return;
      }
    }

    const ahora = performance.now();
    const dt = ahora - ultimo.current.t;
    if (dt > 0) velocidad.current = (e.clientX - ultimo.current.x) / dt;
    ultimo.current = { x: e.clientX, t: ahora };

    // Resistencia cuando no hay carta a ese lado: se mueve, pero cuesta.
    const direccion = bx < 0 ? 1 : -1;
    dx.current = puedeIr(direccion) ? bx : bx * 0.3;

    // Con movimiento reducido el gesto SÍ funciona: se sigue midiendo y al
    // soltar cambia la imagen. Lo que se omite es el movimiento.
    if (reducido()) return;

    if (revelado === null && puedeIr(direccion)) setRevelado(i + direccion);

    if (!rafPendiente.current) {
      rafPendiente.current = true;
      requestAnimationFrame(pintar);
    }
  };

  const alSoltar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (inicioX.current === null) {
      setRevelado(null);
      return;
    }
    inicioX.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);

    const n = carta.current;
    const anchoCarta = n?.offsetWidth ?? 300;
    const umbral = Math.max(56, anchoCarta * 0.22);
    const d = dx.current;
    const direccion = d < 0 ? 1 : -1;
    // El impulso cuenta: un movimiento corto pero rápido también descarta.
    const impulso = Math.abs(velocidad.current) > 0.6;
    const descarta =
      puedeIr(direccion) &&
      (Math.abs(d) > umbral || (impulso && Math.abs(d) > 20));

    if (descarta) {
      // Confirmar YA: el índice cambia en este mismo evento y la carta vieja
      // se va en su propia capa. Así el gesto siguiente encuentra la baraja
      // libre desde el primer milisegundo.
      dx.current = 0;
      setRevelado(null);
      if (!reducido()) setSaliendoDe({ idx: i, dx: d });
      mover(direccion);
      return;
    }

    dx.current = 0;
    setRevelado(null);
    if (!n || reducido()) return;
    // Rebote suave: la curva sobrepasa el 0 y vuelve.
    n.style.transition = "transform 340ms cubic-bezier(.34,1.46,.64,1)";
    n.style.transform = "translate3d(0,0,0) rotate(0deg)";
  };

  // La capa de salida: arranca donde quedó el dedo y vuela fuera de cuadro
  // desvaneciéndose. Se desmonta por temporizador, no por transitionend.
  useLayoutEffect(() => {
    if (!saliendoDe) return;
    const n = nodoSaliente.current;
    if (!n) return;
    const anchoCarta = n.offsetWidth || 300;
    const signo = saliendoDe.dx < 0 ? -1 : 1;
    const g = Math.max(
      -TOPE_GRADOS,
      Math.min(TOPE_GRADOS, saliendoDe.dx * GRADOS_POR_PX),
    );
    n.style.transition = "none";
    n.style.transform = `translate3d(${saliendoDe.dx}px,0,0) rotate(${g}deg)`;
    n.style.opacity = "1";
    // Reflow forzado ANTES de poner la transición. Con requestAnimationFrame no
    // funcionaba: el callback corre antes del pintado del mismo fotograma, así
    // que el navegador nunca veía el estado inicial y la transición no
    // arrancaba -- medido, la capa se quedaba quieta 120ms y luego saltaba.
    void n.offsetWidth;
    n.style.transition =
      "transform 260ms cubic-bezier(.32,.72,0,1), opacity 240ms linear";
    n.style.transform = `translate3d(${(anchoCarta + 140) * signo}px,0,0) rotate(${signo * 12}deg)`;
    n.style.opacity = "0";
    const reloj = window.setTimeout(() => setSaliendoDe(null), 320);
    return () => clearTimeout(reloj);
  }, [saliendoDe]);

  // Cada vez que cambia la lámina activa -- por gesto, teclado, flechas o
  // puntos -- la carta arranca centrada y entra disolviéndose. useLayoutEffect
  // y no useEffect: con useEffect el navegador alcanzaba a pintar un fotograma
  // de la carta nueva en la posición vieja.
  useLayoutEffect(() => {
    const n = carta.current;
    if (!n) return;
    n.style.transition = "none";
    n.style.transform = "translate3d(0,0,0) rotate(0deg)";
    dx.current = 0;
    if (reducido()) {
      n.style.opacity = "1";
      return;
    }
    n.style.opacity = String(opacidadEntrada.current);
    void n.offsetWidth;
    n.style.transition = "opacity 220ms ease-out";
    n.style.opacity = "1";
    opacidadEntrada.current = 0.5;
  }, [i, abierto]);

  // El empujón de apertura. Sus tres temporizadores quedan registrados en
  // relojesPista para que alBajar los pueda cancelar: si el usuario arrastra
  // dentro del primer segundo y medio, estas escrituras de transform pisaban su
  // gesto. Era la mitad del trabón.
  useEffect(() => {
    if (!abierto) return;
    setPista(true);
    if (reducido()) return;
    const n = carta.current;
    if (!n) return;
    const vecina =
      indiceInicial + 1 < laminas.length ? indiceInicial + 1 : null;
    if (vecina !== null) setRevelado(vecina);
    const t1 = window.setTimeout(() => {
      n.style.transition = "transform 420ms cubic-bezier(.32,.72,0,1)";
      n.style.transform = "translate3d(-28px,0,0) rotate(-1deg)";
    }, 450);
    const t2 = window.setTimeout(() => {
      n.style.transition = "transform 560ms cubic-bezier(.34,1.3,.64,1)";
      n.style.transform = "translate3d(0,0,0) rotate(0deg)";
    }, 950);
    const t3 = window.setTimeout(() => setRevelado(null), 1600);
    relojesPista.current = [t1, t2, t3];
    return () => {
      relojesPista.current.forEach((t) => clearTimeout(t));
      relojesPista.current = [];
    };
  }, [abierto, indiceInicial, laminas.length]);

  // Qué láminas existen en el DOM. Una <img> con src se descarga aunque esté
  // con el atributo hidden, así que el ahorro solo se consigue no montándola.
  const montada = (k: number) => {
    if (ventana === undefined) return true;
    if (k === i) return true;
    if (revelado === k) return true;
    if (saliendoDe?.idx === k) return true;
    return vecinas && Math.abs(k - i) <= ventana;
  };

  const sizes = "(min-width: 640px) 22rem, 88vw";
  const proporcion = { aspectRatio: `${ancho} / ${alto}` };

  return (
    <dialog
      ref={dialogo}
      aria-label={etiqueta}
      onKeyDown={alTeclear}
      className={`modal-largos m-auto w-[min(92vw,22rem)] overflow-hidden rounded-3xl bg-tierra p-5 text-shell-lift ${altoVentana}`}
    >
      {/* VENTANA CONTENIDA, no a sangre. 92vw por 92vh con tope de 22rem y
          46rem, así que siempre queda margen visible y el fondo atenuado deja
          ver la página detrás (tierra al 72% con blur de 8px, en globals.css).

          Superficie limpia: `tierra` opaco, sin borde y sin sombra. El radio es
          rounded-3xl (24px), un paso por encima del rounded-2xl (16px) de las
          tarjetas del sitio, porque la superficie es mucho mayor y el radio
          escala con ella; el marco de la imagen vuelve a 16px.

          La entrada y la salida están en globals.css: solo opacidad, sin escala
          ni desplazamiento, con `display`/`overlay` en allow-discrete para que
          la ventana no desaparezca en el primer fotograma.

          OJO: la columna flex va en el div de dentro, no en el <dialog>. La
          utilidad `flex` fija display:flex y eso PISA el `dialog:not([open])
          { display: none }` del navegador, así que la ventana cerrada seguía
          ocupando el viewport entero -- invisible por la opacidad 0, pero
          interceptando todos los clics de la página. */}
      {montado && (
        <div className="flex h-full flex-col">
          <div
            className={`flex items-start justify-between gap-4 ${altoCabecera}`}
          >
            {encabezado ? encabezado(i) : <span />}

            {/* CERRAR: primer hijo enfocable de la ventana, así que recibe el
                foco al abrir y es la primera parada del tabulador. Disco de
                44px sin borde -- la superficie ya es opaca, no hace falta
                vidrio -- con la cruz de trazo de 1.25px. */}
            <button
              type="button"
              autoFocus
              onClick={onCerrar}
              className="-mr-1 -mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-shell-lift/10 text-shell-lift transition-colors duration-150 hover:bg-shell-lift/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.25}
                className="size-4"
              >
                <path strokeLinecap="round" d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
              </svg>
              <span className="sr-only">Cerrar</span>
            </button>
          </div>

          {/* LA IMAGEN, COMPLETA Y CON AIRE. El área toma el alto que sobra
              (flex-1 con min-h-0) y el marco lleva la proporción exacta de los
              archivos, así que object-cover no recorta ni un píxel. Se centra
              con mx-auto, así que cuando el alto disponible es el que manda
              queda aire a los lados en vez de estirarse.

              Los gestos viven aquí, no en el diálogo: así el arrastre no
              compite con el cierre. `isolate` contiene el z-10 de la carta de
              arriba. */}
          <div className="mt-6 min-h-0 flex-1">
            <div
              onPointerDown={alBajar}
              onPointerMove={alMover}
              onPointerUp={alSoltar}
              onPointerCancel={alSoltar}
              onDragStart={(e) => e.preventDefault()}
              style={proporcion}
              className="relative mx-auto isolate h-full max-w-full touch-pan-y cursor-grab overflow-hidden rounded-2xl select-none active:cursor-grabbing"
            >
              {/* Carta de abajo: la que se revela durante el arrastre. Arranca
                  casi transparente y sube de opacidad con la distancia del
                  gesto, en pintar(). Es la primera mitad de la disolución; la
                  segunda la remata la carta activa al confirmar. */}
              {revelado !== null && (
                <div ref={nodoRevelado} className="absolute inset-0 opacity-20">
                  <Image
                    key={laminas[revelado].id}
                    src={laminas[revelado].archivo}
                    alt={laminas[revelado].alt}
                    width={ancho}
                    height={alto}
                    sizes={sizes}
                    priority
                    draggable={false}
                    className="size-full object-cover"
                  />
                </div>
              )}

              <div
                ref={carta}
                className="absolute inset-0 z-10 will-change-transform"
              >
                {laminas.map((l, k) =>
                  montada(k) ? (
                    <Image
                      key={l.id}
                      src={l.archivo}
                      alt={l.alt}
                      width={ancho}
                      height={alto}
                      sizes={sizes}
                      priority
                      hidden={k !== i}
                      draggable={false}
                      className="size-full object-cover"
                    />
                  ) : null,
                )}
              </div>

              {/* Capa de salida: copia de la carta descartada. Arranca donde
                  quedó el dedo, vuela fuera de cuadro y se desvanece, encima de
                  la nueva activa, y se desmonta a los 320ms por temporizador.
                  Al vivir aparte, la baraja queda libre para el gesto siguiente
                  en el mismo instante en que se suelta. */}
              {saliendoDe !== null && (
                <div
                  ref={nodoSaliente}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 will-change-transform"
                >
                  <Image
                    src={laminas[saliendoDe.idx].archivo}
                    alt=""
                    width={ancho}
                    height={alto}
                    sizes={sizes}
                    priority
                    draggable={false}
                    className="size-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* PIE: flechas, el indicador de posición que le pasen y el rótulo de
              la pista. mt-6 igual que el aire de arriba de la imagen.

              EL min-h ES LO QUE CENTRA LA IMAGEN: tiene que valer lo mismo que
              mide la cabecera, y la cabecera depende del encabezado que reciba.
              Si se cambia el cuerpo del indicador, este número hay que
              remedirlo. */}
          <div className={`mt-6 flex items-center gap-3 ${altoPie}`}>
            <button
              type="button"
              onClick={() => mover(-1)}
              disabled={i === 0}
              className="inline-flex size-11 shrink-0 items-center justify-center text-shell-lift/70 transition-opacity duration-150 hover:text-shell-lift disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                className="size-3 rotate-90"
              >
                <path strokeLinecap="round" d="M2.5 4.5L6 8l3.5-3.5" />
              </svg>
              <span className="sr-only">{textoAnterior}</span>
            </button>

            {pie ? pie(i, ir) : null}

            <button
              type="button"
              onClick={() => mover(1)}
              disabled={i === laminas.length - 1}
              className="inline-flex size-11 shrink-0 items-center justify-center text-shell-lift/70 transition-opacity duration-150 hover:text-shell-lift disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                className="size-3 -rotate-90"
              >
                <path strokeLinecap="round" d="M2.5 4.5L6 8l3.5-3.5" />
              </svg>
              <span className="sr-only">{textoSiguiente}</span>
            </button>

            {/* La pista de deslizamiento, en la voz de uso de la página. Se
                desvanece por opacidad al primer gesto, así que nada se mueve de
                sitio. */}
            <span
              aria-hidden="true"
              className={`ml-auto text-[11px] uppercase tracking-[0.25em] text-shell-lift/55 transition-opacity duration-300 ${
                pista ? "opacity-100" : "opacity-0"
              }`}
            >
              Desliza
            </span>
          </div>

          {/* Región viva: anuncia el cambio de lámina a lectores de pantalla,
              que no "ven" el reemplazo de la imagen. */}
          <p aria-live="polite" className="sr-only">
            {anuncio(i)}
          </p>
        </div>
      )}
    </dialog>
  );
}
