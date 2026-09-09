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
  // LA SUPERFICIE DE LA VENTANA, y con ella las cinco tintas que dependen de
  // ella. Un solo valor y no dos banderas: `claro` y un hipotético `terracota`
  // serían dos interruptores para la misma decisión, y nada impediría
  // encenderlos a la vez. Las recetas están en PIELES, arriba.
  //
  //   tierra     el café de siempre. El visor de /galeria.
  //   shell      el beige de la marca, con tinta oscura. La galería de /menu.
  //   terracota  dune, con tinta crema. La guía de largos.
  //
  // Sin valor es `tierra`, así que quien no pida nada no cambia.
  fondo?: "tierra" | "shell" | "terracota";
  // ME GUSTA POR FOTOGRAFÍA. Con una clave, cada lámina gana un corazón sobre
  // la imagen y su estado se guarda en localStorage bajo esa clave. Sin clave
  // no hay corazón: la guía de largos y el visor de /galeria no cambian.
  //
  // La clave la pone la ruta y no el componente, porque es un dato del
  // navegador de la persona y su nombre tiene que ser estable en el tiempo:
  // cambiarlo borra los favoritos de todo el mundo.
  claveFavoritos?: string;
  // FÍSICA DE BARAJA. Cambia el gesto de "diapositiva que se desliza" a "carta
  // que se suelta de la mano": la carta sale del cuadro sin recortarse, la
  // velocidad de salida la pone el gesto, el giro pivota por debajo de la
  // carta, la de atrás avanza sincronizada con el dedo y el arrastre corto
  // vuelve con un asentamiento elástico.
  //
  // Sin este valor el gesto es el de siempre. Es lo que deja intactos el visor
  // de /galeria y la guía de largos.
  fisica?: boolean | Partial<AjustesFisica>;
  // Aire vertical entre el marco de la imagen y la cabecera y el pie. Los
  // laterales no pasan por aquí: son el relleno de la ventana.
  aireMarco?: string;
};

const GRADOS_POR_PX = 0.04; // ~4 grados a 100px de arrastre
const TOPE_GRADOS = 7;

// ── FÍSICA DE BARAJA (solo con la prop `fisica`) ────────────────────────────
// EL PIVOTE, expresado como fracción del alto de la carta medida desde su borde
// superior: 1.35 lo pone a un 35% del alto POR DEBAJO del canto inferior, que
// para una carta de 390px son 137px más abajo. Es la distancia de la muñeca a
// la carta cuando se suelta de la mano.
//
// Más abajo (2.0, 2.5) el giro se convierte en una traslación lateral y el
// balanceo desaparece; más arriba (1.05) es indistinguible de rotar sobre el
// centro. 1.35 es donde el canto de arriba se abre claramente más que el de
// abajo sin que la carta parezca colgar de una cuerda.
const PIVOTE_FISICA = 1.35;

// LO QUE SE PUEDE AFINAR POR PANTALLA. La mecánica es una sola y vive aquí; lo
// que cambia entre la galería y la guía de largos es el tempo, porque no hacen
// lo mismo: en la galería se DESCARTA una foto y en la guía se COMPARAN cuatro
// largos entre sí, y comparar necesita tiempo para registrar que se dejó atrás
// uno y llegó otro.
export type AjustesFisica = {
  // Recorrido de la salida, como fracción del que usa la galería (que es el que
  // saca la carta de la pantalla). Tiene un piso duro más abajo: por poco que
  // se reduzca, la carta siempre sale del marco.
  recorrido: number;
  // Topes de la duración de salida, en ms.
  salidaMs: [number, number];
  // Factor sobre la velocidad medida al soltar. Por encima de 1 la carta sale
  // con más impulso del que traía el dedo; por debajo, con menos.
  impulso: number;
  // Recorrido angular durante el arrastre, en grados.
  topeGrados: number;
  // Giro de la salida, del gesto más lento al más rápido, en grados.
  giroSalida: [number, number];
  // Cuánto tarda la carta nueva en llegar a su opacidad y escala plenas. Es lo
  // que hay que igualar si la pantalla acompaña el cambio con algo más -- el
  // indicador de largo de la guía, por ejemplo.
  entradaMs: number;
};

// LOS DE LA GALERÍA, que son los que se afinaron midiendo el gesto: reparto de
// duración de 4.7x entre un arrastre lento y un lanzamiento, y salida fuera de
// pantalla.
const FISICA_GALERIA: AjustesFisica = {
  recorrido: 1,
  salidaMs: [120, 560],
  impulso: 1.3,
  topeGrados: 10,
  giroSalida: [12, 22],
  entradaMs: 220,
};

// Ventana de velocidad utilizable, en px/ms, ya con el factor de impulso
// aplicado. Por debajo de 0.28 el gesto no fue un lanzamiento sino un empujón, y
// la salida se va al tope lento; por encima de 3.6 px/ms (unos 3600 px/s, más
// rápido que cualquier pulgar sostenido) el dato suele ser ruido del último
// fotograma.
const VELOCIDAD_MIN = 0.28;
const VELOCIDAD_MAX = 3.6;
// Espera antes de traer las vecinas. La activa se pide sola al abrir; las de
// los lados llegan mientras el usuario mira la primera, así que la apertura
// cuesta un archivo y el gesto siguiente ya encuentra la vecina descargada.
const RETRASO_VECINAS = 450;

