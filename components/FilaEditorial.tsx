"use client";

import { useEffect, useState } from "react";

import type { Service } from "@/data/services";
import { mxn, RANGE_NOTE } from "@/data/services";
import { waLink } from "@/lib/site";
import { ModalLargos } from "@/components/ModalLargos";

type FilaEditorialProps = {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
};

// Columna de cifras: ancho FIJO con text-right, que es lo que hace que todos
// los precios terminen en el mismo eje. Si fuera automático, cada cifra
// terminaría en un x distinto y la columna dejaría de leerse de un vistazo.
//
// El precio más largo ("$2,600 – $4,400") mide 140.9px a 18px de Jost, 125.2px
// a 16px y 109.6px a 14px. De ahí los tres tramos, que existen para que la fila
// entre completa en cada ancho sin que el nombre ceda tamaño:
//
//   < 360px : cifra 14px, columna w-28 (112px), huecos de 8px  -> fila 263.8px
//   >= 360  : cifra 16px, columna w-32 (128px), huecos de 12px -> fila 287.8px
//   >= 640  : cifra 18px, columna w-36 (144px), huecos de 16px -> fila 311.8px
//
// whitespace-nowrap es obligatorio: sin él la cifra se parte en dos renglones y
// la altura de la fila deja de ser constante -- fue justo lo que pasó con la
// columna a 128px y el precio a 18px.
const COLUMNA_PRECIO = "w-28 min-[360px]:w-32 sm:w-36";

// Interletrado para Bodoni Moda, pedido. La cifra va en Jost y no lo lleva.
//
// VARIANTE ÓPTICA 18pt: NO está en la carga de fuentes del proyecto, así que
// aquí no se pide. Lo que sirve el proyecto es "Bodoni Moda 11pt", un variable
// con un solo eje (wght 400..900); el eje opsz viene aplanado en 11 porque
// app/layout.tsx llama a Bodoni_Moda sin `axes: ["opsz"]`. Verificado con
// fontTools sobre los cuatro woff2 de .next/static/media. Los números y el
// costo de habilitarlo están en el reporte; es un cambio en la carga global de
// fuentes, fuera del alcance de /menu.
const TRACKING_DISPLAY = "tracking-[-0.056em]";

