import Image, { type StaticImageData } from "next/image";

interface Props {
  src: StaticImageData;
  alt: string;
  caption: string;
  credit: string;
  priority?: boolean;
}

// Photographic figure in the field-notebook style: rounded card, hairline
// border, mono caption with the source credit. Photos are CC-licensed
// from Wikimedia Commons; the credit line is part of the license.
export function Figure({ src, alt, caption, credit, priority }: Props) {
  return (
    <figure className="flex flex-col gap-2 my-2">
      <div className="rounded-[var(--radius-card)] overflow-hidden border-hairline border">
        <Image
          src={src}
          alt={alt}
          priority={priority}
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, 720px"
          className="w-full h-auto max-h-[340px] object-cover"
        />
      </div>
      <figcaption className="flex items-baseline justify-between gap-3 text-label text-muted font-mono">
        <span>{caption}</span>
        <span className="shrink-0">{credit}</span>
      </figcaption>
    </figure>
  );
}
