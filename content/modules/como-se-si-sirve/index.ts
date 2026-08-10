import type { ModuleContent } from "../registry";
import { getModuleMeta } from "../registry";
import Hook from "./screens/01-hook.mdx";
import Reveal from "./screens/02-reveal.mdx";
import Umbral from "./screens/03-umbral.mdx";
import QueErrorDuele from "./screens/04-que-error-duele.mdx";
import Factura from "./screens/05-factura.mdx";
import CambiaElPueblo from "./screens/06-cambia-el-pueblo.mdx";
import Proyecto from "./screens/07-proyecto.mdx";
import Reflexion from "./screens/08-reflexion.mdx";

const content: ModuleContent = {
  meta: getModuleMeta("como-se-si-sirve")!,
  screens: [
    { meta: { kind: "hook", title: "El detector estrella" }, Component: Hook },
    { meta: { kind: "reveal", title: "Las cuatro cajas" }, Component: Reveal },
    { meta: { kind: "build", title: "Tú controlas el umbral" }, Component: Umbral },
    { meta: { kind: "build", title: "¿Qué error duele más?" }, Component: QueErrorDuele },
    { meta: { kind: "build", title: "La factura de los errores" }, Component: Factura },
    { meta: { kind: "break", title: "El modelo cambia de pueblo" }, Component: CambiaElPueblo },
    { meta: { kind: "project", title: "Dos modelos, un veredicto" }, Component: Proyecto },
    { meta: { kind: "reflection", title: "En tus palabras" }, Component: Reflexion },
  ],
};

export default content;
