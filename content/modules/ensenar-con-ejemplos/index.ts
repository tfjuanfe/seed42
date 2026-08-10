import type { ModuleContent } from "../registry";
import { getModuleMeta } from "../registry";
import Hook from "./screens/01-hook.mdx";
import Reveal from "./screens/02-reveal.mdx";
import Dificiles from "./screens/03-dificiles.mdx";
import PorDentro from "./screens/04-por-dentro.mdx";
import MasEjemplos from "./screens/05-mas-ejemplos.mdx";
import ExamenSorpresa from "./screens/06-examen-sorpresa.mdx";
import Proyecto from "./screens/07-proyecto.mdx";
import Reflexion from "./screens/08-reflexion.mdx";

const content: ModuleContent = {
  meta: getModuleMeta("ensenar-con-ejemplos")!,
  screens: [
    { meta: { kind: "hook", title: "Hoy el profesor eres tú" }, Component: Hook },
    { meta: { kind: "reveal", title: "Aprendizaje supervisado" }, Component: Reveal },
    { meta: { kind: "build", title: "Los ejemplos difíciles" }, Component: Dificiles },
    { meta: { kind: "build", title: "Ábrele la cabeza" }, Component: PorDentro },
    { meta: { kind: "build", title: "¿Cuántos ejemplos bastan?" }, Component: MasEjemplos },
    { meta: { kind: "break", title: "El examen sorpresa" }, Component: ExamenSorpresa },
    { meta: { kind: "project", title: "Entrena y diagnostica" }, Component: Proyecto },
    { meta: { kind: "reflection", title: "En tus palabras" }, Component: Reflexion },
  ],
};

export default content;
