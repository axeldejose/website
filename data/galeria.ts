// GALERÍA DE TRABAJOS
//
// Las fotografías vienen del Instagram de Axel. Son 56: se prepararon 57 y
// trabajo-15 se retiró después, así que la numeración tiene un salto ahí. El
// hueco es deliberado y no se cierra: renombrar los archivos restantes para
// quitar un salto arriesga más referencias de las que arregla. Nada en el
// código deduce ids de un rango numérico -- las listas se construyen sobre
// ESTA lista, que es el manifiesto de lo que existe en public/galeria. Los archivos se prepararon
// en dos versiones (ver el reporte de preparación):
//
//   miniaturas/  640x800  q70  ~63 KB de media -> lo único que carga la página
//   completas/   960x1200 q78  ~160 KB de media -> solo al abrir el visor
//
// Las dos están recortadas a 4:5 con centro geométrico, así que la proporción
// es la misma en toda la galería y ni el carrusel ni el visor necesitan
// resolver alturas variables.
//
// El nombre de archivo ES el id. No hay más datos por foto que el texto
// alternativo: el orden de la lista es el cronológico de publicación, que es el
// único metadato que traían los nombres originales de la plataforma.

export type FotoGaleria = {
  id: string;
  alt: string;
};

export const GALERIA_ANCHO = 960;
export const GALERIA_ALTO = 1200;
export const MINIATURA_ANCHO = 640;
export const MINIATURA_ALTO = 800;

export function miniatura(id: string): string {
  return `/galeria/miniaturas/${id}.webp`;
}

export function completa(id: string): string {
  return `/galeria/completas/${id}.webp`;
}

