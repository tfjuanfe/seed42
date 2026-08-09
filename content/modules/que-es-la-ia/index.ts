import type { ModuleContent } from "../registry";
import { getModuleMeta } from "../registry";
import Bienvenida from "./screens/01-bienvenida.mdx";
import Hype from "./screens/02-hype.mdx";
import TuPrimerModelo from "./screens/03-tu-primer-modelo.mdx";
import ComoAprendio from "./screens/04-como-aprendio.mdx";
import DondeYaVive from "./screens/05-donde-ya-vive.mdx";
import Rompelo from "./screens/06-rompelo.mdx";
import Proyecto from "./screens/07-proyecto.mdx";
import Reflexion from "./screens/08-reflexion.mdx";

const content: ModuleContent = {
  meta: getModuleMeta("que-es-la-ia")!,
  screens: [
    { meta: { kind: "hook", title: "Bienvenido a Seed42" }, Component: Bienvenida },
    { meta: { kind: "build", title: "Más allá del hype" }, Component: Hype },
    { meta: { kind: "build", title: "Tu primer modelo" }, Component: TuPrimerModelo },
    { meta: { kind: "reveal", title: "¿Cómo aprendió?" }, Component: ComoAprendio },
    { meta: { kind: "build", title: "Modo detective" }, Component: DondeYaVive },
    { meta: { kind: "break", title: "Encuentra el punto ciego" }, Component: Rompelo },
    { meta: { kind: "project", title: "Tu primera auditoría" }, Component: Proyecto },
    { meta: { kind: "reflection", title: "En tus palabras" }, Component: Reflexion },
  ],
};

export default content;
