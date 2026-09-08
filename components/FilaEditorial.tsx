"use client";

import { useEffect, useState } from "react";

import type { Service } from "@/data/services";
import { mxn, RANGE_NOTE_LINEAS } from "@/data/services";
import { waLink } from "@/lib/site";
import { ModalLargos } from "@/components/ModalLargos";

type FilaEditorialProps = {
  service: Service;
  isOpen: boolean;
  onToggle: () => void;
  // Cambia la voz del nombre: de la display (Bodoni 24px) a la de cuerpo del
  // sitio (Jost) a 30px. Solo la usa la segunda carta de /menu, y es parte de
  // lo que la distingue de la lista de color: el CUERPO ya no, que ahora es el
  // mismo en las dos (ver CUERPO_NOMBRE).
  //
  // 30px Y NO 36, QUE ES LO QUE TENÍA. A 36 la sección pesaba más que la lista
  // de color sin necesitarlo. La referencia para bajar es la altura de tinta
  // medida (mayúscula más asta descendente): la Bodoni de la lista mide 24.50px
  // a 24 de cuerpo, y la Jost de aquí da 34.25 a 36, 28.5 a 30, 26.6 a 28 y
  // 24.7 a 26. Es decir, a 26px ya empatan y la jerarquía se pierde; a 28 la
  // ventaja es del 9% y se vuelve ambigua; a 30 queda en 16%, que se lee como
  // un escalón claro sin volverse titular. En ancho de tinta el escalón es el
  // mismo: "Corte dama" mide 142.2px contra los 121.3 de "Tinte global".
  nombreEnCuerpo?: boolean;
};

// Columna de cifras: SIN ancho fijo. La caja se ajusta a su contenido y va
// shrink-0 justo antes del cheurón, así que su canto derecho siempre cae en
// "canto de la fila menos cheurón menos hueco": el eje de las cifras queda
// alineado solo, sin declarar un ancho.
//
// Antes era fija (w-28 / w-32 / w-36 con text-right) y tuvo que irse al subir
// los nombres a 30px. Medido a 360px de pantalla, la fila mide 312px y el peor
// emparejamiento de la carta de color -- "Tinte global", el nombre más ancho, a
// 151.6px, junto a un rango completo de 125.2 -- pedía 320.8px con la columna
// fija: 8.8px de desborde, que es exactamente el modo de falla que deja la
// cifra pegada al nombre. Con la caja al contenido el eje sigue siendo uno solo
// (medido: un único valor por ancho en las dos cartas) y sobran 19.8px entre la
// tinta del nombre y la cifra.
//
// whitespace-nowrap se queda: sin él la cifra se parte en dos renglones y la
// altura de la fila deja de ser constante.

// EL CUERPO DE LOS NOMBRES, EL MISMO EN LAS DOS CARTAS. Es lo que hace que la
// lista de color y la sección de abajo se lean como la misma página: cambia la
// familia, el peso y el interletrado, pero no la escala.
//
// 30px de 360px de pantalla en adelante -- el piso de calidad del proyecto -- y
// 26px por debajo. Ese escalón no es un gusto: a 320px la fila mide 272px y un
// nombre de 30px ("Tinte global", 151.6px de tinta) junto a un rango de precio
// (109.6 a 14px) más el cheurón y los huecos pide 289.2px. No cabe de ninguna
// manera, y medí las cuatro combinaciones. A 26px la tinta baja a 131.4 y la
// fila entra con 11px de aire entre nombre y cifra. De 360 en adelante las dos
// cartas van a 30px exactos.
const CUERPO_NOMBRE = "flex-1 whitespace-nowrap text-shell-lift";

