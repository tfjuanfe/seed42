import type { ModuleContent } from "../registry";
import { getModuleMeta } from "../registry";
import Hook from "./screens/01-hook.mdx";
import Reveal from "./screens/02-reveal.mdx";
import BuildReglas from "./screens/03-build-reglas.mdx";
import BuildEjemplos from "./screens/04-build-ejemplos.mdx";
import BuildColombia from "./screens/05-build-colombia.mdx";
import BreakIt from "./screens/06-break.mdx";
import Proyecto from "./screens/07-proyecto.mdx";
import Reflexion from "./screens/08-reflexion.mdx";

const content: ModuleContent = {
  meta: getModuleMeta("que-es-la-ia")!,
  screens: [
    { meta: { kind: "hook", title: "Toca y decide" }, Component: Hook },
    { meta: { kind: "reveal", title: "Ya lo hiciste" }, Component: Reveal },
    { meta: { kind: "build", title: "Reglas exactas" }, Component: BuildReglas },
    { meta: { kind: "build", title: "Aprender con ejemplos" }, Component: BuildEjemplos },
    { meta: { kind: "build", title: "La IA en tu bolsillo" }, Component: BuildColombia },
    { meta: { kind: "break", title: "Rompe tu criterio" }, Component: BreakIt },
    { meta: { kind: "project", title: "Tu proyecto" }, Component: Proyecto },
    { meta: { kind: "reflection", title: "En tus palabras" }, Component: Reflexion },
  ],
};

export default content;
