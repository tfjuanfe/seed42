import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getModuleMeta,
  loadModuleContent,
  modules,
} from "@content/modules/registry";
import { Player } from "@/components/player/player";

export function generateStaticParams() {
  return modules.filter((m) => m.available).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/modulos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const meta = getModuleMeta(slug);
  return { title: meta?.title ?? "Módulo" };
}

export default async function ModulePage({
  params,
}: PageProps<"/modulos/[slug]">) {
  const { slug } = await params;
  const content = await loadModuleContent(slug);
  if (!content) notFound();

  const { meta, screens } = content;

  return (
    <Player meta={meta} screens={screens.map((s) => s.meta)}>
      {screens.map(({ Component }, i) => (
        <Component key={i} />
      ))}
    </Player>
  );
}
