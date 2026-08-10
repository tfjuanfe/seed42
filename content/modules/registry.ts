import type { ComponentType } from "react";

export type ScreenKind =
  | "hook"
  | "reveal"
  | "build"
  | "break"
  | "project"
  | "reflection";

export interface ScreenMeta {
  kind: ScreenKind;
  title: string;
}

export interface ModuleMeta {
  number: number;
  slug: string;
  title: string;
  description: string;
  minutes: number;
  available: boolean;
}

export interface ModuleContent {
  meta: ModuleMeta;
  screens: { meta: ScreenMeta; Component: ComponentType }[];
}

// The ten-module curriculum. Only modules with `available: true` have
// content; the rest render as "próximamente" on the index.
export const modules: ModuleMeta[] = [
  {
    number: 1,
    slug: "que-es-la-ia",
    title: "¿Qué es la IA?",
    description: "Clasifica lo que usas a diario y descubre qué separa una regla fija de algo que aprende",
    minutes: 30,
    available: true,
  },
  {
    number: 2,
    slug: "para-que-sirve",
    title: "¿Para qué sirve la IA?",
    description: "Opera los cuatro trabajos de la IA — predecir, clasificar, recomendar, generar — y desarma una app real",
    minutes: 30,
    available: true,
  },
  {
    number: 3,
    slug: "los-datos-son-todo",
    title: "Los datos son todo",
    description: "Envenena tu modelo de lluvia, caza datos rotos y limpia un dataset real de calidad del aire",
    minutes: 30,
    available: true,
  },
  {
    number: 4,
    slug: "ensenar-con-ejemplos",
    title: "Enseñar con ejemplos",
    description: "Entrena un moderador de comentarios con tus propias etiquetas y mira dónde hereda tus huecos",
    minutes: 30,
    available: true,
  },
  {
    number: 5,
    slug: "la-linea-que-predice",
    title: "La línea que predice",
    description: "Ajusta una línea a arriendos reales de Bogotá con tus pulgares y compárala con la óptima",
    minutes: 30,
    available: true,
  },
  {
    number: 6,
    slug: "como-se-si-sirve",
    title: "¿Cómo sé si mi modelo sirve?",
    description: "Desenmascara el 95 % de precisión, mueve umbrales y decide cuál de dos modelos es peor",
    minutes: 30,
    available: true,
  },
  {
    number: 7,
    slug: "sesgo-y-responsabilidad",
    title: "Sesgo y responsabilidad",
    description: "Atrapa a un modelo de becas discriminando, persigue los proxies y escribe la auditoría",
    minutes: 30,
    available: true,
  },
  {
    number: 8,
    slug: "redes-sin-miedo",
    title: "Redes neuronales sin miedo",
    description: "Entrena redes de verdad en tu navegador y véncelas contra el jefe final: la espiral",
    minutes: 30,
    available: true,
  },
  {
    number: 9,
    slug: "la-ia-que-habla",
    title: "La IA que habla",
    description: "Sube la temperatura, domina el prompt por piezas y caza alucinaciones reales",
    minutes: 30,
    available: true,
  },
  {
    number: 10,
    slug: "tu-primera-competencia",
    title: "Tu primera competencia",
    description: "Aplica todo lo anterior en tu primer reto real",
    minutes: 30,
    available: false,
  },
];

// Explicit loader map keeps each module's content in its own chunk.
const loaders: Record<string, () => Promise<{ default: ModuleContent }>> = {
  "que-es-la-ia": () => import("./que-es-la-ia"),
  "para-que-sirve": () => import("./para-que-sirve"),
  "los-datos-son-todo": () => import("./los-datos-son-todo"),
  "ensenar-con-ejemplos": () => import("./ensenar-con-ejemplos"),
  "la-linea-que-predice": () => import("./la-linea-que-predice"),
  "como-se-si-sirve": () => import("./como-se-si-sirve"),
  "sesgo-y-responsabilidad": () => import("./sesgo-y-responsabilidad"),
  "redes-sin-miedo": () => import("./redes-sin-miedo"),
  "la-ia-que-habla": () => import("./la-ia-que-habla"),
};

export function getModuleMeta(slug: string): ModuleMeta | undefined {
  return modules.find((m) => m.slug === slug);
}

export async function loadModuleContent(
  slug: string,
): Promise<ModuleContent | undefined> {
  const loader = loaders[slug];
  if (!loader) return undefined;
  return (await loader()).default;
}
