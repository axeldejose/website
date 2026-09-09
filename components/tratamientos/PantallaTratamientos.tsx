"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Service } from "@/data/services";
import { mxn } from "@/data/services";
import { waLink } from "@/lib/site";

// LA PANTALLA DE /menu/tratamientos.
//
// POR QUÉ ES UN SOLO COMPONENTE DE CLIENTE. El índice activo lo comparten la
// baraja y la barra de progreso. El encabezado entra por `children` para
// seguir pintándose en el servidor: es texto estático y no tiene por qué viajar
// como JavaScript.
//
// ─────────────────────────────────────────────────────────────────────────────
// LA BARAJA. Toma la gramática del visor de galería de /menu -- cartas apiladas
// en profundidad, la de arriba se retira y revela la siguiente, arrastre con
// lanzamiento -- y la trae a esta pantalla clara.
//
// NO REUTILIZA components/VisorBaraja.tsx, y no por comodidad: aquel es un
// diálogo modal a pantalla completa de 1.394 líneas con favoritos, precarga de
// vecinas, teclado de galería, tres pieles de fondo y física de descarte. Aquí
// la baraja vive EN FLUJO dentro de la página, avanza sola, no se cierra, no
// descarta nada y cada carta es un servicio con su precio y su acceso a
// WhatsApp. Meterle un sexto modo a la pieza que /menu y /galeria usan a diario
// habría sido tocarla para servir a una pantalla que no comparte ni el
// contenedor ni el propósito. Queda intacta.
//
// Lo que sí viaja de allá, porque es lo que hace que el gesto se sienta igual
// en todo el sitio: el pivote por debajo de la carta -- el giro se lee como una
// carta que se suelta de la mano y no como una diapositiva --, el umbral de
// descarte por distancia O por impulso, y la vuelta con rebote cuando el
// arrastre se queda corto.
// ─────────────────────────────────────────────────────────────────────────────

// Cada cuánto avanza sola. Cronometrado sobre la ficha más larga -- kicker,
// nombre, precio y descripción --: por debajo de 4s la carta se va antes de que
// se acabe de leer el precio.
const RITMO_MS = 5200;

// Lo que tarda la baraja en rotar su orden después de lanzar la salida. La
// animación de .baraja-carta[data-sale] dura 520ms en globals.css y esto son
// 560: los 40 de margen evitan la carrera por un fotograma entre el final de la
// transición y el re-render que reordena el mazo. Sin ese margen, si el
// temporizador se adelanta un fotograma la carta se reposiciona antes de
// terminar de desvanecerse.
const SALIDA_MS = 560;

// Umbral de descarte por distancia, y el impulso que lo sustituye cuando el
// gesto es corto pero rápido. Los dos criterios son los del visor de galería.
const UMBRAL_PX = 62;
const UMBRAL_VELOCIDAD = 0.45;

const FICHAS: Record<
  string,
  { src: string; alt: string; kicker: string; resumen: string }
> = {
  antishock: {
    src: "/antishock.png",
    alt: "Manos enguantadas revisando un mechón rubio, separándolo del resto de la melena",
    kicker: "Rescate capilar",
    resumen: "Lo creé para rescatar melenas dañadas.",
  },
  hidratante: {
    src: "/hidratante.png",
    alt: "Melena castaña con reflejos sostenida sobre el lavabo durante el tratamiento",
    // "Nutrición profunda" y no "Hidratación": el kicker repetía la raíz del
    // nombre que tiene justo debajo -- Hidratación / Hidratante -- así que no
    // aportaba nada. El resto de las fichas ya funciona así: el kicker nombra
    // el campo y el nombre nombra el producto.
    kicker: "Nutrición profunda",
    resumen: "Devuelve suavidad, brillo y manejo.",
  },
  reestructuracion: {
    src: "/reestructuracion.png",
    alt: "Melena larga y ondulada con reflejos rubios, vista de espalda",
    kicker: "Reparación",
    resumen: "Repara y fortalece desde el interior.",
  },
  "sellado-de-color": {
    src: "/sellado-de-color.png",
    alt: "Clienta sentada con la melena castaña luminosa después del sellado",
    kicker: "Protección",
    resumen: "Protege tu color y alarga su duración.",
  },
  ampolletas: {
    src: "/ampolletas.png",
    alt: "Aplicación de una ampolleta con pincel sobre el cuero cabelludo",
    kicker: "Vitalidad",
    resumen: "Vitalidad y brillo de raíz a puntas.",
  },
};

type PantallaTratamientosProps = {
  servicios: Service[];
  children: ReactNode;
};

