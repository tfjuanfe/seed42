"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  accuracyOf,
  createNet,
  makeBlobs,
  makeRing,
  makeSpiral,
  predict,
  step,
  type Dataset,
  type Net,
} from "@/lib/neural-net";
import { Slider } from "./slider";

// The TensorFlow-playground moment, Seed42-sized: a real net training
// live on canvas, with the architecture under the student's thumbs.

const DATA: Record<string, () => Dataset> = {
  blobs: makeBlobs,
  ring: makeRing,
  spiral: makeSpiral,
};

const GRID = 46; // boundary resolution
const CANVAS = 300;

interface Props {
  dataset: "blobs" | "ring" | "spiral";
  initialHidden?: number[]; // [] = single neuron (logistic regression)
  editable?: boolean;
  lrSlider?: boolean;
  showLoss?: boolean;
  // Overfit demo: train on a tiny slice, reveal held-out points.
  overfit?: boolean;
  onAccuracy?: (acc: number) => void;
}

export function NetworkLab({
  dataset,
  initialHidden = [],
  editable = false,
  lrSlider = false,
  showLoss = false,
  overfit = false,
  onAccuracy,
}: Props) {
  const dataRef = useRef<Dataset>(null!);
  if (dataRef.current === null) dataRef.current = DATA[dataset]();
  const data = dataRef.current;

  // Overfit mode trains on 14 points; the rest are the hidden test.
  const trainX = overfit ? data.X.slice(0, 14) : data.X;
  const trainY = overfit ? data.y.slice(0, 14) : data.y;
  const testX = overfit ? data.X.slice(14) : [];
  const testY = overfit ? data.y.slice(14) : [];

  const [hidden, setHidden] = useState<number[]>(initialHidden);
  const [lr, setLr] = useState(30); // /10 → 3.0
  const [running, setRunning] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState<number | null>(null);
  const [acc, setAcc] = useState(0);
  const [testAcc, setTestAcc] = useState<number | null>(null);
  const [showTest, setShowTest] = useState(false);

  const netRef = useRef<Net>(null!);
  if (netRef.current === null) netRef.current = createNet(initialHidden);
  const lossHist = useRef<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const css = getComputedStyle(document.documentElement);
    const accent = css.getPropertyValue("--accent").trim() || "#7F77DD";
    const fail = css.getPropertyValue("--fail").trim() || "#ED93B1";
    const panel = css.getPropertyValue("--panel").trim() || "#16161D";

    ctx.fillStyle = panel;
    ctx.fillRect(0, 0, CANVAS, CANVAS);

    // Decision regions
    const cell = CANVAS / GRID;
    for (let gy = 0; gy < GRID; gy++) {
      for (let gx = 0; gx < GRID; gx++) {
        const x = (gx / (GRID - 1)) * 2 - 1;
        const y = 1 - (gy / (GRID - 1)) * 2;
        const p = predict(netRef.current, [x, y]);
        ctx.globalAlpha = Math.min(Math.abs(p - 0.5) * 0.55 + 0.04, 0.32);
        ctx.fillStyle = p >= 0.5 ? accent : fail;
        ctx.fillRect(gx * cell, gy * cell, cell + 1, cell + 1);
      }
    }
    ctx.globalAlpha = 1;

    // Points
    const drawPt = (px: number[], label: number, hollow: boolean) => {
      const cx = ((px[0] + 1) / 2) * CANVAS;
      const cy = ((1 - px[1]) / 2) * CANVAS;
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      if (hollow) {
        ctx.strokeStyle = label === 1 ? accent : fail;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = label === 1 ? accent : fail;
        ctx.fill();
      }
    };
    trainX.forEach((p, i) => drawPt(p, trainY[i], false));
    if (showTest) testX.forEach((p, i) => drawPt(p, testY[i], true));
  }, [trainX, trainY, testX, testY, showTest]);

  // Training loop
  useEffect(() => {
    if (!running) return;
    let frames = 0;
    const loop = () => {
      let l = 0;
      for (let i = 0; i < 14; i++) {
        l = step(netRef.current, trainX, trainY, lr / 10);
      }
      frames++;
      setEpoch((e) => e + 14);
      setLoss(l);
      lossHist.current.push(l);
      if (lossHist.current.length > 120) lossHist.current.shift();
      const a = accuracyOf(netRef.current, trainX, trainY);
      setAcc(a);
      onAccuracy?.(a);
      if (overfit) setTestAcc(accuracyOf(netRef.current, testX, testY));
      if (frames % 2 === 0) draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, lr, draw, trainX, trainY, testX, testY, overfit, onAccuracy]);

  useEffect(() => {
    draw();
  }, [draw, hidden]);

  function reset(newHidden?: number[]) {
    const h = newHidden ?? hidden;
    netRef.current = createNet(h);
    lossHist.current = [];
    setEpoch(0);
    setLoss(null);
    setAcc(0);
    setTestAcc(null);
    draw();
  }

  function changeLayer(idx: number, delta: number) {
    const h = [...hidden];
    h[idx] += delta;
    if (h[idx] <= 0) h.splice(idx, 1);
    if (h[idx] > 8) h[idx] = 8;
    setHidden(h);
    reset(h);
  }

  function addLayer() {
    if (hidden.length >= 2) return;
    const h = [...hidden, 4];
    setHidden(h);
    reset(h);
  }

  const lossPts = lossHist.current
    .map((l, i) => `${(i / 119) * 300},${40 - Math.min(l, 0.8) * 48}`)
    .join(" ");

  return (
    <div className="rounded-[var(--radius-card)] bg-panel border-hairline border p-5 flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <span className="text-label text-muted font-mono">
          arquitectura: 2 → {hidden.length ? hidden.join(" → ") + " → " : ""}1
        </span>
        <span className="text-label font-mono">
          <span className="text-muted">precisión </span>
          <span className={acc >= 0.95 ? "text-success" : "text-accent"}>
            {Math.round(acc * 100)} %
          </span>
          {testAcc !== null && showTest && (
            <>
              <span className="text-muted"> · datos nuevos </span>
              <span className={testAcc < 0.8 ? "text-fail" : "text-success"}>
                {Math.round(testAcc * 100)} %
              </span>
            </>
          )}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS}
        height={CANVAS}
        className="w-full h-auto rounded-[var(--radius-control)] border-hairline border"
        role="img"
        aria-label="Frontera de decisión de la red neuronal sobre los datos"
      />

      {showLoss && lossHist.current.length > 1 && (
        <svg viewBox="0 0 300 44" className="w-full h-auto" aria-hidden="true">
          <polyline points={lossPts} fill="none" stroke="var(--warn)" strokeWidth="1.5" />
          <text x="2" y="10" fontSize="8" className="font-mono" fill="var(--muted)">
            error (loss) bajando = la red aprendiendo
          </text>
        </svg>
      )}

      {editable && (
        <div className="flex flex-wrap items-center gap-2">
          {hidden.map((n, i) => (
            <span
              key={i}
              className="flex items-center gap-1 rounded-[var(--radius-control)] bg-sub border-hairline border px-2 py-1"
            >
              <button
                type="button"
                onClick={() => changeLayer(i, -1)}
                aria-label={`Quitar neurona de la capa ${i + 1}`}
                className="w-9 h-9 rounded-[6px] text-accent hover:bg-panel font-medium"
              >
                −
              </button>
              <span className="text-label font-mono w-16 text-center">
                capa {i + 1}: {n}
              </span>
              <button
                type="button"
                onClick={() => changeLayer(i, 1)}
                aria-label={`Agregar neurona a la capa ${i + 1}`}
                className="w-9 h-9 rounded-[6px] text-accent hover:bg-panel font-medium"
              >
                +
              </button>
            </span>
          ))}
          {hidden.length < 2 && (
            <button
              type="button"
              onClick={addLayer}
              className="min-h-11 px-4 rounded-[var(--radius-control)] border-hairline border border-[var(--accent)] text-accent hover:bg-sub transition-colors font-medium"
            >
              + capa oculta
            </button>
          )}
        </div>
      )}

      {lrSlider && (
        <Slider
          label="Velocidad de aprendizaje"
          min={1}
          max={120}
          value={lr}
          onChange={(v) => setLr(v)}
          display={(lr / 10).toFixed(1)}
        />
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setRunning(!running)}
          className="h-11 px-5 rounded-[var(--radius-control)] bg-accent text-[#0D0D12] font-medium transition-colors hover:bg-accent-hover"
        >
          {running ? "Pausar" : epoch === 0 ? "Entrenar" : "Seguir entrenando"}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            reset();
          }}
          className="h-11 px-4 rounded-[var(--radius-control)] border-hairline border text-muted hover:text-text transition-colors"
        >
          Reiniciar
        </button>
        {overfit && (
          <button
            type="button"
            onClick={() => setShowTest(!showTest)}
            aria-pressed={showTest}
            className={`h-11 px-4 rounded-[var(--radius-control)] border-hairline border transition-colors ${
              showTest ? "border-[var(--fail)] text-fail" : "text-muted hover:text-text"
            }`}
          >
            {showTest ? "Ocultar datos nuevos" : "Mostrar datos nuevos"}
          </button>
        )}
        <span className="text-label text-muted font-mono self-center ml-auto">
          pasos: {epoch}
          {loss !== null && ` · loss ${loss.toFixed(3)}`}
        </span>
      </div>
    </div>
  );
}
