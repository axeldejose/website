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
              del tamaño anterior y el ahorro de red se pierde.

              El componente es el mismo de /galeria, con su visor. Solo las
              miniaturas cargan con la página; las completas se piden al abrir
              una foto, y solo la activa con sus dos vecinas. */}
          <div className="-ml-6 -mr-6 min-w-0 lg:ml-0 lg:-mr-[max(2rem,calc(50vw-34rem))]">
            <GaleriaCliente
              rellenoRiel="px-6 lg:pl-0 lg:pr-[max(2rem,calc(50vw-34rem))]"
              tarjeta={{
                clase: "w-[min(30vw,9rem)]",
                sizes: "(min-width: 640px) 9rem, 30vw",
              }}
            />
          </div>

          {/* SEGUNDA CARTA, SIN ENCABEZADO: las ondas, el corte y la salida a
              tratamientos. Sobre el fondo normal de la página, como la lista de
              color: lo que la distingue es la voz de sus nombres -- Jost a 36px
              contra el Bodoni de 24 de arriba -- y el carrusel que la precede.

              El kicker no se repite (sinKicker) y ninguna fila arranca abierta
              (abrirPrimero={false}): el acordeón es exclusivo por categoría, así
              que con las dos abriendo su primer servicio la página cargaba con
              dos paneles desplegados.

              -mt-6 IGUALA EL AIRE A LOS DOS LADOS DEL CARRUSEL. El gap de la
              columna es el mismo por arriba y por abajo, pero entre las
              tarjetas y esta carta se cuelan 24px que no son del gap: 8 del
              pb-2 de la pista del carrusel y 16 del mt-4 que la lista trae de
              fábrica sobre su primer renglón. Medido, quedaban 56px sobre las
              tarjetas contra 80 debajo (64 contra 88 en lg). Con -mt-6 los dos
              lados miden lo mismo. Va aquí y no quitando el pb-2, porque ese
              vive en el componente del carrusel, que comparte con /galeria. */}
          {/* LA ZONA DE LA SECCIÓN. El envoltorio sangra a los cantos y
              devuelve el contenido a su eje con el relleno del mismo tamaño,
              así que el texto no se mueve; en lg solo sangra 4rem por la
              izquierda -- el gap entre columnas, donde muere la máscara -- y
              hasta el canto de la pantalla por la derecha.

              La capa del degradado va aparte y en -z-10: este contenedor es
              `relative` con z-index auto, así que no crea contexto de
              apilamiento y la capa negativa sube al contexto raíz, por encima
              del fondo fijo del layout y por debajo de todo el contenido. La
              receta y el perfil del degradado están en .zona-seccion. */}
          <div className="relative -mt-6 -mx-6 px-6 pb-4 lg:-ml-16 lg:-mr-[max(2rem,calc(50vw-34rem))] lg:pl-16 lg:pr-[max(2rem,calc(50vw-34rem))]">
            <div
              aria-hidden="true"
              className="zona-seccion pointer-events-none absolute inset-0 -z-10"
            />
            <CategoriaCarta
              category={CORTE_Y_ESTILO}
              ocultarTitulo
              editorial
              sinKicker
              nombreEnCuerpo
              abrirPrimero={false}
            />

            {/* LA SALIDA A TRATAMIENTOS, AL MISMO NIVEL QUE LOS SERVICIOS.

                El texto toma el mismo tratamiento exacto que Wavys y Corte
                dama: Jost, mismo cuerpo (24px), mismo peso (400), mismo
                interletrado (-0.02em) y crema al 100%. Y el mismo relleno
                vertical de sus renglones, py-4, para que la tarjeta quede
                compacta. La caja alta se fue al crecer: a 30px con
                interletrado de 0.25em, "TRATAMIENTOS" mediría unos 410px de
                tinta y no cabría ni a 320 ni a 360px de pantalla.

                LA FLECHA. Es el único acceso a esa página desde aquí, así que
                deja de ser el glifo de 16px y pasa a ser un objeto dibujado de
                64px de ancho: cuatro veces más. Tres decisiones:

                  - HAIRLINE, NO ICONO. Trazo de 1.25px con remates redondos,
                    el mismo grosor de la cruz del cierre del visor y el mismo
                    lenguaje de dibujo que los cheurones de la carta. A 64px de
                    largo, un trazo de 1px se rompería visualmente y uno de 2
                    sería un icono de interfaz; 1.25 mantiene el peso óptico de
                    la casa.
                  - LA COLA SE DISUELVE. El asta lleva un degradado de opacidad
                    en el propio trazo: arranca en 0 y llega a 1 en el 45% del
                    recorrido. Eso es lo que la convierte en un objeto en
                    movimiento -- una estela -- en vez de una raya con punta, y
                    es lo que le da dirección aunque esté quieta.
                  - LA PUNTA ES UNA V ABIERTA, el mismo cheurón que usa el
                    acordeón, girado. No es un triángulo relleno: rellenarlo
                    rompería el contraste de trazo que sostiene todo el resto de
                    los signos de la página.

                LA VIDA. Dos capas que se componen, y por eso van anidadas:

                  1. DERIVA CONTINUA en el envoltorio (.flecha-avance, en
                     globals.css): 6px de ida y vuelta en 2.6s con frenado
                     largo. Sugiere avance sin llamar la atención, y con
                     prefers-reduced-motion queda quieta en su sitio.
                  2. RESPUESTA PROPIA en el SVG: 8px más adelante al pasar el
                     cursor o al recibir foco de teclado, 14px al mantener
                     pulsado, con transición de 200ms. Al vivir en otra capa se
                     suma a la deriva en vez de pelearse con ella: dos transform
                     en el mismo elemento se pisan y la animación gana siempre.

                El realce de opacidad que tenía el renglón completo se retiró:
                la respuesta ahora es de la flecha, y dos realces a la vez
                competían.

                Lo que la distingue de un servicio no es la tipografía sino la
                estructura: donde los otros dos llevan precio y cheurón, este
                lleva la flecha. Conserva su línea de un pelo, su py-6 -- 48px
                de alto de toque en toda la fila, que es el enlace completo -- y
                el ancho de la lista. */}
            <Link
              href="/menu/tratamientos"
              className="group flex items-baseline justify-between gap-4 border-t border-shell-lift/15 py-4 font-body text-2xl font-normal tracking-[-0.02em] text-shell-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift! lg:max-w-[32rem]"
            >
              Tratamientos
              <span
                aria-hidden="true"
                className="flecha-avance inline-block shrink-0 self-center"
              >
                <svg
                  viewBox="0 0 64 14"
                  fill="none"
                  className="block h-3.5 w-16 transition-transform duration-200 ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2 group-active:translate-x-3.5"
                >
                  <defs>
                    {/* gradientUnits en coordenadas de usuario, no en la
                        caja del objeto. Con el valor por omisión
                        (objectBoundingBox) los topes se resuelven contra la
                        caja delimitadora del trazo, y la de una línea
                        horizontal tiene ALTURA CERO: por especificación, un
                        degradado sobre una caja degenerada no se pinta, así que
                        el asta desaparecía y solo quedaba la punta. Medido en
                        pantalla antes de corregirlo. */}
                    <linearGradient
                      id="estela-tratamientos"
                      gradientUnits="userSpaceOnUse"
                      x1="0.75"
                      y1="7"
                      x2="57"
                      y2="7"
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
                    d="M0.75 7H57"
                    stroke="url(#estela-tratamientos)"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                  <path
                    d="M51.5 1.75L57.25 7L51.5 12.25"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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
                  texto. Lo que se reviste por la prop `className` -- que el
                  componente ya expone -- son solo los tokens que no encajan en
                  este recuadro:

                    - el borde blanco al 50% y el relleno blanco al 10% pasan a
                      contorno de clay al 30% sin relleno, porque aquí no va
                      blanco puro y el vidrio es neutro;
                    - el alto mínimo sube de 40 a 44px de acierto de toque;
                    - el anillo de foco pasa de dune-deep a crema (el dune mide
                      1.65:1 sobre este fondo, por debajo del mínimo de 3:1);
                    - gap-1.5 repone el espacio entre el texto y su flecha, que
                      en un contenedor flex se descarta por ser un nodo de solo
                      espacio.

                  Las marcas de importancia son obligatorias: en Tailwind, entre
                  dos utilidades de la misma propiedad gana el orden de la hoja,
                  no el del atributo. */}
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3">
                <ConoceMas className="gap-1.5! rounded-full! border-clay/30! bg-transparent! px-4! min-h-11! transition-colors! hover:bg-shell-lift/10! focus-visible:outline-shell-lift!" />

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
