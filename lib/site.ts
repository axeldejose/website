export const site = {
  name: "Axel De José",
  role: "Hair artist",
  tagline: "Mi trabajo es que te veas y te sientas increíble.",
  location: "Condesa, CDMX",
  url: "https://axeldejose.com",
  whatsapp: "5215570715376",
  social: {
    tiktok: "https://www.tiktok.com/@axeldejose.hairartist",
    instagram: "https://www.instagram.com/axeldejose/",
  },
};

export function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
