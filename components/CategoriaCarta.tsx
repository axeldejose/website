"use client";

import { useState, type ReactNode } from "react";
import type { Category } from "@/data/services";
import { ServiceRow } from "@/components/ServiceRow";
import { FilaEditorial } from "@/components/FilaEditorial";

type CategoriaCartaProps = {
  category: Category;
  // Oculta el nombre de la categoría cuando repetirlo no separa nada (p. ej.
  // una página con una sola categoría cuyo h1 ya lo dice). Subtítulo, kicker y
  // lista se mantienen.
  ocultarTitulo?: boolean;
  // Cambia las tarjetas de cristal por la estructura editorial de dos columnas
  // con regla vertical (FilaEditorial). Solo /menu la pide; /menu/tratamientos
  // sigue con ServiceRow.
  editorial?: boolean;
  // Oculta el kicker "Toca para descubrir cada servicio". Es una indicación de
  // uso de la página, no de la categoría: con dos cartas en la misma página se
  // repetía dos veces a media pantalla de distancia.
  sinKicker?: boolean;
  // Con true (por omisión) la categoría se pinta dentro del MÓDULO DE
  // SERVICIOS: la lámina de cristal ahumado, la línea de marfil que estructura
  // la composición y el cierre de Tratamientos que llega por `zonaInferior`.
  // Con false los renglones se apoyan directamente sobre la fotografía del
  // layout, sin superficie ni línea, que es lo que pide el bloque de color.
  //
  // Lo que NO cambia entre los dos: los divisores entre servicios, la
  // tipografía, los precios, los desplegables, el panel que se abre y el ancho
  // del bloque.
  modulo?: boolean;
  // Rótulo del módulo: la versalita que lo encabeza, arriba a la izquierda.
  // Cuando se pasa, sustituye al nombre de la categoría como encabezado visible
  // y como nombre accesible de la sección, y va con el registro de rótulo del
  // módulo (11px, versalita espaciada) en vez del de un título de categoría.
  //
  // /menu lo pide con "Servicios", que es lo que el módulo contiene: la
  // categoría se llama "Corte y estilo", pero aquí no se presenta como
  // categoría -- no hay otra al lado de la que distinguirla -- sino como la
  // lista de servicios de esa mitad de la página.
  rotulo?: string;
  // El cierre del módulo, debajo de la lista y dentro de la misma composición.
  // Se recibe como nodo y no se construye aquí porque no es parte de la
  // categoría: /menu mete ahí su salida a /menu/tratamientos.
  //
  // Solo tiene efecto en modo editorial con módulo.
  zonaInferior?: ReactNode;
  // Con false ninguna fila arranca abierta. El acordeón es exclusivo DENTRO de
  // cada categoría, así que con dos en la misma página y las dos abriendo su
  // primer servicio, /menu cargaba con dos paneles desplegados.
  abrirPrimero?: boolean;
};

