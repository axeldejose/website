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

        {/* encabezado-color declara --titulo-cuerpo, el cuerpo del titular, que
            el control de regreso necesita para montarse en la segunda línea.
            Vive en globals.css junto con los dos factores medidos del lockup. */}
        <div className="encabezado-color relative">
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
          <h1 className="titular-color relative font-display text-shell-lift">
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

          {/* EL CONTROL DE REGRESO, montado en la segunda línea del titular, a
              la izquierda de "de color". Va FUERA del <h1> a propósito: dentro,
              su nombre accesible entraría en el del encabezado y el titular se
              anunciaría como "Diseños Atrás de color". Aquí queda como un
              hermano posicionado, y su orden de tabulación sigue siendo el
              primero del panel, como antes.

              La geometría -- de dónde salen el 1.081 y el 1.195 que lo colocan,
              y por qué no puede centrarse en la tinta de la palabra -- está en
              globals.css (.regreso-titular). Forma, tamaño, vidrio, área de
              toque de 46px y animación de la flecha son los mismos de antes: lo
              único que cambió es dónde vive.

              EL ÁREA DE TOQUE se solapa 3.4px con la tinta de "Diseños" en el
              ancho más justo, y eso no es un problema: el titular no es
              accionable, así que no hay dos blancos compitiendo. El siguiente
              control de la columna (ContactoAside) queda a más de 100px.

              LA CÁPSULA LLENA EL ENVOLTORIO (w-full), así que su canto
              izquierdo cae en el margen del texto de la página -- x=24 en un
              teléfono de 390, el mismo eje en el que arrancan la caja del
              titular, el muestrario de abajo, la lista de color, el panel de
              servicios y el pie -- y su canto derecho se queda donde estaba,
              porque lo fija el ancho del envoltorio y ese no cambió. Solo creció
              hacia la izquierda: de 41.4px de ancho a 51-64 según el ancho de
              pantalla. La flecha se centra en la cápsula alargada
              (justify-center); antes el relleno px-3 la centraba por sí solo. */}
          <div className="regreso-titular">
            <Link
              href="/"
              aria-label="Atrás"
              className="relative inline-flex w-full items-center justify-center rounded-full border border-clay/20 bg-clay/10 px-3 py-1 text-shell-lift backdrop-blur-xl transition-colors duration-150 after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] hover:bg-clay/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
            >
              <span
                aria-hidden="true"
                className="inline-block text-base leading-none animate-[back-nudge_1.8s_ease-in-out_infinite]"
              >
                ←
              </span>
            </Link>
          </div>
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

        {/* EL MUESTRARIO DE TINTE, SOLO Y A TODO EL ANCHO.

            Es la misma clase .hair-swatch que estaba aquí -- mismo alto (h-2),
            mismo rounded-full, mismo degradado de los siete tokens y misma
            deriva lenta --. Lo que cambió es que el control de regreso se fue a
            la segunda línea del titular y la barra se quedó sola en la fila, así
            que ahora ocupa el ancho completo del bloque: de margen a margen,
            x=24 a 366 en un teléfono de 390, contra los 29 a 366 de antes.

            SE FUE EL ml-[5px]. Ese margen alineaba la fila con el eje óptico del
            titular, que es donde arranca la tinta de la "D". Con la barra a todo
            el ancho ya no aplica: lo que se pidió es de margen a margen del
            bloque, y el margen del bloque está 5px a la izquierda de ese eje.

            LA ANIMACIÓN NO DEPENDE DEL ANCHO y por eso el recorrido no se
            parte: desplaza `background-position` sobre un degradado dimensionado
            al 200% del elemento, así que el ciclo recorre exactamente dos veces
            el ancho de la barra, sea el que sea. Verificado en el reporte con
            dos fotogramas del ciclo.

            EL ENVOLTORIO CONSERVA LOS 26px de alto que tenía la fila cuando el
            control vivía aquí, con la barra centrada. No es un resto: es lo que
            mantiene la barra exactamente donde estaba (y=312.44 a 390px), que es
            lo que se pidió. */}
        <div className="mt-5 flex h-[1.625rem] items-center">
          <div
            aria-hidden="true"
            className="hair-swatch h-2 w-full rounded-full"
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
          <CategoriaCarta
            category={color}
            ocultarTitulo
            editorial
            // Sin superficie: los cuatro servicios de color se apoyan
            // directamente sobre la fotografía del layout. La segunda lista es
            // la que vive dentro del módulo de servicios.
            modulo={false}
          />

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
          <div className="relative -mt-14 -mx-6 min-w-0 lg:mx-0 lg:max-w-[32rem]">
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
              // -mx-6 EN MÓVIL: SIN ESTO EL SANGRADO NO LLEGA. El contenedor del
              // layout lleva px-6, cinco niveles más arriba, y eso dejaba el
              // módulo de x=24 a 366 en una pantalla de 390: entre el canto de
              // la foto lateral y el borde de la ventana quedaban 41.2px de
              // fondo visible -- medido --, y esa franja es la que hacía que el
              // recorte de las laterales se leyera como un corte y no como un
              // sangrado. Con el margen negativo la pista ocupa los 390 y quien
              // recorta las laterales es el borde de la pantalla.
              //
              // En lg no: ahí el módulo vive dentro de la columna derecha de la
              // retícula y su canto ES el eje del contenido.
              //
              // La tira de deriva se cambió por el carrusel de foco central:
              // una foto activa adelante, las vecinas detrás y un contador. Las
              // props de la tira (rellenoRiel, tarjeta, foco) ya no aplican y se
              // fueron; el de foco central resuelve su geometría solo, desde
              // globals.css.
              focoCentral
              visorClaro
              // La clave del almacenamiento local. No se cambia: renombrarla
              // borra los favoritos de todo el que ya tenga alguno.
              claveFavoritos="axel:galeria:favoritas"
              fisicaVisor
            />

            {/* ──────────────────────────────────────────────────────────────
                LA SALIDA A LA GALERÍA COMPLETA, DENTRO DEL HUECO QUE YA HABÍA.

                VA POSICIONADA Y NO EN FLUJO, y esa es la decisión que hace que
                la distancia entre el carrusel y el panel no se mueva ni un
                píxel: el botón no reserva sitio, se coloca DENTRO del hueco de
                48px que separa los dos bloques. En flujo habría entrado como un
                hijo más de la columna, con sus dos huecos de 56px, y habría
                empujado el panel 86px hacia abajo; compensarlo pedía dos
                márgenes negativos acoplados entre sí.

                CENTRADO EN EL HUECO: top-full lo apoya en el canto inferior del
                módulo del carrusel y el mt-[10px] lo baja a la mitad -- 10px de
                aire arriba, la cápsula de 28 y 10px de aire abajo --. Su área de
                toque de 44px se extiende 8px por lado, así que queda a 2px del
                canto del módulo y a 2px del panel: no toca ni las fotos del
                carrusel (sus botones acaban 48px más arriba) ni el primer
                renglón del panel (empieza 35px más abajo).

                CENTRADO HORIZONTALMENTE: el envoltorio sangra a los cantos de la
                pantalla en móvil, y su centro coincide con el del contenido
                (x=195 en un teléfono de 390), así que centrar aquí es centrar en
                la columna. En lg el envoltorio ES la columna.

                MATERIAL: la cápsula de contorno del sitio (.pastilla-contorno),
                la misma de "Conóceme más" y de "Agenda tu cita" -- borde de
                crema al 62%, velo de crema al 8% y desenfoque de fondo --. No se
                reinventa aquí: es el material único de los secundarios, y es lo
                que la deja subordinada al panel y sin competir con el botón de
                WhatsApp, que es el único sólido de la página.

                ALTO 28px, el mínimo que deja tocarla con comodidad: el área real
                son 44px, que es el suelo del proyecto, y los 16 que faltan los
                pone el ::after fuera de la caja, así que no engordan el hueco.

                EL TEXTO ESTÁ PENDIENTE DE APROBACIÓN. Va "Todos mis trabajos"
                como provisional -- primera persona, la voz del sitio, tres
                palabras -- y las otras opciones están en el reporte. El copy es
                decisión de marca.
                ────────────────────────────────────────────────────────────── */}
            {/* EL BOTÓN VA CENTRADO Y AL ANCHO DE SU CONTENIDO. Hubo una
                versión extendida de canto a canto del panel y se retiró: como
                barra competía con el panel de abajo, y lo que se busca es una
                pieza contenida. El envoltorio ocupa el ancho disponible y solo
                sirve para centrarla; su centro coincide con el de la columna
                (x=195 en un teléfono de 390) tanto en móvil -- donde el
                envoltorio del carrusel sangra a los cantos de la pantalla --
                como en lg, donde es la columna con su tope de 32rem.

                mt-3 lo acerca a las fotos: 12px por debajo del canto del módulo
                en vez de 24, o sea 42.4px desde la foto más baja contra los 54.4
                de antes. No baja de 12 porque su área de toque se extiende 10px
                por arriba: con menos, el toque entraría en la caja de la pista
                del carrusel. */}
            <div className="absolute inset-x-0 top-full mt-3 flex justify-center">
              {/* EL LOCKUP: "ver" y "trabajos" en versalita espaciada de cuerpo,
                  "más" en la display serif, en caja baja, un paso más grande y
                  a tono pleno. El contraste entre las dos voces es lo que le da
                  el carácter; el tamaño de la serif es solo un paso porque la
                  Bodoni tiene la altura de x más baja que la Jost y a igual
                  cuerpo se leería más pequeña.

                  items-baseline y NO items-center: las tres palabras se sientan
                  en la misma línea base, que es lo que las hace leerse como una
                  unidad y no como tres piezas apiladas ópticamente. Por eso el
                  alto no se fija con h-7 sino con el relleno: con altura fija,
                  un grupo alineado por línea base se pega al canto superior de
                  la caja en vez de centrarse.

                  El texto va al 70% y "más" al 100%: el tono discreto que se
                  pidió para las mayúsculas, y la serif como la pieza clara. */}
              <Link
                href="/galeria"
                className="pastilla-contorno relative flex items-baseline justify-center gap-1.5 rounded-full px-4 py-1 after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shell-lift!"
              >
                <span className="text-[11px] uppercase tracking-[0.22em] text-shell-lift/70">
                  Ver
                </span>
                <span className="font-display text-[0.9375rem] leading-none tracking-[-0.02em] text-shell-lift">
                  más
                </span>
                <span className="text-[11px] uppercase tracking-[0.22em] text-shell-lift/70">
                  trabajos
                </span>
                <span
                  aria-hidden="true"
                  className="ml-0.5 text-xs leading-none text-shell-lift/70"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────
              EL MÓDULO DE SERVICIOS: UNA TARJETA CERRADA, HECHA MIDIENDO UNA
              REFERENCIA.

              Quinta versión de esta pieza. El historial importa para no dar
              vueltas: tres tarjetas apiladas, una superficie de vidrio con
              contorno de clay, un panel de dos zonas con filo perimetral, una
              composición abierta sin caja, y esta. La diferencia es que esta no
              sale de interpretar una descripción sino de medir una imagen de
              referencia: radio, degradado del contorno lado por lado, altos de
              franja, sangría de los divisores y extensión de la veladura están
              tomados de ahí y documentados en globals.css.

              QUÉ LA ESTRUCTURA. Un panel con radio de 24px y un contorno de 1px
              que CIERRA los cuatro lados, más luminoso en el costado izquierdo y
              en la esquina superior izquierda y atenuándose hacia la derecha y
              hacia abajo sin apagarse. Dentro, tres franjas separadas por
              divisores que se desvanecen en sus extremos. El cristal ahumado
              deja pasar el grano de la fotografía: el desenfoque es de 4px y no
              de 10 justamente para eso.

              LO QUE SE DESMONTÓ de la versión abierta: la línea de marfil en
              cuatro tramos, la lámina con máscara vertical y horizontal, el
              cálculo que ataba el final del tramo vertical a la altura de la
              flecha y el token --trat-fila del que dependía.

              LO QUE SE CONSERVA: el acordeón con su cheurón y su panel
              desplegable, los precios en el eje derecho, el ancho y los
              márgenes del bloque, y el aire con el carrusel de arriba y con el
              pie de abajo.
              ────────────────────────────────────────────────────────────── */}
          {/* EL MÓDULO SUBE. El hueco con el carrusel eran 64px -- los 56 del gap
              de la columna, menos los 8 de este margen, más los 16 que el propio
              módulo traía de mt-4 -- y se leía como un hueco muerto: el canto
              inferior del carrusel ya no es una foto ni el contador, es el
              relleno que la pista reserva para el glow, así que a esos 64 hay
              que sumarles otros 48 de aire visual. Ahora son 32: se quitó el
              mt-4 del módulo y este margen negativo pasa de 8 a 24. Del canto de
              la última foto al canto del panel siguen quedando 80px, que es más
              que suficiente para que se lean como dos bloques. */}
          {/* mt-1: el panel sube con el botón. Los 12px que el botón se acercó
              al carrusel se le restan aquí también, así que la distancia entre
              el botón y el canto del panel se conserva -- 20.5px medidos -- y el
              hueco del módulo al panel baja de 72 a 60. Este margen es lo único
              que queda de la compensación por el menguado del módulo: sin nada,
              el panel habría subido los 23.4px que el módulo perdió. */}
          <div className="mt-1">
            <CategoriaCarta
              category={CORTE_Y_ESTILO}
              ocultarTitulo
              editorial
              // El kicker de uso ("Toca para descubrir cada servicio") no se
              // repite: ya lo dice la lista de color arriba, y aquí el
              // encabezado del módulo es el rótulo.
              sinKicker
              rotulo="Servicios"
              // Ninguna fila arranca abierta: el acordeón es exclusivo POR
              // CATEGORÍA, así que con las dos listas abriendo su primer
              // servicio la página cargaba con dos paneles desplegados.
              abrirPrimero={false}
              zonaInferior={
                <Link
                  href="/menu/tratamientos"
                  // EL ANILLO DE FOCO VA POR DENTRO (-outline-offset), y no es
                  // cosmético: el panel lleva overflow-hidden -- es lo que
                  // recorta la veladura y el cristal con su radio -- y esta
                  // franja llega a los dos cantos, así que un anillo pintado
                  // fuera de su caja se recortaría. Las dos marcas de
                  // importancia son obligatorias: la regla global de
                  // :focus-visible de globals.css no está dentro de una capa y
                  // le gana a las utilidades, tanto en color como en
                  // desplazamiento.
                  className="zona-tratamientos group focus-visible:outline-2 focus-visible:-outline-offset-2! focus-visible:outline-shell-lift!"
                >
                  {/* EL RESPLANDOR TERRACOTA, y nada más: ni superficie, ni
                      contorno, ni radio. Va en su propia capa, por debajo del
                      texto, y su degradado muere antes de cualquier canto de su
                      caja -- las cuentas están en globals.css -- para que no
                      dibuje ninguna recta. */}
                  <span aria-hidden="true" className="zona-tratamientos-luz" />

                  {/* El contenido va posicionado para quedar por encima de la
                      veladura, que es una capa absoluta anterior en el árbol.
                      Sin sangría propia: la pone la franja. */}
                  <span className="relative block">
                    <span className="modulo-rotulo block">
                      Cuidado del cabello
                    </span>

                    {/* EL TÍTULO Y LA FLECHA. El título mide LO MISMO que los
                        nombres de los servicios, y eso viene de la referencia:
                        ahí la altura de mayúscula de "Tratamientos" y la de
                        "Corte dama" miden las dos 19.2 CSS. La versión anterior
                        lo subía un paso; se descarta.

                        La flecha arranca del título y su asta ocupa todo el
                        espacio hasta la punta, que cae en el canto interno
                        derecho del panel -- el mismo eje en el que acaban los
                        desplegables de la lista --. items-baseline para el
                        conjunto, y la flecha se centra por su cuenta
                        (align-self en su clase), que es lo que la deja a media
                        altura de x en vez de sobre la línea base. */}
                    <span className="mt-1.5 flex items-baseline gap-5">
                      <span className="shrink-0 font-display text-[1.625rem] font-medium tracking-[-0.056em] text-shell-lift min-[360px]:text-3xl">
                        Tratamientos
                      </span>

                      <span aria-hidden="true" className="flecha-linea">
                        <span className="flecha-linea-asta" />
                        {/* La punta mide 12x16 y no 9x14: en la referencia el
                            cheurón ocupa unos 13 CSS en los dos ejes. El asta
                            se queda en 1px, que es lo que mide ahí (3 píxeles de
                            imagen a escala 2.597). */}
                        <svg
                          viewBox="0 0 12 16"
                          fill="none"
                          className="flecha-linea-punta block h-4 w-3"
                        >
                          <path
                            d="M1.6 1.8L10.2 8L1.6 14.2"
                            stroke="currentColor"
                            strokeWidth="1.1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </span>
                  </span>
                </Link>
              }
            />
          </div>

          {/* ─────────────────────────────────────────────────────────────
              EL CIERRE: UN BLOQUE CONTENIDO.

              Hubo una versión en franja de ancho completo, sangrando a los dos
              cantos de la pantalla y opaca. Se retiró: vuelve a ser un bloque
              contenido, con las mismas esquinas y el mismo ancho que el panel
              de servicios, y lo que lo distingue de él no es la forma sino el
              MATERIAL -- superficie oscura y translúcida contra el vidrio claro
              del panel -- y la jerarquía de lo que lleva dentro.

              EL MISMO ANCHO QUE LOS OTROS DOS BLOQUES. Sin margen negativo y
              con el mismo tope de 32rem en escritorio, así que el bloque COLOR,
              el panel y este pie empiezan y acaban en el mismo eje. Las medidas
              están en el reporte.

              LA JERARQUÍA DE DENTRO, en dos pisos:

                - Arriba, la fila de servicio: "Conóceme más" a la izquierda con
                  su cápsula de contorno, y la ubicación alineada al canto
                  derecho en el mismo renglón. Debajo, la nota de precios, a la
                  izquierda.
                - Abajo, WhatsApp: una barra que ocupa el ancho completo del
                  bloque, en el tono cálido de marca, sin margen lateral. Sus
                  esquinas inferiores no las declara ella: las recorta el
                  overflow-hidden del bloque con el radio de la pieza, así que
                  acompañan a las del pie exactamente.

              El anillo de foco de la barra va POR DENTRO (-outline-offset con
              marca de importancia): el overflow-hidden recortaría lo que se
              pinte fuera de la caja, y además la regla global de :focus-visible
              fija el offset en 2px sin estar en una capa. Y pasa a crema,
              porque sobre un relleno de dune el dune-deep de la regla global no
              se ve.

              EL AIRE CON EL PANEL son 40px: los 56 del gap de la columna menos
              este margen negativo. Estuvo en 72 y era un hueco muerto -- el
              panel de arriba mide 319px de alto, así que 72 de aire eran casi un
              cuarto de su altura --. Sigue siendo mayor que los 32 que separan
              el carrusel del panel, y ese orden es deliberado: arriba se separan
              una tira de fotografías y una tarjeta, aquí dos tarjetas con canto
              propio, que necesitan un poco más de hueco para no leerse como una
              partida en dos.

              EL BLOQUE RESPIRA: sube 4px y vuelve, en ciclos de 8 segundos. La
              receta y el porqué de cada decisión -- que suba en vez de bajar,
              que la curva sea suave en los dos extremos y que vaya en
              `translate` -- están en globals.css (.pie-flota).

              EL VIDRIO ES OSCURO, y ese contraste con el vidrio claro del panel
              de arriba es lo que distingue los dos bloques. Costó tres intentos
              y el problema no estaba donde parecía, así que conviene dejarlo
              escrito.

              QUÉ HAY DETRÁS DEL PIE, MEDIDO CON LA PÁGINA OCULTA. El fondo
              compuesto en esa banda del viewport es rgb(39,16,6) con L=0.0084 y
              un recorrido de 21 niveles sobre 255. Detrás del panel de arriba es
              rgb(64,41,24) con L=0.0295 y 53 niveles. O sea: en el sitio donde
              cae el pie hay 3.5 veces menos luz y 2.5 veces menos textura que
              donde cae el panel. La causa es el velo del layout, un degradado de
              negro al 55% arriba y al 70% abajo: sin él, detrás del pie habría
              rgb(117,49,18) y 61 niveles de recorrido, o sea que ese velo se
              lleva dos tercios de la luz justo ahí.

              POR QUÉ LAS DOS PRIMERAS VERSIONES SE VEÍAN OPACAS. No era que
              faltara el desenfoque ni que hubiera una capa sólida encima: el
              backdrop-filter estaba aplicado y la superficie correlacionaba
              r=+0.94 con la fotografía. Era que de esos 21 niveles el velo del
              pie se quedaba con más de la mitad -- al 58%, la fotografía solo
              aporta el 42% de cada píxel -- y el desenfoque se llevaba otra
              parte. Quedaban unos 7 niveles de recorrido: matemáticamente hay
              fotografía detrás, pero no la ve nadie.

              LA CORRECCIÓN ES AMPLIFICAR EL FONDO, no adelgazar el velo. El
              backdrop-filter no solo desenfoca: `brightness` multiplica lo que
              hay detrás, y multiplica el RECORRIDO igual que la media, así que
              la textura de la fotografía crece en vez de diluirse. Con
              brightness 2.3 y el velo bajado a tierra 34%, el fondo entra
              amplificado y el velo lo devuelve al rango oscuro: el bloque sigue
              siendo mucho más oscuro que el panel, pero ahora se ve lo que hay
              detrás. Las cifras finales están en el reporte.
              ───────────────────────────────────────────────────────────── */}
          <footer className="pie-flota -mt-4 overflow-hidden rounded-[1.75rem] bg-tierra/34 backdrop-blur-[2px] backdrop-brightness-[2.3] lg:max-w-[32rem]">
            {/* El relleno lateral son los mismos 17px del panel, así que la
                cápsula, la ubicación y la nota comparten eje con los nombres de
                la lista de color y con el rótulo del panel. */}
            <div className="px-[17px] pt-5 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3">
                <ConoceMas className="gap-1.5! px-4! min-h-11!" />

                <p className="shrink-0 text-[11px] uppercase tracking-[0.25em] text-shell-lift/70">
                  {site.location}
                </p>
              </div>

              <p className="mt-4 text-[0.8125rem] leading-[1.35] text-shell-lift/70">
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
              className="block bg-dune px-4 py-4 text-center text-sm uppercase tracking-[0.18em] text-shell-lift transition-colors duration-150 hover:bg-dune-deep focus-visible:outline-2 focus-visible:-outline-offset-2! focus-visible:outline-shell-lift!"
            >
              Escríbeme por WhatsApp
            </a>
          </footer>

          {/* ─────────────────────────────────────────────────────────────
              LA FIRMA DE CIERRE. Lo último que se ve al terminar de recorrer la
              página, y no un bloque más: texto suelto sobre la fotografía, sin
              contenedor, sin superficie y sin contorno.

              DOS VOCES, UNA ORACIÓN CADA UNA. La primera en el cuerpo del sitio
              (Jost, 15px, crema al 60%) y la segunda en la display serif en
              oblicua, a 22px y crema al 95%. El salto es de 1.47 veces el cuerpo
              y de 35 puntos de tono, más el cambio de familia y de estilo: es
              ese contraste el que hace que la segunda línea se lea como la firma
              y la primera como su entrada. La primera subió de 13 a 15px para
              ganar presencia sin acercarse a la dominante: a 15 sigue midiendo
              el 68% del cuerpo de la segunda.

              UN SOLO BLOQUE DE DOS RENGLONES. El hueco de tinta entre las dos
              líneas era de 18.45px -- más que la altura de la tinta de la
              primera, 9.75 --, así que se leían como dos elementos y no como una
              frase partida. Ahora son 9.5: se quitaron los 6px de margen entre
              ellas y las dos pasaron a interlineado ajustado (1.25 en vez de
              1.625 y 1.375), que es lo que recorta el aire que cada caja de
              línea deja por dentro.

              LA CURSIVA ES OBLICUA SINTÉTICA. El proyecto carga Bodoni Moda solo
              en font-style normal, así que el navegador la cizalla. A 22px
              aguanta -- es el mismo recurso que usa el lockup del titular a
              50-60px --, pero no es la itálica real de la familia: esa existe en
              Google Fonts con su propio ángulo (-13) y traerla cambia la carga
              de fuentes de TODO el sitio, así que queda a decisión del PM. Está
              en el reporte.

              EL AIRE. 72px por arriba -- los 56 del gap de la columna más este
              mt-4 -- y 72 por abajo en móvil: los 24 de su mb-6, los 32 del pb-8
              de la columna y los 16 del pb-4 del contenedor del layout. Es el
              hueco más grande de la página por los dos lados, que es lo que la
              despega del pie y la deja respirar antes del final.

              UN SOLO <p> CON DOS BLOQUES: la unidad semántica es la frase
              completa; lo que cambia es dónde parte. Es el mismo patrón que la
              bajada del encabezado, y evita el <br /> -- con <br /> el equilibrio
              de línea de Chrome solo trabaja el segmento anterior al salto. */}
          <p className="mt-4 mb-6 text-center">
            <span className="block text-[0.9375rem] leading-tight text-shell-lift/60">
              Cada cabello tiene una historia.
            </span>
            <span className="block font-display text-[1.375rem] italic leading-tight tracking-[-0.02em] text-shell-lift/95">
              Quiero ser parte de la tuya.
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
