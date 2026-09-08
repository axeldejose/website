import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, CORTE_Y_ESTILO } from "@/data/services";
import { CategoriaCarta } from "@/components/CategoriaCarta";
import { ConoceMas } from "@/components/ConoceMas";
import { ContactoAside } from "@/components/ContactoAside";
import { MechonEntrada } from "@/components/MechonEntrada";
import { site, waLink } from "@/lib/site";
import { GaleriaCliente } from "@/components/GaleriaCliente";

export const metadata: Metadata = {
  title: "Mis servicios",
};

const color = CATEGORIES.find((category) => category.slug === "color")!;

export default function ServiciosPage() {
  return (
    <>
      {/* Espacio superior moderado y bloque anclado arriba: el layout aporta
          pt-8 en móvil y lg:pt-16 en escritorio; aquí se suma la otra mitad en
          móvil y nada en escritorio -> 64px totales en ambos.

          `relative` (no `isolate`): crear un stacking context aquí rompería el
          backdrop-blur de la flecha y del CTA de ContactoAside, que muestrean
          la foto de fondo del layout. */}
      <aside className="relative pt-8 lg:sticky lg:top-12 lg:self-start lg:pt-0">
        {/* ──────────────────────────────────────────────────────────────────
            CAPA DECORATIVA: la palabra "color" de fondo. Es textura, no texto.
            Para desactivarla: borra este bloque <span>…</span> completo y las
            reglas .color-deriva / .color-grano de globals.css.

            AL RAS DEL BORDE SUPERIOR, y por qué costó tres intentos. La capa
            ya tocaba el borde superior del <aside> con precisión de 0.0px
            (medido en todo el recorrido), pero encima del <aside> queda una
            banda vacía que no es suya: el pt-8 / lg:pt-16 del contenedor del
            layout, 32px en móvil y 64px en escritorio. Ese padding es lo que
            se leía como "espacio intermedio", y vive en app/menu/layout.tsx,
            compartido con /menu/tratamientos, así que no se puede quitar de
            ahí. Se compensa desde aquí: -top-8 lg:-top-16 sube la ventana
            exactamente esos 32/64px, y su borde superior queda en y=0 en los
            dos breakpoints. El -top-[63px] de la palabra pone la altura de x
            de las letras redondas en esa misma línea (medido: top pintado en
            y=0.0, +0.0px respecto al borde de la página, en los siete puntos
            del recorrido que verifiqué). El asta de la "l" la rebasa y la
            corta el borde superior.

            ANCHO DEL VIEWPORT. La ventana (.color-ventana, en globals.css)
            se extiende más allá del panel hasta los bordes de la pantalla, así
            que en los extremos del recorrido la palabra queda sobre el fondo
            que rodea al panel. El recorrido es (ancho del viewport + ancho de
            la palabra). A media pasada la palabra cabe entera y se lee "color":
            decisión explícita, por ser decorativa, tono sobre tono y en
            movimiento. Los umbrales de legibilidad, por si hay que revertirlo,
            están en globals.css.

            DETRÁS DE TODO. Es el primer hijo del <aside>; el contenedor del
            titular, la flecha y la columna de texto son elementos posicionados
            y posteriores en el DOM, así que pintan encima. Verificado que la
            flecha conserva su fondo, su borde y su blur(12px) con la palabra
            cruzando por debajo. Su tinta ocupa y=0..77: cruza por detrás de
            la flecha y del arranque del titular, pero no alcanza la bajada.

            TRACKING -0.05em. El par más apretado de "color" es "lo", con
            0.0880 em de hueco entre tintas (contra 0.0430 em del "rv" de
            "servicios", que es lo que ahí impide cerrar más). A -0.05em el
            hueco queda en 6.1px a 160px de cuerpo, contra 14.1px sin tracking:
            se cierra más de la mitad y sigue sin fusionarse. El límite duro
            está en -0.088em. Cerrar el tracking encoge el avance de 385px a
            345px, y de ahí sale el 21.7rem del recorrido en globals.css.

            TONO CLARO: `shell`, el claro oficial de la paleta (shell-lift es
            derivado, no de marca, y además es el crema del texto -- dejarlos
            iguales le quitaría al titular su único borde contra la palabra).
            OPACIDAD /3 por capa, valor pedido (venía de /15). Con las tres
            capas apiladas eso compone 1-(0.97)^3 = 8.7% de cobertura efectiva,
            contra el 38.6% que daba /15.

            PRESENCIA: TRES CAPAS APILADAS. Venía de la época del tono oscuro,
            donde era la única forma de oscurecer más sin salirse de la paleta:
            `tierra` es el token más oscuro que hay y con un solo multiply el
            resultado topaba en fondo x tierra (p90 de 13/255), así que tres
            capas idénticas daban fondo x tierra^3 y llevaban el p90 a 38/255
            sin cambiar el tono. Con el claro el apilado ya no hace falta para
            eso, pero se queda: quitar capas cambiaría la opacidad percibida, y
            la opacidad se fija por capa desde aquí.

            Ojo con la intuición: /3 por capa NO equivale a un 3% de opacidad
            total. Los valores medidos en pantalla están en el reporte.

            Las tres son pixel-idénticas: misma máscara estática, misma semilla,
            misma animación arrancada al mismo tiempo, así que el grano coincide
            y el patrón se mantiene nítido, solo más profundo. Siguen siendo un
            solo bloque: para desactivar la capa se borra este map completo.

            Recorrido, grano y prefers-reduced-motion: globals.css.
            ────────────────────────────────────────────────────────────────── */}
        {[0, 1, 2].map((capa) => (
          <span
            key={capa}
            aria-hidden="true"
            className="color-grano color-ventana pointer-events-none absolute -top-8 h-28 overflow-hidden lg:-top-16"
          >
            <span className="color-deriva absolute -top-[63px] left-full font-display text-[10rem] italic leading-none tracking-[-0.05em] text-shell/3">
              color
            </span>
          </span>
        ))}

        {/* MECHÓN. Elemento gráfico, no un bloque: va en posición absoluta, así
            que no ocupa espacio ni desplaza nada. El titular y la bajada no se
            tocan ni se reajustan; el mechón se acomoda al corredor libre que
            queda a su derecha, y todo su encaje sale de .mechon-ventana
            (globals.css), donde está la aritmética y la razón de cada número.

            LA VENTANA ES LA FRANJA VISIBLE. Su canto derecho es el borde de la
            pantalla y su ancho es el de la franja lateral, así que la imagen
            -- más ancha que la ventana y anclada a su canto izquierdo -- se
            corta exactamente ahí. Lo que se ve es el flanco izquierdo del
            mechón, con su propia silueta; el resto cae fuera del viewport. Sin
            recorte por abajo: la ventana es más alta que la imagen, así que el
            final son las puntas del pelo y no una línea recta.

            COLORES PROPIOS. Sin opacidad, sin velo y sin modo de fusión: es
            hermana de las tres capas de la palabra "color", no descendiente, así
            que no hereda su mix-blend-mode: multiply. Verificado en pantalla que
            toda su cadena de ancestros mide mix-blend-mode: normal y opacity 1.

            LA ENTRADA AL CARGAR vive en components/MechonEntrada.tsx, que es
            un componente de cliente por una razón medida: la animación tiene que
            empezar cuando el bitmap está listo, no cuando carga el documento.
            Ahí está el detalle.

            Decorativo: aria-hidden en la ventana y alt vacío en la imagen. */}
        <MechonEntrada />

        <div className="relative">
          {/* Resplandor suave detrás del título: blob difuminado, cálido
              claro, descentrado. Opacidad baja para no bajar el contraste. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-4 -top-4 h-32 w-52 rounded-[50%] bg-shell-lift/20 blur-3xl"
          />
          {/* LOCKUP DEL TITULAR. Tres piezas que se leen como un objeto: la S
              capital que estructura el bloque, MIS encajado en el hueco de su
              curva, y el resto de la palabra.

              Todas las medidas van en `em` contra el cuerpo del lockup, así que
              basta un clamp para que la proporción sea idéntica en cualquier
              ancho: en pantallas chicas se reduce, no se desarma.

              El texto accesible va en un span sr-only y la composición entera
              lleva aria-hidden. Si no, el orden del DOM (S, MIS, ervicios)
              haría que el nombre del h1 se leyera partido.

              La fila es inline-flex con items-baseline: la S y "ervicios"
              comparten línea base sin que yo la calcule. MIS va absoluto
              dentro de un envoltorio a 1em, para que sus offsets estén en la
              misma unidad que el resto y no en la suya propia. */}
          {/* Titular. Lockup de dos piezas: "Diseños" en redonda arriba y
              "de color" en cursiva abajo, mayor que antes y volada por la
              derecha. Las dos en Bodoni Moda con font-medium (wght 500).

              PESO Y VARIANTE ÓPTICA, verificado inspeccionando con fontTools el
              woff2 que sirve el proyecto:

              - Medium SÍ existe: el archivo es variable con eje wght 400..900 e
                instancia con nombre "Medium" en 500. font-medium da peso
                dibujado, no negrita sintética.
              - 18pt NO está disponible, y esto está verificado por dos vías.
                El name table del woff2 dice "Bodoni Moda 11pt" y su fvar trae un
                solo eje, wght: Google Fonts sirve la familia con el eje opsz
                aplanado en 11pt. Y preguntándole al motor qué fuente usa de
                verdad al pintar (CSS.getPlatformFontsForNode del protocolo de
                DevTools), las tres piezas del lockup reportan familia
                "Bodoni Moda 11pt". font-optical-sizing computa `auto`, pero no
                tiene efecto porque no hay eje opsz que ajustar. Se obtendría
                añadiendo `axes: ["opsz"]` a la llamada de Bodoni_Moda en
                app/layout.tsx y luego font-variation-settings: "opsz" 18 aquí,
                pero eso cambia la carga de fuentes de TODO el sitio. Sin
                autorización, queda a 11pt.
              - Las cursivas son OBLICUA SINTÉTICA: el proyecto carga solo
                font-style normal. La itálica real de Bodoni existe en Google
                Fonts (italicAngle -13, con instancia Medium Italic).

              LA SEGUNDA LÍNEA VUELA POR LA DERECHA. text-[0.85em] (antes 0.5em)
              y -mr-[0.85em]. El margen negativo es imprescindible y no un
              adorno: con text-right, agrandar la línea NO la hace sobresalir --
              el borde derecho queda clavado en el borde derecho del contenedor y
              el texto crece hacia la IZQUIERDA. El margen negativo corre la caja
              hacia fuera del envoltorio, y como el envoltorio es inline-block su
              ancho lo sigue fijando "Diseños".

              DE DÓNDE SALE EL 0.85em, que antes era 0.20. La referencia es que
              la "l" de "color" caiga bajo la "s" final de "Diseños". Medido el
              centroide de tinta de las dos letras (a dsf=4, recortando la caja
              de avance de cada glifo para no arrastrar la tinta de sus vecinas),
              a -0.20em faltaban 0.642em del cuerpo de esta línea; 0.20 + 0.642
              redondeado a la centésima da 0.85, y con ese valor la desalineación
              que queda es de -0.00 a +0.09px en los siete anchos medidos. Va en
              em del propio span, así que la alineación se sostiene sola en todo
              el clamp: el desfase medido era idéntico (0.6228-0.6231em) en 320,
              360, 390, 414, 480, 768, 1024 y 1280.

              El volado sobre el borde derecho de "Diseños" pasa de +15/+20px a
              +45/+50, y la tinta de "de color" termina a 52.8px del canto del
              panel a 320px -- el ancho más justo -- sin desbordarlo ni generar
              scroll horizontal.

              Por lo mismo desapareció el pr-[0.095em] que había antes: existía
              para que los bordes de tinta COINCIDIERAN, y ahora deben separarse.

              -mt-[0.22em] es el interlineado. El em de un margen se resuelve
              contra el font-size del propio elemento, y este span está a 0.85em,
              así que al crecer la línea el mismo número tira más: el -0.30em que
              servía a 0.5em pasó a colisionar. Holgura medida entre la tinta
              baja de "Diseños" y las ascendentes de "de color": 1.75px a 320,
              1.50 a 360, 2.50 a 390, 414 y 768, y 1.50 en lg. El tope es
              -0.24em (0.5-1.5px) y a -0.26em ya colisiona; este valor deja un
              paso de margen para el rasterizado.

              tracking-[-0.056em] en las dos líneas, valor pedido. Queda por
              debajo del tope medido de la primera línea (-0.07em era el máximo;
              a -0.08em se fusionan formas), así que hay holgura de sobra: el
              conteo de componentes conexos sigue dando 9 en "Diseños" y 7 en
              "de color" en los seis anchos medidos.

              Efecto lateral de aflojarlo: "Diseños" se ensancha unos 6px y su
              borde derecho se corre. Con el -mr atado a la "s" eso ya no cambia
              la disposición: si se toca el interletrado de la primera línea hay
              que volver a medir el centroide de la "s" y rehacer el 0.85em.

              `relative` se queda: hace que el titular pinte por delante de las
              capas decorativas de la palabra "color", que van antes en el DOM. */}
          <h1 className="relative font-display text-[clamp(3.4rem,20.4vw-0.61rem,4.55rem)] text-shell-lift lg:text-[3.875rem]">
            {/* Lockup de dos piezas. El envoltorio es inline-block, así que su
                ancho es el de la línea más ancha -- "Diseños" -- y eso es lo
                que le da a "de color" un borde derecho contra el que alinearse
                con text-right. Sin el inline-block el envoltorio mediría el
                ancho del panel y la cursiva se iría al canto de la columna. */}
            <span className="inline-block">
              <span className="block font-medium leading-none tracking-[-0.056em]">
                Diseños
              </span>{" "}
              <span className="-mt-[0.22em] -mr-[0.85em] block text-right font-medium text-[0.85em] italic leading-none tracking-[-0.056em]">
                de color
              </span>
            </span>
          </h1>
        </div>

        {/* Columna de texto angosta, a 31ch = 260px. Ensanchada desde 26ch
            (218px) solo lo necesario para que el texto caiga en exactamente
            tres líneas y no cuatro: 40 / 38 / 34 caracteres, iguales en los dos
            breakpoints. `text-sm` fija los 14px sobre los que resuelve el ch,
            así que la medida vive una sola vez y el separador es w-full de esta
            misma columna.

            mt-1 (antes mt-5, y mt-8 antes de eso): el párrafo sube para
            leerse como parte del mismo bloque de encabezado y no como un texto
            suelto debajo del titular.

            ml-[5px] alinea la columna con el eje óptico del titular, no con su
            caja. Antes eran 2.8px, el lateral de la "s" minúscula del titular
            viejo; ahora la inicial es una S capital a 1.4em, cuyo lateral
            izquierdo mide 0.0565em de su propio cuerpo, o sea unos 5px. Las
            mayúsculas de Jost casi no tienen lateral (0.07px en la "A"), así
            que el valor va casi entero al indent.

            `relative` deja el bloque por encima de la capa decorativa. */}
        <div className="relative ml-[5px] mt-1 max-w-[31ch] text-sm min-[414px]:max-w-none">
          {/* Bajada: una oración por renglón, cada una en su propio bloque
              dentro del mismo <p>. La unidad semántica no cambia; lo que cambia
              es dónde empieza cada oración.

              UN RENGLÓN COMPLETO POR ORACIÓN, desde 414px. A 14px de Jost la
              primera oración mide 284px y la segunda 280px (a peso 500). La
              columna base es max-w-[31ch] = 260px, así que no caben; de 414px en
              adelante se libera con max-w-none y cada bloque entra en un
              renglón. En lg la columna mide 299px -- el panel de 19rem menos el
              indent de 5px -- y los 284px entran con 15px de sobra.

              El umbral es 414px y no un valor redondo porque lo fija la RUEDA, no
              la columna. Su borde es una circunferencia, así que el hueco libre
              depende de la altura de cada renglón: medido contra la curva, el
              primer renglón dispone de 187px a 320, 229px a 360, 263px a 390 y
              288px a 414 -- ahí es donde por fin superan los 284px que necesita.
              A 408px el renglón lo roza por 1.9px; a 414 lo libra entero.

              Por debajo de 414px no caben con ninguna de las dos palancas, y no
              se forzó: ver el reporte. Ahí las dos oraciones siguen partiéndose
              en dos renglones equilibrados cada una.

              Nada de whitespace-nowrap: no hace falta, porque cada oración es un
              bloque y con la columna ancha cae sola en un renglón. Y sería un
              riesgo -- con la webfont aún sin cargar entra la de reserva, y si no
              pudiera envolver desbordaría el panel. Comprobado bloqueando el
              woff2: la reserva da 282 y 275px, un renglón cada una y dentro del
              panel.

              text-balance sigue en los dos bloques: no hace nada cuando la
              oración cabe en un renglón, y por debajo de 480px es lo que evita
              que quede una palabra huérfana al final. Va por bloque separado y
              no con un <br />, porque con <br /> Chrome equilibra solo el
              segmento anterior al salto: medido, la segunda oración quedaba en
              226/39px con "juntos." solo en el último renglón.

              El peso: la segunda oración va en font-medium (500) y la primera se
              queda en 400. Jost está cargada como variable con eje wght 100..900,
              así que el 500 es peso real, no sintético -- se nota en el avance:
              la misma oración mide 269px a 400 y 280px a 500. */}
          <p className="text-shell-lift/90">
            <span className="block text-balance">
              Conoce cada diseño de color en el que trabajo.
            </span>{" "}
            <span className="block font-medium text-balance">
              Cuéntame qué buscas y lo resolvemos juntos.
            </span>
          </p>
        </div>

        {/* FILA DEL MUESTRARIO Y EL REGRESO.

            La regla sólida de 3px en `dune` que vivía aquí se fue, y en su lugar
            entró el MUESTRARIO DE TINTE que estaba bajo el encabezado del
            disclaimer de rango: la misma clase .hair-swatch, el mismo alto (h-2)
            y el mismo rounded-full, así que conserva su degradado de los siete
            tokens y su deriva lenta. El efecto no depende del ancho: la
            animación desplaza `background-position` sobre un degradado al 200%,
            así que funciona igual en 242 que en 720px.

            EL BOTÓN ABRE LA FILA, alineado con el eje izquierdo del contenido
            -- el mismo ml-[5px] que comparten el titular, la bajada y esta fila
            --, y el muestrario ocupa con flex-1 todo lo que queda a su derecha,
            hasta el canto del panel. Es el orden invertido de lo que había: la
            barra no quedó descolocada, cambió de lado y conserva su ancho,
            porque en los dos casos mide el ancho de la fila menos el botón y el
            hueco. Medido: 280px a 390 y 242 en lg, igual que antes.

            El ml-[5px] y el mt-5 son los que tenía la regla cuando vivía dentro
            de la columna de texto, así que la fila arranca en el mismo eje
            óptico del titular y de la bajada y conserva sus 20px de aire.

            EL BOTÓN VA AQUÍ, junto a la regla y a su misma altura (items-center
            los centra sobre el mismo eje). No al canto derecho del panel: ahí
            caería dentro de la franja del mechón -- a 320px la franja arranca en
            x=232 y el botón terminaba en 296 -- y un cristal con blur encima del
            pelo ensucia las dos cosas. Al lado de la regla queda a 100px o más
            de esa franja en todos los anchos.

            FORMA MÁS DELGADA: 26px de alto contra los 44px de antes -- y por
            debajo de los 30px de los botones de la carta, que es lo que lo deja
            como el control más discreto de la página --, con el mismo vidrio
            secundario de esos botones (clay al 10% con borde a /20 y blur) en
            vez del dune con borde blanco que tenía. El área de toque se queda en
            46px por ::after con inset vertical negativo, así que no engorda la
            fila ni corre la regla.

            El foco de teclado va forzado a crema: la regla global de
            :focus-visible en globals.css pinta el anillo en dune-deep, que sobre
            este fondo mide 1.65:1 -- por debajo del mínimo de 3:1. El `!` es
            necesario porque esa regla no está en una capa y le gana a las
            utilidades de Tailwind. */}
        <div className="ml-[5px] mt-5 flex items-center gap-4">
          <Link
            href="/"
            aria-label="Atrás"
            className="relative inline-flex items-center rounded-full border border-clay/20 bg-clay/10 px-3 py-1 text-shell-lift backdrop-blur-xl transition-colors duration-150 after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] hover:bg-clay/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
          >
            <span
              aria-hidden="true"
              className="inline-block text-base leading-none animate-[back-nudge_1.8s_ease-in-out_infinite]"
            >
              ←
            </span>
          </Link>

          <div
            aria-hidden="true"
            className="hair-swatch h-2 flex-1 rounded-full"
          />
        </div>

        <ContactoAside />
      </aside>

      {/* `relative` porque la capa decorativa ahora abarca el viewport y le
          pasa por encima en el eje y=0..112: al ser un elemento posicionado y
          posterior en el DOM, esta columna vuelve a pintar por delante.

          pb-8 y no pb-28: los 112px de antes reservaban el alto de la barra
          fija de WhatsApp, que ya no existe en esta ruta porque su botón vive
          dentro de la pieza del cierre. Quedan 32px de aire al final, más el
          pb-4 del contenedor del layout.

          min-w-0 es lo que impide que el carrusel infle la retícula. En lg esta
          columna es el ítem de la pista `1fr`, y el tamaño mínimo automático de
          un ítem de grid se calcula contra su contenido: el riel del carrusel
          mide 12 176px y ese número subía por la cadena hasta aquí. Medido sin
          él a 1280px, esta columna medía 12 080px -- diez veces el contenedor --
          y la página ganaba 11 360px de desplazamiento horizontal. Con el
          mínimo en cero la columna vuelve a medir lo que le da la retícula y es
          la pista del carrusel la que recorta su contenido, que es su trabajo.
          El mismo mínimo va en el envoltorio del carrusel, por la misma razón
          una capa más abajo: los ítems flex también traen min-width auto. */}
      <div className="relative min-w-0 pb-8 lg:pb-0">
        {/* mt-4: en móvil es el hueco entre la regla del panel y lo primero
            de esta columna, que ya no es el encabezado de sección sino el
            kicker. Junto con el mt-4 del propio kicker suma los 32px que lo
            separan del bloque de encabezado. En lg no aplica (lg:mt-0): ahí
            esta columna arranca a la altura del titular, en paralelo. */}
        <div className="mt-4 flex flex-col gap-14 lg:mt-0 lg:gap-16">
          {/* ocultarTitulo: el h2 "Diseño de color" repetía lo que ya dice la
              bajada del panel a pocos centímetros. La sección conserva nombre
              accesible vía aria-label, así que sigue anunciándose igual. */}
          <CategoriaCarta category={color} ocultarTitulo editorial />

          {/* EL CARRUSEL DE TRABAJOS, Y ES LO QUE SEPARA LAS DOS CARTAS.

              Aquí abajo se retiró el tratamiento de fondo que tenía la segunda
              sección -- el velo de tierra con sus degradados --: la frontera la
              marca ahora esta tira de fotografías, y marcarla dos veces era
              redundante. La sección vuelve al fondo normal de la página, sin
              capa propia, sin sangrado y sin relleno vertical extra: lo único
              que la separa por arriba y por abajo son los 56px del gap de esta
              columna (64 en lg), los mismos que hay entre cualquier par de
              bloques.

              CÓMO SANGRA. En móvil sale a los dos cantos de la pantalla con
              -ml-6/-mr-6, que es exactamente el px-6 del contenedor del layout.
              En lg NO sale por la izquierda (lg:ml-0): ahí la retícula es de dos
              columnas con el panel del encabezado sticky, y una tira a todo lo
              ancho le pasaría por detrás. Por la derecha sí llega al canto con
              max(2rem, 50vw - 34rem), que es el px-8 del contenedor más la
              mitad de lo que sobra cuando el viewport pasa de 72rem. Así la
              tira se lee como algo que continúa fuera de pantalla sin invadir
              nada.

              El relleno del riel es el complemento: px-6 en móvil y 0 por la
              izquierda en lg, para que la primera tarjeta caiga en el mismo eje
              que los nombres de las dos cartas.

              min-w-0 NO ES DECORATIVO. En lg esta columna es un ítem de la
              retícula, y el tamaño mínimo automático de un ítem se calcula
              contra el contenido: la pista del carrusel mide 12 176px de riel,
              y ese número subía por la cadena hasta la pista de 1fr. Medido sin
              min-w-0 a 1280px: el contenedor con scroll acababa en x=12 640 y la
              página ganaba 11 360px de desplazamiento horizontal. Con el mínimo
              en cero, el ítem vuelve a medir lo que le da la retícula y la
              pista recorta su contenido, que es su trabajo.

              TARJETAS PEQUEÑAS, porque esto es una TIRA y no una galería. En
              /galeria la tarjeta mide 62vw con tope de 17rem -- 242px en un
              teléfono de 390 -- y ahí manda, porque el carrusel es el contenido
              de la página. Aquí es un separador entre dos cartas, así que baja
              a 30vw con tope de 9rem: 117px a 390 y 108 a 360, menos de la
              mitad. Con eso entran tres fotografías completas más el canto de
              la cuarta en la pantalla más estrecha del piso de calidad, y el
              conjunto se lee como una secuencia de trabajos en vez de como
              imágenes sueltas.

              El `sizes` viaja con el ancho en la misma prop y no por separado:
              si se cambia uno sin el otro, next/image sigue pidiendo el archivo
              del tamaño anterior y el ahorro de red se pierde. Ver abajo por
              qué no coincide con el ancho.

              El componente es el mismo de /galeria, con su visor. Solo las
              miniaturas cargan con la página; las completas se piden al abrir
              una foto, y solo la activa con sus dos vecinas. */}
          <div className="-mt-1 -mr-6 -ml-6 min-w-0 lg:ml-0 lg:-mr-[max(2rem,calc(50vw-34rem))]">
            {/* EL FOCO MÓVIL, Y NADA MÁS. Hubo una versión con tres anchos
                alternos en un motivo de siete pasos, para que la fila quieta
                tuviera ritmo de composición, y se retiró: las catorce
                fotografías miden lo mismo y la única variación de escala es el
                crecimiento de la que pasa por el centro.

                El `sizes` viaja con el ancho en la misma prop y tiene que
                cubrir el caso más grande: el ancho base realzado por el foco,
                30vw x 1.10 = 33vw, o 9rem x 1.10 = 9.9rem. Con el sizes del
                ancho base, next/image pediría el archivo de 9rem y la
                protagonista se vería blanda al crecer. */}
            <GaleriaCliente
              rellenoRiel="px-6 lg:pl-0 lg:pr-[max(2rem,calc(50vw-34rem))]"
              tarjeta={{
                clase: "w-[min(30vw,9rem)]",
                sizes: "(min-width: 640px) 10rem, 33vw",
              }}
              foco
              visorClaro
              // La clave del almacenamiento local. No se cambia: renombrarla
              // borra los favoritos de todo el que ya tenga alguno.
              claveFavoritos="axel:galeria:favoritas"
              fisicaVisor
            />
          </div>

          {/* SEGUNDA CARTA, SIN ENCABEZADO: las ondas, el corte y la salida a
              tratamientos.

              MISMO DISEÑO EXACTO QUE LA LISTA DE COLOR. Ya no tiene voz propia:
              se le quitó la prop `nombreEnCuerpo`, que era lo único que la
              separaba, y con ella cayeron los cuatro rasgos que la hacían
              flotar aparte -- familia de cuerpo en vez de display, 24px en vez
              de 26/30, peso 400 en vez de 500 e interletrado -0.02em en vez de
              -0.056em -- más el relleno vertical, que vuelve a py-6. El nombre
              a la izquierda, la cifra en el margen derecho, el cheurón después,
              la línea de un pelo entre renglones y el acordeón exclusivo ya los
              daba el modo editorial de la carta, que es el mismo componente.

              Lo único que sigue distinto es que ninguna fila arranca abierta
              (abrirPrimero={false}), y eso no es tratamiento sino estado: el
              acordeón es exclusivo POR CATEGORÍA, así que con las dos cartas
              abriendo su primer servicio la página cargaba con dos paneles
              desplegados.

              El kicker no se repite (sinKicker): es una indicación de uso de la
              página, no de la categoría, y con dos cartas se decía dos veces.

              -mt-13 ACERCA ESTA CARTA AL CARRUSEL, Y A PROPÓSITO NO LO DEJA
              SIMÉTRICO. El aire de la tira es asimétrico: 64px por arriba y 32
              por abajo, medidos de canto de tarjeta a canto de texto.

              Los dos números dicen cosas distintas. Los 64 de arriba separan la
              tira del final de la lista de color, que es donde termina un
              bloque; los 32 de abajo la cosen con la sección que sigue, para
              que Wavys se lea como continuación de la página y no como algo que
              empieza de nuevo. Simétrico, la sección quedaba flotando.

              La cuenta: el gap de la columna es de 56px y la pista aporta 12 de
              relleno por lado. Por arriba, 56 - 4 del -mt-1 del envoltorio + 12
              = 64. Por abajo, 12 + 56 + 16 del mt-4 que la lista trae de fábrica
              sobre su primer renglón - 52 de este margen = 32. En lg el gap
              sube a 64 y las dos cifras suben con él, a 72 y 40.

              Va aquí y no quitando el relleno de la pista, porque ese vive en el
              componente del carrusel, que comparte con /galeria. */}
          {/* SIN SUPERFICIE PROPIA. Aquí vivía un envoltorio que sangraba a los
              cantos de la pantalla y una capa de degradado de clay (.zona-
              seccion) por detrás, para que esta sección se leyera como una zona
              aparte. Se fueron las dos: la sección vuelve al fondo normal de la
              página, el mismo que la lista de color, y ya no hay tarjeta, ni
              velo, ni sangrado, ni máscara. El envoltorio se queda solo por el
              margen negativo que iguala el aire del carrusel. */}
          <div className="-mt-13">
            <CategoriaCarta
              category={CORTE_Y_ESTILO}
              ocultarTitulo
              editorial
              sinKicker
              comoPila
              abrirPrimero={false}
            />

            {/* LA SALIDA A TRATAMIENTOS: UNA PILA DE CARTAS.

                Era un renglón de texto con una flecha, al mismo nivel que los
                dos servicios de arriba. Ahora es una pieza con cuerpo propio:
                tres cartas apiladas, las dos de atrás asomando por el canto
                superior, reducidas y desfasadas respecto a la de adelante.

                QUE SE LEA COMO NAVEGACIÓN Y NO COMO VISOR. Es el riesgo de la
                figura: una pila anuncia varias piezas que se van a hojear, y lo
                que pasa al tocarla es que se cambia de página. Se resuelve con
                tres decisiones, no con un texto explicativo:

                  - LAS HOJAS ASOMAN POR ARRIBA, no por el costado. Un mazo
                    escalonado hacia la derecha es la figura de "desliza para
                    ver la siguiente"; un taco de hojas que asoma por el canto
                    superior es la figura de "aquí dentro hay varias cosas". La
                    primera invita a arrastrar, la segunda a entrar.
                  - LA FLECHA SE QUEDA, y apunta hacia adelante. Un visor
                    llevaría puntos, un contador o cheurones a los lados; una
                    flecha de avance a la derecha solo significa ir a otro
                    sitio. Es el signo que desambigua la figura.
                  - EL NOMBRE ES EL PROTAGONISTA y vive en la carta de
                    adelante, con el mismo tratamiento exacto que Wavys y Corte
                    dama: Jost, 24px, peso 400, interletrado -0.02em y crema al
                    100%. La pila no lo compite: las hojas de atrás son dos
                    bandas de 7 y 14px de alto, y solo la de adelante lleva
                    contenido.

                VIDRIO EN EL RANGO TERRACOTA. Hubo una versión de relleno
                opaco de `dune` y se veía como un bloque pesado; y antes de esa,
                una de vidrio claro. Esta es la tercera: el material de la de
                vidrio -- desenfoque de fondo, superficie translúcida y contorno
                cálido apenas perceptible -- pero trabajando en el terracota.

                TRES CAPAS Y NINGUNA PLANA. Cada una lleva un degradado vertical
                de `dune` (#a05035) a `dune-deep` (#8a4229) -- el rango terracota
                de la paleta, el acento y su variante oscurecida -- que además
                BAJA DE OPACIDAD al descender: la de adelante va de 68% a 44%,
                la hoja media de 48 a 30 y la del fondo de 30 a 18.

                El degradado hace dos cosas a la vez: recorre el tono, que es de
                donde sale la profundidad, y abre la translucidez, así que por la
                parte baja de cada carta se transparenta más el fondo de la
                página. Eso es lo que da sensación de material -- el desenfoque y
                la transparencia -- y no la saturación.

                SIN BANDAS. Los dos topes son del mismo rango y la distancia entre
                ellos es corta, así que la interpolación no tiene por dónde
                escalonarse; y el desenfoque de fondo de la carta de adelante
                alisa además lo que se transparenta de las hojas.

                SIN BLANCO PURO NI BRILLOS EN LOS CANTOS: el contorno es clay al
                25/18/14%, cálido y apenas perceptible, y no hay anillo interior
                ni realce de canto en ninguna capa.

                PROFUNDIDAD SIN SOMBRA. No hay box-shadow en ninguna capa. El
                volumen se construye con dos recursos de la casa:

                  - RETRANQUEO. Cada hoja es 24px más angosta que la anterior
                    (12px por costado) y asoma 7px por arriba, así que las tres
                    comparten centro y se escalonan en perspectiva.
                  - RECESIÓN TONAL. Cada hoja es más transparente que la
                    anterior -- 68-44% en la de adelante, 48-30 en la media y
                    30-18 en la del fondo --, con el contorno de clay bajando de
                    25 a 18 y a 14. Lo que está más lejos tiene menos materia,
                    así que se hunde hacia el fondo oscuro de la página, y es
                    como se lee la distancia sin proyectar sombras.

                El radio es rounded-2xl en las tres, el mismo del recuadro del
                cierre que va justo debajo.

                EL ÁREA DE TOQUE es la carta completa, no el renglón de texto:
                px-4 py-4 sobre una línea de 34px da 66px de alto, y el enlace
                entero -- pila incluida -- mide 80px. El anillo de foco envuelve
                la pila completa; no hay overflow-hidden en ninguna capa que lo
                pudiera recortar.

                LA VIDA Y LA RESPUESTA AL TOQUE están en globals.css
                (.pila-tratamientos y .pila-hoja-*), con el detalle de por qué
                la deriva usa `translate` y la respuesta `transform`. La deriva
                continua que tenía la flecha se retiró: la pila ya respira, y
                dos animaciones continuas en la misma pieza se leían inquietas.

                Conserva el ancho de la lista (lg:max-w-[32rem]) por la misma
                razón de contraste documentada en CategoriaCarta. La línea de un
                pelo que la separaba de Corte dama se fue: una carta no necesita
                divisor, lo separa el aire. */}
            <Link
              href="/menu/tratamientos"
              className="pila-tratamientos group relative mt-5 block pt-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift! lg:max-w-[32rem]"
            >
              <span
                aria-hidden="true"
                className="pila-hoja pila-hoja-fondo absolute inset-x-6 inset-y-0 rounded-2xl border border-clay/14 bg-linear-to-b from-dune/30 to-dune-deep/18"
              />
              <span
                aria-hidden="true"
                className="pila-hoja pila-hoja-media absolute inset-x-3 top-[7px] bottom-0 rounded-2xl border border-clay/18 bg-linear-to-b from-dune/48 to-dune-deep/30"
              />

              <span className="pila-frente relative flex items-center justify-between gap-4 rounded-2xl border border-clay/25 bg-linear-to-b from-dune/68 to-dune-deep/44 px-4 py-4 backdrop-blur-md">
                <span className="font-body text-2xl font-normal tracking-[-0.02em] text-shell-lift">
                  Tratamientos
                </span>

                {/* LA FLECHA. NO SE VEÍA, y la causa no era el tamaño: era el
                    color. El trazo usa `currentColor` y este <span> no
                    declaraba ninguno, así que heredaba el del <body> -- tierra,
                    #2a1d14 -- y quedaba tinta oscura sobre la superficie clara
                    de la carta: 1.83:1 medido, por debajo de cualquier mínimo.
                    Es el mismo fallo que tuvo la flecha del pie, y el arreglo
                    es el mismo: declarar el crema aquí, donde vive el signo.

                    Y sube de escala con la pieza. Era un dibujo de 64x14 hecho
                    para un renglón de texto; dentro de una carta de 66px de
                    alto se quedaba corta. Pasa a 80x18 con el trazo a 1.6px:
                    el lienzo crece un 25% en las dos dimensiones y el trazo lo
                    acompaña -- 1.25 x 1.28 -- así que el dibujo es el mismo,
                    escalado, y no una versión engordada de sí mismo. Sigue
                    siendo una hairline y no un icono de interfaz. */}
                <span
                  aria-hidden="true"
                  className="inline-block shrink-0 text-shell-lift"
                >
                  <svg
                    viewBox="0 0 80 18"
                    fill="none"
                    className="block h-[18px] w-20 transition-transform duration-200 ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2 group-active:translate-x-3.5"
                  >
                    <defs>
                      {/* gradientUnits en coordenadas de usuario, no en la
                          caja del objeto. Con el valor por omisión
                          (objectBoundingBox) los topes se resuelven contra la
                          caja delimitadora del trazo, y la de una línea
                          horizontal tiene ALTURA CERO: por especificación, un
                          degradado sobre una caja degenerada no se pinta, así
                          que el asta desaparecía y solo quedaba la punta. */}
                      <linearGradient
                        id="estela-tratamientos"
                        gradientUnits="userSpaceOnUse"
                        x1="0.8"
                        y1="9"
                        x2="71"
                        y2="9"
                      >
                        <stop
                          offset="0"
                          stopColor="currentColor"
                          stopOpacity="0"
                        />
                        <stop
                          offset="0.45"
                          stopColor="currentColor"
                          stopOpacity="1"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0.8 9H71.2"
                      stroke="url(#estela-tratamientos)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M64.2 2.25L71.4 9L64.2 15.75"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </Link>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              CIERRE: EL RECUADRO Y EL BOTÓN DE WhatsApp, UNA SOLA PIEZA.

              Cuatro elementos y ninguno más: la ubicación, la nota de precios,
              el botón que abre la biografía y el botón de WhatsApp.

              EL BOTÓN DE WhatsApp ES EL QUE YA EXISTÍA. Vivía como barra fija
              al pie en app/menu/layout.tsx: mismo enlace, mismo mensaje
              prellenado, mismo relleno de `dune-deep`, mismo cuerpo en versalita
              espaciada y mismo texto. Lo único que se le quitó es lo que
              impedía la unión: su radio propio -- ahora lo recorta el del
              contenedor -- y la barra que lo envolvía, con sus 12px de relleno
              y su borde superior blanco, que era literalmente una costura.

              Y tuvo que salir del layout, porque ese layout lo comparte
              /menu/tratamientos: una barra fija al viewport no se puede unir a
              un recuadro que se desplaza con la página. El marcado se movió sin
              cambiarlo a cada pantalla -- aquí en flujo, allá como barra fija --
              así que /menu/tratamientos no cambia en nada.

              CÓMO SE UNEN: son dos zonas del MISMO contenedor. El
              overflow-hidden hace que su radio recorte los cantos del botón, y
              entre las dos no hay nada: ni borde, ni divisor, ni hueco. El
              contorno de 1px es el de la pieza completa, no una línea entre
              partes.

              EL VIDRIO ES NEUTRO: no lleva relleno de color. Lo que lo hace
              vidrio es el desenfoque de fondo -- que alisa el grano y el
              viñeteo de la fotografía y ya se lee como un panel -- más el
              contorno cálido de clay al 20%, apenas perceptible. Sin blanco
              puro en ninguna capa y sin realce en los cantos: ni sombra
              interior, ni degradado de brillo.

              El anillo de foco del botón de WhatsApp va por dentro
              (-outline-offset con marca de importancia): el overflow-hidden
              recorta lo que se pinte fuera de la caja, y además la regla global
              de :focus-visible fija el offset en 2px sin estar en una capa. De
              paso el anillo pasa a crema: en su versión de barra heredaba el
              dune-deep de la regla global, que sobre un relleno dune-deep es
              invisible.
              ───────────────────────────────────────────────────────────── */}
          <footer className="-mt-8 overflow-hidden rounded-2xl border border-clay/20 backdrop-blur-xl lg:max-w-[32rem]">
            <div className="px-4 py-4 lg:px-6 lg:py-5">
              {/* EL BOTÓN DE LA BIOGRAFÍA, CON FORMA PROPIA, Y LA UBICACIÓN.

                  El componente es el de la landing, sin tocarlo, y aquí SE
                  CONSERVA SU CÁPSULA: es lo que lo hace botón y no un enlace de
                  texto. Todo lo que sigue se reviste por la prop `className`
                  -- que el componente ya expone -- sin editar el componente.

                  PRESENCIA POR DISEÑO, NO POR TAMAÑO. El tamaño no se toca:
                  sigue en text-xs con px-4 y min-h-11 (medido: 130x44). Lo que
                  cambia es el material de la cápsula, en tres registros:

                    1. CANTO. El contorno de clay al 30% medía 1.35-1.42:1
                       contra el vidrio -- por debajo del mínimo de 3:1 que pide
                       AA para el límite de un control, y en pantalla
                       literalmente no se veía. Pasa a crema al 45%.
                    2. SUPERFICIE. Deja de ser transparente y toma un velo de
                       crema al 10%: densifica el vidrio bajo la cápsula lo
                       justo para que se lea como una pieza apoyada encima, sin
                       convertirse en un relleno sólido que compitiera con el
                       botón de WhatsApp.
                    3. RESPUESTA. hover y focus-visible suben el velo a 18% y el
                       canto a 70%; active lo presiona a 25%; y la flecha del
                       propio componente avanza 2px, el mismo gesto del acceso a
                       Tratamientos. La regla global de prefers-reduced-motion
                       neutraliza las tres transiciones (0.01ms).

                  Medido a 360/390/1280: el texto crema sobre el velo da
                  12.49 / 12.56 / 11.11:1, y el canto contra el vidrio de
                  alrededor 4.50:1 en los tres. El anillo de foco pasa de
                  dune-deep a
                  crema, porque el dune mide 1.65:1 sobre este fondo. gap-1.5
                  repone el espacio entre el texto y su flecha, que en un
                  contenedor flex se descarta por ser un nodo de solo espacio.

                  Las marcas de importancia son obligatorias: en Tailwind, entre
                  dos utilidades de la misma propiedad gana el orden de la hoja,
                  no el del atributo -- y con la base marcada, cada estado tiene
                  que marcarse también para poder ganarle. Las variantes
                  arbitrarias [&>span] no las llevan porque el componente no
                  define nada sobre ese hijo. */}
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3">
                <ConoceMas className="gap-1.5! rounded-full! border-shell-lift/45! bg-shell-lift/10! px-4! min-h-11! transition-colors! [&>span]:transition-transform [&>span]:duration-150 hover:border-shell-lift/70! hover:bg-shell-lift/18! hover:[&>span]:translate-x-0.5 focus-visible:border-shell-lift/70! focus-visible:bg-shell-lift/18! focus-visible:outline-shell-lift! focus-visible:[&>span]:translate-x-0.5 active:bg-shell-lift/25!" />

                <p className="shrink-0 text-[11px] uppercase tracking-[0.25em] text-shell-lift/70">
                  {site.location}
                </p>
              </div>

              <p className="mt-4 text-[0.8125rem] leading-[1.3] text-shell-lift/85">
                Precios en pesos mexicanos.
                <br />
                Sujetos a cambios sin previo aviso.
              </p>
            </div>

            <a
              href={waLink(
                "Hola Axel, vi tus servicios y quiero agendar una cita.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-dune-deep px-4 py-3 text-center text-sm uppercase tracking-widest text-shell-lift transition-colors duration-150 hover:bg-dune focus-visible:outline-2 focus-visible:-outline-offset-2! focus-visible:outline-shell-lift!"
            >
              Escríbeme por WhatsApp
            </a>
          </footer>
        </div>
      </div>
    </>
  );
}
