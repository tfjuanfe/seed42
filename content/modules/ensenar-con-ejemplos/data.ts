import type { Example } from "@/lib/text-model";

// Comment-moderation dataset: "chévere" vs "grosero", school flavor.
// Mild on purpose — the lesson is the mechanism, not shock value.

export const commentCategories = [
  { id: "chevere", label: "Chévere" },
  { id: "grosero", label: "Grosero" },
];

// Screen 1 — hook: ten comments to label from scratch.
export const hookItems = [
  { id: "h1", text: "Brutal, me encantó tu video" },
  { id: "h2", text: "Qué fastidio verte otra vez aquí" },
  { id: "h3", text: "Gracias por explicar tan bien" },
  { id: "h4", text: "Nadie te preguntó, aburres" },
  { id: "h5", text: "Quedó increíble, felicitaciones" },
  { id: "h6", text: "Deja de subir estas bobadas" },
  { id: "h7", text: "Me ayudó mucho para el examen, gracias" },
  { id: "h8", text: "Qué video tan malo, perdí mi tiempo" },
  { id: "h9", text: "Eres muy crack, sigue así" },
  { id: "h10", text: "Mejor dedícate a otra cosa" },
];

// Hidden exam for the hook: same register as the training comments.
export const hookTest: Example[] = [
  { text: "Me encantó la explicación, gracias", label: "chevere" },
  { text: "Qué aburrido este video", label: "grosero" },
  { text: "Felicitaciones, quedó muy bien", label: "chevere" },
  { text: "Perdí mi tiempo viendo esto", label: "grosero" },
  { text: "Muy crack, me ayudó mucho", label: "chevere" },
  { text: "Deja de aburrir con bobadas", label: "grosero" },
  { text: "Increíble video, sigue así", label: "chevere" },
  { text: "Qué fastidio, muy malo", label: "grosero" },
];

// Screen 4 — the "hard examples" round: borderline phrasing.
export const hardItems = [
  { id: "d1", text: "Jajaja no puedo creer que subiste esto" },
  { id: "d2", text: "No era lo que esperaba, pero gracias" },
  { id: "d3", text: "Uy no, qué es esto por dios" },
  { id: "d4", text: "Le faltó, pero vas mejorando" },
  { id: "d5", text: "Wow… qué valiente al publicarlo" },
  { id: "d6", text: "No me gustó, aunque se nota el esfuerzo" },
];

export const hardTest: Example[] = [
  ...hookTest,
  { text: "Jajaja qué es esto, no puedo", label: "grosero" },
  { text: "No era mi estilo pero gracias por el esfuerzo", label: "chevere" },
  { text: "Uy no, qué valiente", label: "grosero" },
  { text: "Le faltó un poco pero vas bien", label: "chevere" },
];

// Screens 5–6 — a solid "textbook" training set (what a diligent
// student would have built by now).
export const fullTrainSet: Example[] = [
  { text: "Brutal, me encantó tu video", label: "chevere" },
  { text: "Gracias por explicar tan bien", label: "chevere" },
  { text: "Quedó increíble, felicitaciones", label: "chevere" },
  { text: "Me ayudó mucho para el examen, gracias", label: "chevere" },
  { text: "Eres muy crack, sigue así", label: "chevere" },
  { text: "Muy buena la edición, se nota el esfuerzo", label: "chevere" },
  { text: "Excelente contenido, aprendí mucho", label: "chevere" },
  { text: "Qué fastidio verte otra vez aquí", label: "grosero" },
  { text: "Nadie te preguntó, aburres", label: "grosero" },
  { text: "Deja de subir estas bobadas", label: "grosero" },
  { text: "Qué video tan malo, perdí mi tiempo", label: "grosero" },
  { text: "Mejor dedícate a otra cosa", label: "grosero" },
  { text: "Aburres con lo mismo siempre", label: "grosero" },
  { text: "Qué contenido tan mediocre", label: "grosero" },
];

// Screen 6 — surprise exam: the Spanish teenagers actually write.
export const slangExam: Example[] = [
  { text: "uy parce esto quedó una chimba 🔥", label: "chevere" },
  { text: "jajaja qué oso este video, bájalo", label: "grosero" },
  { text: "re piola la explicación, gracias profe", label: "chevere" },
  { text: "hpta qué videíto tan regular", label: "grosero" },
  { text: "melo, me sirvió full para el parcial", label: "chevere" },
  { text: "qué chanda de contenido, de verdad", label: "grosero" },
];

// Screen 7 — project: 20 items to label. The mix under-represents
// sarcasm and slang on purpose; the report exposes it.
export const projectItems = [
  { id: "p1", text: "Muy buen video, gracias por subirlo" },
  { id: "p2", text: "Qué pereza este canal" },
  { id: "p3", text: "Excelente explicación, me salvaste" },
  { id: "p4", text: "No sirves para esto, en serio" },
  { id: "p5", text: "Felicitaciones, muy claro todo" },
  { id: "p6", text: "Qué contenido tan flojo" },
  { id: "p7", text: "Gracias, entendí por fin" },
  { id: "p8", text: "Aburridísimo, casi me duermo" },
  { id: "p9", text: "Increíble, lo compartí con mi curso" },
  { id: "p10", text: "Pésimo audio, pésimo todo" },
  { id: "p11", text: "Me gustó mucho el ejemplo del final" },
  { id: "p12", text: "Otra bobada más de este canal" },
  { id: "p13", text: "Buenísimo, quiero la parte dos" },
  { id: "p14", text: "Qué desperdicio de internet" },
  { id: "p15", text: "Se nota que estudiaste, gracias" },
  { id: "p16", text: "Uy parce, qué chimba quedó esto 🔥" },
  { id: "p17", text: "jajaja qué oso, bájalo ya" },
  { id: "p18", text: "No era lo que esperaba, pero gracias igual" },
  { id: "p19", text: "Wow, qué valiente al subir esto…" },
  { id: "p20", text: "melo, me sirvió para el parcial" },
];

export const projectGroups = [
  { id: "manual", label: "Comentarios «de manual»" },
  { id: "jerga", label: "Jerga y sarcasmo" },
];

export const projectTest = [
  { text: "Muy buena explicación, gracias", label: "chevere", group: "manual" },
  { text: "Qué video tan aburrido", label: "grosero", group: "manual" },
  { text: "Felicitaciones, excelente contenido", label: "chevere", group: "manual" },
  { text: "Pésimo, perdí el tiempo", label: "grosero", group: "manual" },
  { text: "Me ayudó full, gracias", label: "chevere", group: "manual" },
  { text: "Qué flojera de canal", label: "grosero", group: "manual" },
  { text: "una chimba tu video parce", label: "chevere", group: "jerga" },
  { text: "jajaja no, qué oso esto", label: "grosero", group: "jerga" },
  { text: "re melo, me sirvió", label: "chevere", group: "jerga" },
  { text: "uy… qué valiente al publicarlo", label: "grosero", group: "jerga" },
  { text: "qué chanda, de verdad", label: "grosero", group: "jerga" },
  { text: "piola la explicación parce", label: "chevere", group: "jerga" },
];
