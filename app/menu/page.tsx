import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/data/services";
import { CategoriaCarta } from "@/components/CategoriaCarta";
import { ContactoAside } from "@/components/ContactoAside";
import { GuiaLargos } from "@/components/GuiaLargos";

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

            Decorativo: aria-hidden aquí y alt vacío en la imagen. */}
        <span
          aria-hidden="true"
          className="mechon-ventana pointer-events-none absolute overflow-hidden"
        >
          <Image
            src="/mechon.webp"
            alt=""
            width={600}
            height={829}
            sizes="(min-width: 1024px) 15rem, 12rem"
            className="absolute left-0 top-0 h-auto w-48 max-w-none lg:w-60"
          />
        </span>

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

        {/* FILA DE LA REGLA Y EL REGRESO.

            La regla es marca de sección, no divisor: 4rem = 64px (un 25% de los
            260px de la columna de texto), con cuerpo -- 3px contra el 1px de
            antes -- y en `dune`, el acento cálido de la paleta. El ml-[5px] y el
            mt-5 son los que tenía cuando vivía dentro de la columna de texto,
            así que arranca en el mismo eje óptico del titular y de la bajada y
            conserva sus 20px de aire por arriba. Salió de esa columna solo para
            poder compartir fila con el botón; nada más cambió de sitio.

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
          <div aria-hidden="true" className="h-[3px] w-16 shrink-0 bg-dune" />
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
        </div>

        <ContactoAside />
      </aside>

      {/* `relative` porque la capa decorativa ahora abarca el viewport y le
          pasa por encima en el eje y=0..112: al ser un elemento posicionado y
          posterior en el DOM, esta columna vuelve a pintar por delante. */}
      <div className="relative pb-28 lg:pb-0">
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

          <GuiaLargos />

          <Link
            href="/menu/tratamientos"
            className="flex min-h-11 items-center justify-between rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm uppercase tracking-widest text-shell-lift backdrop-blur-sm transition-colors duration-150 hover:bg-white/20"
          >
            Ver tratamientos
            <span aria-hidden="true">→</span>
          </Link>

          <div className="border-t border-white/20 pt-6 text-sm text-shell-lift/90">
            <p>Precios en pesos mexicanos.</p>
            <p>Sujetos a cambios sin previo aviso.</p>
          </div>
        </div>
      </div>
    </>
  );
}