// Los dos cuerpos, uno por carta. Ya no coinciden, y es a propósito: la carta
// de la sección bajó a 24px para dejar de dominar la página y para que su
// tarjeta ocupe menos alto.
//
// En altura de tinta medida (mayúscula más asta descendente) la Bodoni rinde
// 1.021 veces su cuerpo y la Jost 0.951, así que 30px de Bodoni dan 30.6px de
// tinta contra los 22.8 que dan 24px de Jost: la sección queda un 25% más baja
// que la lista de color, que es lo que la saca del primer plano sin volverla
// secundaria.
//
// La lista de color conserva su escalón por debajo de 360px (26px), donde la
// fila no da para más. La sección ya no lo necesita: a 24px su nombre más
// ancho ("Corte dama") mide 113.8px de tinta y entra de sobra hasta en 320.
const CUERPO_COLOR = "text-[1.625rem] min-[360px]:text-3xl";
const CUERPO_SECCION = "text-2xl";

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
  nombreEnCuerpo = false,
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
          cuerpos distintos. Como nada envuelve, todos los renglones de una
          misma carta miden lo mismo.

          EL RELLENO VERTICAL CAMBIA POR CARTA: py-6 (24px por lado) en la lista
          de color y py-4 (16) en la sección, que se pidió más compacta al bajar
          el cuerpo de sus nombres. Con py-4 y el renglón de 24px, el alto de
          toque queda en 48px, por encima del mínimo de 44.

          EL `!` DEL ANILLO DE FOCO no es cosmético: la regla global de
          :focus-visible de globals.css no está dentro de una capa, así que le
          gana a las utilidades de Tailwind y pintaba el anillo en dune-deep
          aunque aquí la clase pidiera crema. Medido con el renglón enfocado, el
          outlineColor devolvía rgb(138,66,41): sobre la superficie tierra de la
          segunda sección eso da 2.25:1, por debajo del mínimo de 3:1 para un
          indicador. Con el `!` la clase manda y el anillo mide 13.67:1. Es el
          mismo `!` que ya llevaban los otros cuatro controles de la página. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={`flex w-full items-baseline gap-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift! min-[360px]:gap-3 sm:gap-4 ${
          nombreEnCuerpo ? "py-4" : "py-6"
        }`}
      >
        {/* Nombre a la izquierda, en REDONDA. whitespace-nowrap es deliberado:
            ningún nombre se parte. El más ancho ("Tinte global") mide 126.8px a
            24px con este interletrado y peso 700 (eran 123.8 en cursiva a 600);
            con la columna de cifras, los huecos y el cheurón la fila necesita
            290.8px, y a 360px de viewport el bloque mide 312, así que quedan 21px
            de aire en medio.

            PESO 500, Y POR QUÉ BAJÓ DESDE 700. El 700 engordaba la hairline
            y con eso se perdía el contraste de trazo que es toda la gracia de
            un Didone. Medido a dsf=6 sobre "Tinte global", con la cifra de al
            lado como referencia fija:

              peso  tinta del nombre  nombre/cifra  trazo fino  trazo grueso
              700        808 px2          2.18x        1.33px       3.83px
              600        699              1.89x        1.00         3.17
              500        614              1.66x        1.00         2.83
              400        544              1.47x        1.00         2.50

            De 700 a 600 el asta fina cae de 1.33 a 1.00px -- un 25% -- y de ahí
            para abajo ya no adelgaza: a 24px de cuerpo la hairline de esta
            familia toca su suelo en 1px, así que lo único que sigue cambiando
            es el trazo grueso. Por eso el salto que se ve no está en el número
            del contraste sino en el grosor absoluto del asta gruesa, y a 500 es
            donde el par fino/grueso vuelve a leerse como Didone sin que el
            nombre se quede sin autoridad.

            SIGUE DOMINANDO EL RENGLÓN: 1.66 veces la tinta de la cifra, con el
            nombre a 24px contra los 16 de ella. El 400 llega a 1.47x y ahí el
            asta gruesa (2.50px) empieza a competir de igual a igual con el palo
            de la Jost de la cifra; el 600 (1.89x) es la opción intermedia si se
            quiere más autoridad. Ni el tamaño ni la posición se tocaron: 24px,
            interletrado -0.056em y flex-1 siguen igual, y el nombre se ESTRECHA
            5.5px al aligerar (126.8 -> 121.3), así que hay más aire hasta la
            cifra, no menos.

            La cifra se queda en 400 y no baja a 300: Jost a 300 sobre este fondo
            adelgaza el trazo justo en el dato que la clienta viene a leer, y la
            jerarquía ya está resuelta por arriba. */}
        <span
          className={`${CUERPO_NOMBRE} ${
            nombreEnCuerpo
              ? `${CUERPO_SECCION} font-body font-normal tracking-[-0.02em]`
              : `${CUERPO_COLOR} font-display font-medium ${TRACKING_DISPLAY}`
          }`}
        >
          {service.name}
        </span>

        {/* Cifra: peso 400 contra el 700 del nombre. Ver el reporte.

            CIFRAS TABULARES (tabular-nums). Con las proporcionales que trae
            Jost por defecto, el "1" avanza menos que el resto, así que dos
            rangos de la misma forma no medían lo mismo: medidos a 390px,
            "$3,900 - $7,400" arrancaba en x=219.9, "$3,600 - $4,900" en 217.5 y
            "$2,600 - $4,400" en 216.8. Los tres terminan en el mismo eje --
            eso lo garantiza text-right -- pero su canto izquierdo quedaba
            escalonado hasta 3.1px, justo en la primera cifra, que es donde cae
            el ojo al escanear la columna. Con tabular-nums los dígitos comparten
            avance y los tres rangos miden exactamente lo mismo.

            La familia lo soporta de verdad: el woff2 latino de Jost que sirve el
            proyecto trae la feature `tnum` en su GSUB (verificado con
            fontTools), así que no es una emulación del motor. */}
        <span className="shrink-0 text-right text-sm font-normal tabular-nums whitespace-nowrap text-shell-lift min-[390px]:text-base sm:text-lg">
          {price}
        </span>

        {/* Indicador: cheurón de trazo de 1px, sin superficie. A /55 queda por
            debajo del precio en peso óptico, así que no compite con la cifra.

            VA AL MARGEN DERECHO, NO PEGADO AL PRECIO. Es el último elemento de
            la fila, así que su canto derecho ES el canto del bloque: mide 0.0px
            de separación con el margen en todos los anchos. Lo que cambia es el
            aire por su izquierda: el ml-2 se suma al gap de la fila y sube la
            separación con la cifra de 12 a 20px de 360px en adelante, y de 16 a
            24 desde 640. Así el cheurón se lee como el control de la fila y no
            como un signo del precio.

            Por debajo de 360px no se suma nada, y no es un olvido: ahí la fila
            va al límite. El nombre más ancho ("Tinte global", 126.8px de tinta a
            24px) dispone de una caja de 132px, o sea 5.2px de holgura -- medido
            a 320px --, y como lleva whitespace-nowrap, cualquier píxel que le
            quite el cheurón lo saca de su caja. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className={`mt-[0.3em] h-3 w-3 shrink-0 text-shell-lift/55 transition-transform duration-200 min-[360px]:ml-2 ${
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

        {/* LA ACCIÓN PRINCIPAL, SOLA EN SU RENGLÓN.

            SUPERFICIE INTERCAMBIADA con la de "Guía de largos", pedido. Este
            enlace se queda con la tipografía que ya tenía -- Bodoni 18px en
            redonda, interletrado -0.056em, crema al 100% -- y toma el material
            de la otra: vidrio casi limpio, clay al 10% con borde a /30, cápsula
            de 32px con pl-4 y pr-3. Lo que era su dune al 50% se fue con la
            guía.

            El ::after también viaja con el material, porque depende del alto de
            la caja: con 32px de cápsula necesita 8px por lado para llegar a los
            44 de acierto (con los 40px de antes le bastaban 4).

            Alineada a la izquierda del bloque, como el resto del panel: el
            contenedor no lleva justify, así que la cápsula arranca en el mismo
            eje que la descripción y que el disclaimer.

            EL TEXTO, CENTRADO EN SU CÁPSULA. Con pl-4/pr-3 y items-center la
            tinta quedaba descentrada, y no por poco: medida a dsf=8, el hueco
            hasta el canto era de 17.53px por la izquierda contra 12.16 por la
            derecha, y 8.31 por arriba contra 5.31 por abajo. Dos causas
            distintas:

              - En horizontal, el relleno era asimétrico de origen (venía de la
                otra cápsula, donde compensaba el interletrado de la versalita)
                y aquí no había nada que compensar.
              - En vertical, el desbalance no era del relleno sino de la
                tipografía: con leading-none la caja de línea mide 18px y el
                Bodoni no reparte su tinta simétricamente dentro de ella --
                asciende menos de lo que desciende la "g" --, así que centrar la
                CAJA no centra la TINTA.

            El arreglo va en el relleno, sin tocar alto ni ancho: pl y pr suman
            los mismos 28px de antes (13.3 y 14.7 en vez de 16 y 12), solo
            repartidos parejo respecto a la tinta.

            Los 3px de pb salen de dos cuentas que hay que cruzar. Por métricas
            del archivo -- upem 2000, ascent 2250, descent -800 -- el medio
            interlineado de una caja de 18px es -4.725px, la línea base cae a
            15.525 del borde superior de la caja, y la tinta de "Agenda tu cita"
            va de +13.761 (el asta de la "d") a -4.680 (la cola de la "g")
            respecto a esa base: su centro queda 1.985px POR DEBAJO del centro de
            la caja de línea, lo que pediría 3.97px de relleno inferior. Pero
            medido en pantalla a dsf=8, la tinta que de verdad se ve empieza
            0.9px más abajo que el contorno: el remate del asta de la "d" es una
            hairline de Didone que no sobrevive al rasterizado. Como el criterio
            es lo que se percibe y no lo que dice el contorno, el valor bueno es
            3px, y no se puede afinar más: el pintado de la tinta salta de píxel
            entero en píxel entero. Barrí pb de 2 a 3px en pasos de 0.25 y el
            desbalance solo tiene dos estados por ancho -- a 390px, +1.12 con
            2 a 2.75px y -0.88 con 3 --, así que 3px es el mejor de los dos
            disponibles. A 1280 el desbalance queda en 0.00 exacto.

            Sigue llevando su mensaje prellenado por servicio. */}
        <div className="mt-6">
          <a
            href={waLink(`Hola Axel, me interesa ${service.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex h-8 items-center rounded-full border border-clay/30 bg-clay/10 pb-[3px] pl-[13.3px] pr-[14.7px] font-display text-lg leading-none tracking-[-0.056em] text-shell-lift backdrop-blur-xl transition-colors duration-150 after:absolute after:inset-x-0 after:-inset-y-2 after:content-[''] hover:bg-clay/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
          >
            Agenda tu cita
          </a>
        </div>

        {/* El disclaimer, plegado. El rótulo no es genérico a propósito: dice la
            pregunta que provoca la cifra, así que quien dude al ver el rango
            reconoce ahí su respuesta.

            Sin caja ni superficie: solo texto, un cheurón de trazo de 1px -- el
            mismo del acordeón y del modal -- y espacio. El área de toque sale
            del ::after, igual que en las cápsulas: el rótulo mide 17px de alto
            y el toque real 45px.

            COMPARTE RENGLÓN CON "GUÍA DE LARGOS", y los dos hacen cosas
            distintas: este despliega texto aquí mismo y el otro abre una
            ventana con imágenes. Al quedar juntos hay que distinguirlos, y se
            distinguen por tres cosas a la vez, ninguna decorativa:

              1. MATERIAL. La pregunta es texto desnudo sobre el fondo; la guía
                 conserva su cápsula de vidrio. Una etiqueta que se despliega
                 contra un botón que se pulsa.
              2. EL SIGNO. La pregunta lleva el cheurón que ya usa el acordeón de
                 la carta, y que GIRA 180° al abrirse: es el signo de "hay más
                 aquí debajo" que la página ya enseñó tres pantallas antes. La
                 guía lleva dos escuadras opuestas -- el signo de expandir, el
                 que dice "esto abre algo aparte" --, dibujadas en el mismo
                 lenguaje de 12x12 y trazo de 1px, y que no gira.
              3. LA VOZ. Pregunta en caja baja, 12px de Jost; guía en versalita
                 espaciada a 0.25em, ahora en peso 600.

            El aire: mt-6 (24px) desde la cápsula de arriba, y ese 24 es un
            piso, no un gusto. Las dos áreas de toque se extienden con ::after
            fuera de su caja -- 8px hacia abajo la cápsula de WhatsApp y 14px
            hacia arriba la pregunta --, así que con menos de 22px se pisan y la
            de arriba pierde acierto: medido, con 20px la pregunta bajaba a
            40.5px de toque. 24 es el primer múltiplo de la escala que las deja
            intactas, y acerca la fila 8px respecto a los 32 que tenía. items-baseline (antes items-center)
            los sienta en la MISMA LÍNEA BASE, que es lo pedido: con la guía en
            cápsula de 40px y la pregunta en 16px de texto suelto, centrarlos
            dejaba sus líneas base a 2.5px una de otra. Alineadas por base, la
            cápsula reparte su alto por encima y por debajo de esa línea y las
            dos tipografías se apoyan en el mismo renglón. El gap-x-5
            (20px) los separa lo suficiente para que no se lean como un solo
            control.

            El gap-y-6 (24px) es para cuando envuelven, y el número no es
            estético: las dos áreas de toque se extienden con ::after fuera de su
            caja -- 14px hacia abajo la pregunta y 10px hacia arriba la cápsula
            adelgazada --, así que con menos de 24px de hueco vertical se pisan y
            la de arriba pierde acierto. Con 20px medí 40.5px de toque en la
            pregunta; con 24 las dos conservan sus 44.

            El gap-x baja de 20 a 12px, parte de lo que se recortó para que la
            pareja quepa junta antes. */}
        {esRango && (
          <div className="mt-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-6">
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

              <ModalLargos />
            </div>

            {/* TRES BLOQUES, NO UN PÁRRAFO. Las tres ideas vienen partidas
                desde data/services.ts, así que el corte entre ellas no se mueve
                con el ancho.

                INTERLINEADO IGUAL AL DE LA DESCRIPCIÓN: leading-5, o sea 20px,
                el mismo line-height computado que tiene el text-sm de arriba.
                Y sin separación entre los bloques -- se fue el space-y-2.5 --,
                porque con margen cero la distancia entre dos renglones
                consecutivos ES el interlineado. Medido, los renglones pasan de
                31.1px de separación a 20, exactamente los mismos que la
                descripción, así que las dos piezas del panel caen en la misma
                retícula vertical y la nota se lee como un bloque y no como tres
                párrafos. En proporción es 1.54 contra el 1.43 de la descripción,
                porque el cuerpo sigue en 13px y ese no se toca.

                La primera línea va en font-medium (500) contra el 400 de las
                otras dos. Antes las tres estaban en 400; ver el reporte.

                Al desplegarse tiene que LEERSE. Pasa de 12px de Bodoni cursiva
                sintética a 13px de Jost redonda: la oblicua era la causa real de
                que costara -- el proyecto no carga la itálica de Bodoni, así que
                era una redonda Didone cizallada, con astas finísimas, para tres
                renglones de texto corrido. Sigue subordinada, pero por
                jerarquía: 13px contra los 14px de la descripción y tono /80
                contra /90. Ver el reporte. */}
            <div id={notaId} hidden={!notaAbierta} className="mt-3">
              {RANGE_NOTE_LINEAS.map((linea, i) => (
                <p
                  key={linea}
                  className={`text-[0.8125rem] leading-5 text-shell-lift/80 ${
                    i === 0 ? "font-medium" : ""
                  }`}
                >
                  {linea}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
