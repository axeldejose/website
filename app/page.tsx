import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { IconoSocial } from "@/components/IconoSocial";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-0">
      <div>
        <p className="text-xs uppercase tracking-widest text-dune-deep">
          Hair artist · {site.location}
        </p>

        <h1 className="mt-6">
          <Logo title="Axel De José" className="h-auto w-[70%] text-tierra lg:max-w-[380px]" />
        </h1>

        <p className="mt-8 max-w-xs text-casa">
          Mi trabajo es que te veas y te sientas increíble. Encontremos
          juntos el color y el corte que van contigo.
        </p>
      </div>

      <nav aria-label="Enlaces principales" className="mt-10 lg:mt-0">
        <ul className="flex flex-col gap-3">
          <li>
            <Link
              href="/menu"
              className="flex min-h-11 items-center justify-between rounded-lg bg-dune-deep px-5 py-3 text-sm uppercase tracking-widest text-shell transition-colors duration-150 hover:bg-dune"
            >
              Mis servicios
              <span aria-hidden="true">→</span>
            </Link>
          </li>

          <li>
            <Link
              href="/menu/tratamientos"
              className="flex min-h-11 items-center justify-between rounded-lg border border-clay bg-shell-lift/40 px-5 py-3 text-sm uppercase tracking-widest text-tierra transition-colors duration-150 hover:border-dune"
            >
              Tratamientos
              <span aria-hidden="true" className="text-dune">
                →
              </span>
            </Link>
          </li>

          <li>
            <a
              href={waLink("Hola Axel, me gustaría agendar una cita.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-between rounded-lg border border-clay bg-shell-lift/40 px-5 py-3 text-sm uppercase tracking-widest text-tierra transition-colors duration-150 hover:border-dune"
            >
              Hablemos por WhatsApp
              <span aria-hidden="true" className="text-dune">
                ↗
              </span>
            </a>
          </li>
        </ul>
      </nav>

      <nav aria-label="Redes sociales" className="mt-4 lg:mt-6">
        <ul className="flex items-center gap-3">
          <li>
            <a
              href={site.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Axel De José en TikTok"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-casa transition-colors duration-150 hover:text-dune-deep focus-visible:text-dune-deep"
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
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-casa transition-colors duration-150 hover:text-dune-deep focus-visible:text-dune-deep"
            >
              <IconoSocial red="instagram" className="h-5 w-5" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
