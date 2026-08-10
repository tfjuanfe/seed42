import type { ModuleContent } from "../registry";
import { getModuleMeta } from "../registry";
import Hook from "./screens/01-hook.mdx";
import Reveal from "./screens/02-reveal.mdx";
import ArreglaSensor from "./screens/03-arregla-sensor.mdx";
import PuntoRaro from "./screens/04-punto-raro.mdx";
import AQuienPreguntaste from "./screens/05-a-quien-preguntaste.mdx";
import HuecoInvisible from "./screens/06-hueco-invisible.mdx";
import Proyecto from "./screens/07-proyecto.mdx";
import Reflexion from "./screens/08-reflexion.mdx";

const content: ModuleContent = {
  meta: getModuleMeta("los-datos-son-todo")!,
  screens: [
    { meta: { kind: "hook", title: "Envenena tu modelo" }, Component: Hook },
    { meta: { kind: "reveal", title: "Basura entra, basura sale" }, Component: Reveal },
    { meta: { kind: "build", title: "Arregla el sensor" }, Component: ArreglaSensor },
    { meta: { kind: "build", title: "El punto que no encaja" }, Component: PuntoRaro },
    { meta: { kind: "build", title: "¿A quién le preguntaste?" }, Component: AQuienPreguntaste },
    { meta: { kind: "break", title: "El hueco invisible" }, Component: HuecoInvisible },
    { meta: { kind: "project", title: "Limpia el dataset" }, Component: Proyecto },
    { meta: { kind: "reflection", title: "En tus palabras" }, Component: Reflexion },
  ],
};

export default content;
