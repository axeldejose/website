"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Mechón del encabezado de /menu, con su entrada al cargar.
 *
 * Decorativo: aria-hidden en la ventana y alt vacío en la imagen. Todo su
 * encaje (la franja lateral, el recorte por el borde de la pantalla, la altura)
 * vive en .mechon-ventana, en globals.css; aquí solo está la entrada.
 *
 * POR QUÉ ESTO ES UN COMPONENTE DE CLIENTE, que era lo que quería evitar. La
 * animación no puede arrancar con la carga de la página: tiene que arrancar
 * cuando el bitmap está listo para pintarse. Medido con la red estrangulada y
 * la CPU a 1/4, el archivo del mechón termina de llegar mucho después del primer
 * pintado -- 760ms después en 4G rápido, 4.1s en 4G lento y 17.5s en 3G -- así
 * que una animación puramente en CSS, que empieza a contar con el documento,
 * habría terminado antes de que la imagen exista y el "aparece de golpe" seguiría
 * ahí igual. De ahí el enganche al evento load.
 *
 * El estado base de la imagen es el FINAL, no el inicial: sin JavaScript, o si
 * la imagen falla y este efecto nunca corre, el mechón se ve en su sitio y sin
 * animación. La clase solo añade la entrada.
 *
 * `complete` antes del listener: si la imagen viene de la caché puede estar
 * cargada antes de que hidrate, y entonces el evento load ya ocurrió y nunca
 * llegaría. Con el listener solo, la entrada se perdía justo en la segunda
 * visita.
 */
export function MechonEntrada() {
  const imagen = useRef<HTMLImageElement>(null);
  const [entra, setEntra] = useState(false);

  useEffect(() => {
    const el = imagen.current;
    if (!el) return;
    if (el.complete) {
      setEntra(true);
      return;
    }
    const alCargar = () => setEntra(true);
    el.addEventListener("load", alCargar);
    return () => el.removeEventListener("load", alCargar);
  }, []);

  return (
    <span
      aria-hidden="true"
      className="mechon-ventana pointer-events-none absolute overflow-hidden"
    >
      <Image
        ref={imagen}
        src="/mechon.webp"
        alt=""
        width={600}
        height={829}
        sizes="(min-width: 1024px) 15rem, 12rem"
        className={`absolute left-0 top-0 h-auto w-48 max-w-none lg:w-60 ${
          entra ? "mechon-entra" : ""
        }`}
      />
    </span>
  );
}
