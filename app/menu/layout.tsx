import Image from "next/image";

// La barra fija de WhatsApp ya no vive aquí. Estaba en este layout, compartido
// por /menu y /menu/tratamientos, y /menu la necesita EN FLUJO: su recuadro de
// cierre se une al botón por el canto inferior y con la barra fija no se puede
// -- una es fija al viewport y el otro se desplaza con la página. Así que el
// marcado se movió, sin cambiarlo, a cada pantalla:
//
//   /menu               -> dentro de la pieza del cierre, en app/menu/page.tsx
//   /menu/tratamientos  -> como barra fija, igual que estaba, en su propia página
//
// Es la única forma de darle a /menu lo que pide sin tocar el comportamiento de
// la otra ruta.

export default function MenuLayout({ children }: LayoutProps<"/menu">) {
  return (
    <>
      {/* Fondo fijo con foto + oscurecimiento, mismo lenguaje que la landing.
          Las cajas de cristal de cada fila quedan sobre esta imagen. */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/back-servicios.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-black/70" />
      </div>

      {/* w-full es imprescindible, no decorativo. El <body> es un contenedor
          flex en columna, y en un ítem flex los márgenes automáticos del eje
          transversal anulan el estirado: con solo `mx-auto` este contenedor se
          dimensionaba a fit-content en vez de a min(100%, 72rem). Medido, a
          1024 y a 1280px de viewport medía 912px en los dos casos -- centrado,
          con 56 y 184px de margen a cada lado -- en vez de 1024 y 1152.

          Eso rompía toda la aritmética que el sitio hace contra el viewport,
          que asume que el contenedor mide min(100vw, 72rem) centrado:

            - .mechon-ventana calcula su `right` con esa fórmula para que el
              mechón se corte exactamente en el canto de la pantalla. Con el
              contenedor 240px más estrecho, se pasaba: a 1280 su borde caía en
              x=1400 y la página ganaba 120px de desplazamiento horizontal.
            - La franja de la segunda sección de /menu resuelve su sangrado
              completo con la misma fórmula.

          Con w-full el contenedor vuelve a medir min(100%, 72rem) y las dos
          cuentas cierran. Efecto en /menu/tratamientos, que comparte este
          layout: en escritorio su composición pasa de 912 a min(100vw, 1152)px,
          que es el ancho que el diseño ya declaraba con max-w-6xl. */}
      <div className="mx-auto min-h-dvh w-full min-w-0 max-w-6xl px-6 pt-8 pb-4 lg:grid lg:grid-cols-[19rem_1fr] lg:gap-16 lg:px-8 lg:pt-16">
        {children}
      </div>
    </>
  );
}
