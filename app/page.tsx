import Image from "next/image";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { IconoSocial } from "@/components/IconoSocial";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Fondo completo. En móvil solo se ve por transparencia detrás del
          panel de cristal, en la mitad inferior. En escritorio cubre toda
          la pantalla, ya que la tarjeta superior se oculta ahí. */}
      <Image
        src="/back.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Solo aclara la zona detrás del panel de cristal (mitad inferior en
          móvil). La tarjeta superior es opaca y no la necesita. En
          escritorio vuelve a cubrir toda la pantalla, como antes de la
          tarjeta superior. */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/55 lg:inset-0 lg:h-auto" />

      {/* Tarjeta superior: opaca, tapa el overlay y el fondo en esa mitad.
          Solo existe en móvil — en escritorio la composición es la foto
          de fondo completa con el panel flotante. */}
      <div className="absolute inset-x-0 top-0 h-1/2 lg:hidden">
        <Image
          src="/card.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col lg:flex-row">
        <div className="flex w-full justify-center px-6 pt-16 lg:w-1/2 lg:justify-center lg:self-start lg:pt-20">
          <h1>
            <Logo
              title="Axel De José"
              className="h-auto w-[200px] text-tierra lg:w-[240px]"
            />
          </h1>
        </div>

        <div className="flex-1 lg:hidden" />

        {/*
          Panel de cristal: shell translúcido + blur simulan vidrio esmerilado.
          En móvil ocupa 50dvh fijo (no por contenido) y reparte el espacio
          sobrante con justify-evenly, con gap-6 como separación mínima. En
          escritorio vuelve a dimensionarse por contenido.
        */}
        <div className="flex h-[50dvh] w-full flex-col justify-evenly gap-6 rounded-t-[2.5rem] border-t border-white/60 bg-shell/25 px-6 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))] backdrop-blur-3xl lg:h-auto lg:justify-start lg:ml-auto lg:mr-12 lg:w-[420px] lg:self-center lg:rounded-3xl lg:border">
          <nav aria-label="Enlaces principales">
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/menu"
                  className="flex min-h-11 items-center gap-4 rounded-lg border border-clay bg-shell/50 px-4 py-3 text-sm uppercase tracking-widest text-tierra transition-colors duration-150 hover:border-dune-deep"
                >
                  <Image
                    src="/servicios.jpg"
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                  />
                  <span className="flex-1 text-center">Mis servicios</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/menu/tratamientos"
                  className="flex min-h-11 items-center justify-center rounded-lg border border-clay px-4 py-3 text-sm uppercase tracking-widest text-tierra transition-colors duration-150 hover:border-dune-deep"
                >
                  Tratamientos
                </Link>
              </li>

              <li>
                <a
                  href={waLink("Hola Axel, me gustaría agendar una cita.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center justify-center rounded-lg border border-clay px-4 py-3 text-sm uppercase tracking-widest text-tierra transition-colors duration-150 hover:border-dune-deep"
                >
                  Hablemos por WhatsApp
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center justify-between">
            <span className="text-sm text-casa">{site.location}</span>

            <nav aria-label="Redes sociales">
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
        </div>
      </div>
    </div>
  );
}
