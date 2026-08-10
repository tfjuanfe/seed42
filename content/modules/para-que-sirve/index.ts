import type { ModuleContent } from "../registry";
import { getModuleMeta } from "../registry";
import Hook from "./screens/01-hook.mdx";
import CuatroTrabajos from "./screens/02-cuatro-trabajos.mdx";
import Predecir from "./screens/03-predecir.mdx";
import Clasificar from "./screens/04-clasificar.mdx";
import Recomendar from "./screens/05-recomendar.mdx";
import Burbuja from "./screens/06-burbuja.mdx";
import Proyecto from "./screens/07-proyecto.mdx";
import Reflexion from "./screens/08-reflexion.mdx";

const content: ModuleContent = {
  meta: getModuleMeta("para-que-sirve")!,
  screens: [
    { meta: { kind: "hook", title: "El truco más famoso" }, Component: Hook },
    { meta: { kind: "reveal", title: "Cuatro trabajos, nada más" }, Component: CuatroTrabajos },
    { meta: { kind: "build", title: "Predecir el bus" }, Component: Predecir },
    { meta: { kind: "build", title: "Cazar estafas" }, Component: Clasificar },
    { meta: { kind: "build", title: "El DJ que te conoce" }, Component: Recomendar },
    { meta: { kind: "break", title: "La burbuja" }, Component: Burbuja },
    { meta: { kind: "project", title: "Desarma una IA" }, Component: Proyecto },
    { meta: { kind: "reflection", title: "En tus palabras" }, Component: Reflexion },
  ],
};

export default content;
