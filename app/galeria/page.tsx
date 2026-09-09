import type { Metadata } from "next";
import Link from "next/link";

import { GaleriaTablero } from "@/components/galeria/GaleriaTablero";
import { CierreGaleria } from "@/components/galeria/CierreGaleria";

export const metadata: Metadata = {
  title: "Galería",
};

// COPY. El titular conserva el lockup y las palabras que ya tenía la página.
//
// LA BAJADA ES NUEVA. La anterior cerraba con "Cuéntame qué buscas y lo
// resolvemos juntos", que es LA MISMA frase que cierra la bajada de /menu.
// Ésta es propia de esta ruta y hace otra cosa: nombra el concepto -- tablero,
// no catálogo -- para decirle a la persona cómo mirar la página antes de que
// empiece a bajar, y convierte el gesto de explorar en algo con final.
const TITULAR = { primera: "Galería", segunda: "de trabajos" };
const BAJADA = [
  "Esto no es un catálogo, es un tablero.",
  "Quédate con la foto que no puedas dejar de ver.",
];

export default function GaleriaPage() {
  return (
    <>
      {/* ─── EL ENCABEZADO, EN CLARO ────────────────────────────────────────
          Conserva la construcción tipográfica que ya tenía: envoltorio
          inline-block, primera línea en redonda con peso 500, segunda en
          cursiva a 0.85em montada -0.22em sobre ella, interletrado -0.056em en
          las dos y el mismo clamp de cuerpo. Lo que cambia es la paleta -- tinta
          `tierra` sobre claro, contra el crema sobre oscuro de antes -- y que
          las piezas de apoyo se rehicieron para el fondo claro.

          AQUÍ NO VA EL -mr-[0.85em] DE /menu, y sigue sin ser un olvido: allá la
          segunda línea es más angosta que la primera y el margen negativo es lo
          único que la saca del envoltorio. Con "de trabajos" la relación se
          invierte -- la segunda es más ancha --, así que el envoltorio lo mide
          ella y el margen no tendría efecto. */}
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        {/* LA BARRA SUPERIOR. El regreso vuelve a ser una cápsula con la flecha
            y la palabra, como en /menu/tratamientos: una flecha sola no dice a
            dónde lleva. La regla se lleva el ancho sobrante. */}
        <nav aria-label="Navegación" className="flex items-center gap-3 pb-6">
          <Link href="/" className="gal-volver">
            <span aria-hidden="true" className="gal-volver-flecha">
              ←
            </span>
            Volver al inicio
          </Link>

          <span aria-hidden="true" className="gal-nav-regla" />
        </nav>

        <p className="gal-kicker">Trabajos reales</p>

        <h1 className="gal-titular mt-[7px] font-display text-tierra">
          <span className="inline-block">
            <span className="block font-medium leading-none tracking-[-0.056em]">
              {TITULAR.primera}
            </span>{" "}
            <span className="-mt-[0.22em] block text-right font-medium text-[0.85em] italic leading-none tracking-[-0.056em]">
              {TITULAR.segunda}
            </span>
          </span>
        </h1>

        {/* LA BAJADA. Dos oraciones, una por renglón, en el eje del titular. */}
        <p className="gal-bajada mt-[5px]">
          <span className="block">{BAJADA[0]}</span>
          <span className="block font-medium">{BAJADA[1]}</span>
        </p>

        <div aria-hidden="true" className="gal-remate mt-4" />
      </div>

      {/* ─── EL TABLERO ─────────────────────────────────────────────────────
          Fuera del contenedor del encabezado: se ciñe a sus propios cantos, más
          estrechos que el relleno de texto, para que el mosaico respire hasta
          cerca del borde sin llegar a tocarlo. */}
      <div className="gal-marco mt-10 lg:mt-14">
        <GaleriaTablero />
      </div>

      <CierreGaleria />
    </>
  );
}
