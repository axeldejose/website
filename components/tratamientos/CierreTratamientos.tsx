import Link from "next/link";
import { site, waLink } from "@/lib/site";

// EL CIERRE DE /menu/tratamientos, en tres tiempos y de más aire a más acción.
//
// No reusa el pie de /menu y no podía: aquel es una lámina oscura flotante
// (bg-tierra/34 amplificando el fondo con backdrop-brightness) rematada por una
// franja dune sólida. Aquí sería el único elemento oscuro de la pantalla y
// rompería lo que la página entera sostiene.
//
//   1. La firma editorial. Texto suelto sobre el fondo, sin superficie.
//   2. La ventana de conversión: la invitación, las tres preguntas y el botón
//      de WhatsApp, que es la única acción de toda la página.
//   3. La ventana de referencia: los dos enlaces de navegación, la ubicación y
//      la nota de precios, en el lenguaje del pie de /menu -- superficie oscura
//      y translúcida, cápsulas de contorno y ubicación al canto derecho.
//
// LA PRIMERA VA EN EL VIDRIO CLARO de los cinco tratamientos y la segunda en
// oscuro. Ese contraste de material es lo que separa la acción de la
// referencia: no hay que leer para saber cuál es cuál.
//
// ─── EL RITMO VERTICAL, CALIBRADO ───────────────────────────────────────────
// El bloque venía con el aire de cuando el cierre era el final de una página
// larga; con la composición de pantalla completa por encima, ese mismo aire se
// leía como hueco muerto. Los huecos bajaron así:
//
//   firma -> ventana          48 -> 28
//   relleno de la ventana     32 -> 24 (48 -> 32 en lg)
//   título -> párrafo         12 -> 8
//   párrafo -> acción         28 -> 20
//   acción -> regla           32 -> 20
//   regla -> fila             24 -> 16
//   fila -> nota de precios   24 -> 12
//
// NO SON TODOS EL MISMO RECORTE, y ahí está el trabajo: los huecos siguen
// diciendo qué va con qué. El de 8px entre título y párrafo es el más corto
// porque son una sola idea; los de 20 aíslan la acción principal por arriba y
// por abajo, que es lo que la mantiene como la pieza dominante de la ventana; y
// el de 12 de la nota la deja pegada a la fila que la precede, subordinada,
// como el dato más discreto del bloque. Ninguno baja de 8px, así que nada llega
// a tocarse.
export function CierreTratamientos() {
  return (
    <>
      {/* ─── 1. LA FIRMA ─────────────────────────────────────────────────────
          Dos voces, una oración cada una, sin contenedor ni contorno. Es el
          mismo mecanismo que cierra /menu, invertido en tono: allá crema sobre
          oscuro, aquí tinta sobre claro.

          ─── CAMBIÓ EL TEXTO Y CON ÉL LA CONSTRUCCIÓN ────────────────────
          Antes eran dos voces sueltas y centradas -- una línea de cuerpo y una
          cursiva más grande debajo --. Ahora es la misma construcción que el
          titular de la página: primera línea en la redonda de la serif de
          display, segunda debajo en su cursiva y desplazada, con interlineado
          ajustado y sin margen entre ellas.

          SE ALINEÓ A LA IZQUIERDA, y no es un cambio suelto: un desplazamiento
          solo se lee si las dos líneas comparten un eje. Centrada, la segunda
          línea corrida habría parecido un error de composición en vez de un
          escalón.

          ES UN SUBTÍTULO, NO UN TITULAR, y eso lo dicen dos palancas a la baja:
          22px contra los 55.3 del titular de la página -- el 40% -- y peso 400
          contra su 500. La construcción es la misma; el rango, no.

          LAS DOS LÍNEAS VAN EN `tierra`, y la primera no siempre fue así.
          Estaba en `casa`, el tono de apoyo, y sobre este fondo no se sostenía:
          la fotografía es fija y la frase se desplaza por encima, así que puede
          caer en cualquier franja. Barrido el recorrido completo, el peor punto
          -- el pliegue dorado saturado, hacia y=434 -- dejaba la primera línea
          en 2.31:1. Ningún tono medio de la paleta aguanta ahí: `dune-deep`
          medía 2.60 en el mismo sitio. Solo `tierra` pasa, con 5.87.

          LA JERARQUÍA NO DEPENDÍA DEL TONO. Sigue habiendo tres saltos entre
          las dos voces: 1.73 veces el cuerpo (15 contra 26), el cambio de
          familia (la de cuerpo contra la display serif) y el de estilo (redonda
          contra cursiva). El tono era el cuarto y el único que no se podía
          conservar.

          ─── EL AJUSTE DE LA COMPOSICIÓN ────────────────────────────────
          Las dos líneas se juntaron y se abrieron a la vez, que suena
          contradictorio pero no lo es: lo que se cierra es el espacio ENTRE
          renglones y lo que se abre es el espacio ENTRE letras.

            - Fuera el margen de 6px que había entre las dos y el interlineado
              baja a 1.15 y 1.02. Con eso dejan de leerse como dos frases
              apiladas y pasan a ser una sola partida en dos.
            - Los cuerpos bajan de 17 y 30 a 15 y 26.4, que conserva la
              proporción entre ellas: 1.76 antes, 1.76 ahora. La segunda sigue
              dominando.
            - El interletrado sube en las dos: la primera de 0 a 0.06em y la
              segunda de -0.02em a 0.015em. Es lo que le da el aire editorial
              al bloque, y es también lo que compensa el cuerpo más pequeño --
              un texto que mengua y además se aprieta se lee peor, no mejor.

          Las dos van centradas y comparten eje. Un solo <p> con dos bloques: la
          unidad semántica es la frase completa.

          EL AIRE POR ARRIBA SON 56px, Y ESE NÚMERO ESTÁ MEDIDO. Antes eran 96
          aquí más 122 de relleno en la columna del carrusel: 218px de vacío
          entre la barra de progreso y esta firma, que era el hueco más grande
          de la página y se leía como un agujero, no como una separación.

          Los 122 estaban para empujar el cierre por debajo del pliegue, y 56
          hacen ese mismo trabajo con la mitad justa: medido en un teléfono de
          390x844, la barra de progreso acaba en y=711 y la barra fija de
          WhatsApp arranca en 766, así que con 56 la firma cae en 767-819 --
          dentro de la banda que ocupa la barra flotante, y por tanto oculta
          tras ella en reposo, no asomando a medias por detrás, que es lo que
          pasaba con huecos intermedios. Al desplazar un dedo aparece entera.

          En 360x800 la cuenta cierra igual: progreso en 667, barra en 722, y 56
          deja la firma en 723. */}
      <p className="trat-firma trat-subtitulo mt-7 text-center">
        {/* EL ENVOLTORIO ES `inline-block` Y ES LO QUE PERMITE LAS DOS COSAS A
            LA VEZ: por dentro las dos líneas comparten eje izquierdo y la
            segunda va sangrada, que es lo que hace legible el escalón; por
            fuera el envoltorio mide lo que la línea más ancha y el `text-center`
            del párrafo lo centra en la columna. Centrar cada línea por separado
            habría borrado el desplazamiento. */}
        <span className="inline-block text-left">
          <span className="block">Llevo años aprendiendo</span>
          <span className="block italic">a leer lo que el cabello necesita.</span>
        </span>
      </p>

      {/* ─── 2. LA VENTANA DE CONVERSIÓN ──────────────────────────────────
          SE PARTIÓ EN DOS. Antes era una sola ventana con las preguntas arriba
          y una zona terracota abajo que cargaba con todo lo demás: los dos
          enlaces de navegación, la ubicación y la nota de precios. Eso mezclaba
          dos cosas que no se parecen -- una invitación a escribir y un pie de
          referencia -- dentro de la misma caja.

          Ahora son dos ventanas. Esta concentra la conversión y la secuencia se
          lee de corrido: no tienes que saber -> cuéntame estas tres cosas ->
          escríbeme. El botón es el final de esa frase, no un elemento suelto.

          Y ES LA ÚNICA ACCIÓN DE LA PÁGINA. La barra fija de WhatsApp que
          flotaba al pie se retiró: repetía esta misma acción a media pantalla de
          distancia y sin el contexto que la hace fácil de usar. */}
      <div className="trat-ventana mt-[27px]">
        <div className="px-6 py-6 text-center sm:px-8 lg:px-9 lg:py-8">
          {/* EL TITULAR QUITA EL PESO DE ENCIMA ANTES DE PEDIR NADA. El anterior
              -- "El tuyo lo definimos hablando" -- no decía qué hacer ni a qué
              invitaba. Este dice primero que la clienta no tiene que saber,
              después que la tarea es de Axel, y solo entonces pide. Copy
              aprobada por el PM. */}
          {/* EL ENVOLTORIO `inline-block` es lo que permite centrar el bloque
              conservando el escalón: por dentro las dos líneas comparten eje
              izquierdo y la primera va sangrada; por fuera el envoltorio mide lo
              que la línea más ancha y el `text-center` de la zona lo centra.
              Centrar cada línea por separado habría borrado el desplazamiento. */}
          <p className="trat-frase">
            <span className="inline-block text-left">
              <span className="block">No tienes que saber</span>
              <span className="block italic">qué necesita tu cabello.</span>
            </span>
          </p>

          <p className="mt-3 text-sm leading-relaxed text-dune-deep">
            Para eso estoy yo. Cuéntame tres cosas:
          </p>

          <ul className="trat-pistas">
            <li>Cómo sientes tu cabello últimamente</li>
            <li>Qué fue lo último que te hiciste</li>
            <li>Una foto, si tienes a la mano</li>
          </ul>
        </div>

        {/* ─── EL BOTÓN, Y AHORA SÍ EN RELLENO SATURADO ──────────────────
              Conserva la anatomía de la barra que sustituye -- logotipo en
              círculo, divisor vertical, versalita espaciada centrada y flecha --
              porque es la misma acción y tiene que reconocerse como tal. Lo que
              se invierte es el tono.

              La barra iba en vidrio claro porque flotaba sobre la fotografía y
              tenía toda la pantalla para pesar. Aquí vive DENTRO de una ventana
              de vidrio claro, y vidrio sobre vidrio se lee turbio: no hay
              contraste de superficie entre los dos. En terracota macizo se
              despega de la ventana de un vistazo.

              Y hay una segunda razón, de página entera: al quitarle el fondo
              terracota a la ventana de referencia, este botón queda como el
              único relleno saturado que hay. Ese era el papel de la barra y es
              lo que mantiene una sola cosa evidente por pantalla. */}
          <a
            href={waLink(
              "Hola Axel, vi tus tratamientos y quiero agendar una cita.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="trat-wa-boton"
          >
            <span className="trat-wa-texto">Escríbeme por WhatsApp</span>

            <span aria-hidden="true" className="trat-wa-flecha">
              →
            </span>
          </a>
      </div>

      {/* ─── 3. LA VENTANA DE REFERENCIA, EN OSCURO ───────────────────────
          VUELVE A LA PALETA CLARA. Estuvo en café oscuro, copiando el pie de
          /menu, y ahí estaba el error: esta página es la versión clara de la
          marca y el café no se usa aquí. Lo que se conserva de aquel es la
          construcción -- cápsulas de contorno, ubicación al canto derecho, nota
          debajo --, no el material.

          NO LLEVA LA FRANJA DE WHATSAPP que aquel remata abajo: la conversión
          vive entera en la ventana de arriba, y repetirla aquí era justo lo que
          se quitó al retirar la barra fija.

          ─── CÓMO SE DISTINGUE DE LA PRIMERA SIN OSCURECERSE ────────────────
          Dos vidrios claros idénticos se leerían como una ventana partida en
          dos, así que hacen falta diferenciadores, y uno solo no basta. Van
          tres, todos en la dirección de MENOS MATERIA: menos densidad de
          superficie, contorno dibujado en vez de sombra, y sin elevación. Las
          cifras están en globals.css.

          La jerarquía queda en el orden correcto sin tocar el tono: la pieza
          que pide la acción tiene más materia y la que da referencia tiene
          menos. El terracota sigue siendo acento -- las flechas y la ubicación
          --, no superficie.

          `.pastilla-contorno` ya no se usa aquí: está calibrada para fondos
          oscuros. Las cápsulas pasan a la variante clara de esta página. */}
      <div className="trat-cierre-claro mt-4">
        <div className="px-6 pt-5 pb-4 sm:px-8">
          {/* ─── LA BANDA DE ARRIBA, EN DOS COLUMNAS ────────────────────────
              Las dos cápsulas se APILAN en la columna izquierda en vez de ir en
              fila, y eso es lo que libera el ancho que la ubicación necesitaba.
              Antes iban una al lado de otra, la ubicación no entraba en ese
              renglón y caía al siguiente pegada a la derecha: el costado
              izquierdo se quedaba vacío justo ahí.

              Ahora los dos costados están ocupados en toda la altura del
              bloque. La ubicación se centra verticalmente contra el par. */}
          <div className="trat-cierre-fila">
            <div className="trat-cierre-enlaces">
              <Link href="/menu" className="trat-pastilla-clara">
                Diseños de color
                <span aria-hidden="true" className="trat-pastilla-flecha">
                  →
                </span>
              </Link>

              {/* Lleva a la portada, que es donde Axel se presenta. La
                  biografía completa vive en el modal de ConoceMas.tsx. */}
              <Link href="/" className="trat-pastilla-clara">
                Sobre Axel
                <span aria-hidden="true" className="trat-pastilla-flecha">
                  →
                </span>
              </Link>
            </div>

            {/* Zona, nunca dirección: sale de lib/site.ts. */}
            <p className="trat-cierre-lugar">{site.location}</p>
          </div>

          {/* La regla separa la banda de acción de la nota, que es de otra
              clase: aquello son enlaces y un dato de contacto, esto una
              aclaración legal. */}
          <span aria-hidden="true" className="trat-cierre-regla" />

          <p className="trat-cierre-nota">
            Precios en pesos mexicanos. Sujetos a cambios sin previo aviso.
          </p>
        </div>
      </div>
    </>
  );
}
