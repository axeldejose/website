// EL FONDO CLARO DE /galeria. Es la segunda pantalla clara del sitio, junto con
// /menu/tratamientos, y eso es deliberado: la galería es exploración abierta,
// no carta de servicios.
//
// NO LLEVA FOTOGRAFÍA DE FONDO, y ahí se separa de tratamientos. Aquella tiene
// una textura desenfocada porque su contenido son cinco tarjetas sobre mucho
// aire; aquí el contenido son cincuenta y seis fotografías cubriendo casi toda
// la pantalla, y una imagen debajo competiría con ellas además de costar un
// desenfoque a pantalla completa que nadie llegaría a ver. El fondo es un
// degradado plano de la paleta: barato, quieto y sin nada que disputarle al
// tablero.
//
// SIGUE SIN CONTENEDOR HORIZONTAL, como antes: cada bloque resuelve su propio
// ancho. El encabezado y el cierre se ciñen a max-w-6xl y el tablero llega casi
// a los cantos.
export default function GaleriaLayout({ children }: LayoutProps<"/galeria">) {
  return (
    <>
      <div aria-hidden="true" className="gal-fondo fixed inset-0 -z-10" />

      <div className="min-h-dvh min-w-0 pt-8 pb-12 lg:pt-16">{children}</div>
    </>
  );
}
