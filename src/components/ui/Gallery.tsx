import type { Gallery as GalleryType } from "@/lib/content/types";

/**
 * Lazy-loaded, editorially cropped grid. Only CMS galleries marked
 * “approved” reach this component.
 */
export function Gallery({ gallery }: { gallery: GalleryType }) {
  return (
    <section aria-label={gallery.title} className="border-t border-line pt-8">
      <h2 className="label-mono text-fg-muted">{gallery.title}</h2>
      <ul className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-3">
        {gallery.images.map((img, i) => (
          <li key={img.url} className={i % 5 === 0 ? "col-span-2 row-span-2" : ""}>
            <figure className="h-full">
              {/* eslint-disable-next-line @next/next/no-img-element -- Sanity CDN with width + format params */}
              <img
                src={`${img.url}?w=${i % 5 === 0 ? 1200 : 600}&auto=format&fit=max`}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                width={img.width}
                height={img.height}
                style={img.lqip ? { backgroundImage: `url(${img.lqip})`, backgroundSize: "cover" } : undefined}
                className="h-full w-full object-cover"
              />
              {img.caption ? <figcaption className="mt-1 label-mono text-fg-subtle">{img.caption}</figcaption> : null}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