// ── LAS TRES SUPERFICIES DE LA VENTANA ──────────────────────────────────────
//
// Son los cinco sitios de este componente donde el color depende del fondo,
// agrupados por superficie para que no se puedan desincronizar. No es un tema
// genérico ni el arranque de uno: son tres recetas cerradas, cada una medida
// sobre su propio fondo.
//
// EL CONTRASTE NO ES SIMÉTRICO ENTRE ELLAS, y de ahí que las opacidades no se
// puedan copiar de una a otra. El mismo "crema al 55%" mide 5.07:1 sobre el café
// y 2.53:1 sobre el terracota. Lo que manda es el TECHO de cada superficie: el
// contraste de la tinta más clara disponible (shell-lift) contra ese fondo.
//
//   tierra      #2a1d14  Lrel 0.0142   techo 13.67:1   holgura de sobra
//   shell       #e9dfc6  Lrel 0.7418   techo 12.33:1 (con tinta tierra)
//   terracota   #a05035  Lrel 0.1347   techo  4.75:1   al filo del mínimo
//
// TIERRA es el café de siempre: el visor de /galeria. Con 13.67:1 de techo cada
// tinta puede bajar de opacidad hasta donde lo pida la jerarquía.
//
// SHELL es el beige de la marca, con tinta oscura: la galería de /menu. Estuvo
// en blanco puro y se leía clínico, fuera del registro del sitio -- todo lo
// demás vive en el rango cálido --, y shell es el fondo oficial (el que lleva el
// <body>), así que la ventana pasa a ser la superficie del sistema y no una
// excepción. Sus flechas son de 28px y no de 44, y el área de toque la reponen
// sus 8px de ::after por lado: es lo que permite que su pie sea una franja
// delgada sin bajar del suelo de 44px de acierto.
//
// TERRACOTA es dune, con tinta crema: la guía de largos. Es la única de las tres
// con el techo pegado al mínimo, y eso decide todos sus tonos:
//
//   subtítulo y pista, 11px   shell-lift PLENO   4.75:1   (mínimo 4.5)
//   flechas                   shell-lift/80      3.65:1   (mínimo 3)
//   punto inactivo            shell-lift/70      3.17:1   (mínimo 3)
//   cruz del cierre           shell-lift         4.00:1 sobre su propio disco
//
// Sobre esta superficie NO EXISTE una tinta discreta que pase el piso de
// contraste para 11px: shell-lift al 100% da 4.75:1 y cualquier opacidad por
// debajo cae del 4.5. Lo que mantiene subordinado al subtítulo y a la pista no
// es la opacidad sino la escala y el interletrado. Si algún día hace falta
// recuperar tonos de tinta graduados sobre terracota, el camino es dune-deep
// (#8a4229), que sube el techo a 6.07:1 -- a cambio de acercar el fondo todavía
// más a los rojos de las láminas.
//
// EL MARCO GANA CONTORNO en shell y en terracota, y por el mismo motivo en las
// dos: el canto de la lámina deja de separarse por valor. Sobre el café la foto
// es mucho más clara que el fondo; sobre el beige, una foto de fondo claro se
// desangra en la ventana, y sobre el terracota el canto superior de las láminas
// -- follaje verde oliva -- mide 1.08:1 contra la superficie.
//
// Y NO PUEDE SER UN `ring-inset`, que es como estuvo escrito y por eso no se
// veía. Un box-shadow interior se pinta encima del FONDO del elemento pero
// DEBAJO de sus hijos, y el hijo de este marco es una fotografía a sangre que lo
// tapa entero. Comprobado a la brava: con un inset de 3px en verde puro, el
// render no tenía un solo píxel verde en el canto del marco. De ahí que el
// contorno viva en un pseudo-elemento, por encima de las tres capas de la
// baraja (z 10, 20 y 30). Sigue sin mover la geometría del marco ni la
// proporción de la imagen: es un borde sobre inset-0.
const ANILLO_MARCO =
  "after:pointer-events-none after:absolute after:inset-0 after:z-40 after:rounded-2xl after:border after:content-['']";

