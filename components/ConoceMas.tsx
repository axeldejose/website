"use client";

import Image from "next/image";
import { useRef, useState } from "react";

// Botón "Conóceme más" + modal con la biografía de Axel.
//
// ─── REDISEÑO CONTRA REFERENCIA VISUAL ───────────────────────────────────────
// La ventana pasó de un bloque de texto corrido a dos partes: una portada
// fotográfica arriba y un acordeón temático abajo. El texto de la biografía no
// cambia una palabra; lo que cambia es cómo se reparte y se lee.
//
// ESTE COMPONENTE ES COMPARTIDO. Lo importan app/page.tsx (la portada del
// sitio) y app/menu/page.tsx, así que el rediseño se ve en las dos rutas. Se
// hizo así por decisión explícita: la alternativa era duplicarlo y mantener dos
// biografías en paralelo.
//
// ─── LA PORTADA ES SOLO FOTOGRAFÍA Y CIERRE ─────────────────────────────────
// Primero se retiró el "AXEL" superpuesto con su velo de cabecera, y después la
// etiqueta terracota entera -- superficie, rótulo COLORISTA, "de José" y la
// regla corta de debajo --. No queda nada encima de la imagen salvo el botón de
// cerrar.
//
// EL <h2> SIGUE AHÍ, EN sr-only, Y NO ES UN RESTO. El <dialog> se nombra con
// aria-labelledby apuntando a ese título: si desapareciera, la ventana se
// anunciaría sin nombre. Queda invisible, que es lo que se pidió -- fuera de la
// portada -- sin perder el nombre accesible.
//
// ─── DOS FOTOGRAFÍAS QUE SE CRUZAN ──────────────────────────────────────────
// ae.webp (941x1176, vertical: Axel sentado en su estudio) y axel2.png
// (2688x1520, apaisada: Axel aplicando color, visto en el espejo). Las dos
// cubren el bloque entero y cada una lleva su propio encuadre, porque sus
// proporciones no se parecen en nada. Las cifras están en globals.css.
const SECCIONES = [
  {
    id: "colorimetria",
    titulo: "Colorimetría",
    // CADA SECCIÓN ES UNA LISTA DE PÁRRAFOS, y cada párrafo puede llevar su
    // frase destacada. Antes era un solo bloque con un único `destacado`, y esa
    // forma no dejaba partir el texto ni darle a cada sección su propio acento.
    parrafos: [
      {
        antes: "Soy estilista ",
        destacado: "especialista en colorimetría capilar",
        despues:
          " y diseño de color, reconocido como uno de los mejores coloristas de México tras mi participación en el reality show Style & Colour Trophy México de L’Oréal Professionnel.",
      },
    ],
  },
  {
    id: "ciencia",
    titulo: "Ciencia del cabello",
    parrafos: [
      {
        antes: "Mi paso por ",
        destacado: "los laboratorios de L’Oréal",
        despues:
          ", en el Research & Innovation Center, me enseñó a leer el cabello y los activos de los tratamientos, para calificar con precisión qué productos usar.",
      },
    ],
  },
  {
    id: "resultados",
    titulo: "Resultados",
    parrafos: [
      {
        antes:
          "Ya sea con cabello dañado por decoloraciones anteriores o buscando un diseño de color desde cero, logro ",
        destacado: "un resultado suave, brillante y manejable",
        despues: ".",
      },
    ],
  },
  {
    id: "uno-a-uno",
    titulo: "Uno a uno",
    parrafos: [
      {
        antes: "Cada cita es ",
        destacado: "un servicio uno a uno",
        despues:
          ": te escucho, te guío y te dedico toda mi atención, sin prisas ni interrupciones.",
      },
    ],
  },
];

