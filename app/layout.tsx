import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Tipografías provisionales hasta que el PM entregue las definitivas.
// Nombradas -google para no chocar con los tokens --font-display/--font-body
// de app/globals.css, que apuntan a estas variables.
const bodoniModa = Bodoni_Moda({
  variable: "--font-display-google",
  subsets: ["latin"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-body-google",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Axel De José — Hair artist en CDMX",
    template: "%s — Axel De José",
  },
  description:
    "Balayage, babylight, tinte y tratamientos de reparación. Precios claros según el largo de tu cabello. Agenda por WhatsApp.",
  openGraph: {
    locale: "es_MX",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Debe coincidir con --color-shell en app/globals.css (fondo del sitio).
  themeColor: "#e9dfc6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${bodoniModa.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
