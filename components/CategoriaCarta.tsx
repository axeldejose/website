import type { Category } from "@/data/services";
import { ServiceRow } from "@/components/ServiceRow";

type CategoriaCartaProps = {
  category: Category;
};

export function CategoriaCarta({ category }: CategoriaCartaProps) {
  return (
    <section aria-labelledby={`${category.slug}-heading`}>
      <div className="flex items-center gap-4">
        <h2
          id={`${category.slug}-heading`}
          className="shrink-0 text-xs uppercase tracking-widest text-dune-deep"
        >
          {category.name}
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-clay" />
      </div>

      <p className="mt-2 text-sm text-casa">{category.intro}</p>

      <ul className="mt-4">
        {category.services.map((service) => (
          <ServiceRow key={service.slug} service={service} />
        ))}
      </ul>
    </section>
  );
}
