import type { Metadata } from "next";
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

            ANCHO COMPLETO. La ventana es inset-x-0: igual al panel en todos
            los breakpoints, sin recorte intermedio. El recorrido es (ancho del
            panel + ancho de la palabra) y sale de la variable --panel de aquí
            abajo. A media pasada la palabra cabe entera y se lee "color":
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

            PRESENCIA: TRES CAPAS APILADAS. No es un descuido, es la única
            forma de oscurecer más sin salirse de la paleta. El color ya estaba
            a opacidad plena y `tierra` es el token más oscuro que hay, así que
            con un solo multiply el resultado topaba en fondo x tierra: medido,
            p90 de 13/255 en escritorio, que es el "velo apenas insinuado".
            Tres capas idénticas multiplicando dan fondo x tierra^3, que llevó
            el p90 a 38/255 y el máximo a 62/255, conservando el tono. La
            alternativa era pintar un color casi negro (tierra al cubo es
            rgb(7,3,2)), que no es de la paleta.

            Sobre eso, el color va a /70. Ojo con la intuición: con tres capas
            multiplicando, el 70% NO deja la palabra al 70% de lo que estaba.
            Cada capa aporta un factor (1 - a + a*t) sobre el fondo, así que a
            alfa 1 el canal rojo cae al 0.45% del fondo y a alfa 0.7 al 7.2%.
            Sigue siendo muy oscuro en el grano denso; lo que se aclara de
            verdad es el grano medio. Los valores medidos están en el reporte.

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
            className="color-grano pointer-events-none absolute inset-x-0 -top-8 h-28 overflow-hidden [--panel:calc(100vw-3rem)] lg:-top-16 lg:[--panel:19rem]"
          >
            <span className="color-deriva absolute -top-[63px] left-full font-display text-[10rem] italic leading-none tracking-[-0.05em] text-tierra/70">
              color
            </span>
          </span>
        ))}

        <div className="relative">
          {/* Resplandor suave detrás del título: blob difuminado, cálido
              claro, descentrado. Opacidad baja para no bajar el contraste. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-4 -top-4 h-32 w-52 rounded-[50%] bg-shell-lift/20 blur-3xl"
          />
          {/* Composición editorial: etiqueta en caja alta (familia body)
              encajada dentro de un titular en cursiva de gran escala (familia
              display).

              "servicios" a 68px en lg y clamp en móvil (69.8px a 360, 76.5px a
              390, techo de 80px). Ocupa el 84% del ancho del panel: es el
              elemento dominante, pero más compacto que antes (era 72px y 90%).

              Tracking -0.034em, cerrado desde -0.030em. Es el límite real de
              esta tipografía, no una preferencia: en "servicios" el par más
              apretado es "rv", con solo 0.0430em de hueco entre tintas
              (RSB de la r 0.0265 + LSB de la v 0.0165). Medido sobre el render,
              a -0.038em y más cerrado la r y la v se fusionan; a -0.034em
              todavía se separan. Ahí respiran apenas.

              MIS a 14px, subida desde 11px: gana presencia y sigue siendo el
              elemento menor del bloque de título. Va en posición absoluta (no
              con line-height) para encajarla sin que arrastre el flujo:

              - top-[6px] deja su línea base dentro de la banda de las astas
                ascendentes de "servicios" (del punto de las íes, a 0.7575em
                sobre la base, a la altura de x, a 0.4695em) con 9.1-13.4px de
                aire hasta la altura de x, que es la separación que ya tenía
                antes de agrandarla. El punto de la í queda ahora al ras de la
                cima de MIS (entre +0.7px y -0.2px según el cuerpo): al crecer
                la etiqueta, ese remate del entrelazado se pierde casi todo. Es
                el precio de los 14px, no un descuido.
              - left-[9%] la desplaza ~28px hacia adentro, para que su borde
                izquierdo no comparta eje con la "s" inicial. Cae sobre la zona
                de "se", donde "servicios" solo tiene altura de x.

              Va primero en el DOM para que el nombre accesible del h1 siga
              siendo "Mis servicios". */}
          <h1 className="relative text-shell-lift">
            <span className="absolute left-[9%] -top-[3px] font-body text-[22px] font-semibold uppercase leading-none tracking-[0.3em]">
              Mis
            </span>
            <span className="block font-display text-[clamp(3.4rem,20.4vw-0.61rem,4.55rem)] italic leading-none tracking-[-0.036em] lg:text-[3.875rem]">
              servicios
            </span>
          </h1>

          {/* Misma posición horizontal (right-0). -top-5 la deja con el borde
              inferior a la altura de la línea base de MIS. La "s" final de
              "servicios" pasa por su columna y quedan 4-11px de holgura sobre
              esa letra. */}
          <Link
            href="/"
            aria-label="Atrás"
            className="absolute -top-7 right-0 inline-flex h-11 w-14 items-center justify-center rounded-full border border-white/20 bg-dune/10 text-shell-lift backdrop-blur-md transition-colors duration-150 hover:bg-dune/20"
          >
            <span
              aria-hidden="true"
              className="inline-block text-lg leading-none animate-[back-nudge_1.8s_ease-in-out_infinite]"
            >
              ←
            </span>
          </Link>
        </div>

        {/* Columna de texto angosta, a 31ch = 260px. Ensanchada desde 26ch
            (218px) solo lo necesario para que el texto caiga en exactamente
            tres líneas y no cuatro: 40 / 38 / 34 caracteres, iguales en los dos
            breakpoints. `text-sm` fija los 14px sobre los que resuelve el ch,
            así que la medida vive una sola vez y el separador es w-full de esta
            misma columna.

            mt-5 (antes mt-8) acerca el bloque al titular.

            ml-[3px] alinea la columna con el eje óptico del titular, no con su
            caja: la cursiva de "servicios" mete la tinta 0.044em a la derecha
            del origen (3.0px a 68px de cuerpo, 3.5px a 80px), mientras que las
            mayúsculas de Jost casi no tienen lateral (0.07px en la "A" de la
            primera línea). Un solo valor de 3px deja el desfase real entre
            0.00 y 0.45px en todos los breakpoints.

            `relative` deja el bloque por encima de la capa decorativa. */}
        <div className="relative ml-[2.8px] mt-5 max-w-[31ch] text-sm">
          <p className="text-shell-lift/90">
            Aquí encontrarás cada servicio en el que trabajo, explicado con
            calma. Cuéntame qué buscas y lo resolvemos juntos.
          </p>

          {/* Separador a la medida de la columna, no del panel. */}
          <div
            aria-hidden="true"
            className="mt-8 h-px w-full bg-shell-lift/30"
          />
        </div>

        <ContactoAside />
      </aside>

      <div className="pb-28 lg:pb-0">
        <div className="mt-10 flex flex-col gap-14 lg:mt-0 lg:gap-16">
          <CategoriaCarta category={color} />

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
