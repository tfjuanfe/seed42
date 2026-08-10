// Tiny naive-Bayes text classifier, trained in the browser on the
// student's own labels. Small enough to inspect, fast enough for 100ms.

export interface Example {
  text: string;
  label: string;
}

export interface TextModel {
  labels: string[];
  counts: Record<string, Record<string, number>>;
  totals: Record<string, number>;
  docs: Record<string, number>;
  vocab: Set<string>;
}

export function tokenize(text: string): string[] {
  return (
    text
      .toLowerCase()
      .match(/[a-záéíóúñü]+|[\u{1F300}-\u{1FAFF}❤️]/gu) ?? []
  );
}

export function train(examples: Example[], labels: string[]): TextModel {
  const model: TextModel = {
    labels,
    counts: {},
    totals: {},
    docs: {},
    vocab: new Set(),
  };
  for (const l of labels) {
    model.counts[l] = {};
    model.totals[l] = 0;
    model.docs[l] = 0;
  }
  for (const ex of examples) {
    model.docs[ex.label] = (model.docs[ex.label] ?? 0) + 1;
    for (const t of tokenize(ex.text)) {
      model.counts[ex.label][t] = (model.counts[ex.label][t] ?? 0) + 1;
      model.totals[ex.label]++;
      model.vocab.add(t);
    }
  }
  return model;
}

export function predict(model: TextModel, text: string): string {
  const totalDocs = Object.values(model.docs).reduce((a, b) => a + b, 0) || 1;
  const V = model.vocab.size || 1;
  let best = model.labels[0];
  let bestScore = -Infinity;
  for (const l of model.labels) {
    // Laplace-smoothed log-likelihood + prior
    let score = Math.log((model.docs[l] + 1) / (totalDocs + model.labels.length));
    for (const t of tokenize(text)) {
      score += Math.log(((model.counts[l][t] ?? 0) + 1) / (model.totals[l] + V));
    }
    if (score > bestScore) {
      bestScore = score;
      best = l;
    }
  }
  return best;
}

export function accuracy(model: TextModel, tests: Example[]): number {
  if (tests.length === 0) return 0;
  const hits = tests.filter((t) => predict(model, t.text) === t.label).length;
  return hits / tests.length;
}

// Words that most pull toward `label` vs the other labels (log ratio).
export function topWords(
  model: TextModel,
  label: string,
  n: number,
): { word: string; weight: number }[] {
  const V = model.vocab.size || 1;
  const others = model.labels.filter((l) => l !== label);
  const out: { word: string; weight: number }[] = [];
  for (const word of model.vocab) {
    const pIn = ((model.counts[label][word] ?? 0) + 1) / (model.totals[label] + V);
    let pOut = 0;
    for (const o of others) {
      pOut += ((model.counts[o][word] ?? 0) + 1) / (model.totals[o] + V);
    }
    pOut /= others.length || 1;
    out.push({ word, weight: Math.log(pIn / pOut) });
  }
  return out
    .filter((w) => w.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n);
}
