import type {
  LabelingCategory,
  LabelingItem,
} from "@/components/interactives/labeling-task";

export const iaCategories: LabelingCategory[] = [
  { id: "ia", label: "Usa IA" },
  { id: "no-ia", label: "No usa IA" },
];

// Screen 1 — hook: things the student touches every week.
export const hookItems: LabelingItem[] = [
  {
    id: "spam",
    text: "El filtro que manda correos a la carpeta de spam",
    answer: "ia",
    explain: "Aprendió de millones de correos marcados como spam por personas",
  },
  {
    id: "calc",
    text: "Una calculadora",
    answer: "no-ia",
    explain: "Sigue reglas exactas escritas por alguien; nunca aprende nada nuevo",
  },
  {
    id: "tiktok",
    text: "El «Para ti» de TikTok",
    answer: "ia",
    explain: "Aprende de cada video que ves, repites o saltas",
  },
  {
    id: "teclado",
    text: "El teclado que sugiere tu siguiente palabra",
    answer: "ia",
    explain: "Aprendió patrones de texto, incluidos los tuyos",
  },
  {
    id: "semaforo",
    text: "Un semáforo de tiempo fijo",
    answer: "no-ia",
    explain: "Cambia cada tantos segundos, haya trancón o no",
  },
  {
    id: "maps",
    text: "El mapa que recalcula tu ruta cuando hay trancón",
    answer: "ia",
    explain: "Predice el tráfico con datos de millones de teléfonos",
  },
];

// Screen 3 — build: can a fixed rule solve it?
export const ruleCategories: LabelingCategory[] = [
  { id: "regla", label: "Alcanza con reglas" },
  { id: "ejemplos", label: "Necesita ejemplos" },
];

export const ruleItems: LabelingItem[] = [
  {
    id: "iva",
    text: "Calcular el IVA de una compra",
    answer: "regla",
    explain: "Multiplicar por 0.19 es una regla exacta; no hay nada que aprender",
  },
  {
    id: "gato",
    text: "Reconocer un gato en una foto",
    answer: "ejemplos",
    explain: "Nadie puede escribir reglas para todas las poses, luces y gatos posibles",
  },
  {
    id: "mayus",
    text: "Poner mayúscula después de un punto",
    answer: "regla",
    explain: "Una regla de dos líneas lo resuelve desde hace décadas",
  },
  {
    id: "voz",
    text: "Entender lo que dices con ruido de fondo",
    answer: "ejemplos",
    explain: "Cada voz y cada ruido son distintos: solo funciona aprendiendo de miles de ejemplos",
  },
];

// Screen 4 — build: learning from examples (spot the pattern).
export const patternCategories: LabelingCategory[] = [
  { id: "spam", label: "Es spam" },
  { id: "normal", label: "Es normal" },
];

export const patternItems: LabelingItem[] = [
  {
    id: "p1",
    text: "«GANASTE UN IPHONE!! reclama YA con tu clave»",
    answer: "spam",
    explain: "Mayúsculas, urgencia y pedir claves: el patrón completo",
  },
  {
    id: "p2",
    text: "«Profe, ¿la tarea es para el viernes?»",
    answer: "normal",
    explain: "Nada de premios, nada de urgencia, nada de claves",
  },
  {
    id: "p3",
    text: "«ÚLTIMA OPORTUNIDAD: tu premio expira HOY»",
    answer: "spam",
    explain: "Detectaste el patrón sin que nadie te diera la regla — eso hace un modelo",
  },
];

// Screen 5 — build: AI around you, Colombian edition.
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
    explain: "Un modelo aprendió cómo gastas tú, y esa compra no encajaba",
  },
  {
    id: "pico",
    text: "El pico y placa de tu ciudad",
    answer: "no-ia",
    explain: "Es una regla fija por número de placa; no aprende del tráfico",
  },
  {
    id: "wpp",
    text: "Los stickers que WhatsApp te sugiere al escribir",
    answer: "ia",
    explain: "Relaciona tu texto con stickers que millones eligieron antes",
  },
];

// Screen 6 — break it: cases where the boundary blurs on purpose.
export const breakItems: LabelingItem[] = [
  {
    id: "semaforo-adaptativo",
    text: "Un semáforo que se adapta al tráfico con cámaras",
    answer: null,
    explain: "Si solo cuenta carros y aplica umbrales, son reglas. Si aprendió patrones de tráfico, es IA. La caja por fuera no te lo dice",
  },
  {
    id: "ajedrez",
    text: "Un programa de ajedrez de los años 90",
    answer: null,
    explain: "Calculaba millones de jugadas con reglas escritas a mano. Parecía inteligente sin aprender nada",
  },
  {
    id: "dron",
    text: "Un dron que sigue una ruta GPS",
    answer: null,
    explain: "Seguir coordenadas es una regla. Esquivar un árbol que nunca vio, eso sí necesita aprendizaje",
  },
];

// Screen 7 — project: 10 items, no feedback, defend the criterion.
export const projectItems: LabelingItem[] = [
  { id: "pr1", text: "El traductor de Google", answer: "ia" },
  { id: "pr2", text: "Un cajero automático entregando billetes", answer: "no-ia" },
  { id: "pr3", text: "La cámara que enfoca caras automáticamente", answer: "ia" },
  { id: "pr4", text: "El timbre del colegio que suena a las 6:30", answer: "no-ia" },
  { id: "pr5", text: "Shazam reconociendo una canción", answer: "ia" },
  { id: "pr6", text: "Un microondas calentando 30 segundos", answer: "no-ia" },
  { id: "pr7", text: "Netflix sugiriéndote una serie", answer: "ia" },
  { id: "pr8", text: "El corrector rojo de ortografía del colegio (diccionario)", answer: "no-ia" },
  { id: "pr9", text: "Una cuenta que convierte tu voz en subtítulos", answer: "ia" },
  { id: "pr10", text: "La alarma de tu celular a las 5 a. m.", answer: "no-ia" },
];
