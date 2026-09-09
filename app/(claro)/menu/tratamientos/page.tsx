import type { Metadata } from "next";
import { CATEGORIES } from "@/data/services";
import { PantallaTratamientos } from "@/components/tratamientos/PantallaTratamientos";
import { CierreTratamientos } from "@/components/tratamientos/CierreTratamientos";
import { Logo } from "@/components/Logo";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tratamientos",
};

// El contenido sale de data/services.ts, la única fuente de verdad: la
// categoría "tratamientos", que es todo lo que no es color (color vive en
// /menu). Ningún nombre se escribe en esta página.
const tratamientos = CATEGORIES.find(
  (category) => category.slug === "tratamientos",
)!;

export default function TratamientosPage() {
  return (
    <>
      {/* La barra superior, el carrusel y la barra de progreso viven en
          PantallaTratamientos porque las tres comparten el índice activo. El
          encabezado entra por `children`: es texto estático y así se sigue
          pintando en el servidor en vez de viajar como JavaScript. */}
      <PantallaTratamientos servicios={tratamientos.services}>
        {/* ─── EL ENCABEZADO, CENTRADO ────────────────────────────────────
            DEDICADO ÚNICAMENTE A TRATAMIENTOS: kicker, punto, titular, párrafo
            y remate. La salida a los diseños de color bajó al cierre de la
            página, porque en el encabezado era lo único que hablaba de otra
            cosa y competía con la entrada a esta.

            Todo el bloque se alinea al eje de la columna. El `text-center` del
            envoltorio se encarga de las piezas de texto y de las inline; las
            dos que tienen caja propia -- el punto separador y el remate -- se
            centran con márgenes automáticos.

            Sigue siendo compacto por la misma razón de antes: ocupa la parte
            alta sin invadir el sitio del carrusel, porque la pantalla entera
            tiene que caber sin desplazamiento. */}
        <div className="text-center">
          <p className="mt-7 text-[10px] uppercase tracking-[0.28em] text-casa">
            Cuidado del cabello
          </p>

          {/* EL PUNTO SEPARADOR. Un separador editorial entre el rótulo y el
              titular: en vez de una regla, que cortaría el bloque en dos, un
              punto que solo marca la pausa. */}
          <span aria-hidden="true" className="trat-punto-sep" />

          {/* EL TITULAR, EN DOS LÍNEAS Y DOS VOCES. "Tratamientos" en la
              redonda de la serif de display y "capilares" debajo en su
              cursiva, ahora centrada bajo la primera en vez de sangrada a la
              derecha. Conserva cuerpo y estilo; lo único que cambia es el eje.

              leading-[0.92] junta las dos líneas más de lo que las dejaría el
              interlineado normal: es lo que hace que se lean como un lockup de
              dos piezas y no como dos renglones sueltos. */}
          <h1 className="mt-2 font-display text-[2.5rem] leading-[0.92] tracking-tight text-tierra min-[400px]:text-[2.75rem] sm:text-[3.5rem] lg:text-[2.5rem]">
            <span className="block">Tratamientos</span>
            <span className="block italic">capilares</span>
          </h1>

          {/* EL PÁRRAFO, EQUILIBRADO. Con el texto centrado, el corte fijo que
              tenía antes -- dos bloques con la partición escrita a mano --
              dejaba un renglón de 30 caracteres sobre otro de 23, y centrados
              esa diferencia se ve como un escalón.

              `text-wrap: balance` deja que el navegador reparta las palabras
              entre los dos renglones buscando la mínima diferencia de longitud,
              que es exactamente lo que se pidió. Necesita un ancho que lo
              obligue a partir en dos: de ahí el tope de 17rem.

              Donde no esté soportado, el párrafo simplemente envuelve por
              ancho, como cualquier texto: no se rompe nada. */}
          <p className="mx-auto mt-4 max-w-[17rem] text-[0.8125rem] leading-[1.45] text-balance text-casa">
            Cuidado preciso para recuperar la salud de tu cabello.
          </p>

          {/* EL REMATE. Una regla corta de terracota, no un divisor: no separa
              dos bloques, cierra el bloque de texto. De ahí que mida 48px y no
              el ancho de la columna. Centrado con márgenes automáticos, porque
              tiene ancho propio y el text-center no lo alcanza. */}
          <div aria-hidden="true" className="trat-remate mx-auto mt-4" />

        </div>

      </PantallaTratamientos>

      {/* El cierre se conserva del diseño anterior y vive DEBAJO de la
          composición de pantalla completa: la referencia solo define la primera
          pantalla, y quitarlo habría dejado la página sin su bloque de
          conversión con nombre ni la vuelta a la carta de color. */}
      {/* EL HUECO HASTA LA BARRA DE WHATSAPP. La barra flota a 16px del canto
          inferior y mide 62 de alto, así que ocupa los últimos 78px del
          viewport. A este relleno hay que sumarle los 16 del pb-4 del
          contenedor del layout: medido, con 128 aquí el hueco VISIBLE entre el
          canto de la ventana y la barra era de 66px, el aire muerto más grande
          de la página. Con 84 quedan 22, que es lo que hace falta para que la
          ventana no se meta debajo de la barra y se siga leyendo como una pieza
          que flota encima. */}
      <div className="pb-[5.25rem] lg:pb-8">
        <CierreTratamientos />
      </div>

      {/* ─── LA BARRA DE WHATSAPP ──────────────────────────────────────────
          Rediseñada según la referencia -- logotipo en círculo, divisor
          vertical, texto centrado en versalita espaciada y flecha a la derecha
          -- pero EN CLARO, que es lo que se pidió por escrito. La referencia la
          dibuja en oscuro; aquí el peso se consigue sin recurrir a eso.

          CÓMO PESA SIN SER OSCURA, que es la parte difícil:
            - Es lo único de la pantalla con relleno saturado: el círculo del
              logotipo va en dune-deep macizo y hace de ancla visual.
            - Contorno definido de terracota, no un filo claro como el resto de
              las superficies de la página.
            - La sombra más profunda de la pantalla, que la despega del fondo.
            - Flota separada de los cantos, así que se lee como una pieza
              apoyada encima y no como un pie pegado al borde.

          Va fija al viewport y solo en móvil, igual que antes. */}
      <div className="fixed inset-x-4 bottom-4 z-10 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <a
          href={waLink(
            "Hola Axel, vi tus tratamientos y quiero agendar una cita.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="trat-wa-barra"
        >
          {/* EL LOGOTIPO DENTRO DEL CÍRCULO. Es el logotipo real de la marca
              (components/Logo.tsx, el mismo de la landing), no un monograma: la
              marca no tiene uno. A este tamaño la firma de dos líneas se lee
              como textura más que como palabra -- está reportado, con las
              alternativas -- pero es el único mark que existe hoy. h-4 es lo
              máximo que entra sin que el círculo le corte la segunda línea. */}
          <span aria-hidden="true" className="trat-wa-logo">
            <Logo className="h-4 w-auto" />
          </span>

          <span aria-hidden="true" className="trat-wa-divisor" />

          <span className="trat-wa-texto">Escríbeme por WhatsApp</span>

          <span aria-hidden="true" className="trat-wa-flecha">
            →
          </span>
        </a>
      </div>
    </>
  );
}
