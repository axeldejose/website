import Image from "next/image";

// Mismo fondo que /menu: la fotografía fija con su oscurecimiento, para que las
// dos pantallas se sientan la misma casa. Va duplicado a propósito y no
// extraído a un componente compartido: /menu/layout.tsx además arma la retícula
// de dos columnas y la barra fija de WhatsApp, que aquí no aplican, y un
// componente que reciba todo eso por props sería más difícil de leer que estas
// doce líneas.
//
// La diferencia con /menu es el contenedor: aquí NO hay uno horizontal. El
// carrusel tiene que llegar a los cantos de la pantalla, así que cada bloque de
// la página resuelve su propio ancho -- el encabezado con su max-w-6xl, el
// carrusel a sangre --, y este layout solo aporta el fondo y el aire vertical.
export default function GaleriaLayout({ children }: LayoutProps<"/galeria">) {
  return (
    <>
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

      <div className="min-h-dvh min-w-0 pt-8 pb-16 lg:pt-16">{children}</div>
    </>
  );
}
