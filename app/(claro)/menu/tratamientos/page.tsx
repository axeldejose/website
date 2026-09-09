import type { Metadata } from "next";
import { CATEGORIES } from "@/data/services";
import { PantallaTratamientos } from "@/components/tratamientos/PantallaTratamientos";
import { CierreTratamientos } from "@/components/tratamientos/CierreTratamientos";

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
        {/* ─── EL ENCABEZADO ──────────────────────────────────────────────
            ALINEADO A LA IZQUIERDA Y CON EL MISMO LOCKUP QUE /menu. Las dos
            páginas comparten ahora la construcción del titular: primera palabra
            en la redonda de la serif de display a cuerpo completo, segunda
            debajo en su cursiva a 0.85em, alineada a la derecha del envoltorio
            y volando por ese canto, con interlineado negativo para que las dos
            se lean como una pieza. El control de regreso se monta en la segunda
            línea, en el hueco que deja el desplazamiento.

            ESTÁ DUPLICADO, NO IMPORTADO. El lockup de /menu no vive en un
            componente: es markup dentro de app/menu/page.tsx más tres reglas de
            globals.css (.encabezado-color, .titular-color, .regreso-titular).
            Aquí hay una copia con nombres propios -- .trat-encabezado,
            .trat-titular, .trat-regreso-titular -- porque los dos números que
            colocan el control dependen de QUÉ PALABRAS son, y "Tratamientos /
            capilares" no mide lo mismo que "Diseños / de color". Compartir la
            regla habría acoplado dos páginas por una medida que no comparten.
            app/menu/page.tsx y sus reglas no se tocaron.

            LOS TONOS SON LOS DE ESTA PÁGINA: tinta `tierra` sobre claro, contra
            el `shell-lift` sobre oscuro de /menu. La construcción es la misma;
            el color, no. */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-casa">
            Cuidado del cabello
          </p>

          {/* .trat-encabezado declara --trat-titulo-cuerpo, que es el cuerpo
              del titular. Vive en el contenedor y no en el <h1> porque el
              control de regreso lo necesita para colocarse: un `em` dentro del
              control se resolvería contra su propio cuerpo, no contra el del
              titular. */}
          <div className="trat-encabezado relative mt-[7px]">
            <h1 className="trat-titular relative font-display text-tierra">
              {/* El envoltorio es inline-block, así que su ancho es el de la
                  línea más ancha -- "Tratamientos" -- y eso es lo que le da a
                  "capilares" un borde derecho contra el que alinearse. Sin él,
                  el envoltorio mediría el ancho de la columna y la cursiva se
                  iría al canto. */}
              <span className="inline-block">
                <span className="block font-medium leading-none tracking-[-0.056em]">
                  Tratamientos
                </span>{" "}
                <span className="-mt-[0.22em] -mr-[0.85em] block text-right font-medium text-[0.85em] italic leading-none tracking-[-0.056em]">
                  capilares
                </span>
              </span>
            </h1>

          </div>

          {/* LA BAJADA, sobre el mismo eje izquierdo. Ya no necesita
              `text-balance`: eso existía para que los dos renglones centrados
              no dejaran un escalón. Alineada a la izquierda, el desnivel de la
              derecha es la bandera natural del texto.

              SIN TOPE DE ANCHO, Y AHÍ ESTABA LA CAUSA DEL CORTE. Tenía un
              max-w-[15rem] -- 240px -- que le puse yo al pasar el encabezado a
              alineación izquierda. Medida, la frase ocupa 301.3px y la columna
              de un teléfono de 360 da 312: cabía en un renglón, y lo que la
              partía era mi propio tope, no su longitud. Quitado, entra entera
              desde 360 en adelante. El cuerpo no se tocó.

              El margen que queda es de 10.7px a 360, que es poco: por eso hay
              propuestas de texto más corto en el informe, pendientes de
              aprobación. */}
          <p className="mt-[5px] text-center text-[0.8125rem] leading-[1.45] text-casa">
            Cuidado preciso para recuperar la salud de tu cabello.
          </p>

          {/* EL REMATE. Una regla corta de terracota que cierra el bloque de
              texto, ahora arrancando del eje izquierdo. */}
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
      {/* SIN RELLENO PARA LA BARRA FIJA. Aquí había 84px cuya única razón era
          que el cierre no se metiera debajo de la barra flotante de WhatsApp.
          La barra se retiró -- la conversión vive ahora dentro de la primera
          ventana del cierre, con su contexto -- así que ese hueco se fue con
          ella y queda el aire normal del pie de página. */}
      <div className="pb-8">
        <CierreTratamientos />
      </div>

    </>
  );
}
