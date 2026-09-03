"use client";

import { useRef } from "react";

// Botón "Conóceme más" + modal con la biografía completa de Axel.
// Usa el <dialog> nativo: showModal() da foco atrapado, cierre con Escape y
// devolución de foco al botón al cerrar de forma automática. El clic en el
// backdrop se cierra comparando el target con el propio <dialog>.
export function ConoceMas() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  const onBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) close();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="text-xs uppercase tracking-widest text-white transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
      >
        Conóceme más <span aria-hidden="true">→</span>
      </button>

      <dialog
        ref={dialogRef}
        onClick={onBackdropClick}
        aria-labelledby="bio-titulo"
        className="m-auto w-[min(92vw,32rem)] rounded-2xl bg-shell p-6 text-tierra backdrop:bg-black/50"
      >
        <div className="flex flex-col gap-4">
          <h2
            id="bio-titulo"
            className="text-xs uppercase tracking-widest text-dune-deep"
          >
            Axel De José
          </h2>

          <p className="text-sm leading-relaxed text-tierra">
            Soy estilista especialista en colorimetría capilar y diseño de
            color, reconocido como uno de los mejores coloristas de México tras
            mi participación en el reality show Style &amp; Colour Trophy México
            de L&apos;Oréal Professionnel. Mi paso por los laboratorios de
            L&apos;Oréal, en el Research &amp; Innovation Center, me enseñó a
            leer el cabello y los activos de los tratamientos, para calificar con
            precisión qué productos usar. Ya sea con cabello dañado por
            decoloraciones anteriores o buscando un diseño de color desde cero,
            logro un resultado suave, brillante y manejable. Cada cita es un
            servicio uno a uno: te escucho, te guío y te dedico toda mi atención,
            sin prisas ni interrupciones. Solo con cita previa.
          </p>

          <button
            type="button"
            onClick={close}
            className="self-end rounded-full bg-dune-deep px-5 py-2 text-sm text-shell transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
          >
            Cerrar
          </button>
        </div>
      </dialog>
    </>
  );
}