export function FilaEditorial({
  service,
  isOpen,
  onToggle,
}: FilaEditorialProps) {
  const panelId = `servicio-${service.slug}`;
  const notaId = `rango-${service.slug}`;
  // El disclaimer arranca plegado. Se repliega también al cerrar el servicio,
  // para que al volver a abrirlo el estado sea el mismo de la primera vez.
  const [notaAbierta, setNotaAbierta] = useState(false);
  useEffect(() => {
    if (!isOpen) setNotaAbierta(false);
  }, [isOpen]);
  const esRango = service.min !== service.max;
  const price = esRango
    ? `${mxn(service.min)} – ${mxn(service.max)}`
    : mxn(service.min);

  return (
    <li>
      {/* El renglón completo es el control: <button> nativo, operable con
          Enter/Space, con aria-expanded y aria-controls.

          items-baseline: nombre y precio comparten línea base pese a tener
          cuerpos distintos (24 y 18px). py-6 da 24px arriba y abajo; como nada
          envuelve, todos los renglones miden lo mismo. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-baseline gap-2 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift min-[360px]:gap-3 sm:gap-4"
      >
        {/* Nombre a la izquierda, en REDONDA. whitespace-nowrap es deliberado:
            ningún nombre se parte. El más ancho ("Tinte global") mide 126.8px a
            24px con este interletrado y peso 700 (eran 123.8 en cursiva a 600);
            con la columna de cifras, los huecos y el cheurón la fila necesita
            290.8px, y a 360px de viewport el bloque mide 312, así que quedan 21px
            de aire en medio.

            PESO 700, y de dónde sale. Al quitar la cursiva el nombre no perdió
            tinta -- medida la masa de píxeles de los seis nombres, la oblicua a
            600 daba 14 130px y la redonda a 600 da 14 451, un 2% más -- pero sí
            perdió la única marca que lo separaba de la cifra por POSTURA. Con
            los dos en redonda, la jerarquía tiene que sostenerse en familia,
            cuerpo y peso, y el peso es la palanca que quedaba.

            Masa de tinta del nombre contra la de la cifra, medida en los seis
            renglones: 1.80x en cursiva 600 (el punto de partida), 1.84x en
            redonda 600, 2.09x en redonda 700, 2.37x en 800 y 2.73x en 900. El
            700 recupera con holgura la dominancia que daba la cursiva (+16%
            sobre ella) sin volverse un titular.

            No se fue más arriba porque en un Didone el peso se paga en el trazo
            fino: medido a dsf=4, el asta fina pasa de 1.00px en cursiva 600 a
            1.00 en 700, 1.25 en 800 y 1.50 en 900, y con ello el contraste
            grueso/fino cae de 4.00 (700) a 3.80 y 3.67. Es decir que del 800 en
            adelante el Bodoni empieza a engordar la hairline y a leerse como una
            gótica de titular, que no es la voz de la lista. El 700 es el peso
            más alto que conserva el contraste de trazo del Didone.

            La cifra se queda en 400 y no baja a 300: Jost a 300 sobre este fondo
            adelgaza el trazo justo en el dato que la clienta viene a leer, y la
            jerarquía ya está resuelta por arriba. */}
        <span
          className={`flex-1 whitespace-nowrap font-display text-2xl font-bold ${TRACKING_DISPLAY} text-shell-lift`}
        >
          {service.name}
        </span>

        {/* Cifra: peso 400 contra el 700 del nombre. Ver el reporte. */}
        <span
          className={`${COLUMNA_PRECIO} shrink-0 text-right text-sm font-normal whitespace-nowrap text-shell-lift min-[360px]:text-base sm:text-lg`}
        >
          {price}
        </span>

        {/* Indicador: cheurón de trazo de 1px, sin superficie. A /55 queda por
            debajo del precio en peso óptico, así que no compite con la cifra. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className={`mt-[0.3em] h-3 w-3 shrink-0 text-shell-lift/55 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path strokeLinecap="round" d="M2.5 4.5L6 8l3.5-3.5" />
        </svg>
      </button>

      {/* Panel: sin caja, alineado al mismo eje izquierdo que el nombre.
          lg:max-w-[30rem] no es decisión tipográfica sino de contraste: sin el
          cristal tintado, en escritorio lo que queda detrás del texto es la foto
          y la mitad visible de la rueda de colorimetría. El hueco más estrecho
          hasta donde arranca la rueda es de 504px (a 1024), así que 480px la
          libra en todos los anchos. */}
      <div
        id={panelId}
        hidden={!isOpen}
        className="animate-[accordion-in_200ms_ease-out] pb-8 lg:max-w-[30rem]"
      >
        <p className="text-sm break-words text-shell-lift/90">{service.copy}</p>

        {service.note && (
          <p className="mt-1 text-xs break-words uppercase tracking-wide text-shell-lift/90">
            {service.note}
          </p>
        )}

        {/* LAS DOS ACCIONES: PAREJA DE CÁPSULAS DE VIDRIO.

            Vuelve la superficie, pedida, y con ella la diferenciación cromática
            de la paleta: `dune` (#a05035), el acento de marca, para la acción;
            `clay` (#b88d6a), el neutro de bordes y divisores, para la consulta.

            MISMA ALTURA, y de ahí el h-8 en las dos. Es lo que las vuelve una
            pareja en vez de dos objetos sueltos: 32px de cápsula, por debajo de
            los 44 de los botones grandes del sitio y por encima de los 26 del
            regreso. La altura no la fija el texto sino la caja, así que los dos
            cuerpos -- 18px de Bodoni y 11px de Jost -- caben centrados en la
            misma cápsula sin que ninguna crezca.

            LA JERARQUÍA, ahora en material y en croma además de tipografía:

              principal   vidrio TEÑIDO: dune al 50% con borde a /50. Bodoni
                          18px redonda, crema al 100%.
              secundaria  vidrio CASI LIMPIO: clay al 10% con borde a /30, o
                          sea solo el desenfoque y el contorno. Jost 11px en
                          versalita espaciada a 0.25em -- la voz del kicker --,
                          crema al 70%.

            El tinte de la principal se queda en /50, y la separación entre las
            dos superficies hay que medirla en croma y no en luminancia: los
            píxeles compuestos dan 1.13-1.27:1 de razón de contraste -- casi
            nada -- pero ΔE76 de 13.1 a 16.5, muy por encima del umbral de
            percepción (unos 2.3). Es decir que la pareja no se distingue por
            clara y oscura sino por cálida-roja y cálida-neutra, que es
            exactamente lo que hacen dune y clay en la paleta. Por encima de /65
            el tinte deja de parecer vidrio y empieza a parecer relleno.

            El relleno horizontal va en proporción al cuerpo de cada texto:
            px-4 (0.89em) en la principal y pl-4 con pr-[calc(1rem-0.25em)] en
            la secundaria, que descuenta el espacio que la versalita espaciada
            deja colgando tras la última letra -- sin ese descuento la cápsula
            se ve 2.75px más holgada por la derecha.

            El área de toque sale del ::after: 32px de cápsula y 46 de acierto,
            sin ocupar layout.

            flex-wrap es la red de seguridad, no el plan: medido, las dos
            cápsulas más el hueco suman 280.4px y el bloque más angosto de un
            teléfono declarado -- 360px de viewport -- ofrece 312. */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={waLink(`Hola Axel, me interesa ${service.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex h-8 items-center rounded-full border border-dune/50 bg-dune/50 px-4 font-display text-lg leading-none tracking-[-0.056em] text-shell-lift backdrop-blur-xl transition-colors duration-150 after:absolute after:inset-x-0 after:-inset-y-2 after:content-[''] hover:bg-dune/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
          >
            Escríbeme
          </a>

          {esRango && <ModalLargos />}
        </div>

        {/* El disclaimer, plegado. El rótulo no es genérico a propósito: dice la
            pregunta que provoca la cifra, así que quien dude al ver el rango
            reconoce ahí su respuesta.

            Sin caja ni superficie: solo texto, un cheurón de trazo de 1px -- el
            mismo del acordeón y del modal -- y espacio. El área de toque sale
            del ::after, igual que en las píldoras: el rótulo mide 17px de alto
            y el toque real 45px. */}
        {esRango && (
          <div className="mt-7">
            <button
              type="button"
              onClick={() => setNotaAbierta((v) => !v)}
              aria-expanded={notaAbierta}
              aria-controls={notaId}
              className="relative inline-flex items-center gap-2 text-left text-xs font-medium text-shell-lift/80 transition-colors duration-150 after:absolute after:inset-x-0 after:-inset-y-3.5 after:content-[''] hover:text-shell-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
            >
              ¿Por qué el precio es un rango?
              <svg
                aria-hidden="true"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
                className={`size-3 shrink-0 text-shell-lift/55 transition-transform duration-200 ${
                  notaAbierta ? "rotate-180" : ""
                }`}
              >
                <path strokeLinecap="round" d="M2.5 4.5L6 8l3.5-3.5" />
              </svg>
            </button>

            {/* Al desplegarse tiene que LEERSE. Pasa de 12px de Bodoni cursiva
                sintética a 13px de Jost redonda: la oblicua era la causa real de
                que costara -- el proyecto no carga la itálica de Bodoni, así que
                era una redonda Didone cizallada, con astas finísimas, para tres
                renglones de texto corrido. Sigue subordinada, pero por
                jerarquía: 13px contra los 14px de la descripción y tono /80
                contra /90. Ver el reporte. */}
            <div id={notaId} hidden={!notaAbierta} className="mt-3">
              <p className="text-[0.8125rem] leading-relaxed text-shell-lift/80">
                {RANGE_NOTE}
              </p>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
