// Única fuente de verdad de precios del sitio.
// Los precios de color son rangos porque dependen del largo, del tipo de
// cabello y del estado en que llegue. El precio final se define en consulta,
// no se calcula en el sitio. Ningún número de precio se escribe en un
// componente — si aparece un precio hardcodeado en JSX, es un bug.
// Actualizar precios = editar este archivo.

export const LENGTHS: { id: string; label: string; reference: string }[] = [
  { id: "corto", label: "Corto", reference: "A la clavícula" },
  { id: "mediano", label: "Mediano", reference: "Al busto" },
  { id: "largo", label: "Largo", reference: "A la cintura alta" },
  { id: "extra", label: "Extra largo", reference: "A la cadera" },
];

export type Service = {
  slug: string;
  name: string;
  min: number;
  max: number;
  copy: string;
  note?: string;
};

export type Category = {
  slug: string;
  name: string;
  // Opcional: Color no lleva intro. Su aclaración de por qué el precio es un
  // rango vive dentro de cada tarjeta de rango (RANGE_NOTE), en contexto, y
  // repetirla aquí le restaba fuerza.
  intro?: string;
  services: Service[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "color",
    name: "Diseño de color",
    services: [
      {
        slug: "balayage",
        name: "Balayage",
        min: 3900,
        max: 7400,
        copy: "Ilumina tu melena con reflejos naturales. Renovemos tu look con un acabado degradado y luminoso, déjalo que brille.",
      },
      {
        slug: "babylight",
        name: "BabyLight",
        min: 3600,
        max: 4900,
        copy: "Suaves y localizados efectos de luz. El efecto no es por toda la cabeza, sino en zonas específicas para un toque sutil.",
      },
      {
        slug: "tinte-global",
        name: "Tinte global",
        min: 2600,
        max: 4400,
        copy: "Llegó el momento del color vibrante y duradero. Encontremos el tono perfecto para ti.",
      },
      {
        slug: "wavys",
        name: "Wavys",
        min: 1100,
        max: 2400,
        copy: "Consigue las ondas perfectas. Démosle volumen y movimiento a tu cabello sin dañarlo.",
      },
      {
        slug: "retoque",
        name: "Retoque",
        min: 2400,
        max: 2400,
        note: "Únicamente raíces de 1 a 4 cm",
        copy: "Mantén tu color parejo entre visitas, sin tocar el resto del largo.",
      },
      {
        slug: "corte-dama",
        name: "Corte dama",
        min: 890,
        max: 890,
        copy: "Renueva tu estilo a tu medida. Puedo diseñarlo adaptado a tu rostro o guiarme con tus preferencias.",
      },
    ],
  },
  {
    slug: "tratamientos",
    name: "Tratamientos",
    intro: "Precio único, sin importar tu largo.",
    services: [
      {
        slug: "antishock",
        name: "Antishock",
        min: 2100,
        max: 2100,
        copy: "Lo creé para ayudarte en esos momentos de terror con una melena lastimada o dañada.",
      },
      {
        slug: "hidratante",
        name: "Hidratante",
        min: 2100,
        max: 2100,
        copy: "Revitaliza y restaura la suavidad, el brillo y la salud de tu melena. Acabado sedoso y manejable.",
      },
      {
        slug: "reestructuracion",
        name: "Reestructuración",
        min: 2100,
        max: 2100,
        copy: "Repara y fortalece tu cabello desde el interior, restaurando su vitalidad y su brillo.",
      },
      {
        slug: "sellado-de-color",
        name: "Sellado de color",
        min: 1100,
        max: 1100,
        copy: "Protege la intensidad de tu color y prolonga su duración. Que se mantenga vibrante más tiempo.",
      },
      {
        slug: "ampolletas",
        name: "Ampolletas",
        min: 800,
        max: 800,
        copy: "Restauran la vitalidad y el brillo desde la raíz hasta las puntas.",
      },
    ],
  },
];

// Nota al pie de las tarjetas cuyo precio es un rango. Es la misma para las
// cuatro, así que vive aquí una sola vez en vez de repetirse servicio por
// servicio. Adaptada de la intro de la categoría Color ("El precio va por rango
// porque cada melena es distinta") para hablar de un servicio concreto y no del
// conjunto. Las tarjetas de precio fijo no la muestran: ahí sería falsa.
export const RANGE_NOTE =
  "Este precio va por rango porque cada melena es distinta: depende de tu largo, tu tipo de cabello y cómo llegue. El exacto lo definimos juntos.";

export function mxn(n: number): string {
  return n.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}
