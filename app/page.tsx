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
        src="/back9.webp"
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
        <div className="flex w-full justify-start px-6 pt-16 lg:w-1/2 lg:justify-start lg:self-start lg:pt-20">
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
        <div className="mx-2 flex min-h-[34dvh] flex-col justify-center gap-4 rounded-t-[2.5rem] border-t border-white/75 bg-dune/8 px-4 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-2xl lg:min-h-0 lg:justify-start lg:ml-auto lg:mr-12 lg:w-[420px] lg:self-center lg:rounded-3xl lg:border">
          <div className="pt-6 text-center">
            <p className="font-display text-xl leading-[1.1] tracking-tight text-shell-lift">
              Tu <span className="font-semibold italic">color de ensueño</span>
            </p>
            <p className="font-display text-xl leading-[1.1] tracking-tight text-shell-lift">
              empieza con un <span className="font-semibold italic">cabello sano.</span>
            </p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-shell-lift">
              Color Correction Specialist · Hair Damage Expert
            </p>
            <div className="mx-auto mt-2 h-px w-12 bg-white/30" />
            <p className="mt-2 text-xs text-shell-lift">
              ¿Qué te gustaría explorar?
            </p>
          </div>

          <nav aria-label="Secciones">
            <ul className="grid grid-cols-3 gap-2">
              <li>
                <Link
                  href="/menu"
                  className="group relative block aspect-square overflow-hidden rounded-lg border border-white/30 transition-opacity duration-150 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
                >
                  <Image
                    src="/tarjeta-diseno.png"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 130px, 33vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    style={{ animationDelay: "0s" }}
                    className="pointer-events-none absolute inset-0 bg-linear-115 from-transparent from-40% via-white/15 via-50% to-transparent to-60% animate-[card-shine_6s_ease-in-out_infinite_both]"
                  />
                  <div className="absolute inset-x-0 bottom-0 border-t border-white/40 bg-black/50 py-0.5 text-center backdrop-blur-3xl">
                    <span className="text-xs leading-tight text-shell-lift">
                      Diseño de Color
                    </span>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  href="/menu/tratamientos"
                  className="group relative block aspect-square overflow-hidden rounded-lg border border-white/30 transition-opacity duration-150 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
                >
                  <Image
                    src="/tarjeta-tratamientos.png"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 130px, 33vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    style={{ animationDelay: "1.5s" }}
                    className="pointer-events-none absolute inset-0 bg-linear-115 from-transparent from-40% via-white/15 via-50% to-transparent to-60% animate-[card-shine_6s_ease-in-out_infinite_both]"
                  />
                  <div className="absolute inset-x-0 bottom-0 border-t border-white/40 bg-black/50 py-0.5 text-center backdrop-blur-3xl">
                    <span className="text-xs leading-tight text-shell-lift">
                      Tratamientos
                    </span>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  href="/galeria"
                  className="group relative block aspect-square overflow-hidden rounded-lg border border-white/30 transition-opacity duration-150 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
                >
                  <Image
                    src="/tarjeta-galeria.png"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 130px, 33vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    style={{ animationDelay: "3s" }}
                    className="pointer-events-none absolute inset-0 bg-linear-115 from-transparent from-40% via-white/15 via-50% to-transparent to-60% animate-[card-shine_6s_ease-in-out_infinite_both]"
                  />
                  <div className="absolute inset-x-0 bottom-0 border-t border-white/40 bg-black/50 py-0.5 text-center backdrop-blur-3xl">
                    <span className="text-xs leading-tight text-shell-lift">
                      Galería
                    </span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex gap-2">
            <a
              href={waLink("Hola Axel, me gustaría agendar una cita.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[40px] flex-[3] items-center justify-center gap-1.5 rounded-full bg-dune-deep px-3 text-xs text-shell-lift transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dune-deep"
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
            <ConoceMas className="flex-[2]" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-shell-lift">{site.location}</span>

            <nav aria-label="Redes sociales">
              <ul className="flex items-center gap-3">
                <li>
                  <a
                    href={site.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Axel De José en TikTok"
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-shell-lift transition-colors duration-150 hover:text-white focus-visible:text-white"
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
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-shell-lift transition-colors duration-150 hover:text-white focus-visible:text-white"
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
