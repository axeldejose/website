import { LENGTHS } from "@/data/services";

export function GuiaLargos() {
  return (
    <div>
      <h2 className="text-xs uppercase tracking-widest text-shell-lift/90">
        ¿Por qué el precio es un rango?
      </h2>

      <p className="mt-3 text-sm text-shell-lift/90">
        El costo de un servicio de color depende de tu largo, de tu tipo de
        cabello y de cómo llegue. Estos son los cuatro largos con los que
        trabajo. El precio exacto lo definimos juntos antes de empezar.
      </p>

      <ul className="mt-4 space-y-2">
        {LENGTHS.map((length) => (
          <li
            key={length.id}
            className="flex items-baseline justify-between gap-4 text-sm"
          >
            <span className="font-display text-shell-lift">{length.label}</span>
            <span className="text-shell-lift/90">{length.reference}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
