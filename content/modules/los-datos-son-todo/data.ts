import type { ScatterPoint } from "@/components/interactives/scatter-plot";
import type { TableRow } from "@/components/interactives/data-table";

// Screen 4 — outlier hunt: apartment rentals, area vs price (COP M).
// Eleven points on a believable trend + one with an extra zero.
export const arriendoPoints: ScatterPoint[] = [
  { id: "a1", x: 32, y: 0.9 },
  { id: "a2", x: 38, y: 1.05 },
  { id: "a3", x: 45, y: 1.3 },
  { id: "a4", x: 48, y: 1.25 },
  { id: "a5", x: 52, y: 1.5 },
  { id: "a6", x: 58, y: 1.65 },
  { id: "a7", x: 61, y: 1.8 },
  { id: "a8", x: 66, y: 1.9 },
  { id: "a9", x: 72, y: 2.2 },
  { id: "a10", x: 78, y: 2.35 },
  { id: "a11", x: 85, y: 2.6 },
  // 47 m² at 9.8M: someone typed an extra zero.
  { id: "outlier", x: 47, y: 9.8 },
];

// Screen 3 — warm-up table: one station, three obvious breaks.
export const miniColumns = ["estación", "fecha", "pm2.5 (µg/m³)"];
export const miniRows: TableRow[] = [
  {
    id: "m1",
    cells: [{ value: "Kennedy" }, { value: "2026-03-01" }, { value: "18" }],
  },
  {
    id: "m2",
    cells: [
      { value: "Kennedy" },
      { value: "2026-03-02" },
      {
        value: "",
        issue: {
          kind: "missing",
          suggestion: "17",
          explain:
            "El sensor no reportó ese día. Una opción honesta: usar el promedio de los días vecinos (18 y 16)",
        },
      },
    ],
  },
  {
    id: "m3",
    cells: [{ value: "Kennedy" }, { value: "2026-03-03" }, { value: "16" }],
  },
  {
    id: "m4",
    cells: [
      { value: "Kennedy" },
      { value: "2026-03-04" },
      {
        value: "999",
        issue: {
          kind: "outlier",
          suggestion: "19",
          explain:
            "999 es el código de error del sensor, no una medición. Ese día un vecino midió 19",
        },
      },
    ],
  },
  {
    id: "m5",
    cells: [
      { value: "Kennedy" },
      {
        value: "31/02/2026",
        issue: {
          kind: "format",
          suggestion: "2026-02-28",
          explain:
            "El 31 de febrero no existe. El registro original en papel dice 28 de febrero",
        },
      },
      { value: "21" },
    ],
  },
];

// Screen 7 — project: full week of air quality, six issues to judge.
export const projectColumns = ["estación", "fecha", "pm2.5 (µg/m³)", "humedad (%)"];
export const projectRows: TableRow[] = [
  {
    id: "p1",
    cells: [
      { value: "Centro" },
      { value: "2026-03-01" },
      { value: "22" },
      { value: "68" },
    ],
  },
  {
    id: "p2",
    cells: [
      { value: "Centro" },
      { value: "2026-03-02" },
      {
        value: "0.024",
        issue: {
          kind: "format",
          suggestion: "24",
          explain:
            "Este sensor reportó en mg/m³ en vez de µg/m³ — mil veces menos. 0.024 mg = 24 µg",
        },
      },
      { value: "70" },
    ],
  },
  {
    id: "p3",
    cells: [
      { value: "Centro" },
      { value: "2026-03-03" },
      { value: "26" },
      {
        value: "-12",
        issue: {
          kind: "outlier",
          suggestion: "62",
          explain:
            "Humedad negativa es físicamente imposible. La estación hermana a 2 km midió 62 %",
        },
      },
    ],
  },
  {
    id: "p4",
    cells: [
      { value: "Centro" },
      { value: "2026-03-04" },
      {
        value: "",
        issue: {
          kind: "missing",
          suggestion: "25",
          explain:
            "Sin dato. Los días vecinos midieron 26 y 24: interpolar da 25. Otra opción sería descartar la fila — hoy elegimos rellenar",
        },
      },
      { value: "71" },
    ],
  },
  {
    id: "p5",
    cells: [
      { value: "Centro" },
      { value: "2026-03-05" },
      { value: "24" },
      { value: "66" },
    ],
  },
  {
    id: "p6",
    cells: [
      { value: "Centro" },
      {
        value: "2026-03-05",
        issue: {
          kind: "duplicate",
          suggestion: "2026-03-06",
          explain:
            "Dos filas con la misma fecha y valores distintos. El cuaderno de campo confirma que esta era la del día 6",
        },
      },
      { value: "27" },
      { value: "72" },
    ],
  },
  {
    id: "p7",
    cells: [
      { value: "Centro" },
      { value: "2026-03-07" },
      {
        value: "240",
        issue: {
          kind: "outlier",
          suggestion: "24",
          explain:
            "Diez veces el valor típico y ese día no hubo incendios ni emergencias: huele a cero de más. Corregimos a 24",
        },
      },
      { value: "69" },
    ],
  },
  {
    id: "p8",
    cells: [
      { value: "Centro" },
      { value: "2026-03-08" },
      { value: "23" },
      {
        value: "",
        issue: {
          kind: "missing",
          suggestion: "67",
          explain: "Sin dato de humedad. El promedio de la semana es 67 %",
        },
      },
    ],
  },
];
