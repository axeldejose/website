import Link from "next/link";
import { site } from "@/lib/site";

// EL CIERRE DE /menu/tratamientos, en tres tiempos y de más aire a más acción.
//
// No reusa el pie de /menu y no podía: aquel es una lámina oscura flotante
// (bg-tierra/34 amplificando el fondo con backdrop-brightness) rematada por una
// franja dune sólida. Aquí sería el único elemento oscuro de la pantalla y
// rompería lo que la página entera sostiene.
//
//   1. La firma editorial. Texto suelto sobre el fondo, sin superficie.
//   2. La ventana de cierre, en el mismo vidrio claro de los cinco
//      tratamientos, para que el final se lea como parte del sistema y no como
//      un pie pegado al último bloque.
//   3. La barra fija de móvil, rematerializada en claro (vive en la página, no
//      aquí, porque va fija al viewport y no al flujo de esta pieza).
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
      <p className="trat-firma mt-14 text-center">
        <span className="block text-[0.9375rem] leading-[1.15] tracking-[0.06em] text-dune-deep">
          Tu cabello me dice qué necesita.
        </span>
        <span className="block font-display text-[1.65rem] italic leading-[1.02] tracking-[0.015em] text-dune-deep">
          Yo solo lo entiendo.
        </span>
      </p>

      {/* ─── 2. LA VENTANA DE CIERRE ───────────────────────────────────────
          REDISEÑADA. Antes era un contenedor con cinco cosas al mismo nivel --
          título, párrafo, botón, enlace, ubicación y nota de precios -- y sin
          jerarquía entre ellas: al leerla no se sabía qué había que hacer.

          DEJÓ DE TENER ACCIÓN PROPIA. El botón sólido de WhatsApp que vivía
          aquí duplicaba literalmente el de la barra fija, con el mismo texto y
          a menos de 90px de distancia. La única acción visible de la pantalla
          vuelve a ser la barra.

          SU TRABAJO AHORA ES OTRO: bajar la fricción de escribir. Mucha gente
          no contacta porque no sabe qué decir, así que la ventana no pide la
          acción -- de eso se encarga la barra -- sino que le quita el obstáculo:
          dice con qué empezar.

          TRES NIVELES DE LECTURA, y ninguno compite con otro:

            1. El titular, en la display serif. Lo que domina.
            2. Las tres pistas de qué contar. Es el contenido, y lo que resuelve
               el "no sé qué decir".
            3. Debajo de una regla: la navegación (el enlace al color) y, por
               último y agrupada, la información de referencia (ubicación y nota
               de precios). Esas dos últimas van juntas porque son la misma
               clase de dato -- contexto, no acción -- y estaban compitiendo por
               estar sueltas y al mismo tamaño que todo lo demás.

          LO DISCRETO SE CONSIGUE CON CUERPO Y AGRUPACIÓN, NO CON TONO. La
          tentación era aclarar la nota de precios, pero el texto pequeño sobre
          esta superficie ya va justo de contraste: bajarle el tono la habría
          sacado del mínimo AA. Baja de 13 a 11px y se agrupa con la ubicación;
          el tono se queda en `casa`. */}
      <div className="trat-ventana mt-7">
        {/* LA ZONA ALTA. Va con su propio relleno porque el pie de abajo tiene
            que llegar a los cantos de la ventana, y un relleno común se lo
            habría impedido. */}
        <div className="px-6 pt-6 pb-6 sm:px-8 lg:px-9 lg:pt-8">
          <p className="font-display text-[1.375rem] leading-snug tracking-tight text-dune-deep">
            El tuyo lo definimos hablando.
          </p>

          {/* LA ENTRADA Y LAS TRES PISTAS. Copy aprobada por el PM.

              La entrada dice primero quién decide -- "yo te digo cuál
              necesitas" -- y solo después pide algo. Ese orden es lo que le
              quita el peso de encima a la clienta antes de pedirle nada: no
              tiene que saber elegir, tiene que contar. El "solo" delante de
              "cuéntame" remata esa idea: lo que se le pide es poco. */}
          <p className="mt-3 text-sm leading-relaxed text-dune-deep">
            Yo te digo cuál necesitas. Solo cuéntame:
          </p>

          <ul className="trat-pistas">
            <li>Cómo sientes tu cabello últimamente</li>
            <li>Qué fue lo último que te hiciste</li>
            <li>Una foto, si tienes a la mano</li>
          </ul>
        </div>

        {/* ─── EL PIE, EN VIDRIO TERRACOTA ─────────────────────────────────
            Va a ancho completo de la ventana y sin esquinas propias: el
            `overflow: hidden` de .trat-ventana lo recorta contra su radio, así
            que cierra los dos cantos inferiores sin que haya dos curvas que
            cuadrar.

            LA REGLA DIVISORIA QUE HABÍA AQUÍ SE FUE. Separaba dos zonas que se
            veían iguales; ahora el cambio de superficie es el que separa, y una
            línea encima de ese cambio habría sido decir lo mismo dos veces. Lo
            que queda es el filo claro de un píxel del canto superior del pie,
            que es lo que dibuja el encuentro entre las dos superficies. */}
        <div className="trat-pie">
          {/* DE ENLACE SUBRAYADO A BOTÓN. Sobre el terracota, un enlace
              subrayado en el mismo terracota habría desaparecido; y un botón
              relleno habría competido con la barra fija de WhatsApp, que es la
              única acción sólida de la pantalla. De contorno claro y texto
              claro: se distingue del fondo sin disputarle el papel a la barra. */}
          {/* EL PAR DE BOTONES. Mismo tratamiento en los dos -- contorno
              claro, versalita espaciada y flecha -- para que se lean como una
              pareja y no como una acción con un apéndice. Alineados a la
              izquierda de la zona terracota y con un hueco que los separa sin
              soltarlos.

              `flex-wrap` es el seguro para pantallas muy estrechas: en un móvil
              estándar entran los dos en la misma línea (medido), y por debajo de
              ese ancho el segundo baja en vez de encimarse. */}
          <div className="trat-botonera">
            <Link href="/menu" className="trat-boton">
              Diseños de color
              <span aria-hidden="true" className="trat-boton-flecha">
                ↗
              </span>
            </Link>

            {/* Lleva a la portada, que es donde Axel se presenta. La biografía
                completa vive en el modal de components/ConoceMas.tsx, que es
                compartido con /menu y la landing y trae su propio tratamiento
                oscuro: reusarlo aquí habría significado o modificarlo o pelear
                con sus clases. Está reportado. */}
            <Link href="/" className="trat-boton">
              Sobre Axel
              <span aria-hidden="true" className="trat-boton-flecha">
                ↗
              </span>
            </Link>
          </div>

          <div className="trat-referencia">
            <p>{site.location}</p>
            <p>
              Precios en pesos mexicanos. Sujetos a cambios sin previo aviso.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