export function PantallaTratamientos({
  servicios,
  children,
}: PantallaTratamientosProps) {
  const total = servicios.length;

  // EL ORDEN DE LA BARAJA, Y NO UN ÍNDICE. Con un índice había que decidir qué
  // hace la carta que se va cuando le toca volver al fondo del mazo, y toda
  // solución pasaba por suprimir transiciones a mano. Con el orden, la carta
  // sale del array por delante y entra por detrás: que es literalmente lo que
  // hace una carta en una baraja.
  const [orden, setOrden] = useState<number[]>(() => servicios.map((_, k) => k));
  // La carta que está saliendo de cuadro. Mientras vale algo, el resto se pinta
  // ya adelantado un puesto: la siguiente sube al frente A LA VEZ que la de
  // arriba se va, en vez de esperar a que termine.
  const [saliendo, setSaliendo] = useState<number | null>(null);
  // El avance automático se apaga al primer contacto y no se reanuda.
  const [auto, setAuto] = useState(true);

  // Cierra la puerta mientras una carta está saliendo. Es un ref y no estado
  // porque tiene que ser efectivo en el mismo tic, antes de cualquier
  // re-render: es la guarda que vuelve idempotente a `avanzar`.
  const enSalida = useRef(false);

  const cartas = useRef<(HTMLDivElement | null)[]>([]);
  const gesto = useRef<{ id: number; x0: number; t0: number; dx: number } | null>(
    null,
  );

  const activo = orden[0] ?? 0;

  // EL EFECTO VA FUERA DEL UPDATER, y esto es una corrección medida, no una
  // preferencia de estilo.
  //
  // Estuvo escrito programando el setTimeout DENTRO del updater de setOrden.
  // Un updater tiene que ser puro, y React los invoca dos veces en desarrollo
  // (StrictMode) justo para delatar los que no lo son: se programaban dos
  // temporizadores por avance, los dos con el mismo retardo, y disparaban casi
  // a la vez. Cada tic del bucle avanzaba DOS cartas -- la primera con su
  // animación y la segunda de golpe -- y ese segundo cambio instantáneo era el
  // salto visible, con la fotografía de la siguiente apareciendo descubierta.
  // Trazado: a los 5.9s el frente pasaba a Hidratante con Antishock saliendo, y
  // a los 7.2 ya estaba en Reestructuración sin que nada hubiera salido.
  //
  // La guarda vieja (`if (previo !== null)`) no servía: las dos invocaciones
  // veían el estado anterior, o sea null. Ahora la guarda es un ref, que sí es
  // efectivo dentro del mismo tic.
  const avanzar = useCallback(() => {
    if (enSalida.current) return;
    enSalida.current = true;
    setSaliendo(activo);
    window.setTimeout(() => {
      setOrden((actual) => [...actual.slice(1), actual[0]!]);
      setSaliendo(null);
      enSalida.current = false;
    }, SALIDA_MS);
    // Depende de `activo`, que es un valor derivado del render y no un ref: con
    // eso desaparece la lectura de refs durante el render y, de paso, el
    // intervalo del bucle se recrea en cada avance, así que el reloj de 5.2s
    // vuelve a empezar tras cada carta en vez de correr libre.
  }, [activo]);

  // Retroceder no lleva animación de salida: la carta que vuelve al frente
  // entra desde el fondo del mazo, que es donde estaba. Es el gesto inverso y
  // se lee como deshacer.
  const retroceder = useCallback(() => {
    // Misma disciplina: la guarda es el ref, y la rotación no se anida dentro
    // de otro updater.
    if (enSalida.current) return;
    setOrden((o) => [o[o.length - 1]!, ...o.slice(0, -1)]);
  }, []);

  const tomarControl = useCallback(() => setAuto(false), []);

  // ── EL AVANCE AUTOMÁTICO ──────────────────────────────────────────────────
  // No arranca siquiera si el sistema pide movimiento reducido: ahí la baraja
  // se queda quieta en la primera carta y solo se mueve por gesto o teclado.
  useEffect(() => {
    if (!auto) return;
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const t = window.setInterval(avanzar, RITMO_MS);
    return () => window.clearInterval(t);
  }, [auto, avanzar]);

  // ── EL ARRASTRE ───────────────────────────────────────────────────────────
  // El transform se escribe directamente en el nodo, sin pasar por el estado:
  // un setState por cada pointermove re-renderizaría las cinco cartas sesenta
  // veces por segundo.
  const alBajar = (e: React.PointerEvent<HTMLDivElement>, id: number) => {
    if (id !== activo || saliendo !== null) return;
    tomarControl();
    // El sello de tiempo se toma del propio evento y no de performance.now():
    // es la misma escala (DOMHighResTimeStamp desde el origen de tiempo), no
    // introduce una llamada impura dentro del componente, y además mide el
    // instante en que el navegador registró el gesto y no el instante en que
    // React llegó a atenderlo.
    gesto.current = { id, x0: e.clientX, t0: e.timeStamp, dx: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
    const n = cartas.current[id];
    if (n) n.style.transition = "none";
  };

  const alMover = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesto.current;
    if (!g) return;
    g.dx = e.clientX - g.x0;
    const n = cartas.current[g.id];
    if (!n) return;
    // El pivote va por debajo de la carta (transform-origin, en globals.css),
    // así que el giro se lee como una carta girando en la mano. 0.022 grados
    // por píxel dejan unos 3 grados en el umbral: se nota que gira, no se lee
    // torcida.
    n.style.transform = `translate3d(${g.dx}px,0,0) rotate(${g.dx * 0.022}deg)`;
  };

  const alSoltar = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesto.current;
    if (!g) return;
    gesto.current = null;

    const n = cartas.current[g.id];
    if (n) {
      // Se devuelve el control a la hoja de estilos: si no descarta, la
      // transición de .baraja-carta la trae de vuelta con rebote.
      n.style.transition = "";
      n.style.transform = "";
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // El navegador ya lo había soltado; no hay nada que liberar.
    }

    const dt = Math.max(1, e.timeStamp - g.t0);
    const descarta =
      Math.abs(g.dx) > UMBRAL_PX || Math.abs(g.dx) / dt > UMBRAL_VELOCIDAD;
    if (!descarta) return;
    if (g.dx < 0) avanzar();
    else retroceder();
  };

  const alTeclear = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (["ArrowRight", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      tomarControl();
      avanzar();
      return;
    }
    if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      tomarControl();
      retroceder();
    }
  };

  return (
    <>
      <aside className="lg:sticky lg:top-16 lg:self-start">
        {/* ─── LA BARRA SUPERIOR ──────────────────────────────────────────
            EL CONTROL DE REGRESO VUELVE AQUÍ. Estuvo montado en la segunda
            línea del titular, como en /menu, y de ahí sale: en esta página el
            titular es "Tratamientos capilares" -- doce letras más nueve contra
            las siete más ocho de /menu --, así que el hueco que dejaba el
            desplazamiento de la cursiva era el doble de ancho y la cápsula
            quedaba nadando dentro. En su barra propia vuelve a leerse como lo
            que es: navegación, antes de que empiece la pieza.

            Sigue siendo discreta: versalita de 10px sobre vidrio claro con
            contorno fino, sin relleno saturado. La regla se lleva el ancho
            sobrante, así que la barra se ordena sola en cualquier pantalla sin
            una medida escrita a mano. */}
        {/* ─── EL AIRE DE LA BARRA ────────────────────────────────────────
            Arriba: los 32px del contenedor del layout más 12 de aquí, 44 en
            total del canto de la pantalla al canto de la cápsula. Abajo: 24
            hasta el rótulo. La cápsula mide 30, así que la barra ocupa una
            banda de 98px con la pieza sentada en ella y no pegada a ningún
            lado.

            LOS DOS NÚMEROS NO SON IGUALES A PROPÓSITO. 44 arriba y 24 abajo:
            el hueco de arriba separa la barra del canto de la pantalla y el de
            abajo la separa del bloque de encabezado, que empieza justo
            después. Si fueran iguales, la barra se leería flotando en medio de
            dos vacíos en vez de encabezando lo que viene debajo. */}
        <nav
          aria-label="Navegación"
          className="flex items-center gap-3 pt-3 pb-6"
        >
          {/* LLEVA A LA PORTADA, no a /menu. */}
          <Link href="/" className="trat-volver">
            <span aria-hidden="true" className="trat-volver-flecha">
              ←
            </span>
            <span className="trat-volver-texto">Volver al menú</span>
          </Link>

          <span aria-hidden="true" className="trat-nav-regla" />
        </nav>

        {children}
      </aside>

      {/* SIN RELLENO INFERIOR. Aquí hubo 122px cuya única razón era empujar el
          cierre por debajo del pliegue, y sumados a los 96 de aire propio de la
          firma dejaban 218px de vacío entre la barra de progreso y el cierre:
          el hueco más grande de la página, y se leía como un agujero.

          El trabajo lo hace ahora el margen de la firma, con 56px medidos
          contra la posición de la barra fija. Ver el comentario en
          CierreTratamientos. */}
      <div className="min-w-0">
        {/* EL MARCO DE LA BARAJA sangra hasta los cantos de la pantalla y
            recorta en horizontal: la carta descartada vuela fuera del viewport,
            y sin este recorte ese vuelo le daría desplazamiento horizontal a la
            página entera.

            `clip` y no `hidden`: hidden convertiría el bloque en un contenedor
            de desplazamiento, arrastrable con el dedo y alcanzable con el
            tabulador. clip solo recorta, y solo en horizontal, para que las
            cartas de atrás puedan asomar por arriba. */}
        <div className="trat-baraja-marco">
          <div
            role="group"
            aria-roledescription="carrusel"
            aria-label="Tratamientos"
            tabIndex={0}
            onKeyDown={alTeclear}
            className="trat-baraja focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {servicios.map((servicio, k) => {
              const ficha = FICHAS[servicio.slug];
              // El puesto en el mazo. Mientras una carta sale, el resto se
              // pinta ya adelantado: la siguiente sube al frente a la vez que
              // la de arriba se va.
              const bruta = orden.indexOf(k);
              const pos = saliendo !== null ? bruta - 1 : bruta;
              const sale = saliendo === k;
              const esFrente = !sale && pos === 0;
              const precio =
                servicio.min === servicio.max
                  ? mxn(servicio.min)
                  : `${mxn(servicio.min)} – ${mxn(servicio.max)}`;

              return (
                <div
                  key={servicio.slug}
                  ref={(n) => {
                    cartas.current[k] = n;
                  }}
                  className="baraja-carta"
                  // La hoja de estilos coloca cada carta según su puesto; el
                  // componente solo dice cuál es, porque depende del orden y
                  // eso el CSS no lo sabe.
                  data-pos={sale ? undefined : Math.max(pos, 0)}
                  data-sale={sale ? "si" : undefined}
                  data-fondo={!sale && pos > 2 ? "si" : undefined}
                  aria-hidden={esFrente ? undefined : "true"}
                  onPointerDown={(e) => alBajar(e, k)}
                  onPointerMove={alMover}
                  onPointerUp={alSoltar}
                  onPointerCancel={alSoltar}
                >
                  {ficha && (
                    <div className="trat-foto">
                      <Image
                        src={ficha.src}
                        alt={ficha.alt}
                        fill
                        sizes="(min-width: 1024px) 26rem, 84vw"
                        priority={k === 0}
                        loading={k === 0 ? undefined : "lazy"}
                        draggable={false}
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div aria-hidden="true" className="trat-franja">
                    <span className="trat-franja-linea" />
                    <span className="trat-franja-num">
                      {String(k + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* AQUÍ VIVÍA UN ENLACE DE WHATSAPP POR FICHA -- una flecha en
                      la esquina superior de la carta, con su propio mensaje
                      prellenado por tratamiento --. Se retiró: la conversión de
                      la página vive entera en el botón del cierre, y esas cinco
                      flechas eran cinco entradas más a la misma acción,
                      repartidas por una superficie que además es arrastrable. */}

                  <div className="trat-banda">
                    <p className="trat-banda-kicker">{ficha?.kicker}</p>

                    {/* NOMBRE Y PRECIO COMPARTEN RENGLÓN, con la cifra anclada
                        al canto derecho y sentada en la misma línea base.

                        El precio ocupaba un renglón propio a 22px y ahí pesaba
                        como un segundo titular: confirmaba un dato que nadie
                        había pedido todavía, y empujaba la descripción al final
                        como si fuera una nota. Devuelto al costado del nombre y
                        a 13px, vuelve a ser lo que es -- un dato de apoyo -- y
                        el renglón que libera se lo queda la descripción, que es
                        lo que explica el valor del tratamiento. */}
                    <div className="trat-banda-fila">
                      <h3 className="trat-banda-nombre">{servicio.name}</h3>
                      <p className="trat-banda-precio">{precio}</p>
                    </div>

                    <p className="trat-banda-desc">{ficha?.resumen}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LA BARRA DE PROGRESO. Con la baraja, el tramo dice por qué carta del
            mazo vamos, igual que antes decía por qué ficha del riel. */}
        <div aria-hidden="true" className="trat-progreso">
          <span
            className="trat-progreso-tramo"
            style={{
              width: `${100 / total}%`,
              transform: `translateX(${activo * 100}%)`,
            }}
          />
        </div>

        {/* GOTA ANCLADA. La banda libre entre la barra de progreso y la firma
            del cierre se mueve con el alto de la pantalla, porque la carta se
            dimensiona con dvh. Un ancla de altura cero en el flujo la deja
            siempre en el mismo sitio relativo, sea cual sea el teléfono. */}
        <div aria-hidden="true" className="trat-gota-ancla lg:hidden">
          <span className="trat-gota trat-gota-4" />
        </div>

        <p aria-live="polite" className="sr-only">
          Tratamiento {activo + 1} de {total}
          {servicios[activo] ? `: ${servicios[activo].name}` : ""}
        </p>
      </div>
    </>
  );
}
