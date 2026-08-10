import type { ModuleContent } from "../registry";
import { getModuleMeta } from "../registry";
import Hook from "./screens/01-hook.mdx";
import Reveal from "./screens/02-reveal.mdx";
import Prompt from "./screens/03-prompt.mdx";
import EnTuCelular from "./screens/04-en-tu-celular.mdx";
import Limites from "./screens/05-limites.mdx";
import Cazador from "./screens/06-cazador.mdx";
import Proyecto from "./screens/07-proyecto.mdx";
import Reflexion from "./screens/08-reflexion.mdx";

const content: ModuleContent = {
  meta: getModuleMeta("la-ia-que-habla")!,
  screens: [
    { meta: { kind: "hook", title: "El control del caos" }, Component: Hook },
    { meta: { kind: "reveal", title: "Qué hay detrás del que habla" }, Component: Reveal },
    { meta: { kind: "build", title: "El prompt por piezas" }, Component: Prompt },
    { meta: { kind: "build", title: "Laboratorio en tu celular" }, Component: EnTuCelular },
    { meta: { kind: "build", title: "Ponle límites" }, Component: Limites },
    { meta: { kind: "break", title: "Cazador de alucinaciones" }, Component: Cazador },
    { meta: { kind: "project", title: "La cacería real" }, Component: Proyecto },
    { meta: { kind: "reflection", title: "En tus palabras" }, Component: Reflexion },
  ],
};

export default content;