// TEXTO ALTERNATIVO. Descripciones visuales, no técnicas: dicen qué se ve
// (encuadre, largo, tono) y no cómo se hizo. No se nombra la técnica --
// balayage, babylight, tinte -- porque desde la foto no se puede verificar cuál
// fue, y decirlo mal sería peor que no decirlo. PENDIENTE: que Axel las revise;
// él sí sabe qué servicio fue cada una y el alt es el lugar donde eso ayuda a
// quien no ve la imagen y también a las búsquedas.
export const GALERIA: FotoGaleria[] = [
  {
    id: "trabajo-01",
    alt: "De espaldas: melena larga castaña con las puntas aclaradas y ondas suaves.",
  },
  {
    id: "trabajo-02",
    alt: "De espaldas: melena larga en rubio miel con ondas marcadas.",
  },
  {
    id: "trabajo-03",
    alt: "De espaldas: melena larga y lisa, con raíz oscura y medios en castaño cálido.",
  },
  {
    id: "trabajo-04",
    alt: "De perfil: ondas rubias claras enmarcando el rostro.",
  },
  {
    id: "trabajo-05",
    alt: "De espaldas: melena larga castaña que aclara hacia las puntas, con ondas amplias.",
  },
  {
    id: "trabajo-06",
    alt: "De espaldas: degradado de castaño en la raíz a rubio en las puntas, ondulado.",
  },
  {
    id: "trabajo-07",
    alt: "De espaldas, con las manos en el cabello: melena rubia con raíz castaña.",
  },
  {
    id: "trabajo-08",
    alt: "De espaldas y de perfil: melena rubia ondulada con raíz castaña.",
  },
  {
    id: "trabajo-09",
    alt: "De espaldas: melena larga en rubio dorado cálido con ondas.",
  },
  {
    id: "trabajo-10",
    alt: "De perfil, con el rostro visible: melena larga castaña con reflejos claros.",
  },
  {
    id: "trabajo-11",
    alt: "De espaldas: melena rubia ondulada, más clara en los medios.",
  },
  {
    id: "trabajo-12",
    alt: "De espaldas: corte bob a la altura de la nuca, rubio y liso.",
  },
  { id: "trabajo-13", alt: "De perfil: melena en rubio dorado con ondas." },
  {
    id: "trabajo-14",
    alt: "De espaldas: melena larga en rubio ceniza con ondas.",
  },
  {
    id: "trabajo-16",
    alt: "De espaldas y de perfil: melena castaña con mechas rubias.",
  },
  {
    id: "trabajo-17",
    alt: "De espaldas: melena en castaño claro con ondas y puntas rubias.",
  },
  {
    id: "trabajo-18",
    alt: "De espaldas: melena larga rubia con reflejos finos de la raíz a las puntas.",
  },
  {
    id: "trabajo-19",
    alt: "De frente: melena en rubio cobrizo cayendo sobre el hombro.",
  },
  {
    id: "trabajo-20",
    alt: "De frente, con el rostro visible: rizos rubios sueltos.",
  },
  {
    id: "trabajo-21",
    alt: "De espaldas: melena larga en rubio caramelo con ondas.",
  },
  {
    id: "trabajo-22",
    alt: "De espaldas: cabello a media espalda en castaño cobrizo, ondulado.",
  },
  {
    id: "trabajo-23",
    alt: "De espaldas: melena larga en castaño oscuro con ondas amplias.",
  },
  {
    id: "trabajo-24",
    alt: "De espaldas: cabello a los hombros en castaño con puntas cobrizas.",
  },
  {
    id: "trabajo-25",
    alt: "Detalle: una mano levanta un mechón para mostrar las puntas rubias.",
  },
  {
    id: "trabajo-26",
    alt: "De perfil, con el rostro visible: raíz castaña y puntas en rubio claro.",
  },
  {
    id: "trabajo-27",
    alt: "De espaldas: cabello a media espalda en castaño cobrizo, ondulado.",
  },
  {
    id: "trabajo-28",
    alt: "De espaldas: melena larga castaña con ondas y reflejos cobrizos.",
  },
  {
    id: "trabajo-29",
    alt: "De espaldas: melena larga con las puntas en rubio ceniza.",
  },
  {
    id: "trabajo-30",
    alt: "De espaldas: melena rubia lisa con la raíz oscura.",
  },
  {
    id: "trabajo-31",
    alt: "De perfil: melena larga en castaño oscuro con ondas.",
  },
  {
    id: "trabajo-32",
    alt: "De espaldas y de perfil: melena en castaño ceniza que aclara hacia el rubio.",
  },
  {
    id: "trabajo-33",
    alt: "De espaldas: melena larga en castaño cobrizo con ondas marcadas.",
  },
  {
    id: "trabajo-34",
    alt: "De espaldas: melena castaña con reflejos cobrizos.",
  },
  {
    id: "trabajo-35",
    alt: "De espaldas: melena larga con raíz oscura y puntas en rubio muy claro.",
  },
  {
    id: "trabajo-36",
    alt: "De perfil: melena en castaño ceniza con las puntas rubias.",
  },
  {
    id: "trabajo-37",
    alt: "De espaldas: melena larga en rubio claro con ondas.",
  },
  {
    id: "trabajo-38",
    alt: "De espaldas: melena larga en castaño cálido con ondas amplias.",
  },
  {
    id: "trabajo-39",
    alt: "De perfil: cabello a los hombros en cobrizo intenso.",
  },
  {
    id: "trabajo-40",
    alt: "De espaldas: melena larga en castaño ceniza con reflejos rubios.",
  },
  {
    id: "trabajo-41",
    alt: "De espaldas y de perfil: melena larga castaña con reflejos rubios.",
  },
  {
    id: "trabajo-42",
    alt: "De espaldas: melena larga con raíz en castaño ceniza y puntas rubias.",
  },
  {
    id: "trabajo-43",
    alt: "De frente, con el rostro visible: melena larga y lisa en rubio con raíz castaña.",
  },
  {
    id: "trabajo-44",
    alt: "De espaldas: melena larga rubia con reflejos finos.",
  },
  {
    id: "trabajo-45",
    alt: "De espaldas, con los brazos levantados: melena en castaño claro con ondas.",
  },
  { id: "trabajo-46", alt: "De perfil: melena en rubio cobrizo con ondas." },
  {
    id: "trabajo-47",
    alt: "De frente, con gafas: melena en castaño oscuro con mechas finas más claras.",
  },
  { id: "trabajo-48", alt: "De espaldas: cabello a media espalda en rubio." },
  {
    id: "trabajo-49",
    alt: "De espaldas: melena larga en rubio dorado de tono uniforme.",
  },
  {
    id: "trabajo-50",
    alt: "De espaldas, con los brazos levantados: melena en cobrizo encendido con ondas.",
  },
  {
    id: "trabajo-51",
    alt: "De frente, con el rostro visible: melena en castaño ceniza con reflejos rubios.",
  },
  {
    id: "trabajo-52",
    alt: "De espaldas, una mano sostiene el cabello: melena en castaño ceniza con puntas rubias.",
  },
  {
    id: "trabajo-53",
    alt: "De espaldas: melena larga en rubio ceniza frío con ondas.",
  },
  {
    id: "trabajo-54",
    alt: "De espaldas: melena larga en castaño claro con reflejos rubios.",
  },
  {
    id: "trabajo-55",
    alt: "De espaldas: melena larga en rubio ceniza con ondas.",
  },
  {
    id: "trabajo-56",
    alt: "De espaldas: melena larga en castaño oscuro ceniza.",
  },
  {
    id: "trabajo-57",
    alt: "De espaldas: melena larga en rubio cálido con ondas.",
  },
];

