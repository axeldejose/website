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
  intro: string;
  services: Service[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "color",
    name: "Color",
    intro: "El precio depende del largo de tu cabello. Dime el tuyo y te muestro cuánto sería.",
    services: [
      {
        slug: "balayage",
        name: "Balayage",
        min: 3100,
        max: 5900,
        copy: "Ilumina tu melena con reflejos naturales. Renovemos tu look con un acabado degradado y luminoso, déjalo que brille.",
      },
      {
        slug: "babylight",
        name: "BabyLight",
        min: 2900,
        max: 3900,
        copy: "Suaves y localizados efectos de luz. El efecto no es por toda la cabeza, sino en zonas específicas para un toque sutil.",
      },
      {
        slug: "tinte-global",
        name: "Tinte global",
        min: 2100,
        max: 3500,
        copy: "Llegó el momento del color vibrante y duradero. Encontremos el tono perfecto para ti.",
      },
      {
        slug: "wavys",
        name: "Wavys",
        min: 900,
        max: 1900,
        copy: "Consigue las ondas perfectas. Démosle volumen y movimiento a tu cabello sin dañarlo.",
      },
      {
        slug: "retoque",
        name: "Retoque",
        min: 1900,
        max: 1900,
        note: "Únicamente raíces de 1 a 4 cm",
        copy: "Mantén tu color parejo entre visitas, sin tocar el resto del largo.",
      },
      {
        slug: "corte-dama",
        name: "Corte dama",
        min: 750,
        max: 750,
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
        min: 1700,
        max: 1700,
        copy: "Lo creé para ayudarte en esos momentos de terror con una melena lastimada o dañada.",
      },
      {
        slug: "hidratante",
        name: "Hidratante",
        min: 1700,
        max: 1700,
        copy: "Revitaliza y restaura la suavidad, el brillo y la salud de tu melena. Acabado sedoso y manejable.",
      },
      {
        slug: "reestructuracion",
        name: "Reestructuración",
        min: 1700,
        max: 1700,
        copy: "Repara y fortalece tu cabello desde el interior, restaurando su vitalidad y su brillo.",
      },
      {
        slug: "sellado-de-color",
        name: "Sellado de color",
        min: 850,
        max: 850,
        copy: "Protege la intensidad de tu color y prolonga su duración. Que se mantenga vibrante más tiempo.",
      },
      {
        slug: "ampolletas",
        name: "Ampolletas",
        min: 650,
        max: 650,
        copy: "Restauran la vitalidad y el brillo desde la raíz hasta las puntas.",
      },
    ],
  },
];

export function mxn(n: number): string {
  return n.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });
}
