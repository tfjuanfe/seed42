import type {
  LabelingCategory,
  LabelingItem,
} from "@/components/interactives/labeling-task";

export const iaCategories: LabelingCategory[] = [
  { id: "ia", label: "Aprendió de datos" },
  { id: "no-ia", label: "Sigue reglas fijas" },
];

// Screen 5 — detective mode: AI in Colombian daily life.
export const colombiaItems: LabelingItem[] = [
  {
    id: "rappi",
    text: "Rappi te dice que tu pedido llega en 25 minutos",
    answer: "ia",
    explain: "Predice con datos de miles de pedidos: clima, hora, distancia, restaurante",
  },
  {
    id: "nequi",
    text: "Nequi te bloquea una compra rara a las 3 a. m.",
    answer: "ia",
    explain: "Un modelo aprendió cómo gastas tú, y esa compra no encajaba en tu patrón",
  },
  {
    id: "pico",
    text: "El pico y placa decide si tu carro circula hoy",
    answer: "no-ia",
    explain: "Decide, pero con una regla fija por número de placa. Decidir no es aprender",
  },
  {
    id: "wpp",
    text: "WhatsApp te sugiere stickers mientras escribes",
    answer: "ia",
    explain: "Relaciona tu texto con los stickers que millones de personas eligieron antes",
  },
];

// Screen 7 — project: audit 10 systems, no feedback, defend in writing.
export const projectItems: LabelingItem[] = [
  { id: "pr1", text: "El traductor de Google", answer: "ia" },
  { id: "pr2", text: "Un cajero automático entregando billetes", answer: "no-ia" },
  { id: "pr3", text: "La cámara que enfoca caras automáticamente", answer: "ia" },
  { id: "pr4", text: "El timbre del colegio que suena a las 6:30", answer: "no-ia" },
  { id: "pr5", text: "Shazam reconociendo una canción", answer: "ia" },
  { id: "pr6", text: "Un microondas calentando 30 segundos", answer: "no-ia" },
  { id: "pr7", text: "Netflix sugiriéndote una serie", answer: "ia" },
  { id: "pr8", text: "El corrector que subraya palabras fuera del diccionario", answer: "no-ia" },
  { id: "pr9", text: "Una cuenta que convierte tu voz en subtítulos", answer: "ia" },
  { id: "pr10", text: "La alarma de tu celular a las 5 a. m.", answer: "no-ia" },
];
