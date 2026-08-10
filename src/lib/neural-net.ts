// A real multilayer perceptron with backprop, small enough to train
// live in the browser: 2 inputs → hidden layers (tanh) → 1 sigmoid.
// Full-batch gradient descent; ~200 points × tiny net stays well under
// a frame budget.

export interface Net {
  sizes: number[];
  weights: number[][][]; // [layer][out][in]
  biases: number[][]; // [layer][out]
}

let seed = 7;
function rnd(): number {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

export function createNet(hidden: number[]): Net {
  const sizes = [2, ...hidden, 1];
  const weights: number[][][] = [];
  const biases: number[][] = [];
  for (let l = 0; l < sizes.length - 1; l++) {
    const w: number[][] = [];
    const b: number[] = [];
    for (let o = 0; o < sizes[l + 1]; o++) {
      const row: number[] = [];
      for (let i = 0; i < sizes[l]; i++) {
        row.push((rnd() * 2 - 1) * Math.sqrt(2 / sizes[l]));
      }
      w.push(row);
      b.push(0);
    }
    weights.push(w);
    biases.push(b);
  }
  return { sizes, weights, biases };
}

function forward(net: Net, x: number[]): { acts: number[][] } {
  const acts: number[][] = [x];
  let a = x;
  for (let l = 0; l < net.weights.length; l++) {
    const out: number[] = [];
    const last = l === net.weights.length - 1;
    for (let o = 0; o < net.weights[l].length; o++) {
      let z = net.biases[l][o];
      for (let i = 0; i < a.length; i++) z += net.weights[l][o][i] * a[i];
      out.push(last ? 1 / (1 + Math.exp(-z)) : Math.tanh(z));
    }
    acts.push(out);
    a = out;
  }
  return { acts };
}

export function predict(net: Net, x: number[]): number {
  const { acts } = forward(net, x);
  return acts[acts.length - 1][0];
}

// One full-batch gradient step; returns mean BCE loss.
export function step(net: Net, X: number[][], y: number[], lr: number): number {
  const gw = net.weights.map((l) => l.map((r) => r.map(() => 0)));
  const gb = net.biases.map((l) => l.map(() => 0));
  let loss = 0;

  for (let n = 0; n < X.length; n++) {
    const { acts } = forward(net, X[n]);
    const out = acts[acts.length - 1][0];
    const t = y[n];
    loss += -(t * Math.log(out + 1e-9) + (1 - t) * Math.log(1 - out + 1e-9));

    // delta at output (sigmoid + BCE simplifies to out - t)
    let delta = [out - t];
    for (let l = net.weights.length - 1; l >= 0; l--) {
      const aPrev = acts[l];
      for (let o = 0; o < net.weights[l].length; o++) {
        gb[l][o] += delta[o];
        for (let i = 0; i < aPrev.length; i++) {
          gw[l][o][i] += delta[o] * aPrev[i];
        }
      }
      if (l > 0) {
        const next: number[] = [];
        for (let i = 0; i < net.sizes[l]; i++) {
          let d = 0;
          for (let o = 0; o < net.weights[l].length; o++) {
            d += delta[o] * net.weights[l][o][i];
          }
          // tanh' = 1 - a²
          next.push(d * (1 - acts[l][i] ** 2));
        }
        delta = next;
      }
    }
  }

  const k = lr / X.length;
  for (let l = 0; l < net.weights.length; l++) {
    for (let o = 0; o < net.weights[l].length; o++) {
      net.biases[l][o] -= k * gb[l][o];
      for (let i = 0; i < net.weights[l][o].length; i++) {
        net.weights[l][o][i] -= k * gw[l][o][i];
      }
    }
  }
  return loss / X.length;
}

export function accuracyOf(net: Net, X: number[][], y: number[]): number {
  if (X.length === 0) return 0;
  let hits = 0;
  for (let i = 0; i < X.length; i++) {
    if ((predict(net, X[i]) >= 0.5 ? 1 : 0) === y[i]) hits++;
  }
  return hits / X.length;
}

// --- Datasets (coordinates in [-1, 1]²) ---

export interface Dataset {
  X: number[][];
  y: number[];
}

export function makeBlobs(n = 100): Dataset {
  seed = 11;
  const X: number[][] = [];
  const y: number[] = [];
  for (let i = 0; i < n; i++) {
    const c = i % 2;
    X.push([
      (c ? 0.45 : -0.45) + (rnd() - 0.5) * 0.7,
      (c ? 0.35 : -0.35) + (rnd() - 0.5) * 0.7,
    ]);
    y.push(c);
  }
  return { X, y };
}

export function makeRing(n = 120): Dataset {
  seed = 23;
  const X: number[][] = [];
  const y: number[] = [];
  for (let i = 0; i < n; i++) {
    const inner = i % 2 === 0;
    const r = inner ? rnd() * 0.32 : 0.55 + rnd() * 0.3;
    const a = rnd() * Math.PI * 2;
    X.push([r * Math.cos(a), r * Math.sin(a)]);
    y.push(inner ? 1 : 0);
  }
  return { X, y };
}

export function makeSpiral(n = 140): Dataset {
  seed = 31;
  const X: number[][] = [];
  const y: number[] = [];
  for (let i = 0; i < n; i++) {
    const c = i % 2;
    const t = (i / n) * 3.2 * Math.PI;
    const r = 0.06 + (t / (3.2 * Math.PI)) * 0.85;
    const a = t + c * Math.PI;
    X.push([
      r * Math.cos(a) + (rnd() - 0.5) * 0.08,
      r * Math.sin(a) + (rnd() - 0.5) * 0.08,
    ]);
    y.push(c);
  }
  return { X, y };
}