// SELECCIÓN DEL CARRUSEL: 14 de las 56, y el ORDEN importa tanto como la
// elección. El criterio y los números están en el reporte; en resumen:
//
// - VARIEDAD DE TONO. Medí L*, croma y ángulo de tono del cabello en
//   CIELAB, más el contraste interno (el rango de L* entre el percentil 10 y el
//   90, que es lo que delata si hay reflejos o si el tono es parejo). La
//   selección toma un representante de cada familia: cobrizo encendido (50),
//   rubio ceniza frío (53), rubio muy claro (35), dorado uniforme (49),
//   castaño oscuro (23 y 31), cobrizo medio (22 y 39), degradado de raíz
//   oscura a puntas rubias (06), dorado cálido (09) y contraste alto de
//   reflejos (04).
// - VARIEDAD DE ENCUADRE Y DE LARGO. No todas son la misma foto de espaldas:
//   hay tres con el rostro visible (20, 47, 04), un bob (12), dos a los
//   hombros o media espalda (22, 39) y una con los brazos levantados (50).
// - NINGUNA PAREJA SEGUIDA SE PARECE. El orden alterna familia de tono en cada
//   paso, incluida la costura del bucle: la última (04, rubio de contraste
//   alto) empalma con la primera (50, cobrizo).
//
// SUSTITUCIÓN DE trabajo-15. Esa foto se retiró del proyecto y su puesto lo
// tomó trabajo-04, elegida por cubrir el mismo hueco del criterio: rostro
// visible y contraste alto de reflejos. Medido sobre las que quedan, entre las
// fotos con rostro y encuadre holgado que no estaban ya en la selección, la 04
// es la de mayor contraste interno -- 58.1 de rango de L* entre los percentiles
// 10 y 90, contra 57.6 de la 43, 56.9 de la 26 y 55.0 de la 10 --, y su tono
// (L* 46.3, croma 15.6) la mantiene distinta de las dos cobrizas que la rodean
// en la secuencia. La 19 tiene más contraste (62.1) pero es de encuadre ceñido
// y habría quedado pegada a la 50 en la costura del bucle.
// - LAS DE ENCUADRE CEÑIDO NO VAN CONSECUTIVAS. De las fotos que perdieron
//   entre 1 y 20% de lado al recortarse a 4:5, cinco están aquí: 50, 22, 31,
//   53 y 49, y quedan en las posiciones 1, 5, 7, 9 y 11 -- nunca dos seguidas,
//   ni en la costura del bucle.
export const SELECCION_CARRUSEL = [
  "trabajo-50",
  "trabajo-12",
  "trabajo-23",
  "trabajo-35",
  "trabajo-22",
  "trabajo-20",
  "trabajo-31",
  "trabajo-09",
  "trabajo-53",
  "trabajo-47",
  "trabajo-49",
  "trabajo-06",
  "trabajo-39",
  "trabajo-04",
];


