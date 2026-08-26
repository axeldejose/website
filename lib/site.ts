export const site = {
  name: "Axel De José",
  role: "Hair artist",
  tagline: "Mi trabajo es que te veas y te sientas increíble.",
  location: "Condesa, CDMX",
  url: "https://axeldejose.com",
  // TODO: placeholder — el número real de WhatsApp lo entrega el PM.
  whatsapp: "5215500000000",
  social: {
    tiktok: "https://www.tiktok.com/@axeldejose.hairartist",
    // TODO: verificar que este handle de Instagram exista.
    instagram: "https://www.instagram.com/axeldejose.hairartist",
  },
};

export function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