export function ConoceMas({ className = "" }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // La primera abierta y las demás cerradas. Acordeón exclusivo: una sección a
  // la vez, que es lo que evita que la ventana crezca sin control al abrirlas
  // todas.
  const [abierta, setAbierta] = useState<string | null>(SECCIONES[0]!.id);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const onBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) close();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`pastilla-contorno flex min-h-[40px] items-center justify-center rounded-full px-3 text-xs ${className}`}
      >
        Conóceme más <span aria-hidden="true">→</span>
      </button>

      {/* EL DESVANECIMIENTO se conserva del diseño anterior: solo opacidad, sin
          `scale` ni cambio de geometría, para que la ventana no se contraiga al
          cerrarse. Las propiedades discretas (display y overlay) necesitan
          transition-behavior: allow-discrete para que el elemento siga en el
          árbol mientras se desvanece, y @starting-style para tener estado de
          partida al abrir. */}
      <dialog
        ref={dialogRef}
        onClick={onBackdropClick}
        aria-labelledby="bio-titulo"
        className="cm-dialogo m-auto w-[min(92vw,32rem)] overflow-y-auto rounded-2xl bg-shell p-0 text-tierra opacity-0 transition-[opacity,display,overlay] transition-discrete duration-200 ease-out backdrop:bg-tierra/0 backdrop:transition-[background-color,display,overlay] backdrop:transition-discrete backdrop:duration-200 open:opacity-100 open:backdrop:bg-tierra/70 starting:open:opacity-0 starting:open:backdrop:bg-tierra/0"
      >
        {/* ─── LA PORTADA ──────────────────────────────────────────────────
            Dos fotografías apiladas que se cruzan en bucle, la etiqueta
            terracota y el cierre. Nada más: sin nombre y sin velo. */}
        <div className="cm-portada">
          {/* LA DE ABAJO va siempre opaca y es la que sostiene el bloque: la de
              arriba se limita a aparecer y desaparecer encima. Así el cruce es
              una disolvencia de verdad -- el resultado es B·alfa + A·(1-alfa) --
              y no hay ningún instante en que se vea el fondo entre las dos.

              CADA UNA VA DENTRO DE SU PROPIO ENVOLTORIO, y no es un envoltorio
              de más: es lo que permite darle a cada fotografía una caja de
              geometría distinta de la lámina. `fill` de next/image escribe
              width, height e inset EN LÍNEA, así que desde la hoja de estilos no
              se pueden mover; puesto el tamaño en el envoltorio, la imagen llena
              ESE y la lámina lo recorta. */}
          <span className="cm-foto cm-foto-a">
            <Image
              src="/ae.webp"
              alt="Axel De José sentado en el sillón de su estudio, con el mueble de tintes y el muro claro al fondo."
              fill
              sizes="(min-width: 640px) 64rem, 190vw"
              className="cm-img object-cover"
            />
          </span>

          <span className="cm-foto cm-foto-b">
            <Image
              src="/axel2.png"
              alt="Axel De José aplicando color a una clienta, reflejado en el espejo de su estudio."
              fill
              sizes="(min-width: 640px) 32rem, 92vw"
              className="cm-img object-cover"
            />
          </span>

          {/* EL TÍTULO ACCESIBLE, invisible. Es lo que nombra al <dialog> vía
              aria-labelledby; sin él la ventana se anunciaría sin nombre. */}
          <h2 id="bio-titulo" className="sr-only">
            Axel De José
          </h2>

          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="cm-cerrar"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="h-5 w-5"
            >
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* ─── EL CUERPO ───────────────────────────────────────────────────
            Sobre superficie clara: el rótulo con su regla y el acordeón. */}
        <div className="cm-cuerpo">
          {/* EL RÓTULO. Era una versalita de 11px que decía "CONÓCEME"; ahora
              es una frase en la serif de display. Conserva la regla que se
              lleva el ancho sobrante a su derecha. Esto es el rótulo DE DENTRO
              del modal: el botón que lo abre no se toca. */}
          <p className="cm-rotulo">
            <span>Hola, me presento</span>
            <span aria-hidden="true" className="cm-rotulo-regla" />
          </p>

          <div className="cm-acordeon">
            {SECCIONES.map((s, i) => {
              const esta = abierta === s.id;
              return (
                <section key={s.id} className="cm-seccion">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setAbierta(esta ? null : s.id)}
                      aria-expanded={esta}
                      aria-controls={`cm-panel-${s.id}`}
                      className="cm-seccion-titulo"
                    >
                      {/* LA NUMERAL Y EL TÍTULO van juntos en una pieza, así el
                          `space-between` del botón manda el signo al canto
                          derecho y no reparte tres cosas a lo ancho.

                          La numeral es decorativa: no aporta información que no
                          esté ya en el orden de lectura, y leerla en voz alta
                          antes de cada título sería ruido. De ahí el
                          aria-hidden. */}
                      <span className="cm-seccion-etiqueta">
                        <span aria-hidden="true" className="cm-numeral">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s.titulo}
                      </span>
                      {/* Raya cuando está abierta, cruz cuando está cerrada. Es
                          decorativo: el estado real lo anuncia aria-expanded. */}
                      <span aria-hidden="true" className="cm-signo">
                        {esta ? "—" : "+"}
                      </span>

                      {/* LA MARCA DE LA ABIERTA. Regla de 2px pegada al canto
                          izquierdo de la banda iluminada. Señala cuál está
                          abierta sin sumar un divisor más. Solo se pinta cuando
                          la sección lo está: la regla vive en globals.css. */}
                    </button>
                  </h3>

                  {/* ─── EL PANEL, ANIMADO ────────────────────────────────
                      YA NO USA `hidden`, Y ES LA CLAVE DE QUE LA APERTURA SEA
                      SUAVE. `hidden` es display:none, y ninguna propiedad se
                      puede interpolar desde ahí: el contenido aparecía de
                      golpe. Ahora el panel es una retícula de una fila que va
                      de `0fr` a `1fr`, que es la única forma de animar un alto
                      que no se conoce de antemano sin medirlo con JavaScript.
                      El envoltorio interior lleva el `overflow: hidden` que
                      recorta el contenido mientras la fila crece.

                      Y COMO YA NO SE OCULTA CON `hidden`, HACE FALTA `inert`:
                      sin él, el texto de las secciones cerradas seguiría en el
                      árbol de accesibilidad y en el orden de tabulación aunque
                      no se vea. `inert` lo saca de los dos. */}
                  <div
                    id={`cm-panel-${s.id}`}
                    inert={!esta}
                    className="cm-panel"
                  >
                    <div className="cm-panel-interior">
                      <span aria-hidden="true" className="cm-seccion-regla" />
                      {s.parrafos.map((parrafo, i) => (
                        <p key={i} className="cm-parrafo">
                          {parrafo.antes}
                          <em className="cm-destacado">{parrafo.destacado}</em>
                          {parrafo.despues}
                        </p>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          <p className="cm-cita">
            <span>Solo con cita previa.</span>
            <span aria-hidden="true" className="cm-cita-regla" />
          </p>
        </div>
      </dialog>
    </>
  );
}
