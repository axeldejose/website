"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// Orden fijo, de menor a mayor largo. El alt describe el largo porque la
// etiqueta va impresa DENTRO de la imagen y no existe como texto en el DOM.
const LARGOS = [
  {
    id: "corto",
    archivo: "/largo-1-corto.webp",
    alt: "Largo corto: el cabello llega a la clavícula.",
    nombre: "Corto",
    referencia: "A la clavícula",
  },
  {
    id: "mediano",
    archivo: "/largo-2-mediano.webp",
    alt: "Largo mediano: el cabello llega al busto.",
    nombre: "Mediano",
    referencia: "Al busto",
  },
  {
    id: "largo",
    archivo: "/largo-3-largo.webp",
    alt: "Largo: el cabello llega a la cintura alta.",
    nombre: "Largo",
    referencia: "A la cintura alta",
  },
  {
    id: "extra",
    archivo: "/largo-4-extra-largo.webp",
    alt: "Extra largo: el cabello llega a la cadera.",
    nombre: "Extra largo",
    referencia: "A la cadera",
  },
];

// Consulta secundaria. Comparte con el botón de WhatsApp el material (vidrio:
// desenfoque alto, tinte bajo, contorno tenue) y la forma de píldora, y se
// distingue por CROMA: clay (#b88d6a), el beige neutro de la paleta, contra el
// dune (#a05035) terracota del principal. Ver el reporte.
//
// El área de toque no viene del relleno sino de un ::after que extiende el
// blanco de acierto por arriba y por abajo sin ocupar espacio en el layout. Es
// lo que permite que la píldora mida ~30px de alto y siga teniendo 46px de
// toque: con min-h-11 el botón volvería a los 44px visuales que se pidió
// reducir.
// Cápsula de la consulta secundaria. Misma altura (h-8) y misma forma que la
// principal, para que se lean como pareja; la jerarquía la marcan el material y
// el croma: aquí el vidrio va casi limpio -- clay al 10% con borde a /30, o sea
// desenfoque y contorno -- contra el dune al 50% de la acción. La tipografía
// mantiene la voz del kicker: Jost 11px en versalita espaciada.
//
// El pr descuenta el espacio que la versalita espaciada deja tras la última
// letra (0.25em), para que la cápsula no se vea más holgada por la derecha.
//
// El razonamiento completo de la pareja está en FilaEditorial.tsx.
const CAPSULA_SECUNDARIA =
  "relative inline-flex h-8 items-center rounded-full border border-clay/30 bg-clay/10 pl-4 pr-[calc(1rem-0.25em)] text-[11px] uppercase leading-none tracking-[0.25em] text-shell-lift/70 backdrop-blur-xl transition-colors duration-150 after:absolute after:inset-x-0 after:-inset-y-2 after:content-[''] hover:bg-clay/20 hover:text-shell-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!";

