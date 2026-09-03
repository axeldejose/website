import Image from "next/image";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { IconoSocial } from "@/components/IconoSocial";
import { Logo } from "@/components/Logo";
import { ConoceMas } from "@/components/ConoceMas";

export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Fondo completo: la foto cubre el viewport dentro del mismo contenedor;
          la landing es de una sola pantalla, sin scroll de página. */}
      <Image
        src="/back6.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Oscurecimiento del tercio superior: da contraste al logo blanco sobre
          la pared clara de la foto y se desvanece a transparente. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/50 to-transparent" />

      {/* Respaldo de contraste para el texto claro del panel: sube desde el
          borde inferior y se desvanece hacia arriba. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/75 to-transparent" />

      <div className="relative z-10 flex min-h-dvh flex-col lg:flex-row">
        <div className="flex w-full justify-center px-6 pt-16 lg:w-1/2 lg:justify-center lg:self-start lg:pt-20">
          <h1>
            <Logo
              title="Axel De José"
              className="h-auto w-[200px] text-white lg:w-[240px]"
            />
          </h1>
        </div>

        <div className="flex-1 lg:hidden" />

        {/*
          Panel de cristal: blanco muy translúcido (white/12) + blur máximo
          simulan vidrio esmerilado transparente, sin capa de color. El texto
          va en claro y el contraste lo respalda el degradado inferior. Altura
          compacta de una sola pantalla; la bio larga vive ahora en un modal.
        */}
        <div className="flex min-h-[34dvh] w-full flex-col justify-center gap-3 rounded-t-[2.5rem] border-t border-white/75 bg-white/12 px-4 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] backdrop-blur-3xl lg:min-h-0 lg:justify-start lg:ml-auto lg:mr-12 lg:w-[420px] lg:self-center lg:rounded-3xl lg:border">
          {/* Presentación editorial de Axel: retrato vertical + nombre grande
              en font-display + eyebrow de especialidad. El texto completo se
              abre en un modal desde "Conóceme más". */}
          <div className="flex items-center gap-4 py-1">
            <Image
              src="/axel.webp"
              alt=""
              width={88}
              height={104}
              className="h-26 w-22 shrink-0 rounded-2xl object-cover object-[center_20%]"
            />
            <div className="flex flex-col">
              <span className="font-display text-2xl text-shell">
                Axel De José
              </span>
              <span className="mt-2 text-xs uppercase tracking-widest text-shell/60">
                Colorimetría y diseño de color
              </span>
              <div className="mt-4">
                <ConoceMas />
              </div>
            </div>
          </div>

          {/* Separador sutil entre la presentación y las miniaturas de menú. */}
          <div className="my-1 h-px w-full bg-white/15" />

          <nav aria-label="Secciones">
            {/* TODO: reemplazar /servicios.jpg por la foto definitiva de cada
                categoría (Diseño de Color, Tratamientos, Galería). Provisional
                en las tres. */}
            <ul className="grid grid-cols-3 gap-2">
              <li>
                <Link
                  href="/menu"
                  className="group relative block aspect-square overflow-hidden rounded-lg transition-opacity duration-150 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
                >
                  <Image
                    src="/servicios.jpg"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 130px, 33vw"
                    className="object-cover"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-2 text-xs leading-tight text-shell">
                    Diseño de Color
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/menu/tratamientos"
                  className="group relative block aspect-square overflow-hidden rounded-lg transition-opacity duration-150 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
                >
                  <Image
                    src="/servicios.jpg"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 130px, 33vw"
                    className="object-cover"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-2 text-xs leading-tight text-shell">
                    Tratamientos
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/galeria"
                  className="group relative block aspect-square overflow-hidden rounded-lg transition-opacity duration-150 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
                >
                  <Image
                    src="/servicios.jpg"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 130px, 33vw"
                    className="object-cover"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-2 text-xs leading-tight text-shell">
                    Galería
                  </span>
                </Link>
              </li>
            </ul>
          </nav>

          <a
            href={waLink("Hola Axel, me gustaría agendar una cita.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-dune-deep px-5 text-sm text-shell transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 shrink-0"
            >
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            Hablemos por WhatsApp
          </a>

          <div className="flex items-center justify-between">
            <span className="text-xs text-shell/70">{site.location}</span>

            <nav aria-label="Redes sociales">
              <ul className="flex items-center gap-3">
                <li>
                  <a
                    href={site.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Axel De José en TikTok"
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-shell transition-colors duration-150 hover:text-white focus-visible:text-white"
                  >
                    <IconoSocial red="tiktok" className="h-5 w-5" />
                  </a>
                </li>

                <li>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Axel De José en Instagram"
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-shell transition-colors duration-150 hover:text-white focus-visible:text-white"
                  >
                    <IconoSocial red="instagram" className="h-5 w-5" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
