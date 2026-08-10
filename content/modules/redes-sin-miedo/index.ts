import type { ModuleContent } from "../registry";
import { getModuleMeta } from "../registry";
import Hook from "./screens/01-hook.mdx";
import Reveal from "./screens/02-reveal.mdx";
import Anillo from "./screens/03-anillo.mdx";
import Loss from "./screens/04-loss.mdx";
import Velocidad from "./screens/05-velocidad.mdx";
import Memorizar from "./screens/06-memorizar.mdx";
import Proyecto from "./screens/07-proyecto.mdx";
import Reflexion from "./screens/08-reflexion.mdx";

const content: ModuleContent = {
  meta: getModuleMeta("redes-sin-miedo")!,
  screens: [
    { meta: { kind: "hook", title: "Una neurona, en vivo" }, Component: Hook },
    { meta: { kind: "reveal", title: "La neurona sin maquillaje" }, Component: Reveal },
    { meta: { kind: "build", title: "El anillo imposible" }, Component: Anillo },
    { meta: { kind: "build", title: "El latido del error" }, Component: Loss },
    { meta: { kind: "build", title: "La perilla peligrosa" }, Component: Velocidad },
    { meta: { kind: "break", title: "La red tramposa" }, Component: Memorizar },
    { meta: { kind: "project", title: "El jefe final: la espiral" }, Component: Proyecto },
    { meta: { kind: "reflection", title: "En tus palabras" }, Component: Reflexion },
  ],
};

export default content;
