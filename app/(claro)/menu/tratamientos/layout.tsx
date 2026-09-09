import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// POR QUÉ ESTA RUTA VIVE EN UN GRUPO Y NO EN app/menu/
//
// `/menu/tratamientos` es la única pantalla del sitio con paleta clara, y eso
// es deliberado: mientras /menu es oscura y editorial de color, esta es
// luminosa y editorial de salud capilar.
//
// El problema es que app/menu/layout.tsx -- que /menu necesita tal como está --
// impone dos cosas incompatibles con eso: el fondo fijo OSCURO
// (/back-servicios.jpeg con un degradado de negro al 55-70%) y la retícula de
// dos columnas de su contenedor. Heredarlo obligaba a taparlo con otra capa
// encima y a cancelar su relleno con márgenes negativos sincronizados a mano:
// dos páginas acopladas por aritmética frágil, y la foto oscura descargándose
// con priority en una pantalla que nunca la muestra.
//
// La carpeta `(claro)` va entre paréntesis, así que NO entra en la URL: la ruta
// sigue siendo /menu/tratamientos, sin redirect y sin cambio para nadie. Lo que
// cambia es de qué layout cuelga. app/menu/page.tsx y app/menu/layout.tsx no se
// tocaron ni se movieron.
//
// El contenedor de abajo es una COPIA del de app/menu/layout.tsx, no una
// importación: mismas medidas (max-w-6xl, la retícula de 19rem + 1fr, los
// mismos rellenos) para que las dos pantallas compartan la caja, pero con vida
// propia. Es el mismo criterio con el que app/galeria/layout.tsx duplica el
// fondo de /menu en vez de extraerlo a un componente compartido.
//
// El `w-full` del contenedor no es decorativo y viene copiado a propósito: el
// <body> es un contenedor flex en columna, y sin él los márgenes automáticos
// del eje transversal anulan el estirado y la caja se dimensiona a fit-content
// en vez de a min(100%, 72rem).
// ─────────────────────────────────────────────────────────────────────────────

export default function TratamientosClaroLayout({
  children,
}: LayoutProps<"/menu/tratamientos">) {
  return (
    <>
      {/* EL FONDO. Fotografía fija a pantalla completa con un velo encima.

          CAMBIÓ LA IMAGEN Y CON ELLA EL PROBLEMA. La anterior era una persona
          con el rostro visible, así que el encuadre y los velos estaban
          calculados para dejarle la cara libre de interfaz y para proteger el
          texto solo en la columna donde vivía. back5tratamientos.jpeg es una
          textura orgánica -- pliegues dorados y crema, sin figura ni elementos
          reconocibles --, así que no hay nada que esquivar: no hace falta
          encuadre especial (object-center basta) ni la pantalla lateral ni la
          banda superior que protegían al texto de la melena.

          Quedan dos capas en vez de tres: un velo parejo que sube el piso de
          toda la pantalla y una pantalla sobre la columna del encabezado, que
          es donde vive la tinta pequeña. La textura conserva el dorado en el
          tercio derecho y de la ficha para abajo. Las cifras y por qué son esas
          están en globals.css. */}
      {/* `sizes="50vw"` PIDE LA MITAD DEL ANCHO Y NO EL ANCHO ENTERO, y es el
          desenfoque el que lo permite: con 26px de blur encima, la diferencia
          entre servir la imagen a 1200 de ancho o a 640 no se ve en ningún
          píxel. A cambio, en un teléfono de 390 con DPR 3 el navegador baja
          640w en vez de 1200w, así que el filtro -- la única pieza cara de
          todo el efecto -- trabaja sobre una cuarta parte de los píxeles. */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/back5tratamientos.jpeg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="trat-fondo-foto object-cover"
        />
        <div aria-hidden="true" className="trat-velo absolute inset-0" />
        <div aria-hidden="true" className="trat-velo-texto absolute inset-0" />
      </div>

      <div className="relative mx-auto min-h-dvh w-full min-w-0 max-w-6xl px-6 pt-8 pb-4 lg:grid lg:grid-cols-[19rem_1fr] lg:gap-16 lg:px-8 lg:pt-16">
        {/* ─── LAS GOTAS DEL ENCABEZADO ─────────────────────────────────────
            Van en z-index -1: por encima del fondo fijo (que está en -10) y por
            debajo de todo el contenido, que es estático y por tanto pinta
            delante de cualquier capa negativa.

            SUS COORDENADAS SON LAS DE ESTA COLUMNA, y las verticales del
            encabezado se pueden fijar en píxeles porque no dependen del alto de
            la pantalla: las manda el contenido. Las de más abajo no -- la carta
            se dimensiona con dvh y arrastra todo lo que le sigue --, así que
            esas dos gotas van ancladas a su sitio en el flujo y no aquí.

            SOLO EN MÓVIL. Las zonas libres se midieron en un viewport de 390;
            en escritorio la retícula reparte el espacio de otra forma y esas
            coordenadas dejarían de significar lo mismo. */}
        <div aria-hidden="true" className="trat-gotas lg:hidden">
          <span className="trat-gota trat-gota-1" />
          <span className="trat-gota trat-gota-2" />
          <span className="trat-gota trat-gota-3" />

          {/* ─── EL GRANO DE LOS EXTREMOS ────────────────────────────────
              Catorce gotas de 7 a 11px por los cantos y la banda superior.
              Estas SÍ pueden ir todas aquí, aunque la capa cubra el documento
              entero y las de más abajo caigan lejos del encabezado: sus
              verticales van en porcentaje del alto del contenedor, así que se
              reparten solas cuando la carta cambia de tamaño con el dvh. Las
              cuatro grandes no podían -- las suyas van en píxeles -- y por eso
              una de ellas sigue colgando de un ancla en el flujo.

              Sus coordenadas horizontales caben en el carril de 16px que deja
              la barra fija de WhatsApp por cada canto; el porqué está en
              globals.css. */}
          <span className="trat-gota trat-gota-mini trat-gota-m1" />
          <span className="trat-gota trat-gota-mini trat-gota-m2" />
          <span className="trat-gota trat-gota-mini trat-gota-m3" />
          <span className="trat-gota trat-gota-mini trat-gota-m4" />
          <span className="trat-gota trat-gota-mini trat-gota-m5" />
          <span className="trat-gota trat-gota-mini trat-gota-m6" />
          <span className="trat-gota trat-gota-mini trat-gota-m7" />
          <span className="trat-gota trat-gota-mini trat-gota-m8" />
          <span className="trat-gota trat-gota-mini trat-gota-m9" />
          <span className="trat-gota trat-gota-mini trat-gota-m10" />
          <span className="trat-gota trat-gota-mini trat-gota-m11" />
          <span className="trat-gota trat-gota-mini trat-gota-m12" />
          <span className="trat-gota trat-gota-mini trat-gota-m13" />
          <span className="trat-gota trat-gota-mini trat-gota-m14" />
        </div>

        {children}
      </div>
    </>
  );
}