const PIELES = {
  tierra: {
    ventanaFondo: "bg-tierra text-shell-lift",
    cierre:
      "bg-shell-lift/10 text-shell-lift hover:bg-shell-lift/20 focus-visible:outline-shell-lift!",
    marco: "",
    flecha:
      "text-shell-lift/70 hover:text-shell-lift focus-visible:outline-shell-lift!",
    flechaCaja: "size-11",
    pista: "text-shell-lift/55",
    conPista: true,
  },
  shell: {
    ventanaFondo: "bg-shell text-tierra",
    cierre:
      "bg-tierra/8 text-tierra hover:bg-tierra/15 focus-visible:outline-dune-deep!",
    marco: `${ANILLO_MARCO} after:border-tierra/15`,
    flecha: "text-tierra/70 hover:text-tierra focus-visible:outline-dune-deep!",
    flechaCaja:
      "size-7 relative after:absolute after:-inset-2 after:content-['']",
    pista: "text-tierra/70",
    conPista: false,
  },
  terracota: {
    ventanaFondo: "bg-dune text-shell-lift",
    cierre:
      "bg-shell-lift/10 text-shell-lift hover:bg-shell-lift/20 focus-visible:outline-shell-lift!",
    marco: `${ANILLO_MARCO} after:border-tierra/25`,
    flecha:
      "text-shell-lift/80 hover:text-shell-lift focus-visible:outline-shell-lift!",
    flechaCaja: "size-11",
    // La pista va en crema PLENO y no al 55% como sobre el café: ahí medía
    // 2.53:1. Es el único valor que pasa el mínimo de 4.5 sobre esta
    // superficie.
    pista: "text-shell-lift",
    conPista: true,
  },
} as const;

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
  fondo = "tierra",
  claveFavoritos,
  fisica = false,
  aireMarco = "mt-6",
}: VisorBarajaProps) {
  // `fisica` en true enciende la mecánica con el tempo de la galería; un objeto
  // la enciende afinando lo que se le pase. Todo lo demás -- el pivote, la
  // compensación del giro, el avance de la carta de atrás, el asentamiento -- es
  // el mismo código para las dos pantallas.
  const conFisica = Boolean(fisica);
  const ajustes: AjustesFisica =
    typeof fisica === "object"
      ? { ...FISICA_GALERIA, ...fisica }
      : FISICA_GALERIA;

  const dialogo = useRef<HTMLDialogElement>(null);

  // ── ME GUSTA ──────────────────────────────────────────────────────────────
  // ARRANCA VACÍO SIEMPRE, y eso es a la vez el requisito de hidratación y el
  // modo de fallo deseado. El servidor no puede leer el localStorage del
  // navegador, así que el primer render tiene que ser el mismo en los dos lados;
  // y si el almacenamiento no existe, está bloqueado o viene vacío, este estado
  // inicial ES el comportamiento correcto: todos los corazones vacíos y el visor
  // funcionando igual.
  const [favoritas, setFavoritas] = useState<Set<string>>(new Set());
  // Contador de pulsaciones. No describe ningún estado visible: sirve para
  // volver a montar las capas animadas y que su animación se reproduzca otra
  // vez. Sin él, marcar una segunda foto no dispararía nada, porque el
  // navegador solo arranca una animación cuando el elemento entra en el árbol o
  // cuando cambia la propiedad `animation`.
  const [pulso, setPulso] = useState(0);

  // EL BROTE. Los corazones que salen disparados al marcar.
  //
  // VIVE EN UNA CAPA APARTE Y EN position: fixed, y eso no es un gusto: el
  // corazón está dentro del marco de la foto, que lleva overflow-hidden, y el
  // marco está dentro del <dialog>, que también. Cualquier hijo del botón
  // quedaría recortado dos veces -- y el propio botón lleva backdrop-filter,
  // que crea bloque contenedor para sus descendientes posicionados, así que ni
  // siquiera un absolute escaparía. Con position: fixed el bloque contenedor es
  // el viewport, que es ancestro de los dos recortes, así que las partículas
  // salen del marco y de la ventana sin que nada las corte.
  //
  // Guarda el origen en coordenadas de viewport, medido en el clic: la capa no
  // cuelga del botón, así que tiene que saber dónde estaba.
  const [brote, setBrote] = useState<{
    id: number;
    x: number;
    y: number;
    particulas: {
      dx: number;
      dy: number;
      rot: number;
      tam: number;
      retraso: number;
    }[];
  } | null>(null);
  const relojBrote = useRef(0);

  useEffect(() => {
    if (!claveFavoritos) return;
    try {
      const bruto = window.localStorage.getItem(claveFavoritos);
      if (!bruto) return;
      const datos: unknown = JSON.parse(bruto);
      if (!Array.isArray(datos)) return;
      setFavoritas(
        new Set(datos.filter((x): x is string => typeof x === "string")),
      );
    } catch {
      // Almacenamiento no disponible (modo privado, permisos, cuota) o dato
      // corrupto. No es un error que haya que reportar: se queda vacío.
    }
  }, [claveFavoritos]);

  // SEIS PARTÍCULAS Y NO MÁS. Con tres el gesto no se lee como celebración; a
  // partir de ocho, en una ventana de 352px de ancho, se solapan y se convierte
  // en una nube. Los rangos están acotados a mano: la dispersión horizontal
  // cabe en +-34px, el recorrido vertical va de 58 a 96px hacia arriba -- lo
  // bastante para salir del marco, que es la prueba de que nada las recorta --
  // y el retraso escalonado de hasta 90ms es lo que hace que broten y no que
  // aparezcan las seis a la vez.
  const sortearParticulas = () =>
    Array.from({ length: 6 }, (_, k) => ({
      dx: Math.round((Math.random() * 2 - 1) * 34),
      dy: -Math.round(58 + Math.random() * 38),
      rot: Math.round((Math.random() * 2 - 1) * 28),
      tam: Math.round(10 + Math.random() * 4),
      retraso: Math.round(k * 12 + Math.random() * 30),
    }));

  useEffect(() => () => clearTimeout(relojBrote.current), []);

  const alternarFavorita = (id: string, boton: HTMLElement) => {
    const marcando = !favoritas.has(id);
    // El brote SOLO al activar. Desmarcar es una corrección, no un logro, y
    // celebrarla se siente falso.
    //
    // prefers-reduced-motion se consulta aquí, en el clic, y no al montar: con
    // la preferencia puesta las partículas NI SE CREAN, así que no hay nodos
    // que animar ni que limpiar. Queda el cambio de estado y nada más.
    const sinMovimiento =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (marcando && !sinMovimiento) {
      const caja = boton.getBoundingClientRect();
      clearTimeout(relojBrote.current);
      setBrote({
        id: Date.now(),
        x: caja.left + caja.width / 2,
        y: caja.top + caja.height / 2,
        particulas: sortearParticulas(),
      });
      // "Desaparecen sin dejar rastro": la capa se desmonta cuando la más
      // tardía ha terminado (640 de animación + 90 de retraso, con margen).
      relojBrote.current = window.setTimeout(() => setBrote(null), 820);
    }
    setFavoritas((previas) => {
      const siguiente = new Set(previas);
      if (siguiente.has(id)) siguiente.delete(id);
      else siguiente.add(id);
      if (claveFavoritos) {
        try {
          window.localStorage.setItem(
            claveFavoritos,
            JSON.stringify([...siguiente]),
          );
        } catch {
          // Si no se puede escribir, el estado sigue vivo en memoria durante la
          // sesión. Perderlo al recargar es preferible a romper el gesto.
        }
      }
      return siguiente;
    });
    setPulso((p) => p + 1);
  };
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
    v?: number;
  } | null>(null);
  // Opacidad a la que llegó la carta de abajo durante el arrastre. La nueva
  // activa arranca ahí para que la disolución no dé un salto al confirmar.
  const opacidadEntrada = useRef(0.5);
  // Escala a la que llegó la carta de abajo durante el arrastre. La nueva
  // activa arranca ahí, igual que con la opacidad, para que al confirmar no dé
  // un salto de tamaño. Solo se usa con `fisica`.
  const escalaEntrada = useRef(1);
  // Temporizadores del empujón de apertura. Se cancelan en cuanto el usuario
  // toca la baraja: si no, sus escrituras de transform pisaban el arrastre.
  const relojesPista = useRef<number[]>([]);

  const reducido = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // EL PIVOTE BAJO Y SU COMPENSACIÓN. Con transform-origin por debajo de la
  // carta, girar g grados desplaza además el centro de la carta R*sen(g) en
  // horizontal, donde R es la distancia del centro al pivote. Sin corregirlo la
  // carta ADELANTA al dedo -- medido a 100px de arrastre y 4 grados, 9.6px de
  // más --, y el criterio es que no haya separación perceptible entre el dedo y
  // la carta. Así que se le resta ese desplazamiento a la traslación: el centro
  // sigue al dedo exactamente y todo el efecto del pivote queda en el balanceo,
  // que es para lo que está.
  //
  // En vertical el mismo giro baja el centro R*(1-cos g), que a 10 grados son
  // 2.1px. Ese no se compensa: es la caída de la carta al abrirse la mano.
  const geometriaFisica = (n: HTMLElement, d: number) => {
    const alto = n.offsetHeight || 390;
    const radio = (PIVOTE_FISICA - 0.5) * alto;
    const g = Math.max(
      -ajustes.topeGrados,
      Math.min(ajustes.topeGrados, d * GRADOS_POR_PX),
    );
    const compensa = radio * Math.sin((g * Math.PI) / 180);
    return { g, x: d - compensa };
  };

  const pintar = () => {
    rafPendiente.current = false;
    const n = carta.current;
    if (!n) return;
    const d = dx.current;

    if (conFisica) {
      const { g, x } = geometriaFisica(n, d);
      n.style.transform = `translate3d(${x}px,0,0) rotate(${g}deg)`;
    } else {
      const g = Math.max(
        -TOPE_GRADOS,
        Math.min(TOPE_GRADOS, d * GRADOS_POR_PX),
      );
      n.style.transform = `translate3d(${d}px,0,0) rotate(${g}deg)`;
    }

    // La carta de abajo se disuelve con el gesto: cuanto más lejos va el dedo,
    // más presente está la siguiente.
    //
    // CON FÍSICA AVANZA DE VERDAD, no solo se aclara: sube de 0.35 a 1 de
    // opacidad y de 0.92 a 1 de escala, las dos con el mismo `avance`, así que
    // gana cuerpo y nitidez al mismo ritmo con que la de adelante se va. Y no
    // espera a que la primera salga: esto se escribe en cada fotograma del
    // arrastre. El avance se satura en el 55% del ancho de la carta, que es
    // algo más que el umbral de descarte: al llegar al punto de confirmar, la
    // de atrás ya está entera.
    const r = nodoRevelado.current;
    if (r) {
      const avance = Math.min(1, Math.abs(d) / ((n.offsetWidth || 300) * 0.55));
      if (conFisica) {
        const o = 0.35 + 0.65 * avance;
        const esc = 0.92 + 0.08 * avance;
        opacidadEntrada.current = o;
        escalaEntrada.current = esc;
        r.style.opacity = String(o);
        r.style.transform = `scale(${esc})`;
      } else {
        const o = 0.2 + 0.3 * avance;
        opacidadEntrada.current = o;
        r.style.opacity = String(o);
      }
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
      // La velocidad del lanzamiento viaja con la capa de salida: es lo que
      // decide su duración. Se guarda el valor absoluto en px/ms tal como se
      // midió en el último tramo del gesto.
      if (!reducido())
        setSaliendoDe({ idx: i, dx: d, v: Math.abs(velocidad.current) });
      mover(direccion);
      return;
    }

    dx.current = 0;
    setRevelado(null);
    if (!n || reducido()) return;

    if (conFisica) {
      // ASENTAMIENTO ELÁSTICO. Una transición con curva de sobreimpulso solo
      // puede pasarse UNA vez; un resorte amortiguado se pasa, vuelve, se pasa
      // menos y para. Eso son cuatro fotogramas clave, así que va como
      // animación y no como transición.
      //
      // Arranca desde donde quedó el dedo, y ese punto es distinto en cada
      // gesto: entra por dos propiedades personalizadas que los fotogramas
      // leen y escalan (-10% y +3.5% del recorrido). Y hay que limpiar el
      // `transform` del arrastre antes: la animación usa las propiedades
      // independientes `translate` y `rotate`, que se COMPONEN con transform en
      // vez de reemplazarlo, así que dejarlo puesto sumaría el desplazamiento
      // dos veces.
      const { g, x } = geometriaFisica(n, d);
      n.style.transition = "none";
      n.style.transform = "";
      n.style.setProperty("--d0", `${x}px`);
      n.style.setProperty("--g0", `${g}deg`);
      n.classList.remove("carta-asienta");
      void n.offsetWidth;
      n.classList.add("carta-asienta");
      const limpiar = () => {
        n.classList.remove("carta-asienta");
        n.style.removeProperty("--d0");
        n.style.removeProperty("--g0");
        n.removeEventListener("animationend", limpiar);
      };
      n.addEventListener("animationend", limpiar);
      return;
    }

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
    if (conFisica) {
      const geo = geometriaFisica(n, saliendoDe.dx);
      n.style.transform = `translate3d(${geo.x}px,0,0) rotate(${geo.g}deg)`;
    } else {
      n.style.transform = `translate3d(${saliendoDe.dx}px,0,0) rotate(${g}deg)`;
    }
    n.style.opacity = "1";
    // Reflow forzado ANTES de poner la transición. Con requestAnimationFrame no
    // funcionaba: el callback corre antes del pintado del mismo fotograma, así
    // que el navegador nunca veía el estado inicial y la transición no
    // arrancaba -- medido, la capa se quedaba quieta 120ms y luego saltaba.
    void n.offsetWidth;

    if (conFisica) {
      // FUERA DE CUADRO DE VERDAD. El destino no es "un poco más allá del
      // marco" sino el ancho del viewport más el de la carta a partir de donde
      // quedó el dedo: con eso el canto que va detrás cruza el borde de la
      // pantalla en cualquier tamaño. Y los dos recortes que la atrapaban -- el
      // del marco y el de la ventana -- están apagados con `fisica`.
      // EL DESTINO ES EL MÍNIMO NECESARIO PARA SALIR DE PANTALLA, y ese número
      // importa: la carta arranca centrada en la ventana, así que su centro
      // tiene que llegar a medio viewport más medio ancho de carta -- 371px en
      // un teléfono de 390 con una carta de 312 -- más un margen de 24.
      //
      // Antes usaba el ancho del viewport MÁS el de la carta, o sea el doble de
      // lo necesario. Con 700px de recorrido, dividir entre cualquier velocidad
      // de mano daba más de 400ms y el tope se comía toda la diferencia entre un
      // gesto lento y uno rápido: medido, 520ms contra 399. Con la distancia
      // justa el reparto se abre de verdad.
      // EL PISO ES "SALIR DEL MARCO", y no es negociable por más que se acorte
      // el recorrido: la carta arranca centrada en un marco de su mismo ancho,
      // así que su canto de atrás cruza el borde cuando el centro ha viajado un
      // ancho de carta. De ahí el max(): `recorrido` puede recortar el vuelo
      // hasta ese punto y no más allá.
      const geo = geometriaFisica(n, saliendoDe.dx);
      const magnitud = Math.max(
        anchoCarta + 24,
        (window.innerWidth / 2 + anchoCarta / 2 + 24) * ajustes.recorrido,
      );
      const destino = signo * magnitud - (geo.x - saliendoDe.dx);
      const restante = Math.abs(destino - geo.x);

      // LA DURACIÓN LA PONE EL GESTO. Se toma la velocidad medida al soltar, se
      // acota a la ventana utilizable y el tiempo sale de dividir la distancia
      // que falta entre ella: un lanzamiento rápido sale disparado y uno lento
      // se va despacio, con la misma trayectoria. Sin velocidad utilizable
      // (fue un empujón, no un lanzamiento) se usa el suelo de la ventana, que
      // da la salida más lenta.
      // El factor de impulso es de la pantalla: en la galería la carta sale con
      // MÁS impulso del que traía el dedo (x1.3), porque al soltar la mano deja
      // de frenar; en la guía sale con menos, porque ahí no se descarta nada.
      const v = Math.min(
        VELOCIDAD_MAX,
        Math.max(VELOCIDAD_MIN, (saliendoDe.v ?? 0) * ajustes.impulso),
      );
      const ms = Math.round(
        Math.min(
          ajustes.salidaMs[1],
          Math.max(ajustes.salidaMs[0], restante / v),
        ),
      );

      // El giro también responde al lanzamiento, entre los dos valores que
      // ponga la pantalla. Una carta lanzada gira más.
      const [giroLento, giroRapido] = ajustes.giroSalida;
      const giroSalida =
        signo *
        (giroLento +
          (giroRapido - giroLento) *
            ((v - VELOCIDAD_MIN) / (VELOCIDAD_MAX - VELOCIDAD_MIN)));

      // Sin desvanecimiento: una carta que se suelta no se vuelve
      // transparente, se va. Curva casi lineal al principio -- lleva inercia --
      // y frenado corto al final.
      n.style.transition = `transform ${ms}ms cubic-bezier(.16,.62,.36,1)`;
      n.style.transform = `translate3d(${destino}px,0,0) rotate(${giroSalida}deg)`;
      const reloj = window.setTimeout(() => setSaliendoDe(null), ms + 60);
      return () => clearTimeout(reloj);
    }

    n.style.transition =
      "transform 260ms cubic-bezier(.32,.72,0,1), opacity 240ms linear";
    n.style.transform = `translate3d(${(anchoCarta + 140) * signo}px,0,0) rotate(${signo * 12}deg)`;
    n.style.opacity = "0";
    const reloj = window.setTimeout(() => setSaliendoDe(null), 320);
    return () => clearTimeout(reloj);
  }, [saliendoDe, conFisica]);

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
    if (conFisica) {
      // La nueva activa hereda la escala exacta que tenía la de atrás en el
      // último fotograma del arrastre, y termina de crecer. Sin esto, al
      // confirmar daba un salto de tamaño: la de atrás iba en 0.99 y la activa
      // entraba en 1.
      n.style.transform = `translate3d(0,0,0) scale(${escalaEntrada.current})`;
      void n.offsetWidth;
      n.style.transition = `opacity ${ajustes.entradaMs}ms ease-out, transform ${ajustes.entradaMs}ms ease-out`;
      n.style.transform = "translate3d(0,0,0) scale(1)";
      n.style.opacity = "1";
      escalaEntrada.current = 1;
      opacidadEntrada.current = 0.5;
      return;
    }
    void n.offsetWidth;
    n.style.transition = "opacity 220ms ease-out";
    n.style.opacity = "1";
    opacidadEntrada.current = 0.5;
  }, [i, abierto, conFisica]);

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

  // EL RECORTE SE MUDA DEL MARCO A LAS CAPAS. Sin física, el marco recorta y
  // redondea las tres a la vez con su overflow-hidden. Con física ese recorte
  // es justo lo que impedía que la carta saliera de cuadro, así que se apaga
  // ahí -- y en la ventana -- y cada capa se recorta y redondea a sí misma. El
  // resultado visual en reposo es idéntico: mismos 16px de radio y misma foto a
  // sangre dentro de ellos.
  const recorteCapa = conFisica ? "overflow-hidden rounded-2xl" : "";

  const piel = PIELES[fondo];

  return (
    <dialog
      ref={dialogo}
      aria-label={etiqueta}
      onKeyDown={alTeclear}
      className={`modal-largos m-auto w-[var(--visor-ancho)] rounded-3xl p-5 ${conFisica ? "overflow-visible" : "overflow-hidden"} ${piel.ventanaFondo} ${altoVentana}`}
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
              className={`-mt-1 -mr-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${piel.cierre}`}
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

              EL AIRE VERTICAL LLEGA POR PROP (aireMarco) y por omisión es
              mt-6, o sea 24px. El visor de la galería de /menu pasa mt-3.5 --
              14px -- para devolverle alto a la fotografía; los 20px de relleno
              lateral de la ventana no se tocan en ninguno de los dos casos. El
              mismo valor va en el pie, y quien lo cambie tiene que rehacer la
              cuenta de altoVentana, que lo lleva dentro.

              Los gestos viven aquí, no en el diálogo: así el arrastre no
              compite con el cierre. `isolate` contiene el z-10 de la carta de
              arriba. */}
          <div className={`${aireMarco} min-h-0 flex-1`}>
            <div
              onPointerDown={alBajar}
              onPointerMove={alMover}
              onPointerUp={alSoltar}
              onPointerCancel={alSoltar}
              onDragStart={(e) => e.preventDefault()}
              style={proporcion}
              className={`relative mx-auto isolate h-full max-w-full touch-pan-y cursor-grab rounded-2xl select-none active:cursor-grabbing ${conFisica ? "overflow-visible" : "overflow-hidden"} ${piel.marco}`}
            >
              {/* Carta de abajo: la que se revela durante el arrastre. Arranca
                  casi transparente y sube de opacidad con la distancia del
                  gesto, en pintar(). Es la primera mitad de la disolución; la
                  segunda la remata la carta activa al confirmar. */}
              {revelado !== null && (
                <div
                  ref={nodoRevelado}
                  className={`absolute inset-0 ${conFisica ? "opacity-[0.35]" : "opacity-20"} ${recorteCapa}`}
                >
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
                style={
                  fisica
                    ? { transformOrigin: `50% ${PIVOTE_FISICA * 100}%` }
                    : undefined
                }
                className={`absolute inset-0 z-10 will-change-transform ${recorteCapa}`}
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
                  style={
                    fisica
                      ? { transformOrigin: `50% ${PIVOTE_FISICA * 100}%` }
                      : undefined
                  }
                  className={`pointer-events-none absolute inset-0 z-20 will-change-transform ${recorteCapa}`}
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

              {/* ── EL CORAZÓN ──────────────────────────────────────────────
                  DENTRO DEL MARCO Y ABAJO A LA DERECHA. Arriba está el título,
                  así que ahí competiría; y el trabajo de color vive en el
                  centro y en la mitad superior del cuadro -- son fotos de nuca
                  y de melena --, mientras que la esquina inferior derecha es
                  hombro o fondo en las 56. Además es donde llega el pulgar.

                  NO SE MUEVE CON LA BARAJA: vive en el marco, no en la carta,
                  así que al deslizar las fotos pasan por debajo y el control se
                  queda en su sitio. Y va en z-30, encima de las tres capas de
                  la baraja (0, 10 y 20).

                  EL BROTE NO CUELGA DE AQUÍ. Está más abajo, como hijo
                  directo del <dialog> y en position: fixed, porque este botón
                  lleva backdrop-filter y eso crea bloque contenedor para sus
                  descendientes posicionados: un absolute dentro del botón
                  quedaría atrapado en el marco.

                  EL DISCO ES VIDRIO, no una sombra. Blanco al 80% con
                  desenfoque de fondo y una hairline por dentro: sobre las 56
                  fotografías completas, medido en la esquina exacta que ocupa,
                  el corazón vacío da de 10.5 a 15.4:1 y el lleno de 4.6 a
                  6.8:1. Sin el velo, el trazo oscuro desaparecía sobre las
                  nucas rubias y el relleno terracota sobre los fondos negros.

                  EL RELLENO ES dune-deep Y NO dune. Con dune (el terracota de
                  la pila) el peor caso de las 56 caía a 2.83:1, por debajo del
                  mínimo de 3:1 para un objeto gráfico: la esquina más oscura de
                  la galería es un rgb(11,15,23) y el velo no la levanta lo
                  suficiente. dune-deep sube ese peor caso a 4.62:1.

                  stopPropagation EN pointerdown NO ES DEFENSIVO. El marco es el
                  que escucha el gesto de la baraja; sin cortar ahí, tocar el
                  corazón arrancaba un arrastre de cero píxeles.

                  ARIA. aria-pressed lleva el estado formal y la etiqueta lo
                  dice en palabras, que es lo pedido: "Me gusta esta foto" /
                  "Quitar me gusta de esta foto".

                  EL ANILLO DE FOCO VA POR DENTRO DEL DISCO, y esa es la única
                  posición que funciona. Fuera, el anillo cae sobre la
                  fotografía, y ninguna tinta fija se lee sobre 56 fotos
                  distintas: medido, tierra sobre la esquina más oscura de la
                  galería da 1.3:1. Por dentro cae siempre sobre el mismo velo
                  blanco, donde dune-deep mide de 3.62 a 6.82:1.

                  Las dos marcas de importancia son obligatorias: la regla
                  global de :focus-visible de globals.css no está en una capa,
                  así que le gana a las utilidades y fija tanto el color
                  (dune-deep, que sin la marca se quedaba en el currentColor
                  heredado -- tierra) como el desplazamiento (+2px, hacia
                  fuera). */}
              {claveFavoritos && (
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    alternarFavorita(laminas[i].id, e.currentTarget);
                  }}
                  aria-pressed={favoritas.has(laminas[i].id)}
                  aria-label={
                    favoritas.has(laminas[i].id)
                      ? "Quitar me gusta de esta foto"
                      : "Me gusta esta foto"
                  }
                  className="absolute right-3 bottom-3 z-30 inline-flex size-11 items-center justify-center rounded-full bg-white/80 ring-1 ring-tierra/12 backdrop-blur-md transition-colors duration-150 ring-inset hover:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2! focus-visible:outline-dune-deep!"
                >
                  <svg
                    key={
                      favoritas.has(laminas[i].id) ? `late-${pulso}` : "vacio"
                    }
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className={`size-5 ${
                      favoritas.has(laminas[i].id)
                        ? "corazon-late text-dune-deep"
                        : "text-tierra"
                    }`}
                  >
                    <path
                      d="M12 20.5C12 20.5 3.5 15.2 3.5 9.4A4.9 4.9 0 0 1 12 6.4a4.9 4.9 0 0 1 8.5 3A11.6 11.6 0 0 1 12 20.5Z"
                      fill={
                        favoritas.has(laminas[i].id) ? "currentColor" : "none"
                      }
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* PIE: flechas, el indicador de posición que le pasen y el rótulo de
              la pista. El mismo aireMarco que arriba de la imagen.

              EL min-h ES LO QUE CENTRA LA IMAGEN: tiene que valer lo mismo que
              mide la cabecera, y la cabecera depende del encabezado que reciba.
              Si se cambia el cuerpo del indicador, este número hay que
              remedirlo. */}
          <div className={`${aireMarco} flex items-center gap-3 ${altoPie}`}>
            <button
              type="button"
              onClick={() => mover(-1)}
              disabled={i === 0}
              className={`inline-flex shrink-0 items-center justify-center transition-opacity duration-150 disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 ${piel.flechaCaja} ${piel.flecha}`}
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
              className={`inline-flex shrink-0 items-center justify-center transition-opacity duration-150 disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 ${piel.flechaCaja} ${piel.flecha}`}
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
                sitio.

                SOLO EN LA PIEL OSCURA. La galería de /menu lleva ahora ese
                mismo rótulo FIJO y centrado en su pie, en el sitio donde estaba
                el contador, así que aquí duplicaría la palabra en el mismo
                renglón. */}
            {piel.conPista && (
              <span
                aria-hidden="true"
                className={`ml-auto text-[11px] uppercase tracking-[0.25em] transition-opacity duration-300 ${piel.pista} ${
                  pista ? "opacity-100" : "opacity-0"
                }`}
              >
                Desliza
              </span>
            )}
          </div>

          {/* Región viva: anuncia el cambio de lámina a lectores de pantalla,
              que no "ven" el reemplazo de la imagen. */}
          <p aria-live="polite" className="sr-only">
            {anuncio(i)}
          </p>
        </div>
      )}

      {/* ── EL BROTE ────────────────────────────────────────────────────────
          FUERA DE TODO RECORTE. Va aquí, hijo directo del <dialog> y en
          position: fixed, no dentro del botón ni del marco. Los dos llevan
          overflow-hidden y el botón además backdrop-filter; en fixed el bloque
          contenedor es el viewport, que es ancestro de los dos, así que las
          partículas cruzan el canto del marco y el de la ventana sin cortarse.
          Es la única posición del árbol donde eso es cierto.

          NO TOCA LA FLUIDEZ DEL DESLIZAMIENTO. pointer-events-none, así que no
          intercepta el gesto de la baraja; y cada partícula anima solo opacity,
          translate, scale y rotate -- las cuatro las resuelve el compositor, sin
          recálculo de diseño ni de pintado. Son seis nodos durante 730ms y se
          desmontan solos.

          UN SOLO KEYFRAMES PARA LAS SEIS. Lo que cambia por partícula son cuatro
          propiedades personalizadas (--dx, --dy, --rot, --esc) que la animación
          lee como destino, más su retraso. Sin eso harían falta seis reglas.

          La capa se remonta por `key`, que es lo que vuelve a disparar la
          animación en el segundo me gusta. */}
      {brote && (
        <div
          key={brote.id}
          aria-hidden="true"
          className="pointer-events-none fixed z-40"
          style={{ left: brote.x, top: brote.y }}
        >
          {brote.particulas.map((p, k) => (
            <span
              key={k}
              className="corazon-brote absolute"
              style={{
                left: -p.tam / 2,
                top: -p.tam / 2,
                width: p.tam,
                height: p.tam,
                animationDelay: `${p.retraso}ms`,
                ["--dx" as string]: `${p.dx}px`,
                ["--dy" as string]: `${p.dy}px`,
                ["--rot" as string]: `${p.rot}deg`,
              }}
            >
              {/* Relleno terracota con una hairline crema. Las partículas
                  cruzan la fotografía, y una sola tinta no se lee sobre las 56:
                  el relleno manda sobre las nucas claras y el contorno sobre los
                  fondos oscuros. A 10-14px de caja, el trazo de 1.5 del lienzo
                  de 24 se pinta en 0.6-0.9px: es un canto, no un borde. */}
              <svg viewBox="0 0 24 24" className="size-full text-dune-deep">
                <path
                  d="M12 20.5C12 20.5 3.5 15.2 3.5 9.4A4.9 4.9 0 0 1 12 6.4a4.9 4.9 0 0 1 8.5 3A11.6 11.6 0 0 1 12 20.5Z"
                  fill="currentColor"
                  stroke="var(--color-shell-lift)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          ))}
        </div>
      )}
    </dialog>
  );
}
