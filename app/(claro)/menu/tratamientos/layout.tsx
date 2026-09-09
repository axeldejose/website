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
      {/* EL FONDO. La misma mecánica que /menu -- fotografía fija a pantalla
          completa con un velo encima -- pero invertida en tono: aquí el velo no
          oscurece, atenúa.

          La fotografía es un macro de gel sobre blanco, con brillos especulares
          y remolinos de mucho contraste local. A pelo, el texto oscuro cae
          justo encima de esos brillos y el vidrio esmerilado de las ventanas no
          tiene de dónde despegarse. El velo (.trat-velo, en globals.css) sube
          el piso a un blanco cálido parejo SIN apagarla: conserva la textura
          suficiente para que el desenfoque de las ventanas tenga algo que
          desenfocar. Las cifras están junto a la regla. */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/back3tratamientos.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden="true" className="trat-velo absolute inset-0" />
      </div>

      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-6xl px-6 pt-8 pb-4 lg:grid lg:grid-cols-[19rem_1fr] lg:gap-16 lg:px-8 lg:pt-16">
        {children}
      </div>
    </>
  );
}