// ═══════════════════════════════════════════════════════════════════════════
// ⚠️  CLASIFICACIÓN POR TONO — PROVISIONAL. CORREGIR ANTES DE PUBLICAR.  ⚠️
//
// ESTAS CATEGORÍAS NO SE MIRARON. El reparto de abajo es mecánico: se recorrió
// la lista en orden y se fue rotando entre las cinco categorías, una tras otra.
// NO corresponde al tono real de ninguna fotografía. Sirve únicamente para que
// el filtro de /galeria funcione y para que ninguna categoría quede vacía.
//
// QUIÉN LO CORRIGE Y CÓMO: Axel (o quien conozca los trabajos) revisa foto por
// foto y cambia el valor de la derecha. Los valores válidos son exactamente los
// cinco de CategoriaGaleria; cualquier otro rompe el build, que es justo lo que
// se quiere. El id de la izquierda no se toca: es el nombre del archivo.
//
// ESTE ES EL ÚNICO LUGAR DONDE VIVE LA CLASIFICACIÓN. Ni el tablero ni las
// pastillas de filtro saben nada de tonos: leen de aquí.
// ═══════════════════════════════════════════════════════════════════════════

export type CategoriaGaleria =
  | "rubios"
  | "cobrizos"
  | "caramel"
  | "castanos"
  | "negros";

// El orden de esta lista ES el orden en que salen las pastillas en pantalla.
// "Todos" no está aquí: no es una categoría, es la ausencia de filtro, y el
// tablero la trata aparte.
export const CATEGORIAS_GALERIA: {
  id: CategoriaGaleria;
  etiqueta: string;
}[] = [
  { id: "rubios", etiqueta: "Rubios" },
  { id: "cobrizos", etiqueta: "Cobrizos" },
  { id: "caramel", etiqueta: "Caramel" },
  { id: "castanos", etiqueta: "Casta\u00f1os" },
  { id: "negros", etiqueta: "Negros" },
];

// Están las 56, una por línea. El tipo valida el VALOR -- escribir "rubio" en
// vez de "rubios" rompe el build --, no el id: si a una foto se le borra la
// línea, esa foto deja de salir en cualquier filtro, pero sigue en "Todos".
export const CATEGORIA_POR_FOTO: Record<string, CategoriaGaleria> = {
  "trabajo-01": "rubios",
  "trabajo-02": "cobrizos",
  "trabajo-03": "caramel",
  "trabajo-04": "castanos",
  "trabajo-05": "negros",
  "trabajo-06": "rubios",
  "trabajo-07": "cobrizos",
  "trabajo-08": "caramel",
  "trabajo-09": "castanos",
  "trabajo-10": "negros",
  "trabajo-11": "rubios",
  "trabajo-12": "cobrizos",
  "trabajo-13": "caramel",
  "trabajo-14": "castanos",
  "trabajo-16": "negros",
  "trabajo-17": "rubios",
  "trabajo-18": "cobrizos",
  "trabajo-19": "caramel",
  "trabajo-20": "castanos",
  "trabajo-21": "negros",
  "trabajo-22": "rubios",
  "trabajo-23": "cobrizos",
  "trabajo-24": "caramel",
  "trabajo-25": "castanos",
  "trabajo-26": "negros",
  "trabajo-27": "rubios",
  "trabajo-28": "cobrizos",
  "trabajo-29": "caramel",
  "trabajo-30": "castanos",
  "trabajo-31": "negros",
  "trabajo-32": "rubios",
  "trabajo-33": "cobrizos",
  "trabajo-34": "caramel",
  "trabajo-35": "castanos",
  "trabajo-36": "negros",
  "trabajo-37": "rubios",
  "trabajo-38": "cobrizos",
  "trabajo-39": "caramel",
  "trabajo-40": "castanos",
  "trabajo-41": "negros",
  "trabajo-42": "rubios",
  "trabajo-43": "cobrizos",
  "trabajo-44": "caramel",
  "trabajo-45": "castanos",
  "trabajo-46": "negros",
  "trabajo-47": "rubios",
  "trabajo-48": "cobrizos",
  "trabajo-49": "caramel",
  "trabajo-50": "castanos",
  "trabajo-51": "negros",
  "trabajo-52": "rubios",
  "trabajo-53": "cobrizos",
  "trabajo-54": "caramel",
  "trabajo-55": "castanos",
  "trabajo-56": "negros",
  "trabajo-57": "rubios",
};