export function ModalLargos() {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [i, setI] = useState(0);

  const abrir = () => {
    setI(0);
    setAbierto(true);
  };

  // showModal() tiene que correr DESPUÉS de que el contenido exista, porque el
  // navegador mueve el foco al primer elemento enfocable del diálogo al abrir.
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  // El <dialog> nativo cierra con Escape por su cuenta y emite "close": esto
  // solo sincroniza el estado de React para que el contenido se desmonte.
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    const alCerrar = () => setAbierto(false);
    d.addEventListener("close", alCerrar);
    return () => d.removeEventListener("close", alCerrar);
  }, []);

  const mover = useCallback(
    (delta: number) =>
      setI((actual) =>
        Math.min(LARGOS.length - 1, Math.max(0, actual + delta)),
      ),
    [],
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
  // La carta de arriba sigue al dedo y se inclina; al soltar, o sale de cuadro
  // con impulso o regresa con rebote. Todo el movimiento del arrastre se
  // escribe DIRECTO al nodo por ref dentro de un requestAnimationFrame: si
  // pasara por estado de React habría un render por frame y el gesto se
  // sentiría con retraso. React solo se entera dos veces por gesto -- al
  // determinar la dirección y al confirmar el cambio.
  const carta = useRef<HTMLDivElement>(null);
  const inicioX = useRef<number | null>(null);
  const inicioY = useRef(0);
  const dx = useRef(0);
  const ultimo = useRef({ x: 0, t: 0 });
  const velocidad = useRef(0);
  const rafPendiente = useRef(false);
  const eje = useRef<"sin definir" | "horizontal" | "vertical">("sin definir");
  const [revelado, setRevelado] = useState<number | null>(null);
  const [saliendo, setSaliendo] = useState(false);
  // Guarda SÍNCRONA de la salida. No basta el estado: la animación de descarte
  // transiciona transform y opacity, así que transitionend se dispara dos veces
  // y las dos veces el closure ve el mismo valor de `saliendo`. Sin esta
  // guarda el cambio se aplicaba dos veces, +1 y luego -1, y la carta volvía
  // al mismo largo.
  const saliendoRef = useRef(false);

  const reducido = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const GRADOS_POR_PX = 0.04; // ~4 grados a 100px de arrastre
  const TOPE_GRADOS = 7;

  const pintar = () => {
    rafPendiente.current = false;
    const n = carta.current;
    if (!n) return;
    const d = dx.current;
    const g = Math.max(-TOPE_GRADOS, Math.min(TOPE_GRADOS, d * GRADOS_POR_PX));
    n.style.transform = `translate3d(${d}px,0,0) rotate(${g}deg)`;
  };

  const puedeIr = (delta: number) =>
    i + delta >= 0 && i + delta < LARGOS.length;

  const alBajar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (saliendo) return;
    inicioX.current = e.clientX;
    inicioY.current = e.clientY;
    dx.current = 0;
    eje.current = "sin definir";
    velocidad.current = 0;
    ultimo.current = { x: e.clientX, t: performance.now() };
    const n = carta.current;
    if (n) n.style.transition = "none";
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
    // soltar cambia la imagen. Lo que se omite es todo el movimiento -- la
    // carta no sigue al dedo, no se inclina, no vuela y no rebota. Quitar el
    // gesto entero le habría quitado función, no solo animación.
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
    const ancho = n?.offsetWidth ?? 300;
    const umbral = Math.max(56, ancho * 0.22);
    const d = dx.current;
    const direccion = d < 0 ? 1 : -1;
    // El impulso cuenta: un movimiento corto pero rápido también descarta.
    const impulso = Math.abs(velocidad.current) > 0.6;
    const descarta =
      puedeIr(direccion) &&
      (Math.abs(d) > umbral || (impulso && Math.abs(d) > 20));

    if (reducido()) {
      dx.current = 0;
      setRevelado(null);
      if (descarta) mover(direccion);
      return;
    }

    if (!n) return;

    if (descarta) {
      saliendoRef.current = true;
      setSaliendo(true);
      const fuera = (ancho + 120) * (d < 0 ? -1 : 1);
      n.style.transition =
        "transform 240ms cubic-bezier(.32,.72,0,1), opacity 240ms linear";
      n.style.transform = `translate3d(${fuera}px,0,0) rotate(${
        (d < 0 ? -1 : 1) * 12
      }deg)`;
      n.style.opacity = "0";
    } else {
      // Rebote suave: la curva sobrepasa el 0 y vuelve.
      n.style.transition = "transform 340ms cubic-bezier(.34,1.46,.64,1)";
      n.style.transform = "translate3d(0,0,0) rotate(0deg)";
      dx.current = 0;
      setRevelado(null);
    }
  };

  // Al terminar la salida se confirma el cambio y se reposiciona la carta sin
  // transición, para que no se vea volver desde fuera de cuadro.
  const alTerminarTransicion = (e: React.TransitionEvent<HTMLDivElement>) => {
    // Solo el transform cierra el gesto, y solo una vez.
    if (e.propertyName !== "transform") return;
    if (!saliendoRef.current) return;
    saliendoRef.current = false;
    const direccion = dx.current < 0 ? 1 : -1;
    const n = carta.current;
    if (n) {
      n.style.transition = "none";
      n.style.transform = "translate3d(0,0,0) rotate(0deg)";
      n.style.opacity = "1";
    }
    dx.current = 0;
    setSaliendo(false);
    setRevelado(null);
    mover(direccion);
  };

  // Cada vez que cambia la imagen activa (teclado, puntos, flechas) la carta
  // arranca limpia.
  useEffect(() => {
    const n = carta.current;
    if (!n) return;
    n.style.transition = "none";
    n.style.transform = "translate3d(0,0,0) rotate(0deg)";
    n.style.opacity = "1";
    dx.current = 0;
  }, [i, abierto]);

  const actual = LARGOS[i];

  return (
    <>
      <button type="button" onClick={abrir} className={CAPSULA_SECUNDARIA}>
        Guía de largos
      </button>

      <dialog
        ref={dialogo}
        aria-label="Guía de largos de cabello"
        onKeyDown={alTeclear}
        className="modal-largos m-auto max-h-[94vh] w-[min(94vw,30rem)] rounded-2xl border border-clay/20 bg-tierra/80 p-4 text-shell-lift backdrop-blur-2xl"
      >
        {/* El contenido solo existe mientras está abierto, así que las cuatro
            imágenes no se descargan hasta que el usuario abre la ventana. */}
        {abierto && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              {/* Indicador: nombre del largo con presencia y referencia
                  corporal subordinada. La jerarquía la hace el PESO -- 600
                  contra 400, el mismo salto de dos pasos que separa el nombre
                  del servicio del precio en la lista -- reforzada por la caja
                  (versales contra caja baja) y un escalón de tono. */}
              <p className="min-w-0 text-xs">
                <span className="font-semibold uppercase tracking-widest text-shell-lift">
                  {actual.nombre}
                </span>{" "}
                <span className="font-normal text-shell-lift/70">
                  {actual.referencia}
                </span>
              </p>

              <button
                type="button"
                autoFocus
                onClick={() => setAbierto(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-clay/20 text-xl leading-none text-shell-lift transition-colors duration-150 hover:bg-clay/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
              >
                <span aria-hidden="true">×</span>
                <span className="sr-only">Cerrar</span>
              </button>
            </div>

            {/* Baraja de dos capas. La de abajo es la carta que se revela --
                i+1 al arrastrar a la izquierda, i-1 a la derecha -- y solo se
                monta cuando el gesto ya definió su dirección. La de arriba es
                la activa: es la única que recibe el transform.

                overflow-hidden hace que la carta descartada se recorte en el
                marco en vez de volar sobre el resto del modal.

                touch-pan-y deja pasar el desplazamiento vertical al navegador;
                el eje del gesto se decide una sola vez en alMover y, si sale
                vertical, el gesto se suelta. */}
            <div
              onPointerDown={alBajar}
              onPointerMove={alMover}
              onPointerUp={alSoltar}
              onPointerCancel={alSoltar}
              onDragStart={(e) => e.preventDefault()}
              className="relative mx-auto aspect-[900/1599] h-[70vh] max-w-full touch-pan-y cursor-grab overflow-hidden rounded-xl select-none active:cursor-grabbing"
            >
              {revelado !== null && (
                <Image
                  key={LARGOS[revelado].id}
                  src={LARGOS[revelado].archivo}
                  alt={LARGOS[revelado].alt}
                  width={900}
                  height={1599}
                  sizes="(min-width: 640px) 26rem, 88vw"
                  priority
                  draggable={false}
                  className="absolute inset-0 size-full rounded-xl object-cover"
                />
              )}

              <div
                ref={carta}
                onTransitionEnd={alTerminarTransicion}
                className="absolute inset-0 z-10 will-change-transform"
              >
                {LARGOS.map((l, k) => (
                  <Image
                    key={l.id}
                    src={l.archivo}
                    alt={l.alt}
                    width={900}
                    height={1599}
                    sizes="(min-width: 640px) 26rem, 88vw"
                    // Las cuatro en eager: el sentido de la galería es
                    // comparar, y con loading="lazy" la siguiente llegaba en
                    // blanco tras el cambio. Ver el reporte para los bytes.
                    priority
                    hidden={k !== i}
                    draggable={false}
                    className="size-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              {/* Secundarias por diseño: el mecanismo principal es el
                  deslizamiento. Sin píldora ni contorno, solo un cheurón de
                  trazo de 1px al 55% -- el mismo recurso que el indicador del
                  acordeón. Se conservan porque el teclado y el ratón necesitan
                  un control visible; las flechas del teclado también funcionan. */}
              <button
                type="button"
                onClick={() => mover(-1)}
                disabled={i === 0}
                className="inline-flex size-11 shrink-0 items-center justify-center text-shell-lift/55 transition-opacity duration-150 hover:text-shell-lift disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
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
                <span className="sr-only">Largo anterior</span>
              </button>

              <ul className="flex items-center gap-2">
                {LARGOS.map((l, k) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => setI(k)}
                      aria-current={k === i ? "true" : undefined}
                      className={`block size-2 rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift! ${
                        k === i ? "bg-shell-lift" : "bg-shell-lift/30"
                      }`}
                    >
                      <span className="sr-only">
                        {l.nombre}, {l.referencia.toLowerCase()}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => mover(1)}
                disabled={i === LARGOS.length - 1}
                className="inline-flex size-11 shrink-0 items-center justify-center text-shell-lift/55 transition-opacity duration-150 hover:text-shell-lift disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
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
                <span className="sr-only">Largo siguiente</span>
              </button>
            </div>

            {/* Región viva: anuncia el cambio de largo a lectores de pantalla,
                que no "ven" el reemplazo de la imagen. */}
            <p aria-live="polite" className="sr-only">
              {actual.nombre}, {actual.referencia.toLowerCase()}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
