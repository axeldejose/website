import Link from "next/link";
import { site, waLink } from "@/lib/site";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-0">
      <div>
        <p className="text-xs uppercase tracking-widest text-dune-deep">
          Hair artist · {site.location}
        </p>

        <h1 className="mt-4 font-display text-5xl text-tierra sm:text-6xl">
          Axel
          <br />
          <span className="italic text-dune-deep">De José</span>
        </h1>

        <p className="mt-6 max-w-xs text-casa">
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

          <li>
            <a
              href={site.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-between rounded-lg border border-clay bg-shell-lift/40 px-5 py-3 text-sm uppercase tracking-widest text-tierra transition-colors duration-150 hover:border-dune"
            >
              TikTok
              <span aria-hidden="true" className="text-dune">
                ↗
              </span>
            </a>
          </li>

          <li>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-between rounded-lg border border-clay bg-shell-lift/40 px-5 py-3 text-sm uppercase tracking-widest text-tierra transition-colors duration-150 hover:border-dune"
            >
              Instagram
              <span aria-hidden="true" className="text-dune">
                ↗
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
