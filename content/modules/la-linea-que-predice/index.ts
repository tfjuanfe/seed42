import type { ModuleContent } from "../registry";
import { getModuleMeta } from "../registry";
import Hook from "./screens/01-hook.mdx";
import ElError from "./screens/02-el-error.mdx";
import Record from "./screens/03-record.mdx";
import Predice from "./screens/04-predice.mdx";
import Pendiente from "./screens/05-pendiente.mdx";
import Rompela from "./screens/06-rompela.mdx";
import Proyecto from "./screens/07-proyecto.mdx";
import Reflexion from "./screens/08-reflexion.mdx";

const content: ModuleContent = {
  meta: getModuleMeta("la-linea-que-predice")!,
  screens: [
    { meta: { kind: "hook", title: "Acomoda la línea" }, Component: Hook },
    { meta: { kind: "reveal", title: "El error se mide" }, Component: ElError },
    { meta: { kind: "build", title: "Rompe tu récord" }, Component: Record },
    { meta: { kind: "build", title: "La línea que predice" }, Component: Predice },
    { meta: { kind: "build", title: "Qué dice la pendiente" }, Component: Pendiente },
    { meta: { kind: "break", title: "Fuera de rango" }, Component: Rompela },
    { meta: { kind: "project", title: "Tú contra Legendre" }, Component: Proyecto },
    { meta: { kind: "reflection", title: "En tus palabras" }, Component: Reflexion },
  ],
};

export default content;
