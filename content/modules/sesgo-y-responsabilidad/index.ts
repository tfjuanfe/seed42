import type { ModuleContent } from "../registry";
import { getModuleMeta } from "../registry";
import Hook from "./screens/01-hook.mdx";
import Reveal from "./screens/02-reveal.mdx";
import VariableCulpable from "./screens/03-la-variable-culpable.mdx";
import Proxies from "./screens/04-proxies.mdx";
import QueEsJusto from "./screens/05-que-es-justo.mdx";
import ALaBrava from "./screens/06-a-la-brava.mdx";
import Proyecto from "./screens/07-proyecto.mdx";
import Reflexion from "./screens/08-reflexion.mdx";

const content: ModuleContent = {
  meta: getModuleMeta("sesgo-y-responsabilidad")!,
  screens: [
    { meta: { kind: "hook", title: "El modelo becario" }, Component: Hook },
    { meta: { kind: "reveal", title: "Obediente, no malvado" }, Component: Reveal },
    { meta: { kind: "build", title: "Quítale la variable" }, Component: VariableCulpable },
    { meta: { kind: "build", title: "Los espejos del estrato" }, Component: Proxies },
    { meta: { kind: "build", title: "¿Qué es «justo»?" }, Component: QueEsJusto },
    { meta: { kind: "break", title: "Igualdad a la brava" }, Component: ALaBrava },
    { meta: { kind: "project", title: "El informe de auditoría" }, Component: Proyecto },
    { meta: { kind: "reflection", title: "En tus palabras" }, Component: Reflexion },
  ],
};

export default content;