export function CategoriaCarta({
  category,
  ocultarTitulo = false,
  editorial = false,
  sinKicker = false,
  modulo = true,
  rotulo,
  zonaInferior,
  abrirPrimero = true,
}: CategoriaCartaProps) {
  // Acordeón exclusivo: un solo servicio abierto a la vez dentro de la
  // categoría. Arranca con el primero abierto, salvo que se pida lo contrario.
  const [openSlug, setOpenSlug] = useState<string | null>(
    abrirPrimero ? (category.services[0]?.slug ?? null) : null,
  );

  const isColor = category.slug === "color";
  const headingId = `${category.slug}-heading`;
  // El encabezado visible: el rótulo del módulo si lo hay, el nombre de la
  // categoría si no está oculto, y nada en el resto de los casos.
  const encabezado = rotulo ?? (ocultarTitulo ? null : category.name);

  // Kicker editorial (nota discreta). En las categorías con intro va bajo ella,
  // a mt-4.
  //
  // En Color no hay intro ni encabezado de sección (se quitó por repetir lo que
  // dice la bajada): el kicker es lo único que hace de puente entre el bloque de
  // encabezado y la carta.
  //
  // En móvil ya no lleva margen propio: el hueco es solo el mt-4 del contenedor
  // de la columna, o sea 16px, contra los 32 que había cuando además llevaba su
  // mt-4. Se pidió acercarlo al encabezado, y ahora está a la misma distancia
  // del bloque de arriba (16px) que de la lista de abajo (el mt-4 del <ul>), así
  // que pertenece a los dos por igual en vez de flotar más cerca de la carta.
  // En lg no aplica (lg:mt-0) porque ahí esta columna es independiente y el
  // kicker abre en su borde superior, a la altura del titular del panel.
  //
  // EL TOPE DE ANCHO EN ESCRITORIO (solo en modo editorial, o sea solo en /menu)
  // es el mismo de las listas y del módulo, 32rem. Su texto mide 250px, así que
  // no cambia nada de lo que se ve; lo que iguala es la CAJA: medido a 1280, el
  // kicker ocupaba los 720px de la columna y las dos listas 512, así que las
  // tres piezas del bloque no acababan en el mismo eje. Ahora sí.
  const kicker = (
    <p
      className={`${isColor ? "lg:mt-0" : "mt-4"} ${editorial ? "lg:max-w-[32rem]" : ""} text-[11px] uppercase tracking-[0.25em] text-shell-lift/70`}
    >
      Toca para descubrir cada servicio
    </p>
  );

  // LA LISTA. Se arma antes del return porque en el módulo va envuelta y en el
  // resto va directa: es el mismo <ul> en los dos caminos, no dos copias.
  const lista = (
    <ul
      aria-label={ocultarTitulo ? undefined : category.name}
      className={
        editorial
          ? // EN EL MÓDULO los divisores no los pone divide-y sino globals.css,
            // porque son parte de la línea de marfil y comparten su tono: la
            // clase de la lista es la que engancha esas reglas. Fuera del
            // módulo -- la lista de color -- se queda divide-y, que dibuja la
            // regla solo entre servicios.
            modulo
            ? "modulo-servicios-lista"
            : "divide-y divide-shell-lift/15"
          : "mt-4 flex flex-col gap-3"
      }
    >
      {category.services.map((service, index) => {
        const alternar = () =>
          setOpenSlug((current) =>
            current === service.slug ? null : service.slug,
          );
        return editorial ? (
          <FilaEditorial
            key={service.slug}
            service={service}
            isOpen={openSlug === service.slug}
            onToggle={alternar}
          />
        ) : (
          <ServiceRow
            key={service.slug}
            service={service}
            index={index}
            beige={isColor}
            isOpen={openSlug === service.slug}
            onToggle={alternar}
          />
        );
      })}
    </ul>
  );

  return (
    <section
      aria-labelledby={encabezado ? headingId : undefined}
      aria-label={encabezado ? undefined : category.name}
    >
      {/* EL ENCABEZADO VA DENTRO DEL PANEL cuando es un rótulo, no encima: es
          la primera línea de la zona de servicios, no un título que flote
          fuera de la superficie. Por eso el <h2> del rótulo se pinta más
          abajo, dentro del contenedor, y aquí solo queda el caso del nombre de
          categoría. */}
      {encabezado && !rotulo && (
        <h2
          id={headingId}
          className="text-xl uppercase tracking-widest text-shell-lift"
        >
          {encabezado}
        </h2>
      )}

      {isColor && !sinKicker && kicker}

      {/* La intro es opcional: Color no la lleva. Con el título oculto el
          subtítulo ocupa el lugar del encabezado, sin margen superior, para
          conservar el mismo espacio bajo el separador. */}
      {category.intro && (
        <p
          className={`${ocultarTitulo ? "" : "mt-4"} text-sm text-shell-lift/90`}
        >
          {category.intro}
        </p>
      )}

      {!isColor && !sinKicker && kicker}

      {/* En editorial las filas van contiguas y divide-y pone la regla
          horizontal SOLO entre servicios (no arriba de la primera ni bajo la
          última). El gap-3 de las tarjetas desaparece: con separación entre
          filas la lista dejaría de leerse como un bloque continuo.

          lg:max-w-[32rem] no es una decisión de composición sino de contraste.
          Al quedar el precio alineado al canto derecho del bloque, en 1024-1200
          ese canto cae sobre la mitad visible de la rueda de colorimetría, y sin
          el cristal tintado que antes lo protegía el crema medía 2.46-2.49:1
          contra el mínimo AA de 4.5. El hueco libre más estrecho hasta la rueda
          es de 528px (a 1024). Con el tope en 512px el eje de cifras queda a 20px
          de la rueda ahí, y a 100-536px en el resto de los anchos. */}
      {/* EL MÓDULO ES UNA TARJETA CERRADA, construida midiendo una imagen de
          referencia: panel único con radio de 24px, contorno de 1px que cierra
          los cuatro lados y tres franjas separadas por divisores. El material
          -- el degradado del contorno, el cristal ahumado que deja pasar el
          grano, los divisores que se desvanecen en sus extremos y la veladura
          terracota -- está en globals.css (.modulo-servicios), con las medidas
          de la referencia que lo justifican.

          LA SANGRÍA (--sangria, 20px) NO ESTÁ AQUÍ: la ponen las piezas de cada
          fila desde globals.css, a los dos lados. Va ahí y no en un contenedor
          porque los divisores tienen que poder colocarse ellos mismos dentro de
          la sangría -- se pintan como fondo de la fila, no como borde -- y con
          el relleno en un contenedor no tendrían de dónde medir.

          lg:max-w-[32rem] no es una decisión de composición sino de contraste.
          Al quedar el precio alineado al canto derecho del bloque, en 1024-1200
          ese canto cae sobre la mitad visible de la rueda de colorimetría, y sin
          cristal tintado que lo proteja el crema medía 2.46-2.49:1 contra el
          mínimo AA de 4.5. El hueco libre más estrecho hasta la rueda es de
          528px (a 1024). Con el tope en 512px el eje de cifras queda a 20px de
          la rueda ahí, y a 100-536px en el resto de los anchos. */}
      {editorial && modulo ? (
        <div className="modulo-servicios lg:max-w-[32rem]">
          {/* EL CRISTAL AHUMADO, en su propia capa y por debajo de todo. */}
          <span aria-hidden="true" className="modulo-servicios-vidrio" />

          {/* El contenido va posicionado para quedar por encima de la lámina.
              El rótulo abre la primera franja arriba a la izquierda: pt-4 deja
              su tinta a 19.7px del canto interno, la misma distancia que hay del
              divisor a la tinta de los otros dos títulos, así que las tres
              franjas arrancan con el mismo aire. Estuvo en pt-5 y esos 3.7px de
              más se notaban al compactar el resto. */}
          <div className="relative">
            {rotulo && (
              <h2
                id={headingId}
                className="modulo-rotulo pt-4 px-[var(--sangria)]"
              >
                {rotulo}
              </h2>
            )}
            {lista}
          </div>

          {/* LA TERCERA FRANJA. Sin superficie ni contorno propios: su divisor y
              su veladura la separan de la segunda, y el radio del panel la
              recorta por abajo. */}
          {zonaInferior}
        </div>
      ) : (
        <div
          className={
            editorial
              ? // SIN MÓDULO, Y SIN RELLENO LATERAL. Aquí hubo un px-[17px] y era
                // un resto del panel que este bloque ya no tiene: cuando se le
                // quitó la superficie, se le puso el mismo relleno que llevaba
                // por dentro -- 16px del px-4 más el pelo del contorno -- para
                // que los nombres no se movieran del eje que tenían DENTRO de
                // la superficie. El efecto era que el bloque entero quedaba 34px más
                // angosto que todo lo demás de la columna: medido a 390px, sus
                // renglones iban de x=41 a 349 mientras el kicker de encima y
                // el módulo de servicios de abajo iban de 24 a 366.
                //
                // Y no era solo cuestión de márgenes: con 308px en vez de 342,
                // la fila más ancha (Tinte global con su rango completo) no
                // cabía y se desbordaba 11.7px de su caja, que es por qué el
                // nombre y el precio se veían pegados.
                //
                // Sin relleno, los renglones ocupan la caja completa de la
                // columna: el nombre arranca en el margen izquierdo de la
                // página y el precio y el cheurón acaban en el derecho. El eje
                // del texto ya no coincide con el de los nombres DENTRO del
                // módulo, y es correcto que no coincida: una superficie tiene
                // sangría y el texto suelto no.
                "mt-4 lg:max-w-[32rem]"
              : ""
          }
        >
          {lista}
        </div>
      )}
    </section>
  );
}
