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
    description: "Etiqueta 30 ejemplos, entrena un modelo en vivo y mira dónde falla",
    minutes: 30,
    available: false,
  },
  {
    number: 5,
    slug: "la-linea-que-predice",
    title: "La línea que predice",
    description: "Ajusta una línea a los precios de vivienda en Bogotá y compárala con la óptima",
    minutes: 30,
    available: false,
  },
  {
    number: 6,
    slug: "como-se-si-sirve",
    title: "¿Cómo sé si mi modelo sirve?",
    description: "Dos modelos con la misma precisión: decide cuál es peor y por qué",
    minutes: 30,
    available: false,
  },
  {
    number: 7,
    slug: "sesgo-y-responsabilidad",
    title: "Sesgo y responsabilidad",
    description: "Audita un modelo con sesgo y propón cómo arreglarlo",
    minutes: 30,
    available: false,
  },
  {
    number: 8,
    slug: "redes-sin-miedo",
    title: "Redes neuronales sin miedo",
    description: "Construye una red que separe una espiral y mira cómo se dobla la frontera",
    minutes: 30,
    available: false,
  },
  {
    number: 9,
    slug: "la-ia-que-habla",
    title: "La IA que habla",
    description: "Reta a un modelo de lenguaje, y atrápalo alucinando",
    minutes: 30,
    available: false,
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
